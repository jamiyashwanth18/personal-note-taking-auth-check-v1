import React from "react";
import { useNavigate } from "react-router-dom";

import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { brand } from "@/lib/brand";
import { Icons } from "@/lib/icons";
import { Avatar, Empty, TBody, TD, TH, THead, TR, Table } from "@/lib/ui";

export type Note = {
  id: string;
  title: string;
  text: string;
  created_at: string;
  updated_at: string;
};

const P = brand.primaryColor;
const rule = "2px solid " + P;
const btn: React.CSSProperties = {
  borderRadius: brand.radius,
  border: rule,
  minHeight: 44,
  padding: "0 16px",
  fontWeight: 700,
  fontSize: 13,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  cursor: "pointer",
  backgroundColor: P,
  color: brand.backgroundColor,
};
const ghost: React.CSSProperties = { ...btn, backgroundColor: brand.backgroundColor, color: P };
const label: React.CSSProperties = {
  fontSize: 11,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  fontWeight: 700,
};

function fmt(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString("en-GB");
}

export default function Screen() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [status, setStatus] = React.useState<"loading" | "error" | "ready">("loading");
  const [attempt, setAttempt] = React.useState(0);

  React.useEffect(() => {
    let live = true;
    setStatus("loading");
    apiFetch<Note[]>("/notes")
      .then((res) => {
        if (!live) return;
        setNotes(Array.isArray(res) ? res : []);
        setStatus("ready");
      })
      .catch(() => live && setStatus("error"));
    return () => {
      live = false;
    };
  }, [attempt]);

  const newNote = (
    <button type="button" style={btn} onClick={() => navigate("/notes/new")}>
      <Icons.Plus size={16} aria-hidden="true" /> New note
    </button>
  );

  return (
    <div style={{ fontFamily: brand.fontBody, color: P, backgroundColor: brand.backgroundColor }}>
      <div className="mx-auto w-full" style={{ maxWidth: 1040, padding: "24px 16px 48px" }}>
        <header
          className="flex flex-wrap items-start justify-between gap-4"
          style={{ paddingBottom: 16, borderBottom: rule }}
        >
          <div>
            <p style={{ ...label, color: brand.neutralColor, margin: 0 }}>My notes</p>
            <h1
              style={{
                fontFamily: brand.fontHeading,
                fontSize: 36,
                lineHeight: 1.1,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                margin: "4px 0 0",
              }}
            >
              Notes
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2" style={{ fontSize: 13 }}>
              <Avatar name={user?.email ?? ""} />
              <div style={{ lineHeight: 1.3 }}>
                <div style={{ ...label, color: brand.neutralColor, fontSize: 10 }}>
                  Signed in as
                </div>
                <div style={{ fontWeight: 700 }}>{user?.email}</div>
              </div>
            </div>
            <button
              type="button"
              style={ghost}
              onClick={async () => {
                await signOut();
                navigate("/login");
              }}
            >
              Sign out
            </button>
          </div>
        </header>

        <div
          className="flex flex-wrap items-center justify-between gap-3"
          style={{ padding: "16px 0" }}
        >
          <p aria-live="polite" style={{ margin: 0, fontSize: 14, color: brand.neutralColor }}>
            {status === "loading"
              ? "Loading your notes…"
              : status === "error"
                ? "Notes unavailable"
                : notes.length + (notes.length === 1 ? " note" : " notes")}
          </p>
          {status === "ready" && notes.length > 0 && newNote}
        </div>

        {status === "loading" && <p role="status">Loading your notes</p>}

        {status === "error" && (
          <div role="alert" style={{ border: rule, padding: 24 }}>
            <p style={{ margin: "0 0 16px", fontWeight: 700 }}>
              Couldn't load notes. Nothing was changed or deleted.
            </p>
            <button type="button" style={btn} onClick={() => setAttempt((n) => n + 1)}>
              Try again
            </button>
          </div>
        )}

        {status === "ready" && notes.length === 0 && (
          <Empty
            title="You haven't written any notes yet"
            description="Notes are private to your account and plain text only."
            action={newNote}
          />
        )}

        {status === "ready" && notes.length > 0 && (
          <Table>
            <THead>
              <TR>
                <TH scope="col">Title</TH>
                <TH scope="col">Preview</TH>
                <TH scope="col">Updated</TH>
              </TR>
            </THead>
            <TBody>
              {notes.map((n) => (
                <TR key={n.id}>
                  <TD style={{ maxWidth: 320 }}>
                    <button
                      type="button"
                      style={{
                        background: "none",
                        border: 0,
                        padding: 0,
                        font: "inherit",
                        fontWeight: 700,
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate("/notes/" + n.id)}
                    >
                      {n.title}
                    </button>
                  </TD>
                  <TD style={{ maxWidth: 420, color: brand.neutralColor }}>
                    <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {n.text}
                    </div>
                  </TD>
                  <TD style={{ whiteSpace: "nowrap" }}>
                    <time dateTime={n.updated_at}>{fmt(n.updated_at)}</time>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </div>
    </div>
  );
}
