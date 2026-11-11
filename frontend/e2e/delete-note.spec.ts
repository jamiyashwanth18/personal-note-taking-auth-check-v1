import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const API = process.env.E2E_API_URL ?? "http://127.0.0.1:8000";

type Account = { email: string; password: string; token: string };
type ApiNote = { id: string; title: string; text: string; created_at: string; updated_at: string };

async function newAccount(request: APIRequestContext): Promise<Account> {
  const email = `del-${crypto.randomUUID()}@example.com`;
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

test.describe("Delete a note: UI", () => {
  test("[AC-023] choosing Delete shows a confirmation and the note still exists", async ({
    page,
    request,
  }) => {
    const a = await newAccount(request);
    const note = await createNote(request, a, "Fragile", "keep");
    await signIn(page, a);
    await page.getByRole("button", { name: "Fragile" }).click();
    await page.getByRole("button", { name: "Delete" }).click();

    const dialog = page.getByRole("alertdialog");
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Delete this note?");

    const r = await request.get(`${API}/notes/${note.id}`, { headers: bearer(a) });
    expect(r.status()).toBe(200);
  });

  test("[AC-024] confirming deletes the note; it is gone from the list, also after reload", async ({
    page,
    request,
  }) => {
    const a = await newAccount(request);
    const note = await createNote(request, a, "Doomed", "bye");
    await createNote(request, a, "Survivor", "stay");
    await signIn(page, a);
    await page.getByRole("button", { name: "Doomed" }).click();
    await page.getByRole("button", { name: "Delete" }).click();
    await page.getByRole("button", { name: "Delete permanently" }).click();

    await expect(page.getByRole("heading", { name: "Notes", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Survivor" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Doomed" })).toHaveCount(0);

    await page.reload();
    await expect(page.getByRole("button", { name: "Survivor" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Doomed" })).toHaveCount(0);

    const r = await request.get(`${API}/notes/${note.id}`, { headers: bearer(a) });
    expect(r.status()).toBe(404);
  });

  test("[AC-025] cancelling keeps the note unchanged", async ({ page, request }) => {
    const a = await newAccount(request);
    const note = await createNote(request, a, "Cancel me", "intact body");
    await signIn(page, a);
    await page.getByRole("button", { name: "Cancel me" }).click();
    await page.getByRole("button", { name: "Delete" }).click();
    await expect(page.getByRole("alertdialog")).toBeVisible();
    await page.getByRole("button", { name: "Keep note" }).click();
    await expect(page.getByRole("alertdialog")).toHaveCount(0);
    await expect(page.getByLabel("Title")).toHaveValue("Cancel me");

    const r = await request.get(`${API}/notes/${note.id}`, { headers: bearer(a) });
    expect(r.status()).toBe(200);
    expect(await r.json()).toEqual(note);

    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.getByRole("button", { name: "Cancel me" })).toBeVisible();
  });
});
