"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/hasto-store";
import { bills as initialBills, fa, type Bill } from "@/lib/hasto-data";
import { SectionCard, StatusBadge, EmptyState } from "@/components/hasto/shared/ui";
import {
  motion,
  AnimatePresence,
} from "framer-motion";
import {
  CheckCircle2,
  ReceiptText,
  CalendarClock,
  Wallet,
  Layers,
  Check,
  PartyPopper,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Background tint per bill type (for the icon circle)
const tintByType: Record<string, string> = {
  "قبض برق": "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  "قبض گاز": "bg-orange-100 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
  "قبض آب": "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
  "قبض تلفن": "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  "اینترنت": "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
};

export function BillsScreen() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);
  const [localBills, setLocalBills] = useState<Bill[]>(initialBills);
  const [showAllPaid, setShowAllPaid] = useState(false);
  const [confirmAll, setConfirmAll] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);

  const visibleBills = showAllPaid
    ? localBills.map((b) => ({ ...b, status: "paid" as const }))
    : localBills;

  const pendingBills = visibleBills.filter((b) => b.status !== "paid");
  const paidBills = visibleBills.filter((b) => b.status === "paid");

  // Total amount — parse Persian number string into numeric
  const parseFaNumber = (s: string) =>
    parseInt(s.replace(/[^\d]/g, ""), 10) || 0;

  const totalPending = pendingBills.reduce(
    (sum, b) => sum + parseFaNumber(b.amount),
    0
  );

  const totalAll = visibleBills.reduce(
    (sum, b) => sum + parseFaNumber(b.amount),
    0
  );

  // Nearest due date (first pending)
  const nearestDue = pendingBills[0]?.dueDate ?? "—";

  const handlePay = (bill: Bill) => {
    setPayingId(bill.id);
    setTimeout(() => {
      setLocalBills((prev) =>
        prev.map((b) => (b.id === bill.id ? { ...b, status: "paid" as const } : b))
      );
      setPayingId(null);
      toast.success("قبض پرداخت شد", {
        description: `${bill.type} — ${bill.amount} تومان`,
      });
    }, 900);
  };

  const handlePayAll = () => {
    setConfirmAll(false);
    pendingBills.forEach((b, i) => {
      setTimeout(() => {
        setLocalBills((prev) =>
          prev.map((bb) =>
            bb.id === b.id ? { ...bb, status: "paid" as const } : bb
          )
        );
        if (i === pendingBills.length - 1) {
          toast.success("همه قبوض پرداخت شد", {
            description: `${fa(pendingBills.length)} قبض — ${fa(
              totalPending.toLocaleString("en-US")
            )} تومان`,
          });
        }
      }, i * 250);
    });
  };

  const allPaid = paidBills.length === visibleBills.length;

  return (
    <div className="p-4 pb-28">
      {/* ============ Summary Card ============ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-5 shadow-2xl shadow-[#034ea2]/20 wallet-gradient mb-4"
      >
        <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -right-8 w-40 h-40 rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
                <ReceiptText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-xs">خلاصه قبوض</p>
                <p className="text-white font-bold text-sm">مدیریت یک‌جا</p>
              </div>
            </div>
            <button
              onClick={() => setShowAllPaid((v) => !v)}
              className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-[11px] text-white font-medium"
            >
              {showAllPaid ? "نمایش واقعی" : "حالت همه پرداخت شده"}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <SummaryStat
              icon={Layers}
              label="تعداد قبوض"
              value={fa(visibleBills.length)}
              suffix="قبض"
            />
            <SummaryStat
              icon={Wallet}
              label="مجموع مبلغ"
              value={fa(totalAll.toLocaleString("en-US"))}
              suffix="تومان"
            />
            <SummaryStat
              icon={CalendarClock}
              label="نزدیک‌ترین سررسید"
              value={nearestDue}
              isText
            />
          </div>
        </div>
      </motion.div>

      {/* ============ Empty state ============ */}
      <AnimatePresence mode="wait">
        {allPaid ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <SectionCard className="overflow-hidden">
              <EmptyState
                icon={PartyPopper}
                title="همه قبوض پرداخت شد"
                description="شما هیچ قبض معوقه‌ای ندارید. عالی!"
                action={
                  <button
                    onClick={() => setB2CScreen("dashboard")}
                    className="px-5 h-10 rounded-xl bg-gradient-to-br from-[#034ea2] to-[#023069] text-white text-sm font-bold shadow-md active:scale-95 transition-transform"
                  >
                    بازگشت به خانه
                  </button>
                }
              />
            </SectionCard>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {/* Pending section */}
            {pendingBills.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2 px-1">
                  <h3 className="text-sm font-bold text-muted-foreground">
                    در انتظار پرداخت
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {fa(pendingBills.length)} قبض
                  </span>
                </div>
                <div className="space-y-3">
                  {pendingBills.map((bill, idx) => (
                    <BillCard
                      key={bill.id}
                      bill={bill}
                      onPay={() => handlePay(bill)}
                      paying={payingId === bill.id}
                      index={idx}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Paid section */}
            {paidBills.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2 px-1">
                  <h3 className="text-sm font-bold text-muted-foreground">
                    پرداخت شده
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    {fa(paidBills.length)} قبض
                  </span>
                </div>
                <div className="space-y-3">
                  {paidBills.map((bill, idx) => (
                    <BillCard
                      key={bill.id}
                      bill={bill}
                      onPay={() => handlePay(bill)}
                      paying={payingId === bill.id}
                      index={idx}
                      dimmed
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ Floating Pay All ============ */}
      <AnimatePresence>
        {!allPaid && pendingBills.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-[402px]"
          >
            <button
              onClick={() => setConfirmAll(true)}
              className="w-full flex items-center justify-between px-5 h-13 py-3.5 rounded-2xl shadow-glow bg-gradient-to-br from-[#034ea2] to-[#023069] text-white active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold text-sm">پرداخت همه</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm">
                <span className="text-white/70 text-xs">
                  {fa(pendingBills.length)} قبض
                </span>
                <span className="font-bold tabular-nums">
                  {fa(totalPending.toLocaleString("en-US"))} تومان
                </span>
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ Confirm Pay All ============ */}
      <AlertDialog open={confirmAll} onOpenChange={setConfirmAll}>
        <AlertDialogContent className="max-w-[340px]">
          <AlertDialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-[#034ea2]/10 flex items-center justify-center mx-auto mb-2">
              <AlertCircle className="w-6 h-6 text-[#034ea2]" />
            </div>
            <AlertDialogTitle className="text-center">
              پرداخت همه قبوض
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              {fa(pendingBills.length)} قبض به مبلغ مجموع{" "}
              <span className="font-bold text-foreground">
                {fa(totalPending.toLocaleString("en-US"))} تومان
              </span>{" "}
              پرداخت می‌شود. ادامه می‌دهید؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel className="flex-1 h-11 rounded-xl">
              انصراف
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePayAll}
              className="flex-1 h-11 rounded-xl bg-gradient-to-br from-[#034ea2] to-[#023069] text-white"
            >
              پرداخت
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============ Summary Stat ============
function SummaryStat({
  icon: Icon,
  label,
  value,
  suffix,
  isText,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  suffix?: string;
  isText?: boolean;
}) {
  return (
    <div className="bg-white/10 rounded-2xl p-3 backdrop-blur-sm">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Icon className="w-3.5 h-3.5 text-white/70" />
        <span className="text-[10px] text-white/70 leading-tight">{label}</span>
      </div>
      <p
        className={cn(
          "text-white font-bold tabular-nums leading-tight",
          isText ? "text-base" : "text-base"
        )}
      >
        {value}
      </p>
      {suffix && (
        <p className="text-[10px] text-white/60 mt-0.5">{suffix}</p>
      )}
    </div>
  );
}

// ============ Bill Card ============
function BillCard({
  bill,
  onPay,
  paying,
  index,
  dimmed,
}: {
  bill: Bill;
  onPay: () => void;
  paying: boolean;
  index: number;
  dimmed?: boolean;
}) {
  const tint = tintByType[bill.type] ?? "bg-muted text-muted-foreground";
  const isPaid = bill.status === "paid";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.25) }}
      whileTap={{ scale: 0.99 }}
    >
      <SectionCard
        className={cn(
          "overflow-hidden transition-opacity",
          dimmed && "opacity-60"
        )}
        noPadding
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0",
                tint
              )}
            >
              {bill.icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-bold text-sm truncate">{bill.type}</h3>
                <StatusBadge
                  status={
                    bill.status === "paid"
                      ? "paid"
                      : bill.status === "overdue"
                        ? "overdue"
                        : "pending"
                  }
                  label={
                    bill.status === "paid"
                      ? "پرداخت شده"
                      : bill.status === "overdue"
                        ? "معوقه"
                        : "در انتظار"
                  }
                />
              </div>

              <div className="flex items-end justify-between gap-2 mt-2">
                <div>
                  <p className="text-[11px] text-muted-foreground mb-0.5">
                    مبلغ قابل پرداخت
                  </p>
                  <p className="text-xl font-bold tabular-nums text-foreground">
                    {bill.amount}
                    <span className="text-xs font-normal text-muted-foreground mr-1">
                      تومان
                    </span>
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <CalendarClock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">
                      سررسید: {bill.dueDate}
                    </span>
                  </div>
                </div>

                {/* Pay button */}
                {!isPaid && (
                  <button
                    onClick={onPay}
                    disabled={paying}
                    className="shrink-0 h-10 px-4 rounded-xl bg-gradient-to-br from-[#034ea2] to-[#023069] text-white text-sm font-bold shadow-md active:scale-95 transition-transform disabled:opacity-70 disabled:active:scale-100 flex items-center gap-1.5"
                  >
                    {paying ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        در حال پرداخت
                      </>
                    ) : (
                      <>
                        پرداخت
                      </>
                    )}
                  </button>
                )}
                {isPaid && (
                  <div className="shrink-0 flex items-center gap-1 h-10 px-3 rounded-xl bg-success/10 text-success text-xs font-bold">
                    <Check className="w-4 h-4" />
                    انجام شد
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </motion.div>
  );
}
