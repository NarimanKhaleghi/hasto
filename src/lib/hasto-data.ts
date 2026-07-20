// ==================== Hasto Mock Data ====================
// Central mock data store for the entire Hasto application

// Convert english digits to Persian
export const fa = (n: string | number): string => {
  const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return String(n).replace(/\d/g, (d) => faDigits[parseInt(d)]);
};

// Convert Persian/Arabic digits to English and parse as number
export const parseFa = (s: string): number => {
  if (!s) return 0;
  const en = s
    .replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)))
    .replace(/,/g, "")
    .replace(/[^\d-]/g, "");
  const n = parseInt(en);
  return isNaN(n) ? 0 : n;
};

export const formatToman = (n: number): string => {
  return fa(n.toLocaleString("en-US"));
};

// ==================== User Profile ====================
export const user = {
  name: "علی محمدی",
  phone: "۰۹۱۲۳۴۵۶۷۸۹",
  phoneRaw: "09123456789",
  phoneMasked: "۰۹۱۲***۶۷۸۹",
  email: "ali.mohammadi@example.com",
  joinDate: "۱۴۰۵/۰۱/۰۱",
  avatar: null,
  wallet: {
    balance: 12450000,
    balanceText: "۱۲,۴۵۰,۰۰۰",
    cardNumber: "6273-5312-3456-7890",
    cardNumberMasked: "۶۲۷۳-۵۳۱۲-****-۷۸۹۰",
    sheba: "IR360170000000328782636009",
    accountNumber: "۳۲۸۷۸۲۶۳۶۰۰۹",
    expiry: "۱۲/۲۸",
  },
};

// ==================== Connected Banks (Direct Debit) ====================
export type BankContract = {
  id: string;
  bank: string;
  prefix: string;
  limit: string;
  limitValue: number;
  connected: boolean;
  status: "active" | "expired" | "pending";
  color: string;
  logo: string;
};

export const banks: BankContract[] = [
  { id: "BNK-001", bank: "بلو بانک", prefix: "6279-61", limit: "۱۰۰ میلیون", limitValue: 100000000, connected: true, status: "active", color: "#00B4D8", logo: "🟦" },
  { id: "BNK-002", bank: "بانک دی", prefix: "5029-38", limit: "۱۰۰ میلیون", limitValue: 100000000, connected: true, status: "active", color: "#0EA5E9", logo: "🔷" },
  { id: "BNK-003", bank: "بانک سرمایه", prefix: "6396-07", limit: "۵۰ میلیون", limitValue: 50000000, connected: true, status: "active", color: "#10B981", logo: "💚" },
  { id: "BNK-004", bank: "بانک تجارت", prefix: "6273-53", limit: "۴۰ میلیون", limitValue: 40000000, connected: true, status: "active", color: "#034ea2", logo: "🏛️" },
  { id: "BNK-005", bank: "بانک سپه", prefix: "5892-10", limit: "۱۵ میلیون", limitValue: 15000000, connected: true, status: "active", color: "#F59E0B", logo: "🟡" },
  { id: "BNK-006", bank: "بانک ملی", prefix: "6037-99", limit: "۱۵ میلیون", limitValue: 15000000, connected: true, status: "active", color: "#84CC16", logo: "🟩" },
  { id: "BNK-007", bank: "بانک ملت", prefix: "6104-33", limit: "۳ میلیون", limitValue: 3000000, connected: false, status: "pending", color: "#EF4444", logo: "🟥" },
];

// ==================== Card Prefix Lookup ====================
export const cardPrefixes: Record<string, string> = {
  "6274-12": "اقتصاد نوین",
  "6273-81": "انصار",
  "5057-85": "ایران زمین",
  "6221-06": "پارسیان",
  "6391-94": "پارسیان",
  "6278-84": "پارسیان",
  "6393-47": "پاسارگاد",
  "5022-29": "پاسارگاد",
  "6362-14": "آینده",
  "6273-53": "تجارت",
  "5029-08": "توسعه تعاون",
  "6276-48": "توسعه صادرات ایران",
  "2071-77": "توسعه صادرات ایران",
  "6369-49": "حکمت ایرانیان (سپه)",
  "5029-38": "دی",
  "5894-63": "رفاه کارگران",
  "6037-69": "صادرات ایران",
  "6279-61": "صنعت و معدن",
  "6063-73": "قرض الحسنه مهر ایران",
  "6395-99": "قوامین",
  "6274-88": "کارآفرین",
  "5029-10": "کارآفرین",
  "6037-70": "کشاورزی",
  "6392-17": "کشاورزی",
  "5054-16": "گردشگری",
  "6367-95": "مرکزی",
  "6280-23": "مسکن",
  "6104-33": "ملت",
  "9919-75": "ملت",
  "6037-99": "ملی ایران",
  "6393-70": "مهر اقتصاد (سپه)",
  "6277-60": "پست ایران",
  "6281-57": "موسسه اعتباری توسعه",
  "5058-01": "موسسه اعتباری کوثر (سپه)",
  "6219-86": "سامان",
  "6396-07": "سرمایه",
  "6393-46": "سینا",
  "5028-06": "شهر",
  "5022-29": "پاسارگاد",
};

// ==================== Recent Transfer Destinations ====================
export type RecentTransfer = {
  id: string;
  name: string;
  number: string;
  type: "mobile" | "card" | "sheba";
  bank?: string;
  lastAmount: string;
  lastDate: string;
  avatar?: string;
};

export const recentTransfers: RecentTransfer[] = [
  { id: "T1", name: "رضا کریمی", number: "09123456789", type: "mobile", lastAmount: "۲۵۰,۰۰۰", lastDate: "امروز" },
  { id: "T2", name: "مریم احمدی", number: "6273-5312-3456-7890", type: "card", bank: "تجارت", lastAmount: "۵۰۰,۰۰۰", lastDate: "دیروز" },
  { id: "T3", name: "حسین رضایی", number: "IR360170000000328782636009", type: "sheba", lastAmount: "۱,۲۰۰,۰۰۰", lastDate: "۲ روز پیش" },
  { id: "T4", name: "سارا کاظمی", number: "09351112233", type: "mobile", lastAmount: "۸۰,۰۰۰", lastDate: "۳ روز پیش" },
  { id: "T5", name: "محمد حسینی", number: "6037-9912-3456-7890", type: "card", bank: "ملی", lastAmount: "۲,۰۰۰,۰۰۰", lastDate: "هفته پیش" },
  { id: "T6", name: "فاطمه نوری", number: "09195556677", type: "mobile", lastAmount: "۳۵۰,۰۰۰", lastDate: "هفته پیش" },
];

// ==================== Transactions ====================
export type Transaction = {
  id: string;
  type: "deposit" | "withdraw" | "charge" | "bill" | "installment" | "receive";
  typeLabel: string;
  title: string;
  desc: string;
  amount: number;
  amountText: string;
  date: string;
  time: string;
  status: "success" | "pending" | "failed";
  icon: string;
};

export const transactions: Transaction[] = [
  { id: "TX1", type: "withdraw", typeLabel: "واریز", title: "رضا کریمی", desc: "به رضا کریمی", amount: 250000, amountText: "۲۵۰,۰۰۰", date: "امروز", time: "۱۴:۳۰", status: "success", icon: "↗" },
  { id: "TX2", type: "receive", typeLabel: "دریافت", title: "مریم احمدی", desc: "از مریم احمدی", amount: 1500000, amountText: "۱,۵۰۰,۰۰۰", date: "امروز", time: "۱۲:۱۵", status: "success", icon: "↙" },
  { id: "TX3", type: "charge", typeLabel: "شارژ", title: "بلو بانک", desc: "از بلو بانک", amount: 5000000, amountText: "۵,۰۰۰,۰۰۰", date: "دیروز", time: "۲۰:۴۵", status: "success", icon: "⚡" },
  { id: "TX4", type: "bill", typeLabel: "قبوض", title: "قبض برق", desc: "پرداخت قبض برق", amount: 180000, amountText: "۱۸۰,۰۰۰", date: "۳ روز پیش", time: "۱۰:۲۰", status: "success", icon: "⚡" },
  { id: "TX5", type: "withdraw", typeLabel: "واریز", title: "حسین رضایی", desc: "به حسین رضایی", amount: 1200000, amountText: "۱,۲۰۰,۰۰۰", date: "۲ روز پیش", time: "۱۸:۰۰", status: "success", icon: "↗" },
  { id: "TX6", type: "installment", typeLabel: "قسط", title: "اسنپ‌پی", desc: "قسط ماهانه اسنپ‌پی", amount: 400000, amountText: "۴۰۰,۰۰۰", date: "۴ روز پیش", time: "۰۹:۰۰", status: "success", icon: "📅" },
  { id: "TX7", type: "bill", typeLabel: "قبوض", title: "قبض گاز", desc: "پرداخت قبض گاز", amount: 95000, amountText: "۹۵,۰۰۰", date: "۵ روز پیش", time: "۱۶:۳۰", status: "success", icon: "🔥" },
  { id: "TX8", type: "receive", typeLabel: "دریافت", title: "سارا کاظمی", desc: "از سارا کاظمی", amount: 80000, amountText: "۸۰,۰۰۰", date: "۱ هفته پیش", time: "۱۱:۰۰", status: "success", icon: "↙" },
  { id: "TX9", type: "withdraw", typeLabel: "واریز", title: "فاطمه نوری", desc: "به فاطمه نوری", amount: 350000, amountText: "۳۵۰,۰۰۰", date: "۱ هفته پیش", time: "۱۴:۰۰", status: "success", icon: "↗" },
  { id: "TX10", type: "charge", typeLabel: "شارژ", title: "بانک تجارت", desc: "از بانک تجارت", amount: 3000000, amountText: "۳,۰۰۰,۰۰۰", date: "۱ هفته پیش", time: "۰۸:۳۰", status: "success", icon: "⚡" },
];

// ==================== Bills ====================
export type Bill = {
  id: string;
  type: string;
  icon: string;
  amount: string;
  dueDate: string;
  status: "pending" | "paid" | "overdue";
};

export const bills: Bill[] = [
  { id: "BILL1", type: "قبض برق", icon: "⚡", amount: "۱۸۰,۰۰۰", dueDate: "۳۰ تیر", status: "pending" },
  { id: "BILL2", type: "قبض گاز", icon: "🔥", amount: "۹۵,۰۰۰", dueDate: "۵ مرداد", status: "pending" },
  { id: "BILL3", type: "قبض آب", icon: "💧", amount: "۴۵,۰۰۰", dueDate: "۱۰ مرداد", status: "pending" },
  { id: "BILL4", type: "قبض تلفن", icon: "📞", amount: "۱۲۰,۰۰۰", dueDate: "۱۵ مرداد", status: "pending" },
  { id: "BILL5", type: "اینترنت", icon: "📶", amount: "۲۵۰,۰۰۰", dueDate: "۲۰ مرداد", status: "pending" },
];

// ==================== Installments ====================
export type Installment = {
  id: string;
  platform: string;
  logo: string;
  total: number;
  totalText: string;
  paid: number;
  paidText: string;
  remaining: number;
  remainingText: string;
  next: string;
  nextAmount: string;
  due: string;
  progress: number;
  color: string;
};

export const installments: Installment[] = [
  {
    id: "INS1",
    platform: "اسنپ‌پی",
    logo: "🛵",
    total: 3600000, totalText: "۳,۶۰۰,۰۰۰",
    paid: 1200000, paidText: "۱,۲۰۰,۰۰۰",
    remaining: 2400000, remainingText: "۲,۴۰۰,۰۰۰",
    next: "قسط ۴", nextAmount: "۴۰۰,۰۰۰",
    due: "۲۵ تیر",
    progress: 33,
    color: "#FF6B35",
  },
  {
    id: "INS2",
    platform: "دیجی‌پی",
    logo: "🛍️",
    total: 5000000, totalText: "۵,۰۰۰,۰۰۰",
    paid: 1500000, paidText: "۱,۵۰۰,۰۰۰",
    remaining: 3500000, remainingText: "۳,۵۰۰,۰۰۰",
    next: "قسط ۴", nextAmount: "۵۰۰,۰۰۰",
    due: "۲۸ تیر",
    progress: 30,
    color: "#EF4444",
  },
  {
    id: "INS3",
    platform: "وام بانک تجارت",
    logo: "🏛️",
    total: 24000000, totalText: "۲۴,۰۰۰,۰۰۰",
    paid: 18000000, paidText: "۱۸,۰۰۰,۰۰۰",
    remaining: 6000000, remainingText: "۶,۰۰۰,۰۰۰",
    next: "قسط ۱۰", nextAmount: "۲,۰۰۰,۰۰۰",
    due: "۱ مرداد",
    progress: 75,
    color: "#034ea2",
  },
];

// ==================== Non-Cash Assets ====================
export type Asset = {
  id: string;
  type: string;
  name: string;
  icon: string;
  quantity: number;
  quantityText: string;
  unit: string;
  buyPrice: number;
  buyPriceText: string;
  currentPrice: number;
  currentPriceText: string;
  totalValue: number;
  totalValueText: string;
  change: number;
  color: string;
};

export const assets: Asset[] = [
  {
    id: "AST1",
    type: "سهام",
    name: "سهام بانک تجارت",
    icon: "📈",
    quantity: 1000, quantityText: "۱,۰۰۰",
    unit: "سهم",
    buyPrice: 5000, buyPriceText: "۵,۰۰۰",
    currentPrice: 6500, currentPriceText: "۶,۵۰۰",
    totalValue: 6500000, totalValueText: "۶,۵۰۰,۰۰۰",
    change: 30,
    color: "#034ea2",
  },
  {
    id: "AST2",
    type: "طلا",
    name: "طلای زربان",
    icon: "🥇",
    quantity: 5, quantityText: "۵",
    unit: "گرم",
    buyPrice: 3000000, buyPriceText: "۳,۰۰۰,۰۰۰",
    currentPrice: 3500000, currentPriceText: "۳,۵۰۰,۰۰۰",
    totalValue: 17500000, totalValueText: "۱۷,۵۰۰,۰۰۰",
    change: 16.7,
    color: "#F59E0B",
  },
  {
    id: "AST3",
    type: "ارز دیجیتال",
    name: "بیت‌کوین",
    icon: "₿",
    quantity: 0.05, quantityText: "۰.۰۵",
    unit: "BTC",
    buyPrice: 1500000000, buyPriceText: "۱,۵۰۰,۰۰۰,۰۰۰",
    currentPrice: 2100000000, currentPriceText: "۲,۱۰۰,۰۰۰,۰۰۰",
    totalValue: 105000000, totalValueText: "۱۰۵,۰۰۰,۰۰۰",
    change: 40,
    color: "#F7931A",
  },
  {
    id: "AST4",
    type: "ملک",
    name: "آپارتمان ۸۰ متری",
    icon: "🏢",
    quantity: 1, quantityText: "۱",
    unit: "واحد",
    buyPrice: 2000000000, buyPriceText: "۲,۰۰۰,۰۰۰,۰۰۰",
    currentPrice: 2500000000, currentPriceText: "۲,۵۰۰,۰۰۰,۰۰۰",
    totalValue: 2500000000, totalValueText: "۲,۵۰۰,۰۰۰,۰۰۰",
    change: 25,
    color: "#8B5CF6",
  },
  {
    id: "AST5",
    type: "خودرو",
    name: "پژو ۲۰۶",
    icon: "🚗",
    quantity: 1, quantityText: "۱",
    unit: "دستگاه",
    buyPrice: 800000000, buyPriceText: "۸۰۰,۰۰۰,۰۰۰",
    currentPrice: 950000000, currentPriceText: "۹۵۰,۰۰۰,۰۰۰",
    totalValue: 950000000, totalValueText: "۹۵۰,۰۰۰,۰۰۰",
    change: 18.75,
    color: "#06B6D4",
  },
];

export const totalAssetsValue = assets.reduce((sum, a) => sum + a.totalValue, 0);

// ==================== Debts ====================
export type Debt = {
  id: string;
  name: string;
  creditor: string;
  totalAmount: number;
  totalAmountText: string;
  paidAmount: number;
  paidAmountText: string;
  remainingAmount: number;
  remainingText: string;
  dueDate: string;
  type: "manual" | "contract";
  contractId?: string;
  progress: number;
  icon: string;
};

export const debts: Debt[] = [
  {
    id: "DBT1", name: "اقساط اسنپ‌پی", creditor: "اسنپ‌پی",
    totalAmount: 3600000, totalAmountText: "۳,۶۰۰,۰۰۰",
    paidAmount: 1200000, paidAmountText: "۱,۲۰۰,۰۰۰",
    remainingAmount: 2400000, remainingText: "۲,۴۰۰,۰۰۰",
    dueDate: "۱۴۰۵/۱۲/۰۱", type: "contract", contractId: "CNT-003",
    progress: 33, icon: "🛵",
  },
  {
    id: "DBT2", name: "اقساط دیجی‌پی", creditor: "دیجی‌پی",
    totalAmount: 5000000, totalAmountText: "۵,۰۰۰,۰۰۰",
    paidAmount: 1500000, paidAmountText: "۱,۵۰۰,۰۰۰",
    remainingAmount: 3500000, remainingText: "۳,۵۰۰,۰۰۰",
    dueDate: "۱۴۰۵/۱۱/۰۱", type: "contract", contractId: "CNT-004",
    progress: 30, icon: "🛍️",
  },
  {
    id: "DBT3", name: "وام دوست", creditor: "علی رضایی",
    totalAmount: 5000000, totalAmountText: "۵,۰۰۰,۰۰۰",
    paidAmount: 2000000, paidAmountText: "۲,۰۰۰,۰۰۰",
    remainingAmount: 3000000, remainingText: "۳,۰۰۰,۰۰۰",
    dueDate: "۱۴۰۵/۰۹/۰۱", type: "manual",
    progress: 40, icon: "👤",
  },
  {
    id: "DBT4", name: "وام بانک تجارت", creditor: "بانک تجارت",
    totalAmount: 24000000, totalAmountText: "۲۴,۰۰۰,۰۰۰",
    paidAmount: 18000000, paidAmountText: "۱۸,۰۰۰,۰۰۰",
    remainingAmount: 6000000, remainingText: "۶,۰۰۰,۰۰۰",
    dueDate: "۱۴۰۸/۰۱/۰۱", type: "contract", contractId: "CNT-010",
    progress: 75, icon: "🏛️",
  },
];

export const totalDebts = debts.reduce((sum, d) => sum + d.remainingAmount, 0);

// ==================== Receivables ====================
export type Receivable = {
  id: string;
  name: string;
  debtor: string;
  totalAmount: number;
  totalAmountText: string;
  receivedAmount: number;
  receivedText: string;
  remainingAmount: number;
  remainingText: string;
  dueDate: string;
  type: "manual" | "contract";
  contractId?: string;
  progress: number;
  icon: string;
};

export const receivables: Receivable[] = [
  {
    id: "REC1", name: "طلب از علی رضایی", debtor: "علی رضایی",
    totalAmount: 3000000, totalAmountText: "۳,۰۰۰,۰۰۰",
    receivedAmount: 1000000, receivedText: "۱,۰۰۰,۰۰۰",
    remainingAmount: 2000000, remainingText: "۲,۰۰۰,۰۰۰",
    dueDate: "۱۴۰۵/۰۸/۰۱", type: "manual",
    progress: 33, icon: "👤",
  },
  {
    id: "REC2", name: "واریزی هفتگی فرزند", debtor: "فرزند",
    totalAmount: 26000000, totalAmountText: "۲۶,۰۰۰,۰۰۰",
    receivedAmount: 13000000, receivedText: "۱۳,۰۰۰,۰۰۰",
    remainingAmount: 13000000, remainingText: "۱۳,۰۰۰,۰۰۰",
    dueDate: "۱۴۰۵/۱۰/۰۱", type: "contract", contractId: "CNT-011",
    progress: 50, icon: "👶",
  },
  {
    id: "REC3", name: "طلب از محمد", debtor: "محمد رضایی",
    totalAmount: 1500000, totalAmountText: "۱,۵۰۰,۰۰۰",
    receivedAmount: 0, receivedText: "۰",
    remainingAmount: 1500000, remainingText: "۱,۵۰۰,۰۰۰",
    dueDate: "۱۴۰۵/۰۷/۰۱", type: "manual",
    progress: 0, icon: "👤",
  },
];

export const totalReceivables = receivables.reduce((sum, r) => sum + r.remainingAmount, 0);

// ==================== Contracts ====================
export type Contract = {
  id: string;
  type: "direct_debit" | "bnpl" | "subscription" | "auto_bill" | "personal";
  typeLabel: string;
  name: string;
  provider: string;
  recipient?: string;
  amount: string;
  period: string;
  status: "active" | "expired" | "pending";
  startDate: string;
  expiryDate: string;
  account?: string;
  icon: string;
  color: string;
  description?: string;
  lastPayment?: string;
  nextPayment?: string;
};

export const contracts: Contract[] = [
  // Direct Debit
  { id: "CNT-001", type: "direct_debit", typeLabel: "Direct Debit", name: "برداشت خودکار از حساب بلو بانک", provider: "بلو بانک", amount: "سقف ۱۰۰م", period: "هر زمان نیاز", status: "active", startDate: "۱۴۰۵/۰۱/۰۱", expiryDate: "۱۴۰۶/۰۱/۰۱", account: "۱۲۳۴۵۶۷۸۹۰", icon: "🟦", color: "#00B4D8", lastPayment: "۱۴۰۵/۰۴/۲۰", nextPayment: "—" },
  { id: "CNT-002", type: "direct_debit", typeLabel: "Direct Debit", name: "برداشت خودکار از حساب تجارت", provider: "تجارت", amount: "سقف ۴۰م", period: "هر زمان نیاز", status: "active", startDate: "۱۴۰۵/۰۱/۱۵", expiryDate: "۱۴۰۶/۰۱/۱۵", account: "۹۸۷۶۵۴۳۲۱۰", icon: "🏛️", color: "#034ea2", lastPayment: "۱۴۰۵/۰۴/۲۲", nextPayment: "—" },
  { id: "CNT-003", type: "direct_debit", typeLabel: "Direct Debit", name: "برداشت خودکار از حساب ملی", provider: "ملی", amount: "سقف ۱۵م", period: "هر زمان نیاز", status: "active", startDate: "۱۴۰۵/۰۲/۰۱", expiryDate: "۱۴۰۶/۰۲/۰۱", account: "۵۵۵۵۶۶۶۶۷۷", icon: "🟩", color: "#84CC16", lastPayment: "۱۴۰۵/۰۴/۲۵", nextPayment: "—" },

  // BNPL
  { id: "CNT-004", type: "bnpl", typeLabel: "BNPL", name: "اقساط اسنپ‌پی", provider: "اسنپ‌پی", amount: "۴۰۰,۰۰۰", period: "ماهانه", status: "active", startDate: "۱۴۰۵/۰۳/۰۱", expiryDate: "۱۴۰۵/۱۲/۰۱", icon: "🛵", color: "#FF6B35", lastPayment: "۱۴۰۵/۰۴/۰۱", nextPayment: "۱۴۰۵/۰۵/۰۱" },
  { id: "CNT-005", type: "bnpl", typeLabel: "BNPL", name: "اقساط دیجی‌پی", provider: "دیجی‌پی", amount: "۵۰۰,۰۰۰", period: "ماهانه", status: "active", startDate: "۱۴۰۵/۰۲/۰۱", expiryDate: "۱۴۰۵/۱۱/۰۱", icon: "🛍️", color: "#EF4444", lastPayment: "۱۴۰۵/۰۴/۰۱", nextPayment: "۱۴۰۵/۰۵/۰۱" },
  { id: "CNT-006", type: "bnpl", typeLabel: "BNPL", name: "اقساط تارا", provider: "تارا", amount: "۳۰۰,۰۰۰", period: "ماهانه", status: "expired", startDate: "۱۴۰۴/۰۶/۰۱", expiryDate: "۱۴۰۵/۰۳/۰۱", icon: "💳", color: "#8B5CF6", lastPayment: "۱۴۰۵/۰۳/۰۱", nextPayment: "—" },
  { id: "CNT-007", type: "bnpl", typeLabel: "BNPL", name: "اعتبار اوانو", provider: "اوانو (همراه اول)", amount: "۲۰۰,۰۰۰", period: "ماهانه", status: "active", startDate: "۱۴۰۵/۰۳/۱۵", expiryDate: "۱۴۰۶/۰۳/۱۵", icon: "📱", color: "#3B82F6", lastPayment: "۱۴۰۵/۰۴/۱۵", nextPayment: "۱۴۰۵/۰۵/۱۵" },
  { id: "CNT-008", type: "bnpl", typeLabel: "BNPL", name: "اعتبار جیب جت", provider: "جیب جت (ایرانسل)", amount: "۱۵۰,۰۰۰", period: "ماهانه", status: "active", startDate: "۱۴۰۵/۰۲/۲۰", expiryDate: "۱۴۰۶/۰۲/۲۰", icon: "📲", color: "#06B6D4", lastPayment: "۱۴۰۵/۰۴/۲۰", nextPayment: "۱۴۰۵/۰۵/۲۰" },

  // Subscriptions
  { id: "CNT-009", type: "subscription", typeLabel: "اشتراک", name: "اشتراک اسنپ‌پرو", provider: "اسنپ‌پرو", amount: "۲۹۹,۰۰۰", period: "ماهانه", status: "active", startDate: "۱۴۰۵/۰۱/۰۱", expiryDate: "۱۴۰۶/۰۱/۰۱", icon: "🚗", color: "#FF6B35", lastPayment: "۱۴۰۵/۰۴/۰۱", nextPayment: "۱۴۰۵/۰۵/۰۱" },
  { id: "CNT-010", type: "subscription", typeLabel: "اشتراک", name: "اشتراک دیجیکالا پرو", provider: "دیجیکالا", amount: "۱۹۹,۰۰۰", period: "ماهانه", status: "active", startDate: "۱۴۰۵/۰۱/۱۰", expiryDate: "۱۴۰۶/۰۱/۱۰", icon: "🛒", color: "#EF4444", lastPayment: "۱۴۰۵/۰۴/۱۰", nextPayment: "۱۴۰۵/۰۵/۱۰" },
  { id: "CNT-011", type: "subscription", typeLabel: "اشتراک", name: "اشتراک ChatGPT", provider: "OpenAI", amount: "۵۰۰,۰۰۰", period: "ماهانه", status: "active", startDate: "۱۴۰۵/۰۲/۱۵", expiryDate: "۱۴۰۶/۰۲/۱۵", icon: "🤖", color: "#10A37F", lastPayment: "۱۴۰۵/۰۴/۱۵", nextPayment: "۱۴۰۵/۰۵/۱۵" },
  { id: "CNT-012", type: "subscription", typeLabel: "اشتراک", name: "اشتراک فیلیمو", provider: "فیلیمو", amount: "۲۴۹,۰۰۰", period: "ماهانه", status: "expired", startDate: "۱۴۰۴/۰۹/۰۱", expiryDate: "۱۴۰۵/۰۶/۰۱", icon: "🎬", color: "#1DB954", lastPayment: "۱۴۰۵/۰۳/۰۱", nextPayment: "—" },
  { id: "CNT-013", type: "subscription", typeLabel: "اشتراک", name: "اشتراک نماوا", provider: "نماوا", amount: "۱۹۹,۰۰۰", period: "ماهانه", status: "active", startDate: "۱۴۰۵/۰۱/۰۵", expiryDate: "۱۴۰۶/۰۱/۰۵", icon: "📺", color: "#00BCD4", lastPayment: "۱۴۰۵/۰۴/۰۵", nextPayment: "۱۴۰۵/۰۵/۰۵" },
  { id: "CNT-014", type: "subscription", typeLabel: "اشتراک", name: "اشتراک Spotify", provider: "Spotify", amount: "۳۰۰,۰۰۰", period: "ماهانه", status: "active", startDate: "۱۴۰۵/۰۲/۱۰", expiryDate: "۱۴۰۶/۰۲/۱۰", icon: "🎵", color: "#1DB954", lastPayment: "۱۴۰۵/۰۴/۱۰", nextPayment: "۱۴۰۵/۰۵/۱۰" },

  // Auto Bills
  { id: "CNT-015", type: "auto_bill", typeLabel: "قبض خودکار", name: "پرداخت خودکار قبض موبایل", provider: "همراه اول", amount: "متغیر", period: "ماهانه", status: "active", startDate: "۱۴۰۵/۰۱/۰۱", expiryDate: "۱۴۰۶/۰۱/۰۱", icon: "📱", color: "#F59E0B", lastPayment: "۱۴۰۵/۰۴/۰۱", nextPayment: "۱۴۰۵/۰۵/۰۱" },
  { id: "CNT-016", type: "auto_bill", typeLabel: "قبض خودکار", name: "پرداخت خودکار قبض برق", provider: "توانیر", amount: "متغیر", period: "ماهانه", status: "active", startDate: "۱۴۰۵/۰۱/۰۱", expiryDate: "۱۴۰۶/۰۱/۰۱", icon: "⚡", color: "#FCD34D", lastPayment: "۱۴۰۵/۰۴/۰۱", nextPayment: "۱۴۰۵/۰۵/۰۱" },
  { id: "CNT-017", type: "auto_bill", typeLabel: "وام خودکار", name: "پرداخت خودکار وام تجارت", provider: "بانک تجارت", amount: "۲,۰۰۰,۰۰۰", period: "ماهانه", status: "active", startDate: "۱۴۰۵/۰۱/۰۱", expiryDate: "۱۴۰۸/۰۱/۰۱", icon: "🏛️", color: "#034ea2", lastPayment: "۱۴۰۵/۰۴/۰۱", nextPayment: "۱۴۰۵/۰۵/۰۱" },
  { id: "CNT-018", type: "auto_bill", typeLabel: "اجاره خودکار", name: "پرداخت خودکار اجاره", provider: "مالک ملک", amount: "۸,۰۰۰,۰۰۰", period: "ماهانه", status: "active", startDate: "۱۴۰۵/۰۱/۰۱", expiryDate: "۱۴۰۶/۰۱/۰۱", icon: "🏠", color: "#8B5CF6", lastPayment: "۱۴۰۵/۰۴/۰۱", nextPayment: "۱۴۰۵/۰۵/۰۱" },

  // Personal
  { id: "CNT-019", type: "personal", typeLabel: "شخصی", name: "واریزی هفتگی به حساب فرزند", recipient: "فرزند", provider: "فرزند", amount: "۱,۰۰۰,۰۰۰", period: "هفتگی", status: "active", startDate: "۱۴۰۵/۰۴/۰۱", expiryDate: "۱۴۰۵/۱۰/۰۱", icon: "👶", color: "#EC4899", lastPayment: "۱۴۰۵/۰۴/۲۲", nextPayment: "۱۴۰۵/۰۴/۲۹" },
  { id: "CNT-020", type: "personal", typeLabel: "شخصی", name: "واریزی ماهانه به حساب همسر", recipient: "همسر", provider: "همسر", amount: "۱۰,۰۰۰,۰۰۰", period: "ماهانه", status: "active", startDate: "۱۴۰۵/۰۱/۰۱", expiryDate: "۱۴۰۶/۰۱/۰۱", icon: "💑", color: "#EC4899", lastPayment: "۱۴۰۵/۰۴/۰۱", nextPayment: "۱۴۰۵/۰۵/۰۱" },
  { id: "CNT-021", type: "personal", typeLabel: "شخصی", name: "شارژ ماهانه ساختمان", recipient: "مدیر ساختمان", provider: "مدیر ساختمان", amount: "۲,۰۰۰,۰۰۰", period: "ماهانه", status: "active", startDate: "۱۴۰۵/۰۱/۰۱", expiryDate: "۱۴۰۶/۰۱/۰۱", icon: "🏢", color: "#8B5CF6", lastPayment: "۱۴۰۵/۰۴/۰۱", nextPayment: "۱۴۰۵/۰۵/۰۱" },
  { id: "CNT-022", type: "personal", typeLabel: "شخصی", name: "پرداخت قسط وام دوست", recipient: "علی رضایی", provider: "علی رضایی", amount: "۵۰۰,۰۰۰", period: "ماهانه", status: "active", startDate: "۱۴۰۵/۰۲/۰۱", expiryDate: "۱۴۰۵/۰۹/۰۱", icon: "👤", color: "#64748B", lastPayment: "۱۴۰۵/۰۴/۰۱", nextPayment: "۱۴۰۵/۰۵/۰۱" },
];

// ==================== Service Categories (18 categories) ====================
export type Service = {
  name: string;
  icon: string;
};

export type ServiceCategory = {
  name: string;
  icon: string;
  color: string;
  services: Service[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    name: "خدمات جدید", icon: "✨", color: "#034ea2",
    services: [
      { name: "باشگاه مشتریان", icon: "🎁" },
      { name: "کوله بار اربعین", icon: "🎒" },
      { name: "پرداخت با NFC", icon: "📱" },
      { name: "ارز اربعین", icon: "💱" },
      { name: "دستیار مالیاتی تیران", icon: "📊" },
      { name: "فروشگاه", icon: "🛒" },
      { name: "فروشگاه موبایل ایرانسل", icon: "📱" },
      { name: "کارت هدیه بانکی", icon: "🎁" },
      { name: "کیف پول ایران", icon: "👛" },
    ],
  },
  {
    name: "بورس و سرمایه‌گذاری", icon: "📈", color: "#16a34a",
    services: [
      { name: "کارگزاری بانک شهر", icon: "📈" },
      { name: "تریدر هستو", icon: "📊" },
      { name: "خرید و فروش طلا", icon: "🪙" },
      { name: "صندوق‌های سرمایه‌گذاری", icon: "💰" },
      { name: "سرمایه گذاری", icon: "📈" },
    ],
  },
  {
    name: "گردشگری", icon: "✈️", color: "#0EA5E9",
    services: [
      { name: "بلیت اتوبوس", icon: "🚌" },
      { name: "بلیت قطار", icon: "🚆" },
      { name: "پرواز خارجی", icon: "✈️" },
      { name: "پرواز داخلی", icon: "✈️" },
      { name: "ارز اربعین", icon: "💱" },
      { name: "درخواست ویزا", icon: "🛂" },
      { name: "ارز سفر", icon: "💱" },
      { name: "رزرو هتل", icon: "🏨" },
    ],
  },
  {
    name: "موبایل، شارژ و اینترنت", icon: "📱", color: "#8B5CF6",
    services: [
      { name: "خرید سیم‌کارت آپتل", icon: "📱" },
      { name: "حساب آپتل", icon: "📱" },
      { name: "بسته اینترنت", icon: "📶" },
      { name: "خرید شارژ", icon: "🔋" },
      { name: "خرید سیم‌کارت امارات", icon: "📱" },
      { name: "خرید سیم‌کارت ترکیه", icon: "📱" },
      { name: "خرید سیم‌کارت عراق", icon: "📱" },
      { name: "خرید سیم‌کارت ایرانسل", icon: "📱" },
      { name: "فروشگاه موبایل ایرانسل", icon: "📱" },
      { name: "شارژ خودکار سیم‌کارت", icon: "🔄" },
    ],
  },
  {
    name: "کیف، کارت و انتقال پول", icon: "💳", color: "#F59E0B",
    services: [
      { name: "چک صیادی", icon: "📝" },
      { name: "کیف به کیف", icon: "👛" },
      { name: "کارت هستو", icon: "💳" },
      { name: "کارت به کارت", icon: "💳" },
      { name: "کیف پول ایران", icon: "👛" },
      { name: "کیف پول", icon: "👛" },
      { name: "بازگشت پول", icon: "💵" },
      { name: "موجودی کارت", icon: "💰" },
    ],
  },
  {
    name: "روش‌های پرداخت", icon: "⚙️", color: "#06B6D4",
    services: [
      { name: "تله پرداز", icon: "📞" },
      { name: "پرداخت مستقیم", icon: "💳" },
      { name: "پیگیری انتقال پول", icon: "🔍" },
      { name: "شارژ خودکار کیف پول", icon: "🔄" },
      { name: "پرداخت با NFC", icon: "📱" },
      { name: "کارت هدیه بانکی", icon: "🎁" },
      { name: "تنظیمات پرداخت چند روشی", icon: "⚙️" },
    ],
  },
  {
    name: "قبوض خدمات عمومی", icon: "🧾", color: "#EF4444",
    services: [
      { name: "قبض مخابرات", icon: "📞" },
      { name: "قبض همراه اول", icon: "📱" },
      { name: "قبض ایرانسل", icon: "📱" },
      { name: "قبوض من", icon: "📋" },
      { name: "قبض شهرداری تهران", icon: "🏙️" },
      { name: "قبض آب", icon: "💧" },
      { name: "قبض گاز", icon: "🔥" },
      { name: "قبض برق", icon: "⚡" },
      { name: "سایر قبوض تلفن", icon: "📞" },
      { name: "پرداخت با شناسه", icon: "🔢" },
    ],
  },
  {
    name: "اسناد دیجیتال", icon: "📄", color: "#64748B",
    services: [{ name: "امضا دیجیتال", icon: "✍️" }],
  },
  {
    name: "وام، قسط و اعتبار", icon: "💰", color: "#10B981",
    services: [
      { name: "اقساط بیمه ایران", icon: "🏥" },
      { name: "خدمات اقساطی سلامت", icon: "🏥" },
    ],
  },
  {
    name: "نیکوکاری", icon: "🤲", color: "#EC4899",
    services: [
      { name: "فطریه", icon: "🤲" },
      { name: "پویش‌ها", icon: "📢" },
      { name: "لیست خیریه‌ها", icon: "📋" },
      { name: "نیکوکاری", icon: "❤️" },
    ],
  },
  {
    name: "خدمات خودرو", icon: "🚗", color: "#0EA5E9",
    services: [
      { name: "طرح ترافیک تهران", icon: "🚗" },
      { name: "عوارضی آزادراه", icon: "🛣️" },
      { name: "خلافی خودرو", icon: "🚗" },
      { name: "خدمات خودرو", icon: "🚗" },
      { name: "استعلام کارت خودرو", icon: "🚗" },
      { name: "خدمات گواهینامه", icon: "🪪" },
      { name: "پارکینگ مشهد", icon: "🅿️" },
      { name: "عوارض خودرو", icon: "🚗" },
      { name: "استعلام تاریخچه پلاک", icon: "🚗" },
      { name: "استعلام پلاک", icon: "🚗" },
    ],
  },
  {
    name: "سوپرمارکت و غذا", icon: "🛒", color: "#F59E0B",
    services: [
      { name: "سوپرمارکت فوری", icon: "🛒" },
      { name: "هایپراستار", icon: "🛒" },
      { name: "سفارش غذا", icon: "🍔" },
    ],
  },
  {
    name: "حمل‌ونقل عمومی", icon: "🚕", color: "#FCD34D",
    services: [{ name: "کرایه تاکسی / BRT", icon: "🚕" }],
  },
  {
    name: "بیمه", icon: "🛡️", color: "#3B82F6",
    services: [
      { name: "بیمه شخص ثالث", icon: "🚗" },
      { name: "بیمه بدنه", icon: "🚗" },
      { name: "بیمه من", icon: "📋" },
      { name: "بیمه", icon: "🛡️" },
      { name: "بیمه آسانسور", icon: "🏢" },
      { name: "حوادث انفرادی", icon: "⚠️" },
      { name: "بیمه زلزله و آتش‌سوزی", icon: "🏠" },
      { name: "بیمه موتور سیکلت", icon: "🏍️" },
      { name: "بیمه مسئولیت مدیر ساختمان", icon: "🏢" },
      { name: "بیمه عتبات", icon: "🕌" },
      { name: "بیمه مسافرت داخلی", icon: "✈️" },
      { name: "بیمه کارت بانکی", icon: "💳" },
      { name: "بیمه موبایل", icon: "📱" },
      { name: "بیمه حوادث ورزشی", icon: "⚽" },
      { name: "بیمه آتش‌سوزی ساختمان", icon: "🏠" },
    ],
  },
  {
    name: "سلامت و پزشکی", icon: "🏥", color: "#EF4444",
    services: [
      { name: "نوبت‌دهی پزشک", icon: "🏥" },
      { name: "آزمایش در منزل", icon: "🧪" },
      { name: "مشاوره با پزشک", icon: "👨‍⚕️" },
      { name: "داروخانه و فروشگاه", icon: "💊" },
    ],
  },
  {
    name: "خدمات قوه قضائیه", icon: "⚖️", color: "#64748B",
    services: [
      { name: "قبض ثبت اسناد و املاک", icon: "📄" },
      { name: "قبض قوه قضائیه", icon: "⚖️" },
      { name: "ثبت‌نام ثنا", icon: "📝" },
    ],
  },
  {
    name: "خدمات پذیرندگی", icon: "🎧", color: "#8B5CF6",
    services: [
      { name: "پشتیبانی پذیرندگان", icon: "🎧" },
      { name: "فروشگاه کارتخوان", icon: "🖨️" },
      { name: "گزارش پذیرندگی", icon: "📊" },
    ],
  },
  {
    name: "هستو من", icon: "⭐", color: "#034ea2",
    services: [
      { name: "بیمه من", icon: "🛡️" },
      { name: "مجوزهای پرداخت مستقیم", icon: "🔐" },
      { name: "کیف پول", icon: "👛" },
      { name: "باشگاه مشتریان", icon: "🎁" },
      { name: "کمپین کارت به کارت", icon: "💳" },
      { name: "پیشخوان شهروندی", icon: "🏛️" },
      { name: "هستو پلاس", icon: "⭐" },
      { name: "قبوض من", icon: "📋" },
    ],
  },
];

// ==================== Payment ID Examples ====================
export const paymentIdExamples = [
  { id: "HST-7X9K2M", recipient: "فروشگاه راما", amount: "۸۵۰,۰۰۰", desc: "خرید پیراهن" },
  { id: "HST-3B5N8P", recipient: "مریم احمدی", amount: "۵۰۰,۰۰۰", desc: "اجاره ماه" },
];

// ==================== Nearby Shops ====================
export const nearbyShops = [
  { id: "SHOP1", name: "کافه رستوران نوبت", distance: "۲۵ متر", address: "خیابان ولیعصر", icon: "☕" },
  { id: "SHOP2", name: "فروشگاه لباس راما", distance: "۴۰ متر", address: "خیابان میرزای شیرازی", icon: "👕" },
  { id: "SHOP3", name: "سوپرمارکت هستی", distance: "۴۵ متر", address: "خیابان انقلاب", icon: "🛒" },
  { id: "SHOP4", name: "نانوایی سنتی", distance: "۳۵ متر", address: "کوچه شهید رجایی", icon: "🍞" },
  { id: "SHOP5", name: "داروخانه شبانه‌روزی", distance: "۵۰ متر", address: "میدان آزادی", icon: "💊" },
];

// ==================== Notifications ====================
export type Notification = {
  id: string;
  type: "payment" | "receive" | "bill" | "contract" | "debt" | "security";
  typeLabel: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  icon: string;
  color: string;
};

export const notifications: Notification[] = [
  { id: "NTF1", type: "payment", typeLabel: "پرداخت", title: "پرداخت موفق", message: "پرداخت ۲۵۰,۰۰۰ تومان به رضا کریمی با موفقیت انجام شد", date: "امروز ۱۴:۳۰", read: false, icon: "↗", color: "#034ea2" },
  { id: "NTF2", type: "receive", typeLabel: "دریافت", title: "واریز موفق", message: "مریم احمدی ۱,۵۰۰,۰۰۰ تومان به حساب شما واریز کرد", date: "امروز ۱۲:۱۵", read: false, icon: "↙", color: "#16a34a" },
  { id: "NTF3", type: "bill", typeLabel: "قبض", title: "یادآوری قبض", message: "قبض برق ماه بعد آماده پرداخت است - ۱۸۰,۰۰۰ تومان", date: "دیروز ۱۸:۰۰", read: true, icon: "⚡", color: "#F59E0B" },
  { id: "NTF4", type: "contract", typeLabel: "قرارداد", title: "پرداخت خودکار", message: "پرداخت خودکار اشتراک فیلیمو فردا انجام میشه", date: "دیروز ۱۰:۰۰", read: true, icon: "🎬", color: "#8B5CF6" },
  { id: "NTF5", type: "debt", typeLabel: "بدهی", title: "یادآوری قسط", message: "قسط اسنپ‌پی فردا سررسید میشه - ۴۰۰,۰۰۰ تومان", date: "۳ روز پیش", read: true, icon: "📅", color: "#EF4444" },
  { id: "NTF6", type: "security", typeLabel: "امنیتی", title: "ورود جدید", message: "ورود جدید به حساب شما از دستگاه جدید", date: "۵ روز پیش", read: true, icon: "🔒", color: "#64748B" },
];

// ==================== Business Data ====================
export const business = {
  profile: {
    name: "فروشگاه لباس راما",
    owner: "رضا کریمی",
    type: "فروشگاهی",
    registrationNumber: "۱۲۳۴۵۶۷۸۹۰",
    address: "تهران، خیابان میرزای شیرازی، پلاک ۱۲۳",
    phone: "۰۲۱-۱۲۳۴۵۶۷۸",
    mobile: "۰۹۱۲۳۴۵۶۷۸۹",
    verificationStatus: "تایید شده" as const,
    joinDate: "۱۴۰۵/۰۱/۰۱",
    logo: null,
  },
  bankInfo: {
    accountNumber: "۱۲۳۴۵۶۷۸۹۰",
    sheba: "IR360170000000328782636009",
    accountHolder: "رضا کریمی",
    bank: "بانک تجارت",
  },
  financialSummary: {
    todayReceived: 3250000,
    todayReceivedText: "۳,۲۵۰,۰۰۰",
    weekReceived: 12800000,
    weekReceivedText: "۱۲,۸۰۰,۰۰۰",
    monthReceived: 45600000,
    monthReceivedText: "۴۵,۶۰۰,۰۰۰",
    transactionCount: 23,
    avgTransaction: 1980000,
    avgTransactionText: "۱,۹۸۰,۰۰۰",
  },
  weeklyChart: [
    { day: "شنبه", amount: 1200000 },
    { day: "یکشنبه", amount: 2800000 },
    { day: "دوشنبه", amount: 1900000 },
    { day: "سه‌شنبه", amount: 3500000 },
    { day: "چهارشنبه", amount: 2200000 },
    { day: "پنجشنبه", amount: 4100000 },
    { day: "جمعه", amount: 950000 },
  ],
  products: [
    { id: "PRD1", name: "پیراهن مردانه", price: 850000, priceText: "۸۵۰,۰۰۰", description: "پیراهن مردانه مجلسی", status: "active" as const, salesCount: 12, category: "پوشاک مردانه", image: null },
    { id: "PRD2", name: "شلوار جین", price: 1200000, priceText: "۱,۲۰۰,۰۰۰", description: "شلوار جین مردانه", status: "active" as const, salesCount: 8, category: "پوشاک مردانه", image: null },
    { id: "PRD3", name: "کفش ورزشی", price: 2500000, priceText: "۲,۵۰۰,۰۰۰", description: "کفش ورزشی مردانه", status: "active" as const, salesCount: 5, category: "کیف و کفش", image: null },
    { id: "PRD4", name: "مانتو زنانه", price: 1800000, priceText: "۱,۸۰۰,۰۰۰", description: "مانتو زنانه تابستانی", status: "active" as const, salesCount: 15, category: "پوشاک زنانه", image: null },
    { id: "PRD5", name: "شال و روسری", price: 650000, priceText: "۶۵۰,۰۰۰", description: "شال و روسری ابریشمی", status: "inactive" as const, salesCount: 3, category: "Accessor", image: null },
  ],
  recentPayments: [
    { id: "BP1", buyer: "مشتری ۱", buyerPhone: "۰۹۱۲***۱۲۳۴", amount: "۸۵۰,۰۰۰", amountValue: 850000, status: "موفق" as const, time: "۱۴:۳۰", product: "پیراهن مردانه", date: "امروز" },
    { id: "BP2", buyer: "مشتری ۲", buyerPhone: "۰۹۱۹***۵۶۷۸", amount: "۱,۲۰۰,۰۰۰", amountValue: 1200000, status: "موفق" as const, time: "۱۲:۱۵", product: "شلوار جین", date: "امروز" },
    { id: "BP3", buyer: "مشتری ۳", buyerPhone: "۰۹۳۵***۹۰۱۲", amount: "۲,۵۰۰,۰۰۰", amountValue: 2500000, status: "pending" as const, time: "۱۱:۰۰", product: "کفش ورزشی", date: "امروز" },
    { id: "BP4", buyer: "مشتری ۴", buyerPhone: "۰۹۰۱***۳۴۵۶", amount: "۱,۸۰۰,۰۰۰", amountValue: 1800000, status: "موفق" as const, time: "دیروز ۱۶:۴۵", product: "مانتو زنانه", date: "دیروز" },
    { id: "BP5", buyer: "مشتری ۵", buyerPhone: "۰۹۱۲***۷۸۹۰", amount: "۶۵۰,۰۰۰", amountValue: 650000, status: "failed" as const, time: "دیروز ۱۰:۳۰", product: "شال و روسری", date: "دیروز" },
  ],
  businessContracts: [
    { id: "BCN1", name: "اجاره ماهانه مغازه", clientName: "مالک ملک", amount: "۱۵,۰۰۰,۰۰۰", period: "ماهانه", status: "active" as const, startDate: "۱۴۰۵/۰۱/۰۱", expiryDate: "۱۴۰۶/۰۱/۰۱" },
    { id: "BCN2", name: "اشتراک باشگاه مشتریان", clientName: "اعضا", amount: "۵۰,۰۰۰", period: "ماهانه", status: "active" as const, startDate: "۱۴۰۵/۰۲/۰۱", expiryDate: "۱۴۰۶/۰۲/۰۱" },
  ],
  api: {
    apiKey: "hasto_live_8f2k9x3m7n4q1w6z5a8b2c9d4e7f0g3h",
    testKey: "hasto_test_1a2b3c4d5e6f7g8h9i0j",
    rateLimit: "۱۰۰ درخواست در دقیقه",
    docsUrl: "https://docs.hasto.to/api",
    createdAt: "۱۴۰۵/۰۱/۰۱",
    lastUsed: "امروز ۱۴:۲۰",
  },
};



// ==================== B2B Financial Data ====================

// بانک‌های ایران کیش
export const ipoBanks = [
  { id: "saderat", name: "صادرات", color: "#16a34a" },
  { id: "tejarat", name: "تجارت", color: "#034ea2" },
  { id: "refah", name: "رفاه", color: "#dc2626" },
  { id: "sepah", name: "سپه", color: "#f59e0b" },
  { id: "gardeshgari", name: "گردشگری", color: "#8b5cf6" },
  { id: "mellal", name: "ملل", color: "#0891b2" },
  { id: "kafkar", name: "کارآفرین", color: "#e11d48" },
  { id: "khavarmianeh", name: "خاورمیانه", color: "#059669" },
];

// حساب‌های بانکی متصل
export const bankAccounts = [
  {
    id: "BA001", bankId: "tejarat", bankName: "تجارت", color: "#034ea2",
    accountNumber: "****-****-9012", sheba: "IR360170000000328782636009",
    holder: "رضا کریمی", balance: 45_600_000, status: "active" as const,
    transactions: [
      { id: "TX1", type: "credit" as const, desc: "تسویه روزانه POS", amount: 3_250_000, date: "۱۸/۰۴/۱۴۰۵", time: "۰۰:۰۵" },
      { id: "TX2", type: "debit" as const, desc: "انتقال به حساب پس‌انداز", amount: -5_000_000, date: "۱۷/۰۴/۱۴۰۵", time: "۱۴:۳۰" },
      { id: "TX3", type: "credit" as const, desc: "تسویه درگاه وب", amount: 4_500_000, date: "۱۷/۰۴/۱۴۰۵", time: "۰۰:۰۸" },
      { id: "TX4", type: "credit" as const, desc: "تسویه روزانه POS", amount: 2_800_000, date: "۱۶/۰۴/۱۴۰۵", time: "۰۰:۰۳" },
      { id: "TX5", type: "debit" as const, desc: "پرداخت اجاره", amount: -15_000_000, date: "۱۵/۰۴/۱۴۰۵", time: "۱۰:۰۰" },
    ],
  },
  {
    id: "BA002", bankId: "saderat", bankName: "صادرات", color: "#16a34a",
    accountNumber: "****-****-1098", sheba: "IR150620000000123456789012",
    holder: "فروشگاه لباس راما", balance: 12_300_000, status: "active" as const,
    transactions: [
      { id: "TX6", type: "credit" as const, desc: "تسویه هفتگی", amount: 2_100_000, date: "۱۷/۰۴/۱۴۰۵", time: "۰۰:۱۰" },
      { id: "TX7", type: "credit" as const, desc: "تسویه روزانه POS", amount: 1_850_000, date: "۱۶/۰۴/۱۴۰۵", time: "۰۰:۰۷" },
    ],
  },
  {
    id: "BA003", bankId: "sepah", bankName: "سپه", color: "#f59e0b",
    accountNumber: "****-****-5566", sheba: "IR920570000000987654321098",
    holder: "رضا کریمی", balance: 8_750_000, status: "active" as const,
    transactions: [
      { id: "TX8", type: "credit" as const, desc: "تسویه ماهانه", amount: 15_200_000, date: "۰۱/۰۴/۱۴۰۵", time: "۰۰:۱۵" },
      { id: "TX9", type: "debit" as const, desc: "پرداخت بیمه", amount: -2_500_000, date: "۱۰/۰۳/۱۴۰۵", time: "۰۹:۰۰" },
    ],
  },
];

// پایانه‌ها (POS + IPG)
export const terminals = [
  {
    id: "POS001", type: "pos" as const, bankId: "tejarat", bankName: "تجارت", color: "#034ea2",
    serial: "IRK-2847-1936", terminalId: "۲۸۴۷۱۹۳۶", status: "active" as const,
    lastTx: "۱۸/۰۴ ۱۴:۳۰", todayCount: 12, todayAmount: 3_250_000,
    weeklyData: [1.2, 2.8, 1.9, 3.5, 2.2, 4.1, 0.95],
    transactions: [
      { id: "P001", desc: "فروش — پیراهن مردانه", amount: 850_000, status: "success" as const, date: "۱۸/۰۴", time: "۱۴:۳۰" },
      { id: "P002", desc: "فروش — کیف دستی", amount: 420_000, status: "failed" as const, date: "۱۸/۰۴", time: "۱۱:۰۰" },
      { id: "P003", desc: "فروش — کمربند", amount: 350_000, status: "success" as const, date: "۱۸/۰۴", time: "۱۰:۲۰" },
      { id: "P004", desc: "فروش — شلوار جین", amount: 1_200_000, status: "success" as const, date: "۱۷/۰۴", time: "۱۶:۳۰" },
    ],
  },
  {
    id: "POS002", type: "pos" as const, bankId: "saderat", bankName: "صادرات", color: "#16a34a",
    serial: "IRK-5623-8741", terminalId: "۵۶۲۳۸۷۴۱", status: "active" as const,
    lastTx: "۱۸/۰۴ ۱۳:۱۵", todayCount: 8, todayAmount: 2_100_000,
    weeklyData: [0.8, 1.5, 2.1, 1.8, 2.5, 3.2, 0.6],
    transactions: [
      { id: "P005", desc: "فروش — شلوار جین", amount: 1_200_000, status: "success" as const, date: "۱۸/۰۴", time: "۱۳:۱۵" },
      { id: "P006", desc: "فروش — کفش ورزشی", amount: 2_500_000, status: "success" as const, date: "۱۷/۰۴", time: "۱۶:۳۰" },
    ],
  },
  {
    id: "POS003", type: "pos" as const, bankId: "sepah", bankName: "سپه", color: "#f59e0b",
    serial: "IRK-9184-2053", terminalId: "۹۱۸۴۲۰۵۳", status: "inactive" as const,
    lastTx: "۱۵/۰۴ ۱۱:۰۰", todayCount: 0, todayAmount: 0,
    weeklyData: [0, 0, 0.5, 1.2, 0, 0, 0],
    transactions: [],
  },
  {
    id: "POS004", type: "pos" as const, bankId: "mellal", bankName: "ملل", color: "#0891b2",
    serial: "IRK-3741-6289", terminalId: "۳۷۴۱۶۲۸۹", status: "active" as const,
    lastTx: "۱۸/۰۴ ۱۲:۴۵", todayCount: 5, todayAmount: 1_850_000,
    weeklyData: [1.0, 1.8, 2.0, 1.5, 2.3, 2.8, 0.7],
    transactions: [
      { id: "P007", desc: "فروش — مانتو زنانه", amount: 1_800_000, status: "success" as const, date: "۱۸/۰۴", time: "۱۲:۴۵" },
    ],
  },
  {
    id: "POS005", type: "pos" as const, bankId: "khavarmianeh", bankName: "خاورمیانه", color: "#059669",
    serial: "IRK-7293-4158", terminalId: "۷۲۹۳۴۱۵۸", status: "active" as const,
    lastTx: "۱۸/۰۴ ۱۰:۲۰", todayCount: 3, todayAmount: 950_000,
    weeklyData: [0.5, 0.9, 1.1, 0.8, 1.2, 1.5, 0.3],
    transactions: [
      { id: "P008", desc: "فروش — کمربند", amount: 350_000, status: "success" as const, date: "۱۸/۰۴", time: "۱۰:۲۰" },
    ],
  },
  {
    id: "IPG001", type: "ipg" as const, bankId: "tejarat", bankName: "تجارت", color: "#034ea2",
    serial: "GW-WEB-001", terminalId: "درگاه وب اصلی", status: "active" as const,
    url: "pay.hasto.to/rama-store", commission: "۱.۵٪",
    lastTx: "۱۸/۰۴ ۱۳:۴۵", todayCount: 15, todayAmount: 4_500_000,
    weeklyData: [1.8, 2.3, 1.5, 3.1, 2.0, 4.2, 0.85],
    transactions: [
      { id: "G001", desc: "فروش آنلاین — کفش ورزشی", amount: 2_500_000, status: "success" as const, date: "۱۸/۰۴", time: "۱۳:۴۵" },
      { id: "G002", desc: "مرجوعی — اکسسوری", amount: -180_000, status: "success" as const, date: "۱۷/۰۴", time: "۱۶:۰۰" },
    ],
  },
  {
    id: "IPG002", type: "ipg" as const, bankId: "saderat", bankName: "صادرات", color: "#16a34a",
    serial: "GW-APP-001", terminalId: "درگاه اپلیکیشن", status: "active" as const,
    url: "api.hasto.to/v1/pay", commission: "۱.۵٪",
    lastTx: "۱۸/۰۴ ۱۱:۳۰", todayCount: 7, todayAmount: 2_300_000,
    weeklyData: [0.9, 1.2, 0.8, 1.5, 1.1, 2.0, 0.5],
    transactions: [
      { id: "G003", desc: "فروش آنلاین — شال و روسری", amount: 650_000, status: "success" as const, date: "۱۸/۰۴", time: "۱۱:۳۰" },
    ],
  },
  {
    id: "IPG003", type: "ipg" as const, bankId: "sepah", bankName: "سپه", color: "#f59e0b",
    serial: "GW-TST-001", terminalId: "درگاه تست", status: "inactive" as const,
    url: "sandbox.hasto.to/rama", commission: "۰٪",
    lastTx: "۱۰/۰۴ ۰۹:۰۰", todayCount: 0, todayAmount: 0,
    weeklyData: [0, 0, 0, 0, 0, 0, 0],
    transactions: [],
  },
];

// خلاصه مالی
export const financialSummary = {
  totalBalance: 66_650_000,
  todaySales: 8_100_000,
  weekSales: 35_200_000,
  monthSales: 128_500_000,
  todaySettled: 4_150_000,
  pendingSettlement: 3_950_000,
  successRate: 94.5,
};

// فروش روزانه (۷ روز)
export const dailySalesChart = [
  { day: "شنبه", pos: 4_200_000, online: 1_800_000 },
  { day: "یکشنبه", pos: 5_100_000, online: 2_300_000 },
  { day: "دوشنبه", pos: 3_800_000, online: 1_500_000 },
  { day: "سه‌شنبه", pos: 6_200_000, online: 3_100_000 },
  { day: "چهارشنبه", pos: 4_900_000, online: 2_000_000 },
  { day: "پنجشنبه", pos: 7_500_000, online: 4_200_000 },
  { day: "جمعه", pos: 2_100_000, online: 850_000 },
];

// تیکت‌های پشتیبانی
export const supportTickets = [
  {
    id: "TK001", terminalId: "POS003", type: "pos" as const, bankName: "سپه",
    issueType: "عدم اتصال", priority: "high" as const, status: "open" as const,
    desc: "دستگاه از دیروز متصل نمی‌شود", date: "۱۷/۰۴/۱۴۰۵", ticketNo: "TK-1405-001",
  },
  {
    id: "TK002", terminalId: "IPG003", type: "ipg" as const, bankName: "سپه",
    issueType: "خطای نرم‌افزاری", priority: "medium" as const, status: "in_progress" as const,
    desc: "خطای ۵۰۰ هنگام پرداخت", date: "۱۶/۰۴/۱۴۰۵", ticketNo: "TK-1405-002",
  },
];

// نوع مشکلات تیکت
export const ticketIssueTypes = [
  "خرابی سخت‌افزاری",
  "خطای نرم‌افزاری",
  "عدم اتصال به شبکه",
  "تراکنش ناموفق مکرر",
  "مشکل در تسویه",
  "سایر",
];

// ==================== Financial Charts Data ====================
export const cashFlowData = [
  { month: "فروردین", income: 18000000, expense: 12000000 },
  { month: "اردیبهشت", income: 22000000, expense: 15000000 },
  { month: "خرداد", income: 19500000, expense: 11000000 },
  { month: "تیر", income: 28000000, expense: 18000000 },
  { month: "مرداد", income: 25000000, expense: 14000000 },
  { month: "شهریور", income: 32000000, expense: 21000000 },
];

export const expenseBreakdown = [
  { name: "خوراک", value: 8500000, color: "#034ea2" },
  { name: "قبوض", value: 4200000, color: "#16a34a" },
  { name: "اقساط", value: 6800000, color: "#F59E0B" },
  { name: "حمل‌ونقل", value: 3200000, color: "#EF4444" },
  { name: "سایر", value: 2500000, color: "#8B5CF6" },
];

export const balanceTrend = [
  { day: "روز ۱", balance: 8500000 },
  { day: "روز ۵", balance: 9200000 },
  { day: "روز ۱۰", balance: 7800000 },
  { day: "روز ۱۵", balance: 11500000 },
  { day: "روز ۲۰", balance: 13200000 },
  { day: "روز ۲۵", balance: 12450000 },
  { day: "روز ۳۰", balance: 12450000 },
];

// ==================== Savings Goals ====================
export type SavingsGoal = {
  id: string;
  title: string;
  icon: string;
  targetAmount: number;
  targetAmountText: string;
  currentAmount: number;
  currentAmountText: string;
  remainingText: string;
  progress: number;
  dueDate: string;
  color: string;
  category: string;
};

export const savingsGoals: SavingsGoal[] = [
  {
    id: "GOAL-001",
    title: "سفر نوروزی به کیش",
    icon: "✈️",
    targetAmount: 50000000,
    targetAmountText: "۵۰,۰۰۰,۰۰۰",
    currentAmount: 18500000,
    currentAmountText: "۱۸,۵۰۰,۰۰۰",
    remainingText: "۳۱,۵۰۰,۰۰۰",
    progress: 37,
    dueDate: "۱۴۰۶/۰۱/۰۱",
    color: "#0EA5E9",
    category: "سفر",
  },
  {
    id: "GOAL-002",
    title: "خرید لپ‌تاپ جدید",
    icon: "💻",
    targetAmount: 35000000,
    targetAmountText: "۳۵,۰۰۰,۰۰۰",
    currentAmount: 28000000,
    currentAmountText: "۲۸,۰۰۰,۰۰۰",
    remainingText: "۷,۰۰۰,۰۰۰",
    progress: 80,
    dueDate: "۱۴۰۵/۰۹/۰۱",
    color: "#8B5CF6",
    category: "تکنولوژی",
  },
  {
    id: "GOAL-003",
    title: "پس‌انداز اضطراری",
    icon: "🛡️",
    targetAmount: 100000000,
    targetAmountText: "۱۰۰,۰۰۰,۰۰۰",
    currentAmount: 45000000,
    currentAmountText: "۴۵,۰۰۰,۰۰۰",
    remainingText: "۵۵,۰۰۰,۰۰۰",
    progress: 45,
    dueDate: "۱۴۰۶/۰۶/۰۱",
    color: "#16a34a",
    category: "امنیت",
  },
  {
    id: "GOAL-004",
    title: "خرید دوچرخه",
    icon: "🚲",
    targetAmount: 12000000,
    targetAmountText: "۱۲,۰۰۰,۰۰۰",
    currentAmount: 4200000,
    currentAmountText: "۴,۲۰۰,۰۰۰",
    remainingText: "۷,۸۰۰,۰۰۰",
    progress: 35,
    dueDate: "۱۴۰۵/۱۱/۰۱",
    color: "#F59E0B",
    category: "سرگرمی",
  },
];

export const totalSavingsGoals = savingsGoals.reduce((sum, g) => sum + g.currentAmount, 0);
export const totalSavingsTargets = savingsGoals.reduce((sum, g) => sum + g.targetAmount, 0);

// ==================== Achievements / Badges ====================
export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: number;
  category: "payment" | "savings" | "social" | "security" | "streak";
};

export const achievements: Achievement[] = [
  { id: "ACH-001", title: "اولین پرداخت", description: "اولین پرداخت خود را انجام دهید", icon: "🎉", color: "#034ea2", unlocked: true, unlockedDate: "۱۴۰۵/۰۱/۰۱", category: "payment" },
  { id: "ACH-002", title: "پرداخت ماهانه", description: "۱۰ تراکنش در یک ماه", icon: "📊", color: "#16a34a", unlocked: true, unlockedDate: "۱۴۰۵/۰۲/۰۱", category: "payment" },
  { id: "ACH-003", title: "مدیر مالی", description: "۵۰ تراکنش کلی", icon: "💼", color: "#8B5CF6", unlocked: true, unlockedDate: "۱۴۰۵/۰۳/۰۱", category: "payment" },
  { id: "ACH-004", title: "پس‌اندازکار", description: "اولین هدف پس‌انداز را بسازید", icon: "🐷", color: "#F59E0B", unlocked: true, unlockedDate: "۱۴۰۵/۰۲/۱۵", category: "savings" },
  { id: "ACH-005", title: "هدیف‌محور", description: "یک هدف پس‌انداز را کامل کنید", icon: "🎯", color: "#EF4444", unlocked: false, progress: 80, category: "savings" },
  { id: "ACH-006", title: "اجتماعی", description: "به ۵ دوست پول بفرستید", icon: "👥", color: "#0EA5E9", unlocked: true, unlockedDate: "۱۴۰۵/۰۳/۱۰", category: "social" },
  { id: "ACH-007", title: "امن", description: "احراز هویت دو مرحله‌ای فعال کنید", icon: "🔒", color: "#6366F1", unlocked: true, unlockedDate: "۱۴۰۵/۰۱/۰۱", category: "security" },
  { id: "ACH-008", title: "۷ روز پیاپی", description: "۷ روز پشت سر هم وارد شوید", icon: "🔥", color: "#EC4899", unlocked: true, unlockedDate: "۱۴۰۵/۰۴/۰۷", category: "streak" },
  { id: "ACH-009", title: "۳۰ روز پیاپی", description: "۳۰ روز پشت سر هم وارد شوید", icon: "⚡", color: "#F59E0B", unlocked: false, progress: 65, category: "streak" },
  { id: "ACH-010", title: "قرارداد بند", description: "۱۰ قرارداد فعال داشته باشید", icon: "📜", color: "#10B981", unlocked: true, unlockedDate: "۱۴۰۵/۰۳/۰۱", category: "payment" },
  { id: "ACH-011", title: "VIP", description: "موجودی بالای ۱۰ میلیون تومان", icon: "👑", color: "#FCD34D", unlocked: true, unlockedDate: "۱۴۰۵/۰۲/۰۱", category: "savings" },
  { id: "ACH-012", title: "بهره‌مند", description: "از ۱۸ دسته خدمت استفاده کنید", icon: "⭐", color: "#8B5CF6", unlocked: false, progress: 45, category: "payment" },
];

export const unlockedAchievements = achievements.filter((a) => a.unlocked).length;

// ==================== Monthly Spending Limit ====================
export const monthlySpendingLimit = {
  limit: 15000000,
  limitText: "۱۵,۰۰۰,۰۰۰",
  spent: 8750000,
  spentText: "۸,۷۵۰,۰۰۰",
  remaining: 6250000,
  remainingText: "۶,۲۵۰,۰۰۰",
  progress: 58,
  daysLeft: 12,
  dailyAverage: 350000,
  dailyAverageText: "۳۵۰,۰۰۰",
  topCategory: "خوراک",
  topCategoryAmount: 3200000,
  topCategoryAmountText: "۳,۲۰۰,۰۰۰",
};

// ==================== Weekly Activity Data (for activity chart) ====================
export const weeklyActivity = [
  { day: "شنبه", transactions: 3, amount: 1200000 },
  { day: "یکشنبه", transactions: 5, amount: 2800000 },
  { day: "دوشنبه", transactions: 2, amount: 850000 },
  { day: "سه‌شنبه", transactions: 6, amount: 3500000 },
  { day: "چهارشنبه", transactions: 4, amount: 2200000 },
  { day: "پنجشنبه", transactions: 7, amount: 4100000 },
  { day: "جمعه", transactions: 1, amount: 350000 },
];

// ==================== Activity Heatmap (GitHub-style, 12 weeks) ====================
export type HeatmapCell = {
  week: number;
  day: number; // 0-6 (Sat-Fri)
  count: number;
  amount: number;
  level: 0 | 1 | 2 | 3 | 4; // intensity level
};

// Generate 12 weeks x 7 days = 84 cells of mock activity
function generateHeatmap(): HeatmapCell[] {
  const cells: HeatmapCell[] = [];
  const seed = 42;
  let hash = seed;
  for (let w = 0; w < 12; w++) {
    for (let d = 0; d < 7; d++) {
      hash = (hash * 1103515245 + 12345) & 0x7fffffff;
      const r = (hash >> 16) % 100;
      let count = 0;
      let amount = 0;
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      // Friday (d=6) less active
      if (d === 6) {
        if (r > 70) { count = 1; amount = (hash % 500000) + 100000; level = 1; }
      } else if (r > 85) {
        count = 0; level = 0;
      } else if (r > 60) {
        count = 1; amount = (hash % 500000) + 100000; level = 1;
      } else if (r > 35) {
        count = 2 + (r % 2); amount = (hash % 2000000) + 500000; level = 2;
      } else if (r > 15) {
        count = 4 + (r % 3); amount = (hash % 4000000) + 1500000; level = 3;
      } else {
        count = 7 + (r % 4); amount = (hash % 8000000) + 3000000; level = 4;
      }
      cells.push({ week: w, day: d, count, amount, level });
    }
  }
  return cells;
}

export const activityHeatmap: HeatmapCell[] = generateHeatmap();

export const heatmapStats = {
  totalTransactions: activityHeatmap.reduce((s, c) => s + c.count, 0),
  totalAmount: activityHeatmap.reduce((s, c) => s + c.amount, 0),
  activeDays: activityHeatmap.filter((c) => c.count > 0).length,
  bestDay: activityHeatmap.reduce((best, c) => (c.count > best.count ? c : best), activityHeatmap[0]),
  streak: 14, // mock: 14 day streak
  avgPerDay: 0, // computed below
};
heatmapStats.avgPerDay = Math.round(
  activityHeatmap.reduce((s, c) => s + c.amount, 0) / 84
);

// ==================== Currency Rates ====================
export type Currency = {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  buyRate: number; // IRR per 1 unit
  sellRate: number;
  change: number; // % change 24h
  trend: "up" | "down";
};

export const currencies: Currency[] = [
  { code: "USD", name: "دلار آمریکا", symbol: "$", flag: "🇺🇸", buyRate: 67500, sellRate: 67200, change: 1.8, trend: "up" },
  { code: "EUR", name: "یورو", symbol: "€", flag: "🇪🇺", buyRate: 73200, sellRate: 72800, change: 0.9, trend: "up" },
  { code: "AED", name: "درهم امارات", symbol: "د.إ", flag: "🇦🇪", buyRate: 18380, sellRate: 18290, change: 1.5, trend: "up" },
  { code: "TRY", name: "لیر ترکیه", symbol: "₺", flag: "🇹🇷", buyRate: 2150, sellRate: 2120, change: -2.1, trend: "down" },
  { code: "GBP", name: "پوند انگلیس", symbol: "£", flag: "🇬🇧", buyRate: 85800, sellRate: 85400, change: 0.4, trend: "up" },
  { code: "CNY", name: "یوآن چین", symbol: "¥", flag: "🇨🇳", buyRate: 9320, sellRate: 9280, change: -0.6, trend: "down" },
  { code: "RUB", name: "روبل روسیه", symbol: "₽", flag: "🇷🇺", buyRate: 780, sellRate: 765, change: 3.2, trend: "up" },
  { code: "JPY", name: "ین ژاپن", symbol: "¥", flag: "🇯🇵", buyRate: 455, sellRate: 450, change: -0.3, trend: "down" },
];

// Gold prices (per gram, 18k and 24k and ounce)
export const goldPrices = [
  { name: "طلای ۱۸ عیار", price: 4520000, change: 2.3, trend: "up" as const, unit: "گرم", icon: "🥇" },
  { name: "طلای ۲۴ عیار", price: 6020000, change: 2.1, trend: "up" as const, unit: "گرم", icon: "✨" },
  { name: "سکه تمام", price: 45800000, change: 1.8, trend: "up" as const, unit: "عدد", icon: "🪙" },
  { name: "انس طلا", price: 205000000, change: 0.5, trend: "up" as const, unit: "انس", icon: "🟡" },
];

// Crypto prices
export const cryptoPrices = [
  { name: "بیت‌کوین", symbol: "BTC", price: 4320000000, change: 3.4, trend: "up" as const, icon: "₿", color: "#F7931A" },
  { name: "اتریوم", symbol: "ETH", price: 245000000, change: -1.2, trend: "down" as const, icon: "Ξ", color: "#627EEA" },
  { name: "تتر", symbol: "USDT", price: 68000, change: 0.1, trend: "up" as const, icon: "₮", color: "#26A17B" },
  { name: "دوج‌کوین", symbol: "DOGE", price: 4800, change: 5.6, trend: "up" as const, icon: "Ð", color: "#C2A633" },
  { name: "ریپل", symbol: "XRP", price: 32000, change: -0.8, trend: "down" as const, icon: "✕", color: "#23292F" },
  { name: "لایت‌کوین", symbol: "LTC", price: 8200000, change: 2.2, trend: "up" as const, icon: "Ł", color: "#345D9D" },
];

// ==================== Spending Categories (detailed breakdown) ====================
export type SpendingCategory = {
  id: string;
  name: string;
  icon: string;
  color: string;
  amount: number;
  amountText: string;
  percentage: number;
  transactionCount: number;
  trend: number; // % change vs last month
  trendDirection: "up" | "down";
  subcategories: { name: string; amount: number; amountText: string }[];
};

export const spendingCategories: SpendingCategory[] = [
  {
    id: "CAT-1",
    name: "خوراک و رستوران",
    icon: "🍔",
    color: "#034ea2",
    amount: 3200000,
    amountText: "۳,۲۰۰,۰۰۰",
    percentage: 28,
    transactionCount: 18,
    trend: 12,
    trendDirection: "up",
    subcategories: [
      { name: "رستوران", amount: 1800000, amountText: "۱,۸۰۰,۰۰۰" },
      { name: "فست‌فود", amount: 900000, amountText: "۹۰۰,۰۰۰" },
      { name: "سوپرمارکت", amount: 500000, amountText: "۵۰۰,۰۰۰" },
    ],
  },
  {
    id: "CAT-2",
    name: "قبوض و خدمات",
    icon: "⚡",
    color: "#F59E0B",
    amount: 2500000,
    amountText: "۲,۵۰۰,۰۰۰",
    percentage: 22,
    transactionCount: 8,
    trend: -5,
    trendDirection: "down",
    subcategories: [
      { name: "قبض برق", amount: 850000, amountText: "۸۵۰,۰۰۰" },
      { name: "قبض گاز", amount: 650000, amountText: "۶۵۰,۰۰۰" },
      { name: "قبض آب", amount: 350000, amountText: "۳۵۰,۰۰۰" },
      { name: "اینترنت", amount: 650000, amountText: "۶۵۰,۰۰۰" },
    ],
  },
  {
    id: "CAT-3",
    name: "اقساط و وام",
    icon: "💳",
    color: "#EF4444",
    amount: 2900000,
    amountText: "۲,۹۰۰,۰۰۰",
    percentage: 25,
    transactionCount: 5,
    trend: 0,
    trendDirection: "down",
    subcategories: [
      { name: "اسنپ‌پی", amount: 400000, amountText: "۴۰۰,۰۰۰" },
      { name: "دیجی‌پی", amount: 500000, amountText: "۵۰۰,۰۰۰" },
      { name: "وام تجارت", amount: 2000000, amountText: "۲,۰۰۰,۰۰۰" },
    ],
  },
  {
    id: "CAT-4",
    name: "حمل‌ونقل",
    icon: "🚗",
    color: "#8B5CF6",
    amount: 1200000,
    amountText: "۱,۲۰۰,۰۰۰",
    percentage: 10,
    transactionCount: 12,
    trend: 8,
    trendDirection: "up",
    subcategories: [
      { name: "اسنپ", amount: 700000, amountText: "۷۰۰,۰۰۰" },
      { name: "بنزین", amount: 500000, amountText: "۵۰۰,۰۰۰" },
    ],
  },
  {
    id: "CAT-5",
    name: "خرید و خرید",
    icon: "🛍️",
    color: "#EC4899",
    amount: 1100000,
    amountText: "۱,۱۰۰,۰۰۰",
    percentage: 10,
    transactionCount: 7,
    trend: 15,
    trendDirection: "up",
    subcategories: [
      { name: "پوشاک", amount: 600000, amountText: "۶۰۰,۰۰۰" },
      { name: "لوازم خانگی", amount: 500000, amountText: "۵۰۰,۰۰۰" },
    ],
  },
  {
    id: "CAT-6",
    name: "سرگرمی",
    icon: "🎬",
    color: "#06B6D4",
    amount: 550000,
    amountText: "۵۵۰,۰۰۰",
    percentage: 5,
    transactionCount: 4,
    trend: -3,
    trendDirection: "down",
    subcategories: [
      { name: "فیلیمو", amount: 249000, amountText: "۲۴۹,۰۰۰" },
      { name: "نماوا", amount: 199000, amountText: "۱۹۹,۰۰۰" },
      { name: "اسنپ‌پرو", amount: 102000, amountText: "۱۰۲,۰۰۰" },
    ],
  },
];

export const totalSpending = spendingCategories.reduce((s, c) => s + c.amount, 0);

// ==================== Onboarding Steps ====================
export type OnboardingStep = {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  highlights: string[];
};

export const onboardingSteps: OnboardingStep[] = [
  {
    id: 1,
    title: "به هستو خوش آمدید",
    description: "هسته پرداخت ایران — یک کارت، همه پرداخت‌ها. هستو به شما کمک می‌کند تمام پرداخت‌های خود را یکجا مدیریت کنید.",
    icon: "👋",
    color: "#034ea2",
    highlights: ["کیف پول مادر یکپارچه", "مدیریت تمام کارت‌های بانکی", "پرداخت‌های هوشمند"],
  },
  {
    id: 2,
    title: "کیف پول مادر",
    description: "موجودی کیف پول مادر خود را در داشبورد ببینید. تمام پرداخت‌ها از این کیف پول انجام می‌شود و در صورت کمبود موجودی، به‌طور خودکار از بانک‌های متصل شارژ می‌شود.",
    icon: "💰",
    color: "#16a34a",
    highlights: ["شارژ خودکار از بانک‌ها", "یک کارت جای همه کارت‌ها", "مدیریت آسان موجودی"],
  },
  {
    id: 3,
    title: "واریز و دریافت",
    description: "با دو دکمه ساده واریز و دریافت، به‌راحتی پول بفرستید و دریافت کنید. شماره موبایل گیرنده، شناسه کیف پول اوست.",
    icon: "🔄",
    color: "#F59E0B",
    highlights: ["تشخیص خودکار نوع شماره", "انتقال سریع با موبایل", "QR کد اختصاصی"],
  },
  {
    id: 4,
    title: "۴ روش پرداخت",
    description: "با شناسه واریز، اسکن QR، NFC یا پرداخت نزدیک (بر اساس لوکیشن)، به فروشگاه‌های اطراف خود پرداخت کنید.",
    icon: "💳",
    color: "#8B5CF6",
    highlights: ["شناسه واریز", "اسکن QR فروشگاه‌ها", "پرداخت NFC", "فروشگاه‌های نزدیک"],
  },
  {
    id: 5,
    title: "مدیریت مالی هوشمند",
    description: "دارایی‌های نقدی و غیرنقدی، بدهی‌ها و طلب‌های خود را در یکجا ببینید. نمودارهای تحلیلی به شما کمک می‌کنند تصمیمات بهتری بگیرید.",
    icon: "📊",
    color: "#EC4899",
    highlights: ["دارایی‌های غیرنقدی", "بدهی‌ها و طلب‌ها", "نمودارهای تحلیلی"],
  },
  {
    id: 6,
    title: "قراردادهای هوشمند",
    description: "تمام قراردادهای Direct Debit، BNPL، اشتراک‌ها و پرداخت‌های خودکار خود را مدیریت کنید. قراردادهای شخصی بسازید و با دیگران به اشتراک بگذارید.",
    icon: "📜",
    color: "#06B6D4",
    highlights: ["Direct Debit چند بانکه", "BNPL متمرکز", "قراردادهای شخصی"],
  },
];

// ==================== Transaction Detail (enhanced) ====================
export type TransactionDetail = {
  id: string;
  type: string;
  title: string;
  amount: number;
  amountText: string;
  date: string;
  time: string;
  status: "success" | "pending" | "failed";
  trackingNumber: string;
  description: string;
  category: string;
  categoryIcon: string;
  categoryColor: string;
  recipient: {
    name: string;
    account: string;
    bank?: string;
  };
  fee: number;
  feeText: string;
  paymentMethod: string;
};

export const transactionDetails: Record<string, TransactionDetail> = {
  TX1: {
    id: "TX1",
    type: "withdraw",
    title: "انتقال وجه",
    amount: 250000,
    amountText: "۲۵۰,۰۰۰",
    date: "۱۴۰۵/۰۴/۲۵",
    time: "۱۴:۳۰",
    status: "success",
    trackingNumber: "TRK-8X9K2M5N",
    description: "بازپرداخت وام",
    category: "انتقال",
    categoryIcon: "↗",
    categoryColor: "#034ea2",
    recipient: { name: "رضا کریمی", account: "09123456789", bank: "کیف پول هستو" },
    fee: 0,
    feeText: "رایگان",
    paymentMethod: "کیف پول مادر",
  },
  TX2: {
    id: "TX2",
    type: "receive",
    title: "دریافت وجه",
    amount: 1500000,
    amountText: "۱,۵۰۰,۰۰۰",
    date: "۱۴۰۵/۰۴/۲۵",
    time: "۱۲:۱۵",
    status: "success",
    trackingNumber: "TRK-3B5N8P2Q",
    description: "پرداخت اجاره",
    category: "دریافت",
    categoryIcon: "↙",
    categoryColor: "#16a34a",
    recipient: { name: "مریم احمدی", account: "09351112233", bank: "کیف پول هستو" },
    fee: 0,
    feeText: "رایگان",
    paymentMethod: "کیف پول مادر",
  },
  TX3: {
    id: "TX3",
    type: "charge",
    title: "شارژ کیف پول",
    amount: 5000000,
    amountText: "۵,۰۰۰,۰۰۰",
    date: "۱۴۰۵/۰۴/۲۴",
    time: "۲۰:۴۵",
    status: "success",
    trackingNumber: "TRK-7K2M9X4L",
    description: "شارژ خودکار از بلو بانک",
    category: "شارژ",
    categoryIcon: "⚡",
    categoryColor: "#F59E0B",
    recipient: { name: "بلو بانک", account: "۶۲۷۹-۶۱", bank: "بلو بانک" },
    fee: 0,
    feeText: "رایگان",
    paymentMethod: "Direct Debit",
  },
};
