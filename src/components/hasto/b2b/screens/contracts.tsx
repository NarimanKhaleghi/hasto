"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/hasto-store";
import { business, fa } from "@/lib/hasto-data";
import { SectionCard, StatusBadge } from "@/components/hasto/shared/ui";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  FileText,
  Plus,
  X,
  Calendar,
  User,
  Tag,
  Repeat,
  Info,
  Link2,
  QrCode,
  Copy,
  Check,
  Share2,
  Shield,
  Clock,
  CreditCard,
} from "lucide-react";

type ContractType = "monthly" | "periodic" | "installment";

const contractTypes: { id: ContractType; label: string; desc: string; icon: typeof Repeat; color: string }[] = [
  { id: "monthly", label: "اشتراک ماهانه", desc: "پرداخت ماهانه خودکار", icon: Repeat, color: "#034ea2" },
  { id: "periodic", label: "پرداخت دوره‌ای", desc: "هر هفته/ماه/سال", icon: Calendar, color: "#16a34a" },
  { id: "installment", label: "اقساط", desc: "تقسیم بر چند قسط", icon: CreditCard, color: "#8B5CF6" },
];

export function B2BContractsScreen() {
  const [showCreate, setShowCreate] = useState(false);
  const [activeContract, setActiveContract] = useState<string | null>(null);

  const active = business.businessContracts.filter((c) => c.status === "active").length;

  return (
    <div className="pb-24">
      {/* Summary */}
      <div className="px-4 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-5 shadow-soft bg-gradient-to-br from-[#8B5CF6]/10 to-[#034ea2]/5 border border-[#8B5CF6]/15"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#8B5CF6]" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">قراردادهای فعال</p>
                <p className="font-bold text-lg">{fa(active)} قرارداد</p>
              </div>
            </div>
            <div className="text-left">
              <p className="text-xs text-muted-foreground">درآمد ماهانه</p>
              <p className="font-bold text-base tabular-nums">
                {fa("۱۵,۰۵۰,۰۰۰")} <span className="text-[10px] text-muted-foreground">تومان</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-3 border-t border-[#8B5CF6]/10">
            <Shield className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span className="text-[11px] text-muted-foreground">پرداخت‌ها به‌صورت خودکار تسویه می‌شوند</span>
          </div>
        </motion.div>
      </div>

      {/* Types explained */}
      <div className="px-4 mt-4">
        <SectionCard title="انواع قرارداد" icon={Info}>
          <div className="grid grid-cols-3 gap-2">
            {contractTypes.map((t) => (
              <div
                key={t.id}
                className="p-3 rounded-xl bg-muted/50 text-center"
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2"
                  style={{ background: `${t.color}15` }}
                >
                  <t.icon className="w-4 h-4" style={{ color: t.color }} />
                </div>
                <p className="font-bold text-[11px] mb-0.5">{t.label}</p>
                <p className="text-[9px] text-muted-foreground leading-tight">{t.desc}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Contracts list */}
      <div className="px-4 mt-4">
        <SectionCard title="قراردادهای کسب‌وکار" icon={FileText} noPadding>
          <div className="divide-y divide-border">
            {business.businessContracts.map((c, i) => (
              <motion.button
                key={c.id}
                onClick={() => setActiveContract(c.id)}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-right hover:bg-accent/30 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm truncate">{c.name}</p>
                    <StatusBadge status="active" label="فعال" />
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {c.clientName} • {c.period}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-[10px] text-muted-foreground tabular-nums">
                      {c.startDate} تا {c.expiryDate}
                    </span>
                  </div>
                </div>
                <div className="text-left shrink-0">
                  <p className="font-bold text-sm tabular-nums text-[#8B5CF6]">{c.amount}</p>
                  <p className="text-[10px] text-muted-foreground">تومان</p>
                </div>
              </motion.button>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* New contract FAB-like button */}
      <div className="px-4 mt-4">
        <button
          onClick={() => setShowCreate(true)}
          className="w-full h-14 rounded-2xl bg-gradient-to-l from-[#8B5CF6] to-[#6D28D9] text-white font-bold flex items-center justify-center gap-2 shadow-glow active:scale-[0.98] transition-transform"
        >
          <Plus className="w-5 h-5" />
          ساخت قرارداد جدید
        </button>
      </div>

      <AnimatePresence>
        {showCreate && <CreateContractSheet onClose={() => setShowCreate(false)} />}
        {activeContract && (
          <ContractDetailSheet
            contractId={activeContract}
            onClose={() => setActiveContract(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ==================== Create Contract Sheet ====================
function CreateContractSheet({ onClose }: { onClose: () => void }) {
  const [type, setType] = useState<ContractType>("monthly");
  const [name, setName] = useState("");
  const [clientMobile, setClientMobile] = useState("");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("ماهانه");
  const [startDate, setStartDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [description, setDescription] = useState("");
  const [saved, setSaved] = useState(false);
  const [shareStep, setShareStep] = useState<"link" | "qr" | "id">("link");

  const valid = name.trim().length >= 2 && clientMobile.length >= 10 && amount.length >= 4;

  const handleSave = () => {
    if (!valid) {
      toast.error("اطلاعات را کامل کنید");
      return;
    }
    setSaved(true);
    toast.success("قرارداد ساخته شد");
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    toast.success(`${label} کپی شد`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] bg-background rounded-t-3xl max-h-[92vh] overflow-y-auto scrollbar-thin"
      >
        <div className="sticky top-0 bg-background/95 backdrop-blur-md px-5 pt-4 pb-3 border-b border-border z-10">
          <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base">قرارداد جدید</h3>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 pb-8">
          {!saved ? (
            <>
              {/* Type selection */}
              <Field label="نوع قرارداد" icon={Repeat}>
                <div className="grid grid-cols-3 gap-2">
                  {contractTypes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setType(t.id)}
                      className={cn(
                        "p-3 rounded-xl border-2 text-center transition-all",
                        type === t.id
                          ? "border-[#8B5CF6] bg-[#8B5CF6]/5"
                          : "border-border bg-background"
                      )}
                    >
                      <t.icon
                        className="w-5 h-5 mx-auto mb-1"
                        style={{ color: type === t.id ? t.color : undefined }}
                      />
                      <p className="text-[10px] font-bold">{t.label}</p>
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="نام قرارداد" icon={Tag}>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value.slice(0, 60))}
                  placeholder="مثلاً: اجاره ماهانه مغازه"
                  className={inputCls}
                />
              </Field>

              <Field label="موبایل مشتری" icon={User}>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={clientMobile}
                  onChange={(e) => setClientMobile(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  placeholder="09XXXXXXXXX"
                  className={inputCls}
                  dir="ltr"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="مبلغ (تومان)" icon={Tag}>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/\D/g, "").slice(0, 12))}
                    placeholder="۰"
                    className={inputCls}
                    dir="ltr"
                  />
                </Field>

                <Field label="دوره" icon={Clock}>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className={inputCls}
                  >
                    <option>هفتگی</option>
                    <option>ماهانه</option>
                    <option>سه‌ماهه</option>
                    <option>سالانه</option>
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Field label="تاریخ شروع" icon={Calendar}>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="۱۴۰۵/۰۱/۰۱"
                    className={inputCls}
                    dir="ltr"
                  />
                </Field>
                <Field label="تاریخ پایان" icon={Calendar}>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="۱۴۰۶/۰۱/۰۱"
                    className={inputCls}
                    dir="ltr"
                  />
                </Field>
              </div>

              <Field label="توضیحات (اختیاری)" icon={FileText}>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value.slice(0, 200))}
                  placeholder="شرایط قرارداد..."
                  className={cn(inputCls, "h-20 resize-none py-3")}
                />
              </Field>

              <button
                onClick={handleSave}
                disabled={!valid}
                className={cn(
                  "w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-2 mt-4 transition-all",
                  valid
                    ? "bg-gradient-to-l from-[#8B5CF6] to-[#6D28D9] text-white shadow-glow active:scale-[0.98]"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <Check className="w-5 h-5" />
                ذخیره و اشتراک‌گذاری
              </button>
            </>
          ) : (
            <ShareStep
              shareStep={shareStep}
              setShareStep={setShareStep}
              onCopy={copyText}
              name={name}
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ==================== Share step ====================
function ShareStep({
  shareStep,
  setShareStep,
  onCopy,
  name,
}: {
  shareStep: "link" | "qr" | "id";
  setShareStep: (s: "link" | "qr" | "id") => void;
  onCopy: (text: string, label: string) => void;
  name: string;
}) {
  const code = `BCN-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const link = `hasto.to/c/${code}`;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col items-center text-center mb-5">
        <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center mb-3">
          <Check className="w-8 h-8 text-success" strokeWidth={3} />
        </div>
        <h3 className="font-bold text-base">قرارداد ساخته شد!</h3>
        <p className="text-xs text-muted-foreground mt-1">{name}</p>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { id: "link" as const, label: "لینک", icon: Link2 },
          { id: "qr" as const, label: "QR", icon: QrCode },
          { id: "id" as const, label: "شناسه", icon: Tag },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => setShareStep(s.id)}
            className={cn(
              "h-11 rounded-xl border-2 flex items-center justify-center gap-1.5 text-xs font-bold transition-all",
              shareStep === s.id
                ? "border-[#8B5CF6] bg-[#8B5CF6]/5 text-[#8B5CF6]"
                : "border-border text-muted-foreground"
            )}
          >
            <s.icon className="w-4 h-4" />
            {s.label}
          </button>
        ))}
      </div>

      {shareStep === "link" && (
        <div className="p-4 rounded-2xl bg-muted/50 border border-border">
          <p className="text-[10px] text-muted-foreground mb-1">لینک قرارداد</p>
          <p className="font-bold text-sm text-[#8B5CF6] mb-3" dir="ltr">{link}</p>
          <button
            onClick={() => onCopy(`https://${link}`, "لینک")}
            className="w-full h-11 rounded-xl bg-gradient-to-l from-[#8B5CF6] to-[#6D28D9] text-white font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Copy className="w-4 h-4" />
            کپی لینک
          </button>
        </div>
      )}

      {shareStep === "qr" && (
        <div className="flex flex-col items-center p-4 rounded-2xl bg-muted/50 border border-border">
          <div className="w-44 h-44 bg-white rounded-2xl p-3 shadow-soft">
            <QRCodeSvg value={link} size={152} />
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            برای اشتراک‌گذاری با مشتری، این QR را نمایش دهید
          </p>
        </div>
      )}

      {shareStep === "id" && (
        <div className="p-4 rounded-2xl bg-muted/50 border border-border text-center">
          <p className="text-[10px] text-muted-foreground mb-1">شناسه قرارداد</p>
          <p className="font-bold text-xl tabular-nums text-[#8B5CF6]" dir="ltr">{code}</p>
          <button
            onClick={() => onCopy(code, "شناسه")}
            className="w-full h-11 rounded-xl bg-gradient-to-l from-[#8B5CF6] to-[#6D28D9] text-white font-bold flex items-center justify-center gap-2 mt-3 active:scale-[0.98] transition-transform"
          >
            <Copy className="w-4 h-4" />
            کپی شناسه
          </button>
        </div>
      )}

      <button
        onClick={() => {
          if (navigator.share) {
            navigator.share({ title: `قرارداد ${name}`, url: `https://${link}` });
          } else {
            onCopy(`https://${link}`, "لینک");
          }
        }}
        className="w-full h-12 rounded-xl border-2 border-[#8B5CF6]/30 text-[#8B5CF6] font-bold flex items-center justify-center gap-2 mt-3"
      >
        <Share2 className="w-4 h-4" />
        اشتراک‌گذاری
      </button>
    </motion.div>
  );
}

// ==================== Contract Detail Sheet ====================
function ContractDetailSheet({
  contractId,
  onClose,
}: {
  contractId: string;
  onClose: () => void;
}) {
  const c = business.businessContracts.find((x) => x.id === contractId);
  if (!c) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[420px] bg-background rounded-t-3xl p-5 pb-8 max-h-[88vh] overflow-y-auto scrollbar-thin"
      >
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base">جزئیات قرارداد</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#8B5CF6]/5 border border-[#8B5CF6]/10 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-base">{c.name}</p>
            <p className="text-xs text-muted-foreground">{c.clientName}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-4">
          <DetailRow label="مبلغ" value={`${c.amount} تومان`} />
          <DetailRow label="دوره" value={c.period} />
          <DetailRow label="شروع" value={c.startDate} />
          <DetailRow label="پایان" value={c.expiryDate} />
        </div>

        <div className="p-3 rounded-xl bg-muted/50 flex items-center gap-2">
          <Tag className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground">شناسه قرارداد:</span>
          <span className="text-xs font-bold tabular-nums" dir="ltr">{c.id}</span>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => toast.success("لینک کپی شد")}
            className="flex-1 h-12 rounded-xl bg-gradient-to-l from-[#8B5CF6] to-[#6D28D9] text-white font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Share2 className="w-4 h-4" />
            اشتراک‌گذاری
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-xl bg-muted text-muted-foreground font-bold"
          >
            بستن
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-muted/50">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="font-bold text-sm tabular-nums">{value}</p>
    </div>
  );
}

const inputCls =
  "w-full h-12 px-4 rounded-2xl bg-background border-2 border-border focus:border-[#8B5CF6] outline-none text-sm font-medium transition-colors";

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-1.5 px-1">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </label>
      {children}
    </div>
  );
}

// QR mockup
function QRCodeSvg({ value, size }: { value: string; size: number }) {
  const cells = 21;
  const cellSize = size / cells;
  const pattern: boolean[] = [];
  let hash = 0;
  for (let i = 0; i < value.length; i++) hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
  for (let i = 0; i < cells * cells; i++) {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    pattern.push((hash >> 16) % 100 > 50);
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" />
      {pattern.map((on, i) => {
        if (!on) return null;
        const x = (i % cells) * cellSize;
        const y = Math.floor(i / cells) * cellSize;
        return <rect key={i} x={x} y={y} width={cellSize} height={cellSize} fill="#6D28D9" />;
      })}
      {[[0, 0], [cells - 7, 0], [0, cells - 7]].map(([cx, cy], i) => (
        <g key={i}>
          <rect x={cx * cellSize} y={cy * cellSize} width={7 * cellSize} height={7 * cellSize} fill="#6D28D9" />
          <rect x={(cx + 1) * cellSize} y={(cy + 1) * cellSize} width={5 * cellSize} height={5 * cellSize} fill="white" />
          <rect x={(cx + 2) * cellSize} y={(cy + 2) * cellSize} width={3 * cellSize} height={3 * cellSize} fill="#6D28D9" />
        </g>
      ))}
    </svg>
  );
}
