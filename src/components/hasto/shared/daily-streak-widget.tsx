"use client";

import { motion } from "framer-motion";
import { Flame, Gift, Star, Zap } from "lucide-react";
import { fa } from "@/lib/hasto-data";

const weekDays = ["ش", "ی", "د", "س", "چ", "پ", "ج"];

export function DailyStreakWidget() {
  // Mock: user has 14-day streak, today is day 4 of current week (index 3)
  const currentStreak = 14;
  const completedToday = true;
  const weekProgress = [true, true, true, true, false, false, false]; // Sat-Tue completed
  const weeklyGoal = 7;
  const completedThisWeek = weekProgress.filter(Boolean).length;

  const rewards = [
    { day: 7, reward: "نشان ۷ روزه", unlocked: true, icon: Flame },
    { day: 14, reward: "نشان ۱۴ روزه", unlocked: true, icon: Star },
    { day: 30, reward: "نشان ۳۰ روزه", unlocked: false, icon: Gift },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative overflow-hidden rounded-3xl p-4 bg-gradient-to-br from-[#EC4899] via-[#F59E0B] to-[#EF4444] text-white shadow-lg"
    >
      {/* Decorative */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-white/5 blur-2xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center"
            >
              <Flame className="w-5 h-5" />
            </motion.div>
            <div>
              <h3 className="font-bold text-sm">روزهای پیاپی</h3>
              <p className="text-[10px] text-white/70">{fa(currentStreak)} روز فعال</p>
            </div>
          </div>
          <div className="text-left">
            <p className="text-[10px] text-white/70">این هفته</p>
            <p className="text-xs font-bold tabular-nums">{fa(completedThisWeek)}/{fa(weeklyGoal)}</p>
          </div>
        </div>

        {/* Week days grid */}
        <div className="flex items-center justify-between gap-1.5 mb-3">
          {weekDays.map((day, idx) => {
            const isCompleted = weekProgress[idx];
            const isToday = idx === 3;
            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 + idx * 0.06, type: "spring" }}
                  className={`w-8 h-8 rounded-xl flex items-center justify-center relative ${
                    isCompleted
                      ? "bg-white text-[#EC4899]"
                      : isToday
                      ? "bg-white/20 border-2 border-white/40"
                      : "bg-white/10"
                  }`}
                >
                  {isCompleted && <Check className="w-4 h-4" />}
                  {isToday && !isCompleted && (
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-white"
                    />
                  )}
                </motion.div>
                <span className={`text-[9px] ${isToday ? "font-bold" : "text-white/60"}`}>{day}</span>
              </div>
            );
          })}
        </div>

        {/* Rewards progress */}
        <div className="pt-3 border-t border-white/10">
          <p className="text-[10px] text-white/70 mb-2">پاداش‌های روزانه</p>
          <div className="flex items-center gap-2">
            {rewards.map((reward, idx) => {
              const Icon = reward.icon;
              return (
                <div
                  key={idx}
                  className={`flex-1 flex items-center gap-1.5 p-1.5 rounded-lg ${
                    reward.unlocked ? "bg-white/15" : "bg-white/5"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      reward.unlocked ? "bg-white text-[#EC4899]" : "bg-white/10 text-white/40"
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[9px] font-bold truncate ${reward.unlocked ? "" : "text-white/60"}`}>
                      {reward.reward}
                    </p>
                    <p className="text-[8px] text-white/50 tabular-nums">{fa(reward.day)} روز</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's status */}
        {completedToday && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/15"
          >
            <Zap className="w-3 h-3" />
            <span className="text-[10px] font-bold">امروز فعال بودید! فردا هم ادامه دهید 🔥</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
