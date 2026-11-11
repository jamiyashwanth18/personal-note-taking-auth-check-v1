import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ApiError, apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { brand } from "@/lib/brand";
import { Icons } from "@/lib/icons";
import { Empty } from "@/lib/ui";
import type { Note } from "@/screens/Notes";

const P = brand.primaryColor;
const A = brand.accentColor;
const N = brand.neutralColor;
const rule = "2px solid " + P;
const btn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  minHeight: 44,
  maxWidth: "100%",
  overflowWrap: "anywhere",
  padding: "0 16px",
  border: rule,
  borderRadius: brand.radius,
  fontSize: 13,
  fontWeight: 700,
  cursor: "pointer",
  backgroundColor: brand.backgroundColor,
  color: P,
};
const btnPrimary: React.CSSProperties = {
  ...btn,
  backgroundColor: P,
  color: brand.backgroundColor,
};
const label: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: 8,
};
const field: React.CSSProperties = {
  width: "100%",
  border: rule,
  borderRadius: brand.radius,
  padding: "8px 12px",
  fontSize: 15,
  fontFamily: brand.fontBody,
  color: P,
  backgroundColor: brand.backgroundColor,
};

export default function Screen() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, signOut } = useAuth();
  const isNew = id === undefined;
  const [loading, setLoading] = React.useState(!isNew);
  const [missing, setMissing] = React.useState(false);
  const [loadError, setLoadError] = React.useState(false);
  const [note, setNote] = React.useState<Note | null>(null);
  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [titleError, setTitleError] = React.useState("");
  const [saveError, setSaveError] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  React.useEffect(() => {
    if (id === undefined) {
      setLoading(false);
      setMissing(false);
      setNote(null);
      setTitle("");
      setBody("");
      return;
    }
    let live = true;
    setLoading(true);
    setMissing(false);
    setLoadError(false);
    apiFetch<Note>("/notes/" + encodeURIComponent(id))
      .then((n) => {
        if (!live) return;
        setNote(n);
        setTitle(n.title);
        setBody(n.text);
      })
      .catch((err) => {
        if (!live) return;
        if (err instanceof ApiError && err.status === 404) setMissing(true);
        else setLoadError(true);
      })
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [id]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    if (title.trim() === "") {
      setTitleError("Add a title before saving. Nothing has been stored.");
      setSaved(false);
      return;
    }
    setTitleError("");
    setSaveError("");
    setSaved(false);
    setSaving(true);
    try {
      const payload = JSON.stringify({ title, text: body });
      if (isNew) {
        await apiFetch<Note>("/notes", { method: "POST", body: payload });
        navigate("/notes");
        return;
      }
      const n = await apiFetch<Note>("/notes/" + encodeURIComponent(id), {
        method: "PUT",
        body: payload,
      });
      setNote(n);
      setSaved(true);
    } catch (err) {
      const status = err instanceof ApiError ? err.status : 0;
      if (status === 404) setMissing(true);
      else if (status === 422) setTitleError("Add a title before saving. Nothing has been stored.");
      else if (status !== 401)
        setSaveError("Couldn’t save the note. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    setConfirmOpen(false);
    try {
      await apiFetch<void>("/notes/" + encodeURIComponent(id), { method: "DELETE" });
      navigate("/notes");
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) setMissing(true);
      else setSaveError("Couldn’t delete the note. Try again.");
    }
  }

  const heading = missing ? "Note not found" : isNew ? "New note" : "Edit note";

  let content: React.ReactNode;
  if (loading) {
    content = <p role="status">Loading note…</p>;
  } else if (missing) {
    content = (
      <Empty
        title="This note doesn't exist in your account"
        description="It may have been deleted, or the link is wrong."
        action={
          <button type="button" style={btnPrimary} onClick={() => navigate("/notes")}>
            Back to my notes
          </button>
        }
      />
    );
  } else if (loadError) {
    content = (
      <p role="alert" style={{ color: A, fontWeight: 700 }}>
        Couldn’t load the note.
      </p>
    );
  } else {
    content = (
      <form onSubmit={save} noValidate aria-label={heading}>
        {saveError && (
          <p role="alert" style={{ color: A, fontWeight: 700 }}>
            {saveError}
          </p>
        )}
        <div style={{ marginBottom: 24 }}>
          <label htmlFor="note-title" style={label}>
            Title
          </label>
          <input
            id="note-title"
            type="text"
            value={title}
            maxLength={200}
            onChange={(e) => {
              setTitle(e.target.value);
              setTitleError("");
              setSaved(false);
            }}
            aria-invalid={titleError ? "true" : "false"}
            aria-describedby={titleError ? "note-title-error" : undefined}
            style={{ ...field, fontSize: 20, fontWeight: 700, borderColor: titleError ? A : P }}
          />
          {titleError && (
            <p id="note-title-error" style={{ color: A, fontWeight: 700, margin: "8px 0 0" }}>
              {titleError}
            </p>
          )}
        </div>
        <div style={{ marginBottom: 24 }}>
          <label htmlFor="note-body" style={label}>
            Text
          </label>
          <textarea
            id="note-body"
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
              setSaved(false);
            }}
            style={{ ...field, minHeight: 320, resize: "vertical", whiteSpace: "pre-wrap" }}
          />
          <p style={{ margin: "8px 0 0", fontSize: 13, color: N }}>
            Plain text only. HTML or script tags are stored and shown exactly as typed.
          </p>
        </div>
        <div
          className="flex flex-wrap items-center gap-2"
          style={{ borderTop: rule, paddingTop: 16 }}
        >
          <button type="submit" style={btnPrimary} disabled={saving}>
            <Icons.Check size={16} aria-hidden="true" /> {saving ? "Saving…" : "Save note"}
          </button>
          <button type="button" style={btn} onClick={() => navigate("/notes")}>
            Close
          </button>
          {!isNew && (
            <button
              type="button"
              disabled={saving}
              onClick={() => setConfirmOpen(true)}
              style={{ ...btn, marginLeft: "auto", borderColor: A, color: A }}
            >
              <Icons.Trash size={16} aria-hidden="true" /> Delete
            </button>
          )}
        </div>
        <p role="status" aria-live="polite" style={{ margin: "12px 0 0", fontSize: 13, color: N }}>
          {saving
            ? "Saving…"
            : saved && note
              ? "Saved " + new Date(note.updated_at).toLocaleString("en-GB")
              : ""}
        </p>
      </form>
    );
  }

  return (
    <div style={{ color: P, fontFamily: brand.fontBody, padding: 16, maxWidth: 1080 }}>
      <header style={{ borderBottom: rule, paddingBottom: 16, marginBottom: 24 }}>
        <div
          className="flex flex-wrap items-center justify-between gap-3"
          style={{ marginBottom: 16 }}
        >
          <button
            type="button"
            onClick={() => navigate("/notes")}
            style={{ ...btn, border: "none", color: N }}
          >
            <Icons.ArrowLeft size={16} aria-hidden="true" /> All notes
          </button>
          <button
            type="button"
            style={btn}
            onClick={async () => {
              await signOut();
              navigate("/login");
            }}
          >
            <Icons.User size={16} aria-hidden="true" /> Sign out
            {user ? " (" + user.email + ")" : ""}
          </button>
        </div>
        <h1
          style={{
            fontFamily: brand.fontHeading,
            fontSize: 36,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            margin: 0,
          }}
        >
          {heading}
        </h1>
      </header>
      {content}
      {confirmOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(17,17,17,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
            zIndex: 50,
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="del-title"
            aria-describedby="del-desc"
            onKeyDown={(e) => e.key === "Escape" && setConfirmOpen(false)}
            style={{
              backgroundColor: brand.backgroundColor,
              border: rule,
              padding: 24,
              width: "100%",
              maxWidth: 440,
            }}
          >
            <h2 id="del-title" style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px" }}>
              Delete this note?
            </h2>
            <p id="del-desc" style={{ color: N, margin: "0 0 24px" }}>
              “{note ? note.title : title}” will be permanently deleted from your account. This
              can’t be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button type="button" autoFocus style={btn} onClick={() => setConfirmOpen(false)}>
                Keep note
              </button>
              <button
                type="button"
                onClick={remove}
                style={{ ...btn, backgroundColor: A, borderColor: A, color: brand.backgroundColor }}
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
