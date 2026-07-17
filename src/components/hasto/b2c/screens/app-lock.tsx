"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/hasto-store";
import { fa } from "@/lib/hasto-data";
import { Lock, Fingerprint, Shield, Check, X, Delete, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Step = "current" | "new" | "confirm" | "success";

export function AppLockScreen() {
  const goBack = useAppStore((s) => s.goBack);
  const [step, setStep] = useState<Step>("current");
  const [pin, setPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [error, setError] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [autoLock, setAutoLock] = useState("immediate");

  const maxLength = 6;

  const handleDigit = (digit: string) => {
    setError(false);
    if (step === "current") {
      const next = (pin + digit).slice(0, maxLength);
      setPin(next);
      if (next.length === maxLength) {
        // Mock: any PIN is valid
        setTimeout(() => {
          setStep("new");
          setPin("");
        }, 300);
      }
    } else if (step === "new") {
      const next = (pin + digit).slice(0, maxLength);
      setPin(next);
      if (next.length === maxLength) {
        setNewPin(next);
        setStep("confirm");
        setPin("");
      }
    } else if (step === "confirm") {
      const next = (pin + digit).slice(0, maxLength);
      setPin(next);
      if (next.length === maxLength) {
        if (next === newPin) {
          setStep("success");
          setTimeout(() => {
            toast.success("رمز برنامه با موفقیت تنظیم شد");
            goBack();
          }, 1500);
        } else {
          setError(true);
          setTimeout(() => {
            setPin("");
            setError(false);
          }, 800);
        }
      }
    }
  };

  const handleDelete = () => {
    setError(false);
    setPin(pin.slice(0, -1));
  };

  const stepConfig = {
    current: { title: "رمز فعلی", subtitle: "رمز فعلی برنامه را وارد کنید" },
    new: { title: "رمز جدید", subtitle: "رمز جدید ۶ رقمی وارد کنید" },
    confirm: { title: "تایید رمز", subtitle: "رمز جدید را دوباره وارد کنید" },
    success: { title: "موفقیت", subtitle: "رمز برنامه تنظیم شد" },
  };

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-[#6366F1] to-[#4338CA] text-white shadow-lg"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-base">قفل برنامه</h2>
              <p className="text-[11px] text-white/70">امنیت حساب کاربری</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Settings cards */}
      <div className="px-4 space-y-2 mb-4">
        {/* Biometric toggle */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border shadow-soft">
          <div className="w-10 h-10 rounded-xl bg-[#034ea2]/15 dark:bg-[#6BA0F5]/15 flex items-center justify-center shrink-0">
            <Fingerprint className="w-5 h-5 text-[#034ea2] dark:text-[#6BA0F5]" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">ورود بیومتریک</p>
            <p className="text-[11px] text-muted-foreground">اثر انگشت / چهره</p>
          </div>
          <ToggleSwitch checked={biometric} onChange={setBiometric} />
        </div>

        {/* Auto-lock setting */}
        <div className="p-3 rounded-2xl bg-card border border-border shadow-soft">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">قفل خودکار</p>
              <p className="text-[11px] text-muted-foreground">زمان قفل شدن خودکار</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "immediate", label: "فوری" },
              { value: "1min", label: "۱ دقیقه" },
              { value: "5min", label: "۵ دقیقه" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setAutoLock(opt.value)}
                className={cn(
                  "py-2 rounded-xl text-xs font-bold transition-all",
                  autoLock === opt.value
                    ? "bg-[#034ea2] text-white dark:bg-[#6BA0F5]"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PIN setup section */}
      <div className="px-4">
        <div className="rounded-3xl bg-card border border-border p-6 shadow-soft">
          <AnimatePresence mode="wait">
            {step !== "success" ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Step title */}
                <div className="text-center mb-6">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-3",
                    error ? "bg-destructive/15" : "bg-[#6366F1]/15"
                  )}>
                    {error ? (
                      <X className="w-8 h-8 text-destructive" />
                    ) : (
                      <Lock className="w-8 h-8 text-[#6366F1]" />
                    )}
                  </div>
                  <h3 className="font-bold text-base mb-1">{stepConfig[step].title}</h3>
                  <p className="text-xs text-muted-foreground">{stepConfig[step].subtitle}</p>
                </div>

                {/* PIN dots */}
                <div className="flex justify-center gap-3 mb-6">
                  {Array.from({ length: maxLength }).map((_, idx) => (
                    <motion.div
                      key={idx}
                      animate={{
                        scale: pin.length === idx ? [1, 1.2, 1] : 1,
                        backgroundColor: error ? ["#EF4444", "#fee2e2", "#EF4444"] : undefined,
                      }}
                      transition={{ duration: 0.3 }}
                      className={cn(
                        "w-3.5 h-3.5 rounded-full transition-colors",
                        error
                          ? "bg-destructive"
                          : idx < pin.length
                          ? "bg-[#6366F1]"
                          : "bg-muted"
                      )}
                    />
                  ))}
                </div>

                {error && (
                  <p className="text-center text-xs text-destructive mb-4">
                    رمزها مطابقت ندارند. دوباره تلاش کنید.
                  </p>
                )}

                {/* Number pad */}
                <div className="grid grid-cols-3 gap-2 max-w-[260px] mx-auto">
                  {["۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"].map((digit) => (
                    <button
                      key={digit}
                      onClick={() => handleDigit(digit)}
                      className="aspect-square rounded-2xl bg-muted hover:bg-muted/70 active:scale-95 transition-all text-xl font-bold tabular-nums"
                    >
                      {digit}
                    </button>
                  ))}
                  <div className="aspect-square" />
                  <button
                    onClick={() => handleDigit("۰")}
                    className="aspect-square rounded-2xl bg-muted hover:bg-muted/70 active:scale-95 transition-all text-xl font-bold tabular-nums"
                  >
                    ۰
                  </button>
                  <button
                    onClick={handleDelete}
                    className="aspect-square rounded-2xl bg-muted hover:bg-muted/70 active:scale-95 transition-all flex items-center justify-center"
                  >
                    <Delete className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-success/15 mx-auto flex items-center justify-center mb-4"
                >
                  <Check className="w-10 h-10 text-success" strokeWidth={3} />
                </motion.div>
                <h3 className="font-bold text-base mb-1">رمز تنظیم شد!</h3>
                <p className="text-xs text-muted-foreground">در حال بازگشت...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Security tips */}
      <div className="px-4 mt-4">
        <div className="p-3 rounded-2xl bg-[#034ea2]/5 dark:bg-[#6BA0F5]/10 border border-[#034ea2]/10 flex items-start gap-2">
          <Shield className="w-4 h-4 text-[#034ea2] dark:text-[#6BA0F5] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold mb-1">نکته امنیتی</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              از رمزهای ساده مانند ۱۲۳۴۵۶ یا ۰۰۰۰۰۰ استفاده نکنید. رمز قوی ترکیبی از اعداد تصادفی است.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors shrink-0",
        checked ? "bg-[#034ea2] dark:bg-[#6BA0F5]" : "bg-muted"
      )}
    >
      <motion.div
        animate={{ x: checked ? 0 : 20 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
      />
    </button>
  );
}
