"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/hasto-store";
import { business, fa } from "@/lib/hasto-data";
import { SectionCard, StatusBadge, Fab } from "@/components/hasto/shared/ui";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Package,
  Search,
  Plus,
  Pencil,
  Trash2,
  ShoppingBag,
  TrendingUp,
  CheckCircle2,
  X,
  MoreVertical,
  ImageOff,
} from "lucide-react";

type Filter = "all" | "active" | "inactive";

export function B2BProductsScreen() {
  const setB2BScreen = useAppStore((s) => s.setB2BScreen);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [activeProduct, setActiveProduct] = useState<string | null>(null);

  const filtered = business.products.filter((p) => {
    if (filter === "active" && p.status !== "active") return false;
    if (filter === "inactive" && p.status !== "inactive") return false;
    if (search && !p.name.includes(search) && !p.category.includes(search)) return false;
    return true;
  });

  const totalSales = business.products.reduce((s, p) => s + p.salesCount, 0);
  const activeCount = business.products.filter((p) => p.status === "active").length;

  return (
    <div className="pb-24">
      {/* Summary stats */}
      <div className="px-4 pt-4 grid grid-cols-3 gap-2">
        {[
          { label: "تعداد محصولات", value: fa(business.products.length), icon: Package, color: "#034ea2" },
          { label: "مجموع فروش", value: fa(totalSales), icon: TrendingUp, color: "#16a34a" },
          { label: "محصول فعال", value: fa(activeCount), icon: CheckCircle2, color: "#F59E0B" },
        ].map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl p-3 bg-card border border-border shadow-soft text-center"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2"
              style={{ background: `${s.color}15` }}
            >
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <p className="font-bold text-base tabular-nums">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Search */}
      <div className="px-4 mt-4">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی محصول..."
            className="w-full h-11 pr-10 pl-4 rounded-2xl bg-muted border border-border focus:border-[#034ea2] outline-none text-sm transition-colors"
          />
        </div>
      </div>

      {/* Filter chips */}
      <div className="px-4 mt-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: "all" as const, label: "همه" },
            { id: "active" as const, label: "فعال" },
            { id: "inactive" as const, label: "غیرفعال" },
          ].map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  "px-4 h-9 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                  active
                    ? "bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white shadow-glow"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products list */}
      <div className="px-4 mt-4 space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-muted-foreground/40 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">محصولی یافت نشد</p>
          </div>
        )}

        {filtered.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl bg-card border border-border shadow-soft overflow-hidden"
          >
            <div className="flex items-stretch">
              {/* Image placeholder */}
              <div className="w-24 shrink-0 bg-gradient-to-br from-[#034ea2] to-[#0456B5] flex items-center justify-center text-white relative">
                <span className="text-3xl font-bold">{p.name.charAt(0)}</span>
                {p.status === "inactive" && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <ImageOff className="w-5 h-5 text-white/70" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 p-3 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-bold text-sm truncate">{p.name}</h3>
                  <StatusBadge
                    status={p.status === "active" ? "active" : "expired"}
                    label={p.status === "active" ? "فعال" : "غیرفعال"}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mb-2">{p.category}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm tabular-nums text-[#034ea2] dark:text-[#6BA0F5]">
                      {p.priceText}
                    </p>
                    <p className="text-[10px] text-muted-foreground">تومان</p>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <ShoppingBag className="w-3 h-3" />
                    {fa(p.salesCount)} فروش
                  </div>
                </div>
              </div>

              {/* More button */}
              <button
                onClick={() => setActiveProduct(p.id)}
                className="px-3 hover:bg-accent transition-colors"
                aria-label="گزینه‌ها"
              >
                <MoreVertical className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* FAB */}
      <Fab icon={Plus} onClick={() => setB2BScreen("b2b-product-add")} label="افزودن محصول" />

      {/* Product action sheet */}
      <AnimatePresence>
        {activeProduct && (
          <ProductActionSheet
            productId={activeProduct}
            onClose={() => setActiveProduct(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductActionSheet({
  productId,
  onClose,
}: {
  productId: string;
  onClose: () => void;
}) {
  const goBackB2B = useAppStore((s) => s.goBackB2B);
  const product = business.products.find((p) => p.id === productId);
  if (!product) return null;

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
          <h3 className="font-bold text-base">{product.name}</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product detail */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#034ea2] to-[#0456B5] flex items-center justify-center text-white font-bold text-xl shrink-0">
            {product.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">{product.name}</p>
            <p className="text-[11px] text-muted-foreground">{product.category}</p>
            <p className="font-bold text-sm tabular-nums text-[#034ea2] dark:text-[#6BA0F5] mt-0.5">
              {product.priceText} تومان
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="p-3 rounded-xl bg-muted/50 text-center">
            <p className="text-[10px] text-muted-foreground">فروش</p>
            <p className="font-bold text-sm tabular-nums">{fa(product.salesCount)}</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/50 text-center">
            <p className="text-[10px] text-muted-foreground">وضعیت</p>
            <p className="font-bold text-sm">{product.status === "active" ? "فعال" : "غیرفعال"}</p>
          </div>
          <div className="p-3 rounded-xl bg-muted/50 text-center">
            <p className="text-[10px] text-muted-foreground">کد</p>
            <p className="font-bold text-sm tabular-nums">{product.id}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              toast.success("ویرایش محصول");
              onClose();
            }}
            className="flex-1 h-12 rounded-xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Pencil className="w-4 h-4" />
            ویرایش
          </button>
          <button
            onClick={() => {
              toast.error("محصول حذف شد");
              onClose();
            }}
            className="flex-1 h-12 rounded-xl bg-destructive/10 text-destructive font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Trash2 className="w-4 h-4" />
            حذف
          </button>
        </div>
        <button
          onClick={() => {
            onClose();
            goBackB2B();
          }}
          className="w-full mt-2 text-sm text-muted-foreground py-2"
        >
          بستن
        </button>
      </motion.div>
    </motion.div>
  );
}
