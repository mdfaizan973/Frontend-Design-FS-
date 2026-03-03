import { Columns3, Filter, Plus, RefreshCw, Search, TrendingDown, TrendingUp } from 'lucide-react';
import React, { useRef, useState } from 'react'

import { ProgressBar, SeverityIcon, StatusChip, VulnBadges } from "../widgets/widgets";
import NewScan from "../components/NewScan";
import Projects from "../components/Projects";
import Schedule from "../components/Schedule";

interface ProjectsProps {
    dark: boolean;
}

interface VulnCount {
    critical: number;
    high: number;
    medium: number;
    low: number;
}

interface Scan {
    id: string;
    name: string;
    type: "Greybox" | "Blackbox" | "Whitebox";
    status: "Completed" | "Scheduled" | "Failed" | "Running";
    progress: number;
    vuln: VulnCount;
    lastScan: string;
    target: string;
}


const SCANS: Scan[] = [

    { id: "s1", name: "Web App Servers", type: "Greybox", status: "Completed", progress: 100, vuln: { critical: 5, high: 12, medium: 23, low: 18 }, lastScan: "4d ago", target: "192.168.1.0/24" },
    { id: "s2", name: "Web App Servers", type: "Greybox", status: "Completed", progress: 100, vuln: { critical: 5, high: 12, medium: 23, low: 18 }, lastScan: "4d ago", target: "app.acme.com" },
    { id: "s3", name: "Web App Servers", type: "Greybox", status: "Completed", progress: 100, vuln: { critical: 5, high: 12, medium: 23, low: 18 }, lastScan: "4d ago", target: "api.acme.com" },
    { id: "s4", name: "Web App Servers", type: "Greybox", status: "Completed", progress: 100, vuln: { critical: 5, high: 12, medium: 23, low: 18 }, lastScan: "4d ago", target: "admin.acme.com" },
    { id: "s5", name: "Web App Servers", type: "Greybox", status: "Completed", progress: 100, vuln: { critical: 5, high: 12, medium: 23, low: 18 }, lastScan: "4d ago", target: "portal.acme.com" },
    { id: "s6", name: "Mail Server", type: "Greybox", status: "Scheduled", progress: 0, vuln: { critical: 0, high: 0, medium: 0, low: 0 }, lastScan: "Pending", target: "mail.acme.com" },
    { id: "s7", name: "CDN Network", type: "Greybox", status: "Completed", progress: 100, vuln: { critical: 2, high: 7, medium: 12, low: 10 }, lastScan: "6d ago", target: "cdn.acme.com" },
    { id: "s8", name: "Internal Dashboard", type: "Greybox", status: "Running", progress: 45, vuln: { critical: 1, high: 3, medium: 6, low: 5 }, lastScan: "30m ago", target: "dash.internal" },
    { id: "s9", name: "Payment Gateway", type: "Whitebox", status: "Completed", progress: 100, vuln: { critical: 4, high: 8, medium: 13, low: 6 }, lastScan: "1d ago", target: "pay.acme.com" },
    { id: "s10", name: "IoT Devices", type: "Blackbox", status: "Failed", progress: 22, vuln: { critical: 2, high: 4, medium: 7, low: 3 }, lastScan: "3d ago", target: "10.0.0.0/16" },
    { id: "s11", name: "Staging Servers", type: "Greybox", status: "Completed", progress: 100, vuln: { critical: 3, high: 6, medium: 11, low: 8 }, lastScan: "2d ago", target: "staging.acme.com" },
    { id: "s12", name: "Inventory API", type: "Whitebox", status: "Completed", progress: 100, vuln: { critical: 1, high: 5, medium: 9, low: 6 }, lastScan: "4d ago", target: "inventory.acme.com" },
    { id: "s13", name: "Proxy Layer", type: "Greybox", status: "Scheduled", progress: 0, vuln: { critical: 0, high: 0, medium: 0, low: 0 }, lastScan: "Pending", target: "proxy.acme.com" },
    { id: "s14", name: "CRM System", type: "Blackbox", status: "Completed", progress: 100, vuln: { critical: 2, high: 9, medium: 15, low: 11 }, lastScan: "5d ago", target: "crm.acme.com" },
    { id: "s15", name: "Mobile API", type: "Blackbox", status: "Running", progress: 59, vuln: { critical: 1, high: 4, medium: 6, low: 3 }, lastScan: "2h ago", target: "mapi.acme.com" },
    { id: "s16", name: "Analytics Engine", type: "Greybox", status: "Completed", progress: 100, vuln: { critical: 3, high: 8, medium: 14, low: 9 }, lastScan: "6d ago", target: "analytics.acme.com" },
    { id: "s17", name: "Backup Servers", type: "Whitebox", status: "Scheduled", progress: 0, vuln: { critical: 0, high: 0, medium: 0, low: 0 }, lastScan: "Pending", target: "backup.acme.com" },
    { id: "s18", name: "HR Management", type: "Greybox", status: "Completed", progress: 100, vuln: { critical: 1, high: 2, medium: 5, low: 7 }, lastScan: "7d ago", target: "hr.internal" },
    { id: "s19", name: "Temp Environment", type: "Blackbox", status: "Failed", progress: 18, vuln: { critical: 2, high: 3, medium: 4, low: 2 }, lastScan: "3d ago", target: "temp.acme.com" },
    { id: "s20", name: "Public Website", type: "Blackbox", status: "Completed", progress: 100, vuln: { critical: 5, high: 12, medium: 18, low: 13 }, lastScan: "4d ago", target: "acme.com" },
    { id: "s21", name: "Core Web Servers", type: "Greybox", status: "Completed", progress: 100, vuln: { critical: 4, high: 11, medium: 20, low: 15 }, lastScan: "3d ago", target: "192.168.1.0/24" },
    { id: "s22", name: "API Gateway", type: "Greybox", status: "Completed", progress: 100, vuln: { critical: 3, high: 9, medium: 17, low: 12 }, lastScan: "2d ago", target: "api.acme.com" },
    { id: "s23", name: "Admin Portal", type: "Whitebox", status: "Running", progress: 68, vuln: { critical: 2, high: 5, medium: 8, low: 4 }, lastScan: "1h ago", target: "admin.acme.com" },
    { id: "s24", name: "Customer Portal", type: "Whitebox", status: "Completed", progress: 100, vuln: { critical: 5, high: 10, medium: 14, low: 9 }, lastScan: "4d ago", target: "customers.acme.com" },
    { id: "s25", name: "Auth Service", type: "Blackbox", status: "Completed", progress: 100, vuln: { critical: 1, high: 6, medium: 9, low: 7 }, lastScan: "5d ago", target: "auth.acme.com" },
];

const ORG_INFO = [
    { label: "Org", value: "Project X" },
    { label: "Owner", value: "Nammagiri" },
    { label: "Total Scans", value: 100 },
    { label: "Scheduled", value: 1000 },
    { label: "Rescans", value: 100 },
    { label: "Failed Scans", value: 100 },
];

const SEVERITY_STATS = [
    { label: "Critical Severity", count: 86, change: "+2%", up: true, icon: "critical", color: "#EF4444" },
    { label: "High Severity", count: 16, change: "+0.9%", up: true, icon: "high", color: "#F97316" },
    { label: "Medium Severity", count: 26, change: "-0.9%", up: false, icon: "medium", color: "#FACC15" },
    { label: "Low Severity", count: 16, change: "+0.9%", up: true, icon: "low", color: "#224ec5" },
];



export default function Listing({ dark }: ProjectsProps) {

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    const filtered = SCANS.filter((s) => {
        const q = search.toLowerCase();
        const matchSearch =
            s.name.toLowerCase().includes(q) ||
            s.type.toLowerCase().includes(q) ||
            s.target.toLowerCase().includes(q);
        const matchStatus = statusFilter === "All" || s.status === statusFilter;
        return matchSearch && matchStatus;
    });


    const tp = dark ? "text-white" : "text-gray-900";
    const ts = dark ? "text-gray-400" : "text-gray-500";
    const tm = dark ? "text-gray-600" : "text-gray-400";
    const div = dark ? "border-white/8" : "border-gray-200";


    const inputCls = dark
        ? "bg-[#161b21] border-white/10 text-white placeholder-gray-500 focus:border-[#0CC8A8]"
        : "bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#0CC8A8]";
    const theadCls = dark
        ? "bg-[#161b21] text-gray-500 border-b border-white/6"
        : "bg-gray-50 text-gray-400 border-b border-gray-200";
    const rowCls = dark
        ? "border-b border-white/5 hover:bg-white/[0.03]"
        : "border-b border-gray-100 hover:bg-gray-50/80";


    return (
        <>
            <div className="flex-1 overflow-y-auto ">
                <div className="px-4 sm:px-5 py-4 space-y-4">
                    <div className={`${dark ? "bg-[#161b21]" : "bg-white"} overflow-hidden rounded-md`}>

                        <div className={`flex items-center gap-0 px-4 mt-2 mb-1 sm:px-5  flex-shrink-0 overflow-x-auto`}>
                            <div className="flex items-center justify-between gap-4 py-2.5 text-sm whitespace-nowrap w-full pr-4">
                                {ORG_INFO.map((item, i) => (
                                    <div key={item.label} className="flex items-center gap-4">
                                        {i > 0 && (
                                            <div className={`w-px h-4 flex-shrink-0 ${dark ? "bg-white/20" : "bg-gray-200"}`} />
                                        )}

                                        <div className="flex items-center gap-1.5">
                                            <span className={tm}>{item.label}:</span>
                                            <span className={`font-semibold ${tp}`}>{item.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex items-center gap-1.5 ml-auto pl-4 py-2.5 whitespace-nowrap flex-shrink-0">
                                <RefreshCw size={11} className="text-[#0CC8A8]" />
                                <span className={`text-sm ${tm}`}>10 mins ago</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
                            {SEVERITY_STATS.map((s) => (
                                <div key={s.label} className={`${dark ? "" : "bg-white"} px-4 py-4 px-4 sm:px-5 py-4 space-y-4`}>
                                    <div className="flex items-center justify-between mb-2.5">
                                        <span className={`text-sm ${ts}`}>{s.label}</span>

                                        <div
                                            className="w-6 h-6 flex items-center justify-center rounded-md"
                                            style={{ backgroundColor: `${s.color}20` }}
                                        >
                                            <SeverityIcon icon={s.icon} color={s.color} />
                                        </div>
                                    </div>
                                    <div className="flex items-end gap-2 flex-wrap">
                                        <span className={`text-3xl font-bold leading-none ${tp}`}>{s.count}</span>
                                        <div className={`flex items-center gap-0.5 text-xs font-medium pb-0.5 ${s.up ? "text-emerald-500" : "text-red-400"}`}>
                                            {s.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                                            {s.change} than yesterday
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`${dark ? "bg-[#161b21]" : "bg-white"} rounded-xl overflow-hidden`}>

                        <div className={`flex flex-wrap items-center gap-2.5 px-4 sm:px-5 py-3 border-b ${div}`}>
                            <div className="relative flex-1 min-w-[160px]">
                                <Search size={13} className={`absolute left-3 top-1/2 -translate-y-1/2 ${tm}`} />
                                <input
                                    type="text"
                                    placeholder="Search scans by name or type..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className={`w-full pl-8 pr-3 py-2 rounded-md border text-sm outline-none transition-all focus:ring-2 focus:ring-[#0CC8A8]/15 ${inputCls}`}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="relative" ref={filterRef}>
                                    <button
                                        onClick={() => setShowFilterMenu((p) => !p)}
                                        className={`flex cursor-pointer items-center gap-1.5 px-3 py-2 rounded-md border text-sm font-medium transition-all ${dark ? "border-white/10 text-gray-400 hover:bg-white/5 hover:text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                                    >
                                        <Filter size={13} />
                                        Filter
                                        {statusFilter !== "All" && (
                                            <span className="ml-1 w-4 h-4 rounded-full bg-[#0CC8A8] text-black text-[10px] font-bold flex items-center justify-center leading-none">
                                                1
                                            </span>
                                        )}
                                    </button>
                                    {showFilterMenu && (
                                        <div
                                            className={`absolute top-full left-20 mt-2 z-20 py-1 rounded-xl border shadow-xl w-44 sm:w-40 left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 ${dark ? "bg-[#1a1a1a] border-white/10" : "bg-white border-gray-200"}`}
                                        >
                                            {["All", "Completed", "Running", "Scheduled", "Failed"].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => {
                                                        setStatusFilter(s);
                                                        setShowFilterMenu(false);
                                                    }}
                                                    className={`w-full cursor-pointer text-left px-4 py-2 text-sm transition-colors ${statusFilter === s
                                                        ? "text-[#0CC8A8] font-semibold"
                                                        : dark
                                                            ? "text-gray-400 hover:text-white hover:bg-white/5"
                                                            : "text-gray-700 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button className={`flex cursor-pointer items-center gap-1.5 px-3 py-2 rounded-md border text-sm font-medium transition-all ${dark ? "border-white/10 text-gray-400 hover:bg-white/5 hover:text-white" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                                    <Columns3 size={13} />
                                    <span className="">Column</span>
                                </button>

                                <button className="flex cursor-pointer items-center gap-1.5 px-3 sm:px-4 py-2 rounded-md bg-[#0CC8A8] hover:bg-[#0ab898] text-white text-sm font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0">
                                    <Plus size={14} strokeWidth={2.5} />
                                    <span className="">New scan</span>
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className={theadCls}>
                                        <th className="text-left px-5 py-3 text-xs font-semibold tracking-wide whitespace-nowrap">Scan Name</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap">Type</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap">Status</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap">Progress</th>
                                        <th className="text-left px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap">Vulnerability</th>
                                        <th className="text-right px-5 py-3 text-xs font-semibold tracking-wide whitespace-nowrap">Last Scan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filtered.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className={`text-center py-14 text-sm ${tm}`}>
                                                No scans match your search.
                                            </td>
                                        </tr>
                                    ) : (
                                        filtered.map((scan) => (
                                            <tr
                                                key={scan.id}
                                                className={`${rowCls} cursor-pointer transition-colors group`}
                                            >
                                                <td className="px-5 py-3.5 whitespace-nowrap">
                                                    <span className={`font-medium ${tp} group-hover:text-[#0CC8A8] transition-colors`}>
                                                        {scan.name}
                                                    </span>
                                                </td>
                                                <td className={`px-4 py-3.5 whitespace-nowrap ${ts}`}>{scan.type}</td>
                                                <td className="px-4 py-3.5 whitespace-nowrap">
                                                    <StatusChip status={scan.status} />
                                                </td>
                                                <td className="px-4 py-3.5 whitespace-nowrap">
                                                    <ProgressBar value={scan.progress} status={scan.status} />
                                                </td>
                                                <td className="px-4 py-3.5 whitespace-nowrap">
                                                    <VulnBadges vuln={scan.vuln} />
                                                </td>
                                                <td className={`px-5 py-3.5 text-right text-xs whitespace-nowrap tabular-nums ${tm}`}>
                                                    {scan.lastScan}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className={`px-5 py-3 border-t ${div}`}>
                            <span className={`text-xs ${tm}`}>
                                {filtered.length} of {SCANS.length} scans
                                {statusFilter !== "All" && ` · ${statusFilter}`}
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}
