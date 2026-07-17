"use client";

import { useAppStore } from "@/lib/hasto-store";
import { user, transactions, bills, installments, banks, recentTransfers, fa, parseFa } from "@/lib/hasto-data";
import { SectionCard } from "@/components/hasto/shared/ui";
import { FinancialHealthScore } from "@/components/hasto/shared/financial-health-score";
import { SpendingInsights } from "@/components/hasto/shared/spending-insights";
import { TimeGreeting } from "@/components/hasto/shared/time-greeting";
import { SpendingLimitWidget } from "@/components/hasto/shared/spending-limit-widget";
import { SavingsGoalsPreview } from "@/components/hasto/shared/savings-goals-preview";
import { AchievementsPreview } from "@/components/hasto/shared/achievements-preview";
import { motion } from "framer-motion";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  CreditCard,
  Plus,
  Zap,
  Flame,
  Droplet,
  Phone,
  Wifi,
  ChevronLeft,
  QrCode,
  Copy,
  Check,
  Shield,
  Calendar as CalendarIcon,
  RotateCw,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function DashboardScreen() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);
  const [showBalance, setShowBalance] = useState(true);
  const [showWalletDetail, setShowWalletDetail] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(label);
    toast.success(`${label} کپی شد`);
    setTimeout(() => setCopied(null), 2000);
  };

  const connectedBanks = banks.filter((b) => b.connected);

  return (
    <div className="pb-4">
      {/* Time-based greeting */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <TimeGreeting />
        <button
          onClick={() => setB2CScreen("calendar")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-medium hover:bg-accent transition-colors"
        >
          <CalendarIcon className="w-3.5 h-3.5 text-[#034ea2] dark:text-[#6BA0F5]" />
          تقویم
        </button>
      </div>

      {/* Mother Wallet Card */}
      <div className="p-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-5 shadow-2xl shadow-[#034ea2]/30 wallet-gradient"
          onClick={() => setShowWalletDetail(true)}
        >
          {/* Decorative circles */}
          <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 -right-8 w-48 h-48 rounded-full bg-white/5" />
          <div className="absolute top-4 left-4 opacity-20">
            <svg width="48" height="48" viewBox="0 0 40 40" fill="none">
              <path d="M13 10 V30 M13 20 H27 M27 10 V30" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="20" cy="20" r="2.5" fill="#6BA0F5" />
            </svg>
          </div>

          <div className="relative z-10">
            {/* Top row */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-white/70 text-xs font-medium">کیف پول مادر</p>
                <p className="text-white/90 text-sm mt-0.5">{user.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowBalance(!showBalance);
                  }}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="نمایش موجودی"
                >
                  {showBalance ? (
                    <Eye className="w-4 h-4 text-white" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-white" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowWalletDetail(true);
                  }}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label="جزئیات"
                >
                  <ChevronLeft className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            {/* Balance */}
            <div className="mb-6">
              <p className="text-white/60 text-xs mb-1">موجودی قابل پرداخت</p>
              <div className="flex items-baseline gap-2">
                {showBalance ? (
                  <h2 className="text-3xl font-bold text-white tabular-nums tracking-tight">
                    {user.wallet.balanceText}
                  </h2>
                ) : (
                  <h2 className="text-3xl font-bold text-white tracking-tight">
                    ••••••••
                  </h2>
                )}
                <span className="text-white/80 text-sm font-medium">تومان</span>
              </div>
            </div>

            {/* Card number */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-white/70" />
                <span className="text-white/80 text-sm tabular-nums tracking-wider" dir="ltr">
                  {user.wallet.cardNumberMasked}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-xs">انقضا</span>
                <span className="text-white/80 text-xs tabular-nums">{user.wallet.expiry}</span>
              </div>
            </div>

            {/* Connected banks indicator */}
            <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-white/10">
              <Shield className="w-3.5 h-3.5 text-white/60" />
              <span className="text-white/60 text-[11px]">
                {fa(connectedBanks.length)} بانک متصل با Direct Debit
              </span>
              <div className="flex -space-x-1 mr-auto rtl:space-x-reverse">
                {connectedBanks.slice(0, 4).map((b) => (
                  <div
                    key={b.id}
                    className="w-5 h-5 rounded-full border-2 border-[#034ea2] flex items-center justify-center text-[8px]"
                    style={{ background: b.color }}
                  >
                  </div>
                ))}
                {connectedBanks.length > 4 && (
                  <div className="w-5 h-5 rounded-full border-2 border-[#034ea2] bg-white/20 flex items-center justify-center text-[8px] text-white">
                    +{fa(connectedBanks.length - 4)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Two main buttons: Deposit + Receive */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-4">
        <motion.button
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setB2CScreen("transfer")}
          className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white font-bold shadow-lg shadow-[#034ea2]/20 active:scale-[0.98] transition-transform"
        >
          <ArrowUpRight className="w-5 h-5" />
          واریز
        </motion.button>
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setB2CScreen("receive")}
          className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-card border-2 border-[#034ea2]/20 text-[#034ea2] dark:text-[#6BA0F5] dark:border-[#6BA0F5]/20 font-bold active:scale-[0.98] transition-transform"
        >
          <ArrowDownLeft className="w-5 h-5" />
          دریافت
        </motion.button>
      </div>

      {/* Quick actions row */}
      <div className="px-4 mb-4 grid grid-cols-5 gap-2">
        {[
          { icon: Zap, label: "قبض", screen: "bills" as const, color: "#F59E0B" },
          { icon: QrCode, label: "پرداخت", screen: "payment" as const, color: "#034ea2" },
          { icon: CreditCard, label: "اقساط", screen: "installments" as const, color: "#8B5CF6" },
          { icon: Shield, label: "قراردادها", screen: "contracts" as const, color: "#16a34a" },
          { icon: CalendarIcon, label: "تقویم", screen: "calendar" as const, color: "#EC4899" },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setB2CScreen(item.screen)}
            className="flex flex-col items-center gap-1.5 py-2"
          >
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ background: `${item.color}15` }}
            >
              <item.icon className="w-5 h-5" style={{ color: item.color }} />
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Pending bills alert */}
      <div className="px-4 mb-4">
        <div className="rounded-2xl bg-warning/10 border border-warning/20 p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-warning" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold">قبوض پرداخت نشده</p>
            <p className="text-xs text-muted-foreground">
              {fa(bills.length)} قبض در انتظار پرداخت — مجموع {fa(bills.reduce((s, b) => s + parseFa(b.amount), 0).toLocaleString())} تومان
            </p>
          </div>
          <button
            onClick={() => setB2CScreen("bills")}
            className="px-3 py-1.5 rounded-lg bg-warning text-white text-xs font-bold shrink-0"
          >
            پرداخت
          </button>
        </div>
      </div>

      {/* Quick repeat transfer */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm flex items-center gap-1.5">
            <RotateCw className="w-3.5 h-3.5 text-[#034ea2] dark:text-[#6BA0F5]" />
            انتقال سریع
          </h3>
          <button
            onClick={() => setB2CScreen("transfer")}
            className="text-[11px] text-muted-foreground hover:text-foreground"
          >
            همه مخاطبین
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
          {/* Add new contact */}
          <button
            onClick={() => setB2CScreen("transfer")}
            className="flex flex-col items-center gap-1.5 shrink-0 w-16"
          >
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-border flex items-center justify-center hover:border-[#034ea2] dark:hover:border-[#6BA0F5] transition-colors">
              <Plus className="w-5 h-5 text-muted-foreground" />
            </div>
            <span className="text-[10px] text-muted-foreground">جدید</span>
          </button>
          {recentTransfers.slice(0, 6).map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setB2CScreen("transfer");
                toast.info(`انتقال به ${t.name}`);
              }}
              className="flex flex-col items-center gap-1.5 shrink-0 w-16 group"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#034ea2] to-[#023069] flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
                {t.name.charAt(0)}
              </div>
              <span className="text-[10px] font-medium truncate w-full text-center">{t.name.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Financial Health Score */}
      <div className="px-4 mb-4">
        <FinancialHealthScore />
      </div>

      {/* Spending Insights */}
      <div className="px-4 mb-4">
        <SpendingInsights />
      </div>

      {/* Monthly Spending Limit Widget */}
      <div className="px-4 mb-4">
        <SpendingLimitWidget />
      </div>

      {/* Savings Goals Preview */}
      <div className="px-4 mb-4">
        <SavingsGoalsPreview />
      </div>

      {/* Achievements Preview */}
      <div className="px-4 mb-4">
        <AchievementsPreview />
      </div>

      {/* Recent transactions */}
      <div className="px-4">
        <SectionCard
          title="آخرین تراکنش‌ها"
          noPadding
          action={
            <button
              onClick={() => setB2CScreen("transactions")}
              className="text-xs font-medium text-[#034ea2] dark:text-[#6BA0F5] flex items-center gap-1"
            >
              همه
              <ChevronLeft className="w-3 h-3" />
            </button>
          }
        >
          <div className="divide-y divide-border">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-base",
                    tx.type === "receive" || tx.type === "charge"
                      ? "bg-success/10 text-success"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {tx.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{tx.title}</p>
                  <p className="text-xs text-muted-foreground">{tx.date} • {tx.time}</p>
                </div>
                <div className="text-left">
                  <p
                    className={cn(
                      "font-bold text-sm tabular-nums",
                      tx.type === "receive" || tx.type === "charge"
                        ? "text-success"
                        : "text-foreground"
                    )}
                  >
                    {tx.type === "receive" || tx.type === "charge" ? "+" : "-"}
                    {tx.amountText}
                  </p>
                  <p className="text-[10px] text-muted-foreground">تومان</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Active installments preview */}
      <div className="px-4 mt-4">
        <SectionCard title="اقساط فعال" noPadding>
          <div className="divide-y divide-border">
            {installments.slice(0, 2).map((ins) => (
              <div key={ins.id} className="px-4 py-3">
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
                    style={{ background: `${ins.color}15` }}
                  >
                    {ins.logo}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{ins.platform}</p>
                    <p className="text-xs text-muted-foreground">
                      قسط بعدی: {ins.nextAmount} تومان — {ins.due}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${ins.progress}%`, background: ins.color }}
                    />
                  </div>
                  <span className="text-[11px] font-medium tabular-nums text-muted-foreground">
                    {fa(ins.progress)}٪
                  </span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Wallet Detail Sheet */}
      {showWalletDetail && (
        <WalletDetailSheet
          onClose={() => setShowWalletDetail(false)}
          onCopy={copyToClipboard}
          copied={copied}
        />
      )}
    </div>
  );
}

function WalletDetailSheet({
  onClose,
  onCopy,
  copied,
}: {
  onClose: () => void;
  onCopy: (text: string, label: string) => void;
  copied: string | null;
}) {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full max-w-[420px] bg-background rounded-t-3xl p-6 pb-8 max-h-[90vh] overflow-y-auto scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">کیف پول مادر</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted">
            <ChevronLeft className="w-5 h-5 rotate-90" />
          </button>
        </div>

        {/* Mini wallet card */}
        <div className="relative overflow-hidden rounded-2xl p-4 wallet-gradient mb-4">
          <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-white/10" />
          <div className="relative z-10">
            <p className="text-white/70 text-xs">موجودی</p>
            <p className="text-white text-2xl font-bold tabular-nums">
              {user.wallet.balanceText} <span className="text-sm font-normal">تومان</span>
            </p>
            <p className="text-white/80 text-sm mt-2 tabular-nums tracking-wider" dir="ltr">
              {user.wallet.cardNumber}
            </p>
            <p className="text-white/60 text-xs mt-1">انقضا: {user.wallet.expiry}</p>
          </div>
        </div>

        {/* Wallet details list */}
        <div className="space-y-2">
          <DetailRow
            label="شماره کارت"
            value={user.wallet.cardNumber}
            onCopy={() => onCopy(user.wallet.cardNumber, "شماره کارت")}
            copied={copied === "شماره کارت"}
          />
          <DetailRow
            label="شماره شبا"
            value={user.wallet.sheba}
            onCopy={() => onCopy(user.wallet.sheba, "شماره شبا")}
            copied={copied === "شماره شبا"}
          />
          <DetailRow
            label="شماره حساب"
            value={user.wallet.accountNumber}
            onCopy={() => onCopy(user.wallet.accountNumber, "شماره حساب")}
            copied={copied === "شماره حساب"}
          />
          <DetailRow
            label="شناسه کیف پول (موبایل)"
            value={user.phone}
            onCopy={() => onCopy(user.phoneRaw, "شناسه کیف پول")}
            copied={copied === "شناسه کیف پول"}
          />
        </div>

        {/* QR Code */}
        <div className="mt-4 flex flex-col items-center p-4 rounded-2xl bg-muted">
          <div className="w-40 h-40 bg-white rounded-2xl p-3 shadow-sm">
            <QRCodeSvg value={`hasto:${user.phoneRaw}`} size={144} />
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            این QR را اسکن کنید تا مستقیم به کیف پول من پرداخت کنید
          </p>
        </div>

        <button
          onClick={() => {
            onClose();
            setB2CScreen("receive");
          }}
          className="w-full h-12 rounded-2xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white font-bold mt-4"
        >
          دریافت پول
        </button>
      </motion.div>
    </motion.div>
  );
}

function DetailRow({
  label,
  value,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium text-sm tabular-nums truncate" dir="ltr">{value}</p>
      </div>
      <button
        onClick={onCopy}
        className="p-2 rounded-lg bg-card hover:bg-accent transition-colors shrink-0"
        aria-label={`کپی ${label}`}
      >
        {copied ? (
          <Check className="w-4 h-4 text-success" />
        ) : (
          <Copy className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
}

// Simple inline QR code (visual mock)
function QRCodeSvg({ value, size }: { value: string; size: number }) {
  // Generate a pseudo-random pattern based on the value
  const cells = 21;
  const cellSize = size / cells;
  const pattern: boolean[] = [];
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  }
  for (let i = 0; i < cells * cells; i++) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    pattern.push((hash >> 16) % 100 > 50);
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" />
      {pattern.map((on, i) => {
        if (!on) return null;
        const x = (i % cells) * cellSize;
        const y = Math.floor(i / cells) * cellSize;
        return <rect key={i} x={x} y={y} width={cellSize} height={cellSize} fill="#0f172a" />;
      })}
      {/* Corner markers */}
      {[
        [0, 0],
        [cells - 7, 0],
        [0, cells - 7],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <rect x={cx * cellSize} y={cy * cellSize} width={7 * cellSize} height={7 * cellSize} fill="#0f172a" />
          <rect x={(cx + 1) * cellSize} y={(cy + 1) * cellSize} width={5 * cellSize} height={5 * cellSize} fill="white" />
          <rect x={(cx + 2) * cellSize} y={(cy + 2) * cellSize} width={3 * cellSize} height={3 * cellSize} fill="#0f172a" />
        </g>
      ))}
    </svg>
  );
}
