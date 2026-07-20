"use client";

import { useAppStore } from "@/lib/hasto-store";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export function PaymentPinScreen() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-16 h-16 rounded-full bg-[#034ea2]/10 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-8 h-8 text-[#034ea2]" />
        </div>
        <h2 className="text-xl font-bold mb-2">تأیید پرداخت</h2>
        <p className="text-sm text-muted-foreground mb-6">
          کد PIN خود را وارد کنید
        </p>
        <button
          onClick={() => setB2CScreen("payment-receipt")}
          className="w-full h-14 rounded-2xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white font-bold"
        >
          تأیید
        </button>
      </motion.div>
    </div>
  );
}
