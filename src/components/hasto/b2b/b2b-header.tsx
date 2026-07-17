"use client";

import { ArrowRight, Moon, Sun, Bell } from "lucide-react";
import { useAppStore } from "@/lib/hasto-store";
import { HastoLogo } from "@/components/hasto/shared/hasto-logo";
import { business } from "@/lib/hasto-data";

export function B2BHeader({ title }: { title?: string }) {
  const goBackB2B = useAppStore((s) => s.goBackB2B);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const b2bScreen = useAppStore((s) => s.b2bScreen);
  const setB2BScreen = useAppStore((s) => s.setB2BScreen);

  const showBack = b2bScreen !== "b2b-dashboard";

  return (
    <header className="sticky top-0 z-40 glass-strong border-b border-border/50">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2 flex-1">
          {showBack ? (
            <button
              onClick={goBackB2B}
              className="p-2 -mr-2 rounded-full hover:bg-accent transition-colors"
              aria-label="بازگشت"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setB2BScreen("b2b-settings")}
              className="flex items-center gap-2 -mr-1"
              aria-label="تنظیمات"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#034ea2] to-[#023069] flex items-center justify-center text-white text-sm font-bold shadow-md">
                {business.profile.name.charAt(0)}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-xs font-medium text-muted-foreground">کسب‌وکار</span>
                <span className="text-sm font-bold truncate max-w-[140px]">{business.profile.name}</span>
              </div>
            </button>
          )}
        </div>

        <div className="flex items-center justify-center">
          {title ? (
            <h1 className="text-base font-bold">{title}</h1>
          ) : (
            <HastoLogo showText size={26} variant="gradient" />
          )}
        </div>

        <div className="flex items-center gap-1 flex-1 justify-end">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-accent transition-colors"
            aria-label="تغییر تم"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button
            className="relative p-2 rounded-full hover:bg-accent transition-colors"
            aria-label="اعلان‌ها"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 left-1 w-2 h-2 rounded-full bg-destructive" />
          </button>
        </div>
      </div>
    </header>
  );
}
