"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { fa, user } from "@/lib/hasto-data";
import { Gift, Users, Copy, Check, Share2, Sparkles, Trophy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ReferralProgramWidget() {
  const [copied, setCopied] = useState(false);

  // Mock referral data
  const referralCode = "HASTO-ALI1405";
  const referralLink = `hasto.to/r/${referralCode}`;
  const invitedCount = 7;
  const earnedAmount = 350000;
  const goalCount = 10;
  const rewardPerReferral = 50000;

  const handleCopy = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopied(true);
    toast.success("لینک دعوت کپی شد!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    const text = `به هستو بپیوندید! هسته پرداخت ایران. با کد دعوت من ثبت‌نام کنید: ${referralCode}\n${referralLink}`;
    if (navigator.share) {
      navigator.share({ title: "دعوت به هستو", text });
    } else {
      navigator.clipboard?.writeText(text);
      toast.success("متن دعوت کپی شد!");
    }
  };

  const progress = (invitedCount / goalCount) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="relative overflow-hidden rounded-3xl p-4 bg-gradient-to-br from-[#6366F1] via-[#8B5CF6] to-[#EC4899] text-white shadow-lg"
    >
      {/* Decorative */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-white/5 blur-2xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center"
            >
              <Gift className="w-5 h-5" />
            </motion.div>
            <div>
              <h3 className="font-bold text-sm">دعوت دوستان</h3>
              <p className="text-[10px] text-white/70">با هر دعوت ۵۰,۰۰۰ تومان هدیه</p>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/15">
            <Trophy className="w-3 h-3" />
            <span className="text-[10px] font-bold">{fa(earnedAmount.toLocaleString())} ت</span>
          </div>
        </div>

        {/* Progress to next reward */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-[10px] mb-1.5">
            <span className="text-white/70">پیشرفت تا پاداش بعدی</span>
            <span className="font-bold tabular-nums">{fa(invitedCount)}/{fa(goalCount)} دعوت</span>
          </div>
          <div className="h-2 rounded-full bg-white/20 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
              className="h-full rounded-full bg-white relative overflow-hidden"
            >
              <div className="absolute inset-0 shimmer" />
            </motion.div>
          </div>
        </div>

        {/* Referral code */}
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-sm mb-2">
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <div className="min-w-0">
              <p className="text-[9px] text-white/60">کد دعوت شما</p>
              <p className="text-xs font-bold tabular-nums truncate" dir="ltr">{referralCode}</p>
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition-colors shrink-0"
            aria-label="کپی لینک"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={handleShare}
            className="flex-1 h-9 rounded-xl bg-white text-[#6366F1] font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
          >
            <Share2 className="w-3.5 h-3.5" />
            اشتراک‌گذاری
          </button>
          <button
            onClick={() => toast.info("لیست دوستان دعوت شده")}
            className="px-3 h-9 rounded-xl bg-white/15 backdrop-blur-sm font-bold text-xs flex items-center justify-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            {fa(invitedCount)}
          </button>
        </div>

        {/* Reward info */}
        <div className="mt-2 flex items-center justify-center gap-1 text-[9px] text-white/60">
          <span>تاکنون</span>
          <span className="font-bold text-white">{fa(earnedAmount.toLocaleString())}</span>
          <span>تومان پاداش دریافت کرده‌اید</span>
        </div>
      </div>
    </motion.div>
  );
}
