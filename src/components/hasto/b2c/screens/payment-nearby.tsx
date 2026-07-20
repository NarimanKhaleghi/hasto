"use client";

import { useAppStore } from "@/lib/hasto-store";
import type { TransferContext } from "@/lib/hasto-store";
import { nearbyShops, formatToman } from "@/lib/hasto-data";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Check,
  ChevronLeft,
  Navigation,
  Wallet,
  ArrowLeft,
  X,
  Radar,
  Store,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Shop = (typeof nearbyShops)[number];

export function PaymentNearbyScreen() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);
  const setTransferContext = useAppStore((s) => s.setTransferContext);

  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [amount, setAmount] = useState("");

  const handleAmountChange = (v: string) => {
    const onlyDigits = v.replace(/[^\d]/g, "");
    setAmount(onlyDigits);
  };

  const amountNum = parseInt(amount || "0", 10);

  const handleConfirm = () => {
    if (!selectedShop) return;
    if (amountNum <= 0) {
      toast.error("مبلغ را وارد کنید");
      return;
    }
    const ctx: TransferContext = {
      recipientName: selectedShop.name,
      recipientNumber: "SHOP-" + selectedShop.id,
      recipientType: "shop",
      amount: amountNum,
      amountText: formatToman(amountNum),
      paymentMethod: "پرداخت نزدیک",
    };
    setTransferContext(ctx);
    setB2CScreen("transfer-pin");
  };

  const openSheet = (shop: Shop) => {
    setSelectedShop(shop);
    setAmount("");
  };

  const closeSheet = () => {
    setSelectedShop(null);
    setAmount("");
  };

  const quickAmounts = [50000, 100000, 250000, 500000];

  return (
    <div className="pb-6">
      {/* Location permission banner */}
      <div className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-success/8 border border-success/20 p-3 flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-success/15 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-success" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-success">دسترسی لوکیشن داده شد</p>
            <p className="text-[11px] text-muted-foreground">
              موقعیت شما برای یافتن فروشگاه‌های نزدیک استفاده می‌شود
            </p>
          </div>
        </motion.div>
      </div>

      {/* Map-like header with current location */}
      <div className="px-4 mt-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative rounded-3xl overflow-hidden h-32 bg-gradient-to-br from-[#034ea2]/15 via-[#6BA0F5]/10 to-[#034ea2]/5 dark:from-[#6BA0F5]/15 dark:via-[#6BA0F5]/8 dark:to-transparent border border-border/60"
        >
          {/* Map grid pattern */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(3,78,162,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(3,78,162,0.1) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          {/* Fake streets */}
          <div className="absolute top-1/2 left-0 right-0 h-3 bg-[#034ea2]/10" />
          <div className="absolute top-0 bottom-0 left-1/3 w-3 bg-[#034ea2]/10" />

          {/* Decorative shop dots */}
          {[
            { top: "20%", left: "25%", c: "#F59E0B" },
            { top: "65%", left: "70%", c: "#16a34a" },
            { top: "30%", left: "80%", c: "#8B5CF6" },
          ].map((d, i) => (
            <motion.div
              key={i}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
              className="absolute w-2 h-2 rounded-full"
              style={{ top: d.top, left: d.left, background: d.c }}
            />
          ))}

          {/* Center current location pin */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex flex-col items-center">
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute w-10 h-10 rounded-full bg-[#034ea2]/30"
              />
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute w-7 h-7 rounded-full bg-[#034ea2]/40"
              />
              <div className="relative w-5 h-5 rounded-full bg-[#034ea2] border-[3px] border-white shadow-lg flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>
          </div>

          {/* Location label */}
          <div className="absolute bottom-2 right-2 left-2 flex items-center gap-1.5 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1">
            <MapPin className="w-3 h-3 text-[#034ea2] dark:text-[#6BA0F5] shrink-0" />
            <span className="text-[10px] font-medium truncate">موقعیت فعلی شما</span>
            <span className="text-[10px] text-muted-foreground ms-auto"> Tehran</span>
          </div>
        </motion.div>
      </div>

      {/* Header */}
      <div className="px-4 mt-5 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#034ea2]/10 dark:bg-[#6BA0F5]/15 flex items-center justify-center">
            <Radar className="w-4 h-4 text-[#034ea2] dark:text-[#6BA0F5]" />
          </div>
          <div>
            <h2 className="font-bold text-sm">فروشگاه‌های نزدیک</h2>
            <p className="text-[10px] text-muted-foreground">شعاع {formatToman(50)} متری</p>
          </div>
        </div>
        <span className="text-[11px] font-medium text-[#034ea2] dark:text-[#6BA0F5] bg-[#034ea2]/8 dark:bg-[#6BA0F5]/10 px-2.5 py-1 rounded-full">
          {nearbyShops.length} فروشگاه
        </span>
      </div>

      {/* Shops list */}
      <div className="px-4">
        <div className="max-h-[360px] overflow-y-auto scrollbar-thin space-y-2 pr-1">
          {nearbyShops.map((shop, idx) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl bg-card border border-border shadow-soft p-3 flex items-center gap-3 hover:border-[#034ea2]/30 transition-colors"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#034ea2]/15 to-[#034ea2]/5 dark:from-[#6BA0F5]/15 dark:to-[#6BA0F5]/5 flex items-center justify-center text-2xl shrink-0">
                {shop.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{shop.name}</p>
                <p className="text-[11px] text-muted-foreground truncate flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  {shop.address}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Navigation className="w-3 h-3 text-[#16a34a]" />
                  <span className="text-[10px] font-medium text-[#16a34a] tabular-nums">
                    {shop.distance}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-muted-foreground/30 mx-1" />
                  <span className="text-[10px] text-muted-foreground">فعال</span>
                </div>
              </div>

              {/* Select button */}
              <button
                onClick={() => openSheet(shop)}
                className="shrink-0 px-3.5 h-9 rounded-xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white text-xs font-bold flex items-center gap-1 active:scale-95 transition-transform shadow-sm"
              >
                انتخاب
                <ChevronLeft className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info note */}
      <div className="px-4 mt-4">
        <div className="rounded-2xl bg-[#034ea2]/8 dark:bg-[#6BA0F5]/10 border border-[#034ea2]/15 dark:border-[#6BA0F5]/20 p-3 flex items-start gap-2.5">
          <Store className="w-4 h-4 text-[#034ea2] dark:text-[#6BA0F5] shrink-0 mt-0.5" />
          <p className="text-[11px] text-foreground/80 leading-relaxed">
            با انتخاب هر فروشگاه، می‌توانید مستقیم به کیف پول آن پرداخت کنید.
            نیازی به نقدی یا کارت نیست.
          </p>
        </div>
      </div>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {selectedShop && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSheet}
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[420px] bg-background rounded-t-3xl p-5 pb-6 max-h-[90vh] overflow-y-auto scrollbar-thin"
            >
              {/* Handle */}
              <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4" />

              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-base">پرداخت به فروشگاه</h2>
                <button
                  onClick={closeSheet}
                  className="p-1.5 rounded-full hover:bg-muted transition-colors"
                  aria-label="بستن"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Shop info */}
              <div className="rounded-2xl bg-gradient-to-l from-[#034ea2]/8 to-transparent border border-border p-4 flex items-center gap-3 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#034ea2]/20 to-[#034ea2]/5 dark:from-[#6BA0F5]/20 dark:to-[#6BA0F5]/5 flex items-center justify-center text-3xl shrink-0">
                  {selectedShop.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm">{selectedShop.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {selectedShop.address}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Navigation className="w-3 h-3 text-[#16a34a]" />
                    <span className="text-[10px] font-medium text-[#16a34a]">
                      {selectedShop.distance} از شما
                    </span>
                  </div>
                </div>
              </div>

              {/* Amount input */}
              <label className="text-[11px] text-muted-foreground mb-1.5 flex items-center gap-1.5">
                <Wallet className="w-3 h-3" />
                مبلغ پرداخت (تومان)
              </label>
              <div className="flex items-center gap-2 rounded-2xl border-2 border-border bg-card px-4 h-16 focus-within:border-[#034ea2] dark:focus-within:border-[#6BA0F5] transition-colors mb-3">
                <input
                  type="text"
                  inputMode="numeric"
                  autoFocus
                  value={amount ? formatToman(amountNum) : ""}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="۰"
                  dir="ltr"
                  className="flex-1 bg-transparent outline-none text-2xl font-bold tabular-nums text-right placeholder:text-muted-foreground/40"
                  aria-label="مبلغ"
                />
                <span className="text-xs text-muted-foreground">تومان</span>
              </div>

              {/* Quick amounts */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    onClick={() => setAmount(String(q))}
                    className={cn(
                      "py-2 rounded-xl text-xs font-medium tabular-nums transition-colors",
                      amountNum === q
                        ? "bg-[#034ea2] text-white dark:bg-[#6BA0F5] dark:text-[#02224a]"
                        : "bg-muted hover:bg-accent"
                    )}
                  >
                    {formatToman(q)}
                  </button>
                ))}
              </div>

              {/* Amount summary */}
              {amountNum > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl bg-gradient-to-l from-[#034ea2] to-[#023069] p-4 mb-3 text-white relative overflow-hidden"
                >
                  <div className="absolute -top-8 -left-8 w-28 h-28 rounded-full bg-white/10" />
                  <p className="text-[11px] text-white/70 relative z-10">مبلغ قابل پرداخت</p>
                  <p className="text-2xl font-bold tabular-nums relative z-10">
                    {formatToman(amountNum)}{" "}
                    <span className="text-sm font-normal">تومان</span>
                  </p>
                </motion.div>
              )}

              {/* CTA */}
              <button
                onClick={handleConfirm}
                disabled={amountNum <= 0}
                className={cn(
                  "w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]",
                  amountNum > 0
                    ? "bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white shadow-lg shadow-[#034ea2]/25"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                تایید و پرداخت
                <ArrowLeft className="w-5 h-5" />
              </button>
              <p className="text-center text-[11px] text-muted-foreground mt-2">
                به {selectedShop.name} پرداخت می‌شود
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
