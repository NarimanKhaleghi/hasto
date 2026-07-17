"use client";

import { useState, useRef } from "react";
import { useAppStore } from "@/lib/hasto-store";
import { HastoLogo } from "@/components/hasto/shared/hasto-logo";
import { fa, business } from "@/lib/hasto-data";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Sparkles,
  Zap,
  Code2,
  Repeat,
  Store,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type Step = "phone" | "otp" | "success";

export function B2BLoginScreen() {
  const setB2BScreen = useAppStore((s) => s.setB2BScreen);
  const setAuthenticated = useAppStore((s) => s.setAuthenticated);
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [otpSuccess, setOtpSuccess] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const phoneValid = phone.length === 9 && /^\d{9}$/.test(phone);

  const handlePhoneSubmit = () => {
    if (phoneValid) {
      setStep("otp");
      toast.success("کد تایید ارسال شد");
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    }
  };

  const handleOtpChange = (idx: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    if (value && idx < 4) otpRefs.current[idx + 1]?.focus();

    if (newOtp.every((d) => d !== "") && newOtp.join("").length === 5) {
      setTimeout(() => {
        setOtpSuccess(true);
        setTimeout(() => {
          setStep("success");
          setAuthenticated(true);
          // For demo: go directly to b2b-dashboard
          setTimeout(() => setB2BScreen("b2b-dashboard"), 800);
        }, 600);
      }, 200);
    }
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5);
    if (pasted.length > 0) {
      const newOtp = ["", "", "", "", ""];
      for (let i = 0; i < pasted.length; i++) newOtp[i] = pasted[i];
      setOtp(newOtp);
      if (pasted.length === 5) {
        otpRefs.current[4]?.focus();
        setTimeout(() => {
          setOtpSuccess(true);
          setTimeout(() => {
            setStep("success");
            setAuthenticated(true);
            setTimeout(() => setB2BScreen("b2b-dashboard"), 800);
          }, 600);
        }, 200);
      }
    }
  };

  const features = [
    { icon: Zap, label: "درگاه بدون اصطکاک" },
    { icon: Repeat, label: "تسویه خودکار" },
    { icon: Code2, label: "API قدرتمند" },
  ];

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-[#e8f0fe] via-[#f8fafc] to-white dark:from-[#0a0f1a] dark:via-[#0a0f1a] dark:to-[#111827] min-h-screen overflow-y-auto">
      {/* Top brand section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-[#034ea2] to-[#023069] flex items-center justify-center shadow-2xl shadow-[#034ea2]/30 mb-6">
            <HastoLogo size={56} />
            <div className="absolute -bottom-2 -left-2 w-9 h-9 rounded-2xl bg-gradient-to-br from-[#16a34a] to-[#15803D] flex items-center justify-center border-4 border-background shadow-md">
              <Store className="w-4 h-4 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-l from-[#034ea2] to-[#0456B5] bg-clip-text text-transparent dark:from-white dark:to-[#9DBFF9]">
            پنل کسب‌وکار هستو
          </h1>
          <p className="text-sm text-muted-foreground max-w-[260px]">
            درگاه پرداخت هوشمند، مدیریت محصولات و قراردادها — همه در یک پنل
          </p>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-2 justify-center mt-8 max-w-[340px]"
        >
          {features.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border border-border/50 text-xs font-medium"
            >
              <f.icon className="w-3.5 h-3.5 text-[#034ea2] dark:text-[#6BA0F5]" />
              {f.label}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom card with form */}
      <AnimatePresence mode="wait">
        {step === "phone" && (
          <motion.div
            key="phone"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card border-t border-border rounded-t-[2rem] p-6 pb-8 shadow-2xl"
          >
            <div className="text-center mb-5">
              <h2 className="font-bold text-lg mb-1">ورود به عنوان کسب‌وکار</h2>
              <p className="text-xs text-muted-foreground">
                شماره موبایل کسب‌وکار خود را وارد کنید
              </p>
            </div>

            <div className="relative">
              <div className="flex items-stretch gap-2">
                <div className="flex items-center px-4 rounded-2xl bg-muted border border-border">
                  <span className="text-lg font-bold text-muted-foreground tabular-nums">۰۹</span>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoFocus
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 9))}
                  onKeyDown={(e) => e.key === "Enter" && phoneValid && handlePhoneSubmit()}
                  placeholder="••• ••• ••••"
                  className="flex-1 h-14 px-4 rounded-2xl bg-background border-2 border-border focus:border-[#034ea2] outline-none text-lg font-bold tabular-nums transition-colors text-center"
                  dir="ltr"
                />
              </div>
              {phone.length > 0 && phone.length < 9 && (
                <p className="text-xs text-muted-foreground mt-2 px-2">
                  {fa(9 - phone.length)} رقم دیگر نیاز است
                </p>
              )}
            </div>

            <button
              onClick={handlePhoneSubmit}
              disabled={!phoneValid}
              className={cn(
                "w-full h-14 rounded-2xl font-bold text-base mt-4 transition-all flex items-center justify-center gap-2",
                phoneValid
                  ? "bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white shadow-glow hover:shadow-lg active:scale-[0.98]"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <Store className="w-5 h-5" />
              ورود به عنوان کسب‌وکار
            </button>

            <div className="mt-4 p-3 rounded-xl bg-[#034ea2]/5 dark:bg-[#034ea2]/10 border border-[#034ea2]/10 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#034ea2] dark:text-[#6BA0F5] shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                در نسخه نمایشی، هر شماره‌ای معتبر است. کافیست کد ۵ رقمی را وارد کنید.
              </p>
            </div>

            <button
              onClick={() => setB2BScreen("b2b-dashboard")}
              className="w-full text-center text-sm text-muted-foreground mt-4 hover:text-foreground transition-colors"
            >
              ورود سریع نسخه نمایشی →
            </button>
          </motion.div>
        )}

        {step === "otp" && (
          <motion.div
            key="otp"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card border-t border-border rounded-t-[2rem] p-6 pb-8 shadow-2xl"
          >
            <button
              onClick={() => setStep("phone")}
              className="flex items-center gap-1 text-sm text-muted-foreground mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              تغییر شماره
            </button>

            <div className="text-center mb-6">
              <h2 className="font-bold text-lg mb-1">کد تایید</h2>
              <p className="text-xs text-muted-foreground">کد ۵ رقمی به شماره</p>
              <p className="text-sm font-bold mt-1 tabular-nums" dir="ltr">
                ۰۹ {fa(phone)}
              </p>
            </div>

            <div
              className="flex justify-center gap-2.5 mb-4"
              dir="ltr"
              onPaste={handleOtpPaste}
            >
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpRefs.current[idx] = el;
                  }}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className={cn(
                    "w-12 h-14 rounded-2xl border-2 outline-none text-center text-2xl font-bold tabular-nums transition-all",
                    otpSuccess
                      ? "border-success bg-success/10 text-success"
                      : digit
                      ? "border-[#034ea2] bg-[#034ea2]/5 text-[#034ea2] dark:text-[#6BA0F5]"
                      : "border-border bg-background focus:border-[#034ea2]"
                  )}
                />
              ))}
            </div>

            {otpSuccess && (
              <div className="flex items-center justify-center gap-2 text-success mb-4 animate-scale-in">
                <Check className="w-5 h-5" />
                <span className="text-sm font-medium">کد تایید شد</span>
              </div>
            )}

            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">کد را دریافت نکرده‌اید؟</p>
              <button className="text-sm font-bold text-[#034ea2] dark:text-[#6BA0F5]">
                ارسال مجدد کد
              </button>
            </div>
          </motion.div>
        )}

        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col items-center justify-center px-6 py-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="w-24 h-24 rounded-full bg-success/15 flex items-center justify-center mb-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
                className="w-16 h-16 rounded-full bg-success flex items-center justify-center"
              >
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
              </motion.div>
            </motion.div>
            <h2 className="text-xl font-bold mb-1">خوش آمدید {business.profile.owner}!</h2>
            <p className="text-sm text-muted-foreground">در حال ورود به پنل کسب‌وکار...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust footer */}
      <div className="px-6 py-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>پنل کسب‌وکار هستو — امن و رمزنگاری شده</span>
      </div>
    </div>
  );
}
