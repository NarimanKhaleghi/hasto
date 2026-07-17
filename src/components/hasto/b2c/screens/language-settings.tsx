"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/hasto-store";
import { fa } from "@/lib/hasto-data";
import { Languages, Check, Globe, Calendar, Hash, Type } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type LanguageOption = {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: "rtl" | "ltr";
};

const languages: LanguageOption[] = [
  { code: "fa", name: "فارسی", nativeName: "Persian", flag: "🇮🇷", direction: "rtl" },
  { code: "en", name: "انگلیسی", nativeName: "English", flag: "🇬🇧", direction: "ltr" },
  { code: "ar", name: "عربی", nativeName: "Arabic", flag: "🇸🇦", direction: "rtl" },
  { code: "tr", name: "ترکی", nativeName: "Turkish", flag: "🇹🇷", direction: "ltr" },
  { code: "ku", name: "کردی", nativeName: "Kurdish", flag: "🏳️", direction: "rtl" },
];

export function LanguageSettingsScreen() {
  const [selectedLang, setSelectedLang] = useState("fa");
  const [numberFormat, setNumberFormat] = useState<"fa" | "en">("fa");
  const [dateFormat, setDateFormat] = useState<"shamsi" | "gregorian" | "hijri">("shamsi");
  const [fontPreference, setFontPreference] = useState<"default" | "large" | "xlarge">("default");

  const handleLangChange = (code: string) => {
    setSelectedLang(code);
    const lang = languages.find((l) => l.code === code);
    toast.success(`زبان تغییر یافت به ${lang?.name}`);
  };

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] text-white shadow-lg"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
              <Languages className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-base">زبان و منطقه</h2>
              <p className="text-[11px] text-white/70">تنظیمات نمایش و قالب</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Language selection */}
      <div className="px-4 mb-4">
        <h3 className="font-bold text-sm mb-2 flex items-center gap-1.5">
          <Globe className="w-4 h-4 text-[#034ea2] dark:text-[#6BA0F5]" />
          زبان برنامه
        </h3>
        <div className="space-y-2">
          {languages.map((lang, idx) => (
            <motion.button
              key={lang.code}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => handleLangChange(lang.code)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-2xl border transition-all",
                selectedLang === lang.code
                  ? "bg-[#034ea2]/5 dark:bg-[#6BA0F5]/10 border-[#034ea2] dark:border-[#6BA0F5]"
                  : "bg-card border-border hover:bg-muted/30"
              )}
            >
              <span className="text-2xl shrink-0">{lang.flag}</span>
              <div className="flex-1 text-right">
                <p className="text-sm font-bold">{lang.name}</p>
                <p className="text-[11px] text-muted-foreground" dir="ltr">{lang.nativeName}</p>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground font-bold uppercase">
                {lang.direction}
              </span>
              {selectedLang === lang.code && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 rounded-full bg-[#034ea2] dark:bg-[#6BA0F5] flex items-center justify-center shrink-0"
                >
                  <Check className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Number format */}
      <div className="px-4 mb-4">
        <div className="rounded-2xl bg-card border border-border p-3 shadow-soft">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#8B5CF6]/15 flex items-center justify-center">
              <Hash className="w-4 h-4 text-[#8B5CF6]" />
            </div>
            <div>
              <h3 className="font-bold text-sm">فرمت اعداد</h3>
              <p className="text-[10px] text-muted-foreground">نمایش ارقام</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: "fa" as const, label: "فارسی", sample: "۱۲۳۴۵۶۷۸۹۰" },
              { value: "en" as const, label: "انگلیسی", sample: "1234567890" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setNumberFormat(opt.value);
                  toast.success(`فرمت اعداد: ${opt.label}`);
                }}
                className={cn(
                  "p-2.5 rounded-xl border transition-all text-center",
                  numberFormat === opt.value
                    ? "bg-[#8B5CF6]/10 border-[#8B5CF6]"
                    : "bg-muted/50 border-border"
                )}
              >
                <p className="text-xs font-bold mb-0.5">{opt.label}</p>
                <p className="text-sm tabular-nums" dir="ltr">{opt.sample}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Date format */}
      <div className="px-4 mb-4">
        <div className="rounded-2xl bg-card border border-border p-3 shadow-soft">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#EC4899]/15 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-[#EC4899]" />
            </div>
            <div>
              <h3 className="font-bold text-sm">فرمت تاریخ</h3>
              <p className="text-[10px] text-muted-foreground">نوع تقویم</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "shamsi" as const, label: "شمسی", sample: "۱۴۰۵/۰۴/۲۵" },
              { value: "gregorian" as const, label: "میلادی", sample: "2026/07/16" },
              { value: "hijri" as const, label: "قمری", sample: "۱۴۴۸/۰۲/۰۱" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setDateFormat(opt.value);
                  toast.success(`فرمت تاریخ: ${opt.label}`);
                }}
                className={cn(
                  "p-2.5 rounded-xl border transition-all text-center",
                  dateFormat === opt.value
                    ? "bg-[#EC4899]/10 border-[#EC4899]"
                    : "bg-muted/50 border-border"
                )}
              >
                <p className="text-xs font-bold mb-0.5">{opt.label}</p>
                <p className="text-[10px] tabular-nums" dir="ltr">{opt.sample}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Font size */}
      <div className="px-4 mb-4">
        <div className="rounded-2xl bg-card border border-border p-3 shadow-soft">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/15 flex items-center justify-center">
              <Type className="w-4 h-4 text-[#F59E0B]" />
            </div>
            <div>
              <h3 className="font-bold text-sm">اندازه فونت</h3>
              <p className="text-[10px] text-muted-foreground">راحتی خواندن</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "default" as const, label: "عادی", size: "text-sm" },
              { value: "large" as const, label: "بزرگ", size: "text-base" },
              { value: "xlarge" as const, label: "خیلی بزرگ", size: "text-lg" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setFontPreference(opt.value);
                  toast.success(`اندازه فونت: ${opt.label}`);
                }}
                className={cn(
                  "p-2.5 rounded-xl border transition-all text-center",
                  fontPreference === opt.value
                    ? "bg-[#F59E0B]/10 border-[#F59E0B]"
                    : "bg-muted/50 border-border"
                )}
              >
                <p className={cn("font-bold", opt.size)}>{opt.label}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="px-4">
        <div className="p-3 rounded-2xl bg-muted/50 border border-border flex items-start gap-2">
          <Globe className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            تنظیمات زبان و منطقه بر تمام بخش‌های برنامه اعمال می‌شود. در نسخه نمایشی، تغییرات ذخیره نمی‌شوند.
          </p>
        </div>
      </div>
    </div>
  );
}
