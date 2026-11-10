import { NavLink, Navigate, Outlet, Route, Routes } from "react-router-dom";

import Login from "@/screens/Login";
import Notes from "@/screens/Notes";
import NoteEditor from "@/screens/NoteEditor";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "block rounded-[var(--brand-radius)] px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-[var(--brand-hover)] text-[var(--brand-fg)]" : "text-[var(--brand-fg-muted)]",
  ].join(" ");

// The screens behind sign-in render inside the side menu. Login and the other
// screens shown before sign-in render on their own, with no menu around them.
function Shell() {
  return (
    <div className="flex min-h-screen">
      <aside
        className="w-56 shrink-0 border-r p-4"
        style={{
          backgroundColor: "var(--brand-surface)",
          borderColor: "var(--brand-border)",
        }}
      >
        <p
          className="mb-4 px-3 text-sm font-semibold"
          style={{ fontFamily: "var(--brand-font-heading)" }}
        >
          {"Personal note taking - auth check v1"}
        </p>
        <nav className="flex flex-col gap-1">
          <NavLink to="/notes" className={navLinkClass}>
            {"Notes list"}
          </NavLink>
          <NavLink to="/note-editor" className={navLinkClass}>
            {"Note editor"}
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<Shell />}>
        <Route path="/notes" element={<Notes />} />
        <Route path="/note-editor" element={<NoteEditor />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
