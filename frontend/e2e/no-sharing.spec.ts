import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const API = process.env.E2E_API_URL ?? "http://127.0.0.1:8000";

type Account = { email: string; password: string; token: string };

async function newAccount(request: APIRequestContext): Promise<Account> {
  const email = `plain-${crypto.randomUUID()}@example.com`;
  const password = `pw-${crypto.randomUUID()}`;
  const reg = await request.post(`${API}/auth/register`, { data: { email, password } });
  expect(reg.status()).toBe(201);
  const login = await request.post(`${API}/auth/login`, { data: { email, password } });
  expect(login.status()).toBe(200);
  const { token } = await login.json();
  return { email, password, token };
}

const bearer = (a: Account) => ({ Authorization: `Bearer ${a.token}` });

async function signIn(page: Page, a: Account) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(a.email);
  await page.getByLabel("Password").fill(a.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Notes", exact: true })).toBeVisible();
}

const FORBIDDEN_UI = /share|sharing|collaborat|invite|\btags?\b|search|bold|italic|markdown|rich text/i;

test.describe("No sharing, tags, search or rich text", () => {
  test("[AC-029] Notes list offers no share, tag or search controls", async ({ page, request }) => {
    const a = await newAccount(request);
    const title = `plain-${crypto.randomUUID().slice(0, 8)}`;
    const r = await request.post(`${API}/notes`, {
      data: { title, text: "hello" },
      headers: bearer(a),
    });
    expect(r.status()).toBe(201);
    await signIn(page, a);
    await expect(page.getByRole("button", { name: title })).toBeVisible();
    await expect(page.getByRole("searchbox")).toHaveCount(0);
    await expect(page.getByPlaceholder(/search|filter/i)).toHaveCount(0);
    await expect(page.getByRole("button", { name: FORBIDDEN_UI })).toHaveCount(0);
    await expect(page.getByRole("link", { name: FORBIDDEN_UI })).toHaveCount(0);
    // Only the signed-in chrome texts: nothing mentions sharing, tags or search.
    const text = (await page.locator("body").innerText()).replace(title, "");
    expect(text).not.toMatch(FORBIDDEN_UI);
  });

  test("[AC-029] Note editor is a plain title and text form with no sharing, tag or format controls", async ({
    page,
    request,
  }) => {
    const a = await newAccount(request);
    await signIn(page, a);
    await page.getByRole("button", { name: "New note" }).click();
    await expect(page.getByLabel("Title")).toBeVisible();
    await expect(page.getByLabel("Text")).toBeVisible();
    // The only text-entry controls are the title input and the plain textarea.
    await expect(page.locator("form input:not([type=hidden])")).toHaveCount(1);
    await expect(page.locator("form textarea")).toHaveCount(1);
    await expect(page.locator("[contenteditable]")).toHaveCount(0);
    await expect(page.getByRole("toolbar")).toHaveCount(0);
    await expect(page.getByRole("button", { name: FORBIDDEN_UI })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /^(B|I|U)$/ })).toHaveCount(0);
    // The editor's own hint says "HTML or script tags are stored ... as typed": it states
    // the plain-text rule, so it is excluded from the scan.
    const text = (await page.locator("form").innerText()).replace(/Plain text only\.[^\n]*/, "");
    expect(text).toContain("Title");
    expect(text).not.toMatch(FORBIDDEN_UI);
  });

  test("[AC-029] formatting characters are saved and shown as plain text", async ({
    page,
    request,
  }) => {
    const a = await newAccount(request);
    await signIn(page, a);
    await page.getByRole("button", { name: "New note" }).click();
    const title = `fmt-${crypto.randomUUID().slice(0, 8)}`;
    const raw = "**bold** <b>tagged</b> # heading";
    await page.getByLabel("Title").fill(title);
    await page.getByLabel("Text").fill(raw);
    await page.getByRole("button", { name: "Save note" }).click();
    await expect(page.getByRole("status")).toContainText("Saved");
    const list = await (await request.get(`${API}/notes`, { headers: bearer(a) })).json();
    expect(list).toHaveLength(1);
    const note = await (
      await request.get(`${API}/notes/${list[0].id}`, { headers: bearer(a) })
    ).json();
    expect(note.text).toBe(raw);
    await page.goto(`/notes/${note.id}`);
    await expect(page.getByLabel("Text")).toHaveValue(raw);
    await expect(page.locator("b")).toHaveCount(0);
    await expect(page.locator("strong")).toHaveCount(0);
  });

  test("[AC-029] API exposes no share, tag, search or collaborator endpoints", async ({
    request,
  }) => {
    const a = await newAccount(request);
    const created = await request.post(`${API}/notes`, {
      data: { title: "mine", text: "t" },
      headers: bearer(a),
    });
    expect(created.status()).toBe(201);
    const id = (await created.json()).id;
    const calls: Array<[string, string]> = [
      ["get", "/notes/search"],
      ["get", "/search"],
      ["get", "/tags"],
      ["get", "/shared"],
      ["post", `/notes/${id}/share`],
      ["post", `/notes/${id}/tags`],
      ["post", `/notes/${id}/collaborators`],
    ];
    for (const [method, path] of calls) {
      const r = await request.fetch(`${API}${path}`, {
        method: method.toUpperCase(),
        headers: bearer(a),
        data: method === "post" ? {} : undefined,
      });
      expect([404, 405, 422], `${method} ${path}`).toContain(r.status());
    }
  });

  test("[AC-029] list ignores search parameters and notes carry no tag or share fields", async ({
    request,
  }) => {
    const a = await newAccount(request);
    const b = await newAccount(request);
    for (const title of ["apple pie", "carburettor"]) {
      const r = await request.post(`${API}/notes`, {
        data: { title, text: "x", tags: ["t"], shared: true, shared_with: [b.email] },
        headers: bearer(a),
      });
      expect(r.status()).toBe(201);
      expect(Object.keys(await r.json()).sort()).toEqual(
        ["created_at", "id", "text", "title", "updated_at"].sort(),
      );
    }
    const filtered = await request.get(`${API}/notes?q=apple&search=apple&tag=t`, {
      headers: bearer(a),
    });
    expect(filtered.status()).toBe(200);
    const titles = (await filtered.json()).map((n: { title: string }) => n.title).sort();
    expect(titles).toEqual(["apple pie", "carburettor"]);
    const other = await request.get(`${API}/notes`, { headers: bearer(b) });
    expect(await other.json()).toEqual([]);
  });
});
