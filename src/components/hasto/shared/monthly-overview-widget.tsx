"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/hasto-store";
import { fa, cashFlowData } from "@/lib/hasto-data";
import { AnimatedNumber } from "./animated-number";
import { Calendar, TrendingUp, TrendingDown, ChevronLeft, Wallet } from "lucide-react";

export function MonthlyOverviewWidget() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);

  const current = cashFlowData[cashFlowData.length - 1];
  const previous = cashFlowData[cashFlowData.length - 2];

  const incomeChange = ((current.income - previous.income) / previous.income) * 100;
  const expenseChange = ((current.expense - previous.expense) / previous.expense) * 100;
  const netBalance = current.income - current.expense;

  // Generate month days for mini calendar
  const daysInMonth = 31;
  const today = 25; // mock today
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    // Mock: some days have income (green), some have expense (red), most neutral
    const seed = (day * 37) % 100;
    if (day > today) return { day, type: "future" as const };
    if (seed > 80) return { day, type: "income" as const };
    if (seed > 50) return { day, type: "expense" as const };
    return { day, type: "neutral" as const };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-3xl bg-card border border-border p-4 shadow-soft"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#034ea2]/15 dark:bg-[#6BA0F5]/15 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-[#034ea2] dark:text-[#6BA0F5]" />
          </div>
          <div>
            <h3 className="font-bold text-sm">خلاصه ماه</h3>
            <p className="text-[10px] text-muted-foreground">{current.month} ۱۴۰۵</p>
          </div>
        </div>
        <button
          onClick={() => setB2CScreen("calendar")}
          className="text-[11px] font-medium text-[#034ea2] dark:text-[#6BA0F5] flex items-center gap-1"
        >
          تقویم
          <ChevronLeft className="w-3 h-3" />
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-2 rounded-xl bg-success/5">
          <div className="flex items-center justify-center gap-0.5 mb-0.5">
            <TrendingUp className="w-2.5 h-2.5 text-success" />
            <span className="text-[8px] text-muted-foreground">درآمد</span>
          </div>
          <p className="text-[10px] font-bold tabular-nums text-success">
            {fa((current.income / 1000000).toFixed(1))}م
          </p>
          <p className={`text-[8px] tabular-nums ${incomeChange >= 0 ? "text-success" : "text-destructive"}`}>
            {incomeChange >= 0 ? "↑" : "↓"} {fa(Math.abs(incomeChange).toFixed(0))}٪
          </p>
        </div>
        <div className="text-center p-2 rounded-xl bg-destructive/5">
          <div className="flex items-center justify-center gap-0.5 mb-0.5">
            <TrendingDown className="w-2.5 h-2.5 text-destructive" />
            <span className="text-[8px] text-muted-foreground">هزینه</span>
          </div>
          <p className="text-[10px] font-bold tabular-nums text-destructive">
            {fa((current.expense / 1000000).toFixed(1))}م
          </p>
          <p className={`text-[8px] tabular-nums ${expenseChange >= 0 ? "text-destructive" : "text-success"}`}>
            {expenseChange >= 0 ? "↑" : "↓"} {fa(Math.abs(expenseChange).toFixed(0))}٪
          </p>
        </div>
        <div className="text-center p-2 rounded-xl bg-[#034ea2]/5 dark:bg-[#6BA0F5]/10">
          <div className="flex items-center justify-center gap-0.5 mb-0.5">
            <Wallet className="w-2.5 h-2.5 text-[#034ea2] dark:text-[#6BA0F5]" />
            <span className="text-[8px] text-muted-foreground">خالص</span>
          </div>
          <p className="text-[10px] font-bold tabular-nums text-[#034ea2] dark:text-[#6BA0F5]">
            {netBalance >= 0 ? "+" : ""}
            {fa((netBalance / 1000000).toFixed(1))}م
          </p>
          <p className="text-[8px] text-muted-foreground">تومان</p>
        </div>
      </div>

      {/* Mini calendar */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + idx * 0.008 }}
            className={`aspect-square rounded-md flex items-center justify-center text-[8px] font-medium relative ${
              d.type === "future"
                ? "text-muted-foreground/30"
                : d.type === "income"
                ? "bg-success/15 text-success font-bold"
                : d.type === "expense"
                ? "bg-destructive/15 text-destructive font-bold"
                : "text-muted-foreground"
            } ${d.day === today ? "ring-1 ring-[#034ea2] dark:ring-[#6BA0F5]" : ""}`}
          >
            {fa(d.day)}
            {d.day === today && (
              <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#034ea2] dark:bg-[#6BA0F5]" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-3 mt-3 pt-3 border-t border-border">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-success/30" />
          <span className="text-[8px] text-muted-foreground">درآمد</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm bg-destructive/30" />
          <span className="text-[8px] text-muted-foreground">هزینه</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-sm ring-1 ring-[#034ea2] dark:ring-[#6BA0F5]" />
          <span className="text-[8px] text-muted-foreground">امروز</span>
        </div>
      </div>
    </motion.div>
  );
}
