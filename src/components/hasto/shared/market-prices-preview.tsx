"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/hasto-store";
import { currencies, goldPrices, cryptoPrices, fa } from "@/lib/hasto-data";
import { TrendingUp, TrendingDown, ChevronLeft, Coins } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Tab = "currency" | "gold" | "crypto";

export function MarketPricesPreview() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);
  const [tab, setTab] = useState<Tab>("currency");

  const items =
    tab === "currency"
      ? currencies.slice(0, 4).map((c) => ({ name: c.code, fullName: c.name, flag: c.flag, price: c.buyRate, change: c.change, trend: c.trend }))
      : tab === "gold"
      ? goldPrices.slice(0, 4).map((g) => ({ name: g.name, fullName: g.unit, flag: g.icon, price: g.price, change: g.change, trend: g.trend }))
      : cryptoPrices.slice(0, 4).map((c) => ({ name: c.symbol, fullName: c.name, flag: c.icon, price: c.price, change: c.change, trend: c.trend, color: c.color }));

  const tabs: { id: Tab; label: string }[] = [
    { id: "currency", label: "ارز" },
    { id: "gold", label: "طلا" },
    { id: "crypto", label: "کریپتو" },
  ];

  const formatPrice = (p: number) => {
    if (p >= 1000000000) return fa((p / 1000000000).toFixed(2)) + " میلیارد";
    if (p >= 1000000) return fa((p / 1000000).toFixed(1)) + " میلیون";
    if (p >= 1000) return fa((p / 1000).toFixed(0)) + " هزار";
    return fa(p.toLocaleString());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="rounded-3xl bg-card border border-border p-4 shadow-soft"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#10B981]/15 flex items-center justify-center">
            <Coins className="w-4 h-4 text-[#10B981]" />
          </div>
          <div>
            <h3 className="font-bold text-sm">بازار</h3>
            <p className="text-[10px] text-muted-foreground">نرخ زنده</p>
          </div>
        </div>
        <button
          onClick={() => setB2CScreen("currency-converter")}
          className="text-[11px] font-medium text-[#034ea2] dark:text-[#6BA0F5] flex items-center gap-1"
        >
          تبدیل
          <ChevronLeft className="w-3 h-3" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-3">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all",
              tab === t.id
                ? "bg-[#034ea2]/10 dark:bg-[#6BA0F5]/15 text-[#034ea2] dark:text-[#6BA0F5]"
                : "text-muted-foreground hover:bg-muted/50"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Prices list */}
      <div className="space-y-1.5">
        {items.map((item, idx) => (
          <motion.div
            key={item.name + idx}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.04 }}
            className="flex items-center gap-2 py-1.5"
          >
            <span className="text-base shrink-0">{item.flag}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold">{item.name}</p>
              <p className="text-[9px] text-muted-foreground truncate">{item.fullName}</p>
            </div>
            <div className="text-left">
              <p className="text-xs font-bold tabular-nums">{formatPrice(item.price)}</p>
              <p className="text-[9px] text-muted-foreground">تومان</p>
            </div>
            <div
              className={cn(
                "flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-bold shrink-0",
                item.trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              )}
            >
              {item.trend === "up" ? (
                <TrendingUp className="w-2 h-2" />
              ) : (
                <TrendingDown className="w-2 h-2" />
              )}
              {fa(Math.abs(item.change))}٪
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
