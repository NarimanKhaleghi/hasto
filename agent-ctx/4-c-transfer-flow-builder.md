# Task 4-c: Transfer (واریز) Flow

**Agent:** transfer-flow-builder
**Scope:** 4 B2C screens — `transfer`, `transfer-confirm`, `transfer-pin`, `transfer-receipt`

## Files Created / Overwritten

1. `src/components/hasto/b2c/screens/transfer.tsx` → `TransferScreen`
2. `src/components/hasto/b2c/screens/transfer-confirm.tsx` → `TransferConfirmScreen`
3. `src/components/hasto/b2c/screens/transfer-pin.tsx` → `TransferPinScreen`
4. `src/components/hasto/b2c/screens/transfer-receipt.tsx` → `TransferReceiptScreen`

## What was built

### transfer.tsx
- Smart single input that auto-detects recipient type from raw text:
  - **Mobile**: `09` + 9 digits (11 digits total)
  - **Card**: 16 digits — bank looked up from `cardPrefixes` using `XXXX-XX` prefix; auto-formatted with dashes `XXXX-XXXX-XXXX-XXXX`
  - **Sheba**: `IR` + 24 digits (or bare 24 digits) — normalised to `IR…`
- Live "detected recipient" card under input with animated badge (TypeChip), bank logo avatar (color-coded per type: blue card / emerald sheba / violet mobile), check icon. AnimatePresence on enter/exit.
- Recent transfers list from `recentTransfers` mock — search filter (name + number), scrollable `max-h-80` with custom scrollbar, click-to-prefill + toast.
- Floating action bar at `bottom-24`: **اسکن** (outline) + **تایید** (primary gradient, disabled until valid).
- **Scan modal**: mock camera viewport with animated scan line, corner brackets, "دوربین فعال شد" label, plus 2 mock detected-card buttons (تجارت / ملی) for demo.
- On confirm: writes `transferContext` (recipientName, recipientNumber, recipientType, bank) and navigates to `transfer-confirm`.
- Shows current wallet balance hint at bottom.

### transfer-confirm.tsx
- Recipient summary card (avatar + name + number + bank + "تغییر" button to go back to `transfer`).
- Large centered amount input (3xl font, tabular-nums) with Toman suffix; turns blue when filled, red when insufficient.
- 5 quick-amount chips: ۵۰ هزار / ۱۰۰ هزار / ۵۰۰ هزار / ۱ میلیون / ۵ میلیون (active state highlighted).
- Insufficient-balance warning with deficit amount when amount > wallet balance.
- Optional description textarea (120-char limit with live Persian digit counter).
- Security note (success-tinted) about OTP confirmation.
- Sticky bottom confirm bar showing live wallet balance + "تایید پرداخت" button (shows entered amount). Disabled if amount 0 or insufficient.
- Updates `transferContext` with `amount`, `amountText`, `description` before navigating to `transfer-pin`.

### transfer-pin.tsx (no-chrome full screen)
- Shield hero with spring scale-in + infinite pulse ring + glow.
- Recipient + amount mini-summary card (backdrop blur).
- 6 separate PIN boxes (auto-advance on digit, backspace clears-and-focuses-previous, arrow-key navigation, paste distributes digits). LTR direction. `inputMode="numeric"`, `autoComplete="one-time-code"`.
- Status line: progress count → "تایید شد — در حال انتقال..." on completion.
- **Biometric button**: emerald gradient circle with Fingerprint icon + pulse ring; click auto-fills `123456`.
- Derived `filled` state (not stored) — on completion, a 700ms async timer navigates to `transfer-receipt`. Fixed lint rule `react-hooks/set-state-in-effect` by deriving `filled` instead of calling `setFilled` in effect.
- Mock note clarifying any 6 digits / biometric accepted.
- Subtle back button (top-right RTL) calling `goBack`.

### transfer-receipt.tsx (no-chrome full screen)
- Success hero: green check with spring scale-in + expanding ring + 28-piece **confetti** animation (random colors, positions, rotations, shapes: rect / circle / pill).
- Receipt card with **dashed perforation top & bottom** + circular cutouts (ticket-style), strong shadow:
  - Large amount (3xl) with Toman
  - Rows: گیرنده (highlighted), بانک (if card), شماره, توضیحات (if present), تاریخ (Persian date + time)
  - **Tracking number** `TRK-XXXXXXXX` (8 random uppercase alphanumerics, no ambiguous chars) — click to copy with toast
  - "پرداخت موفق" status badge
- "موجودی باقی‌مانده" line below receipt.
- Action buttons:
  - **اشتراک‌گذاری رسید** (primary gradient) — uses `navigator.share` if available, else `navigator.clipboard.writeText` with sonner toast (multi-line share text including all receipt fields).
  - **بازگشت به خانه** → `setB2CScreen("dashboard")`.

## Design system adherence
- Tejarat Blue `#034ea2` primary (dark variant `#6BA0F5`).
- Glassmorphism: `bg-card/80 backdrop-blur`, `shadow-soft`, gradient blurs.
- Framer-motion: fade-in-up, scale-in (spring), AnimatePresence for conditional UI, pulse rings, confetti.
- Persian throughout; `fa()` for all digits; `formatToman()` for amounts; `tabular-nums`.
- Mobile-first; respects the phone-frame max-width 420px (FAB bar centered with `max-w-[420px]`).
- Bottom-nav aware: floating buttons sit at `bottom-24` (above the sticky 64px nav).
- Full-screen no-chrome screens (pin + receipt) handle their own back navigation.

## Verification
- `bun run lint`: **transfer-pin.tsx error fixed** (derived `filled` instead of `setState` in effect). The only remaining lint error is in `payment-id.tsx` (another agent's task — not in scope).
- `curl http://localhost:3000/` → **HTTP 200** ✅ (dev server restarted cleanly, Turbopack compile succeeded: `GET / 200`).

## Notes for downstream agents
- `transferContext` shape is preserved (no schema changes). Amount is added at confirm step; description optional.
- Receipt generates `trackingNo` client-side via `useMemo` (stable per mount). Date uses Persian-calendar year 1404 approximation.
- All four screens are statically imported by `b2c/b2c-app.tsx` (no router changes needed).
