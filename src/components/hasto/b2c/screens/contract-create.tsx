"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Landmark,
  ShoppingBag,
  RefreshCw,
  Zap,
  User,
  CheckCircle2,
  FileText,
  Building2,
  Smartphone,
  Home,
  Phone,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAppStore } from "@/lib/hasto-store";
import { fa } from "@/lib/hasto-data";

// ---------------- Types ----------------
type ContractType =
  | "direct_debit"
  | "bnpl"
  | "subscription"
  | "auto_bill"
  | "personal";

type Provider = {
  id: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
};

type Period = "ماهانه" | "هفتگی" | "سالانه" | "یکبار";

type FormData = {
  type: ContractType | null;
  provider: Provider | null;
  recipientName: string;
  recipientMobile: string;
  amount: string;
  period: Period;
  startDate: string;
  expiryDate: string;
  description: string;
};

// ---------------- Static configs ----------------
const TYPE_OPTIONS: {
  id: ContractType;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  {
    id: "direct_debit",
    title: "Direct Debit",
    desc: "برداشت خودکار از حساب بانکی متصل",
    icon: Landmark,
    color: "#034ea2",
  },
  {
    id: "bnpl",
    title: "BNPL",
    desc: "خرید اعتباری و بازپرداخت اقساطی",
    icon: ShoppingBag,
    color: "#FF6B35",
  },
  {
    id: "subscription",
    title: "تمدید خودکار (اشتراک)",
    desc: "تمدید خودکار اشتراک خدمات",
    icon: RefreshCw,
    color: "#10A37F",
  },
  {
    id: "auto_bill",
    title: "پرداخت خودکار (قبض/وام)",
    desc: "پرداخت خودکار قبض‌ها و اقساط",
    icon: Zap,
    color: "#F59E0B",
  },
  {
    id: "personal",
    title: "قرارداد شخصی",
    desc: "واریز دوره‌ای به شخص خاص",
    icon: User,
    color: "#8B5CF6",
  },
];

const PROVIDERS: Record<ContractType, Provider[]> = {
  direct_debit: [
    { id: "b bank", label: "بلو بانک", desc: "سقف ۱۰۰ میلیون تومان", icon: Building2, color: "#00B4D8" },
    { id: "tej", label: "بانک تجارت", desc: "سقف ۴۰ میلیون تومان", icon: Building2, color: "#034ea2" },
    { id: "melli", label: "بانک ملی", desc: "سقف ۱۵ میلیون تومان", icon: Building2, color: "#84CC16" },
    { id: "sepah", label: "بانک سپه", desc: "سقف ۱۵ میلیون تومان", icon: Building2, color: "#F59E0B" },
    { id: "day", label: "بانک دی", desc: "سقف ۱۰۰ میلیون تومان", icon: Building2, color: "#0EA5E9" },
    { id: "sarmayeh", label: "بانک سرمایه", desc: "سقف ۵۰ میلیون تومان", icon: Building2, color: "#10B981" },
    { id: "mellat", label: "بانک ملت", desc: "سقف ۳ میلیون تومان", icon: Building2, color: "#EF4444" },
  ],
  bnpl: [
    { id: "snapp", label: "اسنپ‌پی", desc: "سقف اعتبار ۵۰ میلیون", icon: Smartphone, color: "#FF6B35" },
    { id: "digipay", label: "دیجی‌پی", desc: "اقساط ۱۲ ماهه", icon: ShoppingBag, color: "#EF4444" },
    { id: "tara", label: "تارا", desc: "اقساط ۶ ماهه", icon: CreditCard, color: "#8B5CF6" },
    { id: "evano", label: "اوانو", desc: "اعتبار همراه اول", icon: Smartphone, color: "#3B82F6" },
    { id: "jibjet", label: "جیب جت", desc: "اعتبار ایرانسل", icon: Smartphone, color: "#06B6D4" },
  ],
  subscription: [
    { id: "snapp-pro", label: "اسنپ‌پرو", desc: "اشتراک سفر و ارسال", icon: Smartphone, color: "#FF6B35" },
    { id: "digikala-pro", label: "دیجیکالا پرو", desc: "ارسال رایگان و تخفیف", icon: ShoppingBag, color: "#EF4444" },
    { id: "chatgpt", label: "ChatGPT", desc: "اشتراک هوش مصنوعی", icon: Sparkles, color: "#10A37F" },
    { id: "filmio", label: "فیلیمو", desc: "اشتراک فیلم و سریال", icon: Smartphone, color: "#1DB954" },
    { id: "namava", label: "نماوا", desc: "اشتراک فیلم و سریال", icon: Smartphone, color: "#00BCD4" },
    { id: "spotify", label: "Spotify", desc: "اشتراک موسیقی", icon: Smartphone, color: "#1DB954" },
  ],
  auto_bill: [
    { id: "mobile-bill", label: "قبض موبایل", desc: "همراه اول / ایرانسل", icon: Smartphone, color: "#F59E0B" },
    { id: "elec-bill", label: "قبض برق", desc: "توانیر", icon: Zap, color: "#FCD34D" },
    { id: "loan-tej", label: "وام تجارت", desc: "اقساط وام بانک تجارت", icon: Landmark, color: "#034ea2" },
    { id: "rent", label: "اجاره", desc: "پرداخت ماهانه اجاره", icon: Home, color: "#8B5CF6" },
  ],
  personal: [], // manual entry in step 3
};

const PERIODS: Period[] = ["ماهانه", "هفتگی", "سالانه", "یکبار"];

// Normalize English/Persian digits
const toEn = (s: string) => s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
const toFa = (s: string) => s.replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[parseInt(d, 10)]);
const formatAmount = (raw: string) => {
  const en = toEn(raw).replace(/[^\d]/g, "");
  if (!en) return "";
  return toFa(Number(en).toLocaleString("en-US"));
};

// ---------------- Screen ----------------
export function ContractCreateScreen() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);
  const goBack = useAppStore((s) => s.goBack);

  const [step, setStep] = useState(1);
  const [saved, setSaved] = useState(false);
  const [data, setData] = useState<FormData>({
    type: null,
    provider: null,
    recipientName: "",
    recipientMobile: "",
    amount: "",
    period: "ماهانه",
    startDate: "",
    expiryDate: "",
    description: "",
  });

  const totalSteps = 4;

  const typeOption = useMemo(
    () => TYPE_OPTIONS.find((t) => t.id === data.type) ?? null,
    [data.type]
  );

  const canProceed = useMemo(() => {
    if (step === 1) return !!data.type;
    if (step === 2) {
      if (data.type === "personal") return true;
      return !!data.provider;
    }
    if (step === 3) {
      const hasRecipient =
        data.type !== "personal" ||
        (data.recipientName.trim().length > 1 && /^09\d{9}$/.test(toEn(data.recipientMobile)));
      return !!data.amount && !!data.startDate && !!data.expiryDate && hasRecipient;
    }
    return true;
  }, [step, data]);

  const next = () => {
    if (!canProceed) return;
    if (step < totalSteps) setStep(step + 1);
  };
  const prev = () => {
    if (step > 1) setStep(step - 1);
    else goBack();
  };

  const handleSave = () => {
    setSaved(true);
    toast.success("قرارداد با موفقیت ساخته شد", {
      description: "قرارداد جدید در فهرست قراردادهای شما اضافه شد.",
    });
    setTimeout(() => setB2CScreen("contracts"), 1800);
  };

  // Success animation screen
  if (saved) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
          className="relative mb-6"
        >
          <div className="absolute inset-0 rounded-full bg-success/30 blur-2xl scale-150" />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [0.8, 1.2, 1], opacity: [0, 0.6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-4 border-success"
          />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-success to-emerald-700 flex items-center justify-center shadow-2xl shadow-success/30">
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </div>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-extrabold mb-2"
        >
          قرارداد ساخته شد!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-muted-foreground"
        >
          در حال بازگشت به فهرست قراردادها…
        </motion.p>
      </div>
    );
  }

  return (
    <div className="pb-28 px-4 pt-4">
      {/* Progress indicator */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={prev}
            className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors active:scale-95"
            aria-label="بازگشت"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps }).map((_, i) => {
              const idx = i + 1;
              const active = idx === step;
              const done = idx < step;
              return (
                <div
                  key={idx}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    active ? "w-7 bg-[#034ea2]" : done ? "w-3 bg-[#034ea2]/60" : "w-3 bg-muted"
                  )}
                />
              );
            })}
          </div>
          <span className="text-xs font-bold tabular-nums text-muted-foreground">
            {fa(step)} از {fa(totalSteps)}
          </span>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-muted-foreground text-center font-medium"
          >
            {step === 1 && "نوع قرارداد را انتخاب کنید"}
            {step === 2 && "سرویس‌دهنده یا بانک را انتخاب کنید"}
            {step === 3 && "اطلاعات قرارداد را تکمیل کنید"}
            {step === 4 && "اطلاعات را تایید و ذخیره کنید"}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
        >
          {step === 1 && (
            <Step1
              value={data.type}
              onChange={(type) => setData((d) => ({ ...d, type }))}
            />
          )}
          {step === 2 && (
            <Step2
              type={data.type!}
              value={data.provider}
              onChange={(provider) => setData((d) => ({ ...d, provider }))}
            />
          )}
          {step === 3 && (
            <Step3
              data={data}
              onChange={(patch) => setData((d) => ({ ...d, ...patch }))}
            />
          )}
          {step === 4 && <Step4 data={data} typeOption={typeOption} />}
        </motion.div>
      </AnimatePresence>

      {/* Footer actions */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] px-4 pb-6 pt-3 bg-gradient-to-t from-background via-background/95 to-transparent z-30">
        <div className="flex gap-2.5">
          {step > 1 && (
            <button
              onClick={prev}
              className="h-12 px-5 rounded-xl bg-card border border-border font-bold text-sm flex items-center gap-2 active:scale-[0.98] transition-transform"
            >
              <ArrowRight className="w-4 h-4" />
              قبلی
            </button>
          )}
          <button
            onClick={step === totalSteps ? handleSave : next}
            disabled={!canProceed}
            className={cn(
              "flex-1 h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
              canProceed
                ? "bg-gradient-to-br from-[#034ea2] to-[#023069] text-white shadow-md shadow-[#034ea2]/30"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            {step === totalSteps ? (
              <>
                <Check className="w-4 h-4" />
                ذخیره قرارداد
              </>
            ) : (
              <>
                مرحله بعد
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------- Step 1: Type selection ----------------
function Step1({
  value,
  onChange,
}: {
  value: ContractType | null;
  onChange: (t: ContractType) => void;
}) {
  return (
    <div className="space-y-2.5">
      {TYPE_OPTIONS.map((opt, i) => {
        const selected = value === opt.id;
        return (
          <motion.button
            key={opt.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onChange(opt.id)}
            className={cn(
              "w-full text-right flex items-center gap-3 p-4 rounded-2xl border-2 transition-all active:scale-[0.98]",
              selected
                ? "border-[#034ea2] bg-[#034ea2]/5 dark:bg-[#034ea2]/10 shadow-md shadow-[#034ea2]/15"
                : "border-border bg-card hover:border-[#034ea2]/30"
            )}
          >
            <div
              className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: `${opt.color}22`,
                boxShadow: `inset 0 0 0 1.5px ${opt.color}33`,
              }}
            >
              <opt.icon className="w-5 h-5" style={{ color: opt.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">{opt.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-tight">{opt.desc}</p>
            </div>
            <div
              className={cn(
                "shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all",
                selected ? "bg-[#034ea2] border-[#034ea2]" : "border-muted-foreground/30"
              )}
            >
              {selected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

// ---------------- Step 2: Provider selection ----------------
function Step2({
  type,
  value,
  onChange,
}: {
  type: ContractType;
  value: Provider | null;
  onChange: (p: Provider) => void;
}) {
  const list = PROVIDERS[type];

  if (type === "personal") {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl bg-[#034ea2]/5 dark:bg-[#034ea2]/10 border border-[#034ea2]/20 p-4 flex items-start gap-3">
          <User className="w-5 h-5 text-[#034ea2] dark:text-[#6BA0F5] mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            در قرارداد شخصی، اطلاعات گیرنده را در مرحله بعد وارد می‌کنید. روی «مرحله بعد» بزنید.
          </p>
        </div>
        <div className="rounded-2xl bg-card border border-border p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 flex items-center justify-center">
            <User className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <div>
            <p className="font-bold text-sm">قرارداد شخصی</p>
            <p className="text-xs text-muted-foreground">واریز دوره‌ای به شخص خاص</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {list.map((p, i) => {
        const selected = value?.id === p.id;
        return (
          <motion.button
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            onClick={() => onChange(p)}
            className={cn(
              "w-full text-right flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all active:scale-[0.98]",
              selected
                ? "border-[#034ea2] bg-[#034ea2]/5 dark:bg-[#034ea2]/10"
                : "border-border bg-card hover:border-[#034ea2]/30"
            )}
          >
            <div
              className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: `${p.color}22`,
                boxShadow: `inset 0 0 0 1.5px ${p.color}33`,
              }}
            >
              <p.icon className="w-5 h-5" style={{ color: p.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">{p.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{p.desc}</p>
            </div>
            <div
              className={cn(
                "shrink-0 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all",
                selected ? "bg-[#034ea2] border-[#034ea2]" : "border-muted-foreground/30"
              )}
            >
              {selected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

// ---------------- Step 3: Form ----------------
function Step3({
  data,
  onChange,
}: {
  data: FormData;
  onChange: (patch: Partial<FormData>) => void;
}) {
  const isPersonal = data.type === "personal";

  const inputCls =
    "w-full h-12 rounded-xl bg-card border border-border px-4 text-sm font-medium tabular-nums focus:outline-none focus:border-[#034ea2] focus:ring-2 focus:ring-[#034ea2]/15 transition-all";

  return (
    <div className="space-y-4">
      {/* Recipient (only personal) */}
      {isPersonal && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-card border border-border p-4 space-y-3"
        >
          <FieldLabel icon={User} text="گیرنده" />
          <input
            value={data.recipientName}
            onChange={(e) => onChange({ recipientName: e.target.value })}
            placeholder="نام گیرنده"
            className={inputCls}
          />
          <div className="relative">
            <Phone className="w-4 h-4 text-muted-foreground absolute right-4 top-1/2 -translate-y-1/2" />
            <input
              value={data.recipientMobile}
              onChange={(e) => onChange({ recipientMobile: toFa(e.target.value) })}
              placeholder="شماره موبایل (۰۹۱۲۳۴۵۶۷۸۹)"
              inputMode="tel"
              dir="ltr"
              className={cn(inputCls, "pr-11 text-right")}
            />
          </div>
        </motion.div>
      )}

      {/* Amount */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl bg-card border border-border p-4 space-y-3"
      >
        <FieldLabel icon={Sparkles} text="مبلغ قرارداد" />
        <div className="relative">
          <input
            value={data.amount}
            onChange={(e) => onChange({ amount: formatAmount(e.target.value) })}
            placeholder="مثلاً ۱,۰۰۰,۰۰۰"
            inputMode="numeric"
            className={cn(inputCls, "h-14 text-xl font-extrabold pr-4 pl-20")}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
            تومان
          </span>
        </div>
        {/* Quick amounts */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1">
          {["۵۰۰,۰۰۰", "۱,۰۰۰,۰۰۰", "۲,۰۰۰,۰۰۰", "۵,۰۰۰,۰۰۰", "۱۰,۰۰۰,۰۰۰"].map((a) => (
            <button
              key={a}
              onClick={() => onChange({ amount: a })}
              className={cn(
                "shrink-0 px-3 h-8 rounded-full text-xs font-bold border transition-all active:scale-95",
                data.amount === a
                  ? "bg-[#034ea2] text-white border-[#034ea2]"
                  : "bg-card text-muted-foreground border-border"
              )}
            >
              {a}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Period */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-card border border-border p-4 space-y-3"
      >
        <FieldLabel icon={RefreshCw} text="دوره پرداخت" />
        <div className="grid grid-cols-4 gap-2">
          {PERIODS.map((p) => {
            const active = data.period === p;
            return (
              <button
                key={p}
                onClick={() => onChange({ period: p })}
                className={cn(
                  "h-10 rounded-xl text-xs font-bold border transition-all active:scale-95",
                  active
                    ? "bg-[#034ea2] text-white border-[#034ea2] shadow-md shadow-[#034ea2]/20"
                    : "bg-card text-muted-foreground border-border"
                )}
              >
                {p}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Dates */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl bg-card border border-border p-4 space-y-3"
      >
        <div>
          <FieldLabel icon={RefreshCw} text="تاریخ شروع" />
          <input
            value={data.startDate}
            onChange={(e) => onChange({ startDate: toFa(e.target.value.replace(/[^\d۰-۹/]/g, "")) })}
            placeholder="۱۴۰۵/۰۵/۰۱"
            inputMode="numeric"
            className={inputCls}
          />
        </div>
        <div>
          <FieldLabel icon={CheckCircle2} text="تاریخ انقضا" />
          <input
            value={data.expiryDate}
            onChange={(e) => onChange({ expiryDate: toFa(e.target.value.replace(/[^\d۰-۹/]/g, "")) })}
            placeholder="۱۴۰۶/۰۵/۰۱"
            inputMode="numeric"
            className={inputCls}
          />
        </div>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl bg-card border border-border p-4 space-y-3"
      >
        <FieldLabel icon={FileText} text="توضیحات (اختیاری)" />
        <textarea
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="توضیحاتی درباره این قرارداد…"
          rows={3}
          maxLength={150}
          className={cn(inputCls, "h-auto py-3 resize-none")}
        />
        <p className="text-[10px] text-muted-foreground text-left tabular-nums">
          {fa(data.description.length)} / ۱۵۰
        </p>
      </motion.div>
    </div>
  );
}

// ---------------- Step 4: Confirmation ----------------
function Step4({
  data,
  typeOption,
}: {
  data: FormData;
  typeOption: { title: string; icon: React.ComponentType<{ className?: string }>; color: string } | null;
}) {
  const rows: { label: string; value: string }[] = [];
  rows.push({ label: "نوع قرارداد", value: typeOption?.title ?? "—" });
  if (data.type === "personal") {
    rows.push({ label: "گیرنده", value: data.recipientName || "—" });
    rows.push({ label: "موبایل گیرنده", value: data.recipientMobile || "—" });
  } else {
    rows.push({ label: "سرویس‌دهنده", value: data.provider?.label ?? "—" });
  }
  rows.push({ label: "مبلغ", value: data.amount ? `${data.amount} تومان` : "—" });
  rows.push({ label: "دوره پرداخت", value: data.period });
  rows.push({ label: "تاریخ شروع", value: data.startDate || "—" });
  rows.push({ label: "تاریخ انقضا", value: data.expiryDate || "—" });
  if (data.description.trim()) rows.push({ label: "توضیحات", value: data.description });

  return (
    <div className="space-y-4">
      {/* Hero summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-5 shadow-2xl shadow-[#034ea2]/20 wallet-gradient"
      >
        <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -right-8 w-48 h-48 rounded-full bg-white/5" />
        <div className="relative z-10 flex items-center gap-3">
          {typeOption && (
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{
                backgroundColor: "rgba(255,255,255,0.18)",
                boxShadow: `inset 0 0 0 2px ${typeOption.color}66`,
              }}
            >
              <typeOption.icon className="w-7 h-7 text-white" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs mb-0.5">قرارداد جدید</p>
            <p className="text-white font-bold text-base leading-tight">
              {data.type === "personal"
                ? data.recipientName || "قرارداد شخصی"
                : data.provider?.label || typeOption?.title}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Details list */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden"
      >
        <div className="px-4 pt-4 pb-2">
          <h3 className="font-bold text-sm">خلاصه اطلاعات</h3>
        </div>
        <div className="divide-y divide-border">
          {rows.map((r) => (
            <div key={r.label} className="flex items-center justify-between px-4 py-3 gap-3">
              <span className="text-xs text-muted-foreground shrink-0">{r.label}</span>
              <span className="font-bold text-sm text-left tabular-nums" dir="auto">
                {r.value}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Info note */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="rounded-2xl bg-[#034ea2]/5 dark:bg-[#034ea2]/10 border border-[#034ea2]/20 p-3.5 flex items-start gap-2.5"
      >
        <CheckCircle2 className="w-4 h-4 text-[#034ea2] dark:text-[#6BA0F5] mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          با ذخیره قرارداد، پرداخت‌های خودکار طبق دوره انتخابی فعال می‌شوند. در هر زمان از بخش جزئیات قرارداد می‌توانید آن را لغو یا ویرایش کنید.
        </p>
      </motion.div>
    </div>
  );
}

// ---------------- Helpers ----------------
function FieldLabel({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      <span className="text-xs font-bold text-muted-foreground">{text}</span>
    </div>
  );
}
