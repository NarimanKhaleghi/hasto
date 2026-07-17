"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/hasto-store";
import { user, fa, formatToman, cardPrefixes } from "@/lib/hasto-data";
import {
  Smartphone,
  CreditCard,
  Landmark,
  Check,
  Wallet,
  ChevronLeft,
  ShieldCheck,
  PencilLine,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const QUICK_AMOUNTS = [
  { label: "۵۰ هزار", value: 50000 },
  { label: "۱۰۰ هزار", value: 100000 },
  { label: "۵۰۰ هزار", value: 500000 },
  { label: "۱ میلیون", value: 1000000 },
  { label: "۵ میلیون", value: 5000000 },
];

export function TransferConfirmScreen() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);
  const { transferContext, setTransferContext } = useAppStore();

  const [amount, setAmount] = useState<string>(
    transferContext?.amount ? String(transferContext.amount) : ""
  );
  const [description, setDescription] = useState<string>(transferContext?.description ?? "");
  const descRef = useRef<HTMLTextAreaElement>(null);

  // Fallback context (in case user navigated directly)
  const ctx = useMemo(() => {
    if (transferContext) return transferContext;
    return {
      recipientName: "گیرنده",
      recipientNumber: "—",
      recipientType: "mobile" as const,
      bank: undefined,
      amount: 0,
      amountText: "",
    };
  }, [transferContext]);

  const amountNum = parseInt(amount.replace(/\D/g, "") || "0", 10);
  const balance = user.wallet.balance;
  const insufficient = amountNum > balance;
  const canProceed = amountNum > 0 && !insufficient;

  // Re-derive bank logo color from context number if missing
  const bankLogo = useMemo(() => {
    if (ctx.bank) return ctx.bank;
    if (ctx.recipientType === "card") {
      const clean = ctx.recipientNumber.replace(/[\s_-]/g, "");
      if (clean.length >= 6) {
        const prefix = `${clean.slice(0, 4)}-${clean.slice(4, 6)}`;
        return cardPrefixes[prefix];
      }
    }
    return undefined;
  }, [ctx]);

  const handleAmountChange = (raw: string) => {
    const digits = raw.replace(/\D/g, "");
    // Cap at 12 digits
    setAmount(digits.slice(0, 12));
  };

  const handleQuick = (value: number) => {
    setAmount(String(value));
    toast.success(`${formatToman(value)} تومان اضافه شد`);
  };

  const handleConfirm = () => {
    if (!canProceed) return;
    setTransferContext({
      ...ctx,
      amount: amountNum,
      amountText: formatToman(amountNum),
      description: description.trim() || undefined,
    });
    setB2CScreen("transfer-pin");
  };

  // Format amount with grouping for display
  const formattedAmount = useMemo(() => {
    if (!amount) return "";
    return fa(parseInt(amount, 10).toLocaleString("en-US"));
  }, [amount]);

  return (
    <div className="pb-32 min-h-full">
      {/* Recipient card */}
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-5 shadow-soft bg-card border border-border"
        >
          <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-[#034ea2]/8 blur-2xl" />
          <div className="relative z-10 flex items-center gap-3">
            <RecipientAvatar bank={bankLogo} type={ctx.recipientType} />
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-muted-foreground">گیرنده</p>
              <p className="font-bold text-base truncate">{ctx.recipientName}</p>
              <p className="text-xs text-muted-foreground tabular-nums truncate mt-0.5" dir="ltr">
                {ctx.recipientNumber}
              </p>
              {bankLogo && (
                <p className="text-[11px] text-[#034ea2] dark:text-[#6BA0F5] font-medium mt-0.5">
                  بانک {bankLogo}
                </p>
              )}
            </div>
            <button
              onClick={() => setB2CScreen("transfer")}
              className="shrink-0 flex items-center gap-1 px-3 h-8 rounded-full bg-muted/60 hover:bg-muted text-xs font-medium text-[#034ea2] dark:text-[#6BA0F5] transition-colors"
            >
              تغییر
              <ChevronLeft className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Amount entry */}
      <div className="px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-3xl bg-card border border-border shadow-soft p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Wallet className="w-4 h-4 text-[#034ea2] dark:text-[#6BA0F5]" />
            <h3 className="font-bold text-sm">مبلغ انتقال</h3>
          </div>

          {/* Large amount input */}
          <div
            className={cn(
              "relative rounded-2xl border-2 transition-all overflow-hidden",
              insufficient
                ? "border-destructive/40 bg-destructive/5"
                : amount
                ? "border-[#034ea2]/40 bg-[#034ea2]/5 dark:border-[#6BA0F5]/40 dark:bg-[#6BA0F5]/5"
                : "border-border bg-muted/30"
            )}
          >
            <input
              value={formattedAmount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="۰"
              inputMode="numeric"
              dir="ltr"
              className="w-full bg-transparent text-center text-3xl font-bold tabular-nums py-5 outline-none placeholder:text-muted-foreground/40 placeholder:font-bold"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              تومان
            </span>
          </div>

          {/* Insufficient balance warning */}
          {insufficient && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-2 mt-3 px-3 py-2 rounded-xl bg-destructive/10 text-destructive text-xs font-medium"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              موجودی کافی نیست — کسر {formatToman(amountNum - balance)} تومان
            </motion.div>
          )}

          {/* Quick amounts */}
          <div className="mt-4">
            <p className="text-[11px] text-muted-foreground mb-2">مبالغ سریع</p>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_AMOUNTS.map((q) => {
                const active = amount === String(q.value);
                return (
                  <button
                    key={q.value}
                    onClick={() => handleQuick(q.value)}
                    className={cn(
                      "h-10 rounded-xl text-xs font-bold tabular-nums transition-all active:scale-95 border",
                      active
                        ? "bg-[#034ea2] text-white border-[#034ea2] shadow-md"
                        : "bg-muted/50 text-foreground border-transparent hover:bg-muted"
                    )}
                  >
                    {q.label}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 rounded-3xl bg-card border border-border shadow-soft p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <PencilLine className="w-4 h-4 text-[#034ea2] dark:text-[#6BA0F5]" />
            <h3 className="font-bold text-sm">توضیحات (اختیاری)</h3>
          </div>
          <textarea
            ref={descRef}
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 120))}
            placeholder="مثلا: شهریه، اجاره، بازپرداخت..."
            rows={2}
            className="w-full rounded-2xl bg-muted/40 p-3 text-sm outline-none resize-none focus:bg-muted transition-colors placeholder:text-muted-foreground/70"
          />
          <div className="flex justify-end mt-1">
            <span className="text-[10px] text-muted-foreground tabular-nums">
              {fa(description.length)} / {fa(120)}
            </span>
          </div>
        </motion.div>

        {/* Security note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 mt-4 px-4 py-3 rounded-2xl bg-success/8 border border-success/15"
        >
          <ShieldCheck className="w-4 h-4 text-success shrink-0" />
          <p className="text-[11px] text-success/90 leading-relaxed">
            انتقال با رمز یک‌بار مصرف تایید می‌شود. اطلاعات گیرنده را بررسی کنید.
          </p>
        </motion.div>
      </div>

      {/* Balance + confirm bar */}
      <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-30 max-w-[420px] w-full px-4 pb-3 pt-3 bg-gradient-to-t from-background via-background/95 to-transparent">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[11px] text-muted-foreground">موجودی کیف پول</span>
          <span className="text-xs font-bold tabular-nums">
            {fa(balance.toLocaleString("en-US"))} <span className="text-muted-foreground font-normal">تومان</span>
          </span>
        </div>
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={handleConfirm}
          disabled={!canProceed}
          className={cn(
            "w-full h-14 rounded-2xl font-bold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95",
            canProceed
              ? "bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white shadow-[#034ea2]/30"
              : "bg-muted text-muted-foreground shadow-none cursor-not-allowed"
          )}
        >
          <span>تایید پرداخت</span>
          {canProceed && (
            <span className="text-sm tabular-nums opacity-90">
              {formattedAmount ? `${formattedAmount} تومان` : ""}
            </span>
          )}
          {canProceed && <Check className="w-5 h-5" />}
        </motion.button>
      </div>
    </div>
  );
}

// ==================== Recipient Avatar ====================
function RecipientAvatar({
  bank,
  type,
}: {
  bank?: string;
  type: "mobile" | "card" | "sheba" | "id" | "qr" | "nfc" | "shop";
}) {
  if (type === "card" && bank) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#034ea2] to-[#023069] flex items-center justify-center text-white shadow-md shrink-0">
        <CreditCard className="w-6 h-6" />
      </div>
    );
  }
  if (type === "sheba") {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white shadow-md shrink-0">
        <Landmark className="w-6 h-6" />
      </div>
    );
  }
  return (
    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white shadow-md shrink-0">
      <Smartphone className="w-6 h-6" />
    </div>
  );
}
