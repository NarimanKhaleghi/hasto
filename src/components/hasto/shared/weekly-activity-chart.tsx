"use client";

import { motion } from "framer-motion";
import { weeklyActivity, fa } from "@/lib/hasto-data";
import { BarChart3, TrendingUp } from "lucide-react";
import { useState } from "react";

export function WeeklyActivityChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const maxAmount = Math.max(...weeklyActivity.map((d) => d.amount));
  const totalTransactions = weeklyActivity.reduce((s, d) => s + d.transactions, 0);
  const totalAmount = weeklyActivity.reduce((s, d) => s + d.amount, 0);
  const avgPerDay = totalAmount / 7;

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
          <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/15 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div>
            <h3 className="font-bold text-sm">فعالیت هفتگی</h3>
            <p className="text-[10px] text-muted-foreground">۷ روز اخیر</p>
          </div>
        </div>
        <div className="text-left">
          <p className="text-[10px] text-muted-foreground">مجموع</p>
          <p className="text-xs font-bold tabular-nums">{fa((totalAmount / 1000000).toFixed(1))}م ت</p>
        </div>
      </div>

      {/* Bar chart */}
      <div className="flex items-end justify-between gap-1.5 h-32 mb-2">
        {weeklyActivity.map((d, idx) => {
          const heightPct = (d.amount / maxAmount) * 100;
          const isHovered = hoveredIdx === idx;
          const isToday = idx === 6;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center gap-1 group cursor-pointer"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip */}
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-1 px-2 py-1 rounded-lg bg-popover text-popover-foreground text-[9px] whitespace-nowrap shadow-lg border border-border z-10"
                >
                  <div className="font-bold tabular-nums">{fa(d.transactions)} تراکنش</div>
                  <div className="text-muted-foreground tabular-nums">{fa(d.amount.toLocaleString())} ت</div>
                </motion.div>
              )}

              {/* Bar */}
              <div className="w-full flex-1 flex items-end relative">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPct}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + idx * 0.05, ease: "easeOut" }}
                  className="w-full rounded-t-lg relative overflow-hidden"
                  style={{
                    background: isToday
                      ? "linear-gradient(180deg, #034ea2, #0456B5)"
                      : isHovered
                      ? "linear-gradient(180deg, #6BA0F5, #3A7FF1)"
                      : "linear-gradient(180deg, #9DBFF9, #6BA0F5)",
                    minHeight: "4px",
                  }}
                >
                  {/* Shimmer on today's bar */}
                  {isToday && (
                    <div className="absolute inset-0 shimmer" />
                  )}
                </motion.div>
              </div>

              {/* Day label */}
              <span className={`text-[9px] ${isToday ? "font-bold text-[#034ea2] dark:text-[#6BA0F5]" : "text-muted-foreground"}`}>
                {d.day.slice(0, 2)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Stats footer */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
        <div className="text-center">
          <p className="text-[9px] text-muted-foreground">تراکنش‌ها</p>
          <p className="text-xs font-bold tabular-nums">{fa(totalTransactions)}</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] text-muted-foreground">میانگین/روز</p>
          <p className="text-xs font-bold tabular-nums">{fa((avgPerDay / 1000000).toFixed(1))}م ت</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] text-muted-foreground">روند</p>
          <div className="flex items-center justify-center gap-0.5">
            <TrendingUp className="w-3 h-3 text-success" />
            <span className="text-xs font-bold text-success tabular-nums">+۱۲٪</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
