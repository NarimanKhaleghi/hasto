"use client";

import { useAppStore } from "@/lib/hasto-store";
import { B2BHeader } from "@/components/hasto/b2b/b2b-header";
import { B2BBottomNav } from "@/components/hasto/b2b/b2b-bottom-nav";
import { ScrollArea } from "@/components/ui/scroll-area";

import { B2BLoginScreen } from "@/components/hasto/b2b/screens/login";
import { B2BVerifyScreen } from "@/components/hasto/b2b/screens/verify";
import { B2BDashboardScreen } from "@/components/hasto/b2b/screens/dashboard";
import { B2BPaymentLinkScreen } from "@/components/hasto/b2b/screens/payment-link";
import { B2BStoreScreen } from "@/components/hasto/b2b/screens/store";
import { B2BProductAddScreen } from "@/components/hasto/b2b/screens/product-add";
import { B2BContractsScreen } from "@/components/hasto/b2b/screens/contracts";
import { B2BFinancialScreen } from "@/components/hasto/b2b/screens/financial";
import { B2BAccountDetailScreen } from "@/components/hasto/b2b/screens/account-detail";
import { B2BTerminalDetailScreen } from "@/components/hasto/b2b/screens/terminal-detail";
import { B2BTerminalTicketScreen } from "@/components/hasto/b2b/screens/terminal-ticket";
import { B2BTransactionsScreen } from "@/components/hasto/b2b/screens/transactions";
import { B2BSettingsScreen } from "@/components/hasto/b2b/screens/settings";

const screens: Record<string, React.ComponentType> = {
  "b2b-login": B2BLoginScreen,
  "b2b-verify": B2BVerifyScreen,
  "b2b-dashboard": B2BDashboardScreen,
  "b2b-payment-link": B2BPaymentLinkScreen,
  "b2b-store": B2BStoreScreen,
  "b2b-product-add": B2BProductAddScreen,
  "b2b-contracts": B2BContractsScreen,
  "b2b-financial": B2BFinancialScreen,
  "b2b-account-detail": B2BAccountDetailScreen,
  "b2b-terminal-detail": B2BTerminalDetailScreen,
  "b2b-terminal-ticket": B2BTerminalTicketScreen,
  "b2b-transactions": B2BTransactionsScreen,
  "b2b-settings": B2BSettingsScreen,
};

export function B2BApp() {
  const b2bScreen = useAppStore((s) => s.b2bScreen);
  const Screen = screens[b2bScreen] ?? B2BLoginScreen;

  if (b2bScreen === "b2b-login" || b2bScreen === "b2b-verify") {
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <Screen />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <B2BHeader title={getB2BTitle(b2bScreen)} />
      <ScrollArea className="flex-1 min-h-0">
        <div key={b2bScreen} className="animate-fade-in pb-20">
          <Screen />
        </div>
      </ScrollArea>
      <B2BBottomNav />
    </div>
  );
}

function getB2BTitle(screen: string): string | undefined {
  const titles: Record<string, string> = {
    "b2b-dashboard": undefined,
    "b2b-payment-link": "ساخت لینک پرداخت",
    "b2b-store": "فروشگاه",
    "b2b-product-add": "افزودن محصول",
    "b2b-contracts": "قراردادها",
    "b2b-financial": "مدیریت مالی",
    "b2b-account-detail": "جزئیات حساب",
    "b2b-terminal-detail": "جزئیات پایانه",
    "b2b-terminal-ticket": "ثبت تیکت",
    "b2b-transactions": "تراکنش‌ها",
    "b2b-settings": "تنظیمات",
  };
  return titles[screen];
}
