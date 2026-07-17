"use client";

import { motion, AnimatePresence } from "framer-motion";
import { transactionDetails, fa, type TransactionDetail } from "@/lib/hasto-data";
import { X, Copy, Share2, Download, Check, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function TransactionDetailSheet({
  transactionId,
  onClose,
}: {
  transactionId: string | null;
  onClose: () => void;
}) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const detail: TransactionDetail | undefined = transactionId
    ? transactionDetails[transactionId] || generateFallback(transactionId)
    : undefined;

  if (!detail) return null;

  const isIncome = detail.type === "receive" || detail.type === "charge";

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(label);
    toast.success(`${label} کپی شد`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleShare = () => {
    const text = `رسید پرداخت هستو\nمبلغ: ${detail.amountText} تومان\nگیرنده: ${detail.recipient.name}\nکد پیگیری: ${detail.trackingNumber}`;
    if (navigator.share) {
      navigator.share({ title: "رسید پرداخت", text });
    } else {
      navigator.clipboard?.writeText(text);
      toast.success("رسید کپی شد");
    }
  };

  return (
    <AnimatePresence>
      {transactionId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="w-full max-w-[420px] bg-background rounded-t-3xl max-h-[92vh] overflow-y-auto scrollbar-thin"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mt-3 mb-2" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 left-3 p-1.5 rounded-full hover:bg-muted z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Status header */}
            <div
              className={cn(
                "px-6 pt-6 pb-4 text-center",
                isIncome ? "bg-success/5" : "bg-destructive/5"
              )}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12, delay: 0.1 }}
                className={cn(
                  "w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-2xl mb-3",
                  isIncome ? "bg-success/15" : "bg-destructive/15"
                )}
              >
                {detail.categoryIcon}
              </motion.div>
              <p className="text-[11px] text-muted-foreground mb-1">{detail.title}</p>
              <p
                className={cn(
                  "text-2xl font-bold tabular-nums",
                  isIncome ? "text-success" : "text-foreground"
                )}
              >
                {isIncome ? "+" : "-"}{detail.amountText}
                <span className="text-sm font-normal text-muted-foreground mr-1">تومان</span>
              </p>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  detail.status === "success" ? "bg-success" : detail.status === "pending" ? "bg-warning" : "bg-destructive"
                )} />
                <span className={cn(
                  "text-[10px] font-bold",
                  detail.status === "success" ? "text-success" : detail.status === "pending" ? "text-warning" : "text-destructive"
                )}>
                  {detail.status === "success" ? "موفق" : detail.status === "pending" ? "در انتظار" : "ناموفق"}
                </span>
                <span className="text-[10px] text-muted-foreground">• {detail.date} • {detail.time}</span>
              </div>
            </div>

            {/* Details list */}
            <div className="p-4 space-y-2">
              <h3 className="text-xs font-bold text-muted-foreground px-1 mb-1">جزئیات تراکنش</h3>

              <DetailRow
                label="کد پیگیری"
                value={detail.trackingNumber}
                copyable
                onCopy={() => handleCopy(detail.trackingNumber, "کد پیگیری")}
                copied={copiedField === "کد پیگیری"}
              />
              <DetailRow label="دسته‌بندی" value={detail.category} />
              <DetailRow label="روش پرداخت" value={detail.paymentMethod} />
              <DetailRow label="کارمزد" value={detail.feeText} />

              {/* Recipient info */}
              <div className="pt-2 mt-2 border-t border-border">
                <h3 className="text-xs font-bold text-muted-foreground px-1 mb-2">
                  {isIncome ? "پرداخت‌کننده" : "گیرنده"}
                </h3>
                <div className="p-3 rounded-xl bg-muted/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#034ea2] to-[#023069] flex items-center justify-center text-white text-sm font-bold">
                      {detail.recipient.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{detail.recipient.name}</p>
                      {detail.recipient.bank && (
                        <p className="text-[10px] text-muted-foreground">{detail.recipient.bank}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopy(detail.recipient.account, "شماره حساب")}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-card hover:bg-muted/70 transition-colors"
                  >
                    <span className="text-[10px] text-muted-foreground">شماره/حساب:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium tabular-nums" dir="ltr">{detail.recipient.account}</span>
                      {copiedField === "شماره حساب" ? (
                        <Check className="w-3 h-3 text-success" />
                      ) : (
                        <Copy className="w-3 h-3 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Description */}
              {detail.description && (
                <div className="p-3 rounded-xl bg-muted/50">
                  <p className="text-[10px] text-muted-foreground mb-1">توضیحات</p>
                  <p className="text-xs">{detail.description}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleShare}
                  className="flex-1 h-11 rounded-xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  اشتراک‌گذاری
                </button>
                <button
                  onClick={() => toast.success("رسید دانلود شد")}
                  className="px-4 h-11 rounded-xl bg-muted text-foreground font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  دانلود
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DetailRow({
  label,
  value,
  copyable,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-muted/30">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className="text-xs font-medium tabular-nums" dir="ltr">{value}</span>
        {copyable && (
          <button onClick={onCopy} className="p-1 rounded hover:bg-muted transition-colors">
            {copied ? (
              <Check className="w-3 h-3 text-success" />
            ) : (
              <Copy className="w-3 h-3 text-muted-foreground" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}

// Generate fallback detail for transactions not in the details map
function generateFallback(id: string): TransactionDetail {
  return {
    id,
    type: "withdraw",
    title: "تراکنش",
    amount: 0,
    amountText: "۰",
    date: "۱۴۰۵/۰۴/۲۵",
    time: "۱۲:۰۰",
    status: "success",
    trackingNumber: `TRK-${id.padEnd(8, "X").slice(0, 8)}`,
    description: "",
    category: "سایر",
    categoryIcon: "💳",
    categoryColor: "#64748B",
    recipient: { name: "نامشخص", account: "—" },
    fee: 0,
    feeText: "رایگان",
    paymentMethod: "کیف پول مادر",
  };
}
