"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Landmark,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Activity,
  ChevronLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Filter,
  Wallet,
  Smartphone,
  Globe,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/hasto-store";
import {
  bankAccounts,
  terminals,
  financialSummary,
  dailySalesChart,
  fa,
  formatToman,
  ipoBanks,
} from "@/lib/hasto-data";
import { SectionCard, StatusBadge } from "@/components/hasto/shared/ui";

// ==================== Types ====================
type TxFilter = "all" | "pos" | "online";

// ==================== All Transactions ====================
const allTransactions = terminals.flatMap((t) =>
  t.transactions.map((tx) => ({
    ...tx,
    terminalType: t.type,
    bankName: t.bankName,
    bankColor: t.color,
  }))
);

// ==================== Chart Tooltip ====================
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string; fill?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl bg-card border border-border shadow-lg p-2.5 text-xs max-w-[180px]">
      {label && <p className="font-bold mb-1.5 text-foreground">{label}</p>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 mb-0.5 last:mb-0">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: p.color || p.fill }}
          />
          <span className="text-muted-foreground">{p.name}:</span>
          <span className="font-bold tabular-nums ms-auto">
            {formatToman(p.value ?? 0)}
          </span>
          <span className="text-muted-foreground text-[10px]">ت</span>
        </div>
      ))}
    </div>
  );
}

// ==================== Filter Chip ====================
function FilterChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95",
        active
          ? "bg-[#034ea2] text-white shadow-md shadow-[#034ea2]/25"
          : "bg-muted text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}

// ==================== Main Screen ====================
export function B2BFinancialScreen() {
  return (
    <div className="pb-6">
      {/* Financial Summary Card */}
      <div className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-5 shadow-2xl shadow-[#034ea2]/30 wallet-gradient"
        >
          <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 -right-8 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute top-3 left-3 opacity-20">
            <Landmark className="w-10 h-10 text-white" />
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                  <Landmark className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white/70 text-xs">مدیریت مالی</p>
                  <p className="text-white/90 text-sm font-medium">خلاصه مالی کسب‌وکار</p>
                </div>
              </div>
            </div>

            {/* 4 summary stats */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/10">
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <p className="text-white/60 text-[10px] mb-1">مانده کل حساب‌ها</p>
                <p className="text-white text-sm font-bold tabular-nums">
                  {formatToman(financialSummary.totalBalance)}
                </p>
                <p className="text-white/60 text-[9px]">تومان</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <p className="text-white/60 text-[10px] mb-1">فروش امروز</p>
                <p className="text-white text-sm font-bold tabular-nums">
                  {formatToman(financialSummary.todaySales)}
                </p>
                <p className="text-white/60 text-[9px]">تومان</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <p className="text-white/60 text-[10px] mb-1">تسویه در انتظار</p>
                <p className="text-white text-sm font-bold tabular-nums">
                  {formatToman(financialSummary.pendingSettlement)}
                </p>
                <p className="text-white/60 text-[9px]">تومان</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                <p className="text-white/60 text-[10px] mb-1">نرخ موفقیت</p>
                <p className="text-white text-sm font-bold tabular-nums">
                  {fa(financialSummary.successRate)}٪
                </p>
                <p className="text-white/60 text-[9px]">تراکنش موفق</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="mt-4 px-4">
        <Tabs defaultValue="accounts" className="w-full">
          <TabsList className="w-full bg-muted/60 rounded-xl h-11 p-1">
            <TabsTrigger
              value="accounts"
              className="flex items-center gap-1.5 text-xs font-bold rounded-lg data-[state=active]:bg-[#034ea2] data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <Landmark className="w-3.5 h-3.5" />
              حساب‌ها
            </TabsTrigger>
            <TabsTrigger
              value="terminals"
              className="flex items-center gap-1.5 text-xs font-bold rounded-lg data-[state=active]:bg-[#034ea2] data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              <CreditCard className="w-3.5 h-3.5" />
              پایانه‌ها
            </TabsTrigger>
          </TabsList>

          <TabsContent value="accounts">
            <AccountsTab />
          </TabsContent>
          <TabsContent value="terminals">
            <TerminalsTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Sales Chart */}
      <div className="mt-4 px-4">
        <SalesChartSection />
      </div>

      {/* Recent Transactions */}
      <div className="mt-4 px-4">
        <RecentTransactionsSection />
      </div>
    </div>
  );
}

// ============================================================
// ==================== Accounts Tab =========================
// ============================================================
function AccountsTab() {
  const setB2BScreen = useAppStore((s) => s.setB2BScreen);
  const setActiveAccountId = useAppStore((s) => s.setActiveAccountId);

  return (
    <div className="mt-3 space-y-3">
      {bankAccounts.map((acc, idx) => (
        <motion.div
          key={acc.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: Math.min(idx * 0.05, 0.25) }}
          onClick={() => {
            setActiveAccountId(acc.id);
            setB2BScreen("b2b-account-detail");
          }}
          className="rounded-2xl bg-card border border-border shadow-soft p-4 cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="flex items-start gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: `${acc.color}15` }}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: acc.color }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-bold text-sm truncate">
                    بانک {acc.bankName}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 font-persian-nums">
                    {acc.accountNumber}
                  </p>
                </div>
                <StatusBadge
                  status={acc.status}
                  label={acc.status === "active" ? "فعال" : "غیرفعال"}
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <p className="text-[10px] text-muted-foreground">موجودی</p>
                <p className="font-bold text-sm tabular-nums">
                  {formatToman(acc.balance)}
                  <span className="text-[10px] text-muted-foreground mr-1">تومان</span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ============================================================
// ==================== Terminals Tab ========================
// ============================================================
function TerminalsTab() {
  const setB2BScreen = useAppStore((s) => s.setB2BScreen);
  const setActiveTerminalId = useAppStore((s) => s.setActiveTerminalId);

  return (
    <div className="mt-3 space-y-3">
      {terminals.map((term, idx) => {
        const isPos = term.type === "pos";
        return (
          <motion.div
            key={term.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(idx * 0.05, 0.25) }}
            onClick={() => {
              setActiveTerminalId(term.id);
              setB2BScreen("b2b-terminal-detail");
            }}
            className="rounded-2xl bg-card border border-border shadow-soft p-4 cursor-pointer active:scale-[0.98] transition-transform"
          >
            {/* Type badge */}
            <div className="flex items-center justify-between mb-3">
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold",
                  isPos
                    ? "bg-[#16a34a]/15 text-[#16a34a]"
                    : "bg-[#034ea2]/15 text-[#034ea2] dark:text-[#6BA0F5]"
                )}
              >
                {isPos ? (
                  <CreditCard className="w-3 h-3" />
                ) : (
                  <Globe className="w-3 h-3" />
                )}
                {isPos ? "POS" : "IPG"}
              </span>
              <StatusBadge
                status={term.status}
                label={term.status === "active" ? "فعال" : "غیرفعال"}
              />
            </div>

            {/* Bank info */}
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: term.color }}
              />
              <p className="font-bold text-sm">بانک {term.bankName}</p>
            </div>

            {/* Serial / name */}
            <p className="text-[11px] text-muted-foreground mb-3 font-persian-nums">
              {isPos ? `سریال: ${term.serial}` : term.terminalId}
            </p>

            {/* Today stats */}
            <div className="flex items-center gap-3 pt-3 border-t border-border">
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground">تعداد تراکنش امروز</p>
                <p className="font-bold text-sm tabular-nums">{fa(term.todayCount)}</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex-1 text-left">
                <p className="text-[10px] text-muted-foreground">مبلغ امروز</p>
                <p className="font-bold text-sm tabular-nums">
                  {formatToman(term.todayAmount)}
                </p>
              </div>
            </div>

            {/* Last transaction */}
            {term.lastTx && (
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground">
                <Clock className="w-3 h-3" />
                آخرین تراکنش: {term.lastTx}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

// ============================================================
// ==================== Sales Chart ==========================
// ============================================================
function SalesChartSection() {
  return (
    <SectionCard title="فروش روزانه" icon={TrendingUp}>
      <div className="h-[220px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dailySalesChart} barGap={4} barCategoryGap="22%">
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: "currentColor" }}
              axisLine={false}
              tickLine={false}
              className="text-muted-foreground"
            />
            <YAxis hide />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: "rgba(3,78,162,0.06)" }}
            />
            <Bar
              dataKey="pos"
              name="فروش پوز"
              fill="#034ea2"
              radius={[6, 6, 0, 0]}
              maxBarSize={18}
            />
            <Bar
              dataKey="online"
              name="فروش آنلاین"
              fill="#16a34a"
              radius={[6, 6, 0, 0]}
              maxBarSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center gap-4 mt-2 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#034ea2]" />
          <span className="text-[11px] text-muted-foreground">فروش پوز</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]" />
          <span className="text-[11px] text-muted-foreground">فروش آنلاین</span>
        </div>
      </div>
    </SectionCard>
  );
}

// ============================================================
// ==================== Recent Transactions ==================
// ============================================================
function RecentTransactionsSection() {
  const [filter, setFilter] = useState<TxFilter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return allTransactions;
    if (filter === "pos") return allTransactions.filter((tx) => tx.terminalType === "pos");
    return allTransactions.filter((tx) => tx.terminalType === "ipg");
  }, [filter]);

  return (
    <SectionCard
      title="تراکنش‌های اخیر"
      icon={Activity}
      noPadding
      action={
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <FilterChip
            label="همه"
            active={filter === "all"}
            onClick={() => setFilter("all")}
          />
          <FilterChip
            label="فروش پوز"
            active={filter === "pos"}
            onClick={() => setFilter("pos")}
          />
          <FilterChip
            label="فروش آنلاین"
            active={filter === "online"}
            onClick={() => setFilter("online")}
          />
        </div>
      }
    >
      <div className="divide-y divide-border max-h-96 overflow-y-auto scrollbar-thin">
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {filtered.map((tx) => {
              const isCredit = tx.amount > 0;
              return (
                <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                      isCredit
                        ? "bg-success/10"
                        : "bg-destructive/10"
                    )}
                  >
                    {isCredit ? (
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{tx.desc}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {tx.bankName} • {tx.date} {tx.time}
                    </p>
                  </div>
                  <div className="text-left shrink-0">
                    <p
                      className={cn(
                        "font-bold text-sm tabular-nums",
                        isCredit ? "text-success" : "text-destructive"
                      )}
                    >
                      {isCredit ? "+" : ""}
                      {formatToman(Math.abs(tx.amount))}
                    </p>
                    <p className="text-[10px] text-muted-foreground">تومان</p>
                  </div>
                  <StatusBadge
                    status={tx.status}
                    label={tx.status === "success" ? "موفق" : tx.status === "failed" ? "ناموفق" : "در انتظار"}
                  />
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center text-sm text-muted-foreground py-8">
                تراکنشی یافت نشد
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </SectionCard>
  );
}
