import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import App from "@/App";

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

describe("Responsive layout", () => {
  it("[AC-030] stacks the menu on narrow screens, beside content from md up, notes as a list", async () => {
    localStorage.setItem("session_token", "t");
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => ({
        ok: true,
        status: 200,
        json: async () =>
          url.endsWith("/auth/me")
            ? { id: "u", email: "a@b.co" }
            : [{ id: "1", title: "One", text: "x", created_at: "", updated_at: "" }],
      })),
    );
    const { container } = render(
      <MemoryRouter initialEntries={["/notes"]}>
        <App />
      </MemoryRouter>,
    );
    expect(await screen.findByTestId("notes-list")).toBeInTheDocument();
    expect(container.querySelector("table")).toBeNull();
    const shell = container.querySelector("aside")!.parentElement!;
    expect(shell.className).toContain("flex-col");
    expect(shell.className).toContain("md:flex-row");
    expect(container.querySelector("aside")!.className).toContain("w-full");
    expect(container.querySelector("aside")!.className).toContain("md:w-56");
    expect(screen.getByRole("link", { name: "Notes list" }).className).toContain("min-h-[44px]");
  });
});
