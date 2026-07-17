"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/hasto-store";
import { business, fa } from "@/lib/hasto-data";
import { SectionCard } from "@/components/hasto/shared/ui";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Store,
  User,
  FileText,
  MapPin,
  Phone,
  CreditCard,
  Building2,
  Wallet,
  Bell,
  Shield,
  KeyRound,
  Smartphone,
  LogOut,
  ChevronLeft,
  Pencil,
  Zap,
  CheckCircle2,
  CalendarClock,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";

export function B2BSettingsScreen() {
  const setB2BScreen = useAppStore((s) => s.setB2BScreen);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  return (
    <div className="pb-4">
      {/* Profile section */}
      <div className="px-4 pt-4">
        <SectionCard title="اطلاعات کسب‌وکار" icon={Store} action={<EditButton />}>
          <div className="space-y-2">
            <InfoRow icon={Store} label="نام" value={business.profile.name} />
            <InfoRow icon={User} label="مالک" value={business.profile.owner} />
            <InfoRow icon={Building2} label="نوع" value={business.profile.type} />
            <InfoRow icon={FileText} label="شماره ثبت" value={business.profile.registrationNumber} ltr />
            <InfoRow icon={MapPin} label="آدرس" value={business.profile.address} />
            <InfoRow icon={Phone} label="تلفن" value={business.profile.phone} ltr />
            <InfoRow icon={CalendarClock} label="تاریخ عضویت" value={business.profile.joinDate} ltr />
          </div>
        </SectionCard>
      </div>

      {/* Bank info */}
      <div className="px-4 mt-4">
        <SectionCard title="اطلاعات بانکی" icon={CreditCard} action={<EditButton />}>
          <div className="space-y-2">
            <InfoRow icon={Wallet} label="شماره حساب" value={business.bankInfo.accountNumber} ltr />
            <InfoRow icon={CreditCard} label="شماره شبا" value={business.bankInfo.sheba} ltr />
            <InfoRow icon={User} label="صاحب حساب" value={business.bankInfo.accountHolder} />
            <InfoRow icon={Building2} label="بانک" value={business.bankInfo.bank} />
          </div>
        </SectionCard>
      </div>

      {/* Settlement settings */}
      <div className="px-4 mt-4">
        <SectionCard title="تنظیمات تسویه" icon={Wallet}>
          <div className="space-y-3">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5 px-1">
                <CalendarClock className="w-3.5 h-3.5" />
                فرکانس تسویه
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["روزانه", "هفتگی", "ماهانه"].map((freq, i) => (
                  <button
                    key={freq}
                    className={cn(
                      "h-11 rounded-xl border-2 text-xs font-bold transition-all",
                      i === 0
                        ? "border-[#034ea2] bg-[#034ea2]/5 text-[#034ea2] dark:text-[#6BA0F5]"
                        : "border-border bg-background text-muted-foreground"
                    )}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5 px-1">
                <Wallet className="w-3.5 h-3.5" />
                حداقل مبلغ تسویه (تومان)
              </label>
              <input
                type="text"
                inputMode="numeric"
                defaultValue="۱۰۰,۰۰۰"
                className="w-full h-12 px-4 rounded-2xl bg-background border-2 border-border focus:border-[#034ea2] outline-none text-sm font-bold tabular-nums transition-colors"
                dir="ltr"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-2xl bg-warning/5 border border-warning/15">
              <div className="flex items-center gap-2 min-w-0">
                <Zap className="w-4 h-4 text-warning shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-bold">تسویه فوری</p>
                  <p className="text-[10px] text-muted-foreground">
                    با کارمزد ۱.۵٪ — حداکثر تا ۱۰ دقیقه
                  </p>
                </div>
              </div>
              <ToggleSwitch defaultChecked={false} />
            </div>
          </div>
        </SectionCard>
      </div>

      {/* Notifications */}
      <div className="px-4 mt-4">
        <SectionCard title="اعلان‌ها" icon={Bell}>
          <div className="space-y-2">
            <NotifRow
              icon={Bell}
              label="اعلان پرداخت جدید"
              desc="اطلاع رسانی هنگام دریافت پرداخت"
              defaultChecked
            />
            <NotifRow
              icon={Wallet}
              label="اعلان تسویه"
              desc="اطلاع رسانی هنگام تسویه حساب"
              defaultChecked
            />
            <NotifRow
              icon={FileText}
              label="اعلان قرارداد"
              desc="اطلاع رسانی تغییرات قراردادها"
              defaultChecked
            />
            <NotifRow
              icon={CalendarClock}
              label="گزارش روزانه"
              desc="خلاصه روزانه فعالیت کسب‌وکار"
              defaultChecked={false}
            />
          </div>
        </SectionCard>
      </div>

      {/* Account section */}
      <div className="px-4 mt-4">
        <SectionCard title="حساب کاربری" icon={Shield}>
          <div className="divide-y divide-border -my-2">
            <AccountRow
              icon={KeyRound}
              label="تغییر رمز"
              onClick={() => toast.success("باز کردن صفحه تغییر رمز")}
            />
            <AccountRow
              icon={Smartphone}
              label="مدیریت دستگاه‌ها"
              badge={`${fa(2)} دستگاه`}
              onClick={() => toast.success("باز کردن صفحه دستگاه‌ها")}
            />
          </div>
        </SectionCard>
      </div>

      {/* Logout */}
      <div className="px-4 mt-4">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="w-full h-14 rounded-2xl bg-destructive/10 text-destructive font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <LogOut className="w-5 h-5" />
          خروج از حساب
        </button>
      </div>

      {/* Version */}
      <div className="px-4 mt-4 text-center">
        <p className="text-xs text-muted-foreground">نسخه {fa("۱.۰.۰")}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">
          پنل کسب‌وکار هستو — © {fa(1405)}
        </p>
      </div>

      {/* Logout confirmation */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <LogoutConfirm
            onClose={() => setShowLogoutConfirm(false)}
            onConfirm={() => {
              setShowLogoutConfirm(false);
              toast.success("خروج موفق");
              setB2BScreen("b2b-login");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== Sub-components ====================
function EditButton() {
  return (
    <button
      onClick={() => toast.success("حالت ویرایش فعال شد")}
      className="flex items-center gap-1 text-xs font-bold text-[#034ea2] dark:text-[#6BA0F5] px-2 py-1 rounded-lg hover:bg-accent transition-colors"
    >
      <Pencil className="w-3 h-3" />
      ویرایش
    </button>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
  ltr,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  ltr?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/40">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <span className="text-xs text-muted-foreground flex-1">{label}</span>
      <span
        className="text-xs font-bold tabular-nums max-w-[60%] truncate"
        dir={ltr ? "ltr" : "rtl"}
      >
        {value}
      </span>
    </div>
  );
}

function NotifRow({
  icon: Icon,
  label,
  desc,
  defaultChecked,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  desc: string;
  defaultChecked: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/40">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-[10px] text-muted-foreground">{desc}</p>
      </div>
      <ToggleSwitch checked={checked} onChange={setChecked} />
    </div>
  );
}

function AccountRow({
  icon: Icon,
  label,
  badge,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  badge?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 py-3 hover:bg-accent/30 transition-colors"
    >
      <Icon className="w-4 h-4 text-[#034ea2] dark:text-[#6BA0F5] shrink-0" />
      <span className="flex-1 text-right text-sm font-medium">{label}</span>
      {badge && (
        <span className="text-[11px] text-muted-foreground px-2 py-0.5 rounded-md bg-muted">
          {badge}
        </span>
      )}
      <ChevronLeft className="w-4 h-4 text-muted-foreground shrink-0" />
    </button>
  );
}

function ToggleSwitch({
  checked: checkedProp,
  onChange,
  defaultChecked,
}: {
  checked?: boolean;
  onChange?: (v: boolean) => void;
  defaultChecked?: boolean;
}) {
  const [internal, setInternal] = useState(defaultChecked ?? false);
  const checked = checkedProp ?? internal;
  const handle = (v: boolean) => {
    if (onChange) onChange(v);
    else setInternal(v);
  };
  return (
    <button
      onClick={() => handle(!checked)}
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

function LogoutConfirm({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[340px] bg-card rounded-3xl p-5 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center mb-4">
          <div className="w-14 h-14 rounded-full bg-destructive/15 flex items-center justify-center mb-3">
            <AlertTriangle className="w-7 h-7 text-destructive" />
          </div>
          <h3 className="font-bold text-base mb-1">خروج از حساب</h3>
          <p className="text-xs text-muted-foreground">
            آیا از خروج از حساب کسب‌وکار مطمئن هستید؟
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-xl bg-muted text-muted-foreground font-bold"
          >
            انصراف
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 h-12 rounded-xl bg-destructive text-white font-bold flex items-center justify-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            خروج
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
