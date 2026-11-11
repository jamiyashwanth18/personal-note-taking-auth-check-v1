import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const API = process.env.E2E_API_URL ?? "http://127.0.0.1:8000";

type Account = { email: string; password: string; token: string };
type ApiNote = { id: string; title: string; text: string; created_at: string; updated_at: string };

async function newAccount(request: APIRequestContext): Promise<Account> {
  const email = `priv-${crypto.randomUUID()}@example.com`;
  const password = `pw-${crypto.randomUUID()}`;
  const reg = await request.post(`${API}/auth/register`, { data: { email, password } });
  expect(reg.status()).toBe(201);
  const login = await request.post(`${API}/auth/login`, { data: { email, password } });
  expect(login.status()).toBe(200);
  const { token } = await login.json();
  return { email, password, token };
}

const bearer = (a: Account) => ({ Authorization: `Bearer ${a.token}` });

async function createNote(
  request: APIRequestContext,
  a: Account,
  title: string,
  text: string,
): Promise<ApiNote> {
  const r = await request.post(`${API}/notes`, { data: { title, text }, headers: bearer(a) });
  expect(r.status()).toBe(201);
  return r.json();
}

async function signIn(page: Page, a: Account) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(a.email);
  await page.getByLabel("Password").fill(a.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Notes", exact: true })).toBeVisible();
}

test.describe("Notes are private to their owner", () => {
  test("[AC-026] A's Notes list shows only A's notes", async ({ page, request }) => {
    const a = await newAccount(request);
    const b = await newAccount(request);
    const tag = crypto.randomUUID().slice(0, 8);
    await createNote(request, a, `A-note-${tag}`, "a text");
    await createNote(request, b, `B-note-${tag}`, "b text");
    await signIn(page, a);
    await expect(page.getByRole("button", { name: `A-note-${tag}` })).toBeVisible();
    await expect(page.getByRole("button", { name: `B-note-${tag}` })).toHaveCount(0);
    await expect(page.getByText(`B-note-${tag}`)).toHaveCount(0);
    await expect(page.getByText("b text")).toHaveCount(0);
    await expect(page.getByText("1 note", { exact: true })).toBeVisible();
  });

  test("[AC-026] the list API returns only the caller's notes", async ({ request }) => {
    const a = await newAccount(request);
    const b = await newAccount(request);
    const na = await createNote(request, a, "mine", "x");
    const nb = await createNote(request, b, "theirs", "y");
    const la = await (await request.get(`${API}/notes`, { headers: bearer(a) })).json();
    expect(la.map((n: ApiNote) => n.id)).toEqual([na.id]);
    const lb = await (await request.get(`${API}/notes`, { headers: bearer(b) })).json();
    expect(lb.map((n: ApiNote) => n.id)).toEqual([nb.id]);
  });

  test("[AC-027] B opening A's note by URL sees not-found and none of its content", async ({
    page,
    request,
  }) => {
    const a = await newAccount(request);
    const b = await newAccount(request);
    const secret = `secret-${crypto.randomUUID()}`;
    const note = await createNote(request, a, `title-${secret}`, `body-${secret}`);
    await signIn(page, b);
    await page.goto(`/notes/${note.id}`);
    await expect(page.getByRole("heading", { name: "Note not found" })).toBeVisible();
    await expect(page.getByText(secret)).toHaveCount(0);
    await expect(page.getByLabel("Title")).toHaveCount(0);
    expect(await page.content()).not.toContain(secret);
  });

  test("[AC-027] B's GET, PUT and DELETE on A's note are refused as 404 and change nothing", async ({
    request,
  }) => {
    const a = await newAccount(request);
    const b = await newAccount(request);
    const note = await createNote(request, a, "private-title", "private-body");
    const payload = { title: "hijacked", text: "hijacked" };

    const missing = await request.get(`${API}/notes/00000000-0000-0000-0000-0000000000aa`, {
      headers: bearer(b),
    });
    expect(missing.status()).toBe(404);

    const g = await request.get(`${API}/notes/${note.id}`, { headers: bearer(b) });
    expect(g.status()).toBe(404);
    expect(await g.text()).toBe(await missing.text());
    expect(await g.text()).not.toContain("private");

    const p = await request.put(`${API}/notes/${note.id}`, { data: payload, headers: bearer(b) });
    expect(p.status()).toBe(404);
    expect(await p.text()).not.toContain("private");

    const d = await request.delete(`${API}/notes/${note.id}`, { headers: bearer(b) });
    expect(d.status()).toBe(404);

    const mine = await request.get(`${API}/notes/${note.id}`, { headers: bearer(a) });
    expect(mine.status()).toBe(200);
    expect(await mine.json()).toEqual(note);
  });

  test("[AC-028] every notes endpoint rejects a request without sign-in as 401", async ({
    request,
  }) => {
    const a = await newAccount(request);
    const note = await createNote(request, a, "mine", "body");
    const data = { title: "x", text: "y" };
    const responses = [
      await request.get(`${API}/notes`),
      await request.post(`${API}/notes`, { data }),
      await request.get(`${API}/notes/${note.id}`),
      await request.put(`${API}/notes/${note.id}`, { data }),
      await request.delete(`${API}/notes/${note.id}`),
    ];
    expect(responses.map((r) => r.status())).toEqual([401, 401, 401, 401, 401]);
    for (const r of responses) expect(await r.text()).not.toContain("body");

    const bad = await request.get(`${API}/notes`, {
      headers: { Authorization: "Bearer not-a-real-token" },
    });
    expect(bad.status()).toBe(401);

    const still = await request.get(`${API}/notes/${note.id}`, { headers: bearer(a) });
    expect(await still.json()).toEqual(note);
  });

  test("[AC-028] a signed-out visitor opening the notes screen is sent to sign-in", async ({
    page,
  }) => {
    await page.goto("/notes");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("[AC-028] after signing out, the old token is rejected by the API", async ({
    page,
    request,
  }) => {
    const a = await newAccount(request);
    await createNote(request, a, "kept", "text");
    await signIn(page, a);
    const token = await page.evaluate(() => localStorage.getItem("session_token"));
    expect(token).toBeTruthy();
    await page.getByRole("button", { name: "Sign out" }).click();
    await expect(page).toHaveURL(/\/login/);
    const r = await request.get(`${API}/notes`, { headers: { Authorization: `Bearer ${token}` } });
    expect(r.status()).toBe(401);
  });
});
