"use client";

import { motion } from "framer-motion";
import { cashFlowData, fa } from "@/lib/hasto-data";
import { AnimatedNumber } from "./animated-number";
import { TrendingUp, TrendingDown, Scale } from "lucide-react";

export function IncomeExpenseComparison() {
  // Current month (last entry)
  const current = cashFlowData[cashFlowData.length - 1];
  const previous = cashFlowData[cashFlowData.length - 2];

  const incomeChange = ((current.income - previous.income) / previous.income) * 100;
  const expenseChange = ((current.expense - previous.expense) / previous.expense) * 100;
  const savings = current.income - current.expense;
  const savingsRate = (savings / current.income) * 100;

  const maxVal = Math.max(current.income, current.expense);
  const incomePct = (current.income / maxVal) * 100;
  const expensePct = (current.expense / maxVal) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-3xl bg-card border border-border p-4 shadow-soft"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#034ea2]/15 dark:bg-[#6BA0F5]/15 flex items-center justify-center">
            <Scale className="w-4 h-4 text-[#034ea2] dark:text-[#6BA0F5]" />
          </div>
          <div>
            <h3 className="font-bold text-sm">درآمد و هزینه</h3>
            <p className="text-[10px] text-muted-foreground">ماه {current.month}</p>
          </div>
        </div>
        <div className="text-left">
          <p className="text-[10px] text-muted-foreground">نرخ پس‌انداز</p>
          <p className="text-xs font-bold tabular-nums text-success">{fa(savingsRate.toFixed(0))}٪</p>
        </div>
      </div>

      {/* Comparison bars */}
      <div className="space-y-3 mb-4">
        {/* Income */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="font-medium">درآمد</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tabular-nums">
                <AnimatedNumber value={current.income} duration={1000} />
              </span>
              <span className="text-[9px] text-muted-foreground">تومان</span>
              <span className={`text-[9px] font-bold tabular-nums ${incomeChange >= 0 ? "text-success" : "text-destructive"}`}>
                {incomeChange >= 0 ? "+" : ""}{fa(incomeChange.toFixed(0))}٪
              </span>
            </div>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${incomePct}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="h-full rounded-full bg-gradient-to-l from-[#16a34a] to-[#22c55e] relative overflow-hidden"
            >
              <div className="absolute inset-0 shimmer" />
            </motion.div>
          </div>
        </div>

        {/* Expense */}
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <div className="flex items-center gap-1.5">
              <TrendingDown className="w-3 h-3 text-destructive" />
              <span className="font-medium">هزینه</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold tabular-nums">
                <AnimatedNumber value={current.expense} duration={1000} />
              </span>
              <span className="text-[9px] text-muted-foreground">تومان</span>
              <span className={`text-[9px] font-bold tabular-nums ${expenseChange >= 0 ? "text-destructive" : "text-success"}`}>
                {expenseChange >= 0 ? "+" : ""}{fa(expenseChange.toFixed(0))}٪
              </span>
            </div>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${expensePct}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
              className="h-full rounded-full bg-gradient-to-l from-[#EF4444] to-[#dc2626]"
            />
          </div>
        </div>
      </div>

      {/* Net savings */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-success/5 border border-success/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-success/15 flex items-center justify-center">
            <span className="text-sm">💰</span>
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">پس‌انداز خالص</p>
            <p className="text-xs font-bold tabular-nums text-success">
              +<AnimatedNumber value={savings} duration={1000} /> تومان
            </p>
          </div>
        </div>
        <div className="text-left">
          <p className="text-[9px] text-muted-foreground"> نسبت به ماه قبل</p>
          <p className="text-[10px] font-bold tabular-nums text-success">
            {fa(((savings / (previous.income - previous.expense) - 1) * 100).toFixed(0))}٪
          </p>
        </div>
      </div>
    </motion.div>
  );
}
