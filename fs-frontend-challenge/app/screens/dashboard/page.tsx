"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderOpen,
  ScanLine,
  Calendar,
  Bell,
  Settings,
  HelpCircle,
  ChevronRight,
  Search,
  Filter,
  Columns3,
  Plus,
  RefreshCw,
  AlertCircle,
  AlertTriangle,
  Info,
  Menu,
  X,
  Sun,
  Moon,
  Download,
  StopCircle,
  TrendingUp,
  TrendingDown,
  LogOut,
} from "lucide-react";
import Listing from "../components/Listing";


interface StoredUser {
  firstName: string;
  lastName: string;
  email: string;
}



const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Projects", icon: FolderOpen },
  { label: "Scans", icon: ScanLine },
  { label: "Schedule", icon: Calendar },
];

const NAV_BOTTOM = [
  { label: "Notifications", icon: Bell },
  { label: "Settings", icon: Settings },
  { label: "Support", icon: HelpCircle },
];
export default function ScanListPage() {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [dark, setDark] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);


  useEffect(() => {
    const stored = localStorage.getItem("aps_user");
    if (!stored) { router.push("/"); return; }
    setUser(JSON.parse(stored));
    setDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
  }, [router]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);


  function handleLogout() {
    localStorage.removeItem("aps_user");
    router.push("/");
  }


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
    <div
      className={`h-screen w-screen flex overflow-hidden ${dark ? "bg-[#0a0f13] text-white" : "bg-[#F5F5F5] text-gray-900"}`}
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[200px] flex flex-col border-r ${div} ${dark ? "bg-[#0a0f13]" : "bg-white"} transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:inset-auto `}
      >

        <header className={`flex items-center gap-2.5 px-5 py-[17px]`}>
          <div className="w-6 h-6 rounded-full bg-[#0CC8A8]/20 border border-[#0CC8A8]/30 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0CC8A8]" />
          </div>

          <h1 className={`text-sm font-bold tracking-wide ${tp}`}>aps</h1>

          <button
            className="ml-auto lg:hidden cursor-pointer"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={15} className={ts} />
          </button>
        </header>

        <nav className="flex-1 px-3 py-3 overflow-y-auto">

          <ul className="space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const active = activeNav === item.label;

              return (
                <li key={item.label}>
                  <button
                    onClick={() => {
                      setActiveNav(item.label);
                      setSidebarOpen(false);
                    }}
                    className={`w-full cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-3xl text-sm font-medium transition-all duration-150 text-left cursor-pointer
                       ${active
                        ? "bg-[#0CC8A8]/12 text-[#0CC8A8]"
                        : `${ts} ${dark
                          ? "hover:bg-white/5 hover:text-white"
                          : "hover:bg-gray-100 hover:text-gray-900"
                        }`
                      }
              `}
                  >
                    <item.icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>


          <ul className={`space-y-0.5 mt-4 pt-4 border-t ${div}`}>
            {NAV_BOTTOM.map((item) => (
              <li key={item.label}>
                <button className={` w-full cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-3xl text-sm font-medium transition-all duration-150 text-left
                  ${ts} ${dark
                    ? "hover:bg-white/5 hover:text-white"
                    : "hover:bg-gray-100 hover:text-gray-900"
                  }
            `}
                >
                  <item.icon size={16} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>


          <ul className="mt-2">
            <li>
              <button
                onClick={handleLogout}
                className="w-full cursor-pointer flex items-center gap-3 px-3 py-2.5 rounded-3xl text-sm font-medium transition-all duration-150 text-left text-red-500 hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut size={16} strokeWidth={1.8} />
                <span>Log out</span>
              </button>
            </li>
          </ul>
        </nav>


        <section className={`mt-auto px-4 py-3.5 border-t ${div}`}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-xs font-bold text-white">
              {user ? `${user.firstName[0]} ${user.lastName[0]}`.toUpperCase() : "user"}
            </div>

            <div className="min-w-0 flex-1">
              <p className={`text-xs font-medium truncate ${tp}`}>
                {user
                  ? `${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}`
                  : "user"}
              </p>
              <p className={`text-[11px] ${tm}`}>Security Lead</p>
            </div>

            <ChevronRight size={13} className={`${tm}`} />
          </div>
        </section>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        <header className={`flex items-center gap-3 px-4 sm:px-5 py-3 border-b ${div} ${dark ? "bg-[#0a0f13]" : "bg-white"} flex-shrink-0`}>
          <button className="lg:hidden cursor-pointer flex-shrink-0 p-1" onClick={() => setSidebarOpen(true)}>
            <Menu size={18} className={ts} />
          </button>

          <nav className="flex items-center gap-1 text-sm flex-1 min-w-0">
            <span className={`font-semibold ${tp} flex-shrink-0`}>Scan</span>
            <span className={`${tm} flex-shrink-0 mx-0.5`}>/</span>
            <span className={`${ts} flex-shrink-0`}>⌂</span>
            <span className={`${tm} flex-shrink-0 mx-0.5`}>/</span>
            <span className={`${ts} flex-shrink-0 hidden sm:block`}>Private Assets</span>
            <span className={`${tm} flex-shrink-0 mx-0.5 hidden sm:block`}>/</span>
            <span className="text-[#0CC8A8] font-medium flex-shrink-0 truncate">New Scan</span>
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setDark((p) => !p)}
              className={`p-2 cursor-pointer rounded-lg border transition-all ${dark ? "border-white/50 text-gray-400 hover:text-white bg-white/5" : "border-gray-200 text-gray-500 hover:text-gray-900 bg-white"}`}
            >
              {dark ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            <button className={`hidden cursor-pointer md:flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${dark ? "border-white/50 text-gray-300 hover:bg-white/5" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
              <span className="hidden lg:inline">Export Report</span>
            </button>

            <button className="flex cursor-pointer items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium hover:bg-red-500/20 transition-all">
              <span className="hidden sm:inline">Stop Scan</span>
            </button>
          </div>
        </header>

        {
          activeNav === "Dashboard" &&
          <Listing dark={dark} />
        }

      </div>
    </div>
  );
}