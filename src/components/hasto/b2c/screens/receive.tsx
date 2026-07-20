"use client";

import { useAppStore } from "@/lib/hasto-store";
import { user } from "@/lib/hasto-data";
import { SectionCard } from "@/components/hasto/shared/ui";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownLeft,
  QrCode,
  Copy,
  Check,
  Share2,
  ChevronLeft,
  CreditCard,
  Shield,
  Hash,
  Wallet,
  Smartphone,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ReceiveScreen() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);
  const [showShareSheet, setShowShareSheet] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(label);
    toast.success(`${label} کپی شد`);
    setTimeout(() => setCopied(null), 2000);
  };

  const sharePayload = `hasto:${user.phoneRaw}`;

  return (
    <div className="pb-4">
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-4 pt-6 pb-3 text-center"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#034ea2]/10 mb-3">
          <ArrowDownLeft className="w-6 h-6 text-[#034ea2] dark:text-[#6BA0F5]" />
        </div>
        <h1 className="text-2xl font-bold">دریافت پول</h1>
        <p className="text-sm text-muted-foreground mt-1">
          برای <span className="font-medium text-foreground">{user.name}</span>
        </p>
      </motion.div>

      {/* QR Glassmorphism Card */}
      <div className="px-4 mb-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="relative overflow-hidden rounded-3xl p-6 glass-strong shadow-soft"
        >
          {/* Decorative circles */}
          <div className="absolute -top-16 -left-16 w-44 h-44 rounded-full bg-[#034ea2]/5 blur-2xl" />
          <div className="absolute -bottom-20 -right-12 w-52 h-52 rounded-full bg-[#034ea2]/5 blur-2xl" />

          <div className="relative z-10 flex flex-col items-center">
            {/* QR Code */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, type: "spring", damping: 20 }}
              className="relative"
            >
              <div className="absolute inset-0 -m-2 rounded-3xl bg-gradient-to-br from-[#034ea2]/10 to-transparent blur-md" />
              <div className="relative w-60 h-60 bg-white rounded-3xl p-4 shadow-lg">
                <QRCodeSvg value={sharePayload} size={224} />
              </div>
              {/* Corner accents */}
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-tr-3xl rounded-tl-md rounded-bl-md rounded-br-md border-t-4 border-s-4 border-[#034ea2]" />
              <div className="absolute -bottom-1.5 -left-1.5 w-5 h-5 rounded-bl-3xl rounded-br-md rounded-tl-md rounded-tr-md border-b-4 border-e-4 border-[#034ea2]" />
            </motion.div>

            <p className="text-xs text-muted-foreground mt-5 text-center max-w-[240px] leading-relaxed">
              این QR را اسکن کنید تا مستقیم به کیف پول من پرداخت کنید
            </p>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#034ea2]/10 text-[#034ea2] dark:text-[#6BA0F5]">
              <Shield className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">پرداخت امن و فوری</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Account details — copyable rows */}
      <div className="px-4 mb-4">
        <SectionCard title="اطلاعات حساب" icon={CreditCard}>
          <div className="space-y-2">
            <DetailRow
              label="شماره کارت"
              value={user.wallet.cardNumber}
              onCopy={() => copyToClipboard(user.wallet.cardNumber, "شماره کارت")}
              copied={copied === "شماره کارت"}
            />
            <DetailRow
              label="شماره شبا"
              value={user.wallet.sheba}
              onCopy={() => copyToClipboard(user.wallet.sheba, "شماره شبا")}
              copied={copied === "شماره شبا"}
            />
            <DetailRow
              label="شماره حساب"
              value={user.wallet.accountNumber}
              onCopy={() => copyToClipboard(user.wallet.accountNumber, "شماره حساب")}
              copied={copied === "شماره حساب"}
            />
          </div>
        </SectionCard>
      </div>

      {/* Action buttons */}
      <div className="px-4 grid grid-cols-2 gap-3">
        <motion.button
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => setB2CScreen("receive-with-id")}
          className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white font-bold shadow-lg shadow-[#034ea2]/20 active:scale-[0.98] transition-transform"
        >
          <Hash className="w-5 h-5" />
          دریافت با شناسه
        </motion.button>
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => setShowShareSheet(true)}
          className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-card border-2 border-[#034ea2]/20 text-[#034ea2] dark:text-[#6BA0F5] dark:border-[#6BA0F5]/20 font-bold active:scale-[0.98] transition-transform"
        >
          <Share2 className="w-5 h-5" />
          اشتراک‌گذاری
        </motion.button>
      </div>

      {/* Hint */}
      <div className="px-4 mt-4">
        <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
          با اشتراک‌گذاری QR یا اطلاعات حساب، هر کس می‌تواند به سادگی به شما پول ارسال کند
        </p>
      </div>

      {/* Share bottom sheet */}
      <AnimatePresence>
        {showShareSheet && (
          <ShareSheet
            onClose={() => setShowShareSheet(false)}
            onCopy={copyToClipboard}
            copied={copied}
            qrValue={sharePayload}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== Detail Row ====================
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
    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
        <p className="font-medium text-sm tabular-nums truncate" dir="ltr">
          {value}
        </p>
      </div>
      <button
        onClick={onCopy}
        className="p-2 rounded-lg bg-card hover:bg-accent transition-colors shrink-0 mr-2"
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

// ==================== Share Sheet ====================
function ShareSheet({
  onClose,
  onCopy,
  copied,
  qrValue,
}: {
  onClose: () => void;
  onCopy: (text: string, label: string) => void;
  copied: string | null;
  qrValue: string;
}) {
  const [showQr, setShowQr] = useState(false);

  const options = [
    {
      key: "qr",
      icon: QrCode,
      label: "QR کد",
      sublabel: "نمایش کد برای اسکن",
      value: "",
      color: "#034ea2",
      action: () => setShowQr((v) => !v),
    },
    {
      key: "sheba",
      icon: Wallet,
      label: "شماره شبا",
      sublabel: "انتقال بانکی",
      value: user.wallet.sheba,
      color: "#16a34a",
      action: () => onCopy(user.wallet.sheba, "شماره شبا"),
    },
    {
      key: "card",
      icon: CreditCard,
      label: "شماره کارت",
      sublabel: "کارت بانکی",
      value: user.wallet.cardNumber,
      color: "#8b5cf6",
      action: () => onCopy(user.wallet.cardNumber, "شماره کارت"),
    },
    {
      key: "mobile",
      icon: Smartphone,
      label: "شناسه کیف پول",
      sublabel: "شماره موبایل",
      value: user.phone,
      color: "#d97706",
      action: () => onCopy(user.phoneRaw, "شناسه کیف پول"),
    },
  ];

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

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#034ea2]/10 flex items-center justify-center">
              <Share2 className="w-4.5 h-4.5 text-[#034ea2] dark:text-[#6BA0F5]" />
            </div>
            <div>
              <h2 className="font-bold text-base">اشتراک‌گذاری</h2>
              <p className="text-[11px] text-muted-foreground">روش دریافت را انتخاب کنید</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted transition-colors"
            aria-label="بستن"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {options.map((opt, idx) => {
            const isCopied =
              (opt.key === "sheba" && copied === "شماره شبا") ||
              (opt.key === "card" && copied === "شماره کارت") ||
              (opt.key === "mobile" && copied === "شناسه کیف پول");
            const isActive = opt.key === "qr" && showQr;
            return (
              <motion.button
                key={opt.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04 * idx }}
                onClick={opt.action}
                className={cn(
                  "flex flex-col items-start gap-2 p-3 rounded-2xl border-2 text-right transition-all active:scale-[0.97]",
                  isActive
                    ? "border-[#034ea2] bg-[#034ea2]/5"
                    : "border-border bg-card hover:border-[#034ea2]/30"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: `${opt.color}15` }}
                  >
                    <opt.icon className="w-4.5 h-4.5" style={{ color: opt.color }} />
                  </div>
                  {isCopied ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : opt.key === "qr" ? (
                    <ChevronLeft
                      className={cn(
                        "w-4 h-4 text-muted-foreground transition-transform",
                        showQr && "-rotate-90"
                      )}
                    />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="w-full">
                  <p className="font-bold text-sm">{opt.label}</p>
                  <p className="text-[11px] text-muted-foreground">{opt.sublabel}</p>
                  {opt.value && (
                    <p
                      className="text-[10px] text-muted-foreground mt-1 tabular-nums truncate"
                      dir="ltr"
                    >
                      {opt.value}
                    </p>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Inline QR display */}
        <AnimatePresence>
          {showQr && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col items-center p-5 rounded-2xl bg-muted/50">
                <div className="w-44 h-44 bg-white rounded-2xl p-3 shadow-sm">
                  <QRCodeSvg value={qrValue} size={160} />
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  QR را برای دریافت مستقیم به اشتراک بگذارید
                </p>
                <button
                  onClick={() => onCopy(qrValue, "QR Payload")}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-card border border-border text-xs font-medium hover:bg-accent transition-colors"
                >
                  {copied === "QR Payload" ? (
                    <Check className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  کپی مقدار QR
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick share via navigator */}
        <button
          onClick={async () => {
            const text = `پرداخت به ${user.name}\nشماره کارت: ${user.wallet.cardNumber}\nشماره شبا: ${user.wallet.sheba}`;
            if (navigator.share) {
              try {
                await navigator.share({ title: "هستو", text });
              } catch {
                /* user cancelled */
              }
            } else {
              navigator.clipboard?.writeText(text);
              toast.success("اطلاعات کپی شد");
            }
          }}
          className="w-full h-12 rounded-2xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white font-bold mt-3 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Share2 className="w-4.5 h-4.5" />
          اشتراک‌گذاری همه اطلاعات
        </button>
      </motion.div>
    </motion.div>
  );
}

// ==================== QR Code SVG (mock) ====================
// Pseudo-random QR pattern based on the value
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
