"use client";

import { useAppStore } from "@/lib/hasto-store";
import { cn } from "@/lib/utils";
import { Smartphone, Store } from "lucide-react";

export function ModeSwitcher() {
  const mode = useAppStore((s) => s.mode);
  const setMode = useAppStore((s) => s.setMode);

  return (
    <div className="sticky top-0 z-50 w-full flex justify-center pt-3 pb-2 px-4">
      <div className="glass-strong rounded-full p-1 flex items-center gap-1 shadow-soft border border-border/50">
        <button
          onClick={() => setMode("b2c")}
          className={cn(
            "flex items-center gap-2 px-4 h-9 rounded-full text-xs font-bold transition-all",
            mode === "b2c"
              ? "bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white shadow-md"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Smartphone className="w-4 h-4" />
          اپ کاربر
        </button>
        <button
          onClick={() => setMode("b2b")}
          className={cn(
            "flex items-center gap-2 px-4 h-9 rounded-full text-xs font-bold transition-all",
            mode === "b2b"
              ? "bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white shadow-md"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Store className="w-4 h-4" />
          پنل کسب‌وکار
        </button>
      </div>
    </div>
  );
}
