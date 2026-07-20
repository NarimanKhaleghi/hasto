"use client";

import { useAppStore } from "@/lib/hasto-store";
import { business, fa, formatToman } from "@/lib/hasto-data";
import { SectionCard, StatusBadge } from "@/components/hasto/shared/ui";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Wallet,
  Hash,
  Link2,
  Package,
  FileText,
  Landmark, ShoppingBag,
  ChevronLeft,
  CheckCircle2,
  ArrowUpLeft,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

export function B2BDashboardScreen() {
  const setB2BScreen = useAppStore((s) => s.setB2BScreen);

  const fs = business.financialSummary;

  const summaryCards = [
    {
      label: "دریافتی امروز",
      value: fs.todayReceivedText,
      icon: TrendingUp,
      color: "#16a34a",
      bg: "from-[#16a34a]/10 to-[#16a34a]/5",
    },
    {
      label: "دریافتی این هفته",
      value: fs.weekReceivedText,
      icon: Calendar,
      color: "#034ea2",
      bg: "from-[#034ea2]/10 to-[#034ea2]/5",
    },
    {
      label: "دریافتی این ماه",
      value: fs.monthReceivedText,
      icon: Wallet,
      color: "#8B5CF6",
      bg: "from-[#8B5CF6]/10 to-[#8B5CF6]/5",
    },
    {
      label: "تعداد تراکنش‌ها",
      value: fa(fs.transactionCount),
      icon: Hash,
      color: "#F59E0B",
      bg: "from-[#F59E0B]/10 to-[#F59E0B]/5",
    },
  ];

  const quickActions = [
    { label: "ساخت لینک پرداخت", icon: Link2, screen: "b2b-payment-link" as const, color: "#034ea2" },
    { label: "قراردادها", icon: FileText, screen: "b2b-contracts" as const, color: "#8B5CF6" },
    { label: "مدیریت مالی", icon: Landmark, screen: "b2b-financial" as const, color: "#F59E0B" },
  ];

  const maxAmount = Math.max(...business.weeklyChart.map((d) => d.amount));
  const chartData = business.weeklyChart.map((d) => ({
    day: d.day,
    amount: d.amount,
    pct: Math.round((d.amount / maxAmount) * 100),
  }));

  return (
    <div className="pb-4">
      {/* Welcome header */}
      <div className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-5 shadow-2xl shadow-[#034ea2]/30 wallet-gradient"
        >
          <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 -right-8 w-48 h-48 rounded-full bg-white/5" />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-white/70 text-xs">سلام 👋</p>
                <p className="text-white text-xl font-bold mt-0.5">{business.profile.owner}</p>
                <p className="text-white/80 text-sm mt-0.5">{business.profile.name}</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/15 backdrop-blur-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span className="text-white text-[11px] font-bold">تایید شده</span>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-1.5 text-white/70 text-[11px]">
                <Calendar className="w-3.5 h-3.5" />
                عضو از {business.profile.joinDate}
              </div>
              <div className="mr-auto flex items-center gap-1.5 text-white/70 text-[11px]">
                {fa(business.products.length)} محصول
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Financial Summary Cards (2x2 grid) */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        {summaryCards.map((card, i) => (
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
            <div className="flex items-baseline gap-1">
              <p className="text-lg font-bold tabular-nums">{card.value}</p>
              <span className="text-[10px] text-muted-foreground">تومان</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Weekly Chart */}
      <div className="px-4 mt-4">
        <SectionCard
          title="نمودار هفتگی دریافتی"
          icon={TrendingUp}
          action={
            <span className="text-xs text-muted-foreground">
              مجموع: {formatToman(fs.weekReceived)} تومان
            </span>
          }
        >
          <div className="h-44 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#034ea2" stopOpacity={1} />
                    <stop offset="100%" stopColor="#0456B5" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 10, fill: "currentColor" }}
                  axisLine={false}
                  tickLine={false}
                  className="text-muted-foreground"
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: "rgba(3,78,162,0.05)" }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0].payload;
                    return (
                      <div className="rounded-xl bg-card border border-border shadow-soft p-2.5">
                        <p className="text-[11px] text-muted-foreground mb-0.5">{p.day}</p>
                        <p className="font-bold text-sm tabular-nums text-[#034ea2] dark:text-[#6BA0F5]">
                          {formatToman(p.amount)} تومان
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={28}>
                  {chartData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={i === chartData.length - 1 ? "#16a34a" : "url(#barGrad)"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      {/* Quick Actions */}
      <div className="px-4 mt-4">
        <SectionCard title="دسترسی سریع" icon={Landmark}>
          <div className="grid grid-cols-4 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => setB2BScreen(action.screen)}
                className="flex flex-col items-center gap-1.5 py-1 active:scale-95 transition-transform"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: `${action.color}15` }}
                >
                  <action.icon className="w-5 h-5" style={{ color: action.color }} />
                </div>
                <span className="text-[10px] font-medium text-center leading-tight">
                  {action.label}
                </span>
              </button>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Recent Payments */}
      <div className="px-4 mt-4">
        <SectionCard
          title="آخرین پرداخت‌ها"
          icon={ArrowUpLeft}
          noPadding
          action={
            <button
              onClick={() => setB2BScreen("b2b-transactions")}
              className="text-xs font-medium text-[#034ea2] dark:text-[#6BA0F5] flex items-center gap-1"
            >
              همه
              <ChevronLeft className="w-3 h-3" />
            </button>
          }
        >
          <div className="divide-y divide-border">
            {business.recentPayments.map((p) => {
              const statusMap: Record<string, "success" | "pending" | "failed"> = {
                "موفق": "success",
                "در انتظار": "pending",
                "ناموفق": "failed",
              };
              return (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-10 h-10 rounded-xl bg-[#034ea2]/10 flex items-center justify-center shrink-0">
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{p.buyer}</p>
                      <StatusBadge status={statusMap[p.status]} label={p.status} />
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {p.product} • {p.date} • {p.time}
                    </p>
                  </div>
                  <div className="text-left shrink-0">
                    <p className="font-bold text-sm tabular-nums text-[#034ea2] dark:text-[#6BA0F5]">
                      {p.amount}
                    </p>
                    <p className="text-[10px] text-muted-foreground">تومان</p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Average transaction hint */}
      <div className="px-4 mt-4">
        <div className="rounded-2xl bg-info/5 border border-info/10 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-info" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">میانگین هر تراکنش</p>
            <p className="font-bold text-base tabular-nums">
              {fs.avgTransactionText} <span className="text-xs text-muted-foreground">تومان</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
