"use client";

import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

// ==================== Status Badge ====================
export function StatusBadge({
  status,
  label,
  className,
}: {
  status: "active" | "expired" | "pending" | "success" | "failed" | "paid" | "overdue";
  label: string;
  className?: string;
}) {
  const styles: Record<string, string> = {
    active: "bg-success/15 text-success",
    success: "bg-success/15 text-success",
    paid: "bg-success/15 text-success",
    expired: "bg-destructive/15 text-destructive",
    failed: "bg-destructive/15 text-destructive",
    overdue: "bg-destructive/15 text-destructive",
    pending: "bg-warning/15 text-warning",
  };

  const dotColor: Record<string, string> = {
    active: "bg-success",
    success: "bg-success",
    paid: "bg-success",
    expired: "bg-destructive",
    failed: "bg-destructive",
    overdue: "bg-destructive",
    pending: "bg-warning",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium",
        styles[status],
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", dotColor[status])} />
      {label}
    </span>
  );
}

// ==================== Progress Bar ====================
export function ProgressBar({
  value,
  className,
  color,
}: {
  value: number;
  className?: string;
  color?: string;
}) {
  return (
    <div className={cn("w-full h-2 rounded-full bg-muted overflow-hidden", className)}>
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{
          width: `${Math.min(100, Math.max(0, value))}%`,
          background: color ?? "linear-gradient(90deg, #034ea2, #0456B5)",
        }}
      />
    </div>
  );
}

// ==================== Section Card ====================
export function SectionCard({
  title,
  icon: Icon,
  action,
  children,
  className,
  noPadding,
}: {
  title?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-card border border-border shadow-soft",
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-[#034ea2] dark:text-[#6BA0F5]" />}
            {title && <h3 className="font-bold text-sm">{title}</h3>}
          </div>
          {action}
        </div>
      )}
      <div className={noPadding ? "" : "p-4"}>{children}</div>
    </div>
  );
}

// ==================== Amount Display ====================
export function Amount({
  value,
  currency = "تومان",
  className,
  sign,
}: {
  value: string;
  currency?: string;
  className?: string;
  sign?: "+" | "-";
}) {
  return (
    <span className={cn("font-persian-nums tabular-nums", className)}>
      {sign === "+" && <span className="text-success">+</span>}
      {sign === "-" && <span className="text-destructive">-</span>}
      {value} {currency}
    </span>
  );
}

// ==================== Empty State ====================
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-bold text-base mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mb-4 max-w-xs">{description}</p>
      )}
      {action}
    </div>
  );
}

// ==================== Floating Action Button ====================
export function Fab({
  icon: Icon,
  onClick,
  label,
  variant = "primary",
}: {
  icon: LucideIcon;
  onClick: () => void;
  label: string;
  variant?: "primary" | "default";
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(
        "fixed bottom-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-6 h-12 rounded-full shadow-lg transition-all active:scale-95",
        variant === "primary"
          ? "bg-gradient-to-br from-[#034ea2] to-[#023069] text-white shadow-glow"
          : "bg-card border border-border text-foreground"
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="font-bold text-sm">{label}</span>
    </button>
  );
}
