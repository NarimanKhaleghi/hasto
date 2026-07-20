"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/hasto-store";
import { fa, formatToman, user } from "@/lib/hasto-data";
import {
  Check,
  Share2,
  Home,
  Copy,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Landmark,
  Sparkles,
  Calendar,
  Hash,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ==================== Confetti ====================
function Confetti() {
  const colors = ["#034ea2", "#16a34a", "#F59E0B", "#8B5CF6", "#EC4899", "#6BA0F5"];
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 320,
        delay: Math.random() * 0.3,
        duration: 1.6 + Math.random() * 1.2,
        color: colors[i % colors.length],
        size: 6 + Math.random() * 6,
        rotate: Math.random() * 360,
        shape: i % 3,
      })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-start justify-center">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: -20, x: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [0, 180, 320],
            x: [0, p.x, p.x * 1.4],
            rotate: p.rotate,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
            times: [0, 0.15, 0.7, 1],
          }}
          className={cn(
            "absolute top-0",
            p.shape === 0 && "rounded-sm",
            p.shape === 1 && "rounded-full",
            p.shape === 2 && "rounded-[2px]"
          )}
          style={{
            width: p.size,
            height: p.shape === 1 ? p.size : p.size * 0.5,
            background: p.color,
          }}
        />
      ))}
    </div>
  );
}

// ==================== Receipt Row ====================
function ReceiptRow({
  icon: Icon,
  label,
  value,
  ltr,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  ltr?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
          highlight ? "bg-[#034ea2]/15" : "bg-muted/70"
        )}
      >
        <Icon
          className={cn(
            "w-4 h-4",
            highlight ? "text-[#034ea2] dark:text-[#6BA0F5]" : "text-muted-foreground"
          )}
        />
      </div>
      <span className="text-xs text-muted-foreground shrink-0">{label}</span>
      <span
        className={cn(
          "text-sm font-medium mr-auto tabular-nums text-right truncate",
          highlight && "font-bold text-[#034ea2] dark:text-[#6BA0F5]"
        )}
        dir={ltr ? "ltr" : "rtl"}
      >
        {value}
      </span>
    </div>
  );
}

// ==================== Main Screen ====================
export function TransferReceiptScreen() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);
  const transferContext = useAppStore((s) => s.transferContext);

  const ctx = transferContext;

  // Generate stable tracking number & timestamp once per mount
  const { trackingNo, dateText, timeText } = useMemo(() => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "";
    for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)];
    const now = new Date();
    const yyyy = 1404;
    const mm = String((now.getMonth() + 4) % 12 || 12).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mi = String(now.getMinutes()).padStart(2, "0");
    return {
      trackingNo: `TRK-${code}`,
      dateText: `${fa(yyyy)}/${fa(mm)}/${fa(dd)}`,
      timeText: `${fa(hh)}:${fa(mi)}`,
    };
  }, []);

  const amountText = ctx?.amountText ?? (ctx?.amount ? formatToman(ctx.amount) : "۰");
  const recipientName = ctx?.recipientName ?? "گیرنده";
  const recipientNumber = ctx?.recipientNumber ?? "—";
  const bank = ctx?.bank;
  const recipientType = ctx?.recipientType ?? "mobile";
  const description = ctx?.description;

  const shareText = useMemo(() => {
    const lines = [
      "رسید انتقال هستو",
      "━━━━━━━━━━━━━",
      `گیرنده: ${recipientName}`,
      bank ? `بانک: ${bank}` : null,
      `شماره: ${recipientNumber}`,
      `مبلغ: ${amountText} تومان`,
      description ? `توضیحات: ${description}` : null,
      `تاریخ: ${dateText} - ${timeText}`,
      `کد پیگیری: ${trackingNo}`,
      "━━━━━━━━━━━━━",
      "هستو — کیف پول هوشمند شما",
    ].filter(Boolean);
    return lines.join("\n");
  }, [recipientName, bank, recipientNumber, amountText, description, dateText, timeText, trackingNo]);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "رسید انتقال هستو",
          text: shareText,
        });
        toast.success("رسید به اشتراک گذاشته شد");
      } else {
        await navigator.clipboard?.writeText(shareText);
        toast.success("رسید در کلیپ‌بورد کپی شد", {
          description: "می‌توانید آن را جای دیگر پیست کنید.",
        });
      }
    } catch {
      // user cancelled or unsupported — fallback to clipboard
      try {
        await navigator.clipboard?.writeText(shareText);
        toast.success("رسید در کلیپ‌بورد کپی شد");
      } catch {
        toast.error("اشتراک‌گذاری ممکن نشد");
      }
    }
  };

  const handleCopyTracking = async () => {
    try {
      await navigator.clipboard?.writeText(trackingNo);
      toast.success("کد پیگیری کپی شد");
    } catch {
      /* noop */
    }
  };

  return (
    <div className="relative min-h-full flex flex-col bg-gradient-to-b from-background via-background to-[#16a34a]/8 dark:to-[#16a34a]/12 overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-success/12 blur-3xl" />
      <div className="absolute top-1/4 -left-24 w-56 h-56 rounded-full bg-[#034ea2]/8 blur-3xl" />

      {/* Top spacer */}
      <div className="h-6" />

      {/* Success hero */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-4">
        <div className="relative">
          {/* Confetti */}
          <Confetti />
          {/* Glow */}
          <div className="absolute inset-0 rounded-full bg-success/25 blur-2xl scale-125" />
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.05 }}
            className="relative w-24 h-24 rounded-full bg-gradient-to-br from-success to-emerald-600 flex items-center justify-center shadow-2xl shadow-success/40"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.35, type: "spring", damping: 10, stiffness: 280 }}
            >
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </motion.span>
            {/* Expanding ring */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
              className="absolute inset-0 rounded-full border-2 border-success"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex items-center gap-1.5 mt-5"
        >
          <Sparkles className="w-4 h-4 text-success" />
          <h1 className="font-bold text-xl">انتقال موفق بود</h1>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="text-xs text-muted-foreground mt-1 text-center"
        >
          مبلغ با موفقیت به حساب گیرنده واریز شد
        </motion.p>
      </div>

      {/* Receipt card */}
      <div className="relative z-10 px-4 mt-5 flex-1">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", damping: 22, stiffness: 240 }}
          className="relative bg-card rounded-3xl shadow-xl border border-border overflow-hidden"
        >
          {/* Dashed perforation top */}
          <div className="relative h-5 flex items-center justify-between px-2">
            <div className="w-4 h-4 rounded-full bg-background -ml-2 border border-border" />
            <div className="flex-1 mx-1 border-t-2 border-dashed border-border/70 mt-2" />
            <div className="w-4 h-4 rounded-full bg-background -mr-2 border border-border" />
          </div>

          <div className="px-5 pb-5">
            {/* Amount hero */}
            <div className="text-center pb-4">
              <p className="text-[11px] text-muted-foreground mb-1">مبلغ انتقال</p>
              <p className="text-3xl font-bold tabular-nums tracking-tight">
                {amountText}
                <span className="text-sm font-normal text-muted-foreground mr-1">تومان</span>
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-border/70 my-1" />

            {/* Rows */}
            <div className="divide-y divide-border/50">
              <ReceiptRow
                icon={
                  recipientType === "card" ? CreditCard : recipientType === "sheba" ? Landmark : Smartphone
                }
                label="گیرنده"
                value={recipientName}
                highlight
              />
              {bank && (
                <ReceiptRow icon={CreditCard} label="بانک" value={`بانک ${bank}`} />
              )}
              <ReceiptRow
                icon={Hash}
                label="شماره"
                value={recipientNumber}
                ltr
              />
              {description && (
                <ReceiptRow icon={FileText} label="توضیحات" value={description} />
              )}
              <ReceiptRow icon={Calendar} label="تاریخ" value={`${dateText} - ${timeText}`} ltr />
            </div>

            {/* Divider */}
            <div className="border-t border-dashed border-border/70 my-1" />

            {/* Tracking number */}
            <button
              onClick={handleCopyTracking}
              className="w-full flex items-center justify-between gap-3 py-3 mt-1 group"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#034ea2]/10 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-[#034ea2] dark:text-[#6BA0F5]" />
                </div>
                <span className="text-xs text-muted-foreground">کد پیگیری</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tabular-nums tracking-wider" dir="ltr">
                  {trackingNo}
                </span>
                <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-[#034ea2] dark:group-hover:text-[#6BA0F5] transition-colors" />
              </div>
            </button>

            {/* Status badge */}
            <div className="mt-2 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-success/8">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              <span className="text-[11px] font-medium text-success">پرداخت موفق</span>
            </div>
          </div>

          {/* Dashed perforation bottom */}
          <div className="relative h-5 flex items-center justify-between px-2">
            <div className="w-4 h-4 rounded-full bg-background -ml-2 border border-border" />
            <div className="flex-1 mx-1 border-t-2 border-dashed border-border/70 -mt-2" />
            <div className="w-4 h-4 rounded-full bg-background -mr-2 border border-border" />
          </div>
        </motion.div>

        {/* Balance after */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-4 flex items-center justify-between px-2 text-xs"
        >
          <span className="text-muted-foreground">موجودی باقی‌مانده</span>
          <span className="font-bold tabular-nums">
            {fa(user.wallet.balance.toLocaleString("en-US"))}{" "}
            <span className="text-muted-foreground font-normal">تومان</span>
          </span>
        </motion.div>
      </div>

      {/* Action buttons */}
      <div className="relative z-10 px-4 pt-4 pb-6 space-y-2.5">
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={handleShare}
          className="w-full h-14 py-3.5 rounded-2xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white font-bold shadow-lg shadow-[#034ea2]/25 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Share2 className="w-5 h-5" />
          اشتراک‌گذاری رسید
        </motion.button>
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.66 }}
          onClick={() => setB2CScreen("dashboard")}
          className="w-full h-14 py-3.5 rounded-2xl bg-card border border-border text-foreground font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <Home className="w-5 h-5" />
          بازگشت به خانه
        </motion.button>
      </div>
    </div>
  );
}
