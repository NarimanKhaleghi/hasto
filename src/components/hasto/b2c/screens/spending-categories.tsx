"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { spendingCategories, totalSpending, fa, parseFa, type SpendingCategory } from "@/lib/hasto-data";
import { AnimatedNumber } from "@/components/hasto/shared/animated-number";
import { TrendingUp, TrendingDown, ChevronLeft, X, PieChart, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function SpendingCategoriesScreen() {
  const [selected, setSelected] = useState<SpendingCategory | null>(null);
  const [view, setView] = useState<"list" | "pie">("list");

  return (
    <div className="pb-4">
      {/* Header summary */}
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] text-white shadow-lg shadow-[#8B5CF6]/20"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-white/5 blur-2xl" />

          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <PieChart className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base">دسته‌بندی هزینه‌ها</h2>
                  <p className="text-[11px] text-white/60">ماه جاری</p>
                </div>
              </div>
              {/* View toggle */}
              <div className="flex gap-1 p-1 rounded-xl bg-white/10">
                <button
                  onClick={() => setView("list")}
                  className={cn(
                    "p-1.5 rounded-lg transition-all",
                    view === "list" ? "bg-white/20" : ""
                  )}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setView("pie")}
                  className={cn(
                    "p-1.5 rounded-lg transition-all",
                    view === "pie" ? "bg-white/20" : ""
                  )}
                >
                  <PieChart className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-white/60 mb-1">مجموع هزینه‌ها</p>
              <p className="text-3xl font-bold tabular-nums">
                <AnimatedNumber value={totalSpending} duration={1200} />
                <span className="text-sm font-normal mr-2">تومان</span>
              </p>
            </div>

            {/* Mini donut visualization */}
            <div className="mt-4 flex items-center gap-3">
              <div className="relative w-16 h-16 shrink-0">
                <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
                  <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="6" />
                  {(() => {
                    const circumference = 2 * Math.PI * 26;
                    // Compute cumulative offsets upfront (pure, no mutation in map)
                    const segments = spendingCategories.reduce<
                      Array<{ cat: SpendingCategory; offset: number; dash: number }>
                    >((acc, cat) => {
                      const dash = (cat.percentage / 100) * circumference;
                      const prevOffset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0;
                      acc.push({ cat, offset: prevOffset, dash });
                      return acc;
                    }, []);
                    return segments.map(({ cat, offset, dash }, idx) => (
                      <motion.circle
                        key={cat.id}
                        cx="32" cy="32" r="26"
                        fill="none"
                        stroke={cat.color}
                        strokeWidth="6"
                        strokeDasharray={`${dash} ${circumference}`}
                        initial={{ strokeDashoffset: -offset }}
                        animate={{ strokeDashoffset: -offset }}
                        transition={{ duration: 0.8, delay: 0.3 + idx * 0.1 }}
                      />
                    ));
                  })()}
                </svg>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-1.5">
                {spendingCategories.slice(0, 4).map((cat) => (
                  <div key={cat.id} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                    <span className="text-[9px] text-white/80 truncate">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Categories list */}
      <div className="px-4 space-y-2">
        {spendingCategories.map((cat, idx) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            onClick={() => setSelected(cat)}
            className="w-full p-3 rounded-2xl bg-card border border-border shadow-soft text-right hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: `${cat.color}15` }}
              >
                {cat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm truncate">{cat.name}</h3>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0"
                    style={{ background: `${cat.color}15`, color: cat.color }}
                  >
                    {fa(cat.percentage)}٪
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">{fa(cat.transactionCount)} تراکنش</p>
              </div>
              <div className="text-left shrink-0">
                <p className="font-bold text-sm tabular-nums">{cat.amountText}</p>
                <div className={cn(
                  "flex items-center justify-end gap-0.5 text-[10px] font-bold",
                  cat.trendDirection === "up" ? "text-destructive" : "text-success"
                )}>
                  {cat.trendDirection === "up" ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                  {fa(Math.abs(cat.trend))}٪
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${cat.percentage}%` }}
                transition={{ duration: 1, delay: 0.2 + idx * 0.04, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: cat.color }}
              />
            </div>
          </motion.button>
        ))}
      </div>

      {/* Insight banner */}
      <div className="px-4 mt-4">
        <div className="p-3 rounded-2xl bg-warning/10 border border-warning/20 flex items-start gap-2">
          <div className="w-5 h-5 rounded-full bg-warning/20 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-[10px]">💡</span>
          </div>
          <div>
            <p className="text-xs font-bold mb-0.5">بیشترین هزینه</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              در ماه جاری بیشترین هزینه شما در دسته «خوراک و رستوران» بوده است. می‌توانید با تنظیم بودجه، هزینه‌های خود را کنترل کنید.
            </p>
          </div>
        </div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <CategoryDetailModal category={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function CategoryDetailModal({
  category,
  onClose,
}: {
  category: SpendingCategory;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full max-w-[420px] bg-background rounded-t-3xl p-6 pb-8 max-h-[85vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">جزئیات دسته</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-3"
            style={{ background: `${category.color}15` }}
          >
            {category.icon}
          </div>
          <h3 className="font-bold text-base">{category.name}</h3>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-bold mt-1"
            style={{ background: `${category.color}15`, color: category.color }}
          >
            {fa(category.percentage)}٪ از کل هزینه‌ها
          </span>
        </div>

        {/* Amount */}
        <div className="p-4 rounded-2xl text-center mb-4" style={{ background: `${category.color}10` }}>
          <p className="text-[11px] text-muted-foreground mb-1">مجموع هزینه</p>
          <p className="text-2xl font-bold tabular-nums" style={{ color: category.color }}>
            {category.amountText}
            <span className="text-xs font-normal text-muted-foreground mr-1">تومان</span>
          </p>
          <div className="flex items-center justify-center gap-3 mt-2 text-[10px]">
            <span className="text-muted-foreground">{fa(category.transactionCount)} تراکنش</span>
            <span className={cn(
              "flex items-center gap-0.5 font-bold",
              category.trendDirection === "up" ? "text-destructive" : "text-success"
            )}>
              {category.trendDirection === "up" ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
              {fa(Math.abs(category.trend))}٪ نسبت به ماه قبل
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="text-muted-foreground">سهم از کل</span>
            <span className="font-bold tabular-nums">{fa(category.percentage)}٪</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${category.percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${category.color}, ${category.color}dd)` }}
            />
          </div>
        </div>

        {/* Subcategories */}
        <div className="mb-4">
          <h4 className="text-xs font-bold text-muted-foreground mb-2">زیردسته‌ها</h4>
          <div className="space-y-2">
            {category.subcategories.map((sub, idx) => (
              <motion.div
                key={sub.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="flex items-center justify-between p-2.5 rounded-xl bg-muted/50"
              >
                <span className="text-xs font-medium">{sub.name}</span>
                <div className="text-left">
                  <span className="text-xs font-bold tabular-nums">{sub.amountText}</span>
                  <span className="text-[9px] text-muted-foreground mr-1">تومان</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.info("تنظیم بودجه برای این دسته");
              onClose();
            }}
            className="flex-1 h-11 rounded-xl text-white font-bold text-sm"
            style={{ background: category.color }}
          >
            تنظیم بودجه
          </button>
          <button
            onClick={onClose}
            className="px-4 h-11 rounded-xl bg-muted text-foreground font-bold text-sm"
          >
            بستن
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
