"use client";

import React from "react";
import { Check, X } from "lucide-react";

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
}) => {
  if (!password) return null;

  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const criteriaMet = [hasLength, hasUpper, hasNumber, hasSpecial].filter(
    Boolean
  ).length;

  let strengthLabel = "Weak";
  let barColor = "bg-rose-500";
  let textColor = "text-rose-400";

  if (criteriaMet === 2) {
    strengthLabel = "Fair";
    barColor = "bg-amber-500";
    textColor = "text-amber-400";
  } else if (criteriaMet === 3) {
    strengthLabel = "Good";
    barColor = "bg-blue-500";
    textColor = "text-blue-400";
  } else if (criteriaMet === 4) {
    strengthLabel = "Strong";
    barColor = "bg-emerald-500";
    textColor = "text-emerald-400";
  }

  return (
    <div className="space-y-2 mt-2 pt-1">
      {/* Strength Bar */}
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="text-zinc-400">Password Strength:</span>
        <span className={`font-semibold ${textColor}`}>{strengthLabel}</span>
      </div>

      <div className="grid grid-cols-4 gap-1.5 h-1 w-full">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`h-full rounded-xs transition-colors duration-200 ${
              step <= criteriaMet ? barColor : "bg-zinc-800"
            }`}
          />
        ))}
      </div>

      {/* Rules Criteria */}
      <div className="grid grid-cols-2 gap-1 text-[11px] pt-1 font-mono">
        <div className="flex items-center gap-1.5">
          {hasLength ? (
            <Check className="w-3 h-3 text-emerald-400" />
          ) : (
            <X className="w-3 h-3 text-zinc-600" />
          )}
          <span className={hasLength ? "text-zinc-300" : "text-zinc-500"}>
            8+ characters
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {hasUpper ? (
            <Check className="w-3 h-3 text-emerald-400" />
          ) : (
            <X className="w-3 h-3 text-zinc-600" />
          )}
          <span className={hasUpper ? "text-zinc-300" : "text-zinc-500"}>
            Uppercase letter
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {hasNumber ? (
            <Check className="w-3 h-3 text-emerald-400" />
          ) : (
            <X className="w-3 h-3 text-zinc-600" />
          )}
          <span className={hasNumber ? "text-zinc-300" : "text-zinc-500"}>
            At least 1 number
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {hasSpecial ? (
            <Check className="w-3 h-3 text-emerald-400" />
          ) : (
            <X className="w-3 h-3 text-zinc-600" />
          )}
          <span className={hasSpecial ? "text-zinc-300" : "text-zinc-500"}>
            Special character
          </span>
        </div>
      </div>
    </div>
  );
};
