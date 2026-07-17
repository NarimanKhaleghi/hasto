"use client";

import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/hasto-store";
import {
  recentTransfers,
  cardPrefixes,
  fa,
  user,
  type RecentTransfer,
} from "@/lib/hasto-data";
import { SectionCard } from "@/components/hasto/shared/ui";
import {
  ScanLine,
  Check,
  Smartphone,
  CreditCard,
  Landmark,
  X,
  Search,
  ChevronLeft,
  Clock,
  User2,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ==================== Recipient Detection ====================
type Detected =
  | { type: "mobile" | "card" | "sheba"; bank?: string; normalized: string; formatted: string }
  | { type: null; normalized: string; formatted: string };

function detectRecipient(raw: string): Detected {
  const cleaned = raw.replace(/[\s_-]/g, "").trim();
  if (!cleaned) return { type: null, normalized: "", formatted: "" };

  // Sheba: IR + 24 digits (or just 24 digits)
  const shebaMatch = /^(IR)?(\d{24})$/i.exec(cleaned);
  if (shebaMatch) {
    return {
      type: "sheba",
      normalized: `IR${shebaMatch[2]}`,
      formatted: `IR${shebaMatch[2]}`,
    };
  }

  // Mobile: 09XXXXXXXXX (exactly 11 digits starting with 09)
  if (/^09\d{9}$/.test(cleaned)) {
    return { type: "mobile", normalized: cleaned, formatted: cleaned };
  }

  // Card: exactly 16 digits
  if (/^\d{16}$/.test(cleaned)) {
    const prefix = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}`;
    const bank = cardPrefixes[prefix];
    const formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8, 12)}-${cleaned.slice(12, 16)}`;
    return { type: "card", bank, normalized: cleaned, formatted };
  }

  return { type: null, normalized: cleaned, formatted: raw };
}

// ==================== Bank Avatar ====================
function BankAvatar({ bank, type }: { bank?: string; type: "mobile" | "card" | "sheba" }) {
  if (type === "card" && bank) {
    return (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#034ea2] to-[#023069] flex items-center justify-center text-white shadow-md shrink-0">
        <CreditCard className="w-5 h-5" />
      </div>
    );
  }
  if (type === "sheba") {
    return (
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shrink-0">
        <Landmark className="w-5 h-5" />
      </div>
    );
  }
  return (
    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white shadow-md shrink-0">
      <Smartphone className="w-5 h-5" />
    </div>
  );
}

// ==================== Main Screen ====================
export function TransferScreen() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);
  const setTransferContext = useAppStore((s) => s.setTransferContext);
  const transferContext = useAppStore((s) => s.transferContext);

  const [input, setInput] = useState("");
  const [scanOpen, setScanOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const detected = useMemo(() => detectRecipient(input), [input]);

  // Recipient name resolution: matched recent transfer or derived from type
  const matchedRecent = useMemo(() => {
    if (!detected.normalized) return null;
    return (
      recentTransfers.find((r) => {
        const rClean = r.number.replace(/[\s_-]/g, "");
        return (
          rClean === detected.normalized ||
          rClean.endsWith(detected.normalized) ||
          detected.normalized.endsWith(rClean)
        );
      }) ?? null
    );
  }, [detected]);

  const recipientName = useMemo(() => {
    if (matchedRecent) return matchedRecent.name;
    if (detected.type === "mobile") return "گیرنده موبایل";
    if (detected.type === "card") return detected.bank ? `بانک ${detected.bank}` : "دارنده کارت";
    if (detected.type === "sheba") return "دارنده حساب";
    return "";
  }, [matchedRecent, detected]);

  const isValid = detected.type !== null;

  const filteredRecents = useMemo(() => {
    if (!search.trim()) return recentTransfers;
    const q = search.trim();
    return recentTransfers.filter(
      (r) => r.name.includes(q) || r.number.replace(/[\s_-]/g, "").includes(q.replace(/[\s_-]/g, ""))
    );
  }, [search]);

  const handleConfirm = () => {
    if (!isValid) return;
    setTransferContext({
      recipientName,
      recipientNumber: detected.formatted,
      recipientType: detected.type,
      bank: detected.bank,
      amount: transferContext?.amount ?? 0,
      amountText: transferContext?.amountText ?? "",
      description: transferContext?.description,
    });
    setB2CScreen("transfer-confirm");
  };

  const pickRecent = (r: RecentTransfer) => {
    setInput(r.number);
    setSearch("");
    toast.success(`${r.name} انتخاب شد`);
    inputRef.current?.focus();
  };

  return (
    <div className="pb-28 min-h-full">
      {/* Hero / Input card */}
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative overflow-hidden rounded-3xl bg-card border border-border shadow-soft p-5"
        >
          {/* Decorative gradient blob */}
          <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-[#034ea2]/8 blur-2xl" />
          <div className="absolute -bottom-12 -right-8 w-36 h-36 rounded-full bg-[#6BA0F5]/10 blur-2xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-[#034ea2]/10 flex items-center justify-center">
                <User2 className="w-4 h-4 text-[#034ea2] dark:text-[#6BA0F5]" />
              </div>
              <h2 className="font-bold text-base">گیرنده را وارد کنید</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              شماره موبایل، شماره کارت یا شبا
            </p>

            {/* Input */}
            <div className="relative">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="مثلا ۰۹۱۲۳۴۵۶۷۸۹"
                dir="ltr"
                inputMode="text"
                autoComplete="off"
                className={cn(
                  "w-full h-14 rounded-2xl bg-background border-2 px-4 pl-12 text-left font-medium tabular-nums tracking-wide outline-none transition-all placeholder:text-muted-foreground/60 placeholder:text-sm placeholder:font-normal",
                  isValid
                    ? "border-[#034ea2]/40 focus:border-[#034ea2] dark:border-[#6BA0F5]/40 dark:focus:border-[#6BA0F5]"
                    : "border-border focus:border-[#034ea2]/40"
                )}
              />
              {input && (
                <button
                  onClick={() => setInput("")}
                  aria-label="پاک کردن"
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Detected type badge */}
            <AnimatePresence mode="wait">
              {detected.type && (
                <motion.div
                  key={detected.type + (detected.bank ?? "")}
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="mt-3 flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-l from-[#034ea2]/8 to-transparent border border-[#034ea2]/15"
                >
                  <BankAvatar bank={detected.bank} type={detected.type} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm truncate">{recipientName}</p>
                      <TypeChip type={detected.type} />
                    </div>
                    <p className="text-xs text-muted-foreground tabular-nums truncate mt-0.5" dir="ltr">
                      {detected.formatted}
                    </p>
                    {detected.bank && (
                      <p className="text-[11px] text-[#034ea2] dark:text-[#6BA0F5] font-medium mt-0.5">
                        بانک {detected.bank}
                      </p>
                    )}
                  </div>
                  <Check className="w-5 h-5 text-success shrink-0" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Recent transfers */}
      <div className="px-4">
        <SectionCard
          title="مخاطبین اخیر"
          icon={Clock}
          noPadding
          action={
            <span className="text-[11px] text-muted-foreground">
              {fa(filteredRecents.length)} مورد
            </span>
          }
        >
          {/* Search bar */}
          <div className="px-3 pt-3 pb-2">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجوی نام یا شماره"
                className="w-full h-10 rounded-xl bg-muted/60 pr-9 pl-3 text-sm outline-none focus:bg-muted transition-colors placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto scrollbar-thin divide-y divide-border">
            {filteredRecents.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                موردی یافت نشد
              </div>
            ) : (
              filteredRecents.map((r, i) => (
                <motion.button
                  key={r.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => pickRecent(r)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-accent/40 active:bg-accent transition-colors text-right"
                >
                  <BankAvatar bank={r.bank} type={r.type} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground tabular-nums truncate mt-0.5" dir="ltr">
                      {r.number}
                    </p>
                  </div>
                  <div className="text-left shrink-0">
                    <p className="text-[11px] font-medium tabular-nums text-foreground">
                      {r.lastAmount}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{r.lastDate}</p>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-muted-foreground shrink-0" />
                </motion.button>
              ))
            )}
          </div>
        </SectionCard>

        {/* Info hint */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-[11px] text-muted-foreground text-center mt-4 px-6 leading-relaxed"
        >
          برای امنیت بیشتر، قبل از تایید نهایی اطلاعات گیرنده را بررسی کنید.
          موجودی فعلی:{" "}
          <span className="font-bold text-[#034ea2] dark:text-[#6BA0F5] tabular-nums">
            {fa(user.wallet.balance.toLocaleString("en-US"))}
          </span>{" "}
          تومان
        </motion.p>
      </div>

      {/* Floating action buttons: Scan + Confirm */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 max-w-[420px] w-full px-4">
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => setScanOpen(true)}
          aria-label="اسکن کارت"
          className="flex items-center justify-center gap-2 h-14 px-5 rounded-2xl bg-card border-2 border-[#034ea2]/20 text-[#034ea2] dark:text-[#6BA0F5] dark:border-[#6BA0F5]/30 font-bold shadow-soft active:scale-95 transition-transform shrink-0"
        >
          <ScanLine className="w-5 h-5" />
          <span className="text-sm">اسکن</span>
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={handleConfirm}
          disabled={!isValid}
          aria-label="تایید و ادامه"
          className={cn(
            "flex-1 h-14 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95",
            isValid
              ? "bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white shadow-[#034ea2]/30"
              : "bg-muted text-muted-foreground shadow-none cursor-not-allowed"
          )}
        >
          <span className="text-sm">تایید</span>
          {isValid && <Check className="w-5 h-5" />}
        </motion.button>
      </div>

      {/* Scan Modal */}
      <AnimatePresence>
        {scanOpen && <ScanModal onClose={() => setScanOpen(false)} onDetected={(v) => { setInput(v); setScanOpen(false); }} />}
      </AnimatePresence>
    </div>
  );
}

// ==================== Type Chip ====================
function TypeChip({ type }: { type: "mobile" | "card" | "sheba" }) {
  const map = {
    mobile: { label: "موبایل", icon: Smartphone, color: "bg-violet-500/15 text-violet-600 dark:text-violet-300" },
    card: { label: "کارت", icon: CreditCard, color: "bg-[#034ea2]/15 text-[#034ea2] dark:text-[#6BA0F5]" },
    sheba: { label: "شبا", icon: Landmark, color: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300" },
  } as const;
  const m = map[type];
  const Icon = m.icon;
  return (
    <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium", m.color)}>
      <Icon className="w-3 h-3" />
      {m.label}
    </span>
  );
}

// ==================== Scan Modal (mock camera) ====================
function ScanModal({ onClose, onDetected }: { onClose: () => void; onDetected: (v: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 26, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[360px] mx-4 rounded-3xl overflow-hidden bg-card border border-border shadow-2xl"
      >
        {/* Camera viewport */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center overflow-hidden">
          {/* Scan frame */}
          <div className="relative w-56 h-36">
            {/* Corner brackets */}
            {[
              "top-0 left-0 border-t-4 border-l-4 rounded-tl-xl",
              "top-0 right-0 border-t-4 border-r-4 rounded-tr-xl",
              "bottom-0 left-0 border-b-4 border-l-4 rounded-bl-xl",
              "bottom-0 right-0 border-b-4 border-r-4 rounded-br-xl",
            ].map((c, i) => (
              <div key={i} className={cn("absolute w-7 h-7 border-[#6BA0F5]", c)} />
            ))}
            {/* Scanning line */}
            <motion.div
              animate={{ y: [0, 130, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#6BA0F5] to-transparent shadow-[0_0_12px_2px_rgba(107,160,245,0.6)]"
            />
          </div>

          {/* Top label */}
          <div className="absolute top-3 inset-x-0 flex items-center justify-between px-4">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white"
              aria-label="بستن"
            >
              <X className="w-4 h-4" />
            </button>
            <span className="text-white/90 text-xs font-medium bg-black/40 backdrop-blur px-3 py-1 rounded-full">
              دوربین فعال شد
            </span>
            <div className="w-8 h-8" />
          </div>

          {/* Bottom hint */}
          <div className="absolute bottom-3 inset-x-0 text-center">
            <p className="text-white/80 text-[11px]">کارت را داخل کادر قرار دهید</p>
          </div>
        </div>

        {/* Mock detected actions */}
        <div className="p-4 space-y-2">
          <p className="text-xs text-muted-foreground text-center mb-2">
            (حالت نمایشی) یک کارت نمونه انتخاب کنید:
          </p>
          <button
            onClick={() => onDetected("6273-5312-3456-7890")}
            className="w-full h-11 rounded-xl bg-muted/60 hover:bg-muted transition-colors text-sm font-medium tabular-nums"
            dir="ltr"
          >
            6273-5312-3456-7890 — تجارت
          </button>
          <button
            onClick={() => onDetected("6037-9912-3456-7890")}
            className="w-full h-11 rounded-xl bg-muted/60 hover:bg-muted transition-colors text-sm font-medium tabular-nums"
            dir="ltr"
          >
            6037-9912-3456-7890 — ملی
          </button>
          <div className="flex items-center gap-2 pt-1">
            <Camera className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="text-[11px] text-muted-foreground">فلش خودکار فعال است</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
