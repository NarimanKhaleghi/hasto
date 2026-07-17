"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/hasto-store";
import { user, totalDebts, totalReceivables, totalSavingsGoals, fa } from "@/lib/hasto-data";
import { AnimatedNumber } from "./animated-number";
import { TrendingUp, TrendingDown, Wallet, Target, ArrowDownLeft, ArrowUpRight } from "lucide-react";

export function QuickStatsBar() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);

  const stats = [
    {
      label: "موجودی",
      value: user.wallet.balance,
      icon: Wallet,
      color: "#034ea2",
      screen: "wallet-detail" as const,
    },
    {
      label: "پس‌انداز",
      value: totalSavingsGoals,
      icon: Target,
      color: "#16a34a",
      screen: "savings-goals" as const,
    },
    {
      label: "طلب‌ها",
      value: totalReceivables,
      icon: ArrowDownLeft,
      color: "#0EA5E9",
      screen: "financial" as const,
    },
    {
      label: "بدهی‌ها",
      value: totalDebts,
      icon: ArrowUpRight,
      color: "#EF4444",
      screen: "financial" as const,
    },
  ];

  const formatValue = (v: number) => {
    if (v >= 1000000000) return fa((v / 1000000000).toFixed(1)) + " میلیارد";
    if (v >= 1000000) return fa((v / 1000000).toFixed(1)) + " میلیون";
    if (v >= 1000) return fa((v / 1000).toFixed(0)) + " هزار";
    return fa(v.toLocaleString());
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="grid grid-cols-4 gap-2"
    >
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.button
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + idx * 0.05 }}
            onClick={() => setB2CScreen(stat.screen)}
            className="flex flex-col items-center p-2.5 rounded-2xl bg-card border border-border shadow-soft hover:shadow-md transition-shadow group"
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform"
              style={{ background: `${stat.color}15` }}
            >
              <Icon className="w-4 h-4" style={{ color: stat.color }} />
            </div>
            <span className="text-[10px] font-bold tabular-nums leading-tight" style={{ color: stat.color }}>
              {formatValue(stat.value)}
            </span>
            <span className="text-[9px] text-muted-foreground mt-0.5">{stat.label}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
