"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/hasto-store";
import {
  terminals,
  supportTickets,
  ticketIssueTypes,
  business,
  fa,
} from "@/lib/hasto-data";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  CreditCard,
  Globe,
  AlertTriangle,
  Phone,
  FileText,
  CheckCircle2,
  Send,
} from "lucide-react";

type Priority = "low" | "medium" | "high" | "urgent";

const priorityConfig: Record<Priority, { label: string; color: string; bg: string }> = {
  low: { label: "کم", color: "#16a34a", bg: "from-[#16a34a]/10 to-[#16a34a]/5" },
  medium: { label: "متوسط", color: "#F59E0B", bg: "from-[#F59E0B]/10 to-[#F59E0B]/5" },
  high: { label: "زیاد", color: "#EF4444", bg: "from-[#EF4444]/10 to-[#EF4444]/5" },
  urgent: { label: "فوری", color: "#DC2626", bg: "from-[#DC2626]/10 to-[#DC2626]/5" },
};

export function B2BTerminalTicketScreen() {
  const { activeTerminalId, goBackB2B } = useAppStore();
  const [issueType, setIssueType] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [description, setDescription] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");

  const terminal = terminals.find((t) => t.id === activeTerminalId);

  if (!terminal) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground text-sm">پایانه یافت نشد</p>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!issueType || !description.trim()) return;
    const nextNum = supportTickets.length + 1;
    const tk = `TK-1405-${String(nextNum).padStart(3, "0")}`;
    setTicketNumber(tk);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="px-4 pt-4 pb-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-card border border-border shadow-soft p-8 flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-[#16a34a]/15 flex items-center justify-center mb-5"
          >
            <CheckCircle2 className="w-10 h-10 text-[#16a34a]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-bold mb-2"
          >
            تیکت ثبت شد
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted-foreground mb-6"
          >
            تیکت شما با موفقیت ثبت شد و توسط تیم پشتیبانی بررسی خواهد شد.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl bg-muted/50 border border-border p-4 w-full mb-6"
          >
            <p className="text-xs text-muted-foreground mb-1">شماره تیکت</p>
            <p className="text-lg font-bold font-persian-nums tabular-nums text-[#034ea2] dark:text-[#6BA0F5]">
              {ticketNumber}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-2 w-full text-right"
          >
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-xs text-muted-foreground">پایانه</span>
              <span className="text-sm font-medium">
                {terminal.type === "pos" ? "POS" : "IPG"} — {terminal.bankName}
              </span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-xs text-muted-foreground">نوع مشکل</span>
              <span className="text-sm font-medium">{issueType}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-muted-foreground">اولویت</span>
              <span
                className="text-sm font-medium"
                style={{ color: priorityConfig[priority].color }}
              >
                {priorityConfig[priority].label}
              </span>
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            onClick={goBackB2B}
            className="mt-6 w-full py-3 rounded-2xl bg-gradient-to-br from-[#034ea2] to-[#023069] text-white font-bold text-sm shadow-lg shadow-[#034ea2]/30 active:scale-95 transition-transform"
          >
            بازگشت به داشبورد
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-5 shadow-2xl wallet-gradient"
          style={{
            background: `linear-gradient(135deg, ${terminal.color}ee, ${terminal.color}99)`,
          }}
        >
          <div className="absolute -top-12 -left-12 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 -right-8 w-48 h-48 rounded-full bg-white/5" />

          <div className="relative z-10">
            <button
              onClick={goBackB2B}
              className="flex items-center gap-1 text-white/70 text-xs mb-3 active:scale-95 transition-transform"
            >
              <ArrowRight className="w-4 h-4" />
              بازگشت
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-base">ثبت تیکت پشتیبانی</p>
                <p className="text-white/70 text-xs mt-0.5">
                  {terminal.type === "pos" ? "POS" : "IPG"} — {terminal.bankName}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Form */}
      <div className="px-4 mt-4 space-y-4">
        {/* Terminal Info (readonly) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl bg-card border border-border shadow-soft p-4"
        >
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            نوع تجهیز
          </label>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${terminal.color}20` }}
            >
              {terminal.type === "pos" ? (
                <CreditCard className="w-5 h-5" style={{ color: terminal.color }} />
              ) : (
                <Globe className="w-5 h-5" style={{ color: terminal.color }} />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">
                {terminal.type === "pos" ? "POS" : "IPG"} — {terminal.bankName}
              </p>
              <p className="text-xs text-muted-foreground">{terminal.serial}</p>
            </div>
          </div>
        </motion.div>

        {/* Issue Type */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-card border border-border shadow-soft p-4"
        >
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            نوع مشکل
          </label>
          <div className="relative">
            <button
              onClick={() => setShowDropdown((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-3 rounded-xl bg-muted border border-border text-sm font-medium active:scale-[0.99] transition-all"
            >
              <span
                className={cn(!issueType && "text-muted-foreground")}
              >
                {issueType || "انتخاب کنید"}
              </span>
              <ChevronLeft
                className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform",
                  showDropdown && "-rotate-90"
                )}
              />
            </button>

            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden"
                >
                  {ticketIssueTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setIssueType(type);
                        setShowDropdown(false);
                      }}
                      className={cn(
                        "w-full text-right px-3 py-2.5 text-sm font-medium hover:bg-muted/50 transition-colors",
                        issueType === type && "bg-[#034ea2]/10 text-[#034ea2]"
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Priority */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl bg-card border border-border shadow-soft p-4"
        >
          <label className="text-xs font-medium text-muted-foreground mb-3 block">
            اولویت
          </label>
          <div className="grid grid-cols-4 gap-2">
            {(["low", "medium", "high", "urgent"] as Priority[]).map((p) => {
              const cfg = priorityConfig[p];
              return (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={cn(
                    "py-2.5 rounded-xl text-xs font-bold transition-all border",
                    priority === p
                      ? "shadow-md"
                      : "border-border bg-muted text-muted-foreground"
                  )}
                  style={
                    priority === p
                      ? {
                          background: `${cfg.color}15`,
                          borderColor: `${cfg.color}40`,
                          color: cfg.color,
                        }
                      : undefined
                  }
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-card border border-border shadow-soft p-4"
        >
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            توضیحات
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 500))}
            rows={4}
            placeholder="توضیحات مشکل را وارد کنید..."
            className="w-full px-3 py-2.5 rounded-xl bg-muted border border-border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#034ea2]/30 resize-none placeholder:text-muted-foreground/50"
          />
          <div className="flex items-center justify-between mt-1.5">
            <span className="text-[10px] text-muted-foreground">
              حداکثر ۵۰۰ کاراکتر
            </span>
            <span
              className={cn(
                "text-[10px] tabular-nums",
                description.length >= 450
                  ? "text-[#EF4444]"
                  : "text-muted-foreground"
              )}
            >
              {fa(description.length)} / {fa(500)}
            </span>
          </div>
        </motion.div>

        {/* Phone */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl bg-card border border-border shadow-soft p-4"
        >
          <label className="text-xs font-medium text-muted-foreground mb-2 block">
            شماره تماس
          </label>
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-muted border border-border">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium font-persian-nums">
              {business.profile.mobile}
            </span>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={handleSubmit}
            disabled={!issueType || !description.trim()}
            className={cn(
              "w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all",
              issueType && description.trim()
                ? "bg-gradient-to-br from-[#034ea2] to-[#023069] text-white shadow-lg shadow-[#034ea2]/30 active:scale-95"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
            ثبت تیکت
          </button>
        </motion.div>
      </div>
    </div>
  );
}
