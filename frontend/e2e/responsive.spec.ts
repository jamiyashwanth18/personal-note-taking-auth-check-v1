import { expect, test, type APIRequestContext, type Locator, type Page } from "@playwright/test";

const API = process.env.E2E_API_URL ?? "http://127.0.0.1:8000";

type Account = { email: string; password: string; token: string };

async function newAccount(request: APIRequestContext): Promise<Account> {
  const email = `resp-${crypto.randomUUID()}@example.com`;
  const password = crypto.randomUUID();
  const reg = await request.post(`${API}/auth/register`, { data: { email, password } });
  expect(reg.status()).toBe(201);
  const login = await request.post(`${API}/auth/login`, { data: { email, password } });
  expect(login.status()).toBe(200);
  const { token } = await login.json();
  return { email, password, token };
}

async function signIn(page: Page, a: Account) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(a.email);
  await page.getByLabel("Password").fill(a.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page.getByRole("heading", { name: "Notes", exact: true })).toBeVisible();
}

async function noHorizontalScroll(page: Page) {
  const m = await page.evaluate(() => ({
    sw: document.documentElement.scrollWidth,
    cw: document.documentElement.clientWidth,
    bw: document.body.scrollWidth,
  }));
  expect(m.sw).toBeLessThanOrEqual(m.cw);
  expect(m.bw).toBeLessThanOrEqual(m.cw);
}

async function reachable(page: Page, control: Locator, minHeight = 44) {
  await control.scrollIntoViewIfNeeded();
  await expect(control).toBeVisible();
  const box = await control.boundingBox();
  const vp = page.viewportSize()!;
  expect(box).not.toBeNull();
  expect(box!.height).toBeGreaterThanOrEqual(minHeight);
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(vp.width);
  // After scrolling it into view it sits inside the viewport vertically.
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(vp.height);
}

// 190 characters: within the API's 200-character title limit, with no break opportunities.
const LONG_TITLE = "Averyveryverylongtitlewithoutanybreaks".repeat(5);

test.describe("Phone width (360px)", () => {
  test.use({ viewport: { width: 360, height: 640 }, hasTouch: true });

  test("[AC-030] Login: no horizontal scroll, sign in and sign up controls usable", async ({
    page,
  }) => {
    await page.goto("/login");
    await noHorizontalScroll(page);
    await reachable(page, page.getByRole("button", { name: "Sign in" }));
    const toggle = page.getByRole("button", { name: "Create an account" });
    await reachable(page, toggle);
    await toggle.click();
    await noHorizontalScroll(page);
    await reachable(page, page.getByRole("button", { name: "Create account" }));
    await reachable(page, page.getByRole("button", { name: "I already have an account" }));
  });

  test("[AC-030][NFR-013] Notes list with several notes and a long title", async ({
    page,
    request,
  }) => {
    const a = await newAccount(request);
    for (const title of ["One", "Two", "Three", "Four", "Five", "Six", LONG_TITLE]) {
      const r = await request.post(`${API}/notes`, {
        data: { title, text: "body text ".repeat(30) },
        headers: { Authorization: `Bearer ${a.token}` },
      });
      expect(r.status()).toBe(201);
    }
    await signIn(page, a);
    await expect(page.getByTestId("notes-list").getByRole("button").first()).toBeVisible();
    await noHorizontalScroll(page);
    await reachable(page, page.getByRole("button", { name: "New note" }));
    await reachable(page, page.getByRole("button", { name: "Sign out" }));
    await page.getByRole("button", { name: "Sign out" }).scrollIntoViewIfNeeded();
    await noHorizontalScroll(page);
  });

  test("[AC-030][NFR-013] Note editor: Save, Close, Delete, Sign out usable", async ({
    page,
    request,
  }) => {
    const a = await newAccount(request);
    const r = await request.post(`${API}/notes`, {
      data: { title: LONG_TITLE, text: "line\n".repeat(60) },
      headers: { Authorization: `Bearer ${a.token}` },
    });
    expect(r.status()).toBe(201);
    const note = await r.json();
    await signIn(page, a);
    await page.goto(`/notes/${note.id}`);
    await expect(page.getByLabel("Title")).toBeVisible();
    await noHorizontalScroll(page);
    await reachable(page, page.getByRole("button", { name: /Save note/ }));
    await reachable(page, page.getByRole("button", { name: "Close" }));
    await reachable(page, page.getByRole("button", { name: "Delete" }));
    await noHorizontalScroll(page);
    const out = page.getByRole("button", { name: "Sign out" });
    if ((await out.count()) > 0) await reachable(page, out);
  });
});

test.describe("Desktop width (1280px)", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("[AC-031][NFR-013] Login is readable and not stretched", async ({ page }) => {
    await page.goto("/login");
    await noHorizontalScroll(page);
    const form = page.locator("form");
    await expect(form).toBeVisible();
    const box = await form.boundingBox();
    expect(box!.width).toBeGreaterThan(200);
    expect(box!.width).toBeLessThanOrEqual(900);
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("[AC-031] Notes list and editor stay within a sensible width", async ({ page, request }) => {
    const a = await newAccount(request);
    const r = await request.post(`${API}/notes`, {
      data: { title: "Desk note", text: "hello" },
      headers: { Authorization: `Bearer ${a.token}` },
    });
    const note = await r.json();
    await signIn(page, a);
    await noHorizontalScroll(page);
    const list = page.getByTestId("notes-list");
    await expect(list).toBeVisible();
    expect((await list.boundingBox())!.width).toBeLessThanOrEqual(1100);
    await expect(page.getByRole("button", { name: "New note" })).toBeVisible();

    await page.goto(`/notes/${note.id}`);
    await expect(page.getByLabel("Title")).toBeVisible();
    await noHorizontalScroll(page);
    const form = page.locator("form");
    expect((await form.boundingBox())!.width).toBeLessThanOrEqual(1100);
    expect((await page.getByLabel("Text").boundingBox())!.width).toBeLessThanOrEqual(1100);
    await expect(page.getByRole("button", { name: /Save note/ })).toBeVisible();
  });
});

for (const width of [360, 1280]) {
  test.describe(`Routes at ${width}px`, () => {
    test.use({ viewport: { width, height: 800 } });

    test(`[AC-032] unknown URLs redirect to Login at ${width}px`, async ({ page, request }) => {
      for (const path of ["/nope", "/settings", "/admin/users", "/notes/a/b/c"]) {
        await page.goto(path);
        await expect(page).toHaveURL(/\/login$/);
        await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
      }
      // Also when signed in.
      const a = await newAccount(request);
      await signIn(page, a);
      await page.goto("/nope");
      await expect(page).toHaveURL(/\/login$/);
    });

    test(`[AC-032] Login offers sign-up, signed-in screens are Notes list and editor at ${width}px`, async ({
      page,
      request,
    }) => {
      await page.goto("/login");
      await page.getByRole("button", { name: "Create an account" }).click();
      await expect(page.getByRole("button", { name: "Create account" })).toBeVisible();

      const a = await newAccount(request);
      await signIn(page, a);
      await expect(page).toHaveURL(/\/notes$/);
      await page.getByRole("button", { name: "New note" }).click();
      await expect(page).toHaveURL(/\/notes\/new$/);
      await expect(page.getByLabel("Title")).toBeVisible();
    });
  });
}
