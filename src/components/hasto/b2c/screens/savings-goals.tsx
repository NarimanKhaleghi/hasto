"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/hasto-store";
import { AnimatedNumber } from "@/components/hasto/shared/animated-number";
import { savingsGoals, totalSavingsGoals, totalSavingsTargets, fa, parseFa, type SavingsGoal } from "@/lib/hasto-data";
import { Plus, Target, TrendingUp, Calendar, X, Check, Sparkles, Trophy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function SavingsGoalsScreen() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);

  const totalProgress = Math.round((totalSavingsGoals / totalSavingsTargets) * 100);

  return (
    <div className="pb-4">
      {/* Header summary */}
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-[#16a34a] to-[#065f46] text-white shadow-lg shadow-[#16a34a]/20"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-white/5 blur-2xl" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base">اهداف پس‌انداز</h2>
                <p className="text-[11px] text-white/60">{fa(savingsGoals.length)} هدف فعال</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-[10px] text-white/60 mb-0.5">پس‌انداز شده</p>
                <p className="text-xl font-bold tabular-nums">
                  <AnimatedNumber value={totalSavingsGoals} duration={1200} />
                  <span className="text-xs font-normal mr-1">تومان</span>
                </p>
              </div>
              <div>
                <p className="text-[10px] text-white/60 mb-0.5">هدف کل</p>
                <p className="text-xl font-bold tabular-nums">
                  <AnimatedNumber value={totalSavingsTargets} duration={1200} />
                  <span className="text-xs font-normal mr-1">تومان</span>
                </p>
              </div>
            </div>

            {/* Overall progress */}
            <div className="mt-4">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="text-white/70">پیشرفت کلی</span>
                <span className="font-bold tabular-nums">{fa(totalProgress)}٪</span>
              </div>
              <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${totalProgress}%` }}
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                  className="h-full rounded-full bg-white"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Goals list */}
      <div className="px-4 space-y-3">
        {savingsGoals.map((goal, idx) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setSelectedGoal(goal)}
            className="rounded-2xl bg-card border border-border p-4 shadow-soft cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: `${goal.color}15` }}
              >
                {goal.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm truncate">{goal.title}</h3>
                  <span
                    className="text-[9px] px-1.5 py-0.5 rounded-full font-medium shrink-0"
                    style={{ background: `${goal.color}15`, color: goal.color }}
                  >
                    {goal.category}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  سررسید: {goal.dueDate}
                </p>
              </div>
              {goal.progress >= 80 && (
                <Trophy className="w-4 h-4 text-warning shrink-0" />
              )}
            </div>

            {/* Progress */}
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="font-bold tabular-nums" style={{ color: goal.color }}>
                {goal.currentAmountText} <span className="text-muted-foreground font-normal">/ {goal.targetAmountText}</span>
              </span>
              <span className="font-bold tabular-nums">{fa(goal.progress)}٪</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${goal.progress}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 + idx * 0.05 }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${goal.color}, ${goal.color}dd)` }}
              />
            </div>

            <div className="flex items-center justify-between mt-2.5">
              <span className="text-[10px] text-muted-foreground">
                باقیمانده: <span className="font-bold text-foreground tabular-nums">{goal.remainingText} تومان</span>
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toast.success(`${goal.currentAmountText} تومان به «${goal.title}» اضافه شد`);
                }}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg text-white"
                style={{ background: goal.color }}
              >
                + پس‌انداز
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add new goal FAB */}
      <button
        onClick={() => setShowAddForm(true)}
        className="sticky bottom-20 z-30 flex items-center gap-2 px-6 h-12 mx-auto w-fit rounded-full bg-gradient-to-l from-[#16a34a] to-[#065f46] text-white shadow-lg shadow-[#16a34a]/30 active:scale-95 transition-transform"
      >
        <Plus className="w-5 h-5" />
        <span className="font-bold text-sm">هدف جدید</span>
      </button>

      {/* Goal detail sheet */}
      <AnimatePresence>
        {selectedGoal && (
          <GoalDetailSheet goal={selectedGoal} onClose={() => setSelectedGoal(null)} />
        )}
      </AnimatePresence>

      {/* Add goal form */}
      <AnimatePresence>
        {showAddForm && (
          <AddGoalForm onClose={() => setShowAddForm(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function GoalDetailSheet({ goal, onClose }: { goal: SavingsGoal; onClose: () => void }) {
  const [amount, setAmount] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full max-w-[420px] bg-background rounded-t-3xl p-6 pb-8 max-h-[90vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">جزئیات هدف</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Goal header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-3"
            style={{ background: `${goal.color}15` }}
          >
            {goal.icon}
          </div>
          <h3 className="font-bold text-base">{goal.title}</h3>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-medium mt-1"
            style={{ background: `${goal.color}15`, color: goal.color }}
          >
            {goal.category}
          </span>
        </div>

        {/* Progress ring */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
              <circle cx="70" cy="70" r="60" fill="none" stroke="currentColor" strokeWidth="10" className="text-muted/30" />
              <motion.circle
                cx="70" cy="70" r="60"
                fill="none"
                stroke={goal.color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 60}
                initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 60 - (goal.progress / 100) * 2 * Math.PI * 60 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold tabular-nums" style={{ color: goal.color }}>{fa(goal.progress)}٪</span>
              <span className="text-[10px] text-muted-foreground">تکمیل شده</span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <p className="text-[10px] text-muted-foreground mb-1">هدف</p>
            <p className="text-xs font-bold tabular-nums">{goal.targetAmountText}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <p className="text-[10px] text-muted-foreground mb-1">پس‌انداز شده</p>
            <p className="text-xs font-bold tabular-nums" style={{ color: goal.color }}>{goal.currentAmountText}</p>
          </div>
          <div className="text-center p-3 rounded-xl bg-muted/50">
            <p className="text-[10px] text-muted-foreground mb-1">باقیمانده</p>
            <p className="text-xs font-bold tabular-nums">{goal.remainingText}</p>
          </div>
        </div>

        {/* Due date */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 mb-4">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">تاریخ سررسید:</span>
          <span className="text-xs font-bold ms-auto">{goal.dueDate}</span>
        </div>

        {/* Add savings input */}
        <div className="mb-3">
          <label className="text-xs font-medium text-muted-foreground mb-2 block">مبلغ پس‌انداز جدید</label>
          <div className="flex gap-2">
            <input
              type="tel"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
              placeholder="مبلغ به تومان"
              className="flex-1 h-12 px-4 rounded-xl bg-muted border border-border outline-none focus:border-[#16a34a] text-sm tabular-nums"
              dir="ltr"
            />
            <button
              onClick={() => {
                if (amount && parseFa(amount) > 0) {
                  toast.success(`${fa(parseFa(amount).toLocaleString())} تومان به هدف اضافه شد`);
                  setAmount("");
                  onClose();
                }
              }}
              className="px-5 h-12 rounded-xl bg-[#16a34a] text-white font-bold text-sm"
            >
              ثبت
            </button>
          </div>
          {/* Quick amounts */}
          <div className="flex gap-2 mt-2">
            {["50000", "100000", "500000", "1000000"].map((q) => (
              <button
                key={q}
                onClick={() => setAmount(q)}
                className="flex-1 py-1.5 rounded-lg bg-muted hover:bg-muted/70 text-[11px] font-medium tabular-nums"
              >
                {fa(parseInt(q).toLocaleString())}
              </button>
            ))}
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={() => {
            toast.info("هدف حذف شد");
            onClose();
          }}
          className="w-full h-11 rounded-xl border border-destructive/20 text-destructive font-bold text-sm mt-2"
        >
          حذف هدف
        </button>
      </motion.div>
    </motion.div>
  );
}

function AddGoalForm({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("🎯");
  const [selectedColor, setSelectedColor] = useState("#034ea2");

  const icons = ["🎯", "✈️", "💻", "🚗", "🏠", "💍", "📚", "🎮", "🛡️", "📱", "🚲", "💵"];
  const colors = ["#034ea2", "#16a34a", "#F59E0B", "#EF4444", "#8B5CF6", "#0EA5E9", "#EC4899", "#10B981"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full max-w-[420px] bg-background rounded-t-3xl p-6 pb-8 max-h-[90vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">هدف پس‌انداز جدید</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="text-xs font-medium text-muted-foreground mb-2 block">عنوان هدف</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="مثلاً: سفر نوروزی"
            className="w-full h-12 px-4 rounded-xl bg-muted border border-border outline-none focus:border-[#16a34a] text-sm"
          />
        </div>

        {/* Target amount */}
        <div className="mb-4">
          <label className="text-xs font-medium text-muted-foreground mb-2 block">مبلغ هدف (تومان)</label>
          <input
            type="tel"
            inputMode="numeric"
            value={target}
            onChange={(e) => setTarget(e.target.value.replace(/\D/g, ""))}
            placeholder="مثلاً: ۵۰۰,۰۰۰,۰۰۰"
            className="w-full h-12 px-4 rounded-xl bg-muted border border-border outline-none focus:border-[#16a34a] text-sm tabular-nums"
            dir="ltr"
          />
          {target && (
            <p className="text-[11px] text-muted-foreground mt-1">
              {fa(parseFa(target).toLocaleString())} تومان
            </p>
          )}
        </div>

        {/* Icon picker */}
        <div className="mb-4">
          <label className="text-xs font-medium text-muted-foreground mb-2 block">آیکون</label>
          <div className="grid grid-cols-6 gap-2">
            {icons.map((icon) => (
              <button
                key={icon}
                onClick={() => setSelectedIcon(icon)}
                className={cn(
                  "aspect-square rounded-xl flex items-center justify-center text-2xl transition-all",
                  selectedIcon === icon ? "bg-[#16a34a]/15 ring-2 ring-[#16a34a]" : "bg-muted"
                )}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Color picker */}
        <div className="mb-6">
          <label className="text-xs font-medium text-muted-foreground mb-2 block">رنگ</label>
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "w-9 h-9 rounded-full transition-all",
                  selectedColor === color ? "ring-2 ring-offset-2 ring-offset-background" : ""
                )}
                style={{ background: color, boxShadow: selectedColor === color ? `0 0 0 2px ${color}` : "none" }}
              />
            ))}
          </div>
        </div>

        {/* Preview */}
        {title && (
          <div className="mb-4 p-3 rounded-xl bg-muted/50 border border-border">
            <p className="text-[10px] text-muted-foreground mb-2">پیش‌نمایش</p>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${selectedColor}15` }}>
                {selectedIcon}
              </div>
              <div>
                <p className="text-sm font-bold">{title}</p>
                <p className="text-[11px] text-muted-foreground tabular-nums">
                  {target ? fa(parseFa(target).toLocaleString()) : "۰"} تومان
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={() => {
            if (title && target) {
              toast.success("هدف پس‌انداز با موفقیت ساخته شد! 🎯");
              onClose();
            } else {
              toast.error("لطفاً عنوان و مبلغ را وارد کنید");
            }
          }}
          className="w-full h-12 rounded-xl bg-gradient-to-l from-[#16a34a] to-[#065f46] text-white font-bold text-sm flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          ساخت هدف
        </button>
      </motion.div>
    </motion.div>
  );
}
