"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { activityHeatmap, heatmapStats, fa } from "@/lib/hasto-data";
import { useAppStore } from "@/lib/hasto-store";
import { Activity, Flame, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const levelColors = [
  "#e5e7eb", // 0 - no activity (muted)
  "#9DBFF9", // 1 - low
  "#6BA0F5", // 2 - medium
  "#3A7FF1", // 3 - high
  "#034ea2", // 4 - very high
];

const darkLevelColors = [
  "#1f2937",
  "#1e3a5f",
  "#0456B5",
  "#034ea2",
  "#023069",
];

const dayNames = ["ش", "ی", "د", "س", "چ", "پ", "ج"];
const weekLabels = ["۱۲ هفته پیش", "۹", "۶", "۳", "اکنون"];

export function ActivityHeatmap() {
  const [hoveredCell, setHoveredCell] = useState<number | null>(null);
  const theme = useAppStore((s) => s.theme);
  const isDark = theme === "dark";
  const colors = isDark ? darkLevelColors : levelColors;

  // Group by week (12 columns)
  const weeks = Array.from({ length: 12 }, (_, w) =>
    activityHeatmap.filter((c) => c.week === w).sort((a, b) => a.day - b.day)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-3xl bg-card border border-border p-4 shadow-soft"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#034ea2]/15 dark:bg-[#6BA0F5]/15 flex items-center justify-center">
            <Activity className="w-4 h-4 text-[#034ea2] dark:text-[#6BA0F5]" />
          </div>
          <div>
            <h3 className="font-bold text-sm">فعالیت مالی</h3>
            <p className="text-[10px] text-muted-foreground">۱۲ هفته اخیر</p>
          </div>
        </div>
        {/* Streak badge */}
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-warning/10">
          <Flame className="w-3 h-3 text-warning" />
          <span className="text-[10px] font-bold text-warning">{fa(heatmapStats.streak)} روز پیاپی</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center p-2 rounded-xl bg-muted/50">
          <p className="text-[9px] text-muted-foreground">تراکنش‌ها</p>
          <p className="text-xs font-bold tabular-nums">{fa(heatmapStats.totalTransactions)}</p>
        </div>
        <div className="text-center p-2 rounded-xl bg-muted/50">
          <p className="text-[9px] text-muted-foreground">روز فعال</p>
          <p className="text-xs font-bold tabular-nums">{fa(heatmapStats.activeDays)}</p>
        </div>
        <div className="text-center p-2 rounded-xl bg-muted/50">
          <p className="text-[9px] text-muted-foreground">میانگین/روز</p>
          <p className="text-xs font-bold tabular-nums">{fa((heatmapStats.avgPerDay / 1000000).toFixed(1))}م</p>
        </div>
      </div>

      {/* Heatmap grid */}
      <div className="overflow-x-auto scrollbar-none pb-1">
        <div className="inline-flex flex-col gap-1 min-w-full">
          {/* Day labels + grid */}
          <div className="flex gap-1">
            {/* Day labels column */}
            <div className="flex flex-col gap-1 w-3 shrink-0">
              {dayNames.map((d, i) => (
                <div key={i} className="h-3 flex items-center justify-center text-[8px] text-muted-foreground">
                  {i % 2 === 0 ? d : ""}
                </div>
              ))}
            </div>
            {/* Weeks */}
            <div className="flex gap-1 flex-1">
              {weeks.map((week, wIdx) => (
                <div key={wIdx} className="flex flex-col gap-1 flex-1">
                  {week.map((cell, dIdx) => {
                    const cellIdx = wIdx * 7 + dIdx;
                    return (
                      <motion.div
                        key={cellIdx}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 + cellIdx * 0.005, duration: 0.2 }}
                        whileHover={{ scale: 1.3, zIndex: 10 }}
                        onHoverStart={() => setHoveredCell(cellIdx)}
                        onHoverEnd={() => setHoveredCell(null)}
                        className="aspect-square rounded-sm cursor-pointer transition-colors relative"
                        style={{ background: colors[cell.level] }}
                      >
                        {hoveredCell === cellIdx && cell.count > 0 && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-20 px-2 py-1 rounded-md bg-popover text-popover-foreground text-[9px] whitespace-nowrap shadow-lg border border-border">
                            {fa(cell.count)} تراکنش • {fa((cell.amount / 1000000).toFixed(1))}م تومان
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Week labels */}
          <div className="flex gap-1 mt-1">
            <div className="w-3 shrink-0" />
            <div className="flex-1 flex justify-between text-[8px] text-muted-foreground">
              <span>۱۲ هفته پیش</span>
              <span>۶</span>
              <span>اکنون</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
        <span className="text-[10px] text-muted-foreground">کمتر</span>
        <div className="flex items-center gap-1">
          {colors.map((color, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-sm"
              style={{ background: color }}
            />
          ))}
        </div>
        <span className="text-[10px] text-muted-foreground">بیشتر</span>
      </div>

      {/* Best day insight */}
      <div className="mt-3 p-2.5 rounded-xl bg-[#034ea2]/5 dark:bg-[#6BA0F5]/10 flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-[#034ea2]/15 dark:bg-[#6BA0F5]/15 flex items-center justify-center shrink-0">
          <Zap className="w-3.5 h-3.5 text-[#034ea2] dark:text-[#6BA0F5]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-muted-foreground">پرفعالیت‌ترین روز</p>
          <p className="text-[11px] font-bold">
            {fa(heatmapStats.bestDay.count)} تراکنش • {fa((heatmapStats.bestDay.amount / 1000000).toFixed(1))}م تومان
          </p>
        </div>
      </div>
    </motion.div>
  );
}
