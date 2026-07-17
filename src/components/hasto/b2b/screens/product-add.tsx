"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/hasto-store";
import { fa } from "@/lib/hasto-data";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Package,
  Tag,
  FileText,
  Boxes,
  ImagePlus,
  Save,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Loader2,
} from "lucide-react";

const categories = [
  "پوشاک مردانه",
  "پوشاک زنانه",
  "کیف و کفش",
  "اکسسوری",
  "لوازم خانگی",
  "دیجیتال",
  "غذا و خوراکی",
  "سایر",
];

export function B2BProductAddScreen() {
  const goBackB2B = useAppStore((s) => s.goBackB2B);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [inventory, setInventory] = useState("");
  const [hasImage, setHasImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const formValid = name.trim().length >= 2 && price.length >= 4;

  const handleSave = () => {
    if (!formValid) {
      toast.error("نام و قیمت محصول را کامل کنید");
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      toast.success("محصول با موفقیت ذخیره شد");
    }, 1200);
    setTimeout(() => {
      goBackB2B();
    }, 2500);
  };

  return (
    <div className="pb-24">
      {/* Header info */}
      <div className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-[#034ea2]/10 to-[#0456B5]/5 border border-[#034ea2]/10"
        >
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-5 h-5 text-[#034ea2] dark:text-[#6BA0F5]" />
            <h2 className="font-bold text-base">محصول جدید</h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            اطلاعات محصول را وارد کنید. فیلدهای ستاره‌دار الزامی هستند.
          </p>
        </motion.div>
      </div>

      {/* Live preview */}
      <div className="px-4 mt-4">
        <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5 px-1">
          <Sparkles className="w-3.5 h-3.5" />
          پیش‌نمایش محصول
        </div>
        <motion.div
          layout
          className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden"
        >
          <div className="flex items-stretch">
            <div
              className={cn(
                "w-24 shrink-0 flex items-center justify-center text-white relative transition-colors",
                hasImage
                  ? "bg-muted-foreground/15"
                  : "bg-gradient-to-br from-[#034ea2] to-[#0456B5]"
              )}
            >
              {hasImage ? (
                <ImagePlus className="w-7 h-7 text-muted-foreground" />
              ) : (
                <span className="text-3xl font-bold">
                  {name ? name.charAt(0) : "?"}
                </span>
              )}
            </div>
            <div className="flex-1 p-3 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-bold text-sm truncate">
                  {name || "نام محصول"}
                </h3>
              </div>
              <p className="text-[11px] text-muted-foreground mb-2">{category}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm tabular-nums text-[#034ea2] dark:text-[#6BA0F5]">
                    {price ? fa(Number(price).toLocaleString()) : "۰"}
                  </p>
                  <p className="text-[10px] text-muted-foreground">تومان</p>
                </div>
                {inventory && (
                  <div className="text-[11px] text-muted-foreground">
                    موجودی: {fa(inventory)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Form */}
      <div className="px-4 mt-4 space-y-4">
        {/* Image upload */}
        <Field label="تصویر محصول" icon={ImagePlus}>
          <button
            onClick={() => {
              setHasImage(true);
              toast.success("تصویر آپلود شد");
            }}
            className={cn(
              "w-full h-32 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-all",
              hasImage
                ? "border-success bg-success/5"
                : "border-border bg-muted/30 hover:border-[#034ea2]"
            )}
          >
            {hasImage ? (
              <>
                <CheckCircle2 className="w-8 h-8 text-success" />
                <span className="text-xs font-bold text-success">تصویر انتخاب شد</span>
              </>
            ) : (
              <>
                <ImagePlus className="w-8 h-8 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">برای انتخاب کلیک کنید</span>
              </>
            )}
          </button>
        </Field>

        {/* Name */}
        <Field label="نام محصول" required icon={Tag}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 50))}
            placeholder="مثلاً: پیراهن مردانه مجلسی"
            className={inputCls}
          />
          <p className="text-[10px] text-muted-foreground mt-1 px-1">
            {fa(name.length)} / {fa(50)} کاراکتر
          </p>
        </Field>

        {/* Price */}
        <Field label="قیمت (تومان)" required icon={Tag}>
          <input
            type="text"
            inputMode="numeric"
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/\D/g, "").slice(0, 12))}
            placeholder="۰"
            className={cn(inputCls, "text-lg font-bold tabular-nums")}
            dir="ltr"
          />
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {[50000, 100000, 500000, 1000000, 5000000].map((q) => (
              <button
                key={q}
                onClick={() => setPrice(String(q))}
                className="px-3 py-1 rounded-lg bg-muted hover:bg-accent text-[11px] font-medium transition-colors"
              >
                {fa(q.toLocaleString())}
              </button>
            ))}
          </div>
        </Field>

        {/* Category */}
        <Field label="دسته‌بندی" icon={Boxes}>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "h-11 rounded-xl border-2 text-xs font-medium transition-all",
                  category === c
                    ? "border-[#034ea2] bg-[#034ea2]/5 text-[#034ea2] dark:text-[#6BA0F5]"
                    : "border-border bg-background text-muted-foreground"
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </Field>

        {/* Inventory */}
        <Field label="موجودی (تعداد)" icon={Boxes}>
          <input
            type="text"
            inputMode="numeric"
            value={inventory}
            onChange={(e) => setInventory(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="اختیاری"
            className={inputCls}
            dir="ltr"
          />
        </Field>

        {/* Description */}
        <Field label="توضیحات" icon={FileText}>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 200))}
            placeholder="توضیحات محصول، ویژگی‌ها و..."
            className={cn(inputCls, "h-24 resize-none py-3")}
          />
          <p className="text-[10px] text-muted-foreground mt-1 px-1">
            {fa(description.length)} / {fa(200)} کاراکتر
          </p>
        </Field>
      </div>

      {/* Submit button */}
      <div className="px-4 mt-6">
        <button
          onClick={handleSave}
          disabled={saving || success}
          className={cn(
            "w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all",
            success
              ? "bg-success text-white"
              : formValid
              ? "bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white shadow-glow active:scale-[0.98]"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              در حال ذخیره...
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              محصول ذخیره شد
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              ذخیره محصول
            </>
          )}
        </button>

        <button
          onClick={goBackB2B}
          className="w-full h-12 mt-2 text-sm text-muted-foreground flex items-center justify-center gap-1"
        >
          <ArrowRight className="w-4 h-4" />
          انصراف
        </button>
      </div>

      {/* Success overlay */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-24 h-24 rounded-full bg-success flex items-center justify-center"
            >
              <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls =
  "w-full h-12 px-4 rounded-2xl bg-background border-2 border-border focus:border-[#034ea2] outline-none text-sm font-medium transition-colors";

function Field({
  label,
  required,
  icon: Icon,
  children,
}: {
  label: string;
  required?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5 px-1">
        <Icon className="w-3.5 h-3.5" />
        {label}
        {required && <span className="text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}
