"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Home,
  Wallet,
  QrCode,
  FileText,
  Grid3x3,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Bell,
  User,
  Settings,
  Zap,
  Calendar,
  TrendingUp,
  X,
  CornerDownLeft,
} from "lucide-react";
import { useAppStore, type B2CScreen } from "@/lib/hasto-store";
import { serviceCategories, contracts, transactions, recentTransfers, fa } from "@/lib/hasto-data";
import { cn } from "@/lib/utils";

type SearchItem = {
  id: string;
  title: string;
  subtitle: string;
  icon: typeof Home;
  category: string;
  action: () => void;
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);

  // Toggle with Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  // Build search index
  const items: SearchItem[] = useMemo(() => {
    const navItems: SearchItem[] = [
      { id: "nav-home", title: "خانه", subtitle: "داشبورد اصلی", icon: Home, category: "صفحات", action: () => setB2CScreen("dashboard") },
      { id: "nav-financial", title: "مدیریت مالی", subtitle: "دارایی‌ها، بدهی‌ها، طلب‌ها", icon: Wallet, category: "صفحات", action: () => setB2CScreen("financial") },
      { id: "nav-payment", title: "پرداخت", subtitle: "۴ روش پرداخت", icon: QrCode, category: "صفحات", action: () => setB2CScreen("payment") },
      { id: "nav-services", title: "خدمات", subtitle: "۱۸ دسته خدمت", icon: Grid3x3, category: "صفحات", action: () => setB2CScreen("services") },
      { id: "nav-contracts", title: "قراردادها", subtitle: "مدیریت قراردادها", icon: FileText, category: "صفحات", action: () => setB2CScreen("contracts") },
      { id: "nav-transfer", title: "واریز", subtitle: "انتقال وجه", icon: ArrowUpRight, category: "صفحات", action: () => setB2CScreen("transfer") },
      { id: "nav-receive", title: "دریافت", subtitle: "دریافت پول", icon: ArrowDownLeft, category: "صفحات", action: () => setB2CScreen("receive") },
      { id: "nav-bills", title: "پرداخت قبض", subtitle: "قبوض خدمات", icon: Zap, category: "صفحات", action: () => setB2CScreen("bills") },
      { id: "nav-installments", title: "اقساط", subtitle: "اقساط متمرکز", icon: Calendar, category: "صفحات", action: () => setB2CScreen("installments") },
      { id: "nav-transactions", title: "تراکنش‌ها", subtitle: "تاریخچه کامل", icon: CreditCard, category: "صفحات", action: () => setB2CScreen("transactions") },
      { id: "nav-notifications", title: "اعلان‌ها", subtitle: "مرکز اعلان‌ها", icon: Bell, category: "صفحات", action: () => setB2CScreen("notifications") },
      { id: "nav-profile", title: "پروفایل", subtitle: "تنظیمات حساب", icon: User, category: "صفحات", action: () => setB2CScreen("profile") },
    ];

    // Services
    const serviceItems: SearchItem[] = [];
    serviceCategories.forEach((cat) => {
      cat.services.forEach((svc) => {
        serviceItems.push({
          id: `svc-${svc.name}`,
          title: svc.name,
          subtitle: cat.name,
          icon: Grid3x3,
          category: "خدمات",
          action: () => setB2CScreen("services"),
        });
      });
    });

    // Contracts
    const contractItems: SearchItem[] = contracts.slice(0, 10).map((c) => ({
      id: `con-${c.id}`,
      title: c.name,
      subtitle: `${c.provider} • ${c.amount} تومان`,
      icon: FileText,
      category: "قراردادها",
      action: () => {
        useAppStore.getState().setActiveContractId(c.id);
        setB2CScreen("contract-detail");
      },
    }));

    // Recent contacts
    const contactItems: SearchItem[] = recentTransfers.map((t) => ({
      id: `ct-${t.id}`,
      title: t.name,
      subtitle: t.number,
      icon: ArrowUpRight,
      category: "مخاطبین",
      action: () => setB2CScreen("transfer"),
    }));

    return [...navItems, ...serviceItems, ...contractItems, ...contactItems];
  }, [setB2CScreen]);

  const filtered = useMemo(() => {
    if (!query.trim()) return items.slice(0, 8);
    const q = query.toLowerCase();
    return items
      .filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          i.subtitle.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q)
      )
      .slice(0, 12);
  }, [query, items]);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        filtered[selectedIndex].action();
        setOpen(false);
        setQuery("");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, filtered, selectedIndex]);

  // Group results by category
  const grouped = useMemo(() => {
    const g: Record<string, SearchItem[]> = {};
    filtered.forEach((i) => {
      if (!g[i.category]) g[i.category] = [];
      g[i.category].push(i);
    });
    return g;
  }, [filtered]);

  let flatIndex = -1;

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="جستجوی سریع"
        className="fixed bottom-24 right-4 z-30 w-11 h-11 rounded-full bg-card border border-border shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        <Search className="w-5 h-5 text-[#034ea2] dark:text-[#6BA0F5]" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-16 px-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-[420px] bg-card rounded-2xl border border-border shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search input */}
              <div className="flex items-center gap-2 px-4 h-14 border-b border-border">
                <Search className="w-5 h-5 text-muted-foreground shrink-0" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو در هستو... (صفحات، خدمات، قراردادها)"
                  className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                />
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  aria-label="بستن"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[400px] overflow-y-auto scrollbar-thin p-2">
                {filtered.length === 0 ? (
                  <div className="py-12 text-center">
                    <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">نتیجه‌ای یافت نشد</p>
                  </div>
                ) : (
                  Object.entries(grouped).map(([category, catItems]) => (
                    <div key={category} className="mb-2">
                      <p className="text-[10px] font-bold text-muted-foreground px-2 py-1.5 uppercase tracking-wide">
                        {category}
                      </p>
                      {catItems.map((item) => {
                        flatIndex++;
                        const idx = flatIndex;
                        const isSelected = idx === selectedIndex;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              item.action();
                              setOpen(false);
                              setQuery("");
                            }}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={cn(
                              "w-full flex items-center gap-3 px-2.5 py-2 rounded-xl transition-colors text-right",
                              isSelected ? "bg-[#034ea2]/10 dark:bg-[#6BA0F5]/10" : "hover:bg-muted/50"
                            )}
                          >
                            <div
                              className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                isSelected ? "bg-[#034ea2] dark:bg-[#6BA0F5]" : "bg-muted"
                              )}
                            >
                              <item.icon
                                className={cn(
                                  "w-4 h-4",
                                  isSelected ? "text-white" : "text-muted-foreground"
                                )}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.title}</p>
                              <p className="text-[11px] text-muted-foreground truncate">{item.subtitle}</p>
                            </div>
                            {isSelected && (
                              <CornerDownLeft className="w-3.5 h-3.5 text-[#034ea2] dark:text-[#6BA0F5] shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border px-4 py-2 flex items-center justify-between text-[10px] text-muted-foreground">
                <div className="flex items-center gap-2">
                  <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">↑↓</kbd>
                  <span>ناوبری</span>
                  <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">↵</kbd>
                  <span>انتخاب</span>
                </div>
                <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">Esc</kbd>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
