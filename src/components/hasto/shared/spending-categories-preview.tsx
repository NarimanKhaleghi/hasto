"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/hasto-store";
import { spendingCategories, totalSpending, fa } from "@/lib/hasto-data";
import { AnimatedNumber } from "./animated-number";
import { PieChart, ChevronLeft } from "lucide-react";

export function SpendingCategoriesPreview() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-3xl bg-card border border-border p-4 shadow-soft"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/15 flex items-center justify-center">
            <PieChart className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div>
            <h3 className="font-bold text-sm">دسته‌بندی هزینه‌ها</h3>
            <p className="text-[10px] text-muted-foreground">ماه جاری</p>
          </div>
        </div>
        <button
          onClick={() => setB2CScreen("spending-categories")}
          className="text-[11px] font-medium text-[#034ea2] dark:text-[#6BA0F5] flex items-center gap-1"
        >
          جزئیات
          <ChevronLeft className="w-3 h-3" />
        </button>
      </div>

      {/* Total amount */}
      <div className="flex items-baseline gap-2 mb-3">
        <AnimatedNumber
          value={totalSpending}
          duration={1000}
          className="text-xl font-bold tabular-nums"
        />
        <span className="text-xs text-muted-foreground">تومان کل هزینه</span>
      </div>

      {/* Horizontal stacked bar */}
      <div className="flex h-3 rounded-full overflow-hidden mb-3">
        {spendingCategories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ width: 0 }}
            animate={{ width: `${cat.percentage}%` }}
            transition={{ duration: 0.8, delay: 0.3 + idx * 0.05, ease: "easeOut" }}
            style={{ background: cat.color }}
            className="h-full first:rounded-r-full last:rounded-l-full"
            title={`${cat.name}: ${fa(cat.percentage)}٪`}
          />
        ))}
      </div>

      {/* Top 3 categories */}
      <div className="space-y-1.5">
        {spendingCategories.slice(0, 3).map((cat) => (
          <button
            key={cat.id}
            onClick={() => setB2CScreen("spending-categories")}
            className="w-full flex items-center gap-2 py-1 hover:bg-muted/30 rounded-lg px-1 -mx-1 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0" style={{ background: `${cat.color}15` }}>
              {cat.icon}
            </div>
            <span className="text-xs font-medium flex-1 text-right truncate">{cat.name}</span>
            <span className="text-xs font-bold tabular-nums">{fa(cat.percentage)}٪</span>
            <span className="text-[10px] text-muted-foreground tabular-nums w-16 text-left">{cat.amountText}</span>
          </button>
        ))}
      </div>
    </motion.div>
  );
}
