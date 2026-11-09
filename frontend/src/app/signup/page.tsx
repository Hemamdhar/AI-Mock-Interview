"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
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
import { RoleSelector } from "@/components/auth/RoleSelector";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";

export default function SignupPage() {
  const router = useRouter();
  const { signup, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetRole, setTargetRole] = useState("fullstack");
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!name || !email || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!agreedToTerms) {
      setError("Please accept the terms of service to continue.");
      return;
    }

    const res = await signup(name, email, password, targetRole);
    if (res.success) {
      setSuccess("Account initialized! Preparing personalized interview engine...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 500);
    } else {
      setError(res.error || "Unable to create account. Please check your information.");
    }
  };

  const handleFillDemo = () => {
    setName("Elena Rostova");
    setEmail("elena.rostova@techmail.io");
    setPassword("MasterAI#2026");
    setTargetRole("backend");
    setAgreedToTerms(true);
    setError(null);
  };

  return (
    <AuthCardWrapper mode="signup">
      {/* Header */}
      <AuthHeader
        title="Create Account"
        subtitle="Set up your profile to start practicing calibrated technical mock interviews"
        badgeText="NEW CANDIDATE REGISTRATION"
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
        {/* Full Name */}
        <div className="space-y-1">
          <label
            htmlFor="name"
            className="block text-xs font-medium text-zinc-300"
          >
            Full Name
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
              <User className="w-4 h-4" />
            </div>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Mercer"
              className="w-full pl-9 pr-3 py-2 rounded-md bg-zinc-900 border border-zinc-800 focus:border-zinc-600 text-xs text-white placeholder-zinc-500 transition-colors outline-none focus:ring-1 focus:ring-zinc-600"
            />
          </div>
        </div>

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

        {/* Role Selector Track */}
        <RoleSelector
          selectedRole={targetRole}
          onSelectRole={(r) => setTargetRole(r)}
        />

        {/* Password Field */}
        <div className="space-y-1">
          <label
            htmlFor="password"
            className="block text-xs font-medium text-zinc-300"
          >
            Password
          </label>
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
              placeholder="Min. 8 characters"
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

          <PasswordStrengthMeter password={password} />
        </div>

        {/* Agree to Terms Checkbox - Real Links */}
        <div className="pt-1">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-3.5 h-3.5 mt-0.5 rounded border-zinc-700 bg-zinc-900 text-zinc-100 focus:ring-0 shrink-0"
            />
            <span className="text-xs text-zinc-400 leading-relaxed">
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-zinc-200 underline underline-offset-2 hover:text-white"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-zinc-200 underline underline-offset-2 hover:text-white"
              >
                Privacy Policy
              </Link>
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
              <span>Configuring Profile...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </form>

      {/* Footer Switch to Login */}
      <div className="mt-5 text-center text-xs text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-zinc-200 hover:underline transition-colors"
        >
          Sign In
        </Link>
      </div>
    </AuthCardWrapper>
  );
}
