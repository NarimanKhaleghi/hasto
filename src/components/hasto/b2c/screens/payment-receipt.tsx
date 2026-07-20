"use client";

import { useAppStore } from "@/lib/hasto-store";
import { motion } from "framer-motion";
import { Check, Home, Share2 } from "lucide-react";

export function PaymentReceiptScreen() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center mx-auto mb-6">
          <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center">
            <Check className="w-6 h-6 text-white" strokeWidth={3} />
          </div>
        </div>
        <h2 className="text-xl font-bold mb-2">پرداخت موفق</h2>
        <p className="text-sm text-muted-foreground mb-8">
          پرداخت شما با موفقیت انجام شد
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setB2CScreen("dashboard")}
            className="flex-1 h-12 rounded-2xl bg-card border border-border font-bold flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            خانه
          </button>
          <button className="flex-1 h-12 rounded-2xl bg-[#034ea2] text-white font-bold flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            اشتراک‌گذاری
          </button>
        </div>
      </motion.div>
    </div>
  );
}
