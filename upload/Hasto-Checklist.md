# هستو — چک‌لیست کامل پروژه

## استک فنی انتخاب شده

| مورد | انتخاب | دلیل |
|------|--------|-------|
| **فریمورک** | Next.js 14+ | عملکرد عالی، React Server Components |
| **زبان** | TypeScript | امنیت نوع، کشف خطا در زمان کامپایل |
| **استایل** | Tailwind CSS | سریع، RTL راحت، Responsive |
| **کامپوننت** | shadcn/ui | رایگان، قابل سفارشی‌سازی، RTL |
| **آیکون** | Lucide Icons | رایگان، SVG، سبک |
| **نمودار** | Chart.js | سبک، رایگان، انواع نمودار |
| **داده** | Mock/Static | بدون backend (فقط MVP نمایشی) |
| **هاست** | GitHub Pages | رایگان، GitHub integration |
| **فرم‌ها** | React Hook Form + Zod | اعتبارسنجی، مدیریت state |
| **State** | Zustand | سبک، ساده، مناسب MVP |
| **مسیریابی** | Next.js Static Export | سازگار با GitHub Pages |
| **RTL** | Tailwind RTL Plugin | پشتیبانی کامل RTL |

---

## تنظیمات GitHub Pages

### نکته مهم
GitHub Pages فقط از سایت‌های **Static** پشتیبانی میکنه. باید Next.js رو برای Static Export تنظیم کنیم.

### تنظیمات next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Static export
  images: {
    unoptimized: true,  // برای GitHub Pages
  },
  trailingSlash: true,  // سازگاری با GitHub Pages
  basePath: '',  // اگر در ساب‌دومین باشه
};

module.exports = nextConfig;
```

### تنظیمات GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './out'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### تنظیمات package.json
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "export": "next build"
  }
}
```

### ساختار پروژه
```
hasto/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── ...
│   ├── components/
│   │   └── ...
│   ├── lib/
│   │   └── utils.ts
│   └── styles/
│       └── globals.css
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## چک‌لیست مستندات

### مستندات محصول (PRD)
- [x] PRD کلی محصول (Hasto-PRD.md)
- [x] مشکل و راه‌حل
- [x] معماری کلی + نمودار Mermaid
- [x] مدل درآمدی
- [x] نقشه راه ۳ فازه
- [x] چالش‌ها و ریسک‌ها
- [x] ساختار ارائه به هیئت مدیره

### مستندات B2C
- [x] لایه کاربر نهایی (Hasto-B2C.md)
- [x] صفحه ورود (OTP)
- [x] داشبورد اصلی
- [x] بخش واریز
- [x] بخش دریافت
- [x] بخش پرداخت (۴ روش)
- [x] مدیریت مالی (۴ تب)
- [x] خدمات (۱۸ دسته)
- [x] قراردادها (۵ دسته)
- [x] پروفایل کاربر
- [x] مرکز اعلان‌ها

### مستندات B2B
- [x] لایه کسب‌وکار (Hasto-B2B.md)
- [x] احراز هویت کسب‌وکار
- [x] داشبورد کسب‌وکار
- [x] ساخت لینک پرداخت
- [x] مدیریت محصولات
- [x] قراردادهای کسب‌وکار
- [x] ابزارها (API، ربات تلگرام، ربات اینستاگرام، صفحه وب)

### مستندات نقشه راه MVP
- [x] نقشه کامل MVP (Hasto-MVP-Plan.md)
- [x] ۲۱+ صفحه B2C
- [x] ۸ صفحه B2B
- [x] ترتیب پیاده‌سازی
- [x] Mock Data

### مستندات طراحی
- [x] سیستم طراحی نهایی (Hasto-Design-System-Final.md)
- [x] رنگ اصلی: آبی بانک تجارت (#034ea2)
- [x] Dark Mode کامل
- [x] Light Mode کامل
- [x] Glassmorphism
- [x] فونت: IBM Plex Sans + Vazirmatn
- [x] RTL کامل
- [x] کامپوننت‌ها
- [x] نمودارها
- [x] انیمیشن‌ها
- [x] دسترسی‌پذیری

### مستندات فنی
- [x] استک فنی انتخاب شد
- [x] چک‌لیست پیاده‌سازی
- [ ] مستندات API (برای فاز ۲)
- [ ] مستندات استقرار (Deployment)

---

## چک‌لیست پیاده‌سازی MVP

### مرحله ۱: Setup پروژه (روز ۱)
- [ ] ایجاد پروژه Next.js + TypeScript
- [ ] نصب Tailwind CSS
- [ ] تنظیم RTL
- [ ] نصب shadcn/ui
- [ ] نصب Lucide Icons
- [ ] ساختار پوشه‌بندی
- [ ] کامپوننت‌های مشترک (Button, Card, Header)
- [ ] جدول پیش‌شماره کارت‌ها (JSON)

### مرحله ۲: صفحه ورود (روز ۲)
- [ ] صفحه ورود با شماره موبایل (09 پیش‌فرض)
- [ ] صفحه OTP با تشخیص خودکار
- [ ] اعتبارسنجی شماره (09 + 9 رقم)
- [ ] رفتار سبز/قرمز برای OTP
- [ ] ورود خودکار بعد از تکمیل

### مرحله ۳: داشبورد اصلی (روز ۳)
- [ ] کیف پول مادر (کارت بزرگ)
- [ ] نمایش جزئیات کیف پول (کلیک)
- [ ] دو دکمه اصلی (واریز + دریافت)
- [ ] آخرین تراکنش‌ها
- [ ] هدر صفحه (پروفایل + اعلانات)
- [ ] نوار پایین (۵ بخش)

### مرحله ۴: صفحه واریز (روز ۴-۵)
- [ ] کادر ورود شماره با تشخیص خودکار
- [ ] الگوهای تشخیص (موبایل/کارت/شبا)
- [ ] لیست مقصد‌های قبلی (قابل اسکرول)
- [ ] دکمه‌های شناور (اسکن + تایید)
- [ ] صفحه تایید پرداخت (نام + مبلغ)
- [ ] صفحه رمز ۶ رقمی
- [ ] صفحه رسید پرداخت

### مرحله ۵: صفحه دریافت (روز ۶)
- [ ] نمایش QR کد کیف پول مادر
- [ ] نمایش شماره کارت و شبا
- [ ] صفحه "دریافت با شناسه" (مبلغ + تایید)
- [ ] ساخت QR code + لینک پرداخت
- [ ] دکمه اشتراک‌گذاری (QR/شبا/کارت/موبایل)

### مرحله ۶: مدیریت مالی (روز ۷)
- [ ] تب موجودی نقدی (تراکنش‌ها + نمودارها)
- [ ] تب موجودی غیر نقدی (لیست دارایی‌ها)
- [ ] فرم افزودن/ویرایش دارایی
- [ ] محاسبه ارزش لحظه‌ای (Mock)
- [ ] تب بدهی‌ها (دستی + قراردادی)
- [ ] تب طلب‌ها (دستی + قراردادی)

### مرحله ۷: خدمات (روز ۸)
- [ ] صفحه خدمات (لیست سرویس‌ها با دسته‌بندی)
- [ ] ۱۸ دسته‌بندی خدمات
- [ ] فیلتر و جستجو

### مرحله ۸: قراردادها (روز ۹-۱۱)
- [ ] صفحه اصلی قراردادها (لیست + فیلتر)
- [ ] ۵ دسته قرارداد
- [ ] نمایش وضعیت (سبز/قرمز/زرد)
- [ ] صفحه جزئیات قرارداد
- [ ] صفحه ساخت قرارداد جدید (۴ مرحله)
- [ ] اشتراک‌گذاری قراردادها
- [ ] اتصال با مدیریت مالی (بدهی‌ها)

### مرحله ۹: بخش پرداخت (روز ۱۲)
- [ ] صفحه اصلی پرداخت (۴ گزینه)
- [ ] شناسه واریز (ورود شناسه + نمایش اطلاعات)
- [ ] اسکن QR (دوربین + گالری)
- [ ] پرداخت NFC (صفحه نمایشی)
- [ ] پرداخت نزدیک (لوکیشن + لیست فروشگاه‌ها)

### مرحله ۱۰: سایر صفحات B2C (روز ۱۳)
- [ ] پرداخت قبض
- [ ] اقساط متمرکز
- [ ] تاریخچه تراکنش‌ها

### مرحله ۱۱: پروفایل و اعلانات (روز ۱۴)
- [ ] صفحه پروفایل کاربر (اطلاعات + تنظیمات)
- [ ] صفحه مرکز اعلان‌ها (لیست اعلان‌ها)

### مرحله ۱۲: صفحات B2B (روز ۱۵-۱۸)
- [ ] ورود و احراز هویت کسب‌وکار
- [ ] داشبورد کسب‌وکار
- [ ] ساخت لینک پرداخت (۳ روش)
- [ ] مدیریت محصولات (افزودن/ویرایش/حذف)
- [ ] قراردادهای کسب‌وکار
- [ ] ابزارها (API + ربات تلگرام + ربات اینستاگرام + صفحه وب)
- [ ] لیست تراکنش‌ها
- [ ] تنظیمات کسب‌وکار

### مرحله ۱۳: نهایی‌سازی و استقرار (روز ۱۹-۲۰)
- [ ] انیمیشن‌ها و ترنزیشن‌ها
- [ ] داده‌های Mock نهایی
- [ ] تست نمایشی
- [ ] مستندات ارائه
- [ ] ایجاد Repository در GitHub
- [ ] تنظیم GitHub Actions برای Deploy خودکار
- [ ] فعال‌سازی GitHub Pages
- [ ] تست نهایی روی GitHub Pages

---

## چک‌لیست کیفیت

### UI/UX
- [ ] RTL تست شد
- [ ] حالت تاریک/روشن تست شد
- [ ] کنتراست رنگ ۴.۵:۱ بررسی شد
- [ ] اندازه لمس ۴۴×۴۴px رعایت شد
- [ ] آیکون‌ها SVG هستن (نه Emoji)
- [ ] انیمیشن‌ها ۱۵۰-۳۰۰ms هستن
- [ ] واکنش‌گرایی تست شد
- [ ] RTL کار میکنه

### عملکرد
- [ ] حجم باندل < 200KB
- [ ] زمان لود < 2 ثانیه
- [ ] تصاویر WebP/AVIF
- [ ] Lazy loading فعال

### دسترسی‌پذیری
- [ ] `alt` متنی برای تصاویر
- [ ] `aria-label` برای آیکون‌ها
- [ ] ناوبری کیبورد
- [ ] `prefers-reduced-motion` رعایت

---

## چک‌لیست فایل‌های ایجاد شده

### فایل‌های مستندات
- [x] `/home/nariman-khaleghi/.local/share/mimocode/plans/PRD-Hasto.md`
- [x] `/home/nariman-khaleghi/.local/share/mimocode/plans/Hasto-B2C.md`
- [x] `/home/nariman-khaleghi/.local/share/mimocode/plans/Hasto-B2B.md`
- [x] `/home/nariman-khaleghi/.local/share/mimocode/plans/Hasto-MVP-Plan.md`
- [x] `/home/nariman-khaleghi/.local/share/mimocode/plans/Hasto-Design-System-Final.md`
- [x] `/home/nariman-khaleghi/.local/share/mimocode/plans/Hasto-Checklist.md`

### فایل‌های قدیمی (جایگزین شده)
- [x] `PRD.md` → جایگزین شد با `PRD-Hasto.md`
- [x] `Hasto-PRD.md` → جایگزین شد با `PRD-Hasto.md`
- [x] `Hasto-Design-System.md` → جایگزین شد با `Hasto-Design-System-Final.md`

---

## خلاصه وضعیت

| بخش | وضعیت |
|------|--------|
| مستندات محصول | ✅ کامل |
| مستندات B2C | ✅ کامل |
| مستندات B2B | ✅ کامل |
| مستندات نقشه راه | ✅ کامل |
| مستندات طراحی | ✅ کامل |
| استک فنی | ✅ انتخاب شد (Next.js + GitHub Pages) |
| تنظیمات GitHub Pages | ✅ آماده |
| چک‌لیست پیاده‌سازی | ✅ آماده |
| **پیاده‌سازی کد** | ⏳ شروع نشده |

---

## آدرس نهایی پروژه

بعد از استقرار در GitHub Pages:
```
https://[username].github.io/hasto/
```

### مراحل نهایی
1. ایجاد Repository در GitHub با نام `hasto`
2. آپلود کد
3. فعال‌سازی GitHub Pages در تنظیمات Repository
4. GitHub Actions خودکار Build و Deploy میکنه
5. پروژه روی `https://[username].github.io/hasto/` نمایش داده میشه
