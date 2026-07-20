"use client";

import { Home, Wallet, Plus, Grid3x3, FileText } from "lucide-react";
import { useAppStore, type B2CScreen } from "@/lib/hasto-store";
import { cn } from "@/lib/utils";

type NavItem = {
  id: B2CScreen;
  label: string;
  icon: typeof Home;
  isCentral?: boolean;
};

const navItems: NavItem[] = [
  { id: "dashboard", label: "خانه", icon: Home },
  { id: "financial", label: "مالی", icon: Wallet },
  { id: "payment", label: "پرداخت", icon: Plus, isCentral: true },
  { id: "services", label: "خدمات", icon: Grid3x3 },
  { id: "contracts", label: "قراردادها", icon: FileText },
];

export function BottomNav() {
  const b2cScreen = useAppStore((s) => s.b2cScreen);
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);

  // Hide bottom nav on login screen
  if (b2cScreen === "login") return null;

  // Determine active tab based on current screen
  const getActiveTab = (): B2CScreen => {
    if (b2cScreen.startsWith("transfer")) return "dashboard";
    if (b2cScreen.startsWith("receive")) return "dashboard";
    if (b2cScreen.startsWith("payment")) return "payment";
    if (b2cScreen.startsWith("financial")) return "financial";
    if (b2cScreen.startsWith("contract")) return "contracts";
    if (b2cScreen === "bills" || b2cScreen === "installments") return "dashboard";
    return b2cScreen as B2CScreen;
  };

  const activeTab = getActiveTab();

  return (
    <nav
      className="absolute bottom-0 left-0 right-0 z-40 glass-strong border-t border-border/50"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          if (item.isCentral) {
            return (
              <button
                key={item.id}
                onClick={() => setB2CScreen(item.id)}
                className="flex flex-col items-center justify-center -mt-6 group"
                aria-label={item.label}
              >
                <div
                  className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 group-active:scale-95",
                    isActive
                      ? "bg-gradient-to-br from-[#0456B5] to-[#023069] animate-pulse-glow"
                      : "bg-gradient-to-br from-[#034ea2] to-[#023069] hover:scale-105"
                  )}
                >
                  <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
                <span
                  className={cn(
                    "text-[10px] mt-1 font-medium transition-colors",
                    isActive ? "text-[#034ea2] dark:text-[#6BA0F5]" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setB2CScreen(item.id)}
              className="flex flex-col items-center justify-center gap-1 flex-1 h-full group"
              aria-label={item.label}
            >
              <Icon
                className={cn(
                  "w-6 h-6 transition-all duration-200",
                  isActive
                    ? "text-[#034ea2] dark:text-[#6BA0F5] scale-110"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  "text-[10px] transition-colors",
                  isActive ? "text-[#034ea2] dark:text-[#6BA0F5] font-semibold" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
