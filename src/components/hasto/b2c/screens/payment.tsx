"use client";

import { useAppStore } from "@/lib/hasto-store";
import { user, fa } from "@/lib/hasto-data";
import { motion } from "framer-motion";
import {
  Hash,
  QrCode,
  Nfc,
  MapPin,
  ChevronLeft,
  Info,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

type MethodCard = {
  id: "payment-id" | "payment-qr" | "payment-nfc" | "payment-nearby";
  title: string;
  description: string;
  icon: typeof Hash;
  gradient: string;
  iconBg: string;
  iconColor: string;
};

const methods: MethodCard[] = [
  {
    id: "payment-id",
    title: "شناسه واریز",
    description: "پرداخت با شناسه کیف پول گیرنده",
    icon: Hash,
    gradient: "from-[#034ea2]/8 to-[#034ea2]/2",
    iconBg: "bg-gradient-to-br from-[#034ea2] to-[#023069]",
    iconColor: "text-white",
  },
  {
    id: "payment-qr",
    title: "اسکن QR",
    description: "اسکن کد QR فروشگاه یا فرد",
    icon: QrCode,
    gradient: "from-[#16a34a]/8 to-[#16a34a]/2",
    iconBg: "bg-gradient-to-br from-[#16a34a] to-[#0d5e2e]",
    iconColor: "text-white",
  },
  {
    id: "payment-nfc",
    title: "پرداخت NFC",
    description: "نزدیک کردن گوشی به دستگاه POS",
    icon: Nfc,
    gradient: "from-[#8B5CF6]/8 to-[#8B5CF6]/2",
    iconBg: "bg-gradient-to-br from-[#8B5CF6] to-[#4c2a92]",
    iconColor: "text-white",
  },
  {
    id: "payment-nearby",
    title: "پرداخت نزدیک",
    description: "پرداخت به فروشگاه‌های اطراف شما",
    icon: MapPin,
    gradient: "from-[#F59E0B]/8 to-[#F59E0B]/2",
    iconBg: "bg-gradient-to-br from-[#F59E0B] to-[#9a5b04]",
    iconColor: "text-white",
  },
];

export function PaymentScreen() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);

  return (
    <div className="pb-6">
      {/* Hero header */}
      <div className="px-4 pt-4 pb-2">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-5"
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.05, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-[#034ea2] to-[#023069] shadow-lg shadow-[#034ea2]/30 mb-3"
          >
            <Smartphone className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-xl font-bold mb-1">روش پرداخت را انتخاب کنید</h1>
          <p className="text-sm text-muted-foreground">
            یکی از روش‌های زیر را برای پرداخت انتخاب کنید
          </p>
        </motion.div>
      </div>

      {/* 2x2 grid of methods */}
      <div className="px-4 grid grid-cols-2 gap-3">
        {methods.map((m, idx) => (
          <motion.button
            key={m.id}
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1 + idx * 0.06, type: "spring", stiffness: 200, damping: 22 }}
            whileTap={{ scale: 0.96 }}
            whileHover={{ y: -2 }}
            onClick={() => setB2CScreen(m.id)}
            className={cn(
              "relative overflow-hidden rounded-3xl p-4 text-right",
              "bg-gradient-to-br border border-border/60 shadow-soft",
              "flex flex-col items-start gap-3 min-h-[140px]",
              m.gradient
            )}
          >
            {/* Decorative blur */}
            <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full bg-white/10 dark:bg-white/5 pointer-events-none" />

            <div className="flex items-start justify-between w-full relative z-10">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shadow-md",
                  m.iconBg
                )}
              >
                <m.icon className={cn("w-6 h-6", m.iconColor)} />
              </div>
              <ChevronLeft className="w-4 h-4 text-muted-foreground mt-1" />
            </div>

            <div className="relative z-10 mt-auto">
              <h3 className="font-bold text-sm mb-0.5">{m.title}</h3>
              <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                {m.description}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Info banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mx-4 mt-5"
      >
        <div className="rounded-2xl bg-[#034ea2]/8 dark:bg-[#6BA0F5]/10 border border-[#034ea2]/15 dark:border-[#6BA0F5]/20 p-3.5 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#034ea2]/15 dark:bg-[#6BA0F5]/20 flex items-center justify-center shrink-0">
            <Info className="w-5 h-5 text-[#034ea2] dark:text-[#6BA0F5]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[#034ea2] dark:text-[#6BA0F5] mb-0.5">
              نکته کاربردی
            </p>
            <p className="text-xs text-foreground/80 leading-relaxed">
              شماره موبایل گیرنده = شناسه کیف پول او. کافیست شماره موبایل شخص را وارد کنید.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Wallet balance mini card */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mx-4 mt-3"
      >
        <div className="rounded-2xl bg-card border border-border p-3.5 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-muted-foreground">موجودی کیف پول</p>
            <p className="text-base font-bold tabular-nums">
              {user.wallet.balanceText}{" "}
              <span className="text-xs font-normal text-muted-foreground">تومان</span>
            </p>
          </div>
          <button
            onClick={() => setB2CScreen("wallet-detail")}
            className="text-xs font-medium text-[#034ea2] dark:text-[#6BA0F5] flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#034ea2]/8 dark:bg-[#6BA0F5]/10"
          >
            جزئیات
            <ChevronLeft className="w-3 h-3" />
          </button>
        </div>
      </motion.div>

      {/* Footer hint */}
      <p className="text-center text-[11px] text-muted-foreground mt-5 px-6">
        {fa(4)} روش پرداخت امن و سریع • همگی رایگان
      </p>
    </div>
  );
}
