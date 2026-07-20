"use client";

import { useState } from "react";
import { business, fa } from "@/lib/hasto-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Globe, ExternalLink, Copy, Check, Palette } from "lucide-react";

export function B2BToolWebPageScreen() {
  const [enabled, setEnabled] = useState(true);
  const [color, setColor] = useState("#034ea2");
  const [copied, setCopied] = useState(false);
  const url = `hasto.to/shop/${business.slug}`;

  const copyUrl = () => {
    navigator.clipboard?.writeText(`https://${url}`);
    setCopied(true);
    toast.success("آدرس کپی شد");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pb-4 px-4 pt-4 space-y-4">
      <div className="rounded-2xl bg-card border border-border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-[#034ea2]" />
            <div>
              <h3 className="font-bold text-sm">فروشگاه وب رایگان</h3>
              <p className="text-[10px] text-muted-foreground">{url}</p>
            </div>
          </div>
          <button onClick={() => setEnabled(!enabled)}
            className={cn("w-12 h-7 rounded-full transition-all relative",
              enabled ? "bg-[#034ea2]" : "bg-muted")}>
            <div className={cn("w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow",
              enabled ? "right-1" : "right-6")} />
          </button>
        </div>

        {enabled && (
          <div className="space-y-4 pt-3 border-t border-border">
            <div className="flex items-center gap-2">
              <button onClick={copyUrl}
                className="flex-1 h-10 rounded-xl bg-muted border border-border flex items-center justify-center gap-2 text-xs font-bold">
                {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                {copied ? "کپی شد" : "کپی آدرس"}
              </button>
              <button className="h-10 px-4 rounded-xl bg-[#034ea2] text-white text-xs font-bold flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" /> مشاهده
              </button>
            </div>

            <div>
              <label className="text-[10px] font-bold text-muted-foreground mb-2 flex items-center gap-1">
                <Palette className="w-3 h-3" /> رنگ صفحه
              </label>
              <div className="flex gap-2">
                {["#034ea2", "#16a34a", "#dc2626", "#8b5cf6", "#f59e0b"].map((c) => (
                  <button key={c} onClick={() => setColor(c)}
                    className={cn("w-8 h-8 rounded-full border-2 transition-all",
                      color === c ? "border-foreground scale-110" : "border-transparent")} 
                    style={{ background: c }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      {enabled && (
        <div className="rounded-2xl bg-card border border-border p-4">
          <h4 className="font-bold text-xs mb-3">پیش‌نمایش</h4>
          <div className="rounded-xl overflow-hidden border border-border">
            <div className="h-20 flex items-center justify-center text-white font-bold text-sm" style={{ background: color }}>
              {business.name}
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {business.products.filter(p => p.status === "active").slice(0, 4).map((p) => (
                <div key={p.id} className="rounded-lg border border-border p-2">
                  <div className="h-12 rounded bg-muted flex items-center justify-center text-lg mb-1">{p.name.charAt(0)}</div>
                  <p className="text-[9px] font-bold truncate">{p.name}</p>
                  <p className="text-[9px] text-[#034ea2] font-bold">{fa(p.price.toLocaleString())} ت</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
