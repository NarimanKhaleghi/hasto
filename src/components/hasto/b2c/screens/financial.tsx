"use client";

import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Plus,
  Pencil,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  ChevronLeft,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  Receipt,
  HandCoins,
  Landmark,
  CalendarDays,
  CheckCircle2,
  AlertTriangle,
  Coins,
  Building2,
  Car,
  Bitcoin,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  user,
  transactions,
  assets,
  debts,
  receivables,
  cashFlowData,
  expenseBreakdown,
  balanceTrend,
  totalAssetsValue,
  totalDebts,
  totalReceivables,
  fa,
  formatToman,
  type Asset,
  type Debt,
  type Receivable,
} from "@/lib/hasto-data";
import { SectionCard, ProgressBar } from "@/components/hasto/shared/ui";

// ==================== Color Palette ====================
const PALETTE = ["#034ea2", "#16a34a", "#F59E0B", "#EF4444", "#8B5CF6"];

// ==================== Tabs Config ====================
type TabId = "cash" | "assets" | "debts" | "receivables";

const TABS: { id: TabId; label: string; icon: typeof Wallet }[] = [
  { id: "cash", label: "موجودی نقدی", icon: Wallet },
  { id: "assets", label: "دارایی‌ها", icon: TrendingUp },
  { id: "debts", label: "بدهی‌ها", icon: TrendingDown },
  { id: "receivables", label: "طلب‌ها", icon: HandCoins },
];

// ==================== Main Screen ====================
export function FinancialScreen() {
  const [activeTab, setActiveTab] = useState<TabId>("cash");

  return (
    <div className="pb-6">
      {/* Sticky Tab Bar */}
      <div className="sticky top-0 z-30 glass-strong border-b border-border/50">
        <div className="relative flex items-center gap-1 overflow-x-auto scrollbar-none px-2 py-2">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors",
                  active
                    ? "text-white"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-pressed={active}
              >
                {active && (
                  <motion.div
                    layoutId="fin-tab-indicator"
                    className="absolute inset-0 rounded-xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] shadow-md shadow-[#034ea2]/30"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className="relative w-4 h-4" strokeWidth={2.5} />
                <span className="relative">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {activeTab === "cash" && <CashBalanceTab />}
          {activeTab === "assets" && <AssetsTab />}
          {activeTab === "debts" && <DebtsTab />}
          {activeTab === "receivables" && <ReceivablesTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ==================== Shared Helpers ====================
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

function TypeBadge({
  type,
  label,
}: {
  type: "manual" | "contract";
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
        type === "manual"
          ? "bg-muted text-muted-foreground"
          : "bg-[#034ea2]/10 text-[#034ea2] dark:text-[#6BA0F5]"
      )}
    >
      {type === "manual" ? <HandCoins className="w-2.5 h-2.5" /> : <Landmark className="w-2.5 h-2.5" />}
      {label}
    </span>
  );
}

function SheetShell({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] bg-background rounded-t-3xl p-6 pb-8 max-h-[90vh] overflow-y-auto scrollbar-thin"
      >
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted transition-colors"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1.5 text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full h-11 px-3 rounded-xl bg-muted text-sm outline-none focus:ring-2 focus:ring-[#034ea2] transition-shadow";

// ============================================================
// ==================== TAB 1: Cash Balance ====================
// ============================================================
function CashBalanceTab() {
  const [filter, setFilter] = useState("month");

  return (
    <div className="p-4 space-y-4">
      {/* Big Balance Card (gradient) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-5 shadow-xl shadow-[#034ea2]/25 wallet-gradient"
      >
        <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -right-8 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute top-3 left-3 opacity-20">
          <Wallet className="w-10 h-10 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs">موجودی نقدی</p>
                <p className="text-white/90 text-sm font-medium">کیف پول مادر هستو</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white/15 text-white text-[11px] font-bold backdrop-blur-sm">
              قابل برداشت
            </span>
          </div>

          <p className="text-white/60 text-xs mb-1">موجودی فعلی</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-white tabular-nums tracking-tight">
              {formatToman(user.wallet.balance)}
            </h2>
            <span className="text-white/80 text-sm font-medium">تومان</span>
          </div>

          {/* Income/Expense mini-summary */}
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-400/20 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <p className="text-white/60 text-[10px]">درآمد ماه</p>
                <p className="text-white text-sm font-bold tabular-nums">
                  {formatToman(cashFlowData[cashFlowData.length - 1].income)}
                </p>
              </div>
            </div>
            <div className="w-px h-8 bg-white/15" />
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-lg bg-rose-400/20 flex items-center justify-center">
                <ArrowDownLeft className="w-4 h-4 text-rose-300" />
              </div>
              <div>
                <p className="text-white/60 text-[10px]">هزینه ماه</p>
                <p className="text-white text-sm font-bold tabular-nums">
                  {formatToman(cashFlowData[cashFlowData.length - 1].expense)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none -mx-1 px-1">
        <FilterChip label="امروز" active={filter === "today"} onClick={() => setFilter("today")} />
        <FilterChip label="این هفته" active={filter === "week"} onClick={() => setFilter("week")} />
        <FilterChip label="این ماه" active={filter === "month"} onClick={() => setFilter("month")} />
        <FilterChip label="این سال" active={filter === "year"} onClick={() => setFilter("year")} />
        <FilterChip label="سفارشی" active={filter === "custom"} onClick={() => setFilter("custom")} />
      </div>

      {/* Chart 1: Bar — monthly income vs expense */}
      <SectionCard title="درآمد و هزینه ماهانه" icon={BarChart3}>
        <div className="h-[220px] -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cashFlowData} barGap={4} barCategoryGap="22%">
              <XAxis
                dataKey="month"
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
                dataKey="income"
                name="درآمد"
                fill="#16a34a"
                radius={[6, 6, 0, 0]}
                maxBarSize={18}
              />
              <Bar
                dataKey="expense"
                name="هزینه"
                fill="#EF4444"
                radius={[6, 6, 0, 0]}
                maxBarSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-2 px-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a]" />
            <span className="text-[11px] text-muted-foreground">درآمد</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
            <span className="text-[11px] text-muted-foreground">هزینه</span>
          </div>
        </div>
      </SectionCard>

      {/* Chart 2: Donut — expense breakdown */}
      <SectionCard title="تفکیک هزینه‌ها" icon={PieChartIcon}>
        <div className="flex items-center gap-3">
          <div className="w-[140px] h-[140px] shrink-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseBreakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={42}
                  outerRadius={65}
                  paddingAngle={2}
                  stroke="none"
                >
                  {expenseBreakdown.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-[10px] text-muted-foreground">مجموع</p>
              <p className="text-sm font-bold tabular-nums">
                {formatToman(
                  expenseBreakdown.reduce((s, e) => s + e.value, 0)
                )}
              </p>
              <p className="text-[9px] text-muted-foreground">تومان</p>
            </div>
          </div>
          <div className="flex-1 space-y-1.5">
            {expenseBreakdown.map((e) => (
              <div key={e.name} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: e.color }}
                />
                <span className="text-xs flex-1">{e.name}</span>
                <span className="text-xs font-bold tabular-nums">
                  {formatToman(e.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Chart 3: Area — balance trend */}
      <SectionCard title="روند موجودی" icon={LineChartIcon}>
        <div className="h-[200px] -mx-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={balanceTrend}>
              <defs>
                <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#034ea2" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#034ea2" stopOpacity={0} />
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
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone"
                dataKey="balance"
                name="موجودی"
                stroke="#034ea2"
                strokeWidth={2.5}
                fill="url(#balanceGradient)"
                dot={{ r: 3, fill: "#034ea2", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#034ea2" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* Transaction list */}
      <SectionCard
        title="تراکنش‌های اخیر"
        icon={Receipt}
        noPadding
        action={
          <button className="text-xs font-bold text-[#034ea2] dark:text-[#6BA0F5] flex items-center gap-1">
            همه
            <ChevronLeft className="w-3 h-3" />
          </button>
        }
      >
        <div className="divide-y divide-border max-h-96 overflow-y-auto scrollbar-thin">
          {transactions.map((tx) => {
            const isIncoming = tx.type === "receive" || tx.type === "charge";
            return (
              <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-base font-bold",
                    isIncoming
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {tx.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{tx.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {tx.desc} • {tx.date} {tx.time}
                  </p>
                </div>
                <div className="text-left shrink-0">
                  <p
                    className={cn(
                      "font-bold text-sm tabular-nums",
                      isIncoming ? "text-success" : "text-foreground"
                    )}
                  >
                    {isIncoming ? "+" : "-"}
                    {tx.amountText}
                  </p>
                  <p className="text-[10px] text-muted-foreground">تومان</p>
                </div>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}

// ============================================================
// ==================== TAB 2: Non-Cash Assets =================
// ============================================================
function AssetsTab() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="p-4 space-y-4">
      {/* Total Assets Card (gradient) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-5 shadow-xl shadow-[#034ea2]/25"
        style={{
          background:
            "linear-gradient(135deg, #034ea2 0%, #4f46e5 50%, #8B5CF6 100%)",
        }}
      >
        <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -right-8 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute top-3 left-3 opacity-20">
          <TrendingUp className="w-10 h-10 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs">موجودی غیر نقدی</p>
                <p className="text-white/90 text-sm font-medium">مجموع دارایی‌ها</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white/15 text-white text-[11px] font-bold backdrop-blur-sm">
              {fa(assets.length)} دارایی
            </span>
          </div>

          <p className="text-white/60 text-xs mb-1">ارزش کل دارایی‌ها</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-white tabular-nums tracking-tight">
              {formatToman(totalAssetsValue)}
            </h2>
            <span className="text-white/80 text-sm font-medium">تومان</span>
          </div>

          {/* Quick stats row */}
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-400/20 flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <p className="text-white/60 text-[10px]">سود کل</p>
                <p className="text-white text-sm font-bold tabular-nums">
                  {formatToman(
                    assets.reduce((s, a) => s + (a.totalValue - a.buyPrice * a.quantity), 0)
                  )}
                </p>
              </div>
            </div>
            <div className="w-px h-8 bg-white/15" />
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-lg bg-amber-400/20 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-200" />
              </div>
              <div>
                <p className="text-white/60 text-[10px]">بازدهی متوسط</p>
                <p className="text-white text-sm font-bold tabular-nums">
                  {fa(
                    (
                      assets.reduce((s, a) => s + a.change, 0) / assets.length
                    ).toFixed(1)
                  )}
                  ٪
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Header with Add button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base">دارایی‌های من</h3>
          <p className="text-xs text-muted-foreground">
            {fa(assets.length)} دارایی ثبت شده
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white text-xs font-bold shadow-md shadow-[#034ea2]/25 active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          افزودن دارایی
        </button>
      </div>

      {/* Asset cards */}
      <div className="space-y-3">
        {assets.map((a, idx) => (
          <AssetCard key={a.id} asset={a} index={idx} />
        ))}
      </div>

      {/* Add Asset Sheet */}
      <AnimatePresence>
        {showAdd && <AddAssetSheet onClose={() => setShowAdd(false)} />}
      </AnimatePresence>
    </div>
  );
}

function AssetCard({ asset, index }: { asset: Asset; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.25) }}
      className="rounded-2xl bg-card border border-border shadow-soft p-4"
    >
      <div className="flex items-start gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: `${asset.color}15` }}
        >
          {asset.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{asset.name}</p>
              <span
                className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: `${asset.color}15`, color: asset.color }}
              >
                {asset.type}
              </span>
            </div>
            <div className="text-left shrink-0">
              <p className="font-bold text-base tabular-nums leading-tight">
                {formatToman(asset.totalValue)}
              </p>
              <p className="text-[10px] text-muted-foreground">تومان</p>
            </div>
          </div>

          {/* Quantity + prices grid */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-muted/60 rounded-lg p-2">
              <p className="text-[10px] text-muted-foreground">تعداد</p>
              <p className="font-bold tabular-nums text-xs">
                {asset.quantityText}{" "}
                <span className="text-[10px] text-muted-foreground">{asset.unit}</span>
              </p>
            </div>
            <div className="bg-muted/60 rounded-lg p-2">
              <p className="text-[10px] text-muted-foreground">قیمت خرید</p>
              <p className="font-bold tabular-nums text-[11px]">
                {asset.buyPriceText}
              </p>
            </div>
            <div className="bg-muted/60 rounded-lg p-2">
              <p className="text-[10px] text-muted-foreground">قیمت فعلی</p>
              <p className="font-bold tabular-nums text-[11px]">
                {asset.currentPriceText}
              </p>
            </div>
          </div>

          {/* Change progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-muted-foreground">تغییر ارزش</span>
              <span
                className={cn(
                  "text-xs font-bold tabular-nums flex items-center gap-0.5",
                  asset.change >= 0 ? "text-success" : "text-destructive"
                )}
              >
                {asset.change >= 0 ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownLeft className="w-3 h-3" />
                )}
                {fa(asset.change)}٪
              </span>
            </div>
            <ProgressBar
              value={Math.min(100, Math.abs(asset.change) * 2)}
              color={
                asset.change >= 0
                  ? "linear-gradient(90deg, #16a34a, #22c55e)"
                  : "linear-gradient(90deg, #EF4444, #f87171)"
              }
            />
          </div>

          {/* Edit / Delete buttons */}
          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={() => toast.info("ویرایش دارایی (دمو)")}
              className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-muted text-xs font-bold hover:bg-accent transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              ویرایش
            </button>
            <button
              onClick={() => toast.error("حذف دارایی (دمو)")}
              className="flex-1 flex items-center justify-center gap-1.5 h-9 rounded-xl bg-destructive/10 text-destructive text-xs font-bold hover:bg-destructive/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              حذف
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AddAssetSheet({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState("سهام");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");

  const types = ["سهام", "طلا", "ارز دیجیتال", "ملک", "خودرو"];

  const submit = () => {
    if (!name.trim() || !quantity.trim() || !buyPrice.trim() || !currentPrice.trim()) {
      toast.error("لطفاً همه فیلدها را پر کنید");
      return;
    }
    toast.success("دارایی اضافه شد");
    onClose();
  };

  return (
    <SheetShell title="افزودن دارایی جدید" onClose={onClose}>
      <div className="space-y-3">
        <Field label="نوع دارایی">
          <div className="flex gap-1.5 flex-wrap">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95",
                  type === t
                    ? "bg-[#034ea2] text-white shadow-md shadow-[#034ea2]/25"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </Field>

        <Field label="نام دارایی">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثلاً سهام بانک تجارت"
            className={inputCls}
          />
        </Field>

        <div className="grid grid-cols-2 gap-2">
          <Field label="تعداد">
            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              inputMode="numeric"
              placeholder="۱۰۰"
              className={inputCls}
            />
          </Field>
          <Field label="واحد">
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="سهم / گرم / ..."
              className={inputCls}
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Field label="قیمت خرید (تومان)">
            <input
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
              inputMode="numeric"
              placeholder="۵,۰۰۰"
              className={inputCls}
            />
          </Field>
          <Field label="قیمت فعلی (تومان)">
            <input
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
              inputMode="numeric"
              placeholder="۶,۵۰۰"
              className={inputCls}
            />
          </Field>
        </div>

        <button
          onClick={submit}
          className="w-full h-12 rounded-xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white font-bold mt-2 active:scale-[0.98] transition-transform shadow-md shadow-[#034ea2]/25"
        >
          افزودن دارایی
        </button>
      </div>
    </SheetShell>
  );
}

// ============================================================
// ==================== TAB 3: Debts ==========================
// ============================================================
function DebtsTab() {
  const [filter, setFilter] = useState<"all" | "manual" | "contract">("all");
  const [showAdd, setShowAdd] = useState(false);

  const filteredDebts = debts.filter(
    (d) => filter === "all" || d.type === filter
  );

  return (
    <div className="p-4 space-y-4">
      {/* Total Debts Card (red gradient) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-5 shadow-xl shadow-[#EF4444]/25"
        style={{
          background: "linear-gradient(135deg, #EF4444 0%, #B91C1C 60%, #7F1D1D 100%)",
        }}
      >
        <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -right-8 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute top-3 left-3 opacity-20">
          <TrendingDown className="w-10 h-10 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs">بدهی‌های شما</p>
                <p className="text-white/90 text-sm font-medium">مجموع بدهی‌ها</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white/15 text-white text-[11px] font-bold backdrop-blur-sm">
              {fa(debts.length)} بدهی فعال
            </span>
          </div>

          <p className="text-white/60 text-xs mb-1">مجموع باقیمانده</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-white tabular-nums tracking-tight">
              {formatToman(totalDebts)}
            </h2>
            <span className="text-white/80 text-sm font-medium">تومان</span>
          </div>

          {/* Progress note */}
          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/10">
            <AlertTriangle className="w-4 h-4 text-amber-200" />
            <p className="text-white/80 text-[11px]">
              {fa(
                debts.filter((d) => {
                  const parts = d.dueDate.split("/").map((p) =>
                    parseInt(p.replace(/[۰-۹]/g, (m) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(m))))
                  );
                  return parts[0] >= 1405 && parts[1] <= 9;
                }).length
              )}{" "}
              بدهی نزدیک سررسید
            </p>
          </div>
        </div>
      </motion.div>

      {/* Header + Add */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base">فهرست بدهی‌ها</h3>
          <p className="text-xs text-muted-foreground">
            {fa(filteredDebts.length)} مورد نمایش داده شده
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-l from-[#EF4444] to-[#B91C1C] text-white text-xs font-bold shadow-md shadow-[#EF4444]/25 active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          افزودن بدهی
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none -mx-1 px-1">
        <FilterChip
          label="همه"
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        <FilterChip
          label="دستی"
          active={filter === "manual"}
          onClick={() => setFilter("manual")}
        />
        <FilterChip
          label="قراردادی"
          active={filter === "contract"}
          onClick={() => setFilter("contract")}
        />
      </div>

      {/* Debt cards */}
      <div className="space-y-3">
        {filteredDebts.map((d, idx) => (
          <DebtCard key={d.id} debt={d} index={idx} />
        ))}
        {filteredDebts.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">
            بدهی‌ای یافت نشد
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAdd && <AddDebtSheet onClose={() => setShowAdd(false)} />}
      </AnimatePresence>
    </div>
  );
}

function DebtCard({ debt, index }: { debt: Debt; index: number }) {
  const isContract = debt.type === "contract";
  const statusLabel = isContract ? "قراردادی" : "دستی";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.25) }}
      className="rounded-2xl bg-card border border-border shadow-soft p-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-2xl shrink-0">
          {debt.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{debt.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                بستانکار: {debt.creditor}
              </p>
            </div>
            <TypeBadge type={debt.type} label={statusLabel} />
          </div>

          {/* Amounts */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-muted/60 rounded-lg p-2">
              <p className="text-[10px] text-muted-foreground">کل</p>
              <p className="font-bold tabular-nums text-[11px]">
                {formatToman(debt.totalAmount)}
              </p>
            </div>
            <div className="bg-success/10 rounded-lg p-2">
              <p className="text-[10px] text-success/80">پرداخت شده</p>
              <p className="font-bold tabular-nums text-[11px] text-success">
                {formatToman(debt.paidAmount)}
              </p>
            </div>
            <div className="bg-destructive/10 rounded-lg p-2">
              <p className="text-[10px] text-destructive/80">باقیمانده</p>
              <p className="font-bold tabular-nums text-[11px] text-destructive">
                {formatToman(debt.remainingAmount)}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-muted-foreground">پیشرفت پرداخت</span>
              <span className="text-xs font-bold tabular-nums">
                {fa(debt.progress)}٪
              </span>
            </div>
            <ProgressBar
              value={debt.progress}
              color="linear-gradient(90deg, #EF4444, #F59E0B)"
            />
          </div>

          {/* Due date + Pay button */}
          <div className="flex items-center justify-between gap-2 mt-3">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <CalendarDays className="w-3.5 h-3.5" />
              سررسید: {debt.dueDate}
            </div>
            <button
              onClick={() => toast.success("پرداخت قسط ثبت شد (دمو)")}
              className="flex items-center gap-1.5 px-3 h-9 rounded-xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white text-xs font-bold shadow-md shadow-[#034ea2]/20 active:scale-95 transition-transform"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              ثبت پرداخت
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AddDebtSheet({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [creditor, setCreditor] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [type, setType] = useState<"manual" | "contract">("manual");

  const submit = () => {
    if (!name.trim() || !creditor.trim() || !amount.trim() || !dueDate.trim()) {
      toast.error("لطفاً همه فیلدها را پر کنید");
      return;
    }
    toast.success("بدهی جدید ثبت شد");
    onClose();
  };

  return (
    <SheetShell title="افزودن بدهی" onClose={onClose}>
      <div className="space-y-3">
        <Field label="نوع بدهی">
          <div className="flex gap-1.5">
            <button
              onClick={() => setType("manual")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 h-11 rounded-xl text-xs font-bold transition-all",
                type === "manual"
                  ? "bg-[#034ea2] text-white shadow-md"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <HandCoins className="w-4 h-4" />
              دستی
            </button>
            <button
              onClick={() => setType("contract")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 h-11 rounded-xl text-xs font-bold transition-all",
                type === "contract"
                  ? "bg-[#034ea2] text-white shadow-md"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Landmark className="w-4 h-4" />
              قراردادی
            </button>
          </div>
        </Field>

        <Field label="عنوان بدهی">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثلاً وام دوست"
            className={inputCls}
          />
        </Field>

        <Field label="بستانکار">
          <input
            value={creditor}
            onChange={(e) => setCreditor(e.target.value)}
            placeholder="نام شخص یا نهاد"
            className={inputCls}
          />
        </Field>

        <div className="grid grid-cols-2 gap-2">
          <Field label="مبلغ (تومان)">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="numeric"
              placeholder="۵,۰۰۰,۰۰۰"
              className={inputCls}
            />
          </Field>
          <Field label="سررسید">
            <input
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="۱۴۰۵/۰۹/۰۱"
              className={inputCls}
            />
          </Field>
        </div>

        <button
          onClick={submit}
          className="w-full h-12 rounded-xl bg-gradient-to-l from-[#EF4444] to-[#B91C1C] text-white font-bold mt-2 active:scale-[0.98] transition-transform shadow-md shadow-[#EF4444]/25"
        >
          ثبت بدهی
        </button>
      </div>
    </SheetShell>
  );
}

// ============================================================
// ==================== TAB 4: Receivables ====================
// ============================================================
function ReceivablesTab() {
  const [filter, setFilter] = useState<"all" | "manual" | "contract">("all");
  const [showAdd, setShowAdd] = useState(false);

  const filteredReceivables = receivables.filter(
    (r) => filter === "all" || r.type === filter
  );

  return (
    <div className="p-4 space-y-4">
      {/* Total Receivables Card (green gradient) */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-5 shadow-xl shadow-[#16a34a]/25"
        style={{
          background:
            "linear-gradient(135deg, #16a34a 0%, #15803D 60%, #166534 100%)",
        }}
      >
        <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -right-8 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute top-3 left-3 opacity-20">
          <HandCoins className="w-10 h-10 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
                <HandCoins className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs">طلب‌های شما</p>
                <p className="text-white/90 text-sm font-medium">مجموع طلب‌ها</p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white/15 text-white text-[11px] font-bold backdrop-blur-sm">
              {fa(receivables.length)} طلب فعال
            </span>
          </div>

          <p className="text-white/60 text-xs mb-1">مجموع باقیمانده</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold text-white tabular-nums tracking-tight">
              {formatToman(totalReceivables)}
            </h2>
            <span className="text-white/80 text-sm font-medium">تومان</span>
          </div>

          {/* Mini-stats */}
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-lg bg-emerald-300/20 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-100" />
              </div>
              <div>
                <p className="text-white/60 text-[10px]">دریافت شده</p>
                <p className="text-white text-sm font-bold tabular-nums">
                  {formatToman(
                    receivables.reduce((s, r) => s + r.receivedAmount, 0)
                  )}
                </p>
              </div>
            </div>
            <div className="w-px h-8 bg-white/15" />
            <div className="flex items-center gap-2 flex-1">
              <div className="w-8 h-8 rounded-lg bg-amber-300/20 flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-amber-100" />
              </div>
              <div>
                <p className="text-white/60 text-[10px]">در انتظار</p>
                <p className="text-white text-sm font-bold tabular-nums">
                  {formatToman(totalReceivables)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Header + Add */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-base">فهرست طلب‌ها</h3>
          <p className="text-xs text-muted-foreground">
            {fa(filteredReceivables.length)} مورد نمایش داده شده
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-l from-[#16a34a] to-[#15803D] text-white text-xs font-bold shadow-md shadow-[#16a34a]/25 active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          افزودن طلب
        </button>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none -mx-1 px-1">
        <FilterChip
          label="همه"
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        <FilterChip
          label="دستی"
          active={filter === "manual"}
          onClick={() => setFilter("manual")}
        />
        <FilterChip
          label="قراردادی"
          active={filter === "contract"}
          onClick={() => setFilter("contract")}
        />
      </div>

      {/* Receivable cards */}
      <div className="space-y-3">
        {filteredReceivables.map((r, idx) => (
          <ReceivableCard key={r.id} receivable={r} index={idx} />
        ))}
        {filteredReceivables.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-8">
            طلب‌ی یافت نشد
          </div>
        )}
      </div>

      <AnimatePresence>
        {showAdd && <AddReceivableSheet onClose={() => setShowAdd(false)} />}
      </AnimatePresence>
    </div>
  );
}

function ReceivableCard({
  receivable,
  index,
}: {
  receivable: Receivable;
  index: number;
}) {
  const statusLabel = receivable.type === "contract" ? "قراردادی" : "دستی";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.25) }}
      className="rounded-2xl bg-card border border-border shadow-soft p-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center text-2xl shrink-0">
          {receivable.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{receivable.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                بدهکار: {receivable.debtor}
              </p>
            </div>
            <TypeBadge type={receivable.type} label={statusLabel} />
          </div>

          {/* Amounts */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-muted/60 rounded-lg p-2">
              <p className="text-[10px] text-muted-foreground">کل</p>
              <p className="font-bold tabular-nums text-[11px]">
                {formatToman(receivable.totalAmount)}
              </p>
            </div>
            <div className="bg-success/10 rounded-lg p-2">
              <p className="text-[10px] text-success/80">دریافت شده</p>
              <p className="font-bold tabular-nums text-[11px] text-success">
                {formatToman(receivable.receivedAmount)}
              </p>
            </div>
            <div className="bg-amber-500/10 rounded-lg p-2">
              <p className="text-[10px] text-amber-600 dark:text-amber-400">
                باقیمانده
              </p>
              <p className="font-bold tabular-nums text-[11px] text-amber-600 dark:text-amber-400">
                {formatToman(receivable.remainingAmount)}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-muted-foreground">پیشرفت دریافت</span>
              <span className="text-xs font-bold tabular-nums">
                {fa(receivable.progress)}٪
              </span>
            </div>
            <ProgressBar
              value={receivable.progress}
              color="linear-gradient(90deg, #16a34a, #22c55e)"
            />
          </div>

          {/* Due date + Receive button */}
          <div className="flex items-center justify-between gap-2 mt-3">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <CalendarDays className="w-3.5 h-3.5" />
              سررسید: {receivable.dueDate}
            </div>
            <button
              onClick={() => toast.success("دریافت طلب ثبت شد (دمو)")}
              className="flex items-center gap-1.5 px-3 h-9 rounded-xl bg-gradient-to-l from-[#16a34a] to-[#15803D] text-white text-xs font-bold shadow-md shadow-[#16a34a]/20 active:scale-95 transition-transform"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              ثبت دریافت
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function AddReceivableSheet({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [debtor, setDebtor] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [type, setType] = useState<"manual" | "contract">("manual");

  const submit = () => {
    if (!name.trim() || !debtor.trim() || !amount.trim() || !dueDate.trim()) {
      toast.error("لطفاً همه فیلدها را پر کنید");
      return;
    }
    toast.success("طلب جدید ثبت شد");
    onClose();
  };

  return (
    <SheetShell title="افزودن طلب" onClose={onClose}>
      <div className="space-y-3">
        <Field label="نوع طلب">
          <div className="flex gap-1.5">
            <button
              onClick={() => setType("manual")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 h-11 rounded-xl text-xs font-bold transition-all",
                type === "manual"
                  ? "bg-[#16a34a] text-white shadow-md"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <HandCoins className="w-4 h-4" />
              دستی
            </button>
            <button
              onClick={() => setType("contract")}
              className={cn(
                "flex-1 flex items-center justify-center gap-1.5 h-11 rounded-xl text-xs font-bold transition-all",
                type === "contract"
                  ? "bg-[#16a34a] text-white shadow-md"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Landmark className="w-4 h-4" />
              قراردادی
            </button>
          </div>
        </Field>

        <Field label="عنوان طلب">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثلاً طلب از علی رضایی"
            className={inputCls}
          />
        </Field>

        <Field label="بدهکار">
          <input
            value={debtor}
            onChange={(e) => setDebtor(e.target.value)}
            placeholder="نام شخص"
            className={inputCls}
          />
        </Field>

        <div className="grid grid-cols-2 gap-2">
          <Field label="مبلغ (تومان)">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="numeric"
              placeholder="۳,۰۰۰,۰۰۰"
              className={inputCls}
            />
          </Field>
          <Field label="سررسید">
            <input
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="۱۴۰۵/۰۸/۰۱"
              className={inputCls}
            />
          </Field>
        </div>

        <button
          onClick={submit}
          className="w-full h-12 rounded-xl bg-gradient-to-l from-[#16a34a] to-[#15803D] text-white font-bold mt-2 active:scale-[0.98] transition-transform shadow-md shadow-[#16a34a]/25"
        >
          ثبت طلب
        </button>
      </div>
    </SheetShell>
  );
}
