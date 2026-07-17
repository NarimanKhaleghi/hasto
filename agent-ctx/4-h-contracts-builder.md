# Task 4-h: Contracts (قراردادها) — 3 screens

## Files created
1. `/home/z/my-project/src/components/hasto/b2c/screens/contracts.tsx` → `ContractsScreen`
2. `/home/z/my-project/src/components/hasto/b2c/screens/contract-detail.tsx` → `ContractDetailScreen`
3. `/home/z/my-project/src/components/hasto/b2c/screens/contract-create.tsx` → `ContractCreateScreen`

## What was built

### 1. ContractsScreen (list)
- Title "قراردادهای من" with count badge (contracts.length = 22 → ۲۲)
- Search button (toast placeholder)
- 3 mini stats grid: تعداد فعال (green CheckCircle2) / منقضی شده (red XCircle) / مجموع ماهانه (blue Wallet, summed from active monthly contracts)
- Two horizontally-scrollable filter chip rows (scrollbar-none):
  - Status: همه | فعال | منقضی شده | در انتظار
  - Type: همه | Direct Debit | BNPL | اشتراک | قبض خودکار | شخصی
- AnimatePresence (mode="popLayout") staggered list of ContractCard components
- Each card: emoji icon in colored circle (color from contract.color), type-label chip + StatusBadge, name, recipient/provider, amount+period+expiry inline, chevron circle (changes color on hover)
- Tap → `setActiveContractId(c.id)` + `setB2CScreen("contract-detail")`
- Empty state (Inbox icon) when filter has no matches
- Floating FAB "افزودن قرارداد جدید" → `setB2CScreen("contract-create")` (spring entrance)

### 2. ContractDetailScreen
- Reads `activeContractId` from store; falls back to empty state with "بازگشت به قراردادها" button
- Header: wallet-gradient card with large emoji icon (in tinted circle), contract.id, name, recipient/provider, status badge (white variant)
- Progress card (only for `bnpl` / `auto_bill`): deterministic % from id hash (30..89), ProgressBar, contextual hint
- Info card: divide-y rows with icon + label + value
  - نوع قرارداد, مبلغ, دوره پرداخت, تاریخ شروع, تاریخ انقضا (always)
  - شماره حساب (only direct_debit)
  - آخرین پرداخت, پرداخت بعدی (when present)
- Action buttons:
  - "اشتراک‌گذاری قرارداد" (primary gradient) → opens ShareSheet
  - "ویرایش" (secondary, toast placeholder)
  - "لغو قرارداد" (destructive) → opens confirmation Dialog (AlertTriangle icon, two-button footer) → on confirm: toast + return to contracts
  - "بازگشت" (text button)
- ShareSheet (bottom sheet, spring animation): 3 options (لینک مستقیم / QR کد / شناسه قرارداد), each copies to clipboard with toast, shows green check for 1.8s after copy

### 3. ContractCreateScreen (4-step wizard)
- Top: back button, segmented progress (4 dots, current=wider+filled, past=filled, future=muted), "X از ۴" counter, animated subtitle
- AnimatePresence (mode="wait") with horizontal slide transitions between steps
- Fixed footer: "قبلی" (when step > 1) + primary "مرحله بعد" / "ذخیره قرارداد" (disabled when step invalid)

**Step 1 — انتخاب نوع قرارداد**: 5 large cards (Direct Debit / BNPL / تمدید خودکار / پرداخت خودکار / قرارداد شخصی), each with colored icon box, title, description, selected check circle. Selected card gets blue border + tinted bg + shadow.

**Step 2 — انتخاب سرویس‌دهنده/بانک**:
- direct_debit → 7 banks (بلو، تجارت، ملی، سپه، دی، سرمایه، ملت) with desc (limit)
- bnpl → 5 platforms (اسنپ‌پی، دیجی‌پی، تارا، اوانو، جیب جت)
- subscription → 6 services (اسنپ‌پرو، دیجیکالا پرو، ChatGPT، فیلیمو، نماوا، Spotify)
- auto_bill → 4 (قبض موبایل، قبض برق، وام تجارت، اجاره)
- personal → info card explaining recipient will be entered in next step

**Step 3 — تکمیل اطلاعات**:
- Recipient block (only personal): name + mobile input (auto Persian digits, 09XXXXXXXXX validation)
- Amount: large input (h-14, text-xl) with auto-format ( Persian digits, thousands sep), "تومان" suffix, 5 quick-amount chips
- Period: 4-col grid (ماهانه/هفتگی/سالانه/یکبار) — default ماهانه
- Dates: start + expiry inputs (Persian digits only, slash allowed)
- Description: textarea (max 150, counter)

**Step 4 — تایید و ذخیره**:
- Hero gradient card with type icon + provider/recipient name
- "خلاصه اطلاعات" card with all entered values (recipient for personal, provider otherwise)
- Info note (CheckCircle2) about auto-activation
- Save → success animation (spring check + pulsing ring + glow), toast "قرارداد با موفقیت ساخته شد", then `setB2CScreen("contracts")` after 1.8s

## Validation logic
- Step 1: type selected
- Step 2: provider selected (or auto-pass for personal)
- Step 3: amount + start + expiry filled; for personal also name + valid 09XXXXXXXXX mobile
- Step 4: always can save

## Code style adherence
- "use client" on all 3 files
- `useAppStore` for navigation + `activeContractId` (no schema changes)
- `framer-motion`: staggered entrance, AnimatePresence (popLayout / wait), spring bottom sheet, success check animation
- `lucide-react` icons throughout (FileText, Plus, ChevronLeft, Share2, Trash2, Edit, Check, etc.)
- `sonner` for all toasts (copy, save, cancel, edit, search placeholder)
- `cn` for conditional classes
- shadcn `Dialog` for cancel confirmation
- Persian text + `fa()` for all numbers; `tabular-nums` for digits
- Mobile-first, max-width 420px (phone-frame); FAB fixed at bottom-24; wizard footer fixed at bottom
- Glassmorphism with Tejarat Blue (#034ea2 → #023069 gradient); color-coded per contract type (uses contract.color for icon tint)
- Status badges: active=green, expired=red, pending=yellow (via shared StatusBadge)

## Verification
- `bun run lint` → clean (no errors, no warnings)
- `curl http://localhost:3000/` → HTTP 200
- Fixed a transient runtime error (missing `CreditCard` import in contract-create.tsx) — added to import list, dev server recovered to 200

## Notes for downstream agents
- All 3 screens were already wired in `b2c-app.tsx` router (no router changes needed)
- The success/cancel flows return to `contracts` screen via `setB2CScreen("contracts")`
- `setActiveContractId` is set before navigating to detail (already in store contract)
- No backend/database changes — pure mock + local state
