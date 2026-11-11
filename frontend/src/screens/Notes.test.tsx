import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import App from "@/App";

type Call = { url: string; method: string; body?: string };

function mockApi(routes: (c: Call) => { status: number; body?: unknown }) {
  const calls: Call[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      const c = { url, method: init?.method ?? "GET", body: init?.body as string | undefined };
      calls.push(c);
      const r = c.url.endsWith("/auth/me")
        ? { status: 200, body: { id: "u", email: "a@b.co" } }
        : routes(c);
      return { ok: r.status < 400, status: r.status, json: async () => r.body };
    }),
  );
  return calls;
}

function open(path: string) {
  localStorage.setItem("session_token", "t");
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

const note = (id: string, title: string, text = "") => ({
  id,
  title,
  text,
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
});

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("Notes", () => {
  it("[AC-013] lists titles in returned order and [AC-019] shows tags literally", async () => {
    mockApi(() => ({
      status: 200,
      body: [note("1", "<b>x</b>", "<script>1</script>"), note("2", "Old")],
    }));
    open("/notes");
    const first = await screen.findByText("<b>x</b>");
    expect(first).toBeInTheDocument();
    expect(screen.getByText("<script>1</script>")).toBeInTheDocument();
    const buttons = screen.getAllByRole("button").map((b) => b.textContent);
    expect(buttons.indexOf("<b>x</b>")).toBeLessThan(buttons.indexOf("Old"));
  });

  it("[AC-015] shows the empty state with a New note control", async () => {
    mockApi(() => ({ status: 200, body: [] }));
    open("/notes");
    expect(await screen.findByText("You haven't written any notes yet")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /New note/ })).toBeInTheDocument();
  });

  it("[AC-013] shows an error state when the request fails", async () => {
    mockApi(() => ({ status: 500 }));
    open("/notes");
    expect(await screen.findByRole("alert")).toHaveTextContent("Couldn't load notes");
  });

  it("[AC-016] opens a selected note loaded via GET /notes/{id}", async () => {
    const calls = mockApi((c) =>
      c.url.endsWith("/notes/1")
        ? { status: 200, body: note("1", "One", "hello") }
        : { status: 200, body: [note("1", "One")] },
    );
    open("/notes");
    fireEvent.click(await screen.findByRole("button", { name: "One" }));
    expect(await screen.findByDisplayValue("hello")).toBeInTheDocument();
    expect(calls.some((c) => c.url.endsWith("/notes/1") && c.method === "GET")).toBe(true);
  });

  it("[AC-017] creates a note via POST and shows the Saved status", async () => {
    const calls = mockApi((c) =>
      c.method === "POST"
        ? { status: 201, body: note("9", "T") }
        : { status: 200, body: [note("9", "T")] },
    );
    open("/notes/new");
    fireEvent.change(await screen.findByLabelText("Title"), { target: { value: "T" } });
    fireEvent.change(screen.getByLabelText("Text"), { target: { value: "body" } });
    fireEvent.click(screen.getByRole("button", { name: /Save note/ }));
    expect(await screen.findByText(/^Saved/)).toBeInTheDocument();
    const post = calls.find((c) => c.method === "POST");
    expect(JSON.parse(post!.body!)).toEqual({ title: "T", text: "body" });
  });

  it("[AC-018] blocks a whitespace-only title without a request", async () => {
    const calls = mockApi(() => ({ status: 200, body: [] }));
    open("/notes/new");
    fireEvent.change(await screen.findByLabelText("Title"), { target: { value: "   " } });
    fireEvent.click(screen.getByRole("button", { name: /Save note/ }));
    expect(screen.getByText(/Add a title before saving/)).toBeInTheDocument();
    expect(calls.filter((c) => c.method === "POST")).toHaveLength(0);
  });

  it("[NFR-005] shows Note not found on 404", async () => {
    mockApi(() => ({ status: 404, body: { detail: "Note not found" } }));
    open("/notes/abc");
    await waitFor(() =>
      expect(screen.getByRole("heading", { name: "Note not found" })).toBeInTheDocument(),
    );
  });

  it("[AC-014] saves via PUT /notes/{id}", async () => {
    const calls = mockApi((c) => ({ status: 200, body: note("1", "One", c.body ?? "") }));
    open("/notes/1");
    fireEvent.change(await screen.findByLabelText("Title"), { target: { value: "Two" } });
    fireEvent.click(screen.getByRole("button", { name: /Save note/ }));
    await waitFor(() => expect(calls.some((c) => c.method === "PUT")).toBe(true));
  });
});
