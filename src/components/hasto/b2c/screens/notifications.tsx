"use client";

import { useMemo, useState } from "react";
import {
  notifications as initialNotifications,
  fa,
  type Notification,
} from "@/lib/hasto-data";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCheck,
  Bell,
  X,
  Inbox,
  Trash2,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type FilterId =
  | "all"
  | "unread"
  | "payment"
  | "receive"
  | "bill"
  | "contract"
  | "debt"
  | "security";

const filters: { id: FilterId; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "unread", label: "خوانده نشده" },
  { id: "payment", label: "پرداخت" },
  { id: "receive", label: "دریافت" },
  { id: "bill", label: "قبض" },
  { id: "contract", label: "قرارداد" },
  { id: "debt", label: "بدهی" },
  { id: "security", label: "امنیتی" },
];

export function NotificationsScreen() {
  const [items, setItems] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<FilterId>("all");

  const unreadCount = items.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    return items.filter((n) => {
      if (filter === "all") return true;
      if (filter === "unread") return !n.read;
      return n.type === filter;
    });
  }, [items, filter]);

  const handleMarkAllRead = () => {
    if (unreadCount === 0) {
      toast.info("اعلان خوانده نشده‌ای وجود ندارد");
      return;
    }
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success(`${fa(unreadCount)} اعلان خوانده شد`);
  };

  const handleTap = (id: string) => {
    setItems((prev) =>
      prev.map((n) =>
        n.id === id && !n.read ? { ...n, read: true } : n
      )
    );
  };

  const handleDelete = (id: string) => {
    const target = items.find((n) => n.id === id);
    setItems((prev) => prev.filter((n) => n.id !== id));
    toast.success("اعلان حذف شد", {
      description: target?.title,
    });
  };

  return (
    <div className="p-4 pb-6">
      {/* ============ Top bar ============ */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-bold">صندوق ورودی</h2>
          {unreadCount > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#034ea2] text-white text-[10px] font-bold flex items-center justify-center">
              {fa(unreadCount)}
            </span>
          )}
        </div>
        <button
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          className={cn(
            "flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold transition-all active:scale-95",
            unreadCount > 0
              ? "bg-[#034ea2]/10 text-[#034ea2] dark:bg-[#6BA0F5]/15 dark:text-[#6BA0F5] hover:bg-[#034ea2]/15"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          <CheckCheck className="w-3.5 h-3.5" />
          خواندن همه
        </button>
      </div>

      {/* ============ Filters ============ */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-2 mb-3 -mx-4 px-4">
        {filters.map((f) => {
          const count =
            f.id === "all"
              ? items.length
              : f.id === "unread"
                ? unreadCount
                : items.filter((n) => n.type === f.id).length;
          const isActive = filter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "shrink-0 h-8 px-3 rounded-full text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5",
                isActive
                  ? "bg-gradient-to-br from-[#034ea2] to-[#023069] text-white shadow-md"
                  : "bg-card border border-border text-muted-foreground hover:border-[#034ea2]/40"
              )}
            >
              {f.label}
              {count > 0 && (
                <span
                  className={cn(
                    "text-[10px] font-bold",
                    isActive ? "text-white/80" : "text-muted-foreground"
                  )}
                >
                  {fa(count)}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ============ List ============ */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center"
          >
            <div className="relative mb-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#034ea2]/10 to-[#6BA0F5]/10 flex items-center justify-center">
                <Bell className="w-10 h-10 text-[#034ea2] dark:text-[#6BA0F5]" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-success flex items-center justify-center">
                <CheckCheck className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <h3 className="font-bold text-base mb-1">اعلان جدیدی ندارید</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              شما همه اعلان‌ها را مشاهده کرده‌اید. هنگام دریافت اعلان جدید، اینجا نمایش داده می‌شود.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <AnimatePresence>
              {filtered.map((n, idx) => (
                <NotifCard
                  key={n.id}
                  n={n}
                  onTap={() => handleTap(n.id)}
                  onDelete={() => handleDelete(n.id)}
                  index={idx}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ Footer hint ============ */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-center gap-1.5 mt-6 text-[11px] text-muted-foreground">
          <Inbox className="w-3 h-3" />
          <span>{fa(filtered.length)} اعلان نمایش داده شد</span>
        </div>
      )}
    </div>
  );
}

// ============ Notification Card ============
function NotifCard({
  n,
  onTap,
  onDelete,
  index,
}: {
  n: Notification;
  onTap: () => void;
  onDelete: () => void;
  index: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50, height: 0, marginBottom: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.2) }}
      whileTap={{ scale: 0.99 }}
      onClick={onTap}
      className={cn(
        "relative flex items-start gap-3 p-3.5 rounded-2xl bg-card border transition-colors cursor-pointer group",
        n.read
          ? "border-border opacity-75"
          : "border-[#034ea2]/30 bg-[#034ea2]/[0.03] dark:bg-[#6BA0F5]/[0.05]"
      )}
      style={
        !n.read
          ? { borderLeftWidth: "3px", borderLeftColor: n.color }
          : undefined
      }
    >
      {/* Icon */}
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
        style={{
          backgroundColor: `${n.color}18`,
          color: n.color,
        }}
      >
        {n.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <div className="flex items-center gap-1.5">
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
              style={{
                backgroundColor: `${n.color}15`,
                color: n.color,
              }}
            >
              {n.typeLabel}
            </span>
            {!n.read && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#034ea2] animate-pulse" />
            )}
          </div>
          <span className="text-[10px] text-muted-foreground shrink-0">
            {n.date}
          </span>
        </div>
        <h4
          className={cn(
            "text-sm leading-snug mb-0.5",
            n.read ? "font-medium text-foreground/80" : "font-bold text-foreground"
          )}
        >
          {n.title}
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {n.message}
        </p>
      </div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="shrink-0 w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 hover:bg-destructive/10 transition-all flex items-center justify-center"
        aria-label="حذف اعلان"
      >
        <X className="w-3.5 h-3.5 text-muted-foreground hover:text-destructive" />
      </button>
    </motion.div>
  );
}
