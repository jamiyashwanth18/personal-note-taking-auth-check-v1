import { NavLink, Navigate, Outlet, Route, Routes } from "react-router-dom";

import { AuthProvider, ProtectedRoute } from "@/lib/auth";
import Login from "@/screens/Login";
import Notes from "@/screens/Notes";
import NoteEditor from "@/screens/NoteEditor";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "flex min-h-[44px] items-center rounded-[var(--brand-radius)] px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-[var(--brand-hover)] text-[var(--brand-fg)]" : "text-[var(--brand-fg-muted)]",
  ].join(" ");

// The screens behind sign-in render inside the side menu. Login and the other
// screens shown before sign-in render on their own, with no menu around them.
function Shell() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside
        className="w-full shrink-0 border-b p-4 md:w-56 md:border-b-0 md:border-r"
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
        </nav>
      </aside>
      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          element={
            <ProtectedRoute>
              <Shell />
            </ProtectedRoute>
          }
        >
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/new" element={<NoteEditor />} />
          <Route path="/notes/:id" element={<NoteEditor />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  );
}
