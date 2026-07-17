"use client";

import { useAppStore } from "@/lib/hasto-store";
import type { TransferContext } from "@/lib/hasto-store";
import { paymentIdExamples, fa, formatToman } from "@/lib/hasto-data";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hash,
  Check,
  ChevronLeft,
  User,
  Wallet,
  FileText,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PREFIX = "HST-";
const ID_LENGTH = 6; // 6 alphanumeric chars after prefix

// Normalize: strip non-alphanumerics, uppercase
function normalizeInput(raw: string): string {
  const cleaned = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  // remove prefix if user typed it
  const withoutPrefix = cleaned.startsWith(PREFIX.replace("-", ""))
    ? cleaned.slice(PREFIX.replace("-", "").length)
    : cleaned;
  return withoutPrefix.slice(0, ID_LENGTH);
}

function formatId(raw: string): string {
  const n = normalizeInput(raw);
  return n ? `${PREFIX}${n}` : PREFIX;
}

function isValid(raw: string): boolean {
  return normalizeInput(raw).length === ID_LENGTH;
}

// Lookup recipient info from mock examples
function lookupRecipient(id: string) {
  const match = paymentIdExamples.find((e) => e.id === formatId(id));
  if (match) {
    return {
      name: match.recipient,
      amount: parseInt(match.amount.replace(/,/g, ""), 10),
      amountText: match.amount,
      desc: match.desc,
      isKnown: true,
    };
  }
  // Simulated unknown recipient for any valid-looking id
  return {
    name: "دارنده کیف پول هستو",
    amount: 0,
    amountText: "",
    desc: "",
    isKnown: false,
  };
}

export function PaymentIdScreen() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);
  const setTransferContext = useAppStore((s) => s.setTransferContext);

  const [rawInput, setRawInput] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const formatted = useMemo(() => formatId(rawInput), [rawInput]);
  const valid = isValid(rawInput);
  const recipient = useMemo(() => (valid ? lookupRecipient(rawInput) : null), [rawInput, valid]);

  const handleQuickFill = (id: string) => {
    const ex = paymentIdExamples.find((e) => e.id === id);
    setRawInput(id.replace(PREFIX, ""));
    if (ex) {
      setDescription(ex.desc);
      setAmount(String(parseInt(ex.amount.replace(/,/g, ""), 10)));
    }
    toast.success("شناسه نمونه پر شد");
    inputRef.current?.focus();
  };

  const handleAmountChange = (v: string) => {
    const onlyDigits = v.replace(/[^\d]/g, "");
    setAmount(onlyDigits);
  };

  const amountNum = parseInt(amount || "0", 10);

  const handleConfirm = () => {
    if (!valid || !recipient) {
      toast.error("شناسه واریز معتبر نیست");
      return;
    }
    if (amountNum <= 0) {
      toast.error("مبلغ را وارد کنید");
      return;
    }
    const ctx: TransferContext = {
      recipientName: recipient.name,
      recipientNumber: formatted,
      recipientType: "id",
      amount: amountNum,
      amountText: formatToman(amountNum),
      description: description || undefined,
      paymentMethod: "شناسه واریز",
    };
    setTransferContext(ctx);
    setB2CScreen("transfer-pin");
  };

  const quickAmounts = [50000, 100000, 250000, 500000];

  return (
    <div className="pb-6">
      {/* Hero */}
      <div className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center mb-5"
        >
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#034ea2] to-[#023069] flex items-center justify-center shadow-lg shadow-[#034ea2]/25 mb-3">
            <Hash className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-lg font-bold mb-0.5">شناسه واریز</h1>
          <p className="text-xs text-muted-foreground">
            شناسه کیف پول گیرنده را وارد کنید (با پیشوند HST)
          </p>
        </motion.div>
      </div>

      {/* Input field */}
      <div className="px-4 mb-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <div
            className={cn(
              "flex items-center gap-2 rounded-2xl border-2 bg-card px-4 h-14 transition-colors",
              valid
                ? "border-success/50 shadow-soft"
                : "border-border focus-within:border-[#034ea2] dark:focus-within:border-[#6BA0F5]"
            )}
          >
            <span className="text-sm font-bold tabular-nums text-[#034ea2] dark:text-[#6BA0F5] tracking-wider select-none">
              {PREFIX}
            </span>
            <div className="w-px h-6 bg-border" />
            <input
              ref={inputRef}
              type="text"
              inputMode="text"
              autoComplete="off"
              value={normalizeInput(rawInput)}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="XXXXXX"
              maxLength={ID_LENGTH}
              dir="ltr"
              className="flex-1 bg-transparent outline-none text-base font-bold tabular-nums tracking-[0.2em] text-center uppercase placeholder:text-muted-foreground/50 placeholder:tracking-widest placeholder:font-normal"
              aria-label="شناسه واریز"
            />
            <AnimatePresence mode="wait">
              {valid ? (
                <motion.div
                  key="ok"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="w-7 h-7 rounded-full bg-success flex items-center justify-center"
                >
                  <Check className="w-4 h-4 text-white" />
                </motion.div>
              ) : (
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {normalizeInput(rawInput).length}/{fa(ID_LENGTH)}
                </span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Quick fill examples */}
      <div className="px-4 mb-4">
        <p className="text-[11px] text-muted-foreground mb-2 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          نمونه‌های آماده (برای تست):
        </p>
        <div className="flex gap-2 overflow-x-auto scrollbar-thin -mx-1 px-1 pb-1">
          {paymentIdExamples.map((ex) => (
            <button
              key={ex.id}
              onClick={() => handleQuickFill(ex.id)}
              className="shrink-0 px-3 py-2 rounded-xl bg-[#034ea2]/8 dark:bg-[#6BA0F5]/10 border border-[#034ea2]/15 dark:border-[#6BA0F5]/20 hover:bg-[#034ea2]/12 transition-colors"
            >
              <span className="text-xs font-bold tabular-nums text-[#034ea2] dark:text-[#6BA0F5] tracking-wider" dir="ltr">
                {ex.id}
              </span>
              <span className="block text-[10px] text-muted-foreground mt-0.5">{ex.recipient}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recipient preview card */}
      <AnimatePresence mode="wait">
        {valid && recipient && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            className="px-4 mb-4"
          >
            <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
              {/* Header */}
              <div className="p-4 bg-gradient-to-l from-[#034ea2]/8 to-transparent flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#034ea2] to-[#023069] flex items-center justify-center shadow-md">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-muted-foreground">گیرنده</p>
                  <p className="font-bold text-sm truncate">{recipient.name}</p>
                </div>
                {recipient.isKnown ? (
                  <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-success/15 text-success flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    تایید شده
                  </span>
                ) : (
                  <span className="text-[10px] font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    عمومی
                  </span>
                )}
              </div>

              {/* ID row */}
              <div className="px-4 py-2.5 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <Hash className="w-3 h-3" />
                  شناسه واریز
                </span>
                <span className="text-xs font-bold tabular-nums tracking-wider" dir="ltr">
                  {formatted}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Amount input */}
      {valid && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="px-4 mb-3"
        >
          <label className="text-[11px] text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <Wallet className="w-3 h-3" />
            مبلغ پرداخت (تومان)
          </label>
          <div className="flex items-center gap-2 rounded-2xl border-2 border-border bg-card px-4 h-14 focus-within:border-[#034ea2] dark:focus-within:border-[#6BA0F5] transition-colors">
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
          <div className="flex gap-2 mt-2 overflow-x-auto scrollbar-thin -mx-1 px-1">
            {quickAmounts.map((q) => (
              <button
                key={q}
                onClick={() => setAmount(String(q))}
                className={cn(
                  "shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium tabular-nums transition-colors",
                  amountNum === q
                    ? "bg-[#034ea2] text-white dark:bg-[#6BA0F5] dark:text-[#02224a]"
                    : "bg-muted hover:bg-accent"
                )}
              >
                {formatToman(q)}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Description input */}
      {valid && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="px-4 mb-4"
        >
          <label className="text-[11px] text-muted-foreground mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3 h-3" />
            توضیحات (اختیاری)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="مثلاً: خرید پیراهن"
            maxLength={50}
            className="w-full rounded-2xl border-2 border-border bg-card px-4 h-12 outline-none text-sm focus:border-[#034ea2] dark:focus:border-[#6BA0F5] transition-colors"
          />
        </motion.div>
      )}

      {/* Summary + CTA */}
      {valid && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-4"
        >
          {amountNum > 0 && (
            <div className="rounded-2xl bg-gradient-to-l from-[#034ea2] to-[#023069] p-4 mb-3 text-white relative overflow-hidden">
              <div className="absolute -top-8 -left-8 w-28 h-28 rounded-full bg-white/10" />
              <p className="text-[11px] text-white/70 relative z-10">مبلغ قابل پرداخت</p>
              <p className="text-2xl font-bold tabular-nums relative z-10">
                {formatToman(amountNum)}{" "}
                <span className="text-sm font-normal">تومان</span>
              </p>
            </div>
          )}

          <button
            onClick={handleConfirm}
            disabled={amountNum <= 0}
            className={cn(
              "w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
              amountNum > 0
                ? "bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white shadow-lg shadow-[#034ea2]/25"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            تایید و پرداخت
            <ArrowLeft className="w-5 h-5" />
          </button>
          <p className="text-center text-[11px] text-muted-foreground mt-2 flex items-center justify-center gap-1">
            <ChevronLeft className="w-3 h-3" />
            در صورت تایید، به صفحه وارد کردن PIN هدایت می‌شوید
          </p>
        </motion.div>
      )}
    </div>
  );
}
