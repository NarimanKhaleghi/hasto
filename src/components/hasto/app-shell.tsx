"use client";

import { useAppStore } from "@/lib/hasto-store";
import { B2CApp } from "@/components/hasto/b2c/b2c-app";
import { B2BApp } from "@/components/hasto/b2b/b2b-app";
import { ModeSwitcher } from "@/components/hasto/shared/mode-switcher";
import { cn } from "@/lib/utils";

export function AppShell() {
  const mode = useAppStore((s) => s.mode);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#e8f0fe] via-[#f8fafc] to-[#f8fafc] dark:from-[#0a0f1a] dark:via-[#0a0f1a] dark:to-[#111827]">
      <ThemeBackground />
      <ModeSwitcher />

      <main className="flex-1 flex items-start justify-center px-0 sm:px-4 pt-0 sm:pt-6 pb-4">
        {/* Phone frame on desktop, full screen on mobile */}
        <div
          className={cn(
            "w-full max-w-[420px] mx-auto bg-background shadow-2xl sm:rounded-[2.5rem] overflow-hidden sm:my-2 min-h-screen sm:min-h-0 sm:h-[calc(100vh-7rem)] flex flex-col relative",
            "border border-border/50 sm:border-[6px] sm:border-[#1a1a1a]"
          )}
        >
          {/* Status bar (mock) - hidden on mobile */}
          <div className="hidden sm:flex items-center justify-between px-6 h-7 bg-[#1a1a1a] text-white text-[11px] shrink-0">
            <span className="font-medium">۹:۴۱</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px]">📶</span>
              <span className="text-[10px]">🔋</span>
            </div>
          </div>

          {/* App content */}
          <div className="flex-1 flex flex-col overflow-hidden bg-background">
            {mode === "b2c" ? <B2CApp /> : <B2BApp />}
          </div>
        </div>
      </main>
    </div>
  );
}

function ThemeBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#034ea2]/10 blur-3xl" />
      <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-[#6BA0F5]/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-[#9DBFF9]/10 blur-3xl" />
    </div>
  );
}
