"use client";

import { motion } from "framer-motion";
import { Lightbulb, TrendingDown, TrendingUp, Calendar, Sparkles } from "lucide-react";
import { AnimatedNumber } from "./animated-number";
import { fa, parseFa, transactions, bills, installments, contracts } from "@/lib/hasto-data";

type Insight = {
  id: string;
  type: "warning" | "positive" | "info" | "tip";
  icon: typeof TrendingDown;
  title: string;
  message: string;
  action?: string;
  color: string;
};

/**
 * SpendingInsights — AI-style smart insights card showing personalized
 * financial observations and suggestions.
 */
export function SpendingInsights() {
  const insights = generateInsights();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-3xl p-5 bg-gradient-to-br from-[#034ea2] to-[#023069] text-white shadow-lg shadow-[#034ea2]/20 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-white/5 blur-2xl" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm">تحلیل هوشمند</h3>
            <p className="text-[10px] text-white/60">بر اساس تراکنش‌های شما</p>
          </div>
        </div>

        {/* Insights list */}
        <div className="space-y-2.5">
          {insights.map((insight, idx) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/10 backdrop-blur-sm"
            >
              <div className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                <insight.icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold mb-0.5">{insight.title}</p>
                <p className="text-[11px] text-white/70 leading-relaxed">{insight.message}</p>
                {insight.action && (
                  <button className="text-[10px] font-bold mt-1.5 text-white/90 underline underline-offset-2">
                    {insight.action}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function generateInsights(): Insight[] {
  const out: Insight[] = [];

  // Insight 1: Upcoming bills
  const pendingBills = bills.filter((b) => b.status === "pending");
  if (pendingBills.length > 0) {
    out.push({
      id: "bills",
      type: "warning",
      icon: Calendar,
      title: `${fa(pendingBills.length)} قبض پرداخت نشده`,
      message: `مجموع ${fa(pendingBills.reduce((s, b) => s + parseFa(b.amount), 0).toLocaleString())} تومان قبض در انتظار پرداخت.`,
      action: "پرداخت همه",
      color: "#F59E0B",
    });
  }

  // Insight 2: Installment due soon
  const nextInstallment = installments[0];
  if (nextInstallment) {
    out.push({
      id: "installment",
      type: "info",
      icon: Calendar,
      title: `قسط بعدی ${nextInstallment.platform}`,
      message: `${nextInstallment.nextAmount} تومان در ${nextInstallment.due} سررسید می‌شود.`,
      action: "جزئیات",
      color: "#034ea2",
    });
  }

  // Insight 3: Spending trend
  const expenseCount = transactions.filter((t) => t.type === "withdraw" || t.type === "bill").length;
  out.push({
    id: "trend",
    type: "positive",
    icon: TrendingDown,
    title: "کاهش ۱۲٪ هزینه‌ها",
    message: `مصرف این ماه نسبت به ماه قبل ${fa(12)}٪ کاهش داشته است. عالی!`,
    color: "#16a34a",
  });

  // Insight 4: Active subscriptions cost
  const activeSubs = contracts.filter((c) => c.type === "subscription" && c.status === "active");
  if (activeSubs.length > 0) {
    const monthlySub = activeSubs.reduce((sum, c) => sum + parseFa(c.amount), 0);
    out.push({
      id: "subs",
      type: "tip",
      icon: Lightbulb,
      title: `${fa(activeSubs.length)} اشتراک فعال`,
      message: `ماهانه ${fa(monthlySub.toLocaleString())} تومان برای اشتراک‌ها پرداخت می‌کنید.`,
      action: "مدیریت اشتراک‌ها",
      color: "#8B5CF6",
    });
  }

  return out.slice(0, 4);
}
