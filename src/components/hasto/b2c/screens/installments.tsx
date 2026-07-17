"use client";

import { useState } from "react";
import { installments, fa, type Installment } from "@/lib/hasto-data";
import { SectionCard } from "@/components/hasto/shared/ui";
import { motion } from "framer-motion";
import {
  CalendarClock,
  Plus,
  Wallet,
  CalendarDays,
  Info,
  Sparkles,
  CreditCard,
  CheckCircle2,
  TrendingDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function InstallmentsScreen() {
  const [payingId, setPayingId] = useState<string | null>(null);

  const totalRemaining = installments.reduce((s, i) => s + i.remaining, 0);
  const totalMonthly = installments.reduce((s, i) => {
    // parse nextAmount like "۴۰۰,۰۰۰" → 400000
    const v = parseInt(i.nextAmount.replace(/[^\d]/g, ""), 10) || 0;
    return s + v;
  }, 0);

  // Nearest due — pick the installment with the earliest "due" (mock: just first)
  const nearest = installments[0];

  const handlePay = (ins: Installment) => {
    setPayingId(ins.id);
    setTimeout(() => {
      setPayingId(null);
      toast.success("قسط پرداخت شد", {
        description: `${ins.platform} — ${ins.nextAmount} تومان`,
      });
    }, 900);
  };

  return (
    <div className="p-4 pb-28">
      {/* ============ Summary Card ============ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-5 shadow-2xl shadow-[#034ea2]/20 mb-4"
        style={{
          background:
            "linear-gradient(135deg, #034ea2 0%, #0456B5 50%, #023069 100%)",
        }}
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -left-8 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute top-3 left-3 opacity-15">
          <CreditCard className="w-24 h-24 text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white/70 text-xs">خلاصه اقساط</p>
              <p className="text-white font-bold text-sm">مدیریت متمرکز اقساط</p>
            </div>
          </div>

          {/* Big total */}
          <div className="mb-4">
            <p className="text-white/70 text-xs mb-1">مجموع مانده اقساط</p>
            <p className="text-white text-3xl font-bold tabular-nums">
              {fa(totalRemaining.toLocaleString("en-US"))}
              <span className="text-sm font-normal text-white/70 mr-2">تومان</span>
            </p>
          </div>

          {/* 2-cell row */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <CalendarDays className="w-3.5 h-3.5 text-white/70" />
                <span className="text-[11px] text-white/70">قسط ماهانه</span>
              </div>
              <p className="text-white font-bold text-base tabular-nums">
                {fa(totalMonthly.toLocaleString("en-US"))}
                <span className="text-[11px] font-normal text-white/60 mr-1">
                  تومان
                </span>
              </p>
            </div>
            <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 mb-1">
                <CalendarClock className="w-3.5 h-3.5 text-white/70" />
                <span className="text-[11px] text-white/70">نزدیک‌ترین سررسید</span>
              </div>
              <p className="text-white font-bold text-base">
                {nearest.due}
              </p>
              <p className="text-[10px] text-white/60 mt-0.5">
                {nearest.platform}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ============ Info banner ============ */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-start gap-2.5 p-3 mb-4 rounded-2xl bg-gradient-to-l from-[#034ea2]/8 to-[#6BA0F5]/8 border border-[#034ea2]/15"
      >
        <div className="w-7 h-7 rounded-lg bg-[#034ea2]/10 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-[#034ea2] dark:text-[#6BA0F5]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            همه اقساط شما در یکجا
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            اقساط اسنپ‌پی، دیجی‌پی، وام‌های بانکی و سایر پلتفرم‌ها را یکجا مدیریت کنید.
          </p>
        </div>
      </motion.div>

      {/* ============ Installment list ============ */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-bold text-muted-foreground">
          اقساط فعال
        </h3>
        <span className="text-xs text-muted-foreground">
          {fa(installments.length)} قسط
        </span>
      </div>

      <div className="space-y-3">
        {installments.map((ins, idx) => (
          <InstallmentCard
            key={ins.id}
            ins={ins}
            onPay={() => handlePay(ins)}
            paying={payingId === ins.id}
            index={idx}
          />
        ))}
      </div>

      {/* ============ Add installment button ============ */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={() =>
          toast.success("افزودن قسط", {
            description: "فرم افزودن قسط جدید در نسخه کامل فعال خواهد بود",
          })
        }
        className="w-full mt-4 h-12 rounded-2xl border-2 border-dashed border-border hover:border-[#034ea2] hover:bg-[#034ea2]/5 transition-colors flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground hover:text-[#034ea2]"
      >
        <Plus className="w-4 h-4" />
        افزودن قسط جدید
      </motion.button>

      {/* ============ Tip card ============ */}
      <div className="mt-4 flex items-start gap-2 p-3 rounded-2xl bg-muted/50">
        <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          پرداخت به موقع اقساط، امتیاز اعتباری شما را افزایش می‌دهد و از جریمه دیرکرد جلوگیری می‌کند.
        </p>
      </div>
    </div>
  );
}

// ============ Installment Card ============
function InstallmentCard({
  ins,
  onPay,
  paying,
  index,
}: {
  ins: Installment;
  onPay: () => void;
  paying: boolean;
  index: number;
}) {
  // Progress visualization: split into 10 segments based on progress
  const segments = 10;
  const filledSegs = Math.round((ins.progress / 100) * segments);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.08, 0.3) }}
      whileTap={{ scale: 0.99 }}
    >
      <SectionCard noPadding className="overflow-hidden">
        {/* Header strip with platform color */}
        <div
          className="h-1.5"
          style={{
            background: `linear-gradient(90deg, ${ins.color}, ${ins.color}88)`,
          }}
        />
        <div className="p-4">
          <div className="flex items-start gap-3 mb-3">
            {/* Logo */}
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={{
                backgroundColor: `${ins.color}18`,
              }}
            >
              {ins.logo}
            </div>

            {/* Title + next */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-bold text-sm truncate">{ins.platform}</h3>
                <span className="text-xs text-muted-foreground">
                  {ins.next}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <CalendarClock className="w-3 h-3 text-muted-foreground" />
                <span className="text-[11px] text-muted-foreground">
                  سررسید: {ins.due}
                </span>
                <span className="text-muted-foreground/40">•</span>
                <span className="text-[11px] text-muted-foreground">
                  مبلغ: {ins.nextAmount} ت
                </span>
              </div>
            </div>
          </div>

          {/* Progress visualization (segmented) */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] text-muted-foreground">
                پیشرفت پرداخت
              </span>
              <span
                className="text-xs font-bold tabular-nums"
                style={{ color: ins.color }}
              >
                {fa(ins.progress)}٪
              </span>
            </div>
            <div className="flex gap-1">
              {Array.from({ length: segments }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: 0.2 + i * 0.04 + index * 0.08 }}
                  className="flex-1 h-2 rounded-full origin-bottom"
                  style={{
                    backgroundColor:
                      i < filledSegs ? ins.color : "var(--muted)",
                    opacity: i < filledSegs ? 1 : 0.6,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Amounts grid */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            <AmountCell
              label="کل"
              value={`${fa(ins.totalText)}`}
              tone="default"
            />
            <AmountCell
              label="پرداخت شده"
              value={`${fa(ins.paidText)}`}
              tone="success"
              icon={CheckCircle2}
            />
            <AmountCell
              label="مانده"
              value={`${fa(ins.remainingText)}`}
              tone="warning"
              icon={TrendingDown}
            />
          </div>

          {/* Pay button */}
          <button
            onClick={onPay}
            disabled={paying}
            className={cn(
              "w-full h-11 rounded-xl text-white text-sm font-bold shadow-md active:scale-[0.98] transition-transform flex items-center justify-center gap-2 disabled:opacity-70",
              paying ? "" : "active:scale-95"
            )}
            style={{
              background: `linear-gradient(135deg, ${ins.color}, ${ins.color}cc)`,
              boxShadow: `0 8px 20px -8px ${ins.color}`,
            }}
          >
            {paying ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                در حال پرداخت...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4" />
                پرداخت قسط ({ins.nextAmount} ت)
              </>
            )}
          </button>
        </div>
      </SectionCard>
    </motion.div>
  );
}

// ============ Amount Cell ============
function AmountCell({
  label,
  value,
  tone,
  icon: Icon,
}: {
  label: string;
  value: string;
  tone: "default" | "success" | "warning";
  icon?: typeof CheckCircle2;
}) {
  const toneClasses = {
    default: "bg-muted/60 text-foreground",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  };

  return (
    <div className={cn("rounded-xl p-2.5 text-center", toneClasses[tone])}>
      <div className="flex items-center justify-center gap-1 mb-0.5">
        {Icon && <Icon className="w-3 h-3" />}
        <span className="text-[10px] opacity-80">{label}</span>
      </div>
      <p className="text-xs font-bold tabular-nums leading-tight">{value}</p>
    </div>
  );
}
