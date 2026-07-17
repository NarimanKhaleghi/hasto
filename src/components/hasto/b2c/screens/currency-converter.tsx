"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { currencies, goldPrices, cryptoPrices, fa, formatToman } from "@/lib/hasto-data";
import { TrendingUp, TrendingDown, ArrowDownUp, Coins, Bitcoin, Copy, Check, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Tab = "currency" | "gold" | "crypto";

export function CurrencyConverterScreen() {
  const [tab, setTab] = useState<Tab>("currency");
  const [amount, setAmount] = useState("1");
  const [selectedFrom, setSelectedFrom] = useState(currencies[0]);
  const [copied, setCopied] = useState(false);

  const tabs: { id: Tab; label: string; icon: typeof Coins }[] = [
    { id: "currency", label: "ارز", icon: Coins },
    { id: "gold", label: "طلا", icon: Coins },
    { id: "crypto", label: "ارز دیجیتال", icon: Bitcoin },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    toast.success("کپی شد");
    setTimeout(() => setCopied(false), 1500);
  };

  const convertToToman = () => {
    const amt = parseFloat(amount.replace(/[^\d.]/g, "")) || 0;
    return amt * selectedFrom.buyRate;
  };

  return (
    <div className="pb-4">
      {/* Tabs */}
      <div className="px-4 pt-4">
        <div className="flex gap-1 p-1 rounded-2xl bg-muted">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id);
                  if (t.id === "currency") setSelectedFrom(currencies[0]);
                  else if (t.id === "gold") setSelectedFrom({ ...goldPrices[0], buyRate: goldPrices[0].price, sellRate: goldPrices[0].price, code: "GOLD" } as typeof selectedFrom);
                  else setSelectedFrom({ ...cryptoPrices[0], buyRate: cryptoPrices[0].price, sellRate: cryptoPrices[0].price, code: cryptoPrices[0].symbol } as typeof selectedFrom);
                  setAmount("1");
                }}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all",
                  tab === t.id ? "bg-card shadow-sm text-[#034ea2] dark:text-[#6BA0F5]" : "text-muted-foreground"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Converter card */}
      <div className="px-4 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-gradient-to-br from-[#034ea2] to-[#023069] p-5 text-white shadow-lg shadow-[#034ea2]/20 relative overflow-hidden"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-12 -left-8 w-32 h-32 rounded-full bg-white/5 blur-2xl" />

          <div className="relative">
            {/* From */}
            <div className="mb-3">
              <label className="text-[10px] text-white/60 mb-1.5 block">مبلغ ورودی</label>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/10 backdrop-blur-sm">
                <input
                  type="tel"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
                  className="flex-1 bg-transparent outline-none text-2xl font-bold tabular-nums placeholder:text-white/30"
                  placeholder="0"
                  dir="ltr"
                />
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/15">
                  <span className="text-lg">{selectedFrom.flag || selectedFrom.icon}</span>
                  <span className="text-sm font-bold">{selectedFrom.code || selectedFrom.symbol}</span>
                </div>
              </div>
            </div>

            {/* Swap icon */}
            <div className="flex justify-center -my-1 relative z-10">
              <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center border-2 border-[#023069]">
                <ArrowDownUp className="w-4 h-4" />
              </div>
            </div>

            {/* To (Toman) */}
            <div className="mt-3">
              <label className="text-[10px] text-white/60 mb-1.5 block">معادل تومان</label>
              <button
                onClick={() => handleCopy(formatToman(Math.round(convertToToman())))}
                className="w-full flex items-center gap-2 p-3 rounded-2xl bg-white/10 backdrop-blur-sm hover:bg-white/15 transition-colors"
              >
                <div className="flex-1 text-right">
                  <span className="text-2xl font-bold tabular-nums">
                    {formatToman(Math.round(convertToToman()))}
                  </span>
                  <span className="text-sm font-normal mr-2">تومان</span>
                </div>
                {copied ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4 text-white/60" />
                )}
              </button>
            </div>

            {/* Rate info */}
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
              <span className="text-white/60">نرخ خرید:</span>
              <span className="font-bold tabular-nums">
                {formatToman(selectedFrom.buyRate)} تومان
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Rates list */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-sm">نرخ‌های زنده</h3>
          <button className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <RefreshCw className="w-3 h-3" />
            به‌روزرسانی
          </button>
        </div>

        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {tab === "currency" && currencies.map((c, idx) => (
              <RateRow
                key={c.code}
                flag={c.flag}
                code={c.code}
                name={c.name}
                rate={c.buyRate}
                change={c.change}
                trend={c.trend}
                selected={selectedFrom.code === c.code}
                onClick={() => setSelectedFrom(c as typeof selectedFrom)}
                delay={idx * 0.03}
              />
            ))}
            {tab === "gold" && goldPrices.map((g, idx) => (
              <RateRow
                key={g.name}
                flag={g.icon}
                code={g.name}
                name={`${g.unit}`}
                rate={g.price}
                change={g.change}
                trend={g.trend}
                selected={false}
                onClick={() => {
                  setSelectedFrom({ ...g, buyRate: g.price, sellRate: g.price, code: "GOLD", flag: g.icon, symbol: g.icon } as typeof selectedFrom);
                  setAmount("1");
                }}
                delay={idx * 0.03}
              />
            ))}
            {tab === "crypto" && cryptoPrices.map((c, idx) => (
              <RateRow
                key={c.symbol}
                flag={c.icon}
                code={c.symbol}
                name={c.name}
                rate={c.price}
                change={c.change}
                trend={c.trend}
                color={c.color}
                selected={selectedFrom.code === c.symbol}
                onClick={() => setSelectedFrom({ ...c, buyRate: c.price, sellRate: c.price, code: c.symbol, flag: c.icon, symbol: c.icon } as typeof selectedFrom)}
                delay={idx * 0.03}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Info banner */}
      <div className="px-4 mt-4">
        <div className="p-3 rounded-2xl bg-muted/50 border border-border flex items-start gap-2">
          <div className="w-5 h-5 rounded-full bg-[#034ea2]/15 dark:bg-[#6BA0F5]/15 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-[9px] font-bold text-[#034ea2] dark:text-[#6BA0F5]">i</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            نرخ‌ها به‌صورت لحظه‌ای نمایش داده می‌شوند. برای تبدیل، مبلغ را وارد کرده و ارز مورد نظر را از لیست انتخاب کنید. این نرخ‌ها نمایشی هستند.
          </p>
        </div>
      </div>
    </div>
  );
}

function RateRow({
  flag,
  code,
  name,
  rate,
  change,
  trend,
  color,
  selected,
  onClick,
  delay,
}: {
  flag: string;
  code: string;
  name: string;
  rate: number;
  change: number;
  trend: "up" | "down";
  color?: string;
  selected: boolean;
  onClick: () => void;
  delay: number;
}) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-2xl border transition-all",
        selected
          ? "bg-[#034ea2]/5 dark:bg-[#6BA0F5]/10 border-[#034ea2] dark:border-[#6BA0F5]"
          : "bg-card border-border hover:bg-muted/30"
      )}
    >
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
        style={{ background: color ? `${color}15` : "rgba(3, 78, 162, 0.08)" }}
      >
        {flag}
      </div>

      {/* Name */}
      <div className="flex-1 min-w-0 text-right">
        <p className="text-sm font-bold truncate">{code}</p>
        <p className="text-[11px] text-muted-foreground truncate">{name}</p>
      </div>

      {/* Rate */}
      <div className="text-left shrink-0">
        <p className="text-sm font-bold tabular-nums">{formatToman(rate)}</p>
        <p className="text-[10px] text-muted-foreground">تومان</p>
      </div>

      {/* Change */}
      <div
        className={cn(
          "flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-bold shrink-0",
          trend === "up" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        )}
      >
        {trend === "up" ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
        {fa(Math.abs(change))}٪
      </div>
    </motion.button>
  );
}
