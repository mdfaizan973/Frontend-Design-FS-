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

