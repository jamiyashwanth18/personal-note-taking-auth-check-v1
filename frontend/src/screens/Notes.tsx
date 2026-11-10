// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";
import { useAuth } from "@/lib/auth";

 
const { Label, Select, Table, THead, TBody, TR, TH, TD, Avatar, Empty } = UI;
 
const { Plus, Check, ChevronRight, Clock, AlertCircle } = Icons;

const NOTES = [
  {
    id: "a3f1",
    title: "Q4 budget review – questions for Marta",
    body: "Ask about the contractor line (still 18% over). Confirm whether the Lisbon offsite is in Q4 or pushed to Q1. Get the revised headcount sheet before Thursday.",
    updated_at: "2026-11-10T09:42:00",
  },
  {
    id: "b72c",
    title: "Flat – landlord call",
    body: "Boiler service booked for 17 Nov, 8–12. Ask again about the damp patch in the hallway. Deposit statement due by end of month.",
    updated_at: "2026-11-09T18:05:00",
  },
  {
    id: "c09d",
    title: "Reading list",
    body: "Designing Data-Intensive Applications (ch. 5–7). The Mythical Man-Month. Working in Public. Return library copy of Thinking in Systems by 21 Nov.",
    updated_at: "2026-11-07T21:30:00",
  },
  {
    id: "d514",
    title: "Snippet: escape HTML in templates",
    body: 'Test string: <script>alert("x")</script> must render as literal text. Check that titles with <b>bold</b> are not interpreted either.',
    updated_at: "2026-11-06T11:12:00",
  },
  {
    id: "e8a0",
    title: "Trip – Porto, 12–15 Dec",
    body: "Flights booked (TP 1941 out, TP 1948 back). Hotel near Ribeira, 3 nights. Still to do: dinner reservation Saturday, check train to Douro.",
    updated_at: "2026-11-03T08:20:00",
  },
  {
    id: "f1b6",
    title: "Weekly review template",
    body: "What shipped. What slipped and why. One thing to stop doing. Top three for next week. Keep under 15 minutes.",
    updated_at: "2026-10-28T16:48:00",
  },
  {
    id: "g27e",
    title: "Passwords I need to rotate",
    body: "Router admin, shared streaming account, old gym portal. Move everything else into the manager by end of year.",
    updated_at: "2026-10-19T13:02:00",
  },
  {
    id: "h93k",
    title: "Gift ideas – Dad, 60th",
    body: "Restored film camera? Fishing weekend in Alentejo. Framed map of the village. Ask Inês what he mentioned in August.",
    updated_at: "2026-09-30T19:55:00",
  },
];

const TODAY = "2026-11-10";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmtDate(iso) {
  const d = new Date(iso);
  const day = iso.slice(0, 10);
  const t = new Date(TODAY + "T00:00:00");
  const diff = Math.round((t - new Date(day + "T00:00:00")) / 86400000);
  const time = iso.slice(11, 16);
  const date = d.getDate() + " " + MONTHS[d.getMonth()] + " " + d.getFullYear();
  if (diff === 0) return { main: "Today", time, date };
  if (diff === 1) return { main: "Yesterday", time, date };
  return { main: date, time, date };
}

export default function Screen() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { Button, Label, Select, Table, THead, TBody, TR, TH, TD, Avatar, Empty } = UI;
  const { Plus, ChevronRight, AlertCircle, Clock } = Icons;

  const [loading, setLoading] = React.useState(true);
  const [outcome, setOutcome] = React.useState("ready");

  React.useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(t);
  }, [loading]);

  const notes = React.useMemo(
    () => [...NOTES].sort((a, b) => b.updated_at.localeCompare(a.updated_at)),
    [],
  );
  const shown = outcome === "empty" ? [] : notes;

  const P = brand.primaryColor;
  const rootVars = {
    "--p": brand.primaryColor,
    "--a": brand.accentColor,
    "--n": brand.neutralColor,
    "--bg": brand.backgroundColor,
    fontFamily: brand.fontBody,
    color: P,
    backgroundColor: brand.backgroundColor,
  };

  const label = {
    fontSize: 11,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 700,
  };
  const btnBase = {
    borderRadius: brand.radius,
    border: "2px solid " + P,
    minHeight: 44,
    padding: "0 16px",
    fontWeight: 700,
    fontSize: 13,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
  };
  const primaryBtn = { ...btnBase, backgroundColor: P, color: brand.backgroundColor };
  const ghostBtn = { ...btnBase, backgroundColor: brand.backgroundColor, color: P };

  const openNote = () => navigate("note-editor");
  const retry = () => {
    setOutcome("ready");
    setLoading(true);
  };

  return (
    <div style={rootVars} className="nl-root">
      <style>{`
        .nl-root button:focus-visible, .nl-root select:focus-visible { outline: 2px solid var(--a); outline-offset: 2px; }
        .nl-btn:hover { background-color: var(--n) !important; border-color: var(--n) !important; color: var(--bg) !important; }
        .nl-ghost:hover { background-color: var(--p) !important; color: var(--bg) !important; }
        .nl-btn:active, .nl-ghost:active { transform: translateY(1px); }
        .nl-row { cursor: pointer; }
        .nl-row td { transition: background-color .12s, color .12s; }
        .nl-row:hover td, .nl-row:focus-within td { background-color: var(--p); color: var(--bg) !important; }
        .nl-row:hover td *, .nl-row:focus-within td * { color: var(--bg) !important; }
        .nl-title { background: none; border: 0; padding: 0; text-align: left; font: inherit; font-weight: 700; color: inherit; cursor: pointer; }
        .nl-title:focus-visible { outline: 2px solid var(--a); outline-offset: 4px; }
        @keyframes nl-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
        @keyframes nl-pulse { 0%,100% { opacity: .25; } 50% { opacity: .55; } }
        .nl-row { animation: nl-in .25s ease both; }
        .nl-skel { animation: nl-pulse 1.2s ease-in-out infinite; background: var(--p); height: 12px; }
        @media (prefers-reduced-motion: reduce) {
          .nl-row, .nl-skel { animation: none; }
          .nl-row td, .nl-btn, .nl-ghost { transition: none; }
        }
      `}</style>

      <div className="mx-auto w-full" style={{ maxWidth: 1040, padding: "24px 16px 48px" }}>
        <header
          className="flex flex-wrap items-start justify-between gap-4"
          style={{ paddingBottom: 16, borderBottom: "2px solid " + P }}
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
              className="nl-ghost"
              style={ghostBtn}
              onClick={async () => {
                await signOut();
                navigate("login");
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
          <p
            aria-live="polite"
            style={{
              margin: 0,
              fontSize: 14,
              color: brand.neutralColor,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {loading
              ? "Loading your notes…"
              : outcome === "error"
                ? "Notes unavailable"
                : shown.length === 0
                  ? "0 notes"
                  : shown.length + " notes · newest updated first · visible only to you"}
          </p>
          {!(outcome === "empty" && !loading) && (
            <button type="button" className="nl-btn" style={primaryBtn} onClick={openNote}>
              <Plus size={16} aria-hidden="true" /> New note
            </button>
          )}
        </div>

        {loading && (
          <div role="status" aria-busy="true" style={{ borderTop: "2px solid " + P }}>
            <span className="sr-only" style={{ position: "absolute", left: -9999 }}>
              Loading your notes
            </span>
            {[60, 45, 72, 38, 55].map((w, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4"
                style={{ padding: "16px 8px", borderBottom: "1px solid " + P }}
              >
                <div
                  className="nl-skel"
                  style={{ width: w + "%", animationDelay: i * 0.1 + "s" }}
                />
                <div className="nl-skel" style={{ width: 88, animationDelay: i * 0.1 + "s" }} />
              </div>
            ))}
          </div>
        )}

        {!loading && outcome === "error" && (
          <div
            role="alert"
            style={{
              border: "2px solid " + P,
              borderLeft: "8px solid " + brand.accentColor,
              padding: 24,
            }}
          >
            <div className="flex items-center gap-2" style={{ color: brand.accentColor, ...label }}>
              <AlertCircle size={16} aria-hidden="true" /> Couldn't load notes
            </div>
            <h2
              style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", margin: "8px 0" }}
            >
              The server didn't answer.
            </h2>
            <p style={{ margin: "0 0 16px", fontSize: 14, lineHeight: 1.5, maxWidth: 520 }}>
              Your notes are stored safely; we just couldn't reach them (GET /notes timed out).
              Nothing was changed or deleted. Check your connection and try again.
            </p>
            <button type="button" className="nl-btn" style={primaryBtn} onClick={retry}>
              Try again
            </button>
          </div>
        )}

        {!loading && outcome === "empty" && (
          <div
            style={{
              borderTop: "2px solid " + P,
              borderBottom: "2px solid " + P,
              padding: "32px 8px",
            }}
          >
            <Empty
              title="You haven't written any notes yet"
              description="Notes are private to your account and plain text only. Start with a title and a few lines."
              action={
                <button type="button" className="nl-btn" style={primaryBtn} onClick={openNote}>
                  <Plus size={16} aria-hidden="true" /> New note
                </button>
              }
            />
          </div>
        )}

        {!loading && outcome === "ready" && (
          <Table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <caption className="sr-only" style={{ position: "absolute", left: -9999 }}>
              Your notes, most recently updated first
            </caption>
            <THead>
              <TR style={{ borderTop: "2px solid " + P, borderBottom: "2px solid " + P }}>
                <TH scope="col" style={{ ...label, textAlign: "left", padding: "12px 8px" }}>
                  Title
                </TH>
                <TH
                  scope="col"
                  className="hidden md:table-cell"
                  style={{ ...label, textAlign: "left", padding: "12px 8px" }}
                >
                  Preview
                </TH>
                <TH
                  scope="col"
                  style={{
                    ...label,
                    textAlign: "right",
                    padding: "12px 8px",
                    whiteSpace: "nowrap",
                  }}
                >
                  Updated
                </TH>
                <TH scope="col" style={{ width: 32, padding: "12px 8px" }}>
                  <span className="sr-only" style={{ position: "absolute", left: -9999 }}>
                    Open
                  </span>
                </TH>
              </TR>
            </THead>
            <TBody>
              {shown.map((n, i) => {
                const f = fmtDate(n.updated_at);
                return (
                  <TR
                    key={n.id}
                    className="nl-row"
                    onClick={openNote}
                    style={{ borderBottom: "1px solid " + P, animationDelay: i * 30 + "ms" }}
                  >
                    <TD
                      style={{
                        padding: "12px 8px",
                        fontSize: 14,
                        verticalAlign: "middle",
                        maxWidth: 320,
                      }}
                    >
                      <button
                        type="button"
                        className="nl-title"
                        onClick={(e) => {
                          e.stopPropagation();
                          openNote();
                        }}
                      >
                        {n.title}
                      </button>
                      <div
                        className="md:hidden"
                        style={{
                          fontSize: 13,
                          color: brand.neutralColor,
                          marginTop: 4,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {n.body}
                      </div>
                    </TD>
                    <TD
                      className="hidden md:table-cell"
                      style={{
                        padding: "12px 8px",
                        fontSize: 13,
                        color: brand.neutralColor,
                        maxWidth: 420,
                      }}
                    >
                      <div
                        style={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {n.body}
                      </div>
                    </TD>
                    <TD
                      style={{
                        padding: "12px 8px",
                        fontSize: 13,
                        textAlign: "right",
                        whiteSpace: "nowrap",
                        verticalAlign: "middle",
                      }}
                    >
                      <time dateTime={n.updated_at} title={f.date + ", " + f.time}>
                        <span style={{ fontWeight: 700 }}>{f.main}</span>
                        <span style={{ color: brand.neutralColor, display: "block" }}>
                          {f.time}
                        </span>
                      </time>
                    </TD>
                    <TD style={{ padding: "12px 8px", verticalAlign: "middle" }} aria-hidden="true">
                      <ChevronRight size={16} aria-hidden="true" />
                    </TD>
                  </TR>
                );
              })}
            </TBody>
          </Table>
        )}

        <footer
          className="flex flex-wrap items-end justify-between gap-4"
          style={{ marginTop: 48, paddingTop: 16, borderTop: "2px solid " + P }}
        >
          <p
            className="flex items-center gap-2"
            style={{ margin: 0, fontSize: 12, color: brand.neutralColor }}
          >
            <Clock size={14} aria-hidden="true" /> Editing a note moves it to the top of this list.
          </p>
          <div style={{ minWidth: 200 }}>
            <Label
              htmlFor="nl-preview"
              style={{
                ...label,
                fontSize: 10,
                color: brand.neutralColor,
                display: "block",
                marginBottom: 4,
              }}
            >
              Prototype: preview state
            </Label>
            <Select
              id="nl-preview"
              value={loading ? "loading" : outcome}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "loading") {
                  setOutcome("ready");
                  setLoading(true);
                } else {
                  setLoading(false);
                  setOutcome(v);
                }
              }}
              style={{
                border: "2px solid " + P,
                borderRadius: brand.radius,
                minHeight: 36,
                padding: "0 8px",
                fontSize: 13,
                width: "100%",
                backgroundColor: brand.backgroundColor,
                color: P,
              }}
            >
              <option value="ready">8 notes</option>
              <option value="empty">No notes yet</option>
              <option value="loading">Loading</option>
              <option value="error">Load error</option>
            </Select>
          </div>
        </footer>
      </div>
    </div>
  );
}
