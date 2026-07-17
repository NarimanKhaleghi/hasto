"use client";

import { useEffect, useRef, useState } from "react";
import { fa } from "@/lib/hasto-data";

/**
 * AnimatedNumber — smoothly counts from 0 (or previous value) to target.
 * Uses requestAnimationFrame with easing.
 */
export function AnimatedNumber({
  value,
  duration = 1200,
  className,
  format = "comma",
  suffix = "",
  prefix = "",
}: {
  value: number;
  duration?: number;
  className?: string;
  format?: "comma" | "plain";
  suffix?: string;
  prefix?: string;
}) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const current = Math.round(start + (end - start) * eased);
      setDisplay(current);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        prevRef.current = end;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, duration]);

  const formatted =
    format === "comma"
      ? fa(display.toLocaleString("en-US"))
      : fa(display);

  return (
    <span className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
}
