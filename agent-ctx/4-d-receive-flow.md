# Task 4-d: Receive Flow (دریافت)

**Agent:** Subagent (B2C Receive screens)
**Task ID:** 4-d
**Scope:** Two screen files for the Hasto B2C Receive flow

---

## Files Built

### 1. `src/components/hasto/b2c/screens/receive.tsx` — `ReceiveScreen`
Main "دریافت پول" screen with:

- **Header**: Title "دریافت پول" with `ArrowDownLeft` icon badge, subtitle showing `user.name`
- **QR Glassmorphism Card**: Large centered QR (224px) inside a `glass-strong` rounded-3xl card with blurred decorative circles, white QR tile with corner accents (bracket-style framing), description text, and a "پرداخت امن و فوری" badge with `Shield` icon
- **Account Details** (`SectionCard`): Three copyable rows (`DetailRow` component) — شماره کارت, شماره شبا, شماره حساب — each with copy button + Check icon on success + sonner toast
- **Action buttons** (2-col grid):
  - "دریافت با شناسه" → `setB2CScreen("receive-with-id")` (primary gradient)
  - "اشتراک‌گذاری" → opens bottom sheet (outlined variant)
- **ShareSheet** (bottom sheet modal with `AnimatePresence` + spring slide-up):
  - 4 options as 2x2 grid of cards: QR کد (toggle inline QR), شماره شبا (copy), شماره کارت (copy), شناسه کیف پول (copy of phone, labeled "شناسه کیف پول")
  - QR option expands an inline `QRCodeSvg` with copy-payload button
  - "اشتراک‌گذاری همه اطلاعات" button using `navigator.share` with clipboard fallback
  - Header with close (`X`) button, handle bar
- **QRCodeSvg** (inlined): pseudo-random 21x21 cell pattern hashed from value, with 3 corner finder markers — adapted from dashboard.tsx pattern

### 2. `src/components/hasto/b2c/screens/receive-with-id.tsx` — `ReceiveWithIdScreen`
"دریافت با شناسه" flow with form → success transition:

- **Title**: `Hash` icon badge + "دریافت با شناسه" + subtitle
- **Amount Input Card** (`glass-strong`): Large 4xl font input, accepts Persian/English digits (normalized via `۰-۹` mapping), placeholder "۰", "تومان" suffix, clear (`X`) button when filled, 12-digit cap
- **Quick Amount Buttons** (horizontal scroll, `hide-scroll`): ۵۰ / ۱۰۰ / ۵۰۰ هزار + ۱ / ۵ میلیون — active state highlights selected
- **Description Input**: Optional, with `FileText` icon, 60-char max + counter (`fa()` Persian digits)
- **Live Preview Card**: Shows formatted amount + description + recipient name/phone (appears when amount > 0)
- **Confirm Button** ("تایید و ایجاد شناسه"): Disabled state when amount is 0; validates min 1,000 Toman
- **Generation** (`handleGenerate`):
  - Payment ID: `HST-{6 chars}` from alphabet `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (no confusing chars like 0/O, 1/I)
  - QR payload: JSON string with `{id, to, name, amount, desc}`
  - Payment link: `hasto.to/pay/HST-XXXXXX`
- **Success Card** (after generation, animated transition with `AnimatePresence mode="wait"`):
  - Animated `CheckCircle2` badge (spring scale + rotate)
  - Payment ID in dashed-border card with copy button
  - QR code (176px) with description
  - 2-col grid: Amount + Description cards
  - Payment link row with `Link2` icon + copy button
  - "اشتراک‌گذاری" button (`navigator.share` with formatted text)
  - "دریافت جدید" button (`RefreshCw`) to reset state
  - Tip: "شناسه پرداخت تا ۲۴ ساعت معتبر است..."

## Design & UX Details

- **Glassmorphism**: `glass-strong` utility with blurred decorative circles in brand blue (`#034ea2`)
- **Animations**: Framer Motion `motion.div`/`motion.button` with staggered delays, spring transitions, `AnimatePresence` for modal/success transitions
- **Color**: Tejarat Blue `#034ea2` for primary, with light/dark variants (`dark:text-[#6BA0F5]`)
- **Accessibility**: `aria-label` on all icon buttons, semantic input labels, `inputMode="numeric"` for amount
- **Mobile-first**: All layouts fit within phone-frame width, horizontal scroll for quick amounts, bottom sheet anchored to bottom
- **Persian RTL**: `dir="ltr"` for numeric values (card numbers, sheba, IDs), `fa()` for Persian digit display, `tabular-nums` for alignment

## Reused Patterns
- `QRCodeSvg` component pattern from `dashboard.tsx` (inlined in both files)
- `DetailRow` pattern from `dashboard.tsx` WalletDetailSheet (adapted)
- `SectionCard` from `shared/ui.tsx`
- Bottom sheet spring animation pattern from `dashboard.tsx` WalletDetailSheet

## Verification
- ✅ `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` → **200**
- ✅ ESLint on both files: **0 errors, 0 warnings** (pre-existing error in `transfer-pin.tsx` from another agent is unrelated)
- ✅ Dev server compiles successfully (3x GET / 200 responses observed)

## Notes for downstream agents
- The dev server had stopped; I restarted it with `bun run dev` in background to verify. The system's auto-restart may or may not pick it up.
- `fa` import was removed from `receive.tsx` (unused) — `formatToman` is used in `receive-with-id.tsx` instead.
- Both screens use the same `QRCodeSvg` mock; if a real QR library is added later, both can be migrated to a shared component.
