"use client";

import { motion } from "framer-motion";
import { AnimatedNumber } from "./animated-number";
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle2 } from "lucide-react";
import { user, totalDebts, totalReceivables, fa } from "@/lib/hasto-data";

type Level = {
  label: string;
  color: string;
  icon: typeof TrendingUp;
  description: string;
  tip: string;
};

function getScoreLevel(score: number): Level {
  if (score >= 80) {
    return {
      label: "عالی",
      color: "#16a34a",
      icon: CheckCircle2,
      description: "وضعیت مالی شما بسیار پایدار است.",
      tip: "برای رشد بیشتر، می‌توانید بخشی از موجودی را در دارایی‌های غیرنقدی سرمایه‌گذاری کنید.",
    };
  }
  if (score >= 60) {
    return {
      label: "خوب",
      color: "#034ea2",
      icon: TrendingUp,
      description: "وضعیت مالی شما مناسب است.",
      tip: "با کاهش بدهی‌های قراردادی می‌توانید امتیاز خود را به سطح عالی برسانید.",
    };
  }
  if (score >= 40) {
    return {
      label: "متوسط",
      color: "#F59E0B",
      icon: AlertCircle,
      description: "نیاز به توجه بیشتر دارد.",
      tip: "پرداخت به‌موقع اقساط و کاهش اشتراک‌های غیرضروری به بهبود امتیاز کمک می‌کند.",
    };
  }
  return {
    label: "نیاز به توجه",
    color: "#EF4444",
    icon: AlertCircle,
    description: "وضعیت مالی نیاز به بازنگری دارد.",
    tip: "ابتدا بدهی‌های با سررسید نزدیک را پرداخت کنید و بودجه ماهانه تنظیم کنید。",
  };
}

export function FinancialHealthScore() {
  const balance = user.wallet.balance;
  const debts = totalDebts;
  const receivables = totalReceivables;
  const netWorth = balance + receivables - debts;

  const balanceScore = Math.min(40, (balance / 1000000) * 4);
  const debtScore = Math.max(0, 30 - (debts / 1000000) * 2);
  const receivableScore = Math.min(20, (receivables / 1000000) * 2);
  const savingsScore = 10;
  const score = Math.round(
    Math.min(100, Math.max(0, balanceScore + debtScore + receivableScore + savingsScore))
  );

  const level = getScoreLevel(score);
  const LevelIcon = level.icon;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="relative overflow-hidden rounded-3xl p-5 bg-card border border-border shadow-soft"
    >
      <div
        className="absolute -top-12 -left-12 w-40 h-40 rounded-full opacity-10 blur-2xl"
        style={{ background: level.color }}
      />

      <div className="relative flex items-center gap-4">
        <div className="relative shrink-0">
          <svg width="120" height="120" viewBox="0 0 120 120" className="-rotate-90">
            <circle
              cx="60" cy="60" r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/30"
            />
            <motion.circle
              cx="60" cy="60" r={radius}
              fill="none"
              stroke={level.color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatedNumber
              value={score}
              duration={1400}
              className="text-3xl font-bold tabular-nums"
            />
            <span className="text-[10px] text-muted-foreground">از ۱۰۰</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <LevelIcon className="w-4 h-4" style={{ color: level.color }} />
            <h3 className="font-bold text-sm">امتیاز سلامت مالی</h3>
          </div>
          <p className="text-xs font-semibold mb-2" style={{ color: level.color }}>
            {level.label}
          </p>
          <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
            {level.description}
          </p>

          <div className="grid grid-cols-2 gap-1.5">
            <div className="flex items-center gap-1 text-[10px]">
              <TrendingUp className="w-3 h-3 text-success" />
              <span className="text-muted-foreground">دارایی خالص:</span>
              <span className="font-bold tabular-nums">
                {netWorth >= 0 ? "+" : ""}
                {fa(Math.round(netWorth / 1000000).toLocaleString())}م
              </span>
            </div>
            <div className="flex items-center gap-1 text-[10px]">
              <TrendingDown className="w-3 h-3 text-destructive" />
              <span className="text-muted-foreground">بدهی:</span>
              <span className="font-bold tabular-nums">
                {fa(Math.round(debts / 1000000).toLocaleString())}م
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <div className="flex items-start gap-2">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: `${level.color}20` }}
          >
            <LevelIcon className="w-3 h-3" style={{ color: level.color }} />
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">پیشنهاد: </span>
            {level.tip}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
