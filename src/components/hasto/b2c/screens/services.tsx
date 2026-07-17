"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Sparkles, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  serviceCategories,
  fa,
  type ServiceCategory,
  type Service,
} from "@/lib/hasto-data";

// ==================== Helpers ====================
/**
 * Convert a hex color like "#034ea2" into an "r g b / a" string.
 * Returns a safe fallback for non-hex inputs.
 */
function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return `rgba(3, 78, 162, ${alpha})`;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return `rgba(3, 78, 162, ${alpha})`;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** A single flattened service item, carrying its parent category for color/icon context. */
type FlatService = Service & {
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  categoryId: string;
};

// ==================== Main Screen ====================
export function ServicesScreen() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all"); // "all" | category name

  // Flatten all services once for search + counting.
  const allServices: FlatService[] = useMemo(() => {
    const out: FlatService[] = [];
    serviceCategories.forEach((cat, idx) => {
      cat.services.forEach((svc) => {
        out.push({
          ...svc,
          categoryName: cat.name,
          categoryIcon: cat.icon,
          categoryColor: cat.color,
          categoryId: `cat-${idx}`,
        });
      });
    });
    return out;
  }, []);

  const totalCount = allServices.length;

  // Normalize query for Persian/English digit and case-insensitive match.
  const normalizedQuery = query.trim().toLowerCase();

  // Filtered categories — when "all" is active, all 18 categories are in scope.
  const visibleCategories: ServiceCategory[] = useMemo(() => {
    if (activeCategory === "all") return serviceCategories;
    return serviceCategories.filter((c) => c.name === activeCategory);
  }, [activeCategory]);

  // Apply search filter on top of the visible categories.
  const filteredCategories = useMemo(() => {
    if (!normalizedQuery) return visibleCategories;
    return visibleCategories
      .map((cat) => ({
        ...cat,
        services: cat.services.filter((s) =>
          s.name.toLowerCase().includes(normalizedQuery)
        ),
      }))
      .filter((cat) => cat.services.length > 0);
  }, [visibleCategories, normalizedQuery]);

  const filteredCount = useMemo(
    () => filteredCategories.reduce((sum, c) => sum + c.services.length, 0),
    [filteredCategories]
  );

  const hasResults = filteredCount > 0;
  const isSearching = normalizedQuery.length > 0;

  function handleServiceClick(svc: FlatService) {
    toast.info(`${svc.name} — به زودی disponible`);
  }

  function clearSearch() {
    setQuery("");
  }

  return (
    <div className="pb-8">
      {/* ============ Sticky Top: Search + Category Chips ============ */}
      <div className="sticky top-0 z-30 glass-strong border-b border-border/50">
        {/* Search Bar */}
        <div className="px-4 pt-4 pb-3">
          <div className="relative">
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground pointer-events-none"
              strokeWidth={2.2}
            />
            <input
              type="text"
              inputMode="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی خدمات..."
              aria-label="جستجوی خدمات"
              className={cn(
                "w-full h-11 pr-10 pl-10 rounded-2xl text-sm font-medium",
                "bg-card border border-border/70 shadow-soft",
                "placeholder:text-muted-foreground/70",
                "focus:outline-none focus:ring-2 focus:ring-[#034ea2]/40 focus:border-[#034ea2]/60",
                "transition-all"
              )}
            />
            {query && (
              <button
                onClick={clearSearch}
                aria-label="پاک کردن جستجو"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center bg-muted hover:bg-muted/70 active:scale-90 transition-all"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" strokeWidth={2.5} />
              </button>
            )}
          </div>

          {/* Count Badge */}
          <div className="mt-2.5 flex items-center justify-between px-0.5">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <LayoutGrid className="w-3.5 h-3.5" strokeWidth={2.2} />
              <span>
                {isSearching ? (
                  <>
                    <span className="font-bold text-foreground">{fa(filteredCount)}</span>{" "}
                    نتیجه از {fa(totalCount)} سرویس
                  </>
                ) : (
                  <>
                    مجموع <span className="font-bold text-foreground">{fa(totalCount)}</span> سرویس در{" "}
                    <span className="font-bold text-foreground">{fa(serviceCategories.length)}</span> دسته
                  </>
                )}
              </span>
            </div>
            {(activeCategory !== "all" || isSearching) && (
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setQuery("");
                }}
                className="text-[11px] font-bold text-[#034ea2] dark:text-[#6BA0F5] active:scale-95 transition-transform"
              >
                بازنشانی
              </button>
            )}
          </div>
        </div>

        {/* Category Chips (horizontal scroll) */}
        <div className="overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2 px-4 pb-3 min-w-min">
            <CategoryChip
              active={activeCategory === "all"}
              onClick={() => setActiveCategory("all")}
              icon="🌟"
              label="همه"
              color="#034ea2"
            />
            {serviceCategories.map((cat) => (
              <CategoryChip
                key={cat.name}
                active={activeCategory === cat.name}
                onClick={() => setActiveCategory(cat.name)}
                icon={cat.icon}
                label={cat.name}
                color={cat.color}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ============ Content ============ */}
      <div className="px-4 pt-4">
        <AnimatePresence mode="wait">
          {hasResults ? (
            <motion.div
              key={activeCategory + normalizedQuery}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex flex-col gap-6"
            >
              {filteredCategories.map((cat, catIdx) => (
                <CategorySection
                  key={`${cat.name}-${catIdx}`}
                  category={cat}
                  showHeader={activeCategory === "all"}
                  index={catIdx}
                  onServiceClick={handleServiceClick}
                  globalStartIndex={filteredCategories
                    .slice(0, catIdx)
                    .reduce((sum, c) => sum + c.services.length, 0)}
                />
              ))}
            </motion.div>
          ) : (
            <EmptyResults query={query} onReset={clearSearch} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ==================== Category Chip ====================
function CategoryChip({
  active,
  onClick,
  icon,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  color: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative flex items-center gap-1.5 px-3.5 h-9 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95",
        active
          ? "text-white shadow-md"
          : "bg-card border border-border/70 text-foreground hover:border-border"
      )}
      style={
        active
          ? {
              background: `linear-gradient(135deg, ${color}, ${hexToRgba(color, 0.85)})`,
              boxShadow: `0 4px 12px ${hexToRgba(color, 0.35)}`,
            }
          : undefined
      }
    >
      <span className="text-sm leading-none">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// ==================== Category Section ====================
function CategorySection({
  category,
  showHeader,
  index,
  onServiceClick,
  globalStartIndex,
}: {
  category: ServiceCategory;
  showHeader: boolean;
  index: number;
  onServiceClick: (svc: FlatService) => void;
  globalStartIndex: number;
}) {
  return (
    <section>
      {showHeader && (
        <motion.div
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: Math.min(index * 0.04, 0.2), duration: 0.25 }}
          className="flex items-center gap-2 mb-3 px-0.5"
        >
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
            style={{ background: hexToRgba(category.color, 0.15) }}
          >
            {category.icon}
          </span>
          <h3 className="font-bold text-sm text-foreground">{category.name}</h3>
          <span
            className="mr-auto text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{
              background: hexToRgba(category.color, 0.12),
              color: category.color,
            }}
          >
            {fa(category.services.length)}
          </span>
        </motion.div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {category.services.map((svc, svcIdx) => {
          const flat: FlatService = {
            ...svc,
            categoryName: category.name,
            categoryIcon: category.icon,
            categoryColor: category.color,
            categoryId: `cat-${index}`,
          };
          const staggerIndex = globalStartIndex + svcIdx;
          return (
            <ServiceCard
              key={`${category.name}-${svc.name}-${svcIdx}`}
              service={flat}
              onClick={() => onServiceClick(flat)}
              staggerIndex={staggerIndex}
            />
          );
        })}
      </div>
    </section>
  );
}

// ==================== Service Card ====================
function ServiceCard({
  service,
  onClick,
  staggerIndex,
}: {
  service: FlatService;
  onClick: () => void;
  staggerIndex: number;
}) {
  const { icon, name, categoryColor } = service;

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.28,
        ease: "easeOut",
        delay: Math.min(staggerIndex * 0.025, 0.4),
      }}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      aria-label={name}
      className={cn(
        "group relative flex flex-col items-center justify-start gap-2 p-2.5 pt-3",
        "rounded-2xl bg-card border border-border/70 shadow-soft",
        "hover:border-[#034ea2]/40",
        "transition-colors overflow-hidden"
      )}
    >
      {/* Decorative top tint */}
      <div
        className="absolute inset-x-0 top-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, transparent, ${categoryColor}, transparent)` }}
        aria-hidden
      />

      {/* Icon Box */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl select-none"
        style={{
          background: hexToRgba(categoryColor, 0.14),
          boxShadow: `inset 0 0 0 1px ${hexToRgba(categoryColor, 0.18)}`,
        }}
      >
        <span className="leading-none">{icon}</span>
      </div>

      {/* Name (2-line truncation) */}
      <span
        className="text-[11px] leading-tight font-medium text-foreground text-center w-full"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: "2.4em",
        }}
      >
        {name}
      </span>
    </motion.button>
  );
}

// ==================== Empty Results ====================
function EmptyResults({
  query,
  onReset,
}: {
  query: string;
  onReset: () => void;
}) {
  return (
    <motion.div
      key="empty"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 blur-2xl bg-[#034ea2]/20 rounded-full" aria-hidden />
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-[#034ea2]/15 to-[#8B5CF6]/15 border border-border/70 flex items-center justify-center">
          <Search className="w-9 h-9 text-[#034ea2] dark:text-[#6BA0F5]" strokeWidth={1.8} />
        </div>
      </div>

      <h3 className="font-bold text-base mb-1.5 text-foreground">نتیجه‌ای یافت نشد</h3>
      <p className="text-sm text-muted-foreground mb-5 max-w-[260px] leading-relaxed">
        برای «<span className="font-bold text-foreground">{query || "—"}</span>» هیچ خدمتی پیدا نشد.
        لطفاً عبارت دیگری را امتحان کنید یا همه دسته‌ها را ببینید.
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 h-10 rounded-xl bg-gradient-to-br from-[#034ea2] to-[#023069] text-white text-xs font-bold shadow-md shadow-[#034ea2]/30 active:scale-95 transition-transform"
        >
          <Sparkles className="w-4 h-4" strokeWidth={2.2} />
          نمایش همه خدمات
        </button>
      </div>
    </motion.div>
  );
}
