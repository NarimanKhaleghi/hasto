"use client";

import { useAppStore } from "@/lib/hasto-store";
import { user, fa, formatToman } from "@/lib/hasto-data";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Check,
  Share2,
  Hash,
  FileText,
  RefreshCw,
  CheckCircle2,
  Link2,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ==================== Quick amounts ====================
const QUICK_AMOUNTS: { value: number; label: string; sub?: string }[] = [
  { value: 50_000, label: "۵۰" },
  { value: 100_000, label: "۱۰۰" },
  { value: 500_000, label: "۵۰۰" },
  { value: 1_000_000, label: "۱", sub: "میلیون" },
  { value: 5_000_000, label: "۵", sub: "میلیون" },
];

// ==================== Generate payment ID ====================
function generatePaymentId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusing chars
  let id = "HST-";
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

type GeneratedPayment = {
  id: string;
  qrValue: string;
  link: string;
  amount: number;
  description: string;
};

export function ReceiveWithIdScreen() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [generated, setGenerated] = useState<GeneratedPayment | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Normalize input: Persian digits → English, strip non-digits
  const handleAmountChange = (val: string) => {
    const normalized = val
      .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
      .replace(/[^0-9]/g, "");
    // Cap to reasonable max
    if (normalized.length > 12) return;
    setAmount(normalized);
  };

  const amountNum = parseInt(amount || "0", 10) || 0;
  const formattedAmount = amount ? fa(amountNum.toLocaleString("en-US")) : "";

  const handleGenerate = () => {
    if (amountNum <= 0) {
      toast.error("مبلغ را وارد کنید");
      return;
    }
    if (amountNum < 1000) {
      toast.error("حداقل مبلغ ۱,۰۰۰ تومان است");
      return;
    }
    const id = generatePaymentId();
    const payload = JSON.stringify({
      id,
      to: user.phoneRaw,
      name: user.name,
      amount: amountNum,
      desc: description || undefined,
    });
    setGenerated({
      id,
      qrValue: payload,
      link: `hasto.to/pay/${id}`,
      amount: amountNum,
      description,
    });
    toast.success("شناسه پرداخت ایجاد شد");
  };

  const handleReset = () => {
    setGenerated(null);
    setAmount("");
    setDescription("");
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(label);
    toast.success(`${label} کپی شد`);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleShare = async () => {
    if (!generated) return;
    const text = `پرداخت به ${user.name}\nشناسه: ${generated.id}\nمبلغ: ${formatToman(
      generated.amount
    )} تومان${
      generated.description ? `\nتوضیحات: ${generated.description}` : ""
    }\nلینک: ${generated.link}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "دریافت پول هستو", text });
      } catch {
        /* cancelled */
      }
    } else {
      navigator.clipboard?.writeText(text);
      toast.success("اطلاعات کپی شد");
    }
  };

  return (
    <div className="pb-4">
      <AnimatePresence mode="wait">
        {!generated ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Title */}
            <div className="px-4 pt-6 pb-3 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#034ea2]/10 mb-3">
                <Hash className="w-6 h-6 text-[#034ea2] dark:text-[#6BA0F5]" />
              </div>
              <h1 className="text-2xl font-bold">دریافت با شناسه</h1>
              <p className="text-sm text-muted-foreground mt-1">
                یک شناسه پرداخت یکتا بسازید
              </p>
            </div>

            {/* Amount input card */}
            <div className="px-4 mb-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="relative overflow-hidden rounded-3xl p-6 glass-strong shadow-soft"
              >
                <div className="absolute -top-16 -left-16 w-44 h-44 rounded-full bg-[#034ea2]/5 blur-2xl" />
                <div className="absolute -bottom-20 -right-12 w-52 h-52 rounded-full bg-[#034ea2]/5 blur-2xl" />

                <div className="relative z-10">
                  <label className="block text-xs font-medium text-muted-foreground mb-3 text-center">
                    مبلغ درخواستی
                  </label>
                  <div className="relative flex items-center justify-center">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formattedAmount}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      placeholder="۰"
                      className="w-full bg-transparent text-center text-4xl font-bold tabular-nums outline-none placeholder:text-muted-foreground/40 text-foreground"
                      aria-label="مبلغ به تومان"
                    />
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-2">تومان</p>

                  {/* Clear button */}
                  {amount && (
                    <button
                      onClick={() => setAmount("")}
                      className="absolute top-3 left-3 p-1.5 rounded-full bg-muted hover:bg-accent transition-colors"
                      aria-label="پاک کردن مبلغ"
                    >
                      <X className="w-3.5 h-3.5 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Quick amounts */}
            <div className="px-4 mb-4">
              <div className="flex gap-2 overflow-x-auto hide-scroll pb-1">
                {QUICK_AMOUNTS.map((qa, idx) => {
                  const isActive = amountNum === qa.value;
                  return (
                    <motion.button
                      key={qa.value}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + idx * 0.03 }}
                      onClick={() => setAmount(String(qa.value))}
                      className={cn(
                        "shrink-0 flex flex-col items-center justify-center min-w-[72px] h-16 rounded-2xl border-2 px-3 transition-all active:scale-95",
                        isActive
                          ? "border-[#034ea2] bg-[#034ea2]/5 text-[#034ea2] dark:text-[#6BA0F5]"
                          : "border-border bg-card hover:border-[#034ea2]/30"
                      )}
                    >
                      <span className="font-bold text-base tabular-nums leading-none">
                        {qa.label}
                      </span>
                      {qa.sub && (
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                          {qa.sub}
                        </span>
                      )}
                      {!qa.sub && (
                        <span className="text-[10px] text-muted-foreground mt-0.5">
                          هزار
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Description input */}
            <div className="px-4 mb-4">
              <div className="relative">
                <FileText className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="توضیحات (اختیاری)"
                  maxLength={60}
                  className="w-full h-12 pr-10 pl-4 rounded-2xl bg-card border-2 border-border text-sm outline-none focus:border-[#034ea2]/40 transition-colors placeholder:text-muted-foreground/70"
                  aria-label="توضیحات"
                />
              </div>
              {description && (
                <p className="text-[10px] text-muted-foreground mt-1 text-left px-1">
                  {fa(description.length)}/{fa(60)}
                </p>
              )}
            </div>

            {/* Preview card */}
            {amountNum > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-4 mb-4"
              >
                <div className="rounded-2xl bg-muted/50 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">پیش‌نمایش</span>
                    <span className="text-[10px] text-muted-foreground">دریافت‌کننده</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-lg tabular-nums">
                        {formatToman(amountNum)}{" "}
                        <span className="text-xs font-normal text-muted-foreground">تومان</span>
                      </p>
                      {description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-medium">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground" dir="ltr">
                        {user.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Confirm button */}
            <div className="px-4">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={handleGenerate}
                disabled={amountNum <= 0}
                className={cn(
                  "w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
                  amountNum > 0
                    ? "bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white shadow-lg shadow-[#034ea2]/20"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <Check className="w-5 h-5" />
                تایید و ایجاد شناسه
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
          >
            {/* Success header */}
            <div className="px-4 pt-6 pb-3 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.1 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/15 mb-3"
              >
                <CheckCircle2 className="w-9 h-9 text-success" />
              </motion.div>
              <h1 className="text-2xl font-bold">شناسه پرداخت ایجاد شد</h1>
              <p className="text-sm text-muted-foreground mt-1">
                این شناسه را با پرداخت‌کننده به اشتراک بگذارید
              </p>
            </div>

            {/* Payment ID card */}
            <div className="px-4 mb-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                className="relative overflow-hidden rounded-3xl p-5 glass-strong shadow-soft"
              >
                <div className="absolute -top-16 -left-16 w-44 h-44 rounded-full bg-success/5 blur-2xl" />
                <div className="absolute -bottom-20 -right-12 w-52 h-52 rounded-full bg-[#034ea2]/5 blur-2xl" />

                <div className="relative z-10">
                  {/* Payment ID */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-card border-2 border-dashed border-[#034ea2]/30 mb-4">
                    <div className="min-w-0">
                      <p className="text-[11px] text-muted-foreground mb-0.5">شناسه پرداخت</p>
                      <p className="font-bold text-lg tabular-nums tracking-wider" dir="ltr">
                        {generated.id}
                      </p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(generated.id, "شناسه پرداخت")}
                      className="p-2.5 rounded-xl bg-[#034ea2]/10 hover:bg-[#034ea2]/15 transition-colors shrink-0"
                      aria-label="کپی شناسه پرداخت"
                    >
                      {copied === "شناسه پرداخت" ? (
                        <Check className="w-4.5 h-4.5 text-success" />
                      ) : (
                        <Copy className="w-4.5 h-4.5 text-[#034ea2] dark:text-[#6BA0F5]" />
                      )}
                    </button>
                  </div>

                  {/* QR */}
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-48 bg-white rounded-2xl p-3 shadow-md">
                      <QRCodeSvg value={generated.qrValue} size={176} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 text-center">
                      برای پرداخت، این QR را اسکن کنید
                    </p>
                  </div>

                  {/* Amount + Description */}
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-xl bg-card border border-border">
                      <p className="text-[11px] text-muted-foreground mb-1">مبلغ</p>
                      <p className="font-bold text-sm tabular-nums">
                        {formatToman(generated.amount)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">تومان</p>
                    </div>
                    <div className="p-3 rounded-xl bg-card border border-border">
                      <p className="text-[11px] text-muted-foreground mb-1">توضیحات</p>
                      <p className="font-medium text-sm truncate">
                        {generated.description || "—"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {generated.description ? "" : "بدون توضیحات"}
                      </p>
                    </div>
                  </div>

                  {/* Payment link */}
                  <div className="mt-3 flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <Link2 className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] text-muted-foreground">لینک پرداخت</p>
                        <p
                          className="font-medium text-xs tabular-nums truncate"
                          dir="ltr"
                        >
                          {generated.link}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(generated.link, "لینک پرداخت")}
                      className="p-2 rounded-lg bg-muted hover:bg-accent transition-colors shrink-0 mr-2"
                      aria-label="کپی لینک پرداخت"
                    >
                      {copied === "لینک پرداخت" ? (
                        <Check className="w-4 h-4 text-success" />
                      ) : (
                        <Copy className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Action buttons */}
            <div className="px-4 space-y-3">
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                onClick={handleShare}
                className="w-full h-14 rounded-2xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#034ea2]/20 active:scale-[0.98] transition-transform"
              >
                <Share2 className="w-5 h-5" />
                اشتراک‌گذاری
              </motion.button>
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={handleReset}
                className="w-full h-12 rounded-2xl bg-card border-2 border-border text-foreground font-bold flex items-center justify-center gap-2 hover:border-[#034ea2]/30 active:scale-[0.98] transition-all"
              >
                <RefreshCw className="w-4.5 h-4.5" />
                دریافت جدید
              </motion.button>
            </div>

            {/* Tip */}
            <div className="px-4 mt-4">
              <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                شناسه پرداخت تا {fa(24)} ساعت معتبر است و پس از پرداخت، مبلغ مستقیم به کیف پول شما واریز می‌شود
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== QR Code SVG (mock) ====================
function QRCodeSvg({ value, size }: { value: string; size: number }) {
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
