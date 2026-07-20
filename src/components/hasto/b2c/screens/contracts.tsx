"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ChevronLeft,
  FileText,
  CheckCircle2,
  XCircle,
  Wallet,
  Search,
  Inbox,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAppStore } from "@/lib/hasto-store";
import { contracts, fa, type Contract } from "@/lib/hasto-data";
import { StatusBadge } from "@/components/hasto/shared/ui";

type StatusFilter = "all" | "active" | "expired" | "pending";
type TypeFilter = "all" | "direct_debit" | "bnpl" | "subscription" | "auto_bill" | "personal";

const STATUS_CHIPS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "active", label: "فعال" },
  { id: "expired", label: "منقضی شده" },
  { id: "pending", label: "در انتظار" },
];

const TYPE_CHIPS: { id: TypeFilter; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "direct_debit", label: "Direct Debit" },
  { id: "bnpl", label: "BNPL" },
  { id: "subscription", label: "اشتراک" },
  { id: "auto_bill", label: "قبض خودکار" },
  { id: "personal", label: "شخصی" },
];

const STATUS_META: Record<
  Contract["status"],
  { label: string; status: "active" | "expired" | "pending" }
> = {
  active: { label: "فعال", status: "active" },
  expired: { label: "منقضی شده", status: "expired" },
  pending: { label: "در انتظار", status: "pending" },
};

export function ContractsScreen() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);
  const setActiveContractId = useAppStore((s) => s.setActiveContractId);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");

  const stats = useMemo(() => {
    const active = contracts.filter((c) => c.status === "active").length;
    const expired = contracts.filter((c) => c.status === "expired").length;
    const monthly = contracts
      .filter((c) => c.status === "active" && c.period.includes("ماهانه"))
      .reduce((sum, c) => {
        const n = parseInt(c.amount.replace(/[^\d]/g, ""), 10);
        return sum + (isNaN(n) ? 0 : n);
      }, 0);
    return { active, expired, monthly };
  }, []);

  const filtered = useMemo(() => {
    return contracts.filter((c) => {
      const okStatus = statusFilter === "all" || c.status === statusFilter;
      const okType = typeFilter === "all" || c.type === typeFilter;
      return okStatus && okType;
    });
  }, [statusFilter, typeFilter]);

  const openContract = (id: string) => {
    setActiveContractId(id);
    setB2CScreen("contract-detail");
  };

  return (
    <div className="pb-28">
      {/* Title + count */}
      <div className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-3"
        >
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight">قراردادهای من</h1>
            <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-[#034ea2] text-white text-[11px] font-bold tabular-nums">
              {fa(contracts.length)}
            </span>
          </div>
          <button
            onClick={() => toast.info("جستجوی قراردادها در نسخه نهایی فعال خواهد بود")}
            aria-label="جستجو"
            className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors active:scale-95"
          >
            <Search className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* Summary mini stats */}
      <div className="px-4 grid grid-cols-3 gap-2 mb-4">
        <StatMini
          icon={<CheckCircle2 className="w-4 h-4" />}
          label="تعداد فعال"
          value={fa(stats.active)}
          tone="success"
          delay={0.05}
        />
        <StatMini
          icon={<XCircle className="w-4 h-4" />}
          label="منقضی شده"
          value={fa(stats.expired)}
          tone="destructive"
          delay={0.12}
        />
        <StatMini
          icon={<Wallet className="w-4 h-4" />}
          label="مجموع ماهانه"
          value={fa(stats.monthly.toLocaleString("en-US"))}
          tone="primary"
          suffix="تومان"
          delay={0.19}
        />
      </div>

      {/* Status filter chips (scrollable) */}
      <div className="px-4 mb-2">
        <div className="-mx-4 px-4 flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {STATUS_CHIPS.map((chip) => {
            const active = statusFilter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setStatusFilter(chip.id)}
                className={cn(
                  "shrink-0 px-3.5 h-8 rounded-full text-xs font-bold transition-all active:scale-95 border",
                  active
                    ? "bg-[#034ea2] text-white border-[#034ea2] shadow-md shadow-[#034ea2]/25"
                    : "bg-card text-muted-foreground border-border hover:text-foreground"
                )}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Type filter chips (scrollable) */}
      <div className="px-4 mb-4">
        <div className="-mx-4 px-4 flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {TYPE_CHIPS.map((chip) => {
            const active = typeFilter === chip.id;
            return (
              <button
                key={chip.id}
                onClick={() => setTypeFilter(chip.id)}
                className={cn(
                  "shrink-0 px-3.5 h-8 rounded-full text-xs font-bold transition-all active:scale-95 border",
                  active
                    ? "bg-[#034ea2]/10 text-[#034ea2] border-[#034ea2]/30 dark:text-[#6BA0F5] dark:border-[#6BA0F5]/30"
                    : "bg-card text-muted-foreground border-border hover:text-foreground"
                )}
              >
                {chip.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* List of contracts */}
      <div className="px-4 space-y-2.5">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-bold text-base mb-1">قراردادی یافت نشد</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                با فیلترهای انتخاب‌شده قراردادی موجود نیست. فیلترها را تغییر دهید یا قرارداد جدیدی بسازید.
              </p>
            </motion.div>
          ) : (
            filtered.map((c, i) => (
              <ContractCard
                key={c.id}
                contract={c}
                index={i}
                onClick={() => openContract(c.id)}
              />
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Floating "افزودن قرارداد جدید" button */}
      <motion.button
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 280, damping: 22 }}
        onClick={() => setB2CScreen("contract-create")}
        aria-label="افزودن قرارداد جدید"
        className="sticky bottom-20 z-30 flex items-center gap-2 px-5 h-12 rounded-full mx-auto w-fit bg-gradient-to-br from-[#034ea2] to-[#023069] text-white shadow-lg shadow-[#034ea2]/40 transition-transform active:scale-95"
      >
        <Plus className="w-5 h-5" />
        <span className="font-bold text-sm">افزودن قرارداد جدید</span>
      </motion.button>
    </div>
  );
}

// ---------------- Stat Mini ----------------
function StatMini({
  icon,
  label,
  value,
  suffix,
  tone,
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix?: string;
  tone: "success" | "destructive" | "primary";
  delay?: number;
}) {
  const tones = {
    success: {
      iconBg: "bg-success/15 text-success",
      accent: "text-success",
    },
    destructive: {
      iconBg: "bg-destructive/15 text-destructive",
      accent: "text-destructive",
    },
    primary: {
      iconBg: "bg-[#034ea2]/15 text-[#034ea2] dark:text-[#6BA0F5]",
      accent: "text-[#034ea2] dark:text-[#6BA0F5]",
    },
  }[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl bg-card border border-border p-3 shadow-soft"
    >
      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center mb-2", tones.iconBg)}>
        {icon}
      </div>
      <p className="text-[10px] text-muted-foreground font-medium leading-tight mb-0.5">{label}</p>
      <p className={cn("font-extrabold text-sm tabular-nums leading-tight", tones.accent)}>
        {value}
        {suffix && <span className="text-[10px] font-medium text-muted-foreground mr-1">{suffix}</span>}
      </p>
    </motion.div>
  );
}

// ---------------- Contract Card ----------------
function ContractCard({
  contract,
  index,
  onClick,
}: {
  contract: Contract;
  index: number;
  onClick: () => void;
}) {
  const meta = STATUS_META[contract.status];
  const subtitle = contract.recipient ?? contract.provider;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        delay: Math.min(index * 0.04, 0.4),
        type: "spring",
        stiffness: 280,
        damping: 24,
      }}
      onClick={onClick}
      className="w-full text-right rounded-2xl bg-card border border-border shadow-soft p-3.5 hover:border-[#034ea2]/40 transition-all active:scale-[0.98] group"
    >
      <div className="flex items-center gap-3">
        {/* Icon (emoji in colored circle) */}
        <div
          className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner"
          style={{
            backgroundColor: `${contract.color}22`,
            boxShadow: `inset 0 0 0 1.5px ${contract.color}33`,
          }}
        >
          <span>{contract.icon}</span>
        </div>

        {/* Center content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground">
              {contract.typeLabel}
            </span>
            <StatusBadge status={meta.status} label={meta.label} />
          </div>
          <p className="font-bold text-sm leading-tight truncate mb-0.5">{contract.name}</p>
          <p className="text-xs text-muted-foreground truncate">{subtitle}</p>

          {/* Amount + period + expiry */}
          <div className="flex items-center gap-2 mt-1.5 text-[11px] text-muted-foreground">
            <span className="font-bold text-foreground tabular-nums">
              {contract.amount}
              {contract.amount !== "متغیر" && !contract.amount.includes("سقف") && (
                <span className="text-muted-foreground font-medium mr-1">تومان</span>
              )}
            </span>
            <span className="text-muted-foreground/60">•</span>
            <span>{contract.period}</span>
            <span className="text-muted-foreground/60">•</span>
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              انقضا: {contract.expiryDate}
            </span>
          </div>
        </div>

        {/* Chevron */}
        <div className="shrink-0 w-7 h-7 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:bg-[#034ea2]/10 group-hover:text-[#034ea2] dark:group-hover:text-[#6BA0F5] transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </div>
      </div>
    </motion.button>
  );
}
