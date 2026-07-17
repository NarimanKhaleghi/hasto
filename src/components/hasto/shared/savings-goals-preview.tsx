"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/hasto-store";
import { AnimatedNumber } from "./animated-number";
import { savingsGoals, totalSavingsGoals, totalSavingsTargets, fa } from "@/lib/hasto-data";
import { Target, ChevronLeft, Plus } from "lucide-react";

export function SavingsGoalsPreview() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);
  const totalProgress = Math.round((totalSavingsGoals / totalSavingsTargets) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-3xl bg-card border border-border p-4 shadow-soft"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#16a34a]/15 flex items-center justify-center">
            <Target className="w-4 h-4 text-[#16a34a]" />
          </div>
          <div>
            <h3 className="font-bold text-sm">اهداف پس‌انداز</h3>
            <p className="text-[10px] text-muted-foreground">{fa(savingsGoals.length)} هدف فعال</p>
          </div>
        </div>
        <button
          onClick={() => setB2CScreen("savings-goals")}
          className="text-[11px] font-medium text-[#034ea2] dark:text-[#6BA0F5] flex items-center gap-1"
        >
          همه
          <ChevronLeft className="w-3 h-3" />
        </button>
      </div>

      {/* Total summary */}
      <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-[#16a34a]/5">
        <div className="relative shrink-0">
          <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted/30" />
            <motion.circle
              cx="24" cy="24" r="20"
              fill="none"
              stroke="#16a34a"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 20}
              initial={{ strokeDashoffset: 2 * Math.PI * 20 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 20 - (totalProgress / 100) * 2 * Math.PI * 20 }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-bold tabular-nums text-[#16a34a]">{fa(totalProgress)}٪</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-[10px] text-muted-foreground">مجموع پس‌انداز</p>
          <p className="text-sm font-bold tabular-nums">
            <AnimatedNumber value={totalSavingsGoals} duration={1000} />
            <span className="text-[10px] font-normal text-muted-foreground mr-1">/ {fa(totalSavingsTargets.toLocaleString())} تومان</span>
          </p>
        </div>
      </div>

      {/* Top goals horizontal scroll */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {savingsGoals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => setB2CScreen("savings-goals")}
            className="shrink-0 w-32 p-2.5 rounded-xl bg-muted/50 border border-border text-right hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-lg">{goal.icon}</span>
              <span className="text-[10px] font-bold truncate flex-1">{goal.title}</span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden mb-1">
              <div
                className="h-full rounded-full"
                style={{ width: `${goal.progress}%`, background: goal.color }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[9px] text-muted-foreground tabular-nums">{fa(goal.progress)}٪</span>
              <span className="text-[9px] font-bold tabular-nums" style={{ color: goal.color }}>
                {goal.currentAmountText}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Quick add button */}
      <button
        onClick={() => setB2CScreen("savings-goals")}
        className="w-full mt-2 h-9 rounded-xl border-2 border-dashed border-[#16a34a]/30 text-[#16a34a] dark:text-[#4ade80] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#16a34a]/5 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        هدف جدید
      </button>
    </motion.div>
  );
}
