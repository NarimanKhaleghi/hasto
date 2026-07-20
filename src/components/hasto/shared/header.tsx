"use client";

import { Bell, Moon, Sun, ArrowRight, User } from "lucide-react";
import { useAppStore } from "@/lib/hasto-store";
import { HastoLogo } from "./hasto-logo";
import { user, notifications } from "@/lib/hasto-data";
import { fa } from "@/lib/hasto-data";
import { cn } from "@/lib/utils";

export function Header({ title }: { title?: string }) {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);
  const goBack = useAppStore((s) => s.goBack);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const b2cScreen = useAppStore((s) => s.b2cScreen);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const mainPages = ["dashboard", "login", "financial", "services", "contracts", "payment"];
  const showBack = !mainPages.includes(b2cScreen);

  return (
    <header className="sticky top-0 z-40 glass-strong border-b border-border/50">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Right side (RTL = right) - profile or back button */}
        <div className="flex items-center gap-2 flex-1">
          {showBack ? (
            <button
              onClick={goBack}
              className="p-2 -mr-2 rounded-full hover:bg-accent transition-colors"
              aria-label="بازگشت"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={() => setB2CScreen("profile")}
              className="flex items-center gap-2 -mr-1 group"
              aria-label="پروفایل"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#034ea2] to-[#023069] flex items-center justify-center text-white text-sm font-bold shadow-md">
                {user.name.charAt(0)}
              </div>

            </button>
          )}
        </div>

        {/* Center - logo or title */}
        <div className="flex items-center justify-center">
          {title ? (
            <h1 className="text-base font-bold">{title}</h1>
          ) : (
            <HastoLogo showText size={28} variant="gradient" />
          )}
        </div>

        {/* Left side (RTL = left) - notifications + theme */}
        <div className="flex items-center gap-1 flex-1 justify-end">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-accent transition-colors"
            aria-label="تغییر تم"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
          <button
            onClick={() => setB2CScreen("notifications")}
            className="relative p-2 rounded-full hover:bg-accent transition-colors"
            aria-label="اعلان‌ها"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
                {fa(unreadCount)}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
