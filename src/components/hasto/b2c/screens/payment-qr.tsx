"use client";

import { useAppStore } from "@/lib/hasto-store";
import type { TransferContext } from "@/lib/hasto-store";
import { formatToman } from "@/lib/hasto-data";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  Image as ImageIcon,
  Zap,
  ZapOff,
  Store,
  Check,
  Wallet,
  ArrowLeft,
  X,
  ScanLine,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ScanResult = {
  type: "shop" | "person";
  name: string;
  subtitle?: string;
};

const MOCK_RESULT: ScanResult = {
  type: "shop",
  name: "فروشگاه لباس راما",
  subtitle: "فروشگاه پوشاک • خیابان میرزای شیرازی",
};

export function PaymentQrScreen() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);
  const setTransferContext = useAppStore((s) => s.setTransferContext);

  const [flashOn, setFlashOn] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [amount, setAmount] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-scan after 3 seconds
  useEffect(() => {
    if (!scanning) return;
    timerRef.current = setTimeout(() => {
      setResult(MOCK_RESULT);
      setScanning(false);
      toast.success("QR اسکن شد");
    }, 3000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [scanning]);

  const handleRescan = () => {
    setResult(null);
    setAmount("");
    setScanning(true);
  };

  const handleAmountChange = (v: string) => {
    const onlyDigits = v.replace(/[^\d]/g, "");
    setAmount(onlyDigits);
  };

  const amountNum = parseInt(amount || "0", 10);

  const handleConfirm = () => {
    if (amountNum <= 0) {
      toast.error("مبلغ را وارد کنید");
      return;
    }
    const ctx: TransferContext = {
      recipientName: result!.name,
      recipientNumber: "QR-" + Date.now().toString().slice(-6),
      recipientType: "qr",
      amount: amountNum,
      amountText: formatToman(amountNum),
      paymentMethod: "اسکن QR",
    };
    setTransferContext(ctx);
    setB2CScreen("transfer-pin");
  };

  const quickAmounts = [100000, 250000, 500000, 850000];

  return (
    <div className="pb-6">
      {/* Viewfinder */}
      <div className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-square w-full rounded-3xl overflow-hidden bg-slate-950 shadow-2xl shadow-black/30"
        >
          {/* Camera grid background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-900 to-black" />
            {/* Fake bokeh dots */}
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/10"
                style={{
                  width: `${8 + (i % 4) * 6}px`,
                  height: `${8 + (i % 4) * 6}px`,
                  top: `${(i * 37) % 100}%`,
                  left: `${(i * 61) % 100}%`,
                }}
              />
            ))}
          </div>

          {/* Scan frame */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[68%] aspect-square">
              {/* Corner brackets */}
              {[
                "top-0 right-0 border-t-4 border-r-4 rounded-tr-3xl",
                "top-0 left-0 border-t-4 border-l-4 rounded-tl-3xl",
                "bottom-0 right-0 border-b-4 border-r-4 rounded-br-3xl",
                "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-3xl",
              ].map((pos, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 1.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className={cn("absolute w-10 h-10 border-[#6BA0F5]", pos)}
                />
              ))}

              {/* Animated scan line */}
              {scanning && (
                <motion.div
                  initial={{ top: "0%" }}
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute left-0 right-0 h-0.5"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, #6BA0F5 30%, #6BA0F5 70%, transparent)",
                    boxShadow: "0 0 12px 2px rgba(107, 160, 245, 0.7)",
                  }}
                >
                  <div className="absolute inset-0 bg-[#6BA0F5]/30 blur-sm" />
                </motion.div>
              )}

              {/* Center QR ghost icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={
                    scanning
                      ? { opacity: [0.2, 0.5, 0.2], scale: [0.95, 1, 0.95] }
                      : { opacity: 0 }
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <QrCode className="w-16 h-16 text-white/30" />
                </motion.div>
              </div>

              {/* Found check overlay */}
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 250, damping: 18 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-20 h-20 rounded-full bg-success flex items-center justify-center shadow-2xl shadow-success/40">
                      <Check className="w-12 h-12 text-white" strokeWidth={3} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Top status pill */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2">
            <div
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md text-[11px] font-medium",
                scanning
                  ? "bg-black/40 text-white"
                  : "bg-success/90 text-white"
              )}
            >
              <ScanLine className="w-3 h-3" />
              {scanning ? "در حال اسکن..." : "اسکن کامل شد"}
            </div>
          </div>

          {/* Top right close */}
          <button
            onClick={() => setB2CScreen("payment")}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center"
            aria-label="بستن"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* Bottom controls */}
          <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                toast.success("گالری باز شد");
              }}
              className="flex flex-col items-center gap-1 px-4 py-2 rounded-2xl bg-black/40 backdrop-blur-md text-white"
              aria-label="انتخاب از گالری"
            >
              <ImageIcon className="w-5 h-5" />
              <span className="text-[10px]">گالری</span>
            </button>
            <button
              onClick={() => {
                setFlashOn((f) => !f);
                toast.success(flashOn ? "فلاش خاموش شد" : "فلاش روشن شد");
              }}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-2xl backdrop-blur-md transition-colors",
                flashOn
                  ? "bg-warning text-white"
                  : "bg-black/40 text-white"
              )}
              aria-label="فلاش"
            >
              {flashOn ? <Zap className="w-5 h-5" /> : <ZapOff className="w-5 h-5" />}
              <span className="text-[10px]">فلاش</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Helper text */}
      <div className="px-4 mt-4 text-center">
        <p className="text-xs text-muted-foreground leading-relaxed">
          کد QR را داخل قاب قرار دهید تا خودکار اسکن شود
        </p>
      </div>

      {/* Result card */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="px-4 mt-4"
          >
            {/* Merchant info card */}
            <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden mb-3">
              <div className="p-4 bg-gradient-to-l from-[#16a34a]/10 to-transparent flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#16a34a] to-[#0d5e2e] flex items-center justify-center shadow-md">
                  {result.type === "shop" ? (
                    <Store className="w-6 h-6 text-white" />
                  ) : (
                    <QrCode className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-muted-foreground">
                    {result.type === "shop" ? "فروشگاه" : "شخص"}
                  </p>
                  <p className="font-bold text-sm truncate">{result.name}</p>
                  {result.subtitle && (
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {result.subtitle}
                    </p>
                  )}
                </div>
                <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-success/15 text-success flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  معتبر
                </span>
              </div>
            </div>

            {/* Amount input */}
            <label className="text-[11px] text-muted-foreground mb-1.5 flex items-center gap-1.5">
              <Wallet className="w-3 h-3" />
              مبلغ پرداخت (تومان)
            </label>
            <div className="flex items-center gap-2 rounded-2xl border-2 border-border bg-card px-4 h-14 focus-within:border-[#034ea2] dark:focus-within:border-[#6BA0F5] transition-colors mb-2">
              <input
                type="text"
                inputMode="numeric"
                value={amount ? formatToman(amountNum) : ""}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="۰"
                dir="ltr"
                className="flex-1 bg-transparent outline-none text-lg font-bold tabular-nums text-right placeholder:text-muted-foreground/40"
                aria-label="مبلغ"
              />
              <span className="text-xs text-muted-foreground">تومان</span>
            </div>

            {/* Quick amounts */}
            <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-thin -mx-1 px-1">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  onClick={() => setAmount(String(q))}
                  className={cn(
                    "shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium tabular-nums transition-colors",
                    amountNum === q
                      ? "bg-[#16a34a] text-white"
                      : "bg-muted hover:bg-accent"
                  )}
                >
                  {formatToman(q)}
                </button>
              ))}
            </div>

            {/* Amount summary */}
            {amountNum > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-2xl bg-gradient-to-l from-[#16a34a] to-[#0d5e2e] p-4 mb-3 text-white relative overflow-hidden"
              >
                <div className="absolute -top-8 -left-8 w-28 h-28 rounded-full bg-white/10" />
                <p className="text-[11px] text-white/70 relative z-10">مبلغ قابل پرداخت</p>
                <p className="text-2xl font-bold tabular-nums relative z-10">
                  {formatToman(amountNum)}{" "}
                  <span className="text-sm font-normal">تومان</span>
                </p>
              </motion.div>
            )}

            {/* CTAs */}
            <div className="flex gap-2">
              <button
                onClick={handleRescan}
                className="px-4 h-14 rounded-2xl bg-card border border-border font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <QrCode className="w-4 h-4" />
                اسکن مجدد
              </button>
              <button
                onClick={handleConfirm}
                disabled={amountNum <= 0}
                className={cn(
                  "flex-1 h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
                  amountNum > 0
                    ? "bg-gradient-to-l from-[#16a34a] to-[#15803d] text-white shadow-lg shadow-[#16a34a]/25"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                تایید و پرداخت
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
