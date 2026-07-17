# هستو — سیستم طراحی نهایی (Design System)

## خلاصه

**سبک طراحی:** Glassmorphism مدرن
**رنگ اصلی:** آبی بانک تجارت `#034ea2`
**فونت اصلی:** IBM Plex Sans + Vazirmatn (فارسی)
**حالت:** Dark Mode + Light Mode (هر دو کامل)
**RTL:** کامل

---

## رنگ‌های اصلی (Brand Colors)

### رنگ آبی بانک تجارت
| نام | Hex | RGB | کاربرد |
|-----|-----|-----|--------|
| **Tejarat Blue** | `#034ea2` | rgb(3, 78, 162) | رنگ اصلی برند |

### طیف رنگی آبی
| نام | Hex | کاربرد |
|-----|-----|--------|
| Tejarat 50 | `#E8F0FE` | پس‌زمینه روشن |
| Tejarat 100 | `#C5D9FC` | بوردر روشن |
| Tejarat 200 | `#9DBFF9` | آیکون روشن |
| Tejarat 300 | `#6BA0F5` | هاور روشن |
| Tejarat 400 | `#3A7FF1` | لینک روشن |
| Tejarat 500 | `#034ea2` | رنگ اصلی |
| Tejarat 600 | `#03448F` | دکمه فشرده |
| Tejarat 700 | `#023A7C` | متن تیره |
| Tejarat 800 | `#023069` | پس‌زمینه تیره |
| Tejarat 900 | `#012656` | پس‌زمینه عمیق |

---

## Dark Mode

### رنگ‌های اصلی
| نام | Hex | CSS Variable | کاربرد |
|-----|-----|--------------|--------|
| Background | `#0A0F1A` | `--bg-primary` | پس‌زمینه اصلی |
| Background Secondary | `#111827` | `--bg-secondary` | پس‌زمینه فرعی |
| Surface | `#1F2937` | `--bg-surface` | کارت‌ها، کادرها |
| Surface Elevated | `#283548` | `--bg-elevated` | کارت‌های فعال |
| Border | `#374151` | `--border-default` | حاشیه‌ها |
| Border Light | `#4B5563` | `--border-light` | حاشیه روشن‌تر |

### رنگ‌های متن
| نام | Hex | CSS Variable | کاربرد |
|-----|-----|--------------|--------|
| Text Primary | `#F9FAFB` | `--text-primary` | متن اصلی |
| Text Secondary | `#D1D5DB` | `--text-secondary` | متن فرعی |
| Text Muted | `#9CA3AF` | `--text-muted` | متن کمرنگ |
| Text Disabled | `#6B7280` | `--text-disabled` | متن غیرفعال |

### رنگ‌های برند (Dark)
| نام | Hex | CSS Variable | کاربرد |
|-----|-----|--------------|--------|
| Primary | `#034ea2` | `--color-primary` | دکمه‌ها، لینک‌ها |
| Primary Hover | `#0456B5` | `--color-primary-hover` | هاور |
| Primary Active | `#03448F` | `--color-primary-active` | فشرده |
| Primary Subtle | `rgba(3, 78, 162, 0.15)` | `--color-primary-subtle` | پس‌زمینه آیتم فعال |
| Primary Border | `rgba(3, 78, 162, 0.3)` | `--color-primary-border` | حاشیه فعال |

### رنگ‌های وضعیت (Dark)
| وضعیت | رنگ | CSS Variable | کاربرد |
|--------|-----|--------------|--------|
| Success | `#22C55E` | `--color-success` | موفقیت، فعال |
| Success Subtle | `rgba(34, 197, 94, 0.15)` | `--color-success-subtle` | پس‌زمینه موفقیت |
| Warning | `#F59E0B` | `--color-warning` | هشدار، در انتظار |
| Warning Subtle | `rgba(245, 158, 11, 0.15)` | `--color-warning-subtle` | پس‌زمینه هشدار |
| Error | `#EF4444` | `--color-error` | خطا، حذف |
| Error Subtle | `rgba(239, 68, 68, 0.15)` | `--color-error-subtle` | پس‌زمینه خطا |
| Info | `#3B82F6` | `--color-info` | اطلاعاتی |
| Info Subtle | `rgba(59, 130, 246, 0.15)` | `--color-info-subtle` | پس‌زمینه اطلاعاتی |

### Glassmorphism (Dark)
```css
.glass-dark {
  background: rgba(31, 41, 55, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.glass-dark-elevated {
  background: rgba(40, 53, 72, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
}
```

### سایه‌ها (Dark)
```css
.shadow-sm-dark { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); }
.shadow-md-dark { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4); }
.shadow-lg-dark { box-shadow: 0 10px 15px rgba(0, 0, 0, 0.5); }
.shadow-xl-dark { box-shadow: 0 20px 25px rgba(0, 0, 0, 0.6); }
.shadow-glow-dark { box-shadow: 0 0 20px rgba(3, 78, 162, 0.3); }
```

---

## Light Mode

### رنگ‌های اصلی
| نام | Hex | CSS Variable | کاربرد |
|-----|-----|--------------|--------|
| Background | `#F8FAFC` | `--bg-primary` | پس‌زمینه اصلی |
| Background Secondary | `#F1F5F9` | `--bg-secondary` | پس‌زمینه فرعی |
| Surface | `#FFFFFF` | `--bg-surface` | کارت‌ها، کادرها |
| Surface Elevated | `#FFFFFF` | `--bg-elevated` | کارت‌های فعال |
| Border | `#E2E8F0` | `--border-default` | حاشیه‌ها |
| Border Light | `#CBD5E1` | `--border-light` | حاشیه تیره‌تر |

### رنگ‌های متن
| نام | Hex | CSS Variable | کاربرد |
|-----|-----|--------------|--------|
| Text Primary | `#0F172A` | `--text-primary` | متن اصلی |
| Text Secondary | `#334155` | `--text-secondary` | متن فرعی |
| Text Muted | `#64748B` | `--text-muted` | متن کمرنگ |
| Text Disabled | `#94A3B8` | `--text-disabled` | متن غیرفعال |

### رنگ‌های برند (Light)
| نام | Hex | CSS Variable | کاربرد |
|-----|-----|--------------|--------|
| Primary | `#034ea2` | `--color-primary` | دکمه‌ها، لینک‌ها |
| Primary Hover | `#0456B5` | `--color-primary-hover` | هاور |
| Primary Active | `#03448F` | `--color-primary-active` | فشرده |
| Primary Subtle | `rgba(3, 78, 162, 0.08)` | `--color-primary-subtle` | پس‌زمینه آیتم فعال |
| Primary Border | `rgba(3, 78, 162, 0.2)` | `--color-primary-border` | حاشیه فعال |

### رنگ‌های وضعیت (Light)
| وضعیت | رنگ | CSS Variable | کاربرد |
|--------|-----|--------------|--------|
| Success | `#16A34A` | `--color-success` | موفقیت، فعال |
| Success Subtle | `rgba(22, 163, 74, 0.08)` | `--color-success-subtle` | پس‌زمینه موفقیت |
| Warning | `#D97706` | `--color-warning` | هشدار، در انتظار |
| Warning Subtle | `rgba(217, 119, 6, 0.08)` | `--color-warning-subtle` | پس‌زمینه هشدار |
| Error | `#DC2626` | `--color-error` | خطا، حذف |
| Error Subtle | `rgba(220, 38, 38, 0.08)` | `--color-error-subtle` | پس‌زمینه خطا |
| Info | `#2563EB` | `--color-info` | اطلاعاتی |
| Info Subtle | `rgba(37, 99, 235, 0.08)` | `--color-info-subtle` | پس‌زمینه اطلاعاتی |

### Glassmorphism (Light)
```css
.glass-light {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
}

.glass-light-elevated {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 16px;
}
```

### سایه‌ها (Light)
```css
.shadow-sm-light { box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); }
.shadow-md-light { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07); }
.shadow-lg-light { box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1); }
.shadow-xl-light { box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1); }
.shadow-glow-light { box-shadow: 0 0 20px rgba(3, 78, 162, 0.15); }
```

---

## تایپوگرافی (Typography)

### فونت اصلی (انگلیسی)
```css
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');

font-family: 'IBM Plex Sans', sans-serif;
```

### فونت فارسی
```css
@import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700&display=swap');

font-family: 'Vazirmatn', 'IBM Plex Sans', sans-serif;
```

### مقیاس اندازه
| سایز | پیکسل | وزن | کاربرد |
|-------|--------|------|--------|
| Display | 40px | Bold | عنوان اصلی صفحه |
| H1 | 32px | Bold | عنوان صفحه |
| H2 | 24px | SemiBold | عنوان بخش |
| H3 | 20px | Medium | عنوان کارت |
| H4 | 16px | Medium | عنوان فرعی |
| Body Large | 16px | Regular | متن اصلی |
| Body | 14px | Regular | متن عادی |
| Body Small | 12px | Regular | کپشن، تاریخ |
| Caption | 10px | Light | متن خیلی کوچک |

### ارتفاع خطوط
```css
.line-height-tight { line-height: 1.2; }    /* عناوین */
.line-height-normal { line-height: 1.5; }   /* متن اصلی */
.line-height-relaxed { line-height: 1.75; } /* متن طولانی */
```

---

## فاصله‌گذاری (Spacing)

### مقیاس فاصله
| مقدار | پیکسل | CSS Variable | کاربرد |
|-------|--------|--------------|--------|
| 0 | 0px | `--space-0` | بدون فاصله |
| 1 | 4px | `--space-1` | فاصله خیلی کم |
| 2 | 8px | `--space-2` | فاصله کم |
| 3 | 12px | `--space-3` | فاصله متوسط کم |
| 4 | 16px | `--space-4` | فاصله متوسط |
| 5 | 20px | `--space-5` | فاصله متوسط زیاد |
| 6 | 24px | `--space-6` | فاصله زیاد |
| 8 | 32px | `--space-8` | فاصله خیلی زیاد |
| 10 | 40px | `--space-10` | فاصله اصلی |
| 12 | 48px | `--space-12` | فاصله بین بخش‌ها |
| 16 | 64px | `--space-16` | فاصله صفحه |

### حاشیه‌ها (Border Radius)
| مقدار | پیکسل | CSS Variable | کاربرد |
|-------|--------|--------------|--------|
| none | 0px | `--radius-none` | بدون حاشیه |
| sm | 8px | `--radius-sm` | دکمه‌ها، آیکون‌ها |
| md | 12px | `--radius-md` | کارت‌های کوچک |
| lg | 16px | `--radius-lg` | کارت‌های بزرگ |
| xl | 24px | `--radius-xl` | کیف پول مادر |
| 2xl | 32px | `--radius-2xl` | مودال‌ها |
| full | 9999px | `--radius-full` | آواتار، دایره‌ای |

---

## آیکون‌ها (Icons)

### کتابخانه پیشنهادی
- **Lucide Icons** (lucide.dev) — رایگان، SVG، سبک
- **Heroicons** (heroicons.com) — رایگان، SVG

### اندازه آیکون‌ها
| اندازه | پیکسل | CSS Variable | کاربرد |
|--------|--------|--------------|--------|
| xs | 16px | `--icon-xs` | آیکون داخل دکمه |
| sm | 20px | `--icon-sm` | آیکون در لیست |
| md | 24px | `--icon-md` | آیکون اصلی |
| lg | 32px | `--icon-lg` | آیکون داشبورد |
| xl | 48px | `--icon-xl` | آیکون خالی |

### قوانین
- ✅ SVG استفاده کنید
- ✅ `aria-label` داشته باشید
- ✅ رنگ با متن هماهنگ باشه
- ❌ Emoji استفاده نکنید

---

## کامپوننت‌ها (Components)

### ۱. کیف پول مادر (Dark)
```css
.wallet-card-dark {
  background: linear-gradient(135deg, #034ea2 0%, #023069 100%);
  border-radius: 24px;
  padding: 24px;
  color: white;
  box-shadow: 0 20px 25px rgba(3, 78, 162, 0.3);
}
```

### ۱. کیف پول مادر (Light)
```css
.wallet-card-light {
  background: linear-gradient(135deg, #034ea2 0%, #0456B5 100%);
  border-radius: 24px;
  padding: 24px;
  color: white;
  box-shadow: 0 20px 25px rgba(3, 78, 162, 0.2);
}
```

### ۲. کارت خدمت (Dark)
```css
.service-card-dark {
  background: rgba(31, 41, 55, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
  transition: all 0.2s ease;
}
.service-card-dark:hover {
  background: rgba(40, 53, 72, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.5);
}
```

### ۲. کارت خدمت (Light)
```css
.service-card-light {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 16px;
  padding: 16px;
  transition: all 0.2s ease;
}
.service-card-light:hover {
  background: rgba(255, 255, 255, 0.85);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}
```

### ۳. دکمه اصلی
```css
.btn-primary {
  background: #034ea2;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  background: #0456B5;
  transform: translateY(-1px);
}
.btn-primary:active {
  background: #03448F;
  transform: translateY(0);
}
```

### ۴. دکمه خطر
```css
.btn-destructive {
  background: #EF4444;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: 600;
}
```

### ۵. کادر وضعیت
```css
.badge-active {
  background: rgba(34, 197, 94, 0.15);
  color: #22C55E;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}

.badge-expired {
  background: rgba(239, 68, 68, 0.15);
  color: #EF4444;
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}
```

### ۶. نوار پیشرفت
```css
.progress-bar {
  width: 100%;
  height: 8px;
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar-dark {
  background: #1F2937;
}

.progress-bar-light {
  background: #E2E8F0;
}

.progress-fill {
  height: 100%;
  background: #034ea2;
  border-radius: 9999px;
  transition: width 0.3s ease;
}
```

---

## نمودارها (Charts)

### رنگ‌های نمودار
```javascript
const chartColors = {
  primary: '#034ea2',      // آبی تجارت
  secondary: '#22C55E',    // سبز
  warning: '#F59E0B',      // زرد
  danger: '#EF4444',       // قرمز
  info: '#3B82F6',         // آبی روشن
  muted: '#6B7280',        // خاکستری
  series: [
    '#034ea2',  // آبی تجارت
    '#22C55E',  // سبز
    '#F59E0B',  // زرد
    '#EF4444',  // قرمز
    '#8B5CF6',  // بنفش
    '#EC4899',  // صورتی
  ]
};
```

### نمودار پیشنهادی
| نوع | کاربرد | کتابخانه |
|-----|--------|----------|
| Donut | توزیع هزینه‌ها | Chart.js |
| Bar | دریافتی/پرداختی | Chart.js |
| Line | روند موجودی | Chart.js |
| Area | نمودار تجمعی | Chart.js |

---

## RTL (راست به چپ)

### قوانین
```css
html {
  direction: rtl;
  text-align: right;
}

/* معکوس کردن آیکون‌های جهت‌دار */
.icon-chevron-left {
  transform: scaleX(-1);
}

/* Flexbox معکوس */
.container-rtl {
  display: flex;
  flex-direction: row-reverse;
}

/* Padding معکوس */
.pad-rtl {
  padding-right: 16px;
  padding-left: 16px;
}
```

---

## واکنش‌گرایی (Responsive)

### بریک‌پوینت‌ها
```css
/* Mobile First */
@media (min-width: 375px) { /* xs: موبایل کوچک */ }
@media (min-width: 640px) { /* sm: موبایل بزرگ */ }
@media (min-width: 768px) { /* md: تبلت */ }
@media (min-width: 1024px) { /* lg: دسکتاپ کوچک */ }
@media (min-width: 1440px) { /* xl: دسکتاپ بزرگ */ }
```

### قوانین
- ✅ Mobile First طراحی کنید
- ✅ حداقل لمس 44×44px
- ✅ فاصله بین دکمه‌ها حداقل 8px
- ✅ متن حداقل 12px

---

## دسترسی‌پذیری (Accessibility)

### قوانین
- ✅ کنتراست رنگ حداقل 4.5:1
- ✅ `alt` برای تصاویر
- ✅ `aria-label` برای آیکون‌ها
- ✅ ناوبری کیبورد
- ✅ `prefers-reduced-motion` رعایت

---

## انیمیشن‌ها (Animation)

### قوانین
```css
/* ترنزیشن استاندارد */
.transition-fast { transition: all 0.15s ease; }
.transition-normal { transition: all 0.2s ease; }
.transition-slow { transition: all 0.3s ease; }

/* هاور دکمه */
.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(3, 78, 162, 0.2);
}

/* کارت هاور */
.card:hover {
  transform: translateY(-2px);
}
```

---

## فایل‌های مرتبط
- [PRD-Hasto.md](PRD-Hasto.md) — PRD کلی محصول
- [Hasto-B2C.md](Hasto-B2C.md) — جزئیات لایه B2C
- [Hasto-B2B.md](Hasto-B2B.md) — جزئیات لایه B2B
- [Hasto-MVP-Plan.md](Hasto-MVP-Plan.md) — نقشه کامل MVP
