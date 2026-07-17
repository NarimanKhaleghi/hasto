"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/hasto-store";
import { achievements, unlockedAchievements, fa } from "@/lib/hasto-data";
import { Trophy, ChevronLeft, Lock, Star } from "lucide-react";

export function AchievementsPreview() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);
  const recent = achievements.filter((a) => a.unlocked).slice(-4);
  const progress = Math.round((unlockedAchievements / achievements.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-3xl p-4 bg-gradient-to-br from-[#F59E0B] via-[#EF4444] to-[#EC4899] text-white shadow-lg relative overflow-hidden"
    >
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">دستاوردها</h3>
              <p className="text-[10px] text-white/70">{fa(unlockedAchievements)} از {fa(achievements.length)} باز شده</p>
            </div>
          </div>
          <button
            onClick={() => setB2CScreen("achievements")}
            className="text-[11px] font-medium text-white/90 flex items-center gap-1"
          >
            همه
            <ChevronLeft className="w-3 h-3" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-1.5 rounded-full bg-white/20 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
              className="h-full rounded-full bg-white"
            />
          </div>
          <span className="text-[10px] font-bold tabular-nums">{fa(progress)}٪</span>
        </div>

        {/* Recent achievements */}
        <div className="flex gap-2">
          {recent.map((ach, idx) => (
            <motion.div
              key={ach.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + idx * 0.08, type: "spring", damping: 12 }}
              className="flex-1 aspect-square rounded-xl bg-white/15 backdrop-blur-sm flex flex-col items-center justify-center"
            >
              <span className="text-2xl mb-1">{ach.icon}</span>
              <span className="text-[8px] font-bold text-center px-1 leading-tight line-clamp-1">
                {ach.title}
              </span>
            </motion.div>
          ))}
          {/* Locked placeholder */}
          <div className="flex-1 aspect-square rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center">
            <Lock className="w-5 h-5 text-white/40 mb-1" />
            <span className="text-[8px] text-white/50">بیشتر</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
