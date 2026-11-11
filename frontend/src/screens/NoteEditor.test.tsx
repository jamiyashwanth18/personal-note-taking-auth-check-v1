import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import App from "@/App";

type Stored = {
  id: string;
  title: string;
  text: string;
  created_at: string;
  updated_at: string;
};
type Call = { url: string; method: string; body?: string };

// A tiny in-memory notes server: PUT really changes what a later GET returns.
function mockServer(opts: { failPut?: "network" | 500 } = {}) {
  const store: Stored = {
    id: "1",
    title: "Original",
    text: "original text",
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  };
  const calls: Call[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string, init?: RequestInit) => {
      const method = init?.method ?? "GET";
      calls.push({ url, method, body: init?.body as string | undefined });
      const reply = (status: number, body?: unknown) => ({
        ok: status < 400,
        status,
        json: async () => body,
      });
      if (url.endsWith("/auth/me")) return reply(200, { id: "u", email: "a@b.co" });
      if (url.endsWith("/notes/1") && method === "PUT") {
        if (opts.failPut === "network") throw new TypeError("Failed to fetch");
        if (opts.failPut === 500) return reply(500, { detail: "Something went wrong" });
        const b = JSON.parse(init!.body as string);
        store.title = b.title;
        store.text = b.text;
        store.updated_at = "2026-02-02T10:00:00Z";
        return reply(200, { ...store });
      }
      if (url.endsWith("/notes/1")) return reply(200, { ...store });
      if (url.endsWith("/notes")) return reply(200, [{ ...store }]);
      return reply(404, { detail: "Not found" });
    }),
  );
  return { store, calls };
}

function open(path: string) {
  localStorage.setItem("session_token", "t");
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

const puts = (calls: Call[]) => calls.filter((c) => c.method === "PUT");

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("Note editor: edit", () => {
  it("[AC-020] saves changed title and text via PUT, confirms, and reopening shows them", async () => {
    const { calls } = mockServer();
    open("/notes/1");
    const title = await screen.findByLabelText("Title");
    expect(title).toHaveValue("Original");
    expect(screen.getByLabelText("Text")).toHaveValue("original text");

    fireEvent.change(title, { target: { value: "Changed" } });
    fireEvent.change(screen.getByLabelText("Text"), { target: { value: "changed text" } });
    fireEvent.click(screen.getByRole("button", { name: /Save note/ }));

    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(/^Saved /));
    expect(puts(calls)).toHaveLength(1);
    expect(JSON.parse(puts(calls)[0].body!)).toEqual({ title: "Changed", text: "changed text" });

    // Close, then open the note again from the list: the new content is loaded.
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    fireEvent.click(await screen.findByRole("button", { name: "Changed" }));
    expect(await screen.findByDisplayValue("changed text")).toBeInTheDocument();
    expect(screen.getByLabelText("Title")).toHaveValue("Changed");
  });

  it("[AC-020] editing again after a save clears the saved confirmation", async () => {
    mockServer();
    open("/notes/1");
    fireEvent.change(await screen.findByLabelText("Title"), { target: { value: "B" } });
    fireEvent.click(screen.getByRole("button", { name: /Save note/ }));
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(/^Saved /));
    fireEvent.change(screen.getByLabelText("Text"), { target: { value: "more" } });
    expect(screen.getByRole("status")).not.toHaveTextContent(/Saved/);
  });

  it("[AC-021] blocks saving a cleared title with a message and sends nothing", async () => {
    const { calls, store } = mockServer();
    open("/notes/1");
    const title = await screen.findByLabelText("Title");
    fireEvent.change(title, { target: { value: "" } });
    fireEvent.change(screen.getByLabelText("Text"), { target: { value: "edited text" } });
    fireEvent.click(screen.getByRole("button", { name: /Save note/ }));

    expect(screen.getByText(/Add a title before saving/)).toBeInTheDocument();
    expect(title).toHaveAttribute("aria-invalid", "true");
    expect(puts(calls)).toHaveLength(0);
    expect(store.title).toBe("Original");
    expect(store.text).toBe("original text");
    expect(screen.getByLabelText("Text")).toHaveValue("edited text");
  });

  it("[AC-021] a whitespace-only title is blocked too, and typing a title clears the message", async () => {
    const { calls } = mockServer();
    open("/notes/1");
    const title = await screen.findByLabelText("Title");
    fireEvent.change(title, { target: { value: "   " } });
    fireEvent.click(screen.getByRole("button", { name: /Save note/ }));
    expect(screen.getByText(/Add a title before saving/)).toBeInTheDocument();
    expect(puts(calls)).toHaveLength(0);

    fireEvent.change(title, { target: { value: "Fixed" } });
    expect(screen.queryByText(/Add a title before saving/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Save note/ }));
    await waitFor(() => expect(puts(calls)).toHaveLength(1));
  });

  it("[AC-022] shows an error and keeps entered text when the server is unreachable", async () => {
    const { calls } = mockServer({ failPut: "network" });
    open("/notes/1");
    fireEvent.change(await screen.findByLabelText("Title"), { target: { value: "My new title" } });
    fireEvent.change(screen.getByLabelText("Text"), { target: { value: "my unsaved words" } });
    fireEvent.click(screen.getByRole("button", { name: /Save note/ }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/Couldn.t save the note/);
    expect(screen.getByLabelText("Title")).toHaveValue("My new title");
    expect(screen.getByLabelText("Text")).toHaveValue("my unsaved words");
    expect(screen.queryByText(/^Saved /)).not.toBeInTheDocument();
    expect(puts(calls)).toHaveLength(1);
  });

  it("[AC-022] a server error (500) shows the same message and keeps the text, and save can be retried", async () => {
    mockServer({ failPut: 500 });
    open("/notes/1");
    fireEvent.change(await screen.findByLabelText("Text"), { target: { value: "keep me" } });
    fireEvent.click(screen.getByRole("button", { name: /Save note/ }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/Couldn.t save the note/);
    expect(screen.getByLabelText("Text")).toHaveValue("keep me");
    expect(screen.getByRole("button", { name: /Save note/ })).toBeEnabled();
  });
});
