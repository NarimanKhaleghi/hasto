"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/hasto-store";
import { ipoBanks, fa } from "@/lib/hasto-data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { CreditCard, Check } from "lucide-react";

export function B2BToolRequestPosScreen() {
  const goBackB2B = useAppStore((s) => s.goBackB2B);
  const [submitted, setSubmitted] = useState(false);
  const [bank, setBank] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [address, setAddress] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = () => {
    if (!bank || !deviceType) {
      toast.error("لطفاً بانک و نوع دستگاه را انتخاب کنید");
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
        <p className="text-sm text-muted-foreground mb-2">شماره پیگیری: {fa("14050418002")}</p>
        <p className="text-xs text-muted-foreground mb-6">دستگاه کارتخوان ظرف ۳ روز کاری تحویل داده می‌شود</p>
        <button onClick={() => goBackB2B()} className="h-12 px-8 rounded-2xl bg-[#034ea2] text-white font-bold">
          بازگشت
        </button>
      </div>
    );
  }

  return (
    <div className="pb-24 px-4 pt-4 space-y-4">
      <div className="rounded-2xl bg-[#034ea2]/5 border border-[#034ea2]/20 p-4 flex items-start gap-3">
        <CreditCard className="w-5 h-5 text-[#034ea2] mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          درخواست دستگاه کارتخوان از طریق ایران کیش. بانک مورد نظر و نوع دستگاه را انتخاب کنید.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1.5 block">بانک متصل *</label>
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
          <label className="text-xs font-bold text-muted-foreground mb-1.5 block">نوع دستگاه *</label>
          <div className="grid grid-cols-2 gap-2">
            {["کارتخوان سیار", "کارتخوان ثابت", "کارتخوان USB", "صفحه‌کلید"].map((t) => (
              <button key={t} onClick={() => setDeviceType(t)}
                className={cn("p-3 rounded-xl border-2 text-sm font-bold transition-all",
                  deviceType === t ? "border-[#034ea2] bg-[#034ea2]/5" : "border-border bg-card")}>
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1.5 block">آدرس تحویل</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="آدرس کامل برای تحویل دستگاه"
            rows={3} className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm focus:border-[#034ea2] outline-none resize-none" />
        </div>

        <div>
          <label className="text-xs font-bold text-muted-foreground mb-1.5 block">توضیحات</label>
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="توضیحات اضافی (اختیاری)"
            rows={2} className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm focus:border-[#034ea2] outline-none resize-none" />
        </div>
      </div>

      <button onClick={handleSubmit}
        className="w-full h-14 rounded-2xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white font-bold shadow-lg transition-all active:scale-[0.98]">
        ثبت درخواست
      </button>
    </div>
  );
}
