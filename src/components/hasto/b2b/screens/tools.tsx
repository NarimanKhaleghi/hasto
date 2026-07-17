"use client";

import { useState } from "react";
import { business, fa } from "@/lib/hasto-data";
import { SectionCard } from "@/components/hasto/shared/ui";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Code2,
  Send,
  Instagram,
  Globe,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  X,
  MessageCircle,
  Bot,
  Palette,
  Link2,
} from "lucide-react";

export function B2BToolsScreen() {
  return (
    <div className="pb-4 space-y-4">
      <APITool />
      <TelegramBotTool />
      <InstagramBotTool />
      <WebPageTool />
    </div>
  );
}

// ==================== Tool Section Wrapper ====================
function ToolSection({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  desc,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-4"
    >
      <SectionCard>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: iconBg }}
          >
            <Icon className="w-6 h-6" style={{ color: iconColor }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base">{title}</h3>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        </div>
        {children}
      </SectionCard>
    </motion.div>
  );
}

// ==================== 1. API Tool ====================
function APITool() {
  const [showKey, setShowKey] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [confirmNew, setConfirmNew] = useState(false);

  const maskKey = (key: string) => {
    if (showKey) return key;
    return key.slice(0, 12) + "•".repeat(20) + key.slice(-4);
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(label);
    toast.success(`${label} کپی شد`);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRegen = () => {
    if (!confirmNew) {
      setConfirmNew(true);
      setTimeout(() => setConfirmNew(false), 3000);
      return;
    }
    toast.success("کلید جدید تولید شد");
    setConfirmNew(false);
  };

  return (
    <ToolSection
      icon={Code2}
      iconBg="#034ea2/15"
      iconColor="#034ea2"
      title="API و کلید API"
      desc="برای اتصال سایت یا اپلیکیشن شما"
    >
      {/* Live Key */}
      <div className="p-3 rounded-2xl bg-muted/50 border border-border">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-success" />
            کلید اصلی (Live)
          </span>
          <button
            onClick={() => setShowKey(!showKey)}
            className="text-[11px] text-[#034ea2] dark:text-[#6BA0F5] flex items-center gap-1 font-medium"
          >
            {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showKey ? "مخفی" : "نمایش"}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <code
            className="flex-1 text-xs font-bold tabular-nums text-foreground truncate"
            dir="ltr"
          >
            {maskKey(business.api.apiKey)}
          </code>
          <button
            onClick={() => copyText(business.api.apiKey, "کلید API")}
            className="p-2 rounded-lg bg-card hover:bg-accent transition-colors shrink-0"
            aria-label="کپی"
          >
            {copied === "کلید API" ? (
              <Check className="w-3.5 h-3.5 text-success" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Test Key */}
      <div className="mt-2 p-3 rounded-2xl bg-muted/30 border border-border">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-warning" />
            کلید تست (Test)
          </span>
          <button
            onClick={() => setShowTest(!showTest)}
            className="text-[11px] text-[#034ea2] dark:text-[#6BA0F5] flex items-center gap-1 font-medium"
          >
            {showTest ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showTest ? "مخفی" : "نمایش"}
          </button>
        </div>
        <code className="text-xs font-bold tabular-nums text-muted-foreground block truncate" dir="ltr">
          {showTest ? business.api.testKey : business.api.testKey.slice(0, 14) + "•".repeat(12)}
        </code>
      </div>

      {/* Rate limit info */}
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="p-3 rounded-xl bg-muted/50">
          <p className="text-[10px] text-muted-foreground mb-0.5">سقف درخواست</p>
          <p className="text-xs font-bold">{business.api.rateLimit}</p>
        </div>
        <div className="p-3 rounded-xl bg-muted/50">
          <p className="text-[10px] text-muted-foreground mb-0.5">آخرین استفاده</p>
          <p className="text-xs font-bold">{business.api.lastUsed}</p>
        </div>
      </div>

      {/* Regen button */}
      <button
        onClick={handleRegen}
        className={cn(
          "w-full h-11 rounded-xl font-bold text-sm flex items-center justify-center gap-2 mt-3 transition-all",
          confirmNew
            ? "bg-destructive text-white"
            : "bg-muted text-muted-foreground hover:bg-accent"
        )}
      >
        <RefreshCw className={cn("w-4 h-4", confirmNew && "animate-spin")} />
        {confirmNew ? "مجدداً تایید کنید — کلید قبلی باطل می‌شود" : "تولید کلید جدید"}
      </button>

      {/* Docs */}
      <a
        href={business.api.docsUrl}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => {
          e.preventDefault();
          toast.success("در حال باز کردن مستندات...");
        }}
        className="w-full h-11 rounded-xl border-2 border-[#034ea2]/20 text-[#034ea2] dark:text-[#6BA0F5] font-bold text-sm flex items-center justify-center gap-2 mt-2 active:scale-[0.98] transition-transform"
      >
        <ExternalLink className="w-4 h-4" />
        مشاهده مستندات
      </a>

      {/* Code example */}
      <div className="mt-3">
        <p className="text-[11px] font-medium text-muted-foreground mb-1.5 px-1">
          نمونه کد
        </p>
        <div className="rounded-xl bg-slate-950 dark:bg-black/50 p-3 overflow-x-auto scrollbar-thin">
          <pre className="text-[10px] text-emerald-300 font-mono leading-relaxed" dir="ltr">
{`curl -X POST https://api.hasto.to/v1/pay \\
  -H "Authorization: Bearer ${business.api.apiKey.slice(0, 18)}..." \\
  -H "Content-Type: application/json" \\
  -d '{"amount": 850000, "description": "پیراهن مردانه"}'`}
          </pre>
        </div>
      </div>
    </ToolSection>
  );
}

// ==================== 2. Telegram Bot ====================
function TelegramBotTool() {
  const [enabled, setEnabled] = useState(false);
  const [autoReply, setAutoReply] = useState(true);
  const [showProducts, setShowProducts] = useState(true);
  const [sendLink, setSendLink] = useState(true);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <ToolSection
      icon={Send}
      iconBg="#0088cc/15"
      iconColor="#0088cc"
      title="ربات تلگرام"
      desc="پاسخگوی خودکار مشتریان در تلگرام"
    >
      <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/50 border border-border">
        <div className="flex items-center gap-2 min-w-0">
          <Bot className="w-4 h-4 text-[#0088cc] shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-bold">فعال‌سازی ربات</p>
            <p className="text-[11px] text-muted-foreground truncate">@hasto_business_bot</p>
          </div>
        </div>
        <Toggle checked={enabled} onChange={setEnabled} />
      </div>

      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2">
              <SettingToggle
                icon={MessageCircle}
                label="پاسخ خودکار"
                desc="پاسخ خودکار به پیام‌های مشتری"
                checked={autoReply}
                onChange={setAutoReply}
              />
              <SettingToggle
                icon={Sparkles}
                label="نمایش محصولات"
                desc="نمایش کاتالوگ محصولات در ربات"
                checked={showProducts}
                onChange={setShowProducts}
              />
              <SettingToggle
                icon={Link2}
                label="ارسال لینک پرداخت"
                desc="تولید و ارسال لینک پرداخت خودکار"
                checked={sendLink}
                onChange={setSendLink}
              />
            </div>

            <button
              onClick={() => setShowPreview(true)}
              className="w-full h-11 rounded-xl bg-gradient-to-l from-[#0088cc] to-[#006699] text-white font-bold text-sm flex items-center justify-center gap-2 mt-3 active:scale-[0.98] transition-transform"
            >
              <Eye className="w-4 h-4" />
              پیش‌نمایش ربات
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPreview && <TelegramPreview onClose={() => setShowPreview(false)} />}
      </AnimatePresence>
    </ToolSection>
  );
}

function TelegramPreview({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] bg-background rounded-t-3xl p-5 pb-8"
      >
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#0088cc] to-[#006699] flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold">ربات هستو</p>
              <p className="text-[10px] text-success">آنلاین</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 p-3 rounded-2xl bg-[#0088cc]/5">
          {/* Bot message */}
          <div className="flex justify-start">
            <div className="bg-white dark:bg-card rounded-2xl rounded-tr-sm px-3 py-2 max-w-[80%] shadow-sm">
              <p className="text-xs">سلام! به ربات فروشگاه لباس راما خوش آمدید 🛍️</p>
              <p className="text-xs mt-1">برای مشاهده محصولات روی دکمه زیر بزنید:</p>
            </div>
          </div>
          {/* Quick reply buttons */}
          <div className="grid grid-cols-2 gap-1.5">
            <button className="bg-white dark:bg-card rounded-xl py-2 text-[11px] font-medium text-[#0088cc] shadow-sm">
              🛒 محصولات
            </button>
            <button className="bg-white dark:bg-card rounded-xl py-2 text-[11px] font-medium text-[#0088cc] shadow-sm">
              💳 لینک پرداخت
            </button>
          </div>
          {/* User reply */}
          <div className="flex justify-end">
            <div className="bg-[#0088cc] rounded-2xl rounded-tl-sm px-3 py-2 max-w-[80%]">
              <p className="text-xs text-white">/products</p>
            </div>
          </div>
          {/* Bot response with product */}
          <div className="flex justify-start">
            <div className="bg-white dark:bg-card rounded-2xl rounded-tr-sm p-2 max-w-[90%] shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#034ea2] to-[#0456B5] flex items-center justify-center text-white font-bold shrink-0">
                  پ
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold">پیراهن مردانه</p>
                  <p className="text-[10px] text-muted-foreground">پوشاک مردانه</p>
                  <p className="text-xs font-bold text-[#034ea2] dark:text-[#6BA0F5]">۸۵۰,۰۰۰ ت</p>
                </div>
              </div>
              <button className="w-full mt-2 py-1.5 rounded-lg bg-[#0088cc] text-white text-[11px] font-bold">
                خرید
              </button>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-3">
          این یک پیش‌نمایش از چت ربات است
        </p>
      </motion.div>
    </motion.div>
  );
}

// ==================== 3. Instagram Bot ====================
function InstagramBotTool() {
  const [enabled, setEnabled] = useState(false);
  const [autoReplyDM, setAutoReplyDM] = useState(true);
  const [productByCode, setProductByCode] = useState(true);
  const [faqReply, setFaqReply] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  return (
    <ToolSection
      icon={Instagram}
      iconBg="#E1306C/15"
      iconColor="#E1306C"
      title="ربات اینستاگرام"
      desc="پاسخگوی خودکار دایرکت اینستاگرام"
    >
      <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/50 border border-border">
        <div className="flex items-center gap-2 min-w-0">
          <Bot className="w-4 h-4 text-[#E1306C] shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-bold">فعال‌سازی ربات</p>
            <p className="text-[11px] text-muted-foreground truncate">پاسخ خودکار به دایرکت</p>
          </div>
        </div>
        <Toggle checked={enabled} onChange={setEnabled} />
      </div>

      {!enabled ? (
        <button
          onClick={() => {
            toast.success("در حال اتصال به اکانت اینستاگرام...");
            setTimeout(() => {
              setEnabled(true);
              toast.success("اکانت اینستاگرام متصل شد");
            }, 1500);
          }}
          className="w-full h-11 rounded-xl bg-gradient-to-l from-[#E1306C] to-[#C13584] text-white font-bold text-sm flex items-center justify-center gap-2 mt-3 active:scale-[0.98] transition-transform"
        >
          <Instagram className="w-4 h-4" />
          اتصال به اکانت اینستاگرام
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden"
        >
          <div className="mt-3 space-y-2">
            <SettingToggle
              icon={MessageCircle}
              label="پاسخ خودکار به دایرکت"
              desc="پاسخ فوری به پیام‌های دریافتی"
              checked={autoReplyDM}
              onChange={setAutoReplyDM}
            />
            <SettingToggle
              icon={Sparkles}
              label="نمایش محصول با کد"
              desc="ارسال محصول با کد محصول"
              checked={productByCode}
              onChange={setProductByCode}
            />
            <SettingToggle
              icon={Bot}
              label="پاسخ سوالات متداول"
              desc="پاسخ خودکار به سوالات پرتکرار"
              checked={faqReply}
              onChange={setFaqReply}
            />
          </div>

          <button
            onClick={() => setShowPreview(true)}
            className="w-full h-11 rounded-xl bg-gradient-to-l from-[#E1306C] to-[#C13584] text-white font-bold text-sm flex items-center justify-center gap-2 mt-3 active:scale-[0.98] transition-transform"
          >
            <Eye className="w-4 h-4" />
            پیش‌نمایش ربات
          </button>
        </motion.div>
      )}

      <AnimatePresence>
        {showPreview && <InstagramPreview onClose={() => setShowPreview(false)} />}
      </AnimatePresence>
    </ToolSection>
  );
}

function InstagramPreview({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] bg-background rounded-t-3xl p-5 pb-8"
      >
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#FEDA75] via-[#E1306C] to-[#833AB4] flex items-center justify-center p-0.5">
              <div className="w-full h-full rounded-full bg-white dark:bg-card flex items-center justify-center">
                <Instagram className="w-4 h-4 text-[#E1306C]" />
              </div>
            </div>
            <div>
              <p className="text-sm font-bold">instagram_user</p>
              <p className="text-[10px] text-muted-foreground">دایرکت</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 p-3 rounded-2xl bg-[#E1306C]/5">
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-tr-sm px-3 py-2 max-w-[80%]">
              <p className="text-xs">سلام، قیمت پیراهن مردانه چنده؟</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-gradient-to-l from-[#E1306C] to-[#C13584] rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%]">
              <p className="text-xs text-white">سلام! پیراهن مردانه ۸۵۰,۰۰۰ تومان هست 🛍️</p>
              <p className="text-xs text-white/90 mt-1">برای خرید روی لینک زیر بزنید:</p>
              <p className="text-xs text-white font-bold mt-1 underline" dir="ltr">hasto.to/pay/PRD1-X7K2M</p>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl rounded-tr-sm px-3 py-2 max-w-[80%]">
              <p className="text-xs">موجودیه؟</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-gradient-to-l from-[#E1306C] to-[#C13584] rounded-2xl rounded-tl-sm px-3 py-2 max-w-[85%]">
              <p className="text-xs text-white">بله، موجود هست ✅</p>
            </div>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground text-center mt-3">
          این یک پیش‌نمایش از دایرکت اینستاگرام است
        </p>
      </motion.div>
    </motion.div>
  );
}

// ==================== 4. Web Page ====================
function WebPageTool() {
  const [enabled, setEnabled] = useState(true);
  const [showProducts, setShowProducts] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  const [color, setColor] = useState("#034ea2");

  const slug = business.profile.name.replace(/\s+/g, "-");

  return (
    <ToolSection
      icon={Globe}
      iconBg="#16a34a/15"
      iconColor="#16a34a"
      title="صفحه وب اختصاصی"
      desc="صفحه فروشگاه آنلاین رایگان"
    >
      <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/50 border border-border">
        <div className="flex items-center gap-2 min-w-0">
          <Globe className="w-4 h-4 text-[#16a34a] shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-bold">صفحه وب</p>
            <p className="text-[11px] text-muted-foreground truncate" dir="ltr">
              hasto.to/shop/{slug}
            </p>
          </div>
        </div>
        <Toggle checked={enabled} onChange={setEnabled} />
      </div>

      {enabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden"
        >
          <div className="mt-3 space-y-3">
            {/* Logo */}
            <div className="p-3 rounded-2xl bg-muted/50 border border-border">
              <p className="text-[11px] font-medium text-muted-foreground mb-2">لوگو</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#16a34a] to-[#15803D] flex items-center justify-center text-white font-bold shrink-0">
                  {business.profile.name.charAt(0)}
                </div>
                <button className="px-4 h-10 rounded-xl bg-card border border-border text-xs font-medium">
                  تغییر لوگو
                </button>
              </div>
            </div>

            {/* Color */}
            <div className="p-3 rounded-2xl bg-muted/50 border border-border">
              <p className="text-[11px] font-medium text-muted-foreground mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5" />
                رنگ صفحه
              </p>
              <div className="flex gap-2">
                {["#034ea2", "#16a34a", "#8B5CF6", "#F59E0B", "#E1306C"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={cn(
                      "w-9 h-9 rounded-full border-2 transition-all",
                      color === c ? "border-foreground scale-110" : "border-transparent"
                    )}
                    style={{ background: c }}
                    aria-label={`رنگ ${c}`}
                  />
                ))}
              </div>
            </div>

            {/* Show products toggle */}
            <SettingToggle
              icon={Sparkles}
              label="نمایش محصولات"
              desc="نمایش کاتالوگ محصولات در صفحه"
              checked={showProducts}
              onChange={setShowProducts}
            />
          </div>

          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setShowPreview(true)}
              className="flex-1 h-11 rounded-xl bg-gradient-to-l from-[#16a34a] to-[#15803D] text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <Eye className="w-4 h-4" />
              پیش‌نمایش صفحه
            </button>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showPreview && <WebPreview onClose={() => setShowPreview(false)} color={color} />}
      </AnimatePresence>
    </ToolSection>
  );
}

function WebPreview({ onClose, color }: { onClose: () => void; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] bg-background rounded-t-3xl max-h-[90vh] overflow-y-auto scrollbar-thin"
      >
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto my-3" />
        <div className="flex items-center justify-between px-5 mb-3">
          <p className="font-bold text-sm">پیش‌نمایش صفحه</p>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mock browser */}
        <div className="px-5 pb-8">
          <div className="rounded-2xl overflow-hidden border border-border shadow-soft">
            {/* Browser bar */}
            <div className="bg-muted px-3 py-2 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-destructive/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-warning/40" />
                <div className="w-2.5 h-2.5 rounded-full bg-success/40" />
              </div>
              <div className="flex-1 px-2 py-0.5 rounded-md bg-background text-[9px] text-muted-foreground truncate" dir="ltr">
                hasto.to/shop/{business.profile.name.replace(/\s+/g, "-")}
              </div>
            </div>

            {/* Page content */}
            <div className="bg-background">
              {/* Hero */}
              <div
                className="p-4 text-white"
                style={{ background: `linear-gradient(135deg, ${color}, ${color}DD)` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                    {business.profile.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-base">{business.profile.name}</p>
                    <p className="text-[10px] opacity-80">{business.profile.type}</p>
                  </div>
                </div>
                <p className="text-[10px] mt-2 opacity-80">{business.profile.address}</p>
              </div>

              {/* Products grid */}
              <div className="p-3">
                <p className="text-xs font-bold mb-2">محصولات</p>
                <div className="grid grid-cols-2 gap-2">
                  {business.products.slice(0, 4).map((p) => (
                    <div key={p.id} className="rounded-xl overflow-hidden border border-border">
                      <div
                        className="h-16 flex items-center justify-center text-white font-bold"
                        style={{ background: `linear-gradient(135deg, ${color}, ${color}AA)` }}
                      >
                        {p.name.charAt(0)}
                      </div>
                      <div className="p-2">
                        <p className="text-[10px] font-bold truncate">{p.name}</p>
                        <p className="text-[10px] tabular-nums" style={{ color }}>
                          {p.priceText} ت
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buy button */}
              <div className="p-3 pt-0">
                <button
                  className="w-full h-9 rounded-lg text-white text-xs font-bold"
                  style={{ background: color }}
                >
                  پرداخت امن هستو
                </button>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-3">
            این یک پیش‌نمایش از صفحه وب شماست
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==================== Shared toggle components ====================
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-11 h-6 rounded-full transition-colors shrink-0",
        checked ? "bg-[#034ea2] dark:bg-[#6BA0F5]" : "bg-muted"
      )}
      role="switch"
      aria-checked={checked}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={cn(
          "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-md",
          checked ? "right-0.5" : "right-5"
        )}
      />
    </button>
  );
}

function SettingToggle({
  icon: Icon,
  label,
  desc,
  checked,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50 border border-border">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-[10px] text-muted-foreground">{desc}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}
