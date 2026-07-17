"use client";

import { cn } from "@/lib/utils";

export function HastoLogo({
  className,
  size = 32,
  showText = false,
  variant = "default",
}: {
  className?: string;
  size?: number;
  showText?: boolean;
  variant?: "default" | "white" | "gradient";
}) {
  const textColor =
    variant === "white"
      ? "text-white"
      : variant === "gradient"
      ? "bg-gradient-to-l from-[#034ea2] to-[#0456B5] bg-clip-text text-transparent"
      : "text-[#034ea2] dark:text-white";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <defs>
            <linearGradient id="hastoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0456B5" />
              <stop offset="1" stopColor="#023069" />
            </linearGradient>
          </defs>
          {/* Outer rounded square */}
          <rect width="40" height="40" rx="10" fill="url(#hastoGrad)" />
          {/* Inner "H" mark with core dot */}
          <path
            d="M13 10 V30 M13 20 H27 M27 10 V30"
            stroke="white"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="20" r="2.5" fill="#6BA0F5" />
        </svg>
      </div>
      {showText && (
        <span className={cn("font-bold text-lg leading-none", textColor)}>
          هستو
        </span>
      )}
    </div>
  );
}
