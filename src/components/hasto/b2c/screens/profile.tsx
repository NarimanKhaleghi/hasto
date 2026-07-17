"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/hasto-store";
import { user, fa } from "@/lib/hasto-data";
import { motion } from "framer-motion";
import {
  Settings,
  Shield,
  Bell,
  Eye,
  MoreHorizontal,
  ChevronLeft,
  LogOut,
  Info,
  FileText,
  Lock,
  Mail,
  Phone,
  Star,
  Fingerprint,
  Smartphone,
  History,
  Moon,
  Sun,
  Monitor,
  Globe,
  Hash,
  CalendarDays,
  Languages,
  Heart,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ThemeMode = "light" | "dark" | "system";

export function ProfileScreen() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);
  const setAuthenticated = useAppStore((s) => s.setAuthenticated);

  const [language, setLanguage] = useState<"fa" | "en">("fa");
  const [numFormat, setNumFormat] = useState<"fa" | "en">("fa");
  const [dateFormat, setDateFormat] = useState<"shamsi" | "miladi">("shamsi");
  const [themeMode, setThemeMode] = useState<ThemeMode>(
    theme === "dark" ? "dark" : "light"
  );

  // Notification toggles
  const [notifPayment, setNotifPayment] = useState(true);
  const [notifBill, setNotifBill] = useState(true);
  const [notifContract, setNotifContract] = useState(true);
  const [notifDebt, setNotifDebt] = useState(true);
  const [quietHours, setQuietHours] = useState(false);

  // Security toggles
  const [biometric, setBiometric] = useState(true);

  // Privacy toggles
  const [showBalance, setShowBalance] = useState(true);
  const [showTx, setShowTx] = useState(true);

  const [showLogout, setShowLogout] = useState(false);

  const handleThemeMode = (mode: ThemeMode) => {
    setThemeMode(mode);
    if (mode === "light") setTheme("light");
    else if (mode === "dark") setTheme("dark");
    // system mode: leave as-is in this demo
    toast.success(`تم به ${mode === "light" ? "روشن" : mode === "dark" ? "تاریک" : "سیستم"} تغییر یافت`);
  };

  const handleLogout = () => {
    setShowLogout(false);
    setAuthenticated(false);
    setB2CScreen("login");
    toast.success("از حساب کاربری خارج شدید");
  };

  return (
    <div className="p-4 pb-8">
      {/* ============ User Header ============ */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl p-5 mb-4 shadow-2xl shadow-[#034ea2]/20 wallet-gradient"
      >
        <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-12 -right-8 w-40 h-40 rounded-full bg-white/5" />

        <div className="relative z-10 flex items-center gap-4">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/95 to-white/70 flex items-center justify-center text-2xl font-bold text-[#034ea2] shadow-lg shrink-0">
            {user.name.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="text-white font-bold text-base truncate">{user.name}</h2>
              <span className="px-1.5 py-0.5 rounded-md bg-white/15 text-white text-[10px] font-medium">
                تایید شده
              </span>
            </div>
            <p className="text-white/70 text-xs mb-1.5">{user.phoneMasked}</p>
            <p className="text-white/60 text-[11px]">
              عضو هستو از {user.joinDate}
            </p>
          </div>
        </div>

        <button
          onClick={() => toast.info("ویرایش پروفایل", { description: "این بخش در نسخه کامل فعال خواهد بود" })}
          className="relative z-10 w-full mt-4 h-10 rounded-xl bg-white/15 hover:bg-white/20 backdrop-blur-sm text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
        >
          ویرایش پروفایل
          <ChevronLeft className="w-4 h-4" />
        </button>
      </motion.div>

      {/* ============ General Settings ============ */}
      <SettingsSection
        title="تنظیمات عمومی"
        icon={Settings}
      >
        {/* Language */}
        <SettingRow
          icon={Languages}
          iconTint="bg-[#034ea2]/10 text-[#034ea2] dark:text-[#6BA0F5]"
          label="زبان"
          desc="زبان نمایش برنامه"
        >
          <SegmentedToggle
            options={[
              { value: "fa", label: "فارسی" },
              { value: "en", label: "English" },
            ]}
            value={language}
            onChange={(v) => {
              setLanguage(v as "fa" | "en");
              toast.success(`زبان به ${v === "fa" ? "فارسی" : "English"} تغییر یافت`);
            }}
          />
        </SettingRow>

        {/* Theme */}
        <SettingRow
          icon={theme === "dark" ? Moon : Sun}
          iconTint="bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400"
          label="تم"
          desc="روشن / تاریک / سیستم"
        >
          <div className="flex items-center gap-1">
            {([
              { id: "light" as ThemeMode, icon: Sun, label: "روشن" },
              { id: "dark" as ThemeMode, icon: Moon, label: "تاریک" },
              { id: "system" as ThemeMode, icon: Monitor, label: "سیستم" },
            ]).map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleThemeMode(opt.id)}
                className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                  themeMode === opt.id
                    ? "bg-[#034ea2] text-white shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                )}
                aria-label={opt.label}
              >
                <opt.icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </SettingRow>

        {/* Number format */}
        <SettingRow
          icon={Hash}
          iconTint="bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
          label="فرمت عدد"
          desc="فارسی یا انگلیسی"
        >
          <SegmentedToggle
            options={[
              { value: "fa", label: "۱۲۳" },
              { value: "en", label: "123" },
            ]}
            value={numFormat}
            onChange={(v) => setNumFormat(v as "fa" | "en")}
          />
        </SettingRow>

        {/* Date format */}
        <SettingRow
          icon={CalendarDays}
          iconTint="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
          label="فرمت تاریخ"
          desc="شمسی یا میلادی"
          last
        >
          <SegmentedToggle
            options={[
              { value: "shamsi", label: "شمسی" },
              { value: "miladi", label: "میلادی" },
            ]}
            value={dateFormat}
            onChange={(v) => setDateFormat(v as "shamsi" | "miladi")}
          />
        </SettingRow>
      </SettingsSection>

      {/* ============ Security Settings ============ */}
      <SettingsSection title="تنظیمات امنیتی" icon={Shield}>
        <SettingRowLink
          icon={Lock}
          iconTint="bg-red-100 text-red-600 dark:bg-red-500/15 dark:text-red-400"
          label="تغییر رمز عبور"
          onClick={() => toast.info("تغییر رمز عبور", { description: "لینک تغییر رمز برای شما ارسال شد" })}
        />
        <SettingRow
          icon={Fingerprint}
          iconTint="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
          label="ورود بیومتریک"
          desc="استفاده از اثر انگشت یا چهره"
        >
          <Switch checked={biometric} onCheckedChange={setBiometric} />
        </SettingRow>
        <SettingRowLink
          icon={Smartphone}
          iconTint="bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400"
          label="مدیریت دستگاه‌های فعال"
          badge={fa(2)}
          onClick={() => toast.info("دستگاه‌های فعال", { description: "۲ دستگاه به حساب شما متصل است" })}
        />
        <SettingRowLink
          icon={History}
          iconTint="bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400"
          label="تاریخچه ورود"
          onClick={() => toast.info("تاریخچه ورود", { description: "آخرین ورودها به حساب شما" })}
          last
        />
      </SettingsSection>

      {/* ============ Notification Settings ============ */}
      <SettingsSection title="تنظیمات اعلان‌ها" icon={Bell}>
        <SettingRow
          icon={Bell}
          iconTint="bg-[#034ea2]/10 text-[#034ea2] dark:text-[#6BA0F5]"
          label="اعلان پرداخت"
          desc="اطلاع‌رسانی پرداخت‌های انجام‌شده"
        >
          <Switch checked={notifPayment} onCheckedChange={setNotifPayment} />
        </SettingRow>
        <SettingRow
          icon={FileText}
          iconTint="bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
          label="اعلان قبض"
          desc="یادآوری سررسید قبوض"
        >
          <Switch checked={notifBill} onCheckedChange={setNotifBill} />
        </SettingRow>
        <SettingRow
          icon={FileText}
          iconTint="bg-violet-100 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400"
          label="اعلان قرارداد"
          desc="پرداخت‌های خودکار قراردادها"
        >
          <Switch checked={notifContract} onCheckedChange={setNotifContract} />
        </SettingRow>
        <SettingRow
          icon={Heart}
          iconTint="bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"
          label="اعلان بدهی/طلب"
          desc="یادآوری اقساط و طلب‌ها"
        >
          <Switch checked={notifDebt} onCheckedChange={setNotifDebt} />
        </SettingRow>
        <SettingRow
          icon={Moon}
          iconTint="bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-400"
          label="ساعات آرام"
          desc="غیرفعال‌سازی اعلان‌ها ۲۲ تا ۷"
          last
        >
          <Switch checked={quietHours} onCheckedChange={setQuietHours} />
        </SettingRow>
      </SettingsSection>

      {/* ============ Privacy ============ */}
      <SettingsSection title="حریم خصوصی" icon={Eye}>
        <SettingRow
          icon={Eye}
          iconTint="bg-[#034ea2]/10 text-[#034ea2] dark:text-[#6BA0F5]"
          label="نمایش موجودی در داشبورد"
          desc="نمایش موجودی کیف پول در صفحه اصلی"
        >
          <Switch checked={showBalance} onCheckedChange={setShowBalance} />
        </SettingRow>
        <SettingRow
          icon={History}
          iconTint="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
          label="نمایش تراکنش‌ها"
          desc="ذخیره تاریخچه تراکنش‌ها"
          last
        >
          <Switch checked={showTx} onCheckedChange={setShowTx} />
        </SettingRow>
      </SettingsSection>

      {/* ============ Other ============ */}
      <SettingsSection title="سایر" icon={MoreHorizontal}>
        <SettingRowLink
          icon={Info}
          iconTint="bg-[#034ea2]/10 text-[#034ea2] dark:text-[#6BA0F5]"
          label="درباره هستو"
          onClick={() => toast.info("هستو نسخه ۱.۰.۰", { description: "پلتفرم جامع پرداخت و مدیریت مالی" })}
        />
        <SettingRowLink
          icon={FileText}
          iconTint="bg-muted text-muted-foreground"
          label="شرایط استفاده"
          onClick={() => toast.info("شرایط استفاده", { description: "در حال بازگذاری..." })}
        />
        <SettingRowLink
          icon={Lock}
          iconTint="bg-muted text-muted-foreground"
          label="سیاست حریم خصوصی"
          onClick={() => toast.info("سیاست حریم خصوصی", { description: "در حال بازگذاری..." })}
        />
        <SettingRowLink
          icon={Mail}
          iconTint="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"
          label="تماس با ما"
          onClick={() => toast.info("تماس با ما", { description: "support@hasto.to" })}
        />
        <SettingRowLink
          icon={Phone}
          iconTint="bg-sky-100 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400"
          label="پشتیبانی"
          onClick={() => toast.info("پشتیبانی هستو", { description: "تماس با پشتیبانی ۲۴ ساعته" })}
        />
        <SettingRowLink
          icon={Star}
          iconTint="bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"
          label="امتیازدهی به برنامه"
          onClick={() => toast.success("ممنون از حمایت شما!", { description: "صفحه امتیازدهی باز شد" })}
          last
        />
      </SettingsSection>

      {/* ============ Logout ============ */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={() => setShowLogout(true)}
        className="w-full mt-4 h-12 rounded-2xl bg-destructive/10 hover:bg-destructive/15 text-destructive text-sm font-bold transition-colors flex items-center justify-center gap-2 border border-destructive/20"
      >
        <LogOut className="w-4 h-4" />
        خروج از حساب
      </motion.button>

      {/* ============ Version ============ */}
      <div className="flex flex-col items-center mt-6 mb-2">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#034ea2] to-[#023069] flex items-center justify-center mb-2 shadow-md">
          <span className="text-white font-bold text-lg">H</span>
        </div>
        <p className="text-xs font-bold text-muted-foreground">هستو</p>
        <p className="text-[10px] text-muted-foreground/70 mt-0.5">
          نسخه ۱.۰.۰ • ساخته‌شده با ❤️
        </p>
      </div>

      {/* ============ Logout Confirm ============ */}
      <AlertDialog open={showLogout} onOpenChange={setShowLogout}>
        <AlertDialogContent className="max-w-[340px]">
          <AlertDialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-2">
              <LogOut className="w-6 h-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-center">خروج از حساب</AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              آیا مطمئن هستید که می‌خواهید از حساب کاربری خود خارج شوید؟ برای ورود مجدد باید شماره موبایل خود را وارد کنید.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-2">
            <AlertDialogCancel className="flex-1 h-11 rounded-xl">
              انصراف
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="flex-1 h-11 rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              خروج
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ============ Settings Section ============
function SettingsSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4"
    >
      <div className="flex items-center gap-2 mb-2 px-1">
        <div className="w-6 h-6 rounded-lg bg-[#034ea2]/10 flex items-center justify-center">
          <Icon className="w-3.5 h-3.5 text-[#034ea2] dark:text-[#6BA0F5]" />
        </div>
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
          {title}
        </h3>
      </div>
      <div className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden">
        {children}
      </div>
    </motion.div>
  );
}

// ============ Setting Row (with action on right) ============
function SettingRow({
  icon: Icon,
  iconTint,
  label,
  desc,
  children,
  last,
}: {
  icon: LucideIcon;
  iconTint: string;
  label: string;
  desc?: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3.5",
        !last && "border-b border-border/60"
      )}
    >
      <div
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
          iconTint
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground leading-tight">
          {label}
        </p>
        {desc && (
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-tight">
            {desc}
          </p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

// ============ Setting Row Link (navigates) ============
function SettingRowLink({
  icon: Icon,
  iconTint,
  label,
  badge,
  onClick,
  last,
}: {
  icon: LucideIcon;
  iconTint: string;
  label: string;
  badge?: string;
  onClick: () => void;
  last?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3.5 hover:bg-accent/50 transition-colors text-right",
        !last && "border-b border-border/60"
      )}
    >
      <div
        className={cn(
          "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
          iconTint
        )}
      >
        <Icon className="w-4 h-4" />
      </div>
      <p className="flex-1 text-sm font-semibold text-foreground">{label}</p>
      {badge && (
        <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-bold">
          {badge}
        </span>
      )}
      <ChevronLeft className="w-4 h-4 text-muted-foreground" />
    </button>
  );
}

// ============ Segmented Toggle ============
function SegmentedToggle({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex items-center bg-muted rounded-lg p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "px-2.5 h-7 rounded-md text-xs font-semibold transition-all",
            value === opt.value
              ? "bg-card text-[#034ea2] dark:text-[#6BA0F5] shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
