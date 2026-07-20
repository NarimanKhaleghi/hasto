"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/hasto-store";
import { bankAccounts, fa, formatToman } from "@/lib/hasto-data";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Hash,
  Clock,
  Filter,
} from "lucide-react";

type Filter = "all" | "credit" | "debit";

export function B2BAccountDetailScreen() {
  const { activeAccountId, goBackB2B } = useAppStore();
  const [filter, setFilter] = useState<Filter>("all");

  const account = bankAccounts.find((a) => a.id === activeAccountId);

  if (!account) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground text-sm">حساب یافت نشد</p>
      </div>
    );
  }

  const transactions = account.transactions.filter((t) => {
    if (filter === "credit") return t.amount > 0;
    if (filter === "debit") return t.amount < 0;
    return true;
  });

  const todayCredit = account.transactions
    .filter((t) => t.amount > 0 && t.date === "۱۸/۰۴/۱۴۰۵")
    .reduce((s, t) => s + t.amount, 0);

  const todayDebit = account.transactions
    .filter((t) => t.amount < 0 && t.date === "۱۸/۰۴/۱۴۰۵")
    .reduce((s, t) => s + Math.abs(t.amount), 0);

  const stats = [
    {
      label: "دریافتی امروز",
      value: formatToman(todayCredit),
      icon: TrendingUp,
      color: "#16a34a",
      bg: "from-[#16a34a]/10 to-[#16a34a]/5",
    },
    {
      label: "پرداختی امروز",
      value: formatToman(todayDebit),
      icon: TrendingDown,
      color: "#EF4444",
      bg: "from-[#EF4444]/10 to-[#EF4444]/5",
    },
    {
      label: "تعداد تراکنش",
      value: fa(account.transactions.length),
      icon: Hash,
      color: "#034ea2",
      bg: "from-[#034ea2]/10 to-[#034ea2]/5",
    },
    {
      label: "آخرین تراکنش",
      value: account.transactions[0]?.date ?? "—",
      icon: Clock,
      color: "#8B5CF6",
      bg: "from-[#8B5CF6]/10 to-[#8B5CF6]/5",
    },
  ];

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "همه" },
    { key: "credit", label: "ورودی" },
    { key: "debit", label: "خروجی" },
  ];

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-5 shadow-2xl shadow-[#034ea2]/30 wallet-gradient"
        >
          <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 -right-8 w-48 h-48 rounded-full bg-white/5" />

          <div className="relative z-10">
            <button
              onClick={goBackB2B}
              className="flex items-center gap-1 text-white/70 text-xs mb-3 active:scale-95 transition-transform"
            >
              <ArrowRight className="w-4 h-4" />
              بازگشت
            </button>

            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: `${account.color}40` }}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full"
                  style={{ background: account.color }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white font-bold text-base">
                    {account.bankName}
                  </p>
                  <span className="text-white/60 text-xs font-medium">
                    {account.accountNumber}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <p className="text-white text-2xl font-bold tabular-nums">
                    {fa(account.balance.toLocaleString())}
                  </p>
                  <span className="text-white/60 text-xs">تومان</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        {stats.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br border border-border shadow-soft",
              card.bg
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${card.color}20` }}
              >
                <card.icon className="w-5 h-5" style={{ color: card.color }} />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
            <p className="text-sm font-bold tabular-nums">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Transaction List */}
      <div className="px-4 mt-4">
        <div className="rounded-2xl bg-card border border-border shadow-soft">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#034ea2] dark:text-[#6BA0F5]" />
              <h3 className="font-bold text-sm">تراکنش‌ها</h3>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 px-4 pb-3">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  filter === f.key
                    ? "bg-[#034ea2] text-white shadow-md"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Transaction Rows */}
          <div className="divide-y divide-border">
            <AnimatePresence mode="popLayout">
              {transactions.map((tx, i) => {
                const isCredit = tx.amount > 0;
                return (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        isCredit
                          ? "bg-[#16a34a]/10"
                          : "bg-[#EF4444]/10"
                      )}
                    >
                      {isCredit ? (
                        <ArrowDownLeft className="w-5 h-5 text-[#16a34a]" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-[#EF4444]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                            isCredit
                              ? "bg-[#16a34a]/15 text-[#16a34a]"
                              : "bg-[#EF4444]/15 text-[#EF4444]"
                          )}
                        >
                          {isCredit ? "ورودی" : "خروجی"}
                        </span>
                        <p className="font-medium text-sm truncate">{tx.desc}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {tx.date} • {tx.time}
                      </p>
                    </div>
                    <div className="text-left shrink-0">
                      <p
                        className={cn(
                          "font-bold text-sm tabular-nums",
                          isCredit ? "text-[#16a34a]" : "text-[#EF4444]"
                        )}
                      >
                        {isCredit ? "+" : ""}
                        {formatToman(Math.abs(tx.amount))}
                      </p>
                      <p className="text-[10px] text-muted-foreground text-left">
                        تومان
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {transactions.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  تراکنشی یافت نشد
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
