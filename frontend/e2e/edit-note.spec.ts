import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const API = process.env.E2E_API_URL ?? "http://127.0.0.1:8000";

type Account = { email: string; password: string; token: string };
type ApiNote = { id: string; title: string; text: string; created_at: string; updated_at: string };

// Every spec makes its own user through the API, so nothing depends on another spec's rows.
async function newAccount(request: APIRequestContext): Promise<Account> {
  const email = `edit-${crypto.randomUUID()}@example.com`;
  const password = crypto.randomUUID();
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

async function getNote(request: APIRequestContext, a: Account, id: string) {
  const r = await request.get(`${API}/notes/${id}`, { headers: bearer(a) });
  expect(r.status()).toBe(200);
  return (await r.json()) as ApiNote;
}

async function signIn(page: Page, a: Account) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(a.email);
  await page.getByLabel("Password").fill(a.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Notes", exact: true })).toBeVisible();
}

test.describe("Edit a note: UI", () => {
  test("[AC-020] user edits title and text, saves, and reopening shows the new content", async ({
    page,
    request,
  }) => {
    const a = await newAccount(request);
    const note = await createNote(request, a, "Groceries", "milk");
    await signIn(page, a);

    await page.getByRole("button", { name: "Groceries" }).click();
    await expect(page.getByLabel("Title")).toHaveValue("Groceries");
    await expect(page.getByLabel("Text")).toHaveValue("milk");

    await page.getByLabel("Title").fill("Groceries v2");
    await page.getByLabel("Text").fill("milk and eggs");
    await page.getByRole("button", { name: /Save note/ }).click();
    await expect(page.getByText(/^Saved /)).toBeVisible();

    // Persisted, and the updated time moved (checked through the API).
    const stored = await getNote(request, a, note.id);
    expect(stored.title).toBe("Groceries v2");
    expect(stored.text).toBe("milk and eggs");
    expect(new Date(stored.updated_at).getTime()).toBeGreaterThan(
      new Date(note.updated_at).getTime(),
    );

    // Reopen from the list.
    await page.getByRole("button", { name: "Close" }).click();
    await page.getByRole("button", { name: "Groceries v2" }).click();
    await expect(page.getByLabel("Title")).toHaveValue("Groceries v2");
    await expect(page.getByLabel("Text")).toHaveValue("milk and eggs");

    // And after a full reload of the page.
    await page.reload();
    await expect(page.getByLabel("Title")).toHaveValue("Groceries v2");
    await expect(page.getByLabel("Text")).toHaveValue("milk and eggs");
  });

  test("[AC-021] clearing the title blocks saving with a message and the stored note is unchanged", async ({
    page,
    request,
  }) => {
    const a = await newAccount(request);
    const note = await createNote(request, a, "Keep me", "original body");
    await signIn(page, a);
    await page.getByRole("button", { name: "Keep me" }).click();

    let putSeen = false;
    page.on("request", (r) => {
      if (r.method() === "PUT") putSeen = true;
    });

    await page.getByLabel("Title").fill("");
    await page.getByLabel("Text").fill("edited body");
    await page.getByRole("button", { name: /Save note/ }).click();

    await expect(page.getByText(/Add a title before saving/)).toBeVisible();
    expect(putSeen).toBe(false);
    const stored = await getNote(request, a, note.id);
    expect(stored.title).toBe("Keep me");
    expect(stored.text).toBe("original body");
    expect(stored.updated_at).toBe(note.updated_at);
  });

  test("[AC-022] a failed save shows an error and the entered text stays in the editor", async ({
    page,
    request,
  }) => {
    const a = await newAccount(request);
    const note = await createNote(request, a, "Offline note", "before");
    await signIn(page, a);
    await page.getByRole("button", { name: "Offline note" }).click();
    await expect(page.getByLabel("Title")).toHaveValue("Offline note");

    // The server becomes unreachable for saves.
    await page.route(`**/notes/${note.id}`, async (route) => {
      if (route.request().method() === "PUT") await route.abort("connectionrefused");
      else await route.continue();
    });

    await page.getByLabel("Title").fill("Offline note edited");
    await page.getByLabel("Text").fill("words I must not lose");
    await page.getByRole("button", { name: /Save note/ }).click();

    await expect(page.getByRole("alert")).toContainText(/save the note/i);
    await expect(page.getByLabel("Title")).toHaveValue("Offline note edited");
    await expect(page.getByLabel("Text")).toHaveValue("words I must not lose");
    expect((await getNote(request, a, note.id)).text).toBe("before");

    // Once the server is back, the same text can be saved.
    await page.unroute(`**/notes/${note.id}`);
    await page.getByRole("button", { name: /Save note/ }).click();
    await expect(page.getByText(/^Saved /)).toBeVisible();
    expect((await getNote(request, a, note.id)).text).toBe("words I must not lose");
  });
});

test.describe("Edit a note: API contract", () => {
  test("[AC-020] PUT /notes/{id} returns 200 with the updated note and a later updated_at", async ({
    request,
  }) => {
    const a = await newAccount(request);
    const note = await createNote(request, a, "Before", "old");
    const r = await request.put(`${API}/notes/${note.id}`, {
      data: { title: "After", text: "new" },
      headers: bearer(a),
    });
    expect(r.status()).toBe(200);
    const body = (await r.json()) as ApiNote;
    expect(Object.keys(body).sort()).toEqual(["created_at", "id", "text", "title", "updated_at"]);
    expect(body.id).toBe(note.id);
    expect(body.title).toBe("After");
    expect(body.text).toBe("new");
    expect(body.created_at).toBe(note.created_at);
    expect(new Date(body.updated_at).getTime()).toBeGreaterThan(
      new Date(note.updated_at).getTime(),
    );
    expect(await getNote(request, a, note.id)).toEqual(body);
  });

  test("[AC-021] PUT with an empty, blank or missing title is 422 and leaves the note unchanged", async ({
    request,
  }) => {
    const a = await newAccount(request);
    const note = await createNote(request, a, "Stable", "stable body");
    for (const data of [{ title: "", text: "x" }, { title: "   ", text: "x" }, { text: "x" }]) {
      const r = await request.put(`${API}/notes/${note.id}`, { data, headers: bearer(a) });
      expect(r.status()).toBe(422);
      expect(await r.json()).toHaveProperty("detail");
    }
    expect(await getNote(request, a, note.id)).toEqual(note);
  });

  test("[AC-020] GET and PUT on another user's or a missing note are 404 'Note not found'", async ({
    request,
  }) => {
    const owner = await newAccount(request);
    const other = await newAccount(request);
    const note = await createNote(request, owner, "Private", "secret");
    const missing = "00000000-0000-0000-0000-0000000000aa";

    const data = { title: "Hijack", text: "x" };
    const get = await request.get(`${API}/notes/${note.id}`, { headers: bearer(other) });
    const put = await request.put(`${API}/notes/${note.id}`, { data, headers: bearer(other) });
    const gone = await request.put(`${API}/notes/${missing}`, { data, headers: bearer(other) });
    for (const r of [get, put, gone]) {
      expect(r.status()).toBe(404);
      expect(await r.json()).toEqual({ detail: "Note not found" });
    }
    expect(await getNote(request, owner, note.id)).toEqual(note);
  });

  test("[AC-020] GET and PUT /notes/{id} without a token are 401", async ({ request }) => {
    const a = await newAccount(request);
    const note = await createNote(request, a, "Locked", "x");
    const get = await request.get(`${API}/notes/${note.id}`);
    const put = await request.put(`${API}/notes/${note.id}`, {
      data: { title: "x", text: "y" },
    });
    expect(get.status()).toBe(401);
    expect(put.status()).toBe(401);
    expect(await getNote(request, a, note.id)).toEqual(note);
  });
});
