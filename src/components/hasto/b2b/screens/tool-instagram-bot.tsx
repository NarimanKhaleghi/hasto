"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Instagram, MessageCircle } from "lucide-react";

export function B2BToolInstagramBotScreen() {
  const [connected, setConnected] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleConnect = () => {
    toast.loading("در حال اتصال...", { id: "ig" });
    setTimeout(() => {
      setConnected(true);
      toast.success("اینستاگرام متصل شد", { id: "ig" });
    }, 1500);
  };

  return (
    <div className="pb-4 px-4 pt-4 space-y-4">
      <div className="rounded-2xl bg-card border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Instagram className="w-5 h-5 text-[#E4405F]" />
            <div>
              <h3 className="font-bold text-sm">ربات اینستاگرام</h3>
              <p className="text-[10px] text-muted-foreground">اتصال به DM اینستاگرام</p>
            </div>
          </div>
          {!connected ? (
            <button onClick={handleConnect} className="h-8 px-4 rounded-full bg-[#E4405F] text-white text-xs font-bold">
              اتصال
            </button>
          ) : (
            <span className="text-[10px] text-success font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success" /> متصل
            </span>
          )}
        </div>

        {connected && (
          <div className="space-y-3 pt-3 border-t border-border">
            {["پاسخ خودکار به DM", "نمایش محصول با کد", "پاسخ خودکار سوالات متداول"].map((opt) => (
              <div key={opt} className="flex items-center justify-between">
                <span className="text-xs">{opt}</span>
                <div className="w-10 h-6 rounded-full bg-[#034ea2] relative">
                  <div className="w-4 h-4 rounded-full bg-white absolute top-1 right-1 shadow" />
                </div>
              </div>
            ))}
            <button onClick={() => setShowPreview(!showPreview)}
              className="w-full h-10 rounded-xl bg-[#E4405F]/10 text-[#E4405F] font-bold text-xs flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" /> پیش‌نمایش
            </button>
          </div>
        )}
      </div>

      {showPreview && (
        <div className="rounded-2xl bg-card border border-border p-4">
          <h4 className="font-bold text-xs mb-3">پیش‌نمایش DM</h4>
          <div className="space-y-2">
            <div className="flex justify-end"><div className="bg-[#E4405F] text-white rounded-2xl rounded-bl-sm px-3 py-2 text-xs">قیمت پیراهن مردانه؟</div></div>
            <div className="flex justify-start"><div className="bg-muted rounded-2xl rounded-br-sm px-3 py-2 text-xs max-w-[80%]">پیراهن مردانه: ۸۵۰,۰۰۰ تومان ✅<br/>برای خرید: hasto.to/pay/PRD1-X7K2M</div></div>
          </div>
        </div>
      )}
    </div>
  );
}
