import { expect, test } from "@playwright/test";

test.describe("Setup guide outcome: the started app reaches Login", () => {
  test("[AC-040] a fresh visitor of the running app reaches the Login screen", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("[AC-040] the backend the guide starts answers its health check", async ({ request }) => {
    const api = process.env.E2E_API_URL ?? "http://127.0.0.1:8000";
    const r = await request.get(`${api}/health`);
    expect(r.status()).toBe(200);
    expect(await r.json()).toEqual({ status: "ok" });
  });
});
