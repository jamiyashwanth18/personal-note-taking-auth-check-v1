// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";
import { useAuth } from "@/lib/auth";

 
const { Table, TBody, TR, TH, TD, Empty } = UI;
 
const { Check, Edit } = Icons;

const SEED_NOTE = {
  id: "a41f7c92-3b0e-4d58-9c1a-e07b52d8f6a3",
  title: "Nightly export runbook",
  body: 'Owner: Priya (backup: Tomas)\n\n1. Check the export job finished before 02:15 UTC.\n2. Compare row counts: orders_export.csv vs the orders table.\n3. If counts differ by more than 0.5%, page the on-call.\n\nSnippet kept for the status page (saved as literal text, never rendered):\n<div class="banner"><script>refreshStatus()</script></div>\n\nNext review: 1 Dec 2026.',
  created_at: new Date("2026-10-21T09:14:00"),
  updated_at: new Date("2026-11-09T17:42:00"),
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad = (n) => String(n).padStart(2, "0");
const fmt = (d) =>
  d.getDate() +
  " " +
  MONTHS[d.getMonth()] +
  " " +
  d.getFullYear() +
  ", " +
  pad(d.getHours()) +
  ":" +
  pad(d.getMinutes());

export default function Screen() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [view, setView] = React.useState("edit"); // edit | new | missing
  const [server, setServer] = React.useState("online"); // online | offline | expired
  const [note, setNote] = React.useState(SEED_NOTE);
  const [title, setTitle] = React.useState(SEED_NOTE.title);
  const [body, setBody] = React.useState(SEED_NOTE.body);
  const [titleError, setTitleError] = React.useState("");
  const [saveError, setSaveError] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [savedAt, setSavedAt] = React.useState(null);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleted, setDeleted] = React.useState(false);

  const titleRef = React.useRef(null);
  const deleteBtnRef = React.useRef(null);
  const cancelRef = React.useRef(null);
  const confirmRef = React.useRef(null);

  const P = brand.primaryColor;
  const N = brand.neutralColor;
  const A = brand.accentColor;
  const BG = brand.backgroundColor;
  const rule = "2px solid " + P;

  const isNew = view === "new";
  const dirty = isNew
    ? title !== "" || body !== ""
    : note && (title !== note.title || body !== note.body);

  const label = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: P,
    marginBottom: 8,
  };
  const field = {
    width: "100%",
    border: rule,
    borderRadius: 2,
    backgroundColor: BG,
    color: P,
    padding: "8px 12px",
    fontSize: 15,
    lineHeight: 1.5,
    fontFamily: brand.fontBody,
  };
  const btn = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minHeight: 44,
    padding: "0 16px",
    border: rule,
    borderRadius: 2,
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    fontFamily: brand.fontBody,
    cursor: "pointer",
    backgroundColor: BG,
    color: P,
  };
  const btnPrimary = { ...btn, backgroundColor: P, color: BG };

  function resetFor(nextView) {
    setView(nextView);
    setDeleted(false);
    setConfirmOpen(false);
    setSaveError(null);
    setTitleError("");
    setSavedAt(null);
    setSaving(false);
    if (nextView === "edit") {
      setNote(SEED_NOTE);
      setTitle(SEED_NOTE.title);
      setBody(SEED_NOTE.body);
    }
    if (nextView === "new") {
      setNote(null);
      setTitle("");
      setBody("");
    }
  }

  function handleSave(e) {
    if (e) e.preventDefault();
    if (saving) return;
    if (title.trim() === "") {
      setTitleError("Add a title before saving. Nothing has been stored.");
      setSavedAt(null);
      if (titleRef.current) titleRef.current.focus();
      return;
    }
    setTitleError("");
    setSaveError(null);
    setSavedAt(null);
    setSaving(true);
  }

  React.useEffect(() => {
    if (!saving) return undefined;
    const t = setTimeout(() => {
      setSaving(false);
      if (server === "offline") {
        setSaveError({ kind: "offline" });
        return;
      }
      if (server === "expired") {
        setSaveError({ kind: "expired" });
        return;
      }
      const now = new Date();
      setNote((prev) => ({
        id: prev
          ? prev.id
          : "c7" + Math.random().toString(16).slice(2, 8) + "-0d3a-4e19-b6f2-52a9c0e1d478",
        title: title.trim(),
        body,
        created_at: prev ? prev.created_at : now,
        updated_at: now,
      }));
      setTitle(title.trim());
      setView("edit");
      setSavedAt(now);
    }, 600);
    return () => clearTimeout(t);
  }, [saving]);

  function openConfirm() {
    setConfirmOpen(true);
  }
  function closeConfirm() {
    setConfirmOpen(false);
    if (deleteBtnRef.current) deleteBtnRef.current.focus();
  }
  React.useEffect(() => {
    if (confirmOpen && cancelRef.current) cancelRef.current.focus();
  }, [confirmOpen]);

  function onDialogKey(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeConfirm();
      return;
    }
    if (e.key === "Tab") {
      const first = cancelRef.current,
        last = confirmRef.current;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function confirmDelete() {
    setConfirmOpen(false);
    setDeleted(true);
  }

  const statusLine = saving
    ? "Saving…"
    : savedAt
      ? "Saved " + fmt(savedAt)
      : dirty
        ? "Unsaved changes"
        : isNew
          ? "Not saved yet"
          : "No changes";

  const css = `
    .ne-wrap *:focus-visible { outline: 2px solid ${P}; outline-offset: 2px; }
    .ne-grid { display: grid; grid-template-columns: minmax(0,1fr); gap: 32px; }
    @media (min-width: 1024px) { .ne-grid { grid-template-columns: minmax(0,1fr) 280px; } }
    .ne-actions { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
    .ne-btn:hover:not(:disabled) { opacity: .86; }
    .ne-btn:active:not(:disabled) { transform: translateY(1px); }
    .ne-btn:disabled { opacity: .5; cursor: not-allowed; }
    .ne-enter { animation: neIn .18s ease-out; }
    @keyframes neIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
    @keyframes neSpin { to { transform: rotate(360deg); } }
    .ne-spin { display:inline-block; width:12px; height:12px; border:2px solid currentColor; border-right-color: transparent; border-radius:50%; animation: neSpin .7s linear infinite; }
    @media (prefers-reduced-motion: reduce) { .ne-enter, .ne-spin { animation: none; } .ne-btn { transition: none; } }
  `;

  const header = (
    <header style={{ borderBottom: rule, paddingBottom: 16, marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <nav aria-label="Breadcrumb">
          <button
            type="button"
            className="ne-btn"
            onClick={() => navigate("notes")}
            style={{ ...btn, minHeight: 44, border: "none", padding: "0 8px 0 0", color: N }}
          >
            <Icons.ArrowLeft width={16} height={16} aria-hidden="true" /> All notes
          </button>
        </nav>
        <button
          type="button"
          className="ne-btn"
          onClick={async () => {
            await signOut();
            navigate("login");
          }}
          style={btn}
        >
          <Icons.User width={16} height={16} aria-hidden="true" /> Sign out
          {user ? " (" + user.email + ")" : ""}
        </button>
      </div>
      <p style={{ ...label, color: N, marginBottom: 4 }}>
        {view === "missing"
          ? "Note unavailable"
          : isNew
            ? "New note"
            : "Note · " + note.id.slice(0, 8)}
      </p>
      <h1
        style={{
          fontFamily: brand.fontHeading,
          fontSize: 36,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          lineHeight: 1.1,
          margin: 0,
          color: P,
        }}
      >
        {view === "missing" ? "Note not found" : isNew ? "New note" : "Edit note"}
      </h1>
    </header>
  );

  let content;
  if (view === "missing") {
    content = (
      <div style={{ border: rule, borderRadius: 2, padding: 16 }}>
        <Empty
          title="This note doesn't exist in your account"
          description="It may have been deleted, or the link is wrong. Notes are private to the account that wrote them, so nothing about this one can be shown."
          action={
            <button
              type="button"
              className="ne-btn"
              style={btnPrimary}
              onClick={() => navigate("notes")}
            >
              Back to my notes
            </button>
          }
        />
      </div>
    );
  } else if (deleted) {
    content = (
      <div
        role="status"
        className="ne-enter"
        style={{ border: rule, borderRadius: 2, padding: 24 }}
      >
        <p style={{ ...label, color: N }}>Deleted</p>
        <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 8px" }}>
          “{title || "Untitled"}” was permanently deleted
        </h2>
        <p style={{ color: N, fontSize: 15, lineHeight: 1.5, margin: "0 0 24px", maxWidth: 520 }}>
          It no longer appears in your notes list and can't be recovered.
        </p>
        <div className="ne-actions">
          <button
            type="button"
            className="ne-btn"
            style={btnPrimary}
            onClick={() => navigate("notes")}
          >
            Back to my notes <Icons.ArrowRight width={16} height={16} aria-hidden="true" />
          </button>
          <button type="button" className="ne-btn" style={btn} onClick={() => resetFor("new")}>
            <Icons.Plus width={16} height={16} aria-hidden="true" /> New note
          </button>
        </div>
      </div>
    );
  } else {
    content = (
      <div className="ne-grid">
        <form onSubmit={handleSave} noValidate aria-label={isNew ? "New note" : "Edit note"}>
          {saveError && (
            <div
              role="alert"
              className="ne-enter"
              style={{
                border: "2px solid " + A,
                borderRadius: 2,
                padding: 16,
                marginBottom: 24,
                display: "flex",
                gap: 12,
              }}
            >
              <Icons.AlertCircle
                width={20}
                height={20}
                aria-hidden="true"
                style={{ color: A, flexShrink: 0, marginTop: 2 }}
              />
              <div>
                <p style={{ margin: 0, fontWeight: 700, color: A, fontSize: 15 }}>
                  {saveError.kind === "offline"
                    ? "Couldn’t reach the server. Note not saved."
                    : "Your session has expired. Note not saved."}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 14, lineHeight: 1.5, color: P }}>
                  {saveError.kind === "offline"
                    ? "Everything you typed is still in the editor. Check your connection and press Save note again."
                    : "You were inactive for too long. Sign in again to keep working; the text below stays here until you leave this page."}
                </p>
                {saveError.kind === "expired" && (
                  <button
                    type="button"
                    className="ne-btn"
                    style={{ ...btn, marginTop: 12 }}
                    onClick={() => navigate("login")}
                  >
                    Sign in again
                  </button>
                )}
              </div>
            </div>
          )}

          <div style={{ marginBottom: 24 }}>
            <label htmlFor="note-title" style={label}>
              Title
            </label>
            <input
              id="note-title"
              ref={titleRef}
              type="text"
              value={title}
              maxLength={200}
              readOnly={saving}
              onChange={(e) => {
                setTitle(e.target.value);
                if (titleError) setTitleError("");
                setSavedAt(null);
              }}
              aria-invalid={titleError ? "true" : "false"}
              aria-describedby={titleError ? "note-title-error" : undefined}
              aria-required="true"
              placeholder="e.g. Quarterly planning notes"
              style={{
                ...field,
                fontSize: 20,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                borderColor: titleError ? A : P,
              }}
            />
            {titleError && (
              <p
                id="note-title-error"
                className="ne-enter"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  margin: "8px 0 0",
                  color: A,
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                <Icons.AlertCircle width={16} height={16} aria-hidden="true" /> {titleError}
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
              readOnly={saving}
              onChange={(e) => {
                setBody(e.target.value);
                setSavedAt(null);
              }}
              aria-describedby="note-body-hint"
              placeholder="Write your note here."
              style={{ ...field, minHeight: 320, resize: "vertical", whiteSpace: "pre-wrap" }}
            />
            <p
              id="note-body-hint"
              style={{
                margin: "8px 0 0",
                fontSize: 13,
                color: N,
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <span>
                Plain text only. HTML or script tags are stored and shown exactly as typed.
              </span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>
                {body.length.toLocaleString("en-GB")} characters
              </span>
            </p>
          </div>

          <div style={{ borderTop: rule, paddingTop: 16 }} className="ne-actions">
            <button type="submit" className="ne-btn" style={btnPrimary} disabled={saving}>
              {saving ? (
                <span className="ne-spin" aria-hidden="true" />
              ) : (
                <Icons.Check width={16} height={16} aria-hidden="true" />
              )}
              {saving ? "Saving…" : "Save note"}
            </button>
            <button type="button" className="ne-btn" style={btn} onClick={() => navigate("notes")}>
              {dirty ? "Discard and close" : "Close"}
            </button>
            {!isNew && (
              <button
                type="button"
                ref={deleteBtnRef}
                className="ne-btn"
                onClick={openConfirm}
                disabled={saving}
                style={{ ...btn, marginLeft: "auto", borderColor: A, color: A }}
              >
                <Icons.Trash width={16} height={16} aria-hidden="true" /> Delete
              </button>
            )}
          </div>
          <p
            role="status"
            aria-live="polite"
            style={{
              margin: "12px 0 0",
              fontSize: 13,
              fontWeight: 700,
              color: savedAt ? P : N,
              fontVariantNumeric: "tabular-nums",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            {savedAt && <Icons.CheckCircle width={16} height={16} aria-hidden="true" />}
            {statusLine}
          </p>
        </form>

        <aside aria-labelledby="note-details">
          <h2
            id="note-details"
            style={{ ...label, paddingBottom: 8, borderBottom: rule, marginBottom: 0 }}
          >
            Note details
          </h2>
          <Table
            style={{
              width: "100%",
              fontVariantNumeric: "tabular-nums",
              fontSize: 13,
              borderCollapse: "collapse",
            }}
          >
            <TBody>
              {[
                ["Id", note ? note.id.slice(0, 8) + "…" : "Assigned on save"],
                ["Owner", "You only"],
                ["Created", note ? fmt(note.created_at) : "—"],
                ["Updated", note ? fmt(note.updated_at) : "—"],
                ["Length", body.length.toLocaleString("en-GB") + " chars"],
              ].map(([k, v]) => (
                <TR key={k} style={{ borderBottom: "1px solid " + P }}>
                  <TH
                    scope="row"
                    style={{
                      textAlign: "left",
                      padding: "8px 0",
                      fontSize: 11,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: N,
                      fontWeight: 700,
                      width: 84,
                    }}
                  >
                    {k}
                  </TH>
                  <TD style={{ padding: "8px 0", color: P, textAlign: "right" }}>{v}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
          <p style={{ fontSize: 13, color: N, lineHeight: 1.5, margin: "12px 0 0" }}>
            Saving moves this note to the top of your list.
          </p>
        </aside>
      </div>
    );
  }

  const selectStyle = { ...field, fontSize: 13, padding: "4px 8px", minHeight: 44, width: "100%" };

  return (
    <div
      className="ne-wrap"
      style={{
        backgroundColor: BG,
        color: P,
        fontFamily: brand.fontBody,
        padding: 16,
        maxWidth: 1080,
      }}
    >
      <style>{css}</style>
      {header}
      {content}

      <section aria-labelledby="proto-h" style={{ marginTop: 48, borderTop: rule, paddingTop: 16 }}>
        <h2 id="proto-h" style={{ ...label, color: N }}>
          Prototype states
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            maxWidth: 560,
          }}
        >
          <div>
            <label htmlFor="proto-view" style={{ ...label, color: N, fontSize: 10 }}>
              Which note
            </label>
            <select
              id="proto-view"
              value={view}
              style={selectStyle}
              onChange={(e) => resetFor(e.target.value)}
            >
              <option value="edit">Existing note (mine)</option>
              <option value="new">New note</option>
              <option value="missing">Someone else’s note id</option>
            </select>
          </div>
          <div>
            <label htmlFor="proto-server" style={{ ...label, color: N, fontSize: 10 }}>
              Server on save
            </label>
            <select
              id="proto-server"
              value={server}
              style={selectStyle}
              onChange={(e) => {
                setServer(e.target.value);
                setSaveError(null);
              }}
            >
              <option value="online">Saves normally</option>
              <option value="offline">Server unreachable</option>
              <option value="expired">Session expired</option>
            </select>
          </div>
        </div>
      </section>

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
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeConfirm();
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="del-title"
            aria-describedby="del-desc"
            onKeyDown={onDialogKey}
            className="ne-enter"
            style={{
              backgroundColor: BG,
              border: rule,
              borderRadius: 2,
              padding: 24,
              width: "100%",
              maxWidth: 440,
            }}
          >
            <p style={{ ...label, color: A }}>Permanent action</p>
            <h2
              id="del-title"
              style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 8px" }}
            >
              Delete this note?
            </h2>
            <p
              id="del-desc"
              style={{ fontSize: 15, lineHeight: 1.5, color: N, margin: "0 0 24px" }}
            >
              “{note ? note.title : title}” will be permanently deleted from your account. This
              can’t be undone.
            </p>
            <div className="ne-actions" style={{ justifyContent: "flex-end" }}>
              <button
                type="button"
                ref={cancelRef}
                className="ne-btn"
                style={btn}
                onClick={closeConfirm}
              >
                Keep note
              </button>
              <button
                type="button"
                ref={confirmRef}
                className="ne-btn"
                onClick={confirmDelete}
                style={{ ...btn, backgroundColor: A, borderColor: A, color: BG }}
              >
                <Icons.Trash width={16} height={16} aria-hidden="true" /> Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
