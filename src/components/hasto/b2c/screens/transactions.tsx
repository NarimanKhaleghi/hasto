"use client";

import { useMemo, useState } from "react";
import {
  transactions,
  fa,
  type Transaction,
} from "@/lib/hasto-data";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Zap,
  Receipt,
  CalendarDays,
  X,
  Share2,
  TrendingUp,
  TrendingDown,
  ListChecks,
  Inbox,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type TypeFilter = "all" | "deposit" | "receive" | "charge" | "bill" | "installment";
type DateFilter = "today" | "week" | "month" | "custom";

const typeFilters: { id: TypeFilter; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "deposit", label: "واریز" },
  { id: "receive", label: "دریافت" },
  { id: "charge", label: "شارژ" },
  { id: "bill", label: "قبوض" },
  { id: "installment", label: "اقساط" },
];

const dateFilters: { id: DateFilter; label: string }[] = [
  { id: "today", label: "امروز" },
  { id: "week", label: "این هفته" },
  { id: "month", label: "این ماه" },
  { id: "custom", label: "سفارشی" },
];

// Map type → icon + tint
const typeVisual: Record<
  Transaction["type"],
  { icon: typeof Zap; tint: string }
> = {
  withdraw: {
    icon: ArrowUpRight,
    tint: "bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400",
  },
  receive: {
    icon: ArrowDownLeft,
    tint: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  charge: {
    icon: Zap,
    tint: "bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
  },
  bill: {
    icon: Receipt,
    tint: "bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
  },
  installment: {
    icon: CalendarDays,
    tint: "bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
  },
  deposit: {
    icon: ArrowDownLeft,
    tint: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
};

// Group label resolver from "date" field of transaction
const groupOf = (date: string): "today" | "yesterday" | "week" | "older" => {
  if (date === "امروز") return "today";
  if (date === "دیروز") return "yesterday";
  if (date.includes("هفته") || date.includes("روز پیش")) return "week";
  return "older";
};

const groupLabels: Record<string, string> = {
  today: "امروز",
  yesterday: "دیروز",
  week: "این هفته",
  older: "قدیمی‌تر",
};

export function TransactionsScreen() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("month");
  const [activeTx, setActiveTx] = useState<Transaction | null>(null);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      // Type filter
      if (typeFilter !== "all") {
        if (typeFilter === "deposit" && tx.type !== "withdraw") return false;
        if (typeFilter !== "deposit" && tx.type !== typeFilter) return false;
      }
      // Date filter (mock — using tx.date string)
      if (dateFilter === "today" && tx.date !== "امروز") return false;
      if (dateFilter === "week") {
        const g = groupOf(tx.date);
        if (g === "older") return false;
      }
      // Search query
      if (query.trim()) {
        const q = query.trim().toLowerCase();
        const hay = (tx.title + " " + tx.desc + " " + tx.typeLabel).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, typeFilter, dateFilter]);

  // Summary
  const totalIn = filtered
    .filter((t) => t.type === "receive" || t.type === "charge")
    .reduce((s, t) => s + t.amount, 0);
  const totalOut = filtered
    .filter((t) => t.type === "withdraw" || t.type === "bill" || t.type === "installment")
    .reduce((s, t) => s + t.amount, 0);

  // Group filtered txns
  const groups = useMemo(() => {
    const g: Record<string, Transaction[]> = {
      today: [],
      yesterday: [],
      week: [],
      older: [],
    };
    filtered.forEach((t) => g[groupOf(t.date)].push(t));
    return g;
  }, [filtered]);

  const hasAny = filtered.length > 0;

  return (
    <div className="p-4 pb-6">
      {/* ============ Summary Card ============ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-3 gap-2 mb-4"
      >
        <SummaryCell
          icon={ListChecks}
          label="تعداد"
          value={fa(filtered.length)}
          tint="bg-[#034ea2]/10 text-[#034ea2] dark:text-[#6BA0F5]"
        />
        <SummaryCell
          icon={TrendingUp}
          label="ورودی"
          value={fa(totalIn.toLocaleString("en-US"))}
          suffix="ت"
          tint="bg-success/10 text-success"
        />
        <SummaryCell
          icon={TrendingDown}
          label="خروجی"
          value={fa(totalOut.toLocaleString("en-US"))}
          suffix="ت"
          tint="bg-destructive/10 text-destructive"
        />
      </motion.div>

      {/* ============ Search ============ */}
      <div className="relative mb-3">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="جستجو در تراکنش‌ها..."
          className="w-full h-11 pr-10 pl-9 rounded-2xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#034ea2]/30 placeholder:text-muted-foreground"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute left-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-accent"
            aria-label="پاک کردن"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* ============ Type filter chips ============ */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1 mb-2 -mx-4 px-4">
        {typeFilters.map((f) => (
          <button
            key={f.id}
            onClick={() => setTypeFilter(f.id)}
            className={cn(
              "shrink-0 h-8 px-3.5 rounded-full text-xs font-semibold transition-all active:scale-95",
              typeFilter === f.id
                ? "bg-gradient-to-br from-[#034ea2] to-[#023069] text-white shadow-md"
                : "bg-card border border-border text-muted-foreground hover:border-[#034ea2]/40"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ============ Date filter chips ============ */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-2 mb-2 -mx-4 px-4">
        {dateFilters.map((f) => (
          <button
            key={f.id}
            onClick={() => setDateFilter(f.id)}
            className={cn(
              "shrink-0 h-8 px-3.5 rounded-full text-xs font-medium transition-all active:scale-95 flex items-center gap-1",
              dateFilter === f.id
                ? "bg-[#034ea2]/10 text-[#034ea2] dark:bg-[#6BA0F5]/15 dark:text-[#6BA0F5] border border-[#034ea2]/30"
                : "bg-transparent border border-border text-muted-foreground"
            )}
          >
            {f.id === "custom" && <CalendarDays className="w-3 h-3" />}
            {f.label}
          </button>
        ))}
      </div>

      {/* ============ List (grouped) ============ */}
      <AnimatePresence mode="wait">
        {!hasAny ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-16 px-4 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-base mb-1">تراکنشی یافت نشد</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              با فیلترهای انتخاب‌شده تراکنشی پیدا نشد. فیلترها را تغییر دهید یا عبارت دیگری جستجو کنید.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4 mt-2"
          >
            {(["today", "yesterday", "week", "older"] as const).map((g) => {
              const list = groups[g];
              if (!list || list.length === 0) return null;
              return (
                <div key={g}>
                  <div className="flex items-center justify-between mb-2 px-1">
                    <h3 className="text-xs font-bold text-muted-foreground">
                      {groupLabels[g]}
                    </h3>
                    <span className="text-[10px] text-muted-foreground">
                      {fa(list.length)} تراکنش
                    </span>
                  </div>
                  <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-soft">
                    {list.map((tx, i) => (
                      <TxRow
                        key={tx.id}
                        tx={tx}
                        isLast={i === list.length - 1}
                        onClick={() => setActiveTx(tx)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ Detail bottom sheet ============ */}
      <TxDetailSheet
        tx={activeTx}
        onClose={() => setActiveTx(null)}
      />
    </div>
  );
}

// ============ Summary Cell ============
function SummaryCell({
  icon: Icon,
  label,
  value,
  suffix,
  tint,
}: {
  icon: typeof ListChecks;
  label: string;
  value: string;
  suffix?: string;
  tint: string;
}) {
  return (
    <div className="rounded-2xl bg-card border border-border p-3 shadow-soft">
      <div
        className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center mb-2",
          tint
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <p className="text-[10px] text-muted-foreground mb-0.5">{label}</p>
      <p className="text-sm font-bold tabular-nums leading-tight">
        {value}
        {suffix && (
          <span className="text-[10px] font-normal text-muted-foreground mr-1">
            {suffix}
          </span>
        )}
      </p>
    </div>
  );
}

// ============ Transaction Row ============
function TxRow({
  tx,
  isLast,
  onClick,
}: {
  tx: Transaction;
  isLast: boolean;
  onClick: () => void;
}) {
  const visual = typeVisual[tx.type];
  const Icon = visual.icon;
  const isIncoming = tx.type === "receive" || tx.type === "charge";
  const isFailed = tx.status === "failed";
  const isPending = tx.status === "pending";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 hover:bg-accent/50 transition-colors text-right",
        !isLast && "border-b border-border/60"
      )}
    >
      <div
        className={cn(
          "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 relative",
          visual.tint
        )}
      >
        <Icon className="w-5 h-5" strokeWidth={2.5} />
        {tx.icon && tx.icon.length === 1 && (
          <span className="absolute -bottom-1 -left-1 text-[10px]">
            {tx.icon}
          </span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-bold text-sm truncate">{tx.title}</h4>
          <span
            className={cn(
              "text-sm font-bold tabular-nums shrink-0",
              isFailed
                ? "text-muted-foreground line-through"
                : isIncoming
                  ? "text-success"
                  : "text-destructive"
            )}
          >
            {isIncoming ? "+" : "−"}
            {fa(tx.amountText)}
            <span className="text-[10px] font-normal text-muted-foreground mr-0.5">
              ت
            </span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 mt-0.5">
          <p className="text-[11px] text-muted-foreground truncate">
            {tx.desc}
          </p>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] text-muted-foreground">
              {tx.date} • {tx.time}
            </span>
            {isPending && (
              <span className="w-1.5 h-1.5 rounded-full bg-warning animate-pulse" />
            )}
            {isFailed && (
              <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
            )}
            {!isFailed && !isPending && (
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
            )}
          </div>
        </div>
      </div>

      <ChevronLeft className="w-4 h-4 text-muted-foreground shrink-0" />
    </button>
  );
}

// ============ Detail Sheet ============
function TxDetailSheet({
  tx,
  onClose,
}: {
  tx: Transaction | null;
  onClose: () => void;
}) {
  const handleShare = () => {
    if (!tx) return;
    const text = `تراکنش هستو\n${tx.title}\n${tx.typeLabel} — ${tx.amountText} تومان\n${tx.date} ${tx.time}`;
    if (navigator.share) {
      navigator.share({ title: "رسید تراکنش", text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text);
      toast.success("اطلاعات تراکنش کپی شد");
    }
  };

  return (
    <AnimatePresence>
      {tx && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[420px] bg-card rounded-t-3xl shadow-2xl"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 left-3 w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent"
              aria-label="بستن"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-5 pb-6 pt-3">
              {/* Hero */}
              <div className="flex flex-col items-center text-center mb-4">
                <div
                  className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3",
                    typeVisual[tx.type].tint
                  )}
                >
                  {tx.icon}
                </div>
                <span className="text-[11px] text-muted-foreground mb-1">
                  {tx.typeLabel}
                </span>
                <h3 className="font-bold text-base">{tx.title}</h3>
              </div>

              {/* Amount */}
              <div className="rounded-2xl bg-muted/60 p-4 text-center mb-4">
                <p className="text-[11px] text-muted-foreground mb-1">مبلغ</p>
                <p
                  className={cn(
                    "text-2xl font-bold tabular-nums",
                    tx.type === "receive" || tx.type === "charge"
                      ? "text-success"
                      : "text-destructive"
                  )}
                >
                  {tx.type === "receive" || tx.type === "charge" ? "+" : "−"}
                  {fa(tx.amountText)}
                  <span className="text-sm font-normal text-muted-foreground mr-1">
                    تومان
                  </span>
                </p>
              </div>

              {/* Detail rows */}
              <div className="space-y-2.5">
                <DetailRow label="شرح" value={tx.desc} />
                <DetailRow label="تاریخ" value={tx.date} />
                <DetailRow label="ساعت" value={tx.time} />
                <DetailRow
                  label="شناسه تراکنش"
                  value={`HST-${tx.id}`}
                  mono
                />
                <DetailRow
                  label="وضعیت"
                  value={
                    tx.status === "success"
                      ? "موفق"
                      : tx.status === "pending"
                        ? "در انتظار"
                        : "ناموفق"
                  }
                  tone={
                    tx.status === "success"
                      ? "success"
                      : tx.status === "pending"
                        ? "warning"
                        : "destructive"
                  }
                />
              </div>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="w-full mt-5 h-11 rounded-xl bg-gradient-to-br from-[#034ea2] to-[#023069] text-white text-sm font-bold shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                اشتراک‌گذاری
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ============ Detail Row ============
function DetailRow({
  label,
  value,
  mono,
  tone,
}: {
  label: string;
  value: string;
  mono?: boolean;
  tone?: "success" | "warning" | "destructive";
}) {
  const toneClass = tone
    ? tone === "success"
      ? "text-success"
      : tone === "warning"
        ? "text-warning"
        : "text-destructive"
    : "text-foreground";

  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-sm font-semibold tabular-nums",
          toneClass,
          mono && "font-mono text-xs"
        )}
      >
        {value}
      </span>
    </div>
  );
}
