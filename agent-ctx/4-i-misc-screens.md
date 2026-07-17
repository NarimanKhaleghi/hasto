# Task 4-i — B2C Misc Screens (5 screens)

**Agent:** misc-screens-builder
**Task:** Build 5 miscellaneous B2C screens (bills, installments, transactions, notifications, profile)

## Work Log

- Read project context: `worklog.md`, `hasto-data.ts` (bills, installments, transactions, notifications, user), `hasto-store.ts` (Zustand: useAppStore, setB2CScreen, theme/toggleTheme/setTheme, setAuthenticated), `shared/ui.tsx` (StatusBadge, SectionCard, EmptyState), `shared/header.tsx` (auto-rendered), `shared/bottom-nav.tsx`, `b2c-app.tsx` (router + auto titles), `globals.css` (wallet-gradient, glass-strong, shadow-soft/glow, scrollbar-thin/none utilities).
- All 5 target files were placeholder stubs (`در حال توسعه...`).
- Verified shadcn components available: `Switch`, `AlertDialog` (with Content/Header/Footer/Title/Description/Action/Cancel), `Dialog`.

### File 1 — `bills.tsx` (BillsScreen)
- Summary card at top (wallet-gradient) with 3 stats: تعداد قبوض / مجموع مبلغ / نزدیک‌ترین سررسید
- Toggle button ("حالت همه پرداخت شده" / "نمایش واقعی") to demonstrate the empty state
- List split into "در انتظار پرداخت" and "پرداخت شده" sections
- Each bill card: colored icon circle (per-type tint), type, StatusBadge, amount (xl), due date, "پرداخت" button
- "پرداخت" button: 900ms spinner animation → marks bill as paid locally + success toast
- Floating "پرداخت همه" button (bottom-24, fixed, max-width 402px) showing count + total → AlertDialog confirmation → sequential pay animation + toast
- Empty state when all paid: PartyPopper icon, message, "بازگشت به خانه" button
- Animations: framer-motion AnimatePresence for empty/list transitions, motion.div for cards with staggered entrance

### File 2 — `installments.tsx` (InstallmentsScreen)
- Summary card (Tejarat Blue gradient) showing: مجموع مانده (3xl) / قسط ماهانه / نزدیک‌ترین سررسید (with platform name)
- Info banner: "همه اقساط شما در یکجا — مدیریت آسان" (Sparkles icon)
- Each installment card:
  - Header strip colored with platform color (linear-gradient)
  - Logo in tinted circle using installment.color
  - Title + next payment info (قسط ۴, سررسید, مبلغ)
  - **10-segment progress visualization** with staggered animation (each segment scales in)
  - 3-cell amount grid (کل / پرداخت شده / مانده) with semantic colors + icons
  - "پرداخت قسط" button colored with installment.color, with spinner during payment
- "افزودن قسط جدید" dashed-border button → mock toast
- Tip card at bottom about credit score

### File 3 — `transactions.tsx` (TransactionsScreen)
- Summary at top: 3-cell grid (تعداد / ورودی / خروجی) with semantic colors
- Search bar with clear button (filters by title, desc, typeLabel)
- Type filter chips (horizontal scroll): همه | واریز | دریافت | شارژ | قبوض | اقساط
- Date filter chips (horizontal scroll): امروز | این هفته | این ماه | سفارشی (with CalendarDays icon)
- List grouped by date: امروز / دیروز / این هفته / قدیمی‌تر (each group is a single SectionCard with dividers)
- Each transaction row: colored icon circle (per-type tint with proper Lucide icon), title, desc, date • time, amount (green +/red −), status indicator dot (success/pending/failed), chevron
- Tap row → bottom sheet (spring animation) with:
  - Hero icon (large, colored), type label, title
  - Amount display (2xl, colored by direction)
  - Detail rows: شرح / تاریخ / ساعت / شناسه (mono HST-TX#) / وضعیت
  - "اشتراک‌گذاری" button → navigator.share fallback to clipboard
- Empty state: Inbox icon, "تراکنشی یافت نشد"
- Status indicators: animated pulse for pending, line-through for failed

### File 4 — `notifications.tsx` (NotificationsScreen)
- Top bar: title "صندوق ورودی" + unread count badge (Tejarat Blue pill) + "خواندن همه" button (disabled when 0)
- Filter chips with counts: همه | خوانده نشده | پرداخت | دریافت | قبض | قرارداد | بدهی | امنیتی
- Each notification card:
  - Icon in colored circle (per-notification color)
  - Type label badge (colored)
  - Unread indicator (pulse dot)
  - Title (bold if unread, muted if read), message (line-clamp-2), date
  - Unread: bold + colored right border (RTL = right) + colored background tint
  - Read: muted opacity 75%
  - Delete X button (appears on hover)
- Tap → mark as read (local state)
- Empty state: gradient Bell icon in rounded square + green check badge → "اعلان جدیدی ندارید"
- AnimatePresence for list and card enter/exit (slide x + height collapse)

### File 5 — `profile.tsx` (ProfileScreen)
- User header card (wallet-gradient): avatar (gradient initial), name, "تایید شده" badge, masked phone, join date, "ویرایش پروفایل" button
- 5 settings sections in cards with icon-prefixed headers:
  
  **تنظیمات عمومی:**
  - زبان (SegmentedToggle: فارسی/English)
  - تم (3 icon buttons: روشن/تاریک/سیستم) — uses setTheme store action + toast
  - فرمت عدد (SegmentedToggle: ۱۲۳/123)
  - فرمت تاریخ (SegmentedToggle: شمسی/میلادی)
  
  **تنظیمات امنیتی:**
  - تغییر رمز عبور → toast (mock)
  - بیومتریک → Switch toggle
  - مدیریت دستگاه‌های فعال → badge "۲" + toast
  - تاریخچه ورود → toast
  
  **تنظیمات اعلان‌ها:**
  - اعلان پرداخت / قبض / قرارداد / بدهی‌طلب → Switches
  - ساعات آرام (۲۲ تا ۷) → Switch
  
  **حریم خصوصی:**
  - نمایش موجودی در داشبورد → Switch
  - نمایش تراکنش‌ها → Switch
  
  **سایر:**
  - درباره هستو / شرایط استفاده / سیاست حریم خصوصی / تماس با ما / پشتیبانی / امتیازدهی به برنامه — all toast mock
  
- **خروج از حساب** (red destructive button) → AlertDialog confirmation → setAuthenticated(false) + setB2CScreen("login") + toast
- "نسخه ۱.۰.۰" footer with Hasto logo gradient square

### Code Quality
- `"use client"` on all files
- All navigation via `useAppStore`: setB2CScreen, setAuthenticated, setTheme
- Imported mock data from `@/lib/hasto-data` (bills, installments, transactions, notifications, user, fa)
- `framer-motion` animations: staggered entrance, AnimatePresence transitions, spring bottom sheets, pulse rings
- `lucide-react` icons throughout (ReceipText, Wallet, CalendarClock, Layers, Bell, CheckCheck, Shield, Settings, Eye, MoreHorizontal, LogOut, Fingerprint, etc.)
- `sonner` toasts for all interactive actions
- shadcn `Switch` for all toggles, `AlertDialog` for pay-all confirmation and logout confirmation
- `cn()` utility for conditional classes
- Persian text everywhere, `fa()` for all numbers
- Mobile-first: max-width 420px implicit (phone-frame), horizontal scroll chip rows with `scrollbar-none`
- Tejarat Blue (#034ea2) primary, with semantic colors (success green, warning amber, destructive red) and per-entity colors from mock data
- All buttons have active:scale-95 transition, shadow-md on primary actions

### Verification
- `bun run lint`: ✅ clean (exit 0, no errors, no warnings on any of my 5 files)
- `curl http://localhost:3000/`: ✅ HTTP 200
- Dev server log shows successful compilation and 200 responses for my files
- Note: Pre-existing `CreditCard is not defined` error in `contract-create.tsx` (from another agent's work) is unrelated to my task; latest GET / returned 200

### Files Modified
1. `/home/z/my-project/src/components/hasto/b2c/screens/bills.tsx` (~360 lines)
2. `/home/z/my-project/src/components/hasto/b2c/screens/installments.tsx` (~330 lines)
3. `/home/z/my-project/src/components/hasto/b2c/screens/transactions.tsx` (~590 lines)
4. `/home/z/my-project/src/components/hasto/b2c/screens/notifications.tsx` (~290 lines)
5. `/home/z/my-project/src/components/hasto/b2c/screens/profile.tsx` (~480 lines)

## Stage Summary
- All 5 miscellaneous B2C screens complete and integrated (router already imports them in b2c-app.tsx)
- Bills: full pay flow with summary, individual pay, bulk pay confirmation, empty state
- Installments: centralized view with summary, segmented progress viz, color-coded per platform
- Transactions: searchable, filterable (type+date), grouped by date, detail bottom sheet with share
- Notifications: filterable, mark-as-read on tap, delete on hover, unread indicators (right border in RTL)
- Profile: 5 settings sections with Switch toggles, theme integration with store, logout AlertDialog → login
- All screens ready for demo from Dashboard → bottom nav or via header
