"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/hasto-store";
import { business, fa } from "@/lib/hasto-data";
import { SectionCard } from "@/components/hasto/shared/ui";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Link2,
  Package,
  QrCode,
  Copy,
  Check,
  Share2,
  Download,
  Sparkles,
  ArrowLeft,
  Store,
  Tag,
} from "lucide-react";

type Tab = "simple" | "product" | "qr";

export function B2BPaymentLinkScreen() {
  const [tab, setTab] = useState<Tab>("simple");

  return (
    <div className="pb-4">
      {/* Tab switcher */}
      <div className="px-4 pt-4 sticky top-0 z-20">
        <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-muted">
          {[
            { id: "simple" as const, label: "لینک ساده", icon: Link2 },
            { id: "product" as const, label: "لینک محصول", icon: Package },
            { id: "qr" as const, label: "QR اختصاصی", icon: QrCode },
          ].map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative h-11 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition-all",
                  active ? "text-white" : "text-muted-foreground"
                )}
              >
                {active && (
                  <motion.div
                    layoutId="pl-tab-indicator"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] shadow-glow"
                  />
                )}
                <t.icon className="w-4 h-4 relative z-10" />
                <span className="relative z-10">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {tab === "simple" && <SimpleLinkTab key="simple" />}
        {tab === "product" && <ProductLinkTab key="product" />}
        {tab === "qr" && <DedicatedQRTab key="qr" />}
      </AnimatePresence>
    </div>
  );
}

// ==================== Simple Link Tab ====================
function SimpleLinkTab() {
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [generated, setGenerated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!amount) {
      toast.error("مبلغ را وارد کنید");
      return;
    }
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    setGenerated(`hasto.to/pay/LNK-${code}`);
    toast.success("لینک با موفقیت ساخته شد");
  };

  const handleCopy = () => {
    if (!generated) return;
    navigator.clipboard?.writeText(`https://${generated}`);
    setCopied(true);
    toast.success("لینک کپی شد");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (!generated) return;
    if (navigator.share) {
      navigator.share({ title: "لینک پرداخت هستو", text: title || "پرداخت", url: `https://${generated}` });
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 mt-4 space-y-4"
    >
      <SectionCard title="اطلاعات لینک" icon={Link2}>
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5 px-1">
              <Tag className="w-3.5 h-3.5" />
              مبلغ (تومان)
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, "").slice(0, 12))}
              placeholder="۰"
              className="w-full h-14 px-4 rounded-2xl bg-background border-2 border-border focus:border-[#034ea2] outline-none text-xl font-bold tabular-nums transition-colors"
              dir="ltr"
            />
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {[50000, 100000, 500000, 1000000].map((q) => (
                <button
                  key={q}
                  onClick={() => setAmount(String(q))}
                  className="px-3 py-1.5 rounded-lg bg-muted hover:bg-accent text-xs font-medium transition-colors"
                >
                  {fa(q.toLocaleString())}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5 px-1">
              <Sparkles className="w-3.5 h-3.5" />
              عنوان / توضیحات (اختیاری)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, 60))}
              placeholder="مثلاً: پرداخت پیراهن"
              className="w-full h-12 px-4 rounded-2xl bg-background border-2 border-border focus:border-[#034ea2] outline-none text-sm font-medium transition-colors"
            />
          </div>

          <button
            onClick={handleGenerate}
            className="w-full h-14 rounded-2xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white font-bold flex items-center justify-center gap-2 shadow-glow active:scale-[0.98] transition-transform"
          >
            <Link2 className="w-5 h-5" />
            ساخت لینک
          </button>
        </div>
      </SectionCard>

      <AnimatePresence>
        {generated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="space-y-4"
          >
            <SectionCard title="لینک ساخته شد" icon={Check}>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted border border-border">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground mb-0.5">لینک پرداخت</p>
                  <p className="font-bold text-sm truncate text-[#034ea2] dark:text-[#6BA0F5]" dir="ltr">
                    {generated}
                  </p>
                </div>
                <button
                  onClick={handleCopy}
                  className="p-2.5 rounded-xl bg-card hover:bg-accent transition-colors shrink-0"
                  aria-label="کپی"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>

              {amount && (
                <div className="mt-3 p-3 rounded-xl bg-[#034ea2]/5 dark:bg-[#034ea2]/10 border border-[#034ea2]/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">مبلغ</span>
                    <span className="font-bold text-base tabular-nums">{fa(amount.toLocaleString())} تومان</span>
                  </div>
                  {title && (
                    <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-[#034ea2]/10">
                      <span className="text-xs text-muted-foreground">عنوان</span>
                      <span className="text-sm font-medium">{title}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 mt-3">
                <button
                  onClick={handleShare}
                  className="flex-1 h-12 rounded-xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                >
                  <Share2 className="w-4 h-4" />
                  اشتراک‌گذاری
                </button>
                <button
                  onClick={() => {
                    setGenerated(null);
                    setAmount("");
                    setTitle("");
                  }}
                  className="flex-1 h-12 rounded-xl bg-muted text-muted-foreground font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                >
                  لینک جدید
                </button>
              </div>
            </SectionCard>

            {/* QR Code */}
            <SectionCard title="QR کد" icon={QrCode}>
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 bg-white rounded-2xl p-3 shadow-soft">
                  <QRCodeSvg value={generated} size={168} />
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  این QR را برای مشتری نمایش دهید تا مستقیم پرداخت کند
                </p>
              </div>
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ==================== Product Link Tab ====================
function ProductLinkTab() {
  const [selectedId, setSelectedId] = useState(business.products[0]?.id ?? "");
  const [generated, setGenerated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const product = business.products.find((p) => p.id === selectedId);

  const handleGenerate = () => {
    if (!product) return;
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    setGenerated(`hasto.to/pay/${product.id}-${code}`);
    toast.success(`لینک پرداخت ${product.name} ساخته شد`);
  };

  const handleCopy = () => {
    if (!generated) return;
    navigator.clipboard?.writeText(`https://${generated}`);
    setCopied(true);
    toast.success("لینک کپی شد");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (!generated) return;
    if (navigator.share) {
      navigator.share({ title: `پرداخت ${product?.name}`, url: `https://${generated}` });
    } else {
      handleCopy();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 mt-4 space-y-4"
    >
      <SectionCard title="انتخاب محصول" icon={Package}>
        <div className="space-y-2">
          {business.products.map((p) => {
            const selected = p.id === selectedId;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedId(p.id);
                  setGenerated(null);
                }}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-2xl border-2 transition-all text-right",
                  selected
                    ? "border-[#034ea2] bg-[#034ea2]/5"
                    : "border-border bg-background hover:border-[#034ea2]/30"
                )}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#034ea2] to-[#0456B5] flex items-center justify-center text-white font-bold shrink-0">
                  {p.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">{p.category}</p>
                </div>
                <div className="text-left shrink-0">
                  <p className="font-bold text-sm tabular-nums text-[#034ea2] dark:text-[#6BA0F5]">
                    {p.priceText}
                  </p>
                  <p className="text-[10px] text-muted-foreground">تومان</p>
                </div>
                {selected && (
                  <div className="w-5 h-5 rounded-full bg-[#034ea2] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </SectionCard>

      {product && (
        <SectionCard title="خلاصه لینک" icon={Tag}>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
              <span className="text-xs text-muted-foreground">محصول</span>
              <span className="font-bold text-sm">{product.name}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
              <span className="text-xs text-muted-foreground">قیمت</span>
              <span className="font-bold text-sm tabular-nums">
                {product.priceText} <span className="text-[10px] text-muted-foreground">تومان</span>
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/50">
              <span className="text-xs text-muted-foreground">تعداد فروش</span>
              <span className="font-bold text-sm tabular-nums">{fa(product.salesCount)} عدد</span>
            </div>
          </div>
        </SectionCard>
      )}

      <button
        onClick={handleGenerate}
        disabled={!product}
        className={cn(
          "w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all",
          product
            ? "bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white shadow-glow active:scale-[0.98]"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
      >
        <Link2 className="w-5 h-5" />
        ساخت لینک پرداخت محصول
      </button>

      <AnimatePresence>
        {generated && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
          >
            <SectionCard title="لینک محصول ساخته شد" icon={Check}>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted border border-border">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-muted-foreground mb-0.5">لینک</p>
                  <p className="font-bold text-sm truncate text-[#034ea2] dark:text-[#6BA0F5]" dir="ltr">
                    {generated}
                  </p>
                </div>
                <button
                  onClick={handleCopy}
                  className="p-2.5 rounded-xl bg-card hover:bg-accent transition-colors shrink-0"
                  aria-label="کپی"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>

              <div className="flex flex-col items-center mt-3">
                <div className="w-40 h-40 bg-white rounded-2xl p-3 shadow-soft">
                  <QRCodeSvg value={generated} size={140} />
                </div>
              </div>

              <button
                onClick={handleShare}
                className="w-full h-12 rounded-xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white font-bold flex items-center justify-center gap-2 mt-3 active:scale-[0.98] transition-transform"
              >
                <Share2 className="w-4 h-4" />
                اشتراک‌گذاری
              </button>
            </SectionCard>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ==================== Dedicated QR Tab ====================
function DedicatedQRTab() {
  const slug = business.profile.name.replace(/\s+/g, "-");
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    toast.success("QR دانلود شد");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "صفحه کسب‌وکار", url: `https://hasto.to/shop/${slug}` });
    } else {
      navigator.clipboard?.writeText(`https://hasto.to/shop/${slug}`);
      setCopied(true);
      toast.success("لینک کپی شد");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="px-4 mt-4 space-y-4"
    >
      <SectionCard title="QR اختصاصی کسب‌وکار" icon={QrCode}>
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-[#034ea2] to-[#0456B5] opacity-10 blur-xl" />
            <div className="relative w-64 h-64 bg-white rounded-3xl p-4 shadow-soft">
              <QRCodeSvg value={`hasto.to/shop/${slug}`} size={224} />
            </div>
          </motion.div>

          <div className="mt-5 flex items-center gap-2">
            <Store className="w-4 h-4 text-[#034ea2] dark:text-[#6BA0F5]" />
            <span className="font-bold text-base">{business.profile.name}</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            این QR ثابت مخصوص کسب‌وکار شماست
          </p>
          <div className="mt-2 px-3 py-1.5 rounded-full bg-muted text-xs font-medium text-[#034ea2] dark:text-[#6BA0F5]" dir="ltr">
            hasto.to/shop/{slug}
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleDownload}
          className="h-14 rounded-2xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white font-bold flex items-center justify-center gap-2 shadow-glow active:scale-[0.98] transition-transform"
        >
          <Download className="w-5 h-5" />
          دانلود QR
        </button>
        <button
          onClick={handleShare}
          className="h-14 rounded-2xl bg-card border-2 border-[#034ea2]/20 text-[#034ea2] dark:text-[#6BA0F5] dark:border-[#6BA0F5]/20 font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
          اشتراک‌گذاری
        </button>
      </div>

      <div className="p-3 rounded-xl bg-info/5 border border-info/10 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-info shrink-0 mt-0.5" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          این QR را چاپ کرده و در فروشگاه خود قرار دهید. مشتریان با اسکن آن مستقیماً به صفحه کسب‌وکار شما هدایت می‌شوند.
        </p>
      </div>
    </motion.div>
  );
}

// ==================== QR Code SVG (visual mock) ====================
function QRCodeSvg({ value, size }: { value: string; size: number }) {
  const cells = 21;
  const cellSize = size / cells;
  const pattern: boolean[] = [];
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  }
  for (let i = 0; i < cells * cells; i++) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    pattern.push((hash >> 16) % 100 > 50);
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" />
      {pattern.map((on, i) => {
        if (!on) return null;
        const x = (i % cells) * cellSize;
        const y = Math.floor(i / cells) * cellSize;
        return <rect key={i} x={x} y={y} width={cellSize} height={cellSize} fill="#0f172a" />;
      })}
      {[
        [0, 0],
        [cells - 7, 0],
        [0, cells - 7],
      ].map(([cx, cy], i) => (
        <g key={i}>
          <rect x={cx * cellSize} y={cy * cellSize} width={7 * cellSize} height={7 * cellSize} fill="#0f172a" />
          <rect x={(cx + 1) * cellSize} y={(cy + 1) * cellSize} width={5 * cellSize} height={5 * cellSize} fill="white" />
          <rect x={(cx + 2) * cellSize} y={(cy + 2) * cellSize} width={3 * cellSize} height={3 * cellSize} fill="#034ea2" />
        </g>
      ))}
    </svg>
  );
}
