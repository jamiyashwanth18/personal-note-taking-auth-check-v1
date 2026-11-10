import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import App from "@/App";
import { getSessionToken } from "@/lib/api";

function mockFetch(handler: (url: string) => { status: number; body?: unknown }) {
  const calls: string[] = [];
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      calls.push(url);
      const r = handler(url);
      return {
        ok: r.status < 400,
        status: r.status,
        json: async () => r.body,
      };
    }),
  );
  return calls;
}

function fill(email: string, password: string) {
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: email } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: password } });
}

function open(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("Login", () => {
  it("[AC-007] redirects to /login when not signed in", () => {
    open("/notes");
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  });

  it("[AC-003] validates before sending a register request", () => {
    const calls = mockFetch(() => ({ status: 201 }));
    open("/login");
    fireEvent.click(screen.getByRole("button", { name: "Create an account" }));
    fill("bad", "short");
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));
    expect(screen.getByText("Enter a valid email address.")).toBeInTheDocument();
    expect(screen.getByText("Use at least 8 characters.")).toBeInTheDocument();
    expect(calls).toHaveLength(0);
  });

  it("[AC-002] shows a message on 409", async () => {
    mockFetch(() => ({ status: 409, body: { detail: "Email already registered" } }));
    open("/login");
    fireEvent.click(screen.getByRole("button", { name: "Create an account" }));
    fill("a@b.co", "password1");
    fireEvent.click(screen.getByRole("button", { name: "Create account" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("account already exists");
    expect(getSessionToken()).toBeNull();
  });

  it("[AC-006] shows one generic message on 401", async () => {
    mockFetch(() => ({ status: 401, body: { detail: "Invalid email or password" } }));
    open("/login");
    fill("a@b.co", "password1");
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Incorrect email or password");
  });

  it("[AC-005] signs in and lands on /notes", async () => {
    mockFetch((url) =>
      url.endsWith("/auth/login")
        ? {
            status: 200,
            body: { token: "t1", token_type: "bearer", user: { id: "1", email: "a@b.co" } },
          }
        : { status: 200, body: {} },
    );
    open("/login");
    fill("a@b.co", "password1");
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    await waitFor(() => expect(screen.getByText("a@b.co")).toBeInTheDocument());
    expect(getSessionToken()).toBe("t1");
  });
});
