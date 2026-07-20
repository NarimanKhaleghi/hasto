"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Share2,
  Trash2,
  Edit,
  Check,
  Link2,
  QrCode,
  Hash,
  X,
  FileText,
  Calendar,
  Wallet,
  Repeat,
  CreditCard,
  History,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAppStore } from "@/lib/hasto-store";
import { contracts, fa } from "@/lib/hasto-data";
import { StatusBadge, ProgressBar } from "@/components/hasto/shared/ui";

const STATUS_META: Record<
  "active" | "expired" | "pending",
  { label: string; status: "active" | "expired" | "pending" }
> = {
  active: { label: "فعال", status: "active" },
  expired: { label: "منقضی شده", status: "expired" },
  pending: { label: "در انتظار", status: "pending" },
};

// Mock progress derived deterministically from contract id (for BNPL/loan types)
function getProgress(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return 30 + (h % 60); // 30..89
}

export function ContractDetailScreen() {
  const activeContractId = useAppStore((s) => s.activeContractId);
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);
  const goBack = useAppStore((s) => s.goBack);

  const [cancelOpen, setCancelOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const contract = contracts.find((c) => c.id === activeContractId);

  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="font-bold text-base mb-1">قراردادی یافت نشد</h3>
        <p className="text-sm text-muted-foreground mb-5 max-w-xs">
          ممکن است قرارداد حذف شده باشد یا شناسه نامعتبر باشد.
        </p>
        <button
          onClick={() => setB2CScreen("contracts")}
          className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-[#034ea2] text-white font-bold text-sm shadow-md shadow-[#034ea2]/30 active:scale-95 transition-transform"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت به قراردادها
        </button>
      </div>
    );
  }

  const meta = STATUS_META[contract.status];
  const isLoan = contract.type === "bnpl" || contract.type === "auto_bill";
  const progress = getProgress(contract.id);
  const subtitle = contract.recipient ?? contract.provider;

  const rows: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
    show?: boolean;
  }[] = [
    { icon: FileText, label: "نوع قرارداد", value: contract.typeLabel, show: true },
    { icon: Wallet, label: "مبلغ", value: contract.amount, show: true },
    { icon: Repeat, label: "دوره پرداخت", value: contract.period, show: true },
    { icon: Calendar, label: "تاریخ شروع", value: contract.startDate, show: true },
    { icon: Calendar, label: "تاریخ انقضا", value: contract.expiryDate, show: true },
    { icon: CreditCard, label: "شماره حساب", value: contract.account ?? "—", show: contract.type === "direct_debit" },
    { icon: History, label: "آخرین پرداخت", value: contract.lastPayment ?? "—", show: !!contract.lastPayment },
    { icon: Clock, label: "پرداخت بعدی", value: contract.nextPayment ?? "—", show: !!contract.nextPayment },
  ];

  const copyText = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    toast.success(`${label} کپی شد`, {
      description: text.length > 50 ? text.slice(0, 50) + "…" : text,
    });
  };

  const shareOptions = [
    {
      id: "link",
      icon: Link2,
      label: "لینک مستقیم",
      desc: "hasto.to/c/" + contract.id.toLowerCase(),
      value: `https://hasto.to/c/${contract.id.toLowerCase()}`,
    },
    {
      id: "qr",
      icon: QrCode,
      label: "QR کد",
      desc: "کد قابل اسکن برای مشاهده",
      value: `hasto-qr:${contract.id}`,
    },
    {
      id: "id",
      icon: Hash,
      label: "شناسه قرارداد",
      desc: contract.id,
      value: contract.id,
    },
  ];

  return (
    <div className="pb-28 px-4 pt-4">
      {/* Header card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-5 shadow-2xl shadow-[#034ea2]/20 wallet-gradient"
      >
        <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -right-8 w-48 h-48 rounded-full bg-white/5" />
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-lg"
              style={{
                backgroundColor: "rgba(255,255,255,0.18)",
                boxShadow: `inset 0 0 0 2px ${contract.color}66`,
              }}
            >
              <span>{contract.icon}</span>
            </div>
            <StatusBadge
              status={meta.status}
              label={meta.label}
              className="bg-white/20 text-white"
            />
          </div>
          <p className="text-white/70 text-xs font-medium mb-1">{contract.id}</p>
          <h2 className="text-lg font-extrabold text-white leading-tight mb-1">
            {contract.name}
          </h2>
          <p className="text-white/80 text-sm">{subtitle}</p>
        </div>
      </motion.div>

      {/* Progress (for BNPL / loan-like types) */}
      {isLoan && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mt-4 rounded-2xl bg-card border border-border shadow-soft p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#034ea2]/10 text-[#034ea2] dark:text-[#6BA0F5] flex items-center justify-center">
                <Repeat className="w-4 h-4" />
              </div>
              <span className="font-bold text-sm">پیشرفت بازپرداخت</span>
            </div>
            <span className="font-extrabold text-sm tabular-nums text-[#034ea2] dark:text-[#6BA0F5]">
              {fa(progress)}٪
            </span>
          </div>
          <ProgressBar value={progress} />
          <p className="text-[11px] text-muted-foreground mt-2">
            {progress >= 70 ? "آخرین اقساط در حال پرداخت است" : "اقساط طبق برنامه پرداخت می‌شود"}
          </p>
        </motion.div>
      )}

      {/* Info card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="mt-4 rounded-2xl bg-card border border-border shadow-soft overflow-hidden"
      >
        <div className="px-4 pt-4 pb-2">
          <h3 className="font-bold text-sm">جزئیات قرارداد</h3>
        </div>
        <div className="divide-y divide-border">
          {rows
            .filter((r) => r.show)
            .map((r) => (
              <div key={r.label} className="flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-muted/70 flex items-center justify-center text-muted-foreground">
                  <r.icon className="w-4 h-4" />
                </div>
                <span className="text-xs text-muted-foreground flex-1">{r.label}</span>
                <span className="font-bold text-sm tabular-nums">{r.value}</span>
              </div>
            ))}
        </div>
      </motion.div>

      {/* Action buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
        className="mt-4 space-y-2.5"
      >
        <button
          onClick={() => setShareOpen(true)}
          className="w-full h-12 rounded-xl bg-gradient-to-br from-[#034ea2] to-[#023069] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-[#034ea2]/30 active:scale-[0.98] transition-transform"
        >
          <Share2 className="w-4 h-4" />
          اشتراک‌گذاری قرارداد
        </button>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={() => toast.info("ویرایش قرارداد در نسخه نهایی فعال خواهد بود")}
            className="h-12 rounded-xl bg-card border border-border font-bold text-sm flex items-center justify-center gap-2 hover:border-[#034ea2]/40 transition-colors active:scale-[0.98]"
          >
            <Edit className="w-4 h-4" />
            ویرایش
          </button>
          <button
            onClick={() => setCancelOpen(true)}
            className="h-12 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive font-bold text-sm flex items-center justify-center gap-2 hover:bg-destructive/15 transition-colors active:scale-[0.98]"
          >
            <Trash2 className="w-4 h-4" />
            لغو قرارداد
          </button>
        </div>
        <button
          onClick={goBack}
          className="w-full h-11 rounded-xl text-muted-foreground hover:text-foreground font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت
        </button>
      </motion.div>

      {/* Cancel confirmation dialog */}
      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="max-w-[340px]">
          <DialogHeader>
            <div className="flex justify-center mb-2">
              <div className="w-12 h-12 rounded-2xl bg-destructive/15 text-destructive flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
            <DialogTitle className="text-center">لغو قرارداد</DialogTitle>
          </DialogHeader>
          <p className="text-center text-sm text-muted-foreground -mt-2">
            آیا از لغو قرارداد <b className="text-foreground">«{contract.name}»</b> مطمئن هستید؟
            این عمل قابل بازگشت نیست و در صورت لغو، پرداخت‌های خودکار متوقف می‌شوند.
          </p>
          <DialogFooter className="flex-row gap-2 sm:gap-2">
            <button
              onClick={() => setCancelOpen(false)}
              className="flex-1 h-11 rounded-xl border border-border font-bold text-sm hover:bg-muted transition-colors"
            >
              انصراف
            </button>
            <button
              onClick={() => {
                setCancelOpen(false);
                toast.success("درخواست لغو قرارداد ثبت شد", {
                  description: "تیم پشتیبانی در اسرع وقت بررسی خواهد کرد.",
                });
                setTimeout(() => {
                  setB2CScreen("contracts");
                }, 800);
              }}
              className="flex-1 h-11 rounded-xl bg-destructive text-white font-bold text-sm hover:bg-destructive/90 transition-colors"
            >
              بله، لغو شود
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share bottom sheet */}
      <ShareSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        options={shareOptions}
        onCopy={(opt) => {
          copyText(opt.value, opt.label);
        }}
      />
    </div>
  );
}

// ---------------- Share Sheet ----------------
type ShareOption = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  desc: string;
  value: string;
};

function ShareSheet({
  open,
  onClose,
  options,
  onCopy,
}: {
  open: boolean;
  onClose: () => void;
  options: ShareOption[];
  onCopy: (opt: ShareOption) => void;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (opt: ShareOption) => {
    onCopy(opt);
    setCopiedId(opt.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 w-full max-w-[420px] mx-auto z-50 rounded-t-3xl bg-card border-t border-border shadow-2xl pb-6"
          >
            <div className="pt-3 flex justify-center">
              <div className="w-10 h-1.5 rounded-full bg-muted" />
            </div>
            <div className="flex items-center justify-between px-5 pt-3 pb-2">
              <h3 className="font-bold text-base">اشتراک‌گذاری قرارداد</h3>
              <button
                onClick={onClose}
                aria-label="بستن"
                className="w-8 h-8 rounded-full bg-muted/70 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 space-y-2">
              {options.map((opt) => {
                const isCopied = copiedId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleCopy(opt)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-2xl border transition-all active:scale-[0.98]",
                      isCopied
                        ? "bg-success/10 border-success/40"
                        : "bg-card border-border hover:border-[#034ea2]/40"
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                        isCopied
                          ? "bg-success text-white"
                          : "bg-[#034ea2]/10 text-[#034ea2] dark:text-[#6BA0F5]"
                      )}
                    >
                      {isCopied ? <Check className="w-5 h-5" /> : <opt.icon className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 text-right min-w-0">
                      <p className="font-bold text-sm">{opt.label}</p>
                      <p className="text-xs text-muted-foreground truncate" dir="ltr">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
              <p className="text-center text-[11px] text-muted-foreground pt-1">
                با انتخاب هر گزینه، محتوا در کلیپ‌بورد کپی می‌شود.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
