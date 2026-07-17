"use client";

import { useAppStore } from "@/lib/hasto-store";
import type { TransferContext } from "@/lib/hasto-store";
import { formatToman, fa } from "@/lib/hasto-data";
import { motion, AnimatePresence } from "framer-motion";
import {
  Nfc,
  Smartphone,
  Check,
  Store,
  Info,
  X,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MOCK_MERCHANT = "فروشگاه لباس راما";
const MOCK_AMOUNT = 850000;

export function PaymentNfcScreen() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);
  const setTransferContext = useAppStore((s) => s.setTransferContext);

  const [status, setStatus] = useState<"waiting" | "connected">("waiting");

  // Simulate NFC connection after 4 seconds
  useEffect(() => {
    if (status !== "waiting") return;
    const t = setTimeout(() => {
      setStatus("connected");
      toast.success("اتصال NFC برقرار شد");
    }, 4000);
    return () => clearTimeout(t);
  }, [status]);

  const handleConfirm = () => {
    const ctx: TransferContext = {
      recipientName: MOCK_MERCHANT,
      recipientNumber: "NFC-POS-" + Date.now().toString().slice(-6),
      recipientType: "nfc",
      amount: MOCK_AMOUNT,
      amountText: formatToman(MOCK_AMOUNT),
      paymentMethod: "پرداخت NFC",
    };
    setTransferContext(ctx);
    setB2CScreen("transfer-pin");
  };

  const handleCancel = () => {
    setB2CScreen("payment");
  };

  return (
    <div className="pb-6 min-h-[520px] flex flex-col">
      {/* NFC Animation */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="relative w-full max-w-[280px] aspect-square flex items-center justify-center">
          {/* Concentric pulsing rings */}
          {status === "waiting" &&
            [0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                initial={{ scale: 0.4, opacity: 0.5 }}
                animate={{ scale: [0.4, 1.4], opacity: [0.5, 0] }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeOut",
                }}
                className="absolute inset-0 rounded-full border-2 border-[#8B5CF6]"
              />
            ))}

          {/* Connected success rings */}
          {status === "connected" && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="absolute inset-0 rounded-full bg-success/15"
            />
          )}

          {/* Glow background */}
          <motion.div
            animate={{
              boxShadow:
                status === "waiting"
                  ? [
                      "0 0 60px 20px rgba(139, 92, 246, 0.25)",
                      "0 0 90px 30px rgba(139, 92, 246, 0.4)",
                      "0 0 60px 20px rgba(139, 92, 246, 0.25)",
                    ]
                  : "0 0 60px 20px rgba(22, 163, 74, 0.3)",
            }}
            transition={{ duration: 2, repeat: status === "waiting" ? Infinity : 0 }}
            className="absolute inset-[18%] rounded-full"
          />

          {/* Central icon */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "relative z-10 w-28 h-28 rounded-3xl flex items-center justify-center shadow-2xl",
              status === "waiting"
                ? "bg-gradient-to-br from-[#8B5CF6] to-[#4c2a92]"
                : "bg-gradient-to-br from-[#16a34a] to-[#0d5e2e]"
            )}
          >
            <AnimatePresence mode="wait">
              {status === "waiting" ? (
                <motion.div
                  key="nfc"
                  initial={{ rotate: -10, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <Nfc className="w-14 h-14 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 250, damping: 14 }}
                >
                  <Check className="w-14 h-14 text-white" strokeWidth={3} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Floating phone icon */}
          {status === "waiting" && (
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-2 right-4 w-9 h-9 rounded-xl bg-card border border-border shadow-md flex items-center justify-center"
            >
              <Smartphone className="w-5 h-5 text-[#8B5CF6]" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Status text */}
      <div className="px-6 text-center mb-4">
        <AnimatePresence mode="wait">
          {status === "waiting" ? (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              <h2 className="text-base font-bold mb-1">
                گوشی را به دستگاه POS نزدیک کنید
              </h2>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <p className="text-xs">در انتظار اتصال...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="connected"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="text-base font-bold mb-1 text-success">
                اتصال برقرار شد
              </h2>
              <p className="text-xs text-muted-foreground">
                اطلاعات دستگاه خوانده شد
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Connected result card */}
      <AnimatePresence>
        {status === "connected" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4"
          >
            <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden mb-3">
              {/* Merchant header */}
              <div className="p-4 bg-gradient-to-l from-[#8B5CF6]/10 to-transparent flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#4c2a92] flex items-center justify-center shadow-md">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-muted-foreground">پذیرنده</p>
                  <p className="font-bold text-sm truncate">{MOCK_MERCHANT}</p>
                </div>
                <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-success/15 text-success flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  POS فعال
                </span>
              </div>

              {/* Amount read from device */}
              <div className="px-4 py-3 border-t border-border flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-muted-foreground">مبلغ خوانده شده از دستگاه</p>
                  <p className="text-[10px] text-muted-foreground/70">شناسه ترمینال: {fa("۴۵۸۲۱۷")}</p>
                </div>
                <div className="text-left">
                  <p className="text-xl font-bold tabular-nums text-[#8B5CF6]">
                    {formatToman(MOCK_AMOUNT)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">تومان</p>
                </div>
              </div>
            </div>

            {/* Highlight amount banner */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl bg-gradient-to-l from-[#8B5CF6] to-[#4c2a92] p-4 mb-3 text-white relative overflow-hidden"
            >
              <div className="absolute -top-8 -left-8 w-28 h-28 rounded-full bg-white/10" />
              <p className="text-[11px] text-white/70 relative z-10">مبلغ قابل پرداخت</p>
              <p className="text-2xl font-bold tabular-nums relative z-10">
                {formatToman(MOCK_AMOUNT)}{" "}
                <span className="text-sm font-normal">تومان</span>
              </p>
            </motion.div>

            {/* CTAs */}
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="px-4 h-14 rounded-2xl bg-card border border-border font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <X className="w-4 h-4" />
                انصراف
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 h-14 rounded-2xl font-bold flex items-center justify-center gap-2 bg-gradient-to-l from-[#8B5CF6] to-[#6d28d9] text-white shadow-lg shadow-[#8B5CF6]/25 active:scale-[0.98] transition-transform"
              >
                تایید پرداخت
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel button while waiting */}
      {status === "waiting" && (
        <div className="px-4">
          <button
            onClick={handleCancel}
            className="w-full h-12 rounded-2xl bg-card border border-border font-medium text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <X className="w-4 h-4" />
            انصراف
          </button>
        </div>
      )}

      {/* Note banner */}
      <div className="px-4 mt-4">
        <div className="rounded-2xl bg-warning/8 border border-warning/20 p-3 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <p className="text-[11px] text-foreground/80 leading-relaxed">
            در نسخه نمایشی، NFC یک شبیه‌سازی است. در نسخه نهایی، اتصال از طریق
            NFC گوشی به دستگاه POS انجام می‌شود.
          </p>
        </div>
      </div>
    </div>
  );
}
