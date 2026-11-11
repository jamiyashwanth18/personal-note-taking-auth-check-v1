import { expect, test, type APIRequestContext, type Page } from "@playwright/test";

const API = process.env.E2E_API_URL ?? "http://127.0.0.1:8000";

async function newAccount(request: APIRequestContext) {
  const email = `v1-${crypto.randomUUID()}@example.com`;
  const password = `pw-${crypto.randomUUID()}`;
  const reg = await request.post(`${API}/auth/register`, { data: { email, password } });
  expect(reg.status()).toBe(201);
  const login = await request.post(`${API}/auth/login`, { data: { email, password } });
  expect(login.status()).toBe(200);
  const { token } = await login.json();
  return { email, password, token: token as string };
}

async function signIn(page: Page, a: { email: string; password: string }) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(a.email);
  await page.getByLabel("Password").fill(a.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Notes", exact: true })).toBeVisible();
}

const FORBIDDEN = /share|sharing|collaborat|\btags?\b|search|bold|italic|markdown|rich text/i;

test.describe("v1 has no sharing, tags, search or rich text", () => {
  test("[AC-029] Login screen has no share, tag, search or formatting controls", async ({
    page,
  }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
    await expect(page.getByRole("searchbox")).toHaveCount(0);
    await expect(page.getByRole("toolbar")).toHaveCount(0);
    await expect(page.locator("textarea, [contenteditable]")).toHaveCount(0);
    await expect(page.getByPlaceholder(/search|tag/i)).toHaveCount(0);
    expect(await page.locator("body").innerText()).not.toMatch(FORBIDDEN);
  });

  test("[AC-029] the note text field is a plain textarea and there is no toolbar", async ({
    page,
    request,
  }) => {
    const a = await newAccount(request);
    await signIn(page, a);
    await page.getByRole("button", { name: "New note" }).click();
    const text = page.getByLabel("Text");
    await expect(text).toBeVisible();
    expect(await text.evaluate((el) => el.tagName)).toBe("TEXTAREA");
    await expect(page.getByRole("toolbar")).toHaveCount(0);
    await expect(page.getByRole("searchbox")).toHaveCount(0);
    await expect(page.locator("[contenteditable]")).toHaveCount(0);
  });

  test("[AC-029] OpenAPI lists no share, tag or search routes and GET /notes has no filter parameter", async ({
    request,
  }) => {
    const r = await request.get(`${API}/openapi.json`);
    expect(r.status()).toBe(200);
    const doc = await r.json();
    for (const path of Object.keys(doc.paths)) {
      expect(path, path).not.toMatch(/share|shared|tag|search|collaborat/i);
    }
    const params = (doc.paths["/notes"]?.get?.parameters ?? []).map(
      (p: { name: string }) => p.name,
    );
    for (const name of ["q", "tag", "tags", "search"]) expect(params).not.toContain(name);
  });

  test("[AC-029] q and tag query parameters do not change the GET /notes result", async ({
    request,
  }) => {
    const a = await newAccount(request);
    for (const title of ["alpha", "beta"]) {
      const c = await request.post(`${API}/notes`, {
        data: { title, text: "x" },
        headers: { Authorization: `Bearer ${a.token}` },
      });
      expect(c.status()).toBe(201);
    }
    const headers = { Authorization: `Bearer ${a.token}` };
    const plain = await (await request.get(`${API}/notes`, { headers })).json();
    const filtered = await request.get(`${API}/notes?q=alpha&tag=nothing`, { headers });
    expect(filtered.status()).toBe(200);
    expect(await filtered.json()).toEqual(plain);
    expect(plain).toHaveLength(2);
  });

  test("[AC-029] HTML typed into a note is stored and shown as plain text, not rendered", async ({
    page,
    request,
  }) => {
    const a = await newAccount(request);
    await signIn(page, a);
    const marker = crypto.randomUUID().slice(0, 8);
    const title = `<i>t${marker}</i>`;
    const raw = `<b>bold${marker}</b><img src=x onerror="window.__xss=1">`;
    await page.getByRole("button", { name: "New note" }).click();
    await page.getByLabel("Title").fill(title);
    await page.getByLabel("Text").fill(raw);
    await page.getByRole("button", { name: "Save note" }).click();
    await expect(page.getByRole("status")).toContainText("Saved");

    const headers = { Authorization: `Bearer ${a.token}` };
    const list = await (await request.get(`${API}/notes`, { headers })).json();
    expect(list).toHaveLength(1);
    expect(list[0].title).toBe(title);
    expect(list[0].text).toBe(raw);

    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.getByText(title, { exact: false }).first()).toBeVisible();
    await expect(page.locator("main i")).toHaveCount(0);
    await expect(page.locator("main b")).toHaveCount(0);
    await expect(page.locator("main img")).toHaveCount(0);
    expect(await page.evaluate(() => (window as unknown as { __xss?: number }).__xss)).toBeUndefined();
  });
});
