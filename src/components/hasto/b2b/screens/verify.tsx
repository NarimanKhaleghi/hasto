"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/hasto-store";
import { HastoLogo } from "@/components/hasto/shared/hasto-logo";
import { business, fa } from "@/lib/hasto-data";
import { cn } from "@/lib/utils";
import {
  Store,
  Upload,
  FileText,
  IdCard,
  Receipt,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  MapPin,
  Phone,
  Loader2,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type Step = "info" | "bank" | "docs" | "submitting" | "done";

const businessTypes = ["فروشگاهی", "خدماتی", "تولیدی", "آنلاین"];

export function B2BVerifyScreen() {
  const setB2BScreen = useAppStore((s) => s.setB2BScreen);
  const [step, setStep] = useState<Step>("info");
  const [bizType, setBizType] = useState(business.profile.type);
  const [docsUploaded, setDocsUploaded] = useState<Record<string, boolean>>({
    "کارت ملی": false,
    "جواز کسب": false,
    "فاکتور": false,
  });

  const handleDocUpload = (name: string) => {
    setDocsUploaded((p) => ({ ...p, [name]: true }));
    toast.success(`${name} آپلود شد`);
  };

  const handleSubmit = () => {
    setStep("submitting");
    setTimeout(() => {
      setStep("done");
      toast.success("اطلاعات ارسال شد");
    }, 1500);
    setTimeout(() => {
      setB2BScreen("b2b-dashboard");
    }, 3200);
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-[#e8f0fe] via-[#f8fafc] to-white dark:from-[#0a0f1a] dark:via-[#0a0f1a] dark:to-[#111827] min-h-screen overflow-y-auto scrollbar-thin">
      {/* Top brand */}
      <div className="px-6 pt-10 pb-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center"
        >
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#034ea2] to-[#023069] flex items-center justify-center shadow-2xl shadow-[#034ea2]/30 mb-4">
            <HastoLogo size={48} />
          </div>
          <h1 className="text-xl font-bold mb-1">احراز هویت کسب‌وکار</h1>
          <p className="text-sm text-muted-foreground max-w-[280px]">
            برای فعال‌سازی درگاه پرداخت، اطلاعات کسب‌وکار خود را تکمیل کنید
          </p>
        </motion.div>
      </div>

      {/* Status indicator */}
      <div className="px-6 mb-4">
        <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-warning/10 border border-warning/20">
          <div className="flex items-center gap-2">
            <span className="text-xl">🟡</span>
            <div>
              <p className="text-sm font-bold">در انتظار بررسی</p>
              <p className="text-[11px] text-muted-foreground">پس از ارسال، ظرف ۲۴ ساعت بررسی می‌شود</p>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-warning shrink-0" />
        </div>
      </div>

      {/* Stepper */}
      <div className="px-6 mb-4">
        <div className="flex items-center gap-2">
          {(["info", "bank", "docs"] as const).map((s, i) => {
            const stepIdx = ["info", "bank", "docs", "submitting"].indexOf(step);
            const myIdx = ["info", "bank", "docs"].indexOf(s);
            const isActive = myIdx === stepIdx;
            const isDone = myIdx < stepIdx;
            return (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0",
                    isDone
                      ? "bg-success text-white"
                      : isActive
                      ? "bg-[#034ea2] text-white shadow-glow"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {isDone ? <CheckCircle2 className="w-4 h-4" /> : fa(i + 1)}
                </div>
                {i < 2 && (
                  <div className="flex-1 h-0.5 bg-muted relative overflow-hidden rounded-full">
                    <div
                      className={cn(
                        "absolute inset-0 bg-success transition-all duration-500",
                        isDone ? "w-full" : "w-0"
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-2 px-0.5">
          <span className="text-[10px] text-muted-foreground">اطلاعات</span>
          <span className="text-[10px] text-muted-foreground">بانک</span>
          <span className="text-[10px] text-muted-foreground">مدارک</span>
        </div>
      </div>

      {/* Form Card */}
      <AnimatePresence mode="wait">
        {step === "info" && (
          <motion.div
            key="info"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-card border-t border-border rounded-t-[2rem] p-6 pb-8 shadow-2xl"
          >
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Store className="w-5 h-5 text-[#034ea2] dark:text-[#6BA0F5]" />
              اطلاعات کسب‌وکار
            </h2>

            <Field label="نام کسب‌وکار" icon={Store}>
              <input
                type="text"
                defaultValue={business.profile.name}
                className={inputCls}
                placeholder="مثلاً: فروشگاه لباس راما"
              />
            </Field>

            <Field label="نوع کسب‌وکار" icon={Store}>
              <div className="grid grid-cols-2 gap-2">
                {businessTypes.map((t) => (
                  <button
                    key={t}
                    onClick={() => setBizType(t)}
                    className={cn(
                      "h-11 rounded-xl border-2 text-sm font-medium transition-all",
                      bizType === t
                        ? "border-[#034ea2] bg-[#034ea2]/5 text-[#034ea2] dark:text-[#6BA0F5]"
                        : "border-border bg-background text-muted-foreground"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="شماره ثبت" icon={FileText}>
              <input
                type="text"
                defaultValue={business.profile.registrationNumber}
                className={inputCls}
                dir="ltr"
              />
            </Field>

            <Field label="آدرس" icon={MapPin}>
              <textarea
                defaultValue={business.profile.address}
                className={cn(inputCls, "h-20 resize-none")}
                placeholder="آدرس کامل کسب‌وکار"
              />
            </Field>

            <Field label="تلفن ثابت" icon={Phone}>
              <input
                type="tel"
                defaultValue={business.profile.phone}
                className={inputCls}
                dir="ltr"
              />
            </Field>

            <button
              onClick={() => setStep("bank")}
              className="w-full h-14 rounded-2xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white font-bold mt-4 flex items-center justify-center gap-2 shadow-glow active:scale-[0.98] transition-transform"
            >
              ادامه
              <ArrowLeft className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {step === "bank" && (
          <motion.div
            key="bank"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-card border-t border-border rounded-t-[2rem] p-6 pb-8 shadow-2xl"
          >
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-[#034ea2] dark:text-[#6BA0F5]" />
              اطلاعات بانکی
            </h2>

            <Field label="شماره حساب" icon={CreditCard}>
              <input
                type="text"
                defaultValue={business.bankInfo.accountNumber}
                className={inputCls}
                dir="ltr"
              />
            </Field>

            <Field label="شماره شبا" icon={CreditCard}>
              <input
                type="text"
                defaultValue={business.bankInfo.sheba}
                className={inputCls}
                dir="ltr"
              />
            </Field>

            <Field label="نام صاحب حساب" icon={IdCard}>
              <input
                type="text"
                defaultValue={business.bankInfo.accountHolder}
                className={inputCls}
              />
            </Field>

            <Field label="بانک" icon={CreditCard}>
              <input
                type="text"
                defaultValue={business.bankInfo.bank}
                className={inputCls}
              />
            </Field>

            <div className="flex items-center gap-2 mt-2 mb-4 p-3 rounded-xl bg-info/5 border border-info/10">
              <ShieldCheck className="w-4 h-4 text-info shrink-0" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                اطلاعات بانکی برای تسویه حساب خودکار استفاده می‌شود و کاملاً امن نگهداری می‌شود.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStep("info")}
                className="flex-1 h-14 rounded-2xl bg-muted text-muted-foreground font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <ArrowRight className="w-5 h-5" />
                بازگشت
              </button>
              <button
                onClick={() => setStep("docs")}
                className="flex-[2] h-14 rounded-2xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white font-bold flex items-center justify-center gap-2 shadow-glow active:scale-[0.98] transition-transform"
              >
                ادامه
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === "docs" && (
          <motion.div
            key="docs"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-card border-t border-border rounded-t-[2rem] p-6 pb-8 shadow-2xl"
          >
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#034ea2] dark:text-[#6BA0F5]" />
              مدارک
            </h2>

            <div className="space-y-3">
              {[
                { name: "کارت ملی", icon: IdCard, desc: "تصویر روی و پشت کارت ملی" },
                { name: "جواز کسب", icon: FileText, desc: "تصویر جواز کسب به‌روز" },
                { name: "فاکتور", icon: Receipt, desc: "فاکتور اخیر کسب‌وکار" },
              ].map((doc) => {
                const uploaded = docsUploaded[doc.name];
                return (
                  <button
                    key={doc.name}
                    onClick={() => handleDocUpload(doc.name)}
                    className={cn(
                      "w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed transition-all text-right",
                      uploaded
                        ? "border-success bg-success/5"
                        : "border-border bg-muted/30 hover:border-[#034ea2]"
                    )}
                  >
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                        uploaded ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {uploaded ? <CheckCircle2 className="w-6 h-6" /> : <doc.icon className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm">{doc.name}</p>
                      <p className="text-[11px] text-muted-foreground">{doc.desc}</p>
                    </div>
                    {uploaded ? (
                      <span className="text-[11px] font-bold text-success">آپلود شد</span>
                    ) : (
                      <Upload className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-info/5 border border-info/10 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-info shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                برای نسخه نمایشی، آپلود مدارک الزامی نیست. می‌توانید مستقیم ارسال کنید.
              </p>
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setStep("bank")}
                className="flex-1 h-14 rounded-2xl bg-muted text-muted-foreground font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <ArrowRight className="w-5 h-5" />
                بازگشت
              </button>
              <button
                onClick={handleSubmit}
                className="flex-[2] h-14 rounded-2xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white font-bold flex items-center justify-center gap-2 shadow-glow active:scale-[0.98] transition-transform"
              >
                ارسال برای تایید
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {step === "submitting" && (
          <motion.div
            key="submitting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card border-t border-border rounded-t-[2rem] p-8 pb-12 shadow-2xl flex flex-col items-center"
          >
            <Loader2 className="w-12 h-12 text-[#034ea2] dark:text-[#6BA0F5] animate-spin mb-4" />
            <h2 className="font-bold text-lg mb-1">در حال ارسال اطلاعات...</h2>
            <p className="text-sm text-muted-foreground">لطفاً صبر کنید</p>
          </motion.div>
        )}

        {step === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border-t border-border rounded-t-[2rem] p-8 pb-12 shadow-2xl flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center mb-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
                className="w-14 h-14 rounded-full bg-success flex items-center justify-center"
              >
                <CheckCircle2 className="w-7 h-7 text-white" strokeWidth={3} />
              </motion.div>
            </motion.div>
            <h2 className="text-lg font-bold mb-1">اطلاعات ارسال شد</h2>
            <p className="text-sm text-muted-foreground text-center">
              برای نسخه نمایشی، کسب‌وکار شما از پیش تایید شده است. در حال ورود به داشبورد...
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls =
  "w-full h-12 px-4 rounded-2xl bg-background border-2 border-border focus:border-[#034ea2] outline-none text-sm font-medium transition-colors";

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5 px-1">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </label>
      {children}
    </div>
  );
}
