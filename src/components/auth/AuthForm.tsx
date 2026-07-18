"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Eye, EyeOff, Loader2, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

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
  const [showForgot, setShowForgot] = useState(false);

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
      // Clear the anonymous route cache before entering the authenticated app.
      // The dashboard navbar warms the protected pages after this navigation.
      router.push(next);
      router.refresh();
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to authenticate with Google");
        setLoading(false);
        return;
      }

      localStorage.setItem("rr_user", JSON.stringify(data.user));
      toast.success("Successfully authenticated!");
      router.push(next);
      router.refresh();
    } catch (err: any) {
      console.error("Google login failed:", err);
      if (err.code !== "auth/popup-closed-by-user") {
        toast.error("Google authentication failed. Please try again.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-[var(--rr-bg)]">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
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
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-[var(--rr-text)] placeholder-[var(--rr-muted)] outline-none focus:border-[var(--rr-signal)] focus:ring-1 focus:ring-[var(--rr-signal)] transition-all duration-200"
              />
              <AnimatePresence>
                {errors.name && (
                  <motion.p
                    initial={{ opacity: 0, y: -5, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -5, height: 0 }}
                    className="mt-1 text-xs text-red-400"
                  >
                    {errors.name}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: isSignup ? 0.2 : 0.1 }}
          >
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-[var(--rr-text)] placeholder-[var(--rr-muted)] outline-none focus:border-[var(--rr-signal)] focus:ring-1 focus:ring-[var(--rr-signal)] transition-all duration-200"
            />
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -5, height: 0 }}
                  className="mt-1 text-xs text-red-400"
                >
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: isSignup ? 0.3 : 0.2 }}
            className="relative"
          >
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 pr-11 text-[var(--rr-text)] placeholder-[var(--rr-muted)] outline-none focus:border-[var(--rr-signal)] focus:ring-1 focus:ring-[var(--rr-signal)] transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--rr-muted)] hover:text-[var(--rr-text)] transition-colors"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
            <AnimatePresence>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -5, height: 0 }}
                  className="mt-1 text-xs text-red-400"
                >
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

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
            {!isSignup && (
              <button
                type="button"
                onClick={() => setShowForgot(true)}
                className="text-sm text-[var(--rr-signal)] hover:underline transition-opacity hover:opacity-80"
              >
                Forgot password?
              </button>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--rr-signal)] px-6 py-3 font-semibold text-[var(--rr-bg)] transition hover:brightness-110 disabled:opacity-60 hover:shadow-[0_0_20px_-4px_var(--rr-signal)]"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSignup ? "Create Account" : "Log In"}
          </motion.button>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative flex py-2 items-center"
          >
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-xs text-[var(--rr-muted)] uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-white/10"></div>
          </motion.div>

          <motion.button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-black/25 px-6 py-3 font-semibold text-[var(--rr-text)] transition hover:bg-black/40 hover:border-white/20 disabled:opacity-60"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </motion.button>
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

      <AnimatePresence>
        {showForgot && (
          <ForgotPasswordModal onClose={() => setShowForgot(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Forgot Password Modal ──────────────────────────────────────────────── */

function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [fpEmail, setFpEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fpErrors, setFpErrors] = useState<{ [k: string]: string }>({});

  const validate = () => {
    const e: { [k: string]: string } = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fpEmail))
      e.email = "Enter a valid email address";
    if (newPassword.length < 6)
      e.password = "Password must be at least 6 characters";
    if (newPassword !== confirmPassword)
      e.confirm = "Passwords do not match";
    setFpErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: fpEmail, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Something went wrong");
        setLoading(false);
        return;
      }
      toast.success("Password updated successfully!");
      setStep("success");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.93, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.93, opacity: 0, y: 16 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-sm rounded-3xl border border-white/10 bg-[var(--rr-surface)] p-8 shadow-2xl"
      >
        {step === "form" ? (
          <>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-xl font-bold text-[var(--rr-text)]">Reset your password</h2>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1 text-[var(--rr-muted)] hover:text-[var(--rr-text)] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-6 text-sm text-[var(--rr-muted)]">
              Enter your account email and choose a new password.
            </p>

            <form onSubmit={handleReset} className="space-y-4">
              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={fpEmail}
                  onChange={(e) => setFpEmail(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-[var(--rr-text)] placeholder-[var(--rr-muted)] outline-none focus:border-[var(--rr-signal)] focus:ring-1 focus:ring-[var(--rr-signal)]"
                />
                {fpErrors.email && (
                  <p className="mt-1 text-xs text-red-400">{fpErrors.email}</p>
                )}
              </div>

              {/* New Password */}
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 pr-11 text-[var(--rr-text)] placeholder-[var(--rr-muted)] outline-none focus:border-[var(--rr-signal)] focus:ring-1 focus:ring-[var(--rr-signal)]"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((s) => !s)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--rr-muted)] hover:text-[var(--rr-text)]"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {fpErrors.password && (
                  <p className="mt-1 text-xs text-red-400">{fpErrors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 pr-11 text-[var(--rr-text)] placeholder-[var(--rr-muted)] outline-none focus:border-[var(--rr-signal)] focus:ring-1 focus:ring-[var(--rr-signal)]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--rr-muted)] hover:text-[var(--rr-text)]"
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                {fpErrors.confirm && (
                  <p className="mt-1 text-xs text-red-400">{fpErrors.confirm}</p>
                )}
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-[var(--rr-muted)] transition hover:border-white/25 hover:text-[var(--rr-text)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--rr-signal)] px-4 py-3 text-sm font-semibold text-[var(--rr-bg)] transition hover:brightness-110 disabled:opacity-60"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Update Password
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Success screen */
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--rr-signal)]/15 text-3xl text-[var(--rr-signal)]">
              ✓
            </div>
            <h2 className="text-xl font-bold text-[var(--rr-text)]">Password Updated!</h2>
            <p className="text-sm text-[var(--rr-muted)]">
              Your password has been changed. You can now log in with your new password.
            </p>
            <button
              onClick={onClose}
              className="mt-2 w-full rounded-xl bg-[var(--rr-signal)] px-6 py-3 font-semibold text-[var(--rr-bg)] transition hover:brightness-110"
            >
              Back to Login
            </button>
          </div>
        )}
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
