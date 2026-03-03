"use client";

import { useState, useEffect, useRef } from "react";
import { Globe, GitBranch, FlaskConical, ShieldCheck, FileText, ChevronDown, X, Circle } from "lucide-react";
import { getSeverityStyles, LogLine } from "../widgets/widgets";

interface ScanDetailProps { dark: boolean; }

const STEPS = [
  { label: "Spidering", icon: Globe },
  { label: "Mapping", icon: GitBranch },
  { label: "Testing", icon: FlaskConical },
  { label: "Validating", icon: ShieldCheck },
  { label: "Reporting", icon: FileText },
];

const META = [
  { label: "Scan Type", value: "Grey Box" },
  { label: "Targets", value: "google.com" },
  { label: "Started At", value: "Nov 22, 09:00AM" },
  { label: "Credentials", value: "2 Active" },
  { label: "Files", value: "Control.pdf" },
  { label: "Checklists", value: "40/350" },
];

interface LogPart { text: string; type: string; }
interface LogEntry { time: string; parts: LogPart[]; }
interface Finding { id: number; severity: string; time: string; title: string; endpoint: string; desc: string; }

const ACTIVITY_LOG: LogEntry[] = [
  { time: "09:00:00", parts: [{ text: "I'll begin a systematic penetration test on ", type: "normal" }, { text: "helpdesk.democorp.com", type: "link" }, { text: ". Let me start with reconnaissance and enumeration.", type: "normal" }] },
  { time: "09:01:00", parts: [{ text: "Good! target is online. Now let me perform port scanning to identify running services.", type: "normal" }] },
  { time: "09:02:00", parts: [{ text: "Excellent reconnaissance results:\n  - helpdesk.democorp.com: Apache httpd 2.4.65 on port 80 (web server)\nLet me probe the web server on target first to understand its structure.", type: "normal" }] },
  { time: "09:03:00", parts: [{ text: "Great! I found a login page for a Help Desk Platform. I can see a useful comment: ", type: "normal" }, { text: '"TODO: Delete the testing account (test:test)"', type: "highlight" }, { text: ". Let me test this credential. The login redirects to ", type: "normal" }, { text: "/password/test", type: "path" }, { text: ". Let me follow that path and explore it.", type: "normal" }] },
  { time: "09:04:00", parts: [{ text: "The POST method is not allowed on /password/test. Let me check what the JavaScript does - it posts to ", type: "normal" }, { text: "'#'", type: "highlight" }, { text: " which means the current page. Let me try a different approach.", type: "normal" }] },
  { time: "09:05:00", parts: [{ text: "It redirects back to /password/test. Let me check if there's an /api endpoint or look for other paths. Let me also try exploring with the ", type: "normal" }, { text: "test:test", type: "highlight" }, { text: " password directly on other endpoints.", type: "normal" }] },
  { time: "09:06:00", parts: [{ text: "Great! I can access the dashboard using the ", type: "normal" }, { text: "'X-UserId: 10032'", type: "header" }, { text: " header. The dashboard shows \"Welcome, John Doe\". This suggests an ", type: "normal" }, { text: "**IDOR vulnerability**", type: "vuln" }, { text: " - I can access any user's dashboard by just changing the X-UserId header. Let me explore more of the application...", type: "normal" }] },
];

const VERIFICATION_LOG: LogEntry[] = [
  { time: "09:10:00", parts: [{ text: "Verifying SQL injection on ", type: "normal" }, { text: "helpdesk.democorp.com", type: "link" }, { text: " — confirming blind injection via time delay.", type: "normal" }] },
  { time: "09:12:00", parts: [{ text: "Confirmed: 5 second delay observed on payload ", type: "normal" }, { text: "'; WAITFOR DELAY '0:0:5'--", type: "highlight" }, { text: ". Database-level access verified.", type: "normal" }] },
  { time: "09:14:00", parts: [{ text: "Verifying IDOR on ", type: "normal" }, { text: "/api/auth/login", type: "path" }, { text: " — stepping through user IDs 10001-10050.", type: "normal" }] },
];

const FINDINGS: Finding[] = [
  { id: 1, severity: "Critical", time: "10:45:23", title: "SQL Injection in Authentication Endpoint", endpoint: "/api/users/profile", desc: "Time-based blind SQL injection confirmed on user-controlled input during authentication flow. Exploitation allows database-level access." },
  { id: 2, severity: "High", time: "10:45:23", title: "Unauthorized Access to User Metadata", endpoint: "/api/auth/login", desc: "Authenticated low-privilege user was able to access metadata of other users. Access control checks were missing." },
  { id: 3, severity: "Medium", time: "10:45:23", title: "Broken Authentication Rate Limiting", endpoint: "/api/search", desc: "No effective rate limiting detected on login attempts. Automated brute-force attempts possible." },
  { id: 4, severity: "High", time: "10:46:01", title: "Reflected Cross-Site Scripting (XSS)", endpoint: "/search?q=", desc: "User input reflected in response without sanitization. Attacker can execute arbitrary scripts in victim browser context." },
  { id: 5, severity: "Low", time: "10:46:44", title: "Server Version Disclosure", endpoint: "/headers", desc: "Server response headers reveal Apache version 2.4.65. This aids attackers in targeting known CVEs." },
];

export default function NewScan({ dark }: ScanDetailProps) {
  const [activeTab, setActiveTab] = useState<"activity" | "verification">("activity");
  const [minimized, setMinimized] = useState(false);
  const activeStep = 0;
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [activeTab]);

  const tp = dark ? "text-white" : "text-gray-900";
  const ts = dark ? "text-gray-400" : "text-gray-500";
  const tm = dark ? "text-gray-500" : "text-gray-400";
  const div = dark ? "border-white/8" : "border-gray-200";

  const cardBg = dark ? "bg-[#161b21] border border-white/8" : "bg-white border border-gray-200";
  const consoleBg = dark ? "bg-[#0a0f13] text-gray-300" : "bg-white text-gray-700";
  const logTime = dark ? "text-gray-600" : "text-gray-500";
  const logs = activeTab === "activity" ? ACTIVITY_LOG : VERIFICATION_LOG;

  return (
    <div className="flex flex-col gap-4 h-full" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      <div className={`${cardBg} rounded-xl overflow-hidden flex-shrink-0`}>
        <div className="flex flex-col sm:flex-row min-h-0">

          <div
            className={`flex flex-col items-center justify-center px-8 py-6 border-b sm:border-b-0 sm:border-r ${div} flex-shrink-0`}
          >
            <div className="relative w-[80px] h-[80px]">
              <div
                className={`absolute inset-0 flex flex-col items-center justify-center rounded-full ${dark ? "bg-[#0a0f13]" : "bg-[#0a0f13]"
                  }`}
              >
                <span className={`font-bold text-[16px] leading-none text-teal-300`}>
                  0%
                </span>

                <span className={`text-[11px] mt-1 font-medium ${tm}`}>
                  In Progress
                </span>
              </div>
            </div>
          </div>


          <div className="flex-1 flex flex-col min-w-0">

            <div className={`flex items-center justify-between gap-2 px-12 py-5 border-b ${div} overflow-x-auto`}>
              {STEPS.map((step, i) => {
                const isActive = i === activeStep;
                const isDone = i < activeStep;
                return (
                  <div key={step.label} className="flex flex-col items-center gap-2 flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${isActive
                        ? "border-[#0CC8A8] bg-[#0CC8A8] text-black shadow-[0_0_14px_rgba(12,200,168,0.35)]"
                        : isDone
                          ? "border-[#0CC8A8]/50 bg-[#0CC8A8]/10 text-[#0CC8A8]"
                          : dark
                            ? "border-white/15 bg-[#0a0f13] text-gray-500"
                            : "border-gray-200 bg-gray-50 text-gray-400"
                      }`}>
                      <step.icon size={15} strokeWidth={isActive ? 2.5 : 1.8} />
                    </div>
                    <span className={`text-[11px] font-medium whitespace-nowrap ${isActive ? "text-[#0CC8A8]" : ts}`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between flex-wrap gap-x-6 gap-y-3 px-12 py-4">
              {META.map((m) => (
                <div key={m.label}>
                  <p className={`text-[10px] uppercase tracking-widest font-semibold ${tm} mb-0.5`}>{m.label}</p>
                  <p className={`text-sm font-semibold ${tp}`}>{m.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`${cardBg} rounded-xl overflow-hidden flex-1 flex flex-col min-h-0`}>

        <div className={`flex items-center justify-between px-4 py-2.5 border-b ${div} flex-shrink-0`}>
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#0CC8A8] animate-pulse" />
            <span className={`text-sm font-semibold ${tp}`}>Live Scan Console</span>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${dark ? "bg-white/5 text-gray-400 border-white/8" : "bg-gray-100 text-gray-500 border-gray-200"}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Running...
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized((p) => !p)}
              className={`p-1.5 rounded-lg transition-colors ${dark ? "text-gray-500 hover:text-white hover:bg-white/6" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"}`}
            >
              <ChevronDown size={14} className={`transition-transform duration-200 ${minimized ? "rotate-180" : ""}`} />
            </button>
            <button className={`p-1.5 rounded-lg transition-colors ${dark ? "text-gray-500 hover:text-white hover:bg-white/6" : "text-gray-400 hover:text-gray-700 hover:bg-gray-100"}`}>
              <X size={14} />
            </button>
          </div>
        </div>

        {!minimized && (
          <div className="flex-1 flex flex-col lg:flex-row min-h-0">

            <div
              className="flex-1 flex flex-col min-h-0 border-b lg:border-b-0 lg:border-r"
              style={{ borderColor: dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}
            >
              <div className={`flex border-b ${div} ${dark ? "bg-[#0a0f13]" : ""} flex-shrink-0`}>
                {(["activity", "verification"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === tab
                        ? "border-[#0CC8A8] text-[#0CC8A8]"
                        : `border-transparent ${ts} ${dark ? "hover:text-white" : "hover:text-gray-900"}`
                      }`}
                  >
                    {tab === "activity" ? "Activity Log" : "Verification Loops"}
                  </button>
                ))}
              </div>

              <div
                ref={logRef}
                className={`flex-1 overflow-y-auto p-4 space-y-3.5 font-mono text-xs leading-relaxed ${consoleBg}`}
                style={{ minHeight: 0 }}
              >
                {logs.map((entry, i) => (
                  <div key={i} className="flex gap-2.5">
                    <span className={`flex-shrink-0 select-none ${logTime}`}>[{entry.time}]</span>
                    <span><LogLine parts={entry.parts} dark={dark} /></span>
                  </div>
                ))}
                <div className="flex gap-2.5">
                  <span className={`${logTime} animate-pulse`}>▋</span>
                </div>
              </div>
            </div>

            <div className={`w-full lg:w-[340px] xl:w-[380px] ${dark ? "bg-[#0a0f13]" : ""} flex flex-col flex-shrink-0`}>
              <div className={`px-4 py-2.5 border-b ${div} flex-shrink-0`}>
                <span className={`text-sm font-semibold ${tp}`}>Finding Log</span>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                {FINDINGS.map((f) => {
                  const badgeStyle = getSeverityStyles(f.severity, dark);
                  return (
                    <div
                      key={f.id}
                      className={`rounded-xl p-3.5 transition-colors ${dark ? "bg-white/[0.025] border border-white/6 hover:border-white/12" : "bg-gray-50 border border-gray-100 hover:border-gray-300"}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${badgeStyle}`}>{f.severity}</span>
                        <span className={`text-[11px] tabular-nums ${tm}`}>{f.time}</span>
                      </div>
                      <p className={`text-sm font-semibold leading-snug mb-1 ${tp}`}>{f.title}</p>
                      <p className="text-xs text-[#0CC8A8] font-mono mb-2 leading-none">{f.endpoint}</p>
                      <p className={`text-xs leading-relaxed ${ts}`}>{f.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5 border-t ${div} ${dark ? "" : "bg-white"} flex-shrink-0 text-xs`}>
        {[
          { label: "Sub-Agents", value: "0" },
          { label: "Parallel Executions", value: "2" },
          { label: "Operations", value: "1" },
        ].map((s, i) => (
          <div key={s.label} className="flex items-center gap-3">
            {i > 0 && <div className={`w-px h-3 ${dark ? "bg-white/10" : "bg-gray-200"}`} />}
            <div className="flex items-center gap-1.5">
              <Circle size={5} className="fill-[#0CC8A8] text-[#0CC8A8]" />
              <span className={ts}>{s.label}:</span>
              <span className={`font-semibold ${tp}`}>{s.value}</span>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-4 ml-auto">
          {[
            { label: "Critical", color: "#EF4444", count: 0 },
            { label: "High", color: "#F97316", count: 0 },
            { label: "Medium", color: "#FACC15", count: 0 },
            { label: "Low", color: "#22C55E", count: 0 },
          ].map((c) => (
            <div key={c.label} className="flex items-center gap-1">
              <span style={{ color: c.color }} className="font-medium">{c.label}:</span>
              <span className={`font-semibold ${tp}`}>{c.count}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}