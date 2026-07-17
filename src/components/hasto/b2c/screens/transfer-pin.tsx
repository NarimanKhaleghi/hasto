"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/hasto-store";
import { fa, formatToman } from "@/lib/hasto-data";
import { ShieldCheck, Fingerprint, ArrowRight, Lock, Delete } from "lucide-react";
import { cn } from "@/lib/utils";

const PIN_LENGTH = 6;

export function TransferPinScreen() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);
  const goBack = useAppStore((s) => s.goBack);
  const { transferContext, setTransferContext } = useAppStore();

  const [pins, setPins] = useState<string[]>(Array(PIN_LENGTH).fill(""));
  const [error, setError] = useState(false);
  // `filled` is derived from pins to avoid synchronous setState inside effect.
  const filled = pins.every((p) => p !== "");
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Recipient summary
  const ctx = transferContext;
  const amountText = useMemo(() => {
    if (ctx?.amountText) return ctx.amountText;
    if (ctx?.amount) return formatToman(ctx.amount);
    return "";
  }, [ctx]);

  // Focus first box on mount
  useEffect(() => {
    const t = setTimeout(() => inputsRef.current[0]?.focus(), 250);
    return () => clearTimeout(t);
  }, []);

  const handleChange = (idx: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    setError(false);
    setPins((prev) => {
      const next = [...prev];
      next[idx] = digit;
      return next;
    });
    if (digit && idx < PIN_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (pins[idx]) {
        setPins((prev) => {
          const next = [...prev];
          next[idx] = "";
          return next;
        });
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
        setPins((prev) => {
          const next = [...prev];
          next[idx - 1] = "";
          return next;
        });
      }
    } else if (e.key === "ArrowLeft" && idx < PIN_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    } else if (e.key === "ArrowRight" && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, PIN_LENGTH);
    if (!text) return;
    const next = Array(PIN_LENGTH).fill("");
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setPins(next);
    const focusIdx = Math.min(text.length, PIN_LENGTH - 1);
    inputsRef.current[focusIdx]?.focus();
  };

  // When all filled, schedule navigation (async timer only — no synchronous setState).
  useEffect(() => {
    if (!filled) return;
    const t = setTimeout(() => {
      if (ctx) {
        setTransferContext({ ...ctx });
      }
      setB2CScreen("transfer-receipt");
    }, 700);
    return () => clearTimeout(t);
  }, [filled, ctx, setTransferContext, setB2CScreen]);

  const triggerBiometric = () => {
    // Mock biometric — auto-fill 123456
    const code = "123456";
    const next = code.split("");
    setPins(next);
    inputsRef.current[PIN_LENGTH - 1]?.focus();
  };

  const shake = error;

  return (
    <div className="relative min-h-full flex flex-col bg-gradient-to-b from-background via-background to-[#034ea2]/5 dark:to-[#6BA0F5]/5 overflow-hidden">
      {/* Decorative security blobs */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-[#034ea2]/8 blur-3xl" />
      <div className="absolute top-1/3 -left-20 w-48 h-48 rounded-full bg-emerald-500/8 blur-3xl" />

      {/* Top bar: back */}
      <div className="relative z-10 flex items-center justify-between px-4 h-14">
        <button
          onClick={goBack}
          aria-label="بازگشت"
          className="p-2 -mr-2 rounded-full hover:bg-accent transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Lock className="w-3.5 h-3.5" />
          ارتباط امن
        </div>
        <div className="w-9" />
      </div>

      {/* Shield hero */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-4">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", damping: 14, stiffness: 200, delay: 0.1 }}
          className="relative"
        >
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-3xl bg-[#034ea2]/20 blur-xl scale-110" />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#034ea2] to-[#023069] flex items-center justify-center shadow-2xl shadow-[#034ea2]/30">
            <ShieldCheck className="w-10 h-10 text-white" strokeWidth={2.2} />
          </div>
          {/* Animated pulse ring */}
          <motion.div
            animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 rounded-3xl border-2 border-[#034ea2]/40"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-bold text-lg mt-5"
        >
          رمز یک‌بار مصرف را وارد کنید
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="text-xs text-muted-foreground text-center mt-1 leading-relaxed max-w-[280px]"
        >
          برای تایید انتقال، کد ۶ رقمی امنیتی را وارد نمایید
        </motion.p>

        {/* Recipient mini summary */}
        {ctx && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34 }}
            className="mt-4 w-full max-w-[320px] rounded-2xl bg-card/80 backdrop-blur border border-border p-3 flex items-center justify-between"
          >
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground">گیرنده</p>
              <p className="font-bold text-sm truncate">{ctx.recipientName}</p>
            </div>
            <div className="text-left shrink-0">
              <p className="text-[10px] text-muted-foreground">مبلغ</p>
              <p className="font-bold text-sm tabular-nums">
                {amountText} <span className="text-[10px] text-muted-foreground font-normal">تومان</span>
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* PIN boxes */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-6">
        <motion.div
          animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2.5"
          dir="ltr"
        >
          {pins.map((p, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              value={p}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              aria-label={`رقم ${fa(i + 1)}`}
              className={cn(
                "w-12 h-14 sm:w-14 sm:h-16 rounded-2xl text-center text-2xl font-bold tabular-nums outline-none transition-all border-2",
                filled
                  ? "border-success bg-success/10 text-success shadow-[0_0_20px_-4px] shadow-success/30"
                  : p
                  ? "border-[#034ea2] bg-[#034ea2]/8 text-[#034ea2] dark:text-[#6BA0F5] dark:border-[#6BA0F5] dark:bg-[#6BA0F5]/8"
                  : "border-border bg-card text-foreground focus:border-[#034ea2] dark:focus:border-[#6BA0F5]"
              )}
            />
          ))}
        </motion.div>

        {/* Status line */}
        <div className="h-6 mt-4 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {filled ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-success text-xs font-medium"
              >
                <ShieldCheck className="w-4 h-4" />
                تایید شد — در حال انتقال...
              </motion.div>
            ) : error ? (
              <motion.div
                key="err"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1.5 text-destructive text-xs font-medium"
              >
                <Delete className="w-4 h-4" />
                کد نامعتبر است — دوباره وارد کنید
              </motion.div>
            ) : (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-[11px] text-muted-foreground"
              >
                {fa(pins.filter((p) => p).length)} از {fa(PIN_LENGTH)} رقم وارد شد
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Biometric */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          onClick={triggerBiometric}
          className="mt-6 flex flex-col items-center gap-2 group"
          aria-label="ورود با بیومتریک"
        >
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/30 active:scale-95 transition-transform">
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full border-2 border-emerald-400/50"
            />
            <Fingerprint className="w-8 h-8 text-white" strokeWidth={1.8} />
          </div>
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
            بیومتریک
          </span>
        </motion.button>

        <p className="text-[10px] text-muted-foreground text-center mt-4 max-w-[260px] leading-relaxed">
          (حالت نمایشی) هر ۶ رقم دلخواه یا دکمه بیومتریک پذیرفته می‌شود
        </p>
      </div>

      {/* Bottom fade */}
      <div className="relative z-10 h-6 bg-gradient-to-t from-background/0 to-transparent" />
    </div>
  );
}
