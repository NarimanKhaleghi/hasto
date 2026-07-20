"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Send, Bot, MessageCircle, Check, X } from "lucide-react";

export function B2BToolTelegramBotScreen() {
  const [enabled, setEnabled] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const toggleBot = () => {
    setEnabled(!enabled);
    toast.success(enabled ? "ربات غیرفعال شد" : "ربات فعال شد");
  };

  return (
    <div className="pb-4 px-4 pt-4 space-y-4">
      <div className="rounded-2xl bg-card border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Send className="w-5 h-5 text-[#0088cc]" />
            <div>
              <h3 className="font-bold text-sm">ربات تلگرام</h3>
              <p className="text-[10px] text-muted-foreground">@hasto_business_bot</p>
            </div>
          </div>
          <button onClick={toggleBot}
            className={cn("w-12 h-7 rounded-full transition-all relative",
              enabled ? "bg-[#034ea2]" : "bg-muted")}>
            <div className={cn("w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow",
              enabled ? "right-1" : "right-6")} />
          </button>
        </div>

        {enabled && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            className="space-y-3 pt-3 border-t border-border">
            {[
              { label: "پاسخ خودکار به پیام مشتریان", default: true },
              { label: "نمایش کاتالوگ محصولات", default: true },
              { label: "ارسال خودکار لینک پرداخت", default: false },
            ].map((opt) => (
              <div key={opt.label} className="flex items-center justify-between">
                <span className="text-xs">{opt.label}</span>
                <div className={cn("w-10 h-6 rounded-full transition-all relative",
                  opt.default ? "bg-[#034ea2]" : "bg-muted")}>
                  <div className={cn("w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow",
                    opt.default ? "right-1" : "right-5")} />
                </div>
              </div>
            ))}

            <button onClick={() => setShowPreview(!showPreview)}
              className="w-full h-10 rounded-xl bg-[#0088cc]/10 text-[#0088cc] font-bold text-xs flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              پیش‌نمایش ربات
            </button>
          </motion.div>
        )}
      </div>

      {showPreview && (
        <div className="rounded-2xl bg-card border border-border p-4">
          <h4 className="font-bold text-xs mb-3">پیش‌نمایش چت</h4>
          <div className="space-y-2">
            <div className="flex justify-end"><div className="bg-[#034ea2] text-white rounded-2xl rounded-bl-sm px-3 py-2 text-xs">سلام</div></div>
            <div className="flex justify-start"><div className="bg-muted rounded-2xl rounded-br-sm px-3 py-2 text-xs max-w-[80%]">سلام! خوش آمدید 🙏<br/>محصولات ما: پیراهن مردانه ۸۵۰ هزار تومان<br/><br/> برای خرید دکمه زیر را بزنید:</div></div>
            <div className="flex justify-start"><button className="bg-[#034ea2] text-white rounded-full px-4 py-2 text-xs font-bold">🛒 خرید</button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function motion(props: any) { return props.children; }
