"use client";

import { useState } from "react";
import { business, fa } from "@/lib/hasto-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Code2, Eye, EyeOff, Copy, Check } from "lucide-react";

export function B2BToolApiScreen() {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState<"live" | "test" | null>(null);

  const copyKey = (key: string, type: "live" | "test") => {
    navigator.clipboard?.writeText(key);
    setCopied(type);
    toast.success("کلید کپی شد");
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="pb-4 px-4 pt-4 space-y-4">
      {/* API Keys */}
      <div className="rounded-2xl bg-card border border-border p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-[#034ea2]" />
          <h3 className="font-bold text-sm">کلیدهای API</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-muted-foreground mb-1 block">کلید اصلی</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-10 px-3 rounded-xl bg-muted border border-border flex items-center font-mono text-xs">
                {showKey ? business.api.apiKey : "••••••••••••••••••••"}
              </div>
              <button onClick={() => setShowKey(!showKey)} className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center">
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={() => copyKey(business.api.apiKey, "live")}
                className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center">
                {copied === "live" ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-muted-foreground mb-1 block">کلید تست</label>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-10 px-3 rounded-xl bg-muted border border-border flex items-center font-mono text-xs">
                {showKey ? business.api.testKey : "••••••••••••••••••••"}
              </div>
              <button onClick={() => copyKey(business.api.testKey, "test")}
                className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center">
                {copied === "test" ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
          <span>محدودیت: {business.api.rateLimit}</span>
          <span>آخرین استفاده: {business.api.lastUsed}</span>
        </div>
      </div>

      {/* Code Example */}
      <div className="rounded-2xl bg-card border border-border p-4">
        <h3 className="font-bold text-sm mb-3">نمونه کد</h3>
        <pre className="bg-muted rounded-xl p-3 text-[10px] font-mono overflow-x-auto text-left" dir="ltr">
{`curl -X POST https://api.hasto.to/v1/pay \
  -H "Authorization: Bearer ${business.api.testKey}" \
  -H "Content-Type: application/json" \
  -d '{"amount": 100000, "description": "فروش"}'`}
        </pre>
      </div>
    </div>
  );
}
