// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import { brand } from "@/lib/brand";

const PRODUCT = "Personal note taking - auth check v1";
const SCREEN = "Login";
const mix = (colour, percent) => `color-mix(in srgb, ${colour} ${percent}%, transparent)`;

const STATUS = [
  { service: "Web application", region: "EU-West", uptime: "99.99%", latency: "82 ms", state: "Operational" },
  { service: "API", region: "EU-West", uptime: "99.98%", latency: "41 ms", state: "Operational" },
  { service: "Reporting", region: "US-East", uptime: "99.95%", latency: "120 ms", state: "Operational" },
  { service: "File storage", region: "US-East", uptime: "99.99%", latency: "63 ms", state: "Operational" },
  { service: "Notifications", region: "Global", uptime: "99.90%", latency: "210 ms", state: "Degraded" },
];

export default function Screen() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [signedIn, setSignedIn] = React.useState(false);
  const rule = `2px solid ${brand.primaryColor}`;
  const field = { border: rule, borderRadius: brand.radius, height: 44 };

  return (
    <div className="flex min-h-screen flex-col bg-white" style={{ color: brand.primaryColor, fontFamily: brand.fontBody }}>
      <header className="flex items-center justify-between px-10 py-5" style={{ borderBottom: rule }}>
        <p className="text-lg font-bold tracking-tight" style={{ fontFamily: brand.fontHeading }}>{PRODUCT}</p>
        <p className="text-xs font-semibold uppercase tracking-[0.18em]">Enterprise workspace</p>
      </header>

      <div className="grid flex-1 grid-cols-[440px_minmax(0,1fr)]">
        <main className="flex flex-col justify-center px-10 py-12" style={{ borderRight: rule }}>
          <h1 className="text-4xl font-bold tracking-tight" style={{ fontFamily: brand.fontHeading }}>{SCREEN}</h1>
          <p className="mt-2 text-sm" style={{ color: brand.neutralColor }}>Use your company account.</p>
          {signedIn ? (
            <p role="status" className="mt-10 px-4 py-3 text-sm font-semibold" style={{ border: rule }}>
              Signed in as {email}.
            </p>
          ) : (
            <form className="mt-10 space-y-5" onSubmit={(e) => { e.preventDefault(); setSignedIn(true); }}>
              <div className="space-y-2">
                <label htmlFor="corp-email" className="block text-[11px] font-bold uppercase tracking-[0.16em]">Work email</label>
                <input id="corp-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white px-3 text-sm outline-none focus:ring-2" style={field} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label htmlFor="corp-password" className="block text-[11px] font-bold uppercase tracking-[0.16em]">Password</label>
                  <button type="button" className="text-[11px] font-bold uppercase tracking-[0.16em] underline">Reset</button>
                </div>
                <input id="corp-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white px-3 text-sm outline-none focus:ring-2" style={field} />
              </div>
              <button type="submit" className="h-11 w-full text-sm font-bold uppercase tracking-[0.16em] text-white" style={{ backgroundColor: brand.primaryColor, borderRadius: brand.radius }}>
                Sign in
              </button>
              <button type="button" className="h-11 w-full text-sm font-bold uppercase tracking-[0.16em]" style={{ border: rule, borderRadius: brand.radius }}>
                Continue with SSO
              </button>
            </form>
          )}
        </main>

        <section aria-label="Service status" className="px-10 py-12">
          <div className="flex items-baseline justify-between pb-3" style={{ borderBottom: rule }}>
            <h2 className="text-sm font-bold uppercase tracking-[0.16em]">Service status</h2>
            <p className="text-xs tabular-nums" style={{ color: brand.neutralColor }}>Last 90 days · updated 08:00 UTC</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-[0.14em]" style={{ color: brand.neutralColor }}>
                <th scope="col" className="py-2 font-bold">Service</th>
                <th scope="col" className="py-2 font-bold">Region</th>
                <th scope="col" className="py-2 text-right font-bold">Uptime</th>
                <th scope="col" className="py-2 text-right font-bold">Latency</th>
                <th scope="col" className="py-2 text-right font-bold">State</th>
              </tr>
            </thead>
            <tbody>
              {STATUS.map((row) => (
                <tr key={row.service} style={{ borderTop: `1px solid ${mix(brand.primaryColor, 18)}` }}>
                  <td className="py-2.5 font-semibold">{row.service}</td>
                  <td className="py-2.5">{row.region}</td>
                  <td className="py-2.5 text-right tabular-nums">{row.uptime}</td>
                  <td className="py-2.5 text-right tabular-nums">{row.latency}</td>
                  <td className="py-2.5 text-right">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                      <span aria-hidden className="h-2 w-2" style={{ backgroundColor: row.state === "Operational" ? brand.primaryColor : brand.accentColor }} />
                      {row.state}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-10 pt-3 text-xs" style={{ borderTop: rule, color: brand.neutralColor }}>
            SOC 2 Type II · ISO 27001 · Data hosted in the EU
          </p>
        </section>
      </div>
    </div>
  );
}
