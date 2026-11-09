"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthCardWrapper } from "@/components/auth/AuthCardWrapper";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { SocialAuthButtons } from "@/components/auth/SocialAuthButtons";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      setSuccess("Authentication successful! Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } else {
      setError(res.error || "Invalid email or password. Please try again.");
    }
  };

  const handleFillDemo = () => {
    setEmail("alex.mercer@interviewai.dev");
    setPassword("DemoPass#2026");
    setError(null);
  };

  return (
    <AuthCardWrapper mode="login">
      {/* Header */}
      <AuthHeader
        title="Sign In"
        subtitle="Access your mock interview dashboard and performance scorecards"
        badgeText="SESSION ACCESS"
      />

      {/* 1-Click Demo Fill */}
      <div className="mb-4 flex justify-center">
        <button
          type="button"
          onClick={handleFillDemo}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
        >
          <Zap className="w-3 h-3 text-zinc-400" />
          <span>Demo Credentials</span>
          <span className="text-[10px] text-zinc-400 font-mono bg-zinc-800 px-1 py-0.5 rounded">
            Auto-fill
          </span>
        </button>
      </div>

      {/* Social Logins */}
      <SocialAuthButtons />

      {/* Feedback Messages */}
      {error && (
        <div className="mb-4 p-3 rounded-md bg-rose-950/20 border border-rose-900/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 rounded-md bg-emerald-950/20 border border-emerald-900/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{success}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-1">
          <label
            htmlFor="email"
            className="block text-xs font-medium text-zinc-300"
          >
            Email Address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@company.com"
              className="w-full pl-9 pr-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 focus:border-zinc-600 text-xs text-white placeholder-zinc-500 transition-colors outline-none focus:ring-1 focus:ring-zinc-600"
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-xs font-medium text-zinc-300"
            >
              Password
            </label>
            <span className="text-xs text-zinc-500">
              DemoPass#2026
            </span>
          </div>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-9 pr-9 py-2 rounded-md bg-zinc-900 border border-zinc-800 focus:border-zinc-600 text-xs text-white placeholder-zinc-500 transition-colors outline-none focus:ring-1 focus:ring-zinc-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Remember Me Checkbox */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-900 text-zinc-100 focus:ring-0"
            />
            <span className="text-xs text-zinc-400">
              Remember this device
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-md font-medium text-xs bg-zinc-100 text-zinc-950 hover:bg-white active:bg-zinc-200 transition-colors disabled:opacity-50 mt-2 flex items-center justify-center gap-2 shadow-xs"
        >
          {isLoading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-zinc-950/30 border-t-zinc-950 rounded-full animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Footer Switch to Sign Up */}
      <div className="mt-5 text-center text-xs text-zinc-400">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/signup"
          className="font-medium text-zinc-200 hover:underline transition-colors"
        >
          Create Account
        </Link>
      </div>
    </AuthCardWrapper>
  );
}
