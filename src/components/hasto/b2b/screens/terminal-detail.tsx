"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/hasto-store";
import { terminals, fa, formatToman } from "@/lib/hasto-data";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CreditCard,
  Globe,
  ToggleLeft,
  ToggleRight,
  AlertTriangle,
  Settings,
  TrendingUp,
  Hash,
  Percent,
  Filter,
  ChevronLeft,
  X,
  Phone,
  FileText,
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

type TimeTab = "daily" | "weekly" | "monthly";
type TxFilter = "all" | "success" | "failed";

const timeTabLabels: Record<TimeTab, string> = {
  daily: "روزانه",
  weekly: "هفتگی",
  monthly: "ماهانه",
};

const dayLabels = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];

export function B2BTerminalDetailScreen() {
  const { activeTerminalId, goBackB2B, setB2BScreen } = useAppStore();
  const [timeTab, setTimeTab] = useState<TimeTab>("daily");
  const [txFilter, setTxFilter] = useState<TxFilter>("all");
  const [showSettings, setShowSettings] = useState(false);
  const [terminalStatus, setTerminalStatus] = useState<"active" | "inactive">("active");

  const terminal = terminals.find((t) => t.id === activeTerminalId);

  if (!terminal) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground text-sm">پایانه یافت نشد</p>
      </div>
    );
  }

  const currentStatus = terminalStatus;

  const filteredTx = terminal.transactions.filter((tx) => {
    if (txFilter === "success") return tx.status === "success";
    if (txFilter === "failed") return tx.status === "failed";
    return true;
  });

  // Build chart data based on active tab
  const chartData = (() => {
    if (timeTab === "daily") {
      return terminal.weeklyData.slice(-7).map((v, i) => ({
        label: dayLabels[dayLabels.length - 7 + i] ?? `${i + 1}`,
        value: Math.round(v * 1000000),
      }));
    }
    if (timeTab === "weekly") {
      return terminal.weeklyData.map((v, i) => ({
        label: dayLabels[i] ?? `${i + 1}`,
        value: Math.round(v * 1000000),
      }));
    }
    // monthly: repeat pattern for 4 weeks
    const weeks = ["هفته ۱", "هفته ۲", "هفته ۳", "هفته ۴"];
    return weeks.map((w, i) => ({
      label: w,
      value: Math.round(
        terminal.weeklyData.slice(i * 2, i * 2 + 2).reduce((s, v) => s + v, 0) * 1000000
      ),
    }));
  })();

  const maxVal = Math.max(...chartData.map((d) => d.value), 1);

  const weekAmount = Math.round(
    terminal.weeklyData.reduce((s, v) => s + v, 0) * 1000000
  );

  const successCount = terminal.transactions.filter(
    (t) => t.status === "success"
  ).length;
  const totalCount = terminal.transactions.length || 1;
  const successRate = Math.round((successCount / totalCount) * 100);

  const stats = [
    {
      label: "تعداد امروز",
      value: fa(terminal.todayCount),
      icon: Hash,
      color: "#034ea2",
      bg: "from-[#034ea2]/10 to-[#034ea2]/5",
    },
    {
      label: "مبلغ امروز",
      value: formatToman(terminal.todayAmount),
      icon: TrendingUp,
      color: "#16a34a",
      bg: "from-[#16a34a]/10 to-[#16a34a]/5",
    },
    {
      label: "مبلغ هفتگی",
      value: formatToman(weekAmount),
      icon: TrendingUp,
      color: "#8B5CF6",
      bg: "from-[#8B5CF6]/10 to-[#8B5CF6]/5",
    },
    {
      label: "نرخ موفقیت",
      value: `${fa(successRate)}٪`,
      icon: Percent,
      color: "#F59E0B",
      bg: "from-[#F59E0B]/10 to-[#F59E0B]/5",
    },
  ];

  const txFilters: { key: TxFilter; label: string }[] = [
    { key: "all", label: "همه" },
    { key: "success", label: "موفق" },
    { key: "failed", label: "ناموفق" },
  ];

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-5 shadow-2xl wallet-gradient"
          style={{
            background: `linear-gradient(135deg, ${terminal.color}ee, ${terminal.color}99)`,
          }}
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
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                {terminal.type === "pos" ? (
                  <CreditCard className="w-6 h-6 text-white" />
                ) : (
                  <Globe className="w-6 h-6 text-white" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold",
                      terminal.type === "pos"
                        ? "bg-white/25 text-white"
                        : "bg-white/25 text-white"
                    )}
                  >
                    {terminal.type === "pos" ? "POS" : "IPG"}
                  </span>
                  <p className="text-white font-bold text-base">
                    {terminal.bankName}
                  </p>
                </div>
                <p className="text-white/80 text-xs mt-0.5">
                  {terminal.serial}
                </p>
              </div>
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  currentStatus === "active" ? "bg-emerald-300" : "bg-white/40"
                )}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Bar */}
      <div className="px-4 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-card border border-border shadow-soft p-3 flex items-center gap-3"
        >
          <button
            onClick={() =>
              setTerminalStatus((s) => (s === "active" ? "inactive" : "active"))
            }
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 active:scale-95 transition-all flex-1"
          >
            {currentStatus === "active" ? (
              <ToggleRight className="w-5 h-5 text-[#16a34a]" />
            ) : (
              <ToggleLeft className="w-5 h-5 text-muted-foreground" />
            )}
            <span className="text-xs font-medium">
              {currentStatus === "active" ? "فعال" : "غیرفعال"}
            </span>
          </button>

          <button
            onClick={() => setB2BScreen("b2b-terminal-ticket")}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#EF4444]/10 active:scale-95 transition-all flex-1"
          >
            <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
            <span className="text-xs font-medium text-[#EF4444]">
              ثبت خرابی
            </span>
          </button>

          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted/50 active:scale-95 transition-all flex-1"
          >
            <Settings className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-medium">تنظیمات</span>
          </button>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        {stats.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
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

      {/* Chart with Time Tabs */}
      <div className="px-4 mt-4">
        <div className="rounded-2xl bg-card border border-border shadow-soft">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#034ea2] dark:text-[#6BA0F5]" />
              <h3 className="font-bold text-sm">نمودار تراکنش‌ها</h3>
            </div>
          </div>

          {/* Time Tabs */}
          <div className="flex items-center gap-1.5 px-4 pb-3">
            {(["daily", "weekly", "monthly"] as TimeTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setTimeTab(tab)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  timeTab === tab
                    ? "bg-[#034ea2] text-white shadow-md"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {timeTabLabels[tab]}
              </button>
            ))}
          </div>

          {/* Bar Chart */}
          <div className="h-44 px-2 pb-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="terminalBarGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor={terminal.color}
                      stopOpacity={1}
                    />
                    <stop
                      offset="100%"
                      stopColor={terminal.color}
                      stopOpacity={0.4}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
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
                        <p className="text-[11px] text-muted-foreground mb-0.5">
                          {p.label}
                        </p>
                        <p
                          className="font-bold text-sm tabular-nums"
                          style={{ color: terminal.color }}
                        >
                          {formatToman(p.value)} تومان
                        </p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={36}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill="url(#terminalBarGrad)" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
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

          <div className="flex items-center gap-2 px-4 pb-3">
            {txFilters.map((f) => (
              <button
                key={f.key}
                onClick={() => setTxFilter(f.key)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  txFilter === f.key
                    ? "bg-[#034ea2] text-white shadow-md"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="divide-y divide-border">
            <AnimatePresence mode="popLayout">
              {filteredTx.map((tx, i) => (
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
                      tx.status === "success"
                        ? "bg-[#16a34a]/10"
                        : "bg-[#EF4444]/10"
                    )}
                  >
                    <CreditCard
                      className={cn(
                        "w-5 h-5",
                        tx.status === "success"
                          ? "text-[#16a34a]"
                          : "text-[#EF4444]"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium",
                          tx.status === "success"
                            ? "bg-[#16a34a]/15 text-[#16a34a]"
                            : "bg-[#EF4444]/15 text-[#EF4444]"
                        )}
                      >
                        {tx.status === "success" ? "موفق" : "ناموفق"}
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
                        tx.amount >= 0
                          ? "text-[#16a34a]"
                          : "text-[#EF4444]"
                      )}
                    >
                      {formatToman(Math.abs(tx.amount))}
                    </p>
                    <p className="text-[10px] text-muted-foreground text-left">
                      تومان
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredTx.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">
                  تراکنشی یافت نشد
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Sheet */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="fixed inset-0 bg-black/40 z-50"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-80 max-w-[85vw] bg-card border-l border-border z-50 shadow-2xl overflow-y-auto"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-base">تنظیمات پایانه</h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center active:scale-95"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-5">
                  {/* Nickname */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      نام مستعار
                    </label>
                    <input
                      defaultValue={terminal.serial}
                      className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#034ea2]/30"
                    />
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between py-3 border-b border-border">
                    <span className="text-sm font-medium">وضعیت پایانه</span>
                    <button
                      onClick={() =>
                        setTerminalStatus((s) =>
                          s === "active" ? "inactive" : "active"
                        )
                      }
                    >
                      {currentStatus === "active" ? (
                        <ToggleRight className="w-8 h-8 text-[#16a34a]" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  {/* Support Info */}
                  <div className="rounded-xl bg-muted/50 p-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">پشتیبانی:</span>
                      <span className="font-medium">۰۲۱-۸۴۵۶۷</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">شناسه قرارداد:</span>
                      <span className="font-medium">CTR-{terminal.id}</span>
                    </div>
                  </div>

                  {/* Contract Number */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                      شماره قرارداد
                    </label>
                    <div className="px-3 py-2.5 rounded-xl bg-muted border border-border text-sm text-muted-foreground font-medium">
                      CTR-{terminal.id}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
