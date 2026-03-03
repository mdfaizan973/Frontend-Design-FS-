import { AlertTriangle, Ban, SearchAlert } from "lucide-react";

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

interface LogPart {
    text: string;
    type: string;
}

export function StatusChip({ status }: { status: Scan["status"] }) {
    const styles: Record<Scan["status"], string> = {
        Completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
        Scheduled: "bg-gray-100 text-gray-500 dark:bg-white/8 dark:text-gray-400",
        Failed: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400",
        Running: "bg-teal-100 text-teal-700 dark:bg-[#0CC8A8]/15 dark:text-[#0CC8A8]",
    };
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${styles[status]}`}>
            {status}
        </span>
    );
}

export function VulnBadges({ vuln }: { vuln: VulnCount }) {
    const items = [
        { val: vuln.critical, bg: "bg-red-500", fg: "text-white" },
        { val: vuln.high, bg: "bg-orange-500", fg: "text-white" },
        { val: vuln.medium, bg: "bg-yellow-400", fg: "text-black" },
        { val: vuln.low, bg: "bg-green-500", fg: "text-white" },
    ];
    return (
        <div className="flex items-center gap-1">
            {items.map((b, i) =>
                b.val > 0 ? (
                    <span key={i} className={`inline-flex items-center justify-center w-6 h-6 rounded text-[11px] font-bold ${b.bg} ${b.fg}`}>
                        {b.val}
                    </span>
                ) : null
            )}
        </div>
    );
}

export function ProgressBar({ value, status }: { value: number; status: Scan["status"] }) {
    const fill =
        status === "Failed" ? "bg-red-500" :
            status === "Scheduled" ? "bg-gray-300 dark:bg-white/20" :
                "bg-[#0CC8A8]";

    return (
        <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${fill}`} style={{ width: `${value}%` }} />
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">{value}%</span>
        </div>
    );
}

export function SeverityIcon({ icon, color }: { icon: string; color: string }) {
    const map: Record<string, React.ReactNode> = {
        critical: <Ban size={14} />,
        high: <AlertTriangle size={14} />,
        medium: <AlertTriangle size={14} />,
        low: <SearchAlert size={14} />,
    };
    return <span style={{ color }}>{map[icon]}</span>;
}

export function getSeverityStyles(severity: string, dark: boolean) {
    const map: Record<string, { dark: string; light: string }> = {
        Critical: {
            dark: "bg-red-500/15 text-red-400 border border-red-500/25",
            light: "bg-red-100 text-red-700 border border-red-200",
        },
        High: {
            dark: "bg-orange-500/15 text-orange-400 border border-orange-500/25",
            light: "bg-orange-100 text-orange-700 border border-orange-200",
        },
        Medium: {
            dark: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/25",
            light: "bg-yellow-100 text-yellow-700 border border-yellow-200",
        },
        Low: {
            dark: "bg-green-500/15 text-green-400 border border-green-500/25",
            light: "bg-green-100 text-green-700 border border-green-200",
        },
    };
    return dark ? map[severity]?.dark : map[severity]?.light;
}

export function LogLine({ parts, dark }: { parts: LogPart[]; dark: boolean }) {
    return (
        <>
            {parts.map((p, i) => {
                if (p.type === "link") return <span key={i} className={` ${dark ? "text-[#0CC8A8]": "text-[#ccc]"} cursor-pointer hover:underline`}>{p.text}</span>;
                if (p.type === "path") return <span key={i} className={dark ? "text-teal-300" : "text-teal-600"}>{p.text}</span>;
                if (p.type === "highlight") return <span key={i} className={dark ? "text-amber-300" : "text-amber-600"}>{p.text}</span>;
                if (p.type === "header") return <span key={i} className={dark ? "text-purple-300" : "text-purple-600"}>{p.text}</span>;
                if (p.type === "vuln") return <span key={i} className={`font-semibold ${dark ? "text-red-400" : "text-red-600"}`}>{p.text}</span>;
                return <span key={i} className="whitespace-pre-wrap">{p.text}</span>;
            })}
        </>
    );
}