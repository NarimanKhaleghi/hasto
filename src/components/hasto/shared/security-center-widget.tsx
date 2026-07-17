"use client";

import { motion } from "framer-motion";
import { useAppStore } from "@/lib/hasto-store";
import { fa } from "@/lib/hasto-data";
import { Shield, ShieldCheck, ShieldAlert, Fingerprint, Smartphone, Key, Lock, Eye, ChevronLeft, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type SecurityItem = {
  id: string;
  label: string;
  icon: typeof Shield;
  status: "secure" | "warning" | "action";
  description: string;
};

export function SecurityCenterWidget() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);

  const securityItems: SecurityItem[] = [
    { id: "2fa", label: "احراز هویت دو مرحله‌ای", icon: Fingerprint, status: "secure", description: "فعال" },
    { id: "biometric", label: "ورود بیومتریک", icon: Smartphone, status: "secure", description: "فعال" },
    { id: "password", label: "رمز عبور قوی", icon: Key, status: "secure", description: "قوی" },
    { id: "devices", label: "دستگاه‌های فعال", icon: Smartphone, status: "warning", description: "۲ دستگاه" },
    { id: "privacy", label: "حریم خصوصی", icon: Eye, status: "action", description: "بررسی" },
  ];

  const secureCount = securityItems.filter((i) => i.status === "secure").length;
  const totalCount = securityItems.length;
  const securityScore = Math.round((secureCount / totalCount) * 100);

  const getStatusConfig = (status: SecurityItem["status"]) => {
    switch (status) {
      case "secure":
        return { color: "#16a34a", bg: "bg-success/10", icon: ShieldCheck };
      case "warning":
        return { color: "#F59E0B", bg: "bg-warning/10", icon: ShieldAlert };
      case "action":
        return { color: "#034ea2", bg: "bg-[#034ea2]/10 dark:bg-[#6BA0F5]/10", icon: Shield };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="rounded-3xl bg-card border border-border p-4 shadow-soft"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-success/15 flex items-center justify-center relative">
            <Shield className="w-4 h-4 text-success" />
            {securityScore === 100 && (
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-xl bg-success/30"
              />
            )}
          </div>
          <div>
            <h3 className="font-bold text-sm">مرکز امنیت</h3>
            <p className="text-[10px] text-muted-foreground">امتیاز امنیت: {fa(securityScore)}٪</p>
          </div>
        </div>
        <button
          onClick={() => setB2CScreen("profile")}
          className="text-[11px] font-medium text-[#034ea2] dark:text-[#6BA0F5] flex items-center gap-1"
        >
          تنظیمات
          <ChevronLeft className="w-3 h-3" />
        </button>
      </div>

      {/* Security score bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] mb-1.5">
          <span className="text-muted-foreground">وضعیت امنیتی</span>
          <span className="font-bold text-success tabular-nums">{fa(securityScore)}٪ امن</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${securityScore}%` }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 }}
            className="h-full rounded-full bg-gradient-to-l from-[#16a34a] to-[#22c55e] relative overflow-hidden"
          >
            <div className="absolute inset-0 shimmer" />
          </motion.div>
        </div>
      </div>

      {/* Security items list */}
      <div className="space-y-1.5">
        {securityItems.map((item, idx) => {
          const config = getStatusConfig(item.status);
          const ItemIcon = item.icon;
          const StatusIcon = config.icon;
          return (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + idx * 0.06 }}
              onClick={() => setB2CScreen("profile")}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-muted/30 transition-colors"
            >
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", config.bg)}>
                <ItemIcon className="w-3.5 h-3.5" style={{ color: config.color }} />
              </div>
              <span className="text-xs font-medium flex-1 text-right">{item.label}</span>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-bold tabular-nums" style={{ color: config.color }}>
                  {item.description}
                </span>
                <StatusIcon className="w-3 h-3" style={{ color: config.color }} />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* All secure badge */}
      {securityScore >= 80 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-2 pt-2 border-t border-border flex items-center justify-center gap-1.5"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-success" />
          <span className="text-[10px] font-bold text-success">حساب شما امن است</span>
        </motion.div>
      )}
    </motion.div>
  );
}
