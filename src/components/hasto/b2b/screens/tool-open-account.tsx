"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/hasto-store";
import { ipoBanks, fa } from "@/lib/hasto-data";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Landmark, Check, ArrowLeft } from "lucide-react";

export function B2BToolOpenAccountScreen() {
  const setB2BScreen = useAppStore((s) => s.setB2BScreen);
  const goBackB2B = useAppStore((s) => s.goBackB2B);
  const [submitted, setSubmitted] = useState(false);
  const [bank, setBank] = useState("");
  const [accountType, setAccountType] = useState("");
  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [phone, setPhone] = useState("09123456789");

  const handleSubmit = () => {
    if (!bank || !accountType || !fullName) {
      toast.error("لطفاً فیلدهای ضروری را پر کنید");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center mb-6">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
            className="w-12 h-12 rounded-full bg-success flex items-center justify-center">
            <Check className="w-6 h-6 text-white" strokeWidth={3} />
          </motion.div>
        </motion.div>
        <h2 className="text-xl font-bold mb-2">درخواست ثبت شد</h2>
        <p className="text-sm text-muted-foreground mb-2">شماره پیگیری: {fa("14050418001")}</p>
        <p className="text-xs text-muted-foreground mb-6">بررسی درخواست ظرف ۲ روز کاری انجام می‌شود</p>
        <button onClick={() => goBackB2B()} className="h-12 px-8 rounded-2xl bg-[#034ea2] text-white font-bold">
          بازگشت
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 px-4 pt-4 space-y-4">
      <div className="rounded-2xl bg-[#034ea2]/5 border border-[#034ea2]/20 p-4 flex items-start gap-3">
        <Landmark className="w-5 h-5 text-[#034ea2] mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          برای افتتاح حساب جدید، اطلاعات زیر را تکمیل کنید. پس از بررسی، اطلاعات حساب به شماره موبایل شما ارسال می‌شود.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1.5 block">بانک *</label>
          <div className="grid grid-cols-2 gap-2">
            {ipoBanks.filter(b => b.connected).map((b) => (
              <button key={b.id} onClick={() => setBank(b.id)}
                className={cn("p-3 rounded-xl border-2 text-right text-sm font-bold transition-all",
                  bank === b.id ? "border-[#034ea2] bg-[#034ea2]/5" : "border-border bg-card")}>
                <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ background: b.color }} />
                {b.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1.5 block">نوع حساب *</label>
          <div className="grid grid-cols-2 gap-2">
            {["جاری", "پس‌انداز", "سرمایه‌گذاری", "قرض‌الحسنه"].map((t) => (
              <button key={t} onClick={() => setAccountType(t)}
                className={cn("p-3 rounded-xl border-2 text-sm font-bold transition-all",
                  accountType === t ? "border-[#034ea2] bg-[#034ea2]/5" : "border-border bg-card")}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1.5 block">نام و نام خانوادگی *</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="نام کامل"
            className="w-full h-12 px-4 rounded-xl bg-card border border-border text-sm font-bold focus:border-[#034ea2] outline-none" />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1.5 block">کد ملی</label>
          <input value={nationalId} onChange={(e) => setNationalId(e.target.value)} placeholder="۱۲۳۴۵۶۷۸۹۰"
            className="w-full h-12 px-4 rounded-xl bg-card border border-border text-sm font-bold tabular-nums focus:border-[#034ea2] outline-none" dir="ltr" />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1.5 block">شماره تماس</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="09123456789"
            className="w-full h-12 px-4 rounded-xl bg-card border border-border text-sm font-bold tabular-nums focus:border-[#034ea2] outline-none" dir="ltr" />
        </div>
      </div>

      <button onClick={handleSubmit}
        className="w-full h-14 rounded-2xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white font-bold shadow-lg transition-all active:scale-[0.98]">
        ثبت درخواست
      </button>
    </div>
  );
}
