"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "./animated-number";
import { monthlySpendingLimit, fa } from "@/lib/hasto-data";
import { Wallet, TrendingDown, Calendar, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function SpendingLimitWidget() {
  const { limit, spent, remaining, progress, daysLeft, dailyAverage, topCategory, topCategoryAmountText } = monthlySpendingLimit;

  const isOverBudget = progress >= 100;
  const isWarning = progress >= 80 && progress < 100;
  const statusColor = isOverBudget ? "#EF4444" : isWarning ? "#F59E0B" : "#16a34a";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-3xl bg-card border border-border p-5 shadow-soft relative overflow-hidden"
    >
      {/* Decorative element */}
      <div
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-5 blur-2xl"
        style={{ background: statusColor }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: `${statusColor}15` }}
          >
            <Wallet className="w-4 h-4" style={{ color: statusColor }} />
          </div>
          <div>
            <h3 className="font-bold text-sm">بودجه ماهانه</h3>
            <p className="text-[10px] text-muted-foreground">{fa(daysLeft)} روز باقی مانده</p>
          </div>
        </div>
        {isWarning && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-warning/10">
            <AlertTriangle className="w-3 h-3 text-warning" />
            <span className="text-[10px] font-bold text-warning">هشدار</span>
          </div>
        )}
      </div>

      {/* Amount display */}
      <div className="flex items-baseline gap-2 mb-3">
        <AnimatedNumber
          value={spent}
          duration={1200}
          className="text-2xl font-bold tabular-nums"
        />
        <span className="text-xs text-muted-foreground">
          از {limit.toLocaleString("en-US")} تومان
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative h-3 rounded-full bg-muted overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, progress)}%` }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className="h-full rounded-full relative overflow-hidden"
          style={{ background: `linear-gradient(90deg, ${statusColor}, ${statusColor}dd)` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 shimmer" />
        </motion.div>
        {/* Threshold markers */}
        <div className="absolute top-0 bottom-0 w-px bg-destructive/30" style={{ right: "20%" }} />
      </div>

      {/* Progress info */}
      <div className="flex items-center justify-between text-[11px] mb-3">
        <span className="text-muted-foreground">
          <span className="font-bold tabular-nums" style={{ color: statusColor }}>
            {fa(progress)}٪
          </span>{" "}
          مصرف شده
        </span>
        <span className="text-muted-foreground">
          باقیمانده: <span className="font-bold tabular-nums text-foreground">{fa(remaining.toLocaleString())}</span> تومان
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
            <TrendingDown className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-[9px] text-muted-foreground">میانگین روزانه</p>
            <p className="text-xs font-bold tabular-nums">{fa(dailyAverage.toLocaleString())}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-[9px] text-muted-foreground">بیشترین هزینه</p>
            <p className="text-xs font-bold">{topCategory} ({topCategoryAmountText})</p>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      {!isOverBudget && (
        <div className="mt-3 p-2.5 rounded-xl bg-muted/50 flex items-start gap-2">
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: `${statusColor}20` }}
          >
            <span className="text-[8px]" style={{ color: statusColor }}>★</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            {isWarning
              ? "به سقف بودجه نزدیک شدید. مصرف خود را کنترل کنید."
              : `روزانه حداکثر ${fa(Math.round(remaining / daysLeft).toLocaleString())} تومان می‌توانید خرج کنید.`}
          </p>
        </div>
      )}
    </motion.div>
  );
}
