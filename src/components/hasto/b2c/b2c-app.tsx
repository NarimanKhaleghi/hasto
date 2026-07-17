"use client";

import { useAppStore } from "@/lib/hasto-store";
import { Header } from "@/components/hasto/shared/header";
import { BottomNav } from "@/components/hasto/shared/bottom-nav";
import { GlobalSearch } from "@/components/hasto/shared/global-search";
import { ScrollArea } from "@/components/ui/scroll-area";

// B2C Screens
import { LoginScreen } from "@/components/hasto/b2c/screens/login";
import { DashboardScreen } from "@/components/hasto/b2c/screens/dashboard";
import { TransferScreen } from "@/components/hasto/b2c/screens/transfer";
import { TransferConfirmScreen } from "@/components/hasto/b2c/screens/transfer-confirm";
import { TransferPinScreen } from "@/components/hasto/b2c/screens/transfer-pin";
import { TransferReceiptScreen } from "@/components/hasto/b2c/screens/transfer-receipt";
import { ReceiveScreen } from "@/components/hasto/b2c/screens/receive";
import { ReceiveWithIdScreen } from "@/components/hasto/b2c/screens/receive-with-id";
import { PaymentScreen } from "@/components/hasto/b2c/screens/payment";
import { PaymentIdScreen } from "@/components/hasto/b2c/screens/payment-id";
import { PaymentQrScreen } from "@/components/hasto/b2c/screens/payment-qr";
import { PaymentNfcScreen } from "@/components/hasto/b2c/screens/payment-nfc";
import { PaymentNearbyScreen } from "@/components/hasto/b2c/screens/payment-nearby";
import { FinancialScreen } from "@/components/hasto/b2c/screens/financial";
import { ServicesScreen } from "@/components/hasto/b2c/screens/services";
import { ContractsScreen } from "@/components/hasto/b2c/screens/contracts";
import { ContractDetailScreen } from "@/components/hasto/b2c/screens/contract-detail";
import { ContractCreateScreen } from "@/components/hasto/b2c/screens/contract-create";
import { BillsScreen } from "@/components/hasto/b2c/screens/bills";
import { InstallmentsScreen } from "@/components/hasto/b2c/screens/installments";
import { TransactionsScreen } from "@/components/hasto/b2c/screens/transactions";
import { ProfileScreen } from "@/components/hasto/b2c/screens/profile";
import { NotificationsScreen } from "@/components/hasto/b2c/screens/notifications";
import { WalletDetailScreen } from "@/components/hasto/b2c/screens/wallet-detail";
import { CalendarScreen } from "@/components/hasto/b2c/screens/calendar";
import { SavingsGoalsScreen } from "@/components/hasto/b2c/screens/savings-goals";
import { AchievementsScreen } from "@/components/hasto/b2c/screens/achievements";
import { CurrencyConverterScreen } from "@/components/hasto/b2c/screens/currency-converter";
import { SpendingCategoriesScreen } from "@/components/hasto/b2c/screens/spending-categories";
import { Onboarding } from "@/components/hasto/shared/onboarding";

const screens: Record<string, React.ComponentType> = {
  login: LoginScreen,
  dashboard: DashboardScreen,
  transfer: TransferScreen,
  "transfer-confirm": TransferConfirmScreen,
  "transfer-pin": TransferPinScreen,
  "transfer-receipt": TransferReceiptScreen,
  receive: ReceiveScreen,
  "receive-with-id": ReceiveWithIdScreen,
  payment: PaymentScreen,
  "payment-id": PaymentIdScreen,
  "payment-qr": PaymentQrScreen,
  "payment-nfc": PaymentNfcScreen,
  "payment-nearby": PaymentNearbyScreen,
  financial: FinancialScreen,
  services: ServicesScreen,
  contracts: ContractsScreen,
  "contract-detail": ContractDetailScreen,
  "contract-create": ContractCreateScreen,
  bills: BillsScreen,
  installments: InstallmentsScreen,
  transactions: TransactionsScreen,
  profile: ProfileScreen,
  notifications: NotificationsScreen,
  "wallet-detail": WalletDetailScreen,
  calendar: CalendarScreen,
  "savings-goals": SavingsGoalsScreen,
  achievements: AchievementsScreen,
  "currency-converter": CurrencyConverterScreen,
  "spending-categories": SpendingCategoriesScreen,
};

const noChromeScreens = ["login", "transfer-pin", "transfer-receipt", "payment-pin", "payment-receipt"];

export function B2CApp() {
  const b2cScreen = useAppStore((s) => s.b2cScreen);
  const Screen = screens[b2cScreen] ?? DashboardScreen;

  const isLogin = b2cScreen === "login";
  const noChrome = noChromeScreens.includes(b2cScreen);

  if (isLogin) {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <LoginScreen />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      {!noChrome && <Header title={getScreenTitle(b2cScreen)} />}
      <ScrollArea className="flex-1">
        <div key={b2cScreen} className="animate-fade-in">
          <Screen />
        </div>
      </ScrollArea>
      {!noChrome && <BottomNav />}
      {!noChrome && <GlobalSearch />}
      <Onboarding />
    </div>
  );
}

function getScreenTitle(screen: string): string | undefined {
  const titles: Record<string, string> = {
    dashboard: undefined,
    transfer: "واریز",
    "transfer-confirm": "تایید پرداخت",
    "transfer-receipt": "رسید پرداخت",
    receive: "دریافت",
    "receive-with-id": "دریافت با شناسه",
    payment: "پرداخت",
    "payment-id": "شناسه واریز",
    "payment-qr": "اسکن QR",
    "payment-nfc": "پرداخت NFC",
    "payment-nearby": "پرداخت نزدیک",
    financial: "مدیریت مالی",
    services: "خدمات",
    contracts: "قراردادهای من",
    "contract-detail": "جزئیات قرارداد",
    "contract-create": "قرارداد جدید",
    bills: "پرداخت قبض",
    installments: "اقساط متمرکز",
    transactions: "تاریخچه تراکنش‌ها",
    profile: "پروفایل",
    notifications: "اعلان‌ها",
    "wallet-detail": "کیف پول مادر",
    calendar: "تقویم پرداخت",
    "savings-goals": "اهداف پس‌انداز",
    achievements: "دستاوردها",
    "currency-converter": "تبدیل ارز",
    "spending-categories": "دسته‌بندی هزینه‌ها",
  };
  return titles[screen];
}
