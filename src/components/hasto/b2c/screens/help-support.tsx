"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fa } from "@/lib/hasto-data";
import {
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
  ChevronLeft,
  ChevronDown,
  Search,
  Headphones,
  FileText,
  Bug,
  Lightbulb,
  Star,
  X,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

const faqs: FAQ[] = [
  {
    id: "faq-1",
    question: "کیف پول مادر چیست؟",
    answer: "کیف پول مادر یک حساب مرجع در بانک تجارت است که تمام پرداخت‌های شما از این حساب انجام می‌شود. در صورت کمبود موجودی، به‌طور خودکار از بانک‌های متصل شارژ می‌شود.",
    category: "حساب",
  },
  {
    id: "faq-2",
    question: "Direct Debit چگونه کار می‌کند؟",
    answer: "با امضای یک‌باره قرارداد Direct Debit با بانک‌های متصل، هستو مجوز دارد در صورت نیاز به‌طور خودکار از حساب‌های شما برداشت کند. سقف برداشت برای هر بانک متفاوت است.",
    category: "بانکی",
  },
  {
    id: "faq-3",
    question: "آیا پرداخت‌های من امن هستند؟",
    answer: "بله، تمام پرداخت‌ها از طریق رمز ۶ رقمی یا بیومتریک تایید می‌شوند. همچنین احراز هویت دو مرحله‌ای برای ورود به حساب فعال است.",
    category: "امنیت",
  },
  {
    id: "faq-4",
    question: "چگونه می‌توانم قرارداد جدید بسازم؟",
    answer: "از بخش قراردادها، دکمه «افزودن قرارداد جدید» را بزنید. پس از انتخاب نوع قرارداد و سرویس‌دهنده، اطلاعات را تکمیل کرده و ذخیره کنید.",
    category: "قراردادها",
  },
  {
    id: "faq-5",
    question: "کارت بانکی من را چگونه تشخیص می‌دهید؟",
    answer: "هستو با استفاده از پیش‌شماره کارت‌های شتابی، بانک صادرکننده را به‌طور خودکار تشخیص می‌دهد. کافیست ۱۶ رقم کارت را وارد کنید.",
    category: "بانکی",
  },
  {
    id: "faq-6",
    question: "آیا می‌توانم اشتراک‌های خود را مدیریت کنم؟",
    answer: "بله، از بخش قراردادها می‌توانید تمام اشتراک‌های فعال (فیلیمو، نماوا، ChatGPT و...) را ببینید و مدیریت کنید.",
    category: "قراردادها",
  },
  {
    id: "faq-7",
    question: "پرداخت نزدیک چیست؟",
    answer: "پرداخت نزدیک بر اساس لوکیشن شما، فروشگاه‌های ثبت‌شده در فاصله ۵۰ متری را نمایش می‌دهد. کافیست فروشگاه را انتخاب کرده و مبلغ را وارد کنید.",
    category: "پرداخت",
  },
  {
    id: "faq-8",
    question: "چگونه می‌توانم کسب‌وکار خود را ثبت کنم؟",
    answer: "از سوییچر بالا، حالت «پنل کسب‌وکار» را انتخاب کنید. پس از احراز هویت کسب‌وکار، می‌توانید لینک پرداخت بسازید و محصولات خود را مدیریت کنید.",
    category: "کسب‌وکار",
  },
];

const categories = ["همه", "حساب", "بانکی", "امنیت", "قراردادها", "پرداخت", "کسب‌وکار"];

export function HelpSupportScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("همه");
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = selectedCategory === "همه" || faq.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      faq.question.includes(searchQuery) ||
      faq.answer.includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  const contactMethods = [
    { icon: MessageCircle, label: "گفتگوی زنده", desc: "پاسخ فوری", color: "#16a34a", action: () => toast.info("گفتگوی زنده شروع شد") },
    { icon: Phone, label: "تماس تلفنی", desc: "۰۲۱-۱۲۳۴۵۶۷۸", color: "#034ea2", action: () => toast.info("در حال برقراری تماس...") },
    { icon: Mail, label: "ایمیل", desc: "support@hasto.to", color: "#8B5CF6", action: () => toast.info("ایمیل کپی شد") },
    { icon: Bug, label: "گزارش مشکل", desc: "گزارش باگ", color: "#EF4444", action: () => setShowContactForm(true) },
  ];

  const quickLinks = [
    { icon: FileText, label: "راهنمای استفاده", color: "#034ea2" },
    { icon: Lightbulb, label: "نکات مالی", color: "#F59E0B" },
    { icon: Star, label: "امتیازدهی به برنامه", color: "#EC4899" },
    { icon: Headphones, label: "وضعیت سرویس", color: "#16a34a" },
  ];

  return (
    <div className="pb-4">
      {/* Header */}
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-[#034ea2] to-[#023069] text-white shadow-lg shadow-[#034ea2]/20"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-base">مرکز پشتیبانی</h2>
              <p className="text-[11px] text-white/70">۲۴ ساعته در کنار شما هستیم</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Contact methods */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-4 gap-2">
          {contactMethods.map((method, idx) => {
            const Icon = method.icon;
            return (
              <motion.button
                key={method.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
                onClick={method.action}
                className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl bg-card border border-border shadow-soft hover:shadow-md transition-shadow"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${method.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: method.color }} />
                </div>
                <span className="text-[10px] font-bold text-center leading-tight">{method.label}</span>
                <span className="text-[8px] text-muted-foreground text-center leading-tight">{method.desc}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Quick links */}
      <div className="px-4 mb-4">
        <div className="grid grid-cols-2 gap-2">
          {quickLinks.map((link, idx) => {
            const Icon = link.icon;
            return (
              <motion.button
                key={link.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                onClick={() => toast.info(link.label)}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-card border border-border shadow-soft hover:bg-muted/30 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${link.color}15` }}
                >
                  <Icon className="w-4 h-4" style={{ color: link.color }} />
                </div>
                <span className="text-xs font-medium flex-1 text-right">{link.label}</span>
                <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* FAQ Search */}
      <div className="px-4 mb-3">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در سوالات متداول..."
            className="w-full h-11 pr-10 pl-4 rounded-xl bg-muted border border-border outline-none focus:border-[#034ea2] text-sm"
          />
        </div>
      </div>

      {/* Category filter */}
      <div className="px-4 mb-3">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all",
                selectedCategory === cat
                  ? "bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white shadow-md"
                  : "bg-card border border-border text-muted-foreground"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ list */}
      <div className="px-4 space-y-2">
        <h3 className="font-bold text-sm mb-2 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-[#034ea2] dark:text-[#6BA0F5]" />
          سوالات متداول
        </h3>
        {filteredFaqs.length === 0 ? (
          <div className="py-8 text-center">
            <Search className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">نتیجه‌ای یافت نشد</p>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="rounded-2xl bg-card border border-border overflow-hidden shadow-soft"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                className="w-full flex items-center gap-3 p-3 text-right hover:bg-muted/30 transition-colors"
              >
                <span className="text-[10px] font-bold text-muted-foreground px-1.5 py-0.5 rounded-md bg-muted shrink-0">
                  {faq.category}
                </span>
                <span className="text-xs font-medium flex-1">{faq.question}</span>
                <motion.div
                  animate={{ rotate: expandedFaq === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {expandedFaq === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-3 pb-3 text-xs text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))
        )}
      </div>

      {/* Contact form modal */}
      <AnimatePresence>
        {showContactForm && (
          <ContactFormModal onClose={() => setShowContactForm(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ContactFormModal({ onClose }: { onClose: () => void }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="w-full max-w-[420px] bg-background rounded-t-3xl p-6 pb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">گزارش مشکل</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">موضوع</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="موضوع مشکل را بنویسید"
              className="w-full h-11 px-4 rounded-xl bg-muted border border-border outline-none focus:border-[#034ea2] text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">توضیحات</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="مشکل خود را به‌طور کامل توضیح دهید..."
              rows={4}
              className="w-full p-3 rounded-xl bg-muted border border-border outline-none focus:border-[#034ea2] text-sm resize-none"
            />
          </div>
          <button
            onClick={() => {
              if (subject && message) {
                toast.success("گزارش شما ارسال شد. سپاس از بازخورد شما!");
                onClose();
              } else {
                toast.error("لطفاً موضوع و توضیحات را وارد کنید");
              }
            }}
            className="w-full h-11 rounded-xl bg-gradient-to-l from-[#034ea2] to-[#0456B5] text-white font-bold text-sm flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            ارسال گزارش
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
