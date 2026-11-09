"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

interface SocialAuthButtonsProps {
  onSocialAuth?: (provider: "google" | "github") => void;
  disabled?: boolean;
}

export const SocialAuthButtons: React.FC<SocialAuthButtonsProps> = ({
  onSocialAuth,
  disabled = false,
}) => {
  const [loadingProvider, setLoadingProvider] = useState<"google" | "github" | null>(null);

  const handleClick = (provider: "google" | "github") => {
    if (disabled || loadingProvider) return;
    setLoadingProvider(provider);
    if (onSocialAuth) {
      onSocialAuth(provider);
    } else {
      setTimeout(() => {
        setLoadingProvider(null);
      }, 800);
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="grid grid-cols-2 gap-2.5">
        {/* Google Auth Button */}
        <button
          type="button"
          onClick={() => handleClick("google")}
          disabled={disabled || loadingProvider !== null}
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:opacity-50"
        >
          {loadingProvider === "google" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />
          ) : (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.4l3.7 2.9C6.5 7.4 9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5.1 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.6 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.9 6.4C.7 8.8 0 10.3 0 12s.7 3.2 1.9 5.6l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16C3.7 19.7 7.5 23 12 23z"
              />
            </svg>
          )}
          <span>Google</span>
        </button>

        {/* GitHub Auth Button */}
        <button
          type="button"
          onClick={() => handleClick("github")}
          disabled={disabled || loadingProvider !== null}
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-md bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:opacity-50"
        >
          {loadingProvider === "github" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />
          ) : (
            <svg className="w-3.5 h-3.5 fill-current text-white" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
          )}
          <span>GitHub</span>
        </button>
      </div>

      {/* Divider */}
      <div className="relative flex items-center justify-center my-3">
        <div className="border-t border-zinc-800 w-full" />
        <span className="bg-[#111115] px-2 text-[10px] font-mono uppercase tracking-wider text-zinc-400">
          Or continue with email
        </span>
        <div className="border-t border-zinc-800 w-full" />
      </div>
    </div>
  );
};
