import { expect, test, type APIRequestContext } from "@playwright/test";

const API = process.env.E2E_API_URL ?? "http://127.0.0.1:8000";

async function newUser(request: APIRequestContext) {
  const email = `privauth-${crypto.randomUUID()}@example.com`;
  const password = `${crypto.randomUUID()}${crypto.randomUUID()}`;
  const reg = await request.post(`${API}/auth/register`, { data: { email, password } });
  expect(reg.status()).toBe(201);
  const login = await request.post(`${API}/auth/login`, { data: { email, password } });
  expect(login.status()).toBe(200);
  const { token } = await login.json();
  return { token: token as string };
}

async function allEndpoints(
  request: APIRequestContext,
  id: string,
  headers: Record<string, string>,
) {
  const data = { title: "x", text: "y" };
  return [
    await request.get(`${API}/notes`, { headers }),
    await request.post(`${API}/notes`, { data, headers }),
    await request.get(`${API}/notes/${id}`, { headers }),
    await request.put(`${API}/notes/${id}`, { data, headers }),
    await request.delete(`${API}/notes/${id}`, { headers }),
  ];
}

test.describe("Notes privacy: authentication", () => {
  test("[AC-028] invalid and revoked tokens get 401 on every notes endpoint", async ({
    request,
  }) => {
    const a = await newUser(request);
    const created = await request.post(`${API}/notes`, {
      data: { title: "secret-title", text: "secret-body" },
      headers: { Authorization: `Bearer ${a.token}` },
    });
    expect(created.status()).toBe(201);
    const note = await created.json();

    const invalid = await allEndpoints(request, note.id, {
      Authorization: `Bearer ${crypto.randomUUID()}`,
    });
    expect(invalid.map((r) => r.status())).toEqual([401, 401, 401, 401, 401]);

    const out = await request.post(`${API}/auth/logout`, {
      headers: { Authorization: `Bearer ${a.token}` },
    });
    expect(out.status()).toBeLessThan(300);
    const revoked = await allEndpoints(request, note.id, {
      Authorization: `Bearer ${a.token}`,
    });
    expect(revoked.map((r) => r.status())).toEqual([401, 401, 401, 401, 401]);
    for (const r of [...invalid, ...revoked]) {
      const text = await r.text();
      expect(text).not.toContain("secret");
      expect(await r.json()).toHaveProperty("detail");
    }
  });

  test("[NFR-005] refusal of another user's note uses the {detail} shape without content", async ({
    request,
  }) => {
    const a = await newUser(request);
    const b = await newUser(request);
    const created = await request.post(`${API}/notes`, {
      data: { title: "secret-title", text: "secret-body" },
      headers: { Authorization: `Bearer ${a.token}` },
    });
    const note = await created.json();
    const hb = { Authorization: `Bearer ${b.token}` };
    const data = { title: "x", text: "y" };
    const rs = [
      await request.get(`${API}/notes/${note.id}`, { headers: hb }),
      await request.put(`${API}/notes/${note.id}`, { data, headers: hb }),
      await request.delete(`${API}/notes/${note.id}`, { headers: hb }),
    ];
    for (const r of rs) {
      expect(r.status()).toBe(404);
      const body = await r.json();
      expect(Object.keys(body)).toEqual(["detail"]);
      expect(JSON.stringify(body)).not.toContain("secret");
    }
  });
});
