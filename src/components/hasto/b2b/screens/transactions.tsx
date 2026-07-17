"use client";

import { useState } from "react";
import { business, fa } from "@/lib/hasto-data";
import { SectionCard, StatusBadge } from "@/components/hasto/shared/ui";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Search,
  Download,
  FileText,
  Calendar,
  X,
  ShoppingBag,
  Phone,
  CheckCircle2,
  TrendingUp,
  Hash,
  Filter,
  ChevronDown,
} from "lucide-react";

type Filter = "all" | "success" | "pending" | "failed";

export function B2BTransactionsScreen() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [activeTx, setActiveTx] = useState<string | null>(null);

  const statusMap: Record<string, "success" | "pending" | "failed"> = {
    "موفق": "success",
    "در انتظار": "pending",
    "ناموفق": "failed",
  };

  const filtered = business.recentPayments.filter((p) => {
    if (filter !== "all" && statusMap[p.status] !== filter) return false;
    if (search && !p.buyer.includes(search) && !p.product.includes(search)) return false;
    return true;
  });

  const todayCount = business.recentPayments.filter((p) => p.date === "امروز").length;
  const todayAmount = business.recentPayments
    .filter((p) => p.date === "امروز")
    .reduce((s, p) => s + p.amountValue, 0);
  const successRate = Math.round(
    (business.recentPayments.filter((p) => p.status === "موفق").length / business.recentPayments.length) * 100
  );

  return (
    <div className="pb-4">
      {/* Summary */}
      <div className="px-4 pt-4 grid grid-cols-3 gap-2">
        {[
          { label: "تعداد امروز", value: fa(todayCount), icon: Hash, color: "#034ea2" },
          { label: "مبلغ امروز", value: fa(todayAmount.toLocaleString()), icon: TrendingUp, color: "#16a34a" },
          { label: "نرخ موفقیت", value: `${fa(successRate)}٪`, icon: CheckCircle2, color: "#8B5CF6" },
        ].map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-3 bg-card border border-border shadow-soft text-center"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2"
              style={{ background: `${s.color}15` }}
            >
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <p className="font-bold text-sm tabular-nums leading-tight">{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="px-4 mt-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی مشتری یا محصول..."
            className="w-full h-11 pr-10 pl-4 rounded-2xl bg-muted border border-border focus:border-[#034ea2] outline-none text-sm transition-colors"
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="px-4 mt-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: "all" as const, label: "همه" },
            { id: "success" as const, label: "موفق" },
            { id: "pending" as const, label: "در انتظار" },
            { id: "failed" as const, label: "ناموفق" },
          ].map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "px-4 h-9 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                  active
                    ? "bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white shadow-glow"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {f.label}
              </button>
            );
          })}
          <button
            onClick={() => setShowDateFilter(!showDateFilter)}
            className={cn(
              "px-3 h-9 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all",
              showDateFilter
                ? "bg-info text-white"
                : "bg-muted text-muted-foreground"
            )}
          >
            <Calendar className="w-3.5 h-3.5" />
            بازه تاریخ
            <ChevronDown className={cn("w-3 h-3 transition-transform", showDateFilter && "rotate-180")} />
          </button>
        </div>

        <AnimatePresence>
          {showDateFilter && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 grid grid-cols-2 gap-2 p-3 rounded-2xl bg-muted/50 border border-border">
                <div>
                  <p className="text-[11px] text-muted-foreground mb-1">از تاریخ</p>
                  <input
                    type="text"
                    placeholder="۱۴۰۵/۰۱/۰۱"
                    className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm tabular-nums outline-none focus:border-[#034ea2]"
                    dir="ltr"
                  />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground mb-1">تا تاریخ</p>
                  <input
                    type="text"
                    placeholder="۱۴۰۵/۰۱/۳۱"
                    className="w-full h-10 px-3 rounded-xl bg-background border border-border text-sm tabular-nums outline-none focus:border-[#034ea2]"
                    dir="ltr"
                  />
                </div>
                <button
                  onClick={() => {
                    toast.success("فیلتر اعمال شد");
                    setShowDateFilter(false);
                  }}
                  className="col-span-2 h-10 rounded-xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white text-sm font-bold"
                >
                  اعمال فیلتر
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <div className="px-4 mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => toast.success("گزارش CSV دانلود شد")}
          className="h-12 rounded-2xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white font-bold flex items-center justify-center gap-2 shadow-glow active:scale-[0.98] transition-transform"
        >
          <Download className="w-4 h-4" />
          دانلود گزارش (CSV)
        </button>
        <button
          onClick={() => toast.success("صورتحساب آماده شد")}
          className="h-12 rounded-2xl bg-card border-2 border-[#034ea2]/20 text-[#034ea2] dark:text-[#6BA0F5] font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <FileText className="w-4 h-4" />
          صورتحساب
        </button>
      </div>

      {/* Transactions list */}
      <div className="px-4 mt-4">
        <SectionCard
          title={`تراکنش‌ها (${fa(filtered.length)})`}
          icon={ShoppingBag}
          noPadding
        >
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">تراکنشی یافت نشد</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((p, i) => (
                <motion.button
                  key={p.id}
                  onClick={() => setActiveTx(p.id)}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-right hover:bg-accent/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#034ea2]/10 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-5 h-5 text-[#034ea2] dark:text-[#6BA0F5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm truncate">{p.buyer}</p>
                      <StatusBadge status={statusMap[p.status]} label={p.status} />
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {p.product} • {p.buyerPhone}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{p.date} • {p.time}</p>
                  </div>
                  <div className="text-left shrink-0">
                    <p className="font-bold text-sm tabular-nums">{p.amount}</p>
                    <p className="text-[10px] text-muted-foreground">تومان</p>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      <AnimatePresence>
        {activeTx && (
          <TransactionDetailSheet
            txId={activeTx}
            onClose={() => setActiveTx(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TransactionDetailSheet({
  txId,
  onClose,
}: {
  txId: string;
  onClose: () => void;
}) {
  const tx = business.recentPayments.find((p) => p.id === txId);
  if (!tx) return null;
  const statusMap: Record<string, "success" | "pending" | "failed"> = {
    "موفق": "success",
    "در انتظار": "pending",
    "ناموفق": "failed",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] bg-background rounded-t-3xl p-5 pb-8 max-h-[88vh] overflow-y-auto scrollbar-thin"
      >
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base">جزئیات تراکنش</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status header */}
        <div className="flex flex-col items-center text-center mb-4">
          <div
            className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mb-2",
              tx.status === "موفق"
                ? "bg-success/15"
                : tx.status === "در انتظار"
                ? "bg-warning/15"
                : "bg-destructive/15"
            )}
          >
            {tx.status === "موفق" ? (
              <CheckCircle2 className="w-8 h-8 text-success" />
            ) : (
              <ShoppingBag
                className={cn(
                  "w-8 h-8",
                  tx.status === "در انتظار" ? "text-warning" : "text-destructive"
                )}
              />
            )}
          </div>
          <p className="font-bold text-lg tabular-nums">{tx.amount}</p>
          <p className="text-xs text-muted-foreground">تومان</p>
          <div className="mt-2">
            <StatusBadge status={statusMap[tx.status]} label={tx.status} />
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <DetailRow icon={ShoppingBag} label="محصول" value={tx.product} />
          <DetailRow icon={Phone} label="مشتری" value={tx.buyer} />
          <DetailRow icon={Phone} label="موبایل" value={tx.buyerPhone} ltr />
          <DetailRow icon={Calendar} label="تاریخ" value={tx.date} />
          <DetailRow icon={Calendar} label="ساعت" value={tx.time} ltr />
          <DetailRow icon={Hash} label="شناسه تراکنش" value={tx.id} ltr />
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => toast.success("رسید چاپ شد")}
            className="flex-1 h-12 rounded-xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <FileText className="w-4 h-4" />
            چاپ رسید
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-xl bg-muted text-muted-foreground font-bold"
          >
            بستن
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  ltr,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <span className="text-xs text-muted-foreground flex-1">{label}</span>
      <span className="text-sm font-bold tabular-nums" dir={ltr ? "ltr" : "rtl"}>
        {value}
      </span>
    </div>
  );
}
