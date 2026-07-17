"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/hasto-store";
import { notifications, bills, installments, contracts, fa } from "@/lib/hasto-data";
import { Bell, AlertCircle, Info, CheckCircle2, ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SmartAlert = {
  id: string;
  type: "urgent" | "info" | "success";
  icon: typeof AlertCircle;
  title: string;
  message: string;
  action?: string;
  screen?: string;
  color: string;
};

export function SmartNotificationsWidget() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);

  // Generate smart alerts based on data
  const alerts: SmartAlert[] = [];

  // Urgent: pending bills
  const pendingBills = bills.filter((b) => b.status === "pending");
  if (pendingBills.length > 0) {
    alerts.push({
      id: "bills-alert",
      type: "urgent",
      icon: AlertCircle,
      title: `${fa(pendingBills.length)} قبض پرداخت نشده`,
      message: `مجموع ${fa(pendingBills.reduce((s, b) => s + parseInt(b.amount.replace(/,/g, "")) || 0, 0).toLocaleString())} تومان`,
      action: "پرداخت",
      screen: "bills",
      color: "#EF4444",
    });
  }

  // Info: next installment
  const nextIns = installments[0];
  if (nextIns) {
    alerts.push({
      id: "installment-alert",
      type: "info",
      icon: Info,
      title: `قسط ${nextIns.platform}`,
      message: `${nextIns.nextAmount} تومان در ${nextIns.due}`,
      action: "جزئیات",
      screen: "installments",
      color: "#F59E0B",
    });
  }

  // Info: expiring contracts
  const expiringContracts = contracts.filter((c) => c.status === "active" && c.type === "subscription").slice(0, 1);
  if (expiringContracts.length > 0) {
    alerts.push({
      id: "contract-alert",
      type: "info",
      icon: Bell,
      title: `پرداخت خودکار ${expiringContracts[0].provider}`,
      message: `${expiringContracts[0].amount} تومان • ${expiringContracts[0].nextPayment}`,
      action: "مشاهده",
      screen: "contracts",
      color: "#8B5CF6",
    });
  }

  // Success: recent positive activity
  const unreadNotifs = notifications.filter((n) => !n.read);
  if (unreadNotifs.length > 0) {
    alerts.push({
      id: "notif-alert",
      type: "success",
      icon: CheckCircle2,
      title: `${fa(unreadNotifs.length)} اعلان جدید`,
      message: unreadNotifs[0].title,
      action: "مشاهده",
      screen: "notifications",
      color: "#16a34a",
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-3xl bg-card border border-border p-4 shadow-soft"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#034ea2]/15 dark:bg-[#6BA0F5]/15 flex items-center justify-center relative">
            <Bell className="w-4 h-4 text-[#034ea2] dark:text-[#6BA0F5]" />
            {alerts.filter((a) => a.type === "urgent").length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-destructive animate-pulse" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-sm">اعلان‌های هوشمند</h3>
            <p className="text-[10px] text-muted-foreground">{fa(alerts.length)} مورد نیاز توجه</p>
          </div>
        </div>
        <button
          onClick={() => setB2CScreen("notifications")}
          className="text-[11px] font-medium text-[#034ea2] dark:text-[#6BA0F5] flex items-center gap-1"
        >
          همه
          <ChevronLeft className="w-3 h-3" />
        </button>
      </div>

      {/* Alerts list */}
      <div className="space-y-2">
        {alerts.map((alert, idx) => {
          const Icon = alert.icon;
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.08 }}
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-xl border",
                alert.type === "urgent"
                  ? "bg-destructive/5 border-destructive/15"
                  : alert.type === "success"
                  ? "bg-success/5 border-success/15"
                  : "bg-muted/50 border-border"
              )}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${alert.color}15` }}
              >
                <Icon className="w-4 h-4" style={{ color: alert.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{alert.title}</p>
                <p className="text-[10px] text-muted-foreground truncate">{alert.message}</p>
              </div>
              {alert.action && alert.screen && (
                <button
                  onClick={() => setB2CScreen(alert.screen as never)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white shrink-0"
                  style={{ background: alert.color }}
                >
                  {alert.action}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
