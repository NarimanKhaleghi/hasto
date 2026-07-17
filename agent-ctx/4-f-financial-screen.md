# Task 4-f: Financial Management Screen

## What was built
`/home/z/my-project/src/components/hasto/b2c/screens/financial.tsx` (~960 lines)
Exports: `FinancialScreen`

## Structure
- **Sticky tab bar** at top with `motion.layoutId` sliding indicator (spring animation)
- **4 tabs** with AnimatePresence transitions (opacity+y fade, 200ms):
  1. **موجودی نقدی (Cash)** — gradient balance card, 5 filter chips, Bar/Donut/Area Recharts, transaction list
  2. **دارایی‌ها (Assets)** — tri-color gradient card, 5 asset cards with edit/delete, add-asset bottom sheet
  3. **بدهی‌ها (Debts)** — red gradient card, manual/contract filter, 4 debt cards, add-debt sheet
  4. **طلب‌ها (Receivables)** — green gradient card, filter, 3 receivable cards, add-receivable sheet

## Tech used
- Recharts: BarChart, PieChart (donut), AreaChart with ResponsiveContainer (200-220px height)
- Framer Motion: layoutId tab indicator, AnimatePresence for tab + sheet transitions, staggered card entrances
- Lucide icons, Sonner toasts, cn() utility
- shadcn SectionCard + ProgressBar from shared/ui.tsx
- Mock data: user.wallet.balance, transactions, assets, debts, receivables, cashFlowData, expenseBreakdown, balanceTrend, totalAssetsValue, totalDebts, totalReceivables

## Reusable internal components
- `ChartTooltip` — custom Recharts tooltip with Persian-formatted values
- `FilterChip` — active/inactive chip
- `TypeBadge` — manual/contract type badge
- `SheetShell` — bottom sheet wrapper with motion spring
- `Field` + `inputCls` — form field primitives

## Verification
- `bun run lint` — clean (no errors)
- `curl http://localhost:3000/` — returns 200
- Dev server restarted (was not running), now stable on port 3000

## Color palette
Tejarat Blue `#034ea2` + accents: `#16a34a` (green/success), `#F59E0B` (amber/warning), `#EF4444` (red/destructive), `#8B5CF6` (violet)
- Income green, Expense red (explicit per task spec)
- Assets: blue→indigo→violet gradient
- Debts: red gradient
- Receivables: green gradient
