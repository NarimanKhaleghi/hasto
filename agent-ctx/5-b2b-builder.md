# Task ID: 5 — B2B (Business Panel) Builder

## Task
Build all 10 B2B (business panel) screens for the Hasto Persian fintech app.

## Work Log
- Read project context: worklog.md, hasto-data.ts (business object), hasto-store.ts (B2B screen types + nav helpers), shared/ui.tsx (StatusBadge, ProgressBar, SectionCard, Fab), b2b-header.tsx (auto back-button), b2b-bottom-nav.tsx (5-tab nav), B2C login.tsx (OTP pattern reference), B2C dashboard.tsx (wallet-gradient + QRCodeSvg pattern), globals.css (Tejarat Blue palette, glass utilities, animations)
- Overwrote 10 placeholder B2B screen files with full implementations:

### 1. login.tsx — `B2BLoginScreen`
- Branded logo card with Store badge over Tejarat Blue gradient + "پنل کسب‌وکار هستو" title
- Phone input with ۰۹ prefix + 5-digit OTP flow (auto-advance, paste-distribute, success animation)
- "ورود به عنوان کسب‌وکار" CTA → setB2BScreen("b2b-dashboard") on success
- 3 feature pills: "درگاه بدون اصطکاک" / "تسویه خودکار" / "API قدرتمند"
- "ورود سریع نسخه نمایشی" shortcut link

### 2. verify.tsx — `B2BVerifyScreen`
- Multi-step (3 steps): اطلاعات کسب‌وکار → اطلاعات بانکی → مدارک
- Stepper with numbered circles + connecting progress bars (info → bank → docs → submitting → done)
- Yellow "🟡 در انتظار بررسی" status banner
- Step 1: business name, type (4 buttons), registration #, address, phone — pre-filled from mock data
- Step 2: account #, sheba, holder, bank — pre-filled
- Step 3: 3 document upload cards (کارت ملی / جواز کسب / فاکتور) with dashed-border drop-zone + upload state
- "ارسال برای تایید" → loading spinner → success check → redirect to dashboard
- Note that demo is pre-approved

### 3. dashboard.tsx — `B2BDashboardScreen`
- Welcome gradient card: "سلام 👋 {owner}" + business name + green "تایید شده" badge + join date + product count
- 2x2 financial summary grid (today/week/month received + transaction count) — gradient cards with colored icons (green/blue/purple/amber)
- Weekly BarChart (Recharts, 7 days) with gradient fill + green accent for last bar + custom Tooltip showing Persian-formatted amounts
- 4 quick action buttons (لینک پرداخت / محصولات / قراردادها / ابزارها) — color-coded
- Recent payments list (5 items) with buyer, StatusBadge, product, time, amount
- Average transaction info banner

### 4. payment-link.tsx — `B2BPaymentLinkScreen`
- 3-tab interface with sliding layoutId indicator: لینک ساده / لینک محصول / QR اختصاصی
- **Tab 1**: amount input + quick amounts + title input → generate `hasto.to/pay/LNK-XXXXXX` → display link with copy button + share + inline QR
- **Tab 2**: select product card (5 products) → generate `hasto.to/pay/{PRD-ID}-XXXXXX` + copy/share/QR
- **Tab 3**: dedicated QR (224px) for `hasto.to/shop/{slug}` with download + share buttons
- Custom QRCodeSvg component with Tejarat-Blue-tinted corner markers

### 5. products.tsx — `B2BProductsScreen`
- 3 summary stats: تعداد محصولات / مجموع فروش / محصول فعال
- Search input + filter chips (همه / فعال / غیرفعال)
- Product cards: gradient image placeholder (first letter), name, category, price, sales count, StatusBadge, "more" button → bottom sheet with edit/delete actions
- FAB "افزودن محصول" → setB2BScreen("b2b-product-add")

### 6. product-add.tsx — `B2BProductAddScreen`
- Live preview card (updates as you type) showing how the product will appear
- Form: image upload (mock), name (with counter), price (Toman + quick amounts), category (8 chips), inventory, description (with counter)
- "ذخیره محصول" → loading spinner → success animation (overlay check) → goBackB2B
- Validation: requires name + price ≥ 4 digits

### 7. contracts.tsx — `B2BContractsScreen`
- Purple gradient summary card (active contracts count + monthly recurring)
- "انواع قرارداد" explainer with 3 types (اشتراک ماهانه / پرداخت دوره‌ای / اقساط)
- Contracts list (2 mock contracts) with name, StatusBadge, client, period, dates, amount
- "ساخت قرارداد جدید" → bottom sheet form (type, name, client mobile, amount, period, dates, description) → save → share step (link/QR/id tabs with copy + share)
- Tap contract → detail bottom sheet

### 8. tools.tsx — `B2BToolsScreen`
- 4 tool sections (each in SectionCard with colored icon):
  - **API & کلید API**: live key (masked + show/hide + copy) + test key + rate-limit/last-used grid + regenerate button (2-tap confirm) + docs link + code snippet (curl example with syntax highlighting in dark slate background)
  - **ربات تلگرام**: enable toggle → expanded settings (3 toggles: پاسخ خودکار / نمایش محصولات / ارسال لینک پرداخت) + "پیش‌نمایش ربات" button → mock Telegram chat preview with bubble messages and inline keyboard buttons
  - **ربات اینستاگرام**: "اتصال به اکانت" button → on success expanded settings (3 toggles) + preview → mock DM chat preview with Instagram gradient avatar
  - **صفحه وب اختصاصی**: URL display + enable toggle → expanded settings (logo upload + color picker 5 swatches + show products toggle) + preview → mock browser window with hero, products grid, and buy button rendered using selected color
- Custom Toggle and SettingToggle components with Framer Motion layout animation

### 9. transactions.tsx — `B2BTransactionsScreen`
- 3 summary stats: today count / today amount / success rate %
- Search input + filter chips (همه / موفق / در انتظار / ناموفق) + collapsible date-range filter
- 2 action buttons: "دانلود گزارش (CSV)" + "صورتحساب" (both toast on click)
- Transactions list (5 mock payments) with buyer, phone, product, StatusBadge, time/date, amount → tap → detail bottom sheet
- Detail sheet: status header with check icon, amount, 6 info rows, print receipt button

### 10. settings.tsx — `B2BSettingsScreen`
- 5 SectionCards:
  - **اطلاعات کسب‌وکار**: 7 info rows (name/owner/type/reg #/address/phone/join date) + edit button
  - **اطلاعات بانکی**: 4 info rows (account/sheba/holder/bank) + edit button
  - **تنظیمات تسویه**: frequency (3 buttons) + minimum amount input + "تسویه فوری" toggle with 1.5% fee note
  - **اعلان‌ها**: 4 notification toggles (payment/settlement/contract/daily report)
  - **حساب کاربری**: change password + manage devices (with badge showing 2 devices)
- Red "خروج از حساب" button → confirmation modal (AlertTriangle icon) → setB2BScreen("b2b-login")
- "نسخه ۱.۰.۰" footer

## Code Quality
- "use client" on all 10 files
- All navigation via useAppStore: setB2BScreen + goBackB2B
- Mock data imported from @/lib/hasto-data (business, fa, formatToman)
- Framer Motion: staggered card entrance, layoutId tab indicators, AnimatePresence tab transitions, spring bottom sheets, success overlay
- Lucide-react icons throughout
- Sonner toasts for all interactive actions
- cn() utility for conditional classes
- Persian text everywhere, fa() for all numbers, formatToman for amounts
- Mobile-first with max-width 420px (phone frame)
- Glassmorphism (glass-strong on header/bottom-nav, glass on cards), Tejarat Blue (#034ea2) as primary with color-coded accents per section (purple for contracts, green for web, blue for API, cyan for Telegram, pink for Instagram, red for logout)
- Reusable sub-components: Field, InfoRow, NotifRow, Toggle, SettingToggle, DetailRow, ToolSection, QRCodeSvg
- Custom QRCodeSvg with hash-based pattern + 3 corner markers (reused from B2C dashboard pattern, adapted with brand color tinting)
- Sticky footer not needed (header + bottom-nav handled by B2BApp router)

## Verification
- `bun run lint`: ✅ clean — no errors, no warnings across all 10 files
- `curl http://localhost:3000/`: ✅ HTTP 200 (multiple successful compilations in dev.log)
- Dev server log shows all recent GET / responses returning 200 in <250ms
- Note: dev.log has a pre-existing ReferenceError in `b2c/screens/contract-create.tsx` (CreditCard not imported) — this is from another agent's file, NOT my B2B code. The B2B screens load successfully without runtime errors.

## Stage Summary
- All 10 B2B screens complete and integrated (router already imports them in b2b-app.tsx)
- Full business flow: login → verify → dashboard → payment-link / products / contracts / tools / transactions / settings
- Each screen has a distinct visual identity while maintaining the Tejarat Blue design language
- Ready for end-to-end demo via mode-switcher → B2B
