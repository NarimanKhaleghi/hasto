---
date_shamsi: "1405-04-25"
date_gregorian: "2026-07-16"
date_hijri: "1448-02-01"
weekday: "پنجشنبه"
week: "1405-W17"
month_name: "تیر"
month: "1405-04"
days_passed_month: "25"
days_remaining_month: "6"
season_name: "تابستان"
season: "1405-S2"
days_passed_season: "25"
days_remaining_season: "68"
year: "1405"
days_passed_year: "118"
days_remaining_year: "247"
---
## سقف برداشت قرداداد های Direct Debit

- برداشت تا 100 میلیون
	- بلو بانک
	- بانک دی
- برداشت تا 50 میلیون
	- سرمایه
	- اقتصاد نوین
- برداشت تا 40 میلیون
	- تجارت
- برداشت تا 15 میلیون
	- سپه
	- ملی
	- کشاورزی
	- سینا
	- پست بانک
	- ایران زمین
	- مهر
	- سامان
- برداشت تا 3 میلیون
	- ملت

---



بسیار عالی. این تغییر، «هستو» را از یک ساده‌ساز برداشت بانکی به یک **Aggregator اعتبار هوشمند** تبدیل می‌کند. حالا ما دو نوع ورودی داریم:
1.  **ورودی نقدینگی (Liquidity):** بانک‌ها (Direct Debit)
2.  **ورودی اعتبار (Credit Lines):** پلتفرم‌های BNPL و فین‌تک‌ها

من نمودار را طوری بازنویسی کردم که این دو دسته ورودی در سمت چپ مشخص باشند و همگی به هستو متصل شوند. همچنین برای پلتفرم‌های اعتباری، نام سرویس‌دهنده اصلی (مثل تجارت یا دیجی‌کالا) را هم ذکر کردم تا شفافیت بیشتری داشته باشد.

```mermaid
graph LR
    %% استایل‌های اصلی
    classDef core fill:#1a1a1a,stroke:#333,stroke-width:4px,color:#fff,rx:10,ry:10;
    classDef bankNode fill:#f8f9fa,stroke:#dee2e6,stroke-width:1px,color:#333,rx:5,ry:5;
    classDef creditNode fill:#e8f4f8,stroke:#3498db,stroke-width:2px,color:#2c3e50,rx:5,ry:5;
    classDef outputNode fill:#ffffff,stroke:#333,stroke-width:2px,color:#000,rx:8,ry:8;

    %% ==================== ورودی‌ها ====================
    
    subgraph Inputs ["ورودی‌های هستو"]
        direction TB
        
        %% بخش ۱: بانک‌ها (نقدینگی)
        subgraph Banks ["بانک‌ها (Direct Debit)"]
            direction TB
            subgraph G1 ["سقف ۱۰۰ م"]
                Blu["بلو بانک"]:::bankNode
                Day["بانک دی"]:::bankNode
            end
            subgraph G2 ["سقف ۵۰ م"]
                Sarmayeh["سرمایه"]:::bankNode
                Eghtesad["اقتصاد نوین"]:::bankNode
            end
            subgraph G3 ["سقف ۴۰ م"]
                TejaratBank["تجارت"]:::bankNode
            end
            subgraph G4 ["سقف ۱۵ م"]
                Sepah["سپه"]:::bankNode
                Melli["ملی"]:::bankNode
                Keshavarzi["کشاورزی"]:::bankNode
                Sina["سینا"]:::bankNode
                Post["پست بانک"]:::bankNode
                IranZamin["ایران زمین"]:::bankNode
                Mehr["مهر ایران"]:::bankNode
                Saman["سامان"]:::bankNode
            end
            subgraph G5 ["سقف ۳ م"]
                Mellat["ملت"]:::bankNode
            end
        end

        %% بخش ۲: پلتفرم‌های اعتباری (Credit Lines)
        subgraph CreditPlatforms ["پلتفرم‌های اعتباری (BNPL/Credit)"]
            direction TB
            TejaratBNPL["BNPL تجارت / پی‌نو"]:::creditNode
            DigiPay["اعتبار دیجی‌پی"]:::creditNode
            Snappay["اسنپ‌پی"]:::creditNode
            %% جای خالی برای اضافه کردن موارد بعدی مثل تارا، ازکی وام و...
        end
    end

    %% ==================== هسته مرکزی ====================
    Hasto[("🏦 هستو<br/>Hasto Core")]:::core

    %% ==================== خروجی‌ها (خدمات) ====================
    
    subgraph Outputs ["خروجی‌های سرویس هستو"]
        direction TB
        
        %% شاخه ۱: اقساط
        subgraph Installments ["مدیریت اقساط"]
            direction TB
            BankLoans["اقساط بانکی"]:::outputNode
            PlatformLoans["اقساط پلتفرم‌ها"]:::outputNode
        end

        %% شاخه ۲: پرداخت‌های دوره‌ای
        subgraph Recurring ["پرداخت‌های تکرارشونده"]
            direction TB
            Bills["قبوض (آب، برق، گاز، تلفن)"]:::outputNode
            Subscriptions["اشتراک‌ها (فیلیمو، AI، نرم‌افزار)"]:::outputNode
            Insurance["بیمه‌نامه‌ها"]:::outputNode
        end

        %% شاخه ۳: پرداخت‌های آنی
        subgraph OneTime ["پرداخت‌های آنی"]
            direction TB
            OnlineShop["خرید فروشگاه آنلاین"]:::outputNode
            POS["پرداخت در محل/POS"]:::outputNode
        end
    end

    %% ==================== اتصالات ====================
    
    %% اتصال بانک‌ها به هستو
    Blu --> Hasto
    Day --> Hasto
    Sarmayeh --> Hasto
    Eghtesad --> Hasto
    TejaratBank --> Hasto
    Sepah --> Hasto
    Melli --> Hasto
    Keshavarzi --> Hasto
    Sina --> Hasto
    Post --> Hasto
    IranZamin --> Hasto
    Mehr --> Hasto
    Saman --> Hasto
    Mellat --> Hasto

    %% اتصال پلتفرم‌های اعتباری به هستو
    TejaratBNPL --> Hasto
    DigiPay --> Hasto
    Snappay --> Hasto

    %% اتصال هستو به خروجی‌ها
    Hasto --> BankLoans
    Hasto --> PlatformLoans
    Hasto --> Bills
    Hasto --> Subscriptions
    Hasto --> Insurance
    Hasto --> OnlineShop
    Hasto --> POS

    %% استایل کادرهای گروه‌بندی
    style G1 fill:none,stroke:#27ae60,stroke-width:2px,stroke-dasharray: 5 5
    style G2 fill:none,stroke:#2980b9,stroke-width:2px,stroke-dasharray: 5 5
    style G3 fill:none,stroke:#8e44ad,stroke-width:2px,stroke-dasharray: 5 5
    style G4 fill:none,stroke:#f39c12,stroke-width:2px,stroke-dasharray: 5 5
    style G5 fill:none,stroke:#c0392b,stroke-width:2px,stroke-dasharray: 5 5
    style CreditPlatforms fill:none,stroke:#3498db,stroke-width:2px
    style Installments fill:none,stroke:#16a085,stroke-width:2px
    style Recurring fill:none,stroke:#2980b9,stroke-width:2px
    style OneTime fill:none,stroke:#d35400,stroke-width:2px
```

### نکات کلیدی این معماری جدید:
*   **تمایز رنگی:** پلتفرم‌های اعتباری (BNPL) با رنگ آبی روشن (`creditNode`) از بانک‌ها متمایز شده‌اند تا نشان دهند ماهیت آن‌ها "خط اعتبار" است نه لزوماً "موجودی نقد".
*   **انعطاف‌پذیری:** این ساختار به تو اجازه می‌دهد هر پلتفرم جدیدی (مثل تارا، ازکی‌وام، یا لندو) را به راحتی به بخش `CreditPlatforms` اضافه کنی.
*   **یکپارچگی:** چه پول از حساب بانکی بیاید، چه از اعتبار اسنپ‌پی، همه در «هستو» تجمیع شده و کاربر می‌تواند تصمیم بگیرد کدام بدهی یا خرید را اولویت‌بندی کند.

آیا می‌خواهی منطق **"Smart Routing"** (مسیریابی هوشمند) را هم اضافه کنیم؟ مثلاً اینکه هستو چگونه تصمیم بگیرد برای پرداخت قبض برق، اول از کدام منبع (بانک یا اعتبار) برداشت کند؟


---
