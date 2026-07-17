"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/hasto-store";
import { achievements, unlockedAchievements, fa, type Achievement } from "@/lib/hasto-data";
import { Trophy, Lock, Star, CheckCircle2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const categoryLabels: Record<string, string> = {
  payment: "پرداخت",
  savings: "پس‌انداز",
  social: "اجتماعی",
  security: "امنیت",
  streak: "پیاپی",
};

const categoryColors: Record<string, string> = {
  payment: "#034ea2",
  savings: "#16a34a",
  social: "#0EA5E9",
  security: "#6366F1",
  streak: "#EC4899",
};

export function AchievementsScreen() {
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Achievement | null>(null);

  const filtered = filter === "all" ? achievements : achievements.filter((a) => a.category === filter);
  const categories = ["all", ...Object.keys(categoryLabels)];

  return (
    <div className="pb-4">
      {/* Header summary */}
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-[#F59E0B] via-[#EF4444] to-[#EC4899] text-white shadow-lg"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-white/5 blur-2xl" />

          <div className="relative flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-lg">دستاوردها</h2>
              <p className="text-xs text-white/70">
                {fa(unlockedAchievements)} از {fa(achievements.length)} دستاورد باز شده
              </p>
              <div className="flex items-center gap-1 mt-1">
                <div className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(unlockedAchievements / achievements.length) * 100}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    className="h-full rounded-full bg-white"
                  />
                </div>
                <span className="text-[10px] font-bold tabular-nums">
                  {fa(Math.round((unlockedAchievements / achievements.length) * 100))}٪
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category filter */}
      <div className="px-4 mb-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                filter === cat
                  ? "bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white shadow-md"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {cat === "all" ? "همه" : categoryLabels[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements grid */}
      <div className="px-4">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((ach, idx) => (
            <motion.button
              key={ach.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => {
                setSelected(ach);
                if (ach.unlocked) toast.success(`دستاورد: ${ach.title}`);
              }}
              className={cn(
                "relative overflow-hidden rounded-2xl p-4 text-center transition-all hover:scale-[1.02]",
                ach.unlocked
                  ? "bg-card border-2 shadow-soft"
                  : "bg-muted/50 border border-border"
              )}
              style={ach.unlocked ? { borderColor: `${ach.color}40` } : {}}
            >
              {/* Background glow for unlocked */}
              {ach.unlocked && (
                <div
                  className="absolute inset-0 opacity-10"
                  style={{ background: `radial-gradient(circle at center, ${ach.color}, transparent 70%)` }}
                />
              )}

              <div className="relative">
                {/* Icon */}
                <div className="relative inline-block mb-2">
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto",
                      ach.unlocked ? "" : "grayscale opacity-40"
                    )}
                    style={{ background: ach.unlocked ? `${ach.color}20` : "rgba(0,0,0,0.1)" }}
                  >
                    {ach.unlocked ? ach.icon : <Lock className="w-6 h-6 text-muted-foreground" />}
                  </div>
                  {ach.unlocked && (
                    <div
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ background: ach.color }}
                    >
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3 className={cn(
                  "font-bold text-xs mb-1",
                  ach.unlocked ? "text-foreground" : "text-muted-foreground"
                )}>
                  {ach.title}
                </h3>

                {/* Description */}
                <p className={cn(
                  "text-[10px] leading-tight mb-2",
                  ach.unlocked ? "text-muted-foreground" : "text-muted-foreground/60"
                )}>
                  {ach.description}
                </p>

                {/* Progress or date */}
                {ach.unlocked ? (
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-2.5 h-2.5" style={{ color: ach.color }} fill={ach.color} />
                    <span className="text-[9px] font-bold" style={{ color: ach.color }}>
                      {ach.unlockedDate}
                    </span>
                  </div>
                ) : ach.progress ? (
                  <div>
                    <div className="h-1 rounded-full bg-muted overflow-hidden mb-1">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${ach.progress}%`, background: ach.color }}
                      />
                    </div>
                    <span className="text-[9px] font-bold tabular-nums" style={{ color: ach.color }}>
                      {fa(ach.progress)}٪
                    </span>
                  </div>
                ) : (
                  <span className="text-[9px] text-muted-foreground">باز نشده</span>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Detail modal */}
      {selected && (
        <AchievementDetailModal achievement={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function AchievementDetailModal({
  achievement,
  onClose,
}: {
  achievement: Achievement;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="w-full max-w-[340px] bg-card rounded-3xl p-6 text-center relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background gradient */}
        {achievement.unlocked && (
          <div
            className="absolute inset-0 opacity-10"
            style={{ background: `radial-gradient(circle at top, ${achievement.color}, transparent 60%)` }}
          />
        )}

        <button
          onClick={onClose}
          className="absolute top-3 left-3 p-1.5 rounded-full hover:bg-muted z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="relative">
          {/* Large icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", delay: 0.1, damping: 12 }}
            className={cn(
              "w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-4",
              achievement.unlocked ? "" : "grayscale opacity-40"
            )}
            style={{ background: achievement.unlocked ? `${achievement.color}20` : "rgba(0,0,0,0.1)" }}
          >
            {achievement.unlocked ? achievement.icon : <Lock className="w-10 h-10 text-muted-foreground" />}
          </motion.div>

          {/* Category badge */}
          <span
            className="inline-block text-[10px] px-2.5 py-1 rounded-full font-bold mb-3"
            style={{ background: `${achievement.color}15`, color: achievement.color }}
          >
            {categoryLabels[achievement.category]}
          </span>

          {/* Title */}
          <h2 className="font-bold text-lg mb-1">{achievement.title}</h2>
          <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>

          {/* Status */}
          {achievement.unlocked ? (
            <div className="p-3 rounded-xl bg-success/10 border border-success/20">
              <div className="flex items-center justify-center gap-2 text-success">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-bold">باز شده!</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                تاریخ: {achievement.unlockedDate}
              </p>
            </div>
          ) : achievement.progress ? (
            <div className="p-3 rounded-xl bg-muted/50">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-muted-foreground">پیشرفت</span>
                <span className="font-bold tabular-nums" style={{ color: achievement.color }}>
                  {fa(achievement.progress)}٪
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${achievement.progress}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full rounded-full"
                  style={{ background: achievement.color }}
                />
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">
                به ادامه فعالیت خود نزدیک‌تر شوید!
              </p>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-muted/50">
              <p className="text-xs text-muted-foreground">این دستاورد هنوز باز نشده است</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
