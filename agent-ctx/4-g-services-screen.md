# Task 4-g — Services (خدمات) Screen

## Summary
Built the Services (خدمات) screen for the Hasto Persian fintech B2C app — a single file at `/home/z/my-project/src/components/hasto/b2c/screens/services.tsx` exporting `ServicesScreen`.

## File
- `src/components/hasto/b2c/screens/services.tsx` — replaces the placeholder stub.

## Features
- **Sticky search bar** (glass-strong) with `Search` icon + clear button. Filters all services by name (Persian, case-insensitive substring match).
- **Count badge row** showing total services + categories, with live result count when searching. Includes a "بازنشانی" (reset) button that appears when filters are active.
- **Horizontal scrollable category chips** below the search bar — "همه" + all 18 category names, each rendered with its emoji icon and a gradient pill background tinted with the category's own `color` when active.
- **Section headers** with category icon + name + count badge — only shown when "همه" is selected.
- **Service grid**: `grid-cols-3 sm:grid-cols-4 gap-3`. Each card has:
  - Emoji icon in a colored rounded square (background tint = `category.color` at 14% alpha, inset border at 18% alpha).
  - Service name below with `-webkit-line-clamp: 2` truncation.
  - Decorative top gradient tint revealed on hover.
  - Framer Motion staggered entrance (delay capped at 0.4s), `whileHover` lift + scale, `whileTap` press.
- **Click action**: `toast.info("{service name} — به زودی disponible")` — exactly as specified (mock).
- **Beautiful empty state** with blurred glow halo, Search icon in gradient-tinted box, query echoed back, and a "نمایش همه خدمات" CTA.
- **AnimatePresence transitions** between content states (`mode="wait"`) for both list re-renders and empty state.

## Design System Adherence
- Tejarat Blue `#034ea2` primary; per-category colors sourced directly from mock data (each category's `color`).
- Glassmorphism: `glass-strong` on sticky search/chips header, `shadow-soft` on cards, `scrollbar-none` on chip row.
- All numbers wrapped with `fa()` (Persian digits).
- Mobile-first; respects the ≤420px phone-frame wrapper.
- RTL-friendly layout (icons positioned `right-3`, action positioned `left-2`).
- Lucide icons (`Search`, `X`, `Sparkles`, `LayoutGrid`); `sonner` for toasts; `cn()` from `@/lib/utils`.

## Architecture
- Local React state only — `query` (string) and `activeCategory` (`"all"` | category name).
- `useMemo` flattens all 18 categories × services into a `FlatService[]` (each carries parent category info for color context).
- `visibleCategories` (category filter) → `filteredCategories` (search filter) → grouped sections rendered.
- Helper `hexToRgba(hex, alpha)` for safe per-category color tinting with graceful fallback.

## Verification
- `bun run lint` — clean (0 errors, 0 warnings).
- `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` → **200**.
- `dev.log` shows successful compilation (Compiled in 248–503 ms) and 200 responses.
