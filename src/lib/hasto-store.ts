"use client";

import { create } from "zustand";

// ==================== App Mode ====================
export type AppMode = "b2c" | "b2b";

// ==================== B2C Screens ====================
export type B2CScreen =
  | "login"
  | "dashboard"
  | "transfer"
  | "transfer-confirm"
  | "transfer-pin"
  | "transfer-receipt"
  | "receive"
  | "receive-with-id"
  | "payment"
  | "payment-id"
  | "payment-qr"
  | "payment-nfc"
  | "payment-nearby"
  | "payment-pin"
  | "payment-receipt"
  | "financial"
  | "services"
  | "contracts"
  | "contract-detail"
  | "contract-create"
  | "bills"
  | "installments"
  | "transactions"
  | "profile"
  | "notifications"
  | "wallet-detail"
  | "calendar"
  | "savings-goals"
  | "achievements"
  | "currency-converter"
  | "spending-categories"
  | "help-support"
  | "app-lock"
  | "language-settings";

// ==================== B2B Screens ====================
export type B2BScreen =
  | "b2b-login"
  | "b2b-verify"
  | "b2b-dashboard"
  | "b2b-payment-link"
  | "b2b-store"
  | "b2b-product-add"
  | "b2b-contracts"
  | "b2b-financial"
  | "b2b-account-detail"
  | "b2b-terminal-detail"
  | "b2b-terminal-ticket"
  | "b2b-tool-open-account"
  | "b2b-tool-request-pos"
  | "b2b-tool-request-gateway"
  | "b2b-tool-api"
  | "b2b-tool-telegram-bot"
  | "b2b-tool-instagram-bot"
  | "b2b-tool-web-page"
  | "b2b-transactions"
  | "b2b-settings";

// ==================== Active transfer/payment context ====================
export type TransferContext = {
  recipientName: string;
  recipientNumber: string;
  recipientType: "mobile" | "card" | "sheba" | "id" | "qr" | "nfc" | "shop";
  bank?: string;
  amount: number;
  amountText: string;
  description?: string;
  paymentMethod?: string;
};

type AppState = {
  // Mode
  mode: AppMode;
  setMode: (m: AppMode) => void;

  // B2C navigation
  b2cScreen: B2CScreen;
  b2cHistory: B2CScreen[];
  setB2CScreen: (s: B2CScreen) => void;
  goBack: () => void;

  // B2B navigation
  b2bScreen: B2BScreen;
  b2bHistory: B2BScreen[];
  setB2BScreen: (s: B2BScreen) => void;
  goBackB2B: () => void;

  // Auth state (mock - user is always logged in for demo)
  isAuthenticated: boolean;
  setAuthenticated: (v: boolean) => void;

  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (t: "light" | "dark") => void;

  // Transfer context
  transferContext: TransferContext | null;
  setTransferContext: (c: TransferContext | null) => void;

  // Active contract
  activeContractId: string | null;
  setActiveContractId: (id: string | null) => void;

  // Active terminal/account for detail pages
  activeAccountId: string | null;
  activeTerminalId: string | null;
  setActiveAccountId: (id: string | null) => void;
  setActiveTerminalId: (id: string | null) => void;

  // Phone frame toggle (desktop preview)
  phoneFrame: boolean;
  setPhoneFrame: (v: boolean) => void;

  // Onboarding
  showOnboarding: boolean;
  onboardingStep: number;
  setShowOnboarding: (v: boolean) => void;
  setOnboardingStep: (v: number) => void;
  completeOnboarding: () => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  mode: "b2c",
  setMode: (m) =>
    set({
      mode: m,
      b2cScreen: m === "b2c" ? "dashboard" : get().b2cScreen,
      b2bScreen: m === "b2b" ? "b2b-dashboard" : get().b2bScreen,
    }),

  b2cScreen: "login",
  b2cHistory: [],
  setB2CScreen: (s) =>
    set((state) => ({
      b2cScreen: s,
      b2cHistory: [...state.b2cHistory, state.b2cScreen].slice(-20),
    })),
  goBack: () =>
    set((state) => {
      const hist = [...state.b2cHistory];
      const prev = hist.pop();
      return {
        b2cScreen: prev ?? "dashboard",
        b2cHistory: hist,
      };
    }),

  b2bScreen: "b2b-login",
  b2bHistory: [],
  setB2BScreen: (s) =>
    set((state) => ({
      b2bScreen: s,
      b2bHistory: [...state.b2bHistory, state.b2bScreen].slice(-20),
    })),
  goBackB2B: () =>
    set((state) => {
      const hist = [...state.b2bHistory];
      const prev = hist.pop();
      return {
        b2bScreen: prev ?? "b2b-dashboard",
        b2bHistory: hist,
      };
    }),

  isAuthenticated: false,
  setAuthenticated: (v) => set({ isAuthenticated: v }),

  theme: "light",
  toggleTheme: () =>
    set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
  setTheme: (t) => set({ theme: t }),

  transferContext: null,
  setTransferContext: (c) => set({ transferContext: c }),

  activeContractId: null,
  setActiveContractId: (id) => set({ activeContractId: id }),

  activeAccountId: null,
  activeTerminalId: null,
  setActiveAccountId: (id) => set({ activeAccountId: id }),
  setActiveTerminalId: (id) => set({ activeTerminalId: id }),

  phoneFrame: true,
  setPhoneFrame: (v) => set({ phoneFrame: v }),

  showOnboarding: false,
  onboardingStep: 0,
  setShowOnboarding: (v) => set({ showOnboarding: v, onboardingStep: v ? 0 : 0 }),
  setOnboardingStep: (v) => set({ onboardingStep: v }),
  completeOnboarding: () => set({ showOnboarding: false, onboardingStep: 0 }),
}));
