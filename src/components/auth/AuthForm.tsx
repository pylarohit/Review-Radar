"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Logo from "@/components/ui/Logo";

function AuthFormInner({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const isSignup = mode === "signup";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const remembered = localStorage.getItem("rr_remembered_email");
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, []);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (isSignup && name.trim().length < 2)
      newErrors.name = "Name must be at least 2 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Enter a valid email address";
    if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const endpoint = isSignup ? "/api/auth/signup" : "/api/auth/login";
      const body = isSignup ? { name, email, password } : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      // Save user details to localStorage for client-side state / dynamic header
      localStorage.setItem("rr_user", JSON.stringify(data.user));

      // Handle remember me logic
      if (rememberMe) {
        localStorage.setItem("rr_remembered_email", email);
      } else {
        localStorage.removeItem("rr_remembered_email");
      }

      toast.success(isSignup ? "Account created!" : "Welcome back!");
      router.push(next);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-[var(--rr-bg)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl border border-white/5 bg-[var(--rr-surface)] p-8 shadow-xl"
      >
        <Link href="/" className="mb-8 flex items-center justify-center gap-3">
          <Logo />
          <span className="text-xl font-bold text-[var(--rr-text)]">
            Review<span className="text-[var(--rr-signal)]">Radar</span>
          </span>
        </Link>

        <h1 className="mb-2 text-center text-2xl font-bold text-[var(--rr-text)]">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mb-8 text-center text-sm text-[var(--rr-muted)]">
          {isSignup
            ? "Start tracking product sentiment with AI"
            : "Log in to your Review Radar dashboard"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-[var(--rr-text)] placeholder-[var(--rr-muted)] outline-none focus:border-[var(--rr-signal)] focus:ring-1 focus:ring-[var(--rr-signal)]"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-400">{errors.name}</p>
              )}
            </div>
          )}

          <div>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-[var(--rr-text)] placeholder-[var(--rr-muted)] outline-none focus:border-[var(--rr-signal)] focus:ring-1 focus:ring-[var(--rr-signal)]"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 pr-11 text-[var(--rr-text)] placeholder-[var(--rr-muted)] outline-none focus:border-[var(--rr-signal)] focus:ring-1 focus:ring-[var(--rr-signal)]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--rr-muted)] hover:text-[var(--rr-text)]"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between py-1">
            <label className="flex items-center gap-2.5 text-sm text-[var(--rr-muted)] hover:text-[var(--rr-text)] cursor-pointer select-none transition-colors">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4.5 w-4.5 rounded-lg border border-white/10 bg-black/20 checked:bg-[var(--rr-signal)] text-[var(--rr-signal)] outline-none focus:ring-1 focus:ring-[var(--rr-signal)] accent-[var(--rr-signal)] transition-all cursor-pointer"
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--rr-signal)] px-6 py-3 font-semibold text-[var(--rr-bg)] transition hover:brightness-110 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSignup ? "Create Account" : "Log In"}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-[var(--rr-muted)]">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <Link href="/login" className="text-[var(--rr-signal)] hover:underline">
                Log in
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-[var(--rr-signal)] hover:underline">
                Sign up
              </Link>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
}

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  return (
    <Suspense fallback={null}>
      <AuthFormInner mode={mode} />
    </Suspense>
  );
}
