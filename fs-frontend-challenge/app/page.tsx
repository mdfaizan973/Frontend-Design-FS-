"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Apple, Facebook, Sun, Moon } from "lucide-react";

interface StoredUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function main() {
  const router = useRouter();

  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [showPassword, setShowPassword] = useState(false);
  const [dark, setDark] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const isLogin = mode === "login";

  useEffect(() => {
    const root = document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  useEffect(() => {
    const stored = localStorage.getItem("aps_user");
    if (stored) {
      setMode("login");
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  function showToast(msg: string, type: "success" | "error") {
    setToast({ msg, type });
  }

  function clearForm() {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setAgreedToTerms(false);
    setErrors({});
  }

  function switchMode(next: "signup" | "login") {
    clearForm();
    setMode(next);
  }

  function validateEmail(val: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    const next: Record<string, string> = {};

    if (!firstName.trim()) next.firstName = "First name is required";
    if (!lastName.trim()) next.lastName = "Last name is required";
    if (!email.trim()) next.email = "Email is required";
    else if (!validateEmail(email)) next.email = "Enter a valid email address";
    if (!password) next.password = "Password is required";
    else if (password.length < 8) next.password = "Password must be at least 8 characters";
    if (!agreedToTerms) next.terms = "You must agree to the terms";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    const existing = localStorage.getItem("aps_user");
    if (existing) {
      const user = JSON.parse(existing) as StoredUser;
      if (user.email === email) {
        setErrors({ email: "An account with this email already exists" });
        return;
      }
    }

    const user: StoredUser = { firstName, lastName, email, password };
    localStorage.setItem("aps_user", JSON.stringify(user));

    showToast(`Welcome, ${firstName}! Account created.`, "success");
    setTimeout(() => router.push("/"), 1000);
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const next: Record<string, string> = {};

    if (!email.trim()) next.email = "Email is required";
    else if (!validateEmail(email)) next.email = "Enter a valid email address";
    if (!password) next.password = "Password is required";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    const stored = localStorage.getItem("aps_user");
    if (!stored) {
      setErrors({ email: "No account found. Please sign up first." });
      return;
    }

    const user = JSON.parse(stored) as StoredUser;

    if (user.email !== email) {
      setErrors({ email: "Email address not found" });
      return;
    }

    if (user.password !== password) {
      setErrors({ password: "Incorrect password" });
      return;
    }

    showToast(`Welcome back, ${user.firstName}!`, "success");
    setTimeout(() => router.push("/screens/dashboard"), 1000);
  }

  const darkBg = [
    "radial-gradient(ellipse 60% 55% at 0% 0%,    #1a3a2e 0%, transparent 100%)",
    "radial-gradient(ellipse 25% 50% at 100% 0%,  #c0390a 0%, transparent 100%)",
    "radial-gradient(ellipse 25% 55% at 85% 100%, #7a1a00 0%, #8c2200 40%, transparent 100%)",
    "radial-gradient(ellipse 35% 40% at 15% 90%,  #1c4040 0%, transparent 100%)",
    "linear-gradient(160deg, #0d1c18 0%, #0c1410 35%, #0f0f0f 60%, #130c08 85%, #0f0c0a 100%)",
  ].join(", ");

  const lightBg = [
    "radial-gradient(ellipse 60% 55% at 0% 0%,    #0e4a38 0%, transparent 100%)",
    "radial-gradient(ellipse 55% 50% at 100% 0%,  #0c3a2a 0%, transparent 100%)",
    "radial-gradient(ellipse 65% 55% at 85% 100%, #d44000 0%, #a82e00 40%, transparent 100%)",
    "radial-gradient(ellipse 45% 40% at 15% 90%,  #5a1e00 0%, transparent 100%)",
    "linear-gradient(160deg, #14261e 0%, #111c16 35%, #181818 60%, #1c1008 85%, #181008 100%)",
  ].join(", ");

  const inputBase = "w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 border focus:ring-2 focus:ring-[#0CC8A8]/15 focus:border-[#0CC8A8]";
  const inputDark = "bg-white/[0.06] border-white/[0.09] text-white placeholder-white/30";
  const inputLight = "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white";
  const inp = `${inputBase} ${dark ? inputDark : inputLight}`;
  const inpError = `${inputBase} border-red-500/60 focus:border-red-500 focus:ring-red-500/10 ${dark ? "bg-white/[0.06] text-white placeholder-white/30" : "bg-gray-50 text-gray-900 placeholder-gray-400"}`;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        background: dark ? darkBg : lightBg,
      }}
    >
      {toast && (
        <div
          className={`fixed top-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-xl transition-all duration-300 ${toast.type === "success"
            ? "bg-[#0CC8A8] text-black"
            : "bg-red-500 text-white"
            }`}
        >
          {toast.msg}
        </div>
      )}

      <header className="w-full flex items-center justify-between px-6 sm:px-10 py-4 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: "rgba(12,200,168,0.15)", border: "1px solid rgba(12,200,168,0.25)" }}
          >
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          <span className="text-sm font-bold text-white tracking-wide">aps</span>
        </div>

        <button
          onClick={() => setDark((p) => !p)}
          aria-label="Toggle theme"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-200 backdrop-blur-md bg-black/20 border-white/15 text-white/55 hover:text-white hover:border-white/30 text-xs font-medium"
        >
          {dark ? <Sun size={13} /> : <Moon size={13} />}
          <span>{dark ? "Light" : "Dark"}</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 lg:px-16 pt-10 pb-8 lg:py-16">
          <div className="w-full max-w-[440px] mx-auto lg:mx-0">
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#0CC8A8] mb-7 font-semibold">
              Fenrir Security
            </p>

            <h1 className="text-[32px] sm:text-[38px] lg:text-[42px] font-bold leading-[1.18] text-white mb-8 tracking-tight">
              Expert level Cybersecurity
              <br />
              in{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #0CC8A8 0%, #0adbb8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                hours
              </span>{" "}
              not weeks.
            </h1>

            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30 mb-4 font-semibold">
              What&apos;s included
            </p>

            <ul className="space-y-3.5 mb-10">
              {[
                "Effortlessly spider and map targets to uncover hidden security flaws",
                "Deliver high-quality, validated findings in hours, not weeks.",
                "Generate professional, enterprise-grade security reports automatically.",
              ].map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 text-[#0CC8A8] font-bold text-sm mt-0.5 leading-none">✓</span>
                  <span className="text-sm text-white/50 leading-relaxed">{f}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[#00b67a] text-base leading-none">★</span>
                <span className="text-sm text-white/45 font-medium">Trustpilot</span>
              </div>
              <p className="text-sm">
                <span className="text-white font-semibold">Rated 4.5/5.0</span>{" "}
                <span className="text-white/25 text-xs">(100k+ reviews)</span>
              </p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-start lg:items-center justify-center px-5 sm:px-10 pb-14 pt-2 lg:py-12">
          <div className="w-full max-w-[420px]">
            <div
              className="rounded-2xl transition-all duration-300"
              style={
                dark
                  ? {
                    background: "#161616",
                    border: "1px solid rgba(255,255,255,0.07)",
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.025), 0 24px 80px rgba(0,0,0,0.65), 0 4px 16px rgba(0,0,0,0.35)",
                  }
                  : {
                    background: "#ffffff",
                    border: "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.2), 0 2px 8px rgba(0,0,0,0.08)",
                  }
              }
            >
              <div className="p-7 sm:p-9">
                <h2 className={`text-[22px] font-bold text-center tracking-tight mb-1.5 ${dark ? "text-white" : "text-gray-900"}`}>
                  {isLogin ? "Welcome back" : "Sign up"}
                </h2>

                <p className={`text-center text-sm mb-7 ${dark ? "text-gray-500" : "text-gray-500"}`}>
                  {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                  <button
                    type="button"
                    onClick={() => switchMode(isLogin ? "signup" : "login")}
                    className="text-[#0CC8A8] font-semibold hover:underline focus:outline-none"
                  >
                    {isLogin ? "Sign up" : "Log in"}
                  </button>
                </p>

                <form
                  onSubmit={isLogin ? handleLogin : handleSignup}
                  className="flex flex-col gap-4"
                  noValidate
                >
                  {!isLogin && (
                    <div className="flex flex-col gap-1">
                      <input
                        type="text"
                        placeholder="First name*"
                        autoComplete="given-name"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          setErrors((p) => ({ ...p, firstName: "" }));
                        }}
                        className={errors.firstName ? inpError : inp}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-400 pl-1">{errors.firstName}</p>
                      )}
                    </div>
                  )}

                  {!isLogin && (
                    <div className="flex flex-col gap-1">
                      <input
                        type="text"
                        placeholder="Last name*"
                        autoComplete="family-name"
                        value={lastName}
                        onChange={(e) => {
                          setLastName(e.target.value);
                          setErrors((p) => ({ ...p, lastName: "" }));
                        }}
                        className={errors.lastName ? inpError : inp}
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-400 pl-1">{errors.lastName}</p>
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <input
                      type="email"
                      placeholder="Email address*"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((p) => ({ ...p, email: "" }));
                      }}
                      className={errors.email ? inpError : inp}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400 pl-1">{errors.email}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    {isLogin && (
                      <div className="flex justify-end">
                        <a href="#" className="text-xs text-[#0CC8A8] hover:underline">
                          Forgot password?
                        </a>
                      </div>
                    )}
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder={isLogin ? "Password*" : "Password (8+ characters)*"}
                        autoComplete={isLogin ? "current-password" : "new-password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setErrors((p) => ({ ...p, password: "" }));
                        }}
                        className={`${errors.password ? inpError : inp} pr-11`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors ${dark ? "text-white/25 hover:text-white/60" : "text-gray-400 hover:text-gray-600"
                          }`}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-400 pl-1">{errors.password}</p>
                    )}
                  </div>

                  {!isLogin && (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-start gap-2.5 pt-0.5">
                        <input
                          type="checkbox"
                          id="terms"
                          checked={agreedToTerms}
                          onChange={(e) => {
                            setAgreedToTerms(e.target.checked);
                            setErrors((p) => ({ ...p, terms: "" }));
                          }}
                          className="mt-0.5 w-4 h-4 accent-[#0CC8A8] flex-shrink-0 cursor-pointer"
                        />
                        <label
                          htmlFor="terms"
                          className={`text-xs leading-[1.65] cursor-pointer select-none ${dark ? "text-gray-500" : "text-gray-500"
                            }`}
                        >
                          I agree to Fenrir&apos;s{" "}
                          <a href="#" className="text-[#0CC8A8] hover:underline">
                            Terms &amp; Conditions
                          </a>{" "}
                          and acknowledge the{" "}
                          <a href="#" className="text-[#0CC8A8] hover:underline">
                            Privacy Policy
                          </a>
                        </label>
                      </div>
                      {errors.terms && (
                        <p className="text-xs text-red-400 pl-1">{errors.terms}</p>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full font-semibold text-sm text-white transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none mt-1"
                    style={{
                      background: "linear-gradient(135deg, #0CC8A8 0%, #0ab898 50%, #08a888 100%)",
                      boxShadow: "0 4px 20px rgba(12,200,168,0.38)",
                    }}
                  >
                    {isLogin ? "Log in" : "Create account"}
                  </button>
                </form>

                <div className={`flex items-center gap-3 my-6 text-xs ${dark ? "text-white/25" : "text-gray-400"}`}>
                  <div className={`flex-1 h-px ${dark ? "bg-white/8" : "bg-gray-200"}`} />
                  or continue with
                  <div className={`flex-1 h-px ${dark ? "bg-white/8" : "bg-gray-200"}`} />
                </div>

                <div className="flex gap-2.5">
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-medium transition-all duration-200 bg-black text-white border border-black hover:bg-zinc-800 active:scale-[0.98]"
                  >
                    <Apple size={14} />
                    Apple
                  </button>

                  <button
                    type="button"
                    className={[
                      "flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-medium border transition-all duration-200 active:scale-[0.98]",
                      dark
                        ? "bg-white/[0.07] border-white/[0.1] text-white/70 hover:bg-white/[0.13] hover:border-white/20"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300",
                    ].join(" ")}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </button>

                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-medium transition-all duration-200 bg-[#1877f2] text-white border border-[#1877f2] hover:bg-[#166de0] active:scale-[0.98]"
                  >
                    <Facebook size={14} />
                    Meta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}