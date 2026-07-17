"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { Lightbulb, TrendingUp, PiggyBank, Shield, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Tip = {
  id: string;
  category: "savings" | "security" | "spending" | "investment";
  icon: typeof Lightbulb;
  title: string;
  description: string;
  color: string;
  gradient: string;
};

const allTips: Tip[] = [
  {
    id: "tip-1",
    category: "savings",
    icon: PiggyBank,
    title: "قانون ۵۰/۳۰/۲۰",
    description: "۵۰٪ درآمد برای نیازها، ۳۰٪ برای خواسته‌ها و ۲۰٪ برای پس‌انداز. این قانون ساده به شما کمک می‌کند تعادل مالی خود را حفظ کنید.",
    color: "#16a34a",
    gradient: "from-[#16a34a] to-[#065f46]",
  },
  {
    id: "tip-2",
    category: "security",
    icon: Shield,
    title: "احراز هویت دو مرحله‌ای",
    description: "برای امنیت بیشتر حساب خود، احراز هویت دو مرحله‌ای را فعال کنید. این کار از دسترسی غیرمجاز به حساب شما جلوگیری می‌کند.",
    color: "#034ea2",
    gradient: "from-[#034ea2] to-[#023069]",
  },
  {
    id: "tip-3",
    category: "spending",
    icon: TrendingUp,
    title: "بودجه‌بندی هفتگی",
    description: "به‌جای بودجه‌بندی ماهانه، هفتگی بودجه‌بندی کنید. این روش کنترل دقیق‌تری روی هزینه‌های شما فراهم می‌کند و از هدررفت پول جلوگیری می‌کند.",
    color: "#F59E0B",
    gradient: "from-[#F59E0B] to-[#D97706]",
  },
  {
    id: "tip-4",
    category: "investment",
    icon: Sparkles,
    title: "تنوع‌بخشی دارایی",
    description: "همه تخم‌مرغ‌ها را در یک سبد نگذارید. ترکیبی از سهام، طلا، ارز و سپرده بانکی ریسک سرمایه‌گذاری شما را کاهش می‌دهد.",
    color: "#8B5CF6",
    gradient: "from-[#8B5CF6] to-[#6D28D9]",
  },
  {
    id: "tip-5",
    category: "savings",
    icon: PiggyBank,
    title: "پس‌انداز خودکار",
    description: "مبلغی را به‌طور خودکار هر ماه به پس‌انداز منتقل کنید. وقتی پول قبل از هزینه‌کرد پس‌انداز شود، احتمال موفقیت بالاتر است.",
    color: "#0EA5E9",
    gradient: "from-[#0EA5E9] to-[#0284C7]",
  },
  {
    id: "tip-6",
    category: "spending",
    icon: TrendingUp,
    title: "قانون ۲۴ ساعته",
    description: "قبل از خریدهای بزرگ، ۲۴ ساعت صبر کنید. این قانون به شما کمک می‌کند از خریدهای هیجانی و غیرضروری جلوگیری کنید.",
    color: "#EC4899",
    gradient: "from-[#EC4899] to-[#BE185D]",
  },
];

export function FinancialTipsCard() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  // Pick a random tip on mount (stable per session via useMemo)
  const tip = useMemo(() => {
    const idx = Math.floor(Date.now() / 60000) % allTips.length; // changes every minute
    return allTips[idx];
  }, []);

  if (dismissed) return null;

  const Icon = tip.icon;

  const handleNext = () => {
    setCurrentIdx((prev) => (prev + 1) % allTips.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "relative overflow-hidden rounded-3xl p-5 text-white shadow-lg bg-gradient-to-br",
        tip.gradient
      )}
    >
      {/* Decorative elements */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-white/5 blur-2xl" />

      {/* Dismiss button */}
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 left-3 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
        aria-label="بستن"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <Lightbulb className="w-3 h-3" />
              <p className="text-[10px] font-bold text-white/70">نکته مالی روز</p>
            </div>
            <h3 className="font-bold text-sm">{tip.title}</h3>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-white/90 leading-relaxed mb-4">
          {tip.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleNext}
            className="flex-1 h-9 rounded-xl bg-white/15 backdrop-blur-sm hover:bg-white/25 transition-colors text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            نکته بعدی
          </button>
          <div className="flex items-center gap-1">
            {allTips.map((_, idx) => (
              <div
                key={idx}
                className={cn(
                  "w-1 h-1 rounded-full transition-all",
                  idx === currentIdx % allTips.length ? "w-3 bg-white" : "bg-white/30"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
