"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/hasto-store";
import { AnimatedNumber } from "@/components/hasto/shared/animated-number";
import { bills, installments, contracts, fa, parseFa } from "@/lib/hasto-data";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft, Calendar as CalIcon, Zap, Flame, Droplet, Phone, Wifi, CreditCard, FileText } from "lucide-react";
import { toast } from "sonner";

type CalendarEvent = {
  id: string;
  day: number;
  title: string;
  amount: string;
  type: "bill" | "installment" | "contract" | "subscription";
  icon: typeof Zap;
  color: string;
};

const monthNames = [
  "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
  "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند",
];

const weekDays = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"];

export function CalendarScreen() {
  const setB2CScreen = useAppStore((s) => s.setB2CScreen);
  const [currentMonth, setCurrentMonth] = useState(3); // تیر (index 3)

  // Mock: generate events for the current month (تیر = 31 days)
  const events = useMemo<CalendarEvent[]>(() => {
    const evs: CalendarEvent[] = [];

    // Bills
    bills.forEach((bill, i) => {
      const day = [25, 28, 30, 5, 10][i] || 15;
      const icons = [Zap, Flame, Droplet, Phone, Wifi];
      const colors = ["#F59E0B", "#EF4444", "#0EA5E9", "#10B981", "#8B5CF6"];
      evs.push({
        id: `bill-${bill.id}`,
        day,
        title: bill.type,
        amount: bill.amount,
        type: "bill",
        icon: icons[i % icons.length],
        color: colors[i % colors.length],
      });
    });

    // Installments
    installments.forEach((ins) => {
      const day = parseInt(ins.due.match(/\d+/)?.[0] || "15");
      evs.push({
        id: `ins-${ins.id}`,
        day,
        title: ins.platform,
        amount: ins.nextAmount,
        type: "installment",
        icon: CreditCard,
        color: ins.color,
      });
    });

    // Active subscriptions (monthly)
    contracts
      .filter((c) => c.type === "subscription" && c.status === "active")
      .slice(0, 4)
      .forEach((c, i) => {
        evs.push({
          id: `sub-${c.id}`,
          day: 1 + i * 5,
          title: c.provider,
          amount: c.amount,
          type: "subscription",
          icon: FileText,
          color: "#8B5CF6",
        });
      });

    return evs;
  }, []);

  // Group events by day
  const eventsByDay = useMemo(() => {
    const m: Record<number, CalendarEvent[]> = {};
    events.forEach((e) => {
      if (!m[e.day]) m[e.day] = [];
      m[e.day].push(e);
    });
    return m;
  }, [events]);

  const daysInMonth = 31;
  const firstDayOffset = 3; // mock: month starts Wednesday (index 3)

  const totalMonthPayments = events.reduce((sum, e) => sum + parseFa(e.amount), 0);

  return (
    <div className="pb-4">
      {/* Header summary */}
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-5 bg-gradient-to-br from-[#034ea2] to-[#023069] text-white shadow-lg shadow-[#034ea2]/20 relative overflow-hidden"
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
              <CalIcon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-white/60">پرداخت‌های ماه</p>
              <p className="text-lg font-bold">{monthNames[currentMonth]} ۱۴۰۵</p>
            </div>
            <div className="text-left">
              <p className="text-xs text-white/60">مجموع</p>
              <p className="font-bold tabular-nums">
                <AnimatedNumber value={totalMonthPayments} duration={1000} className="text-lg" />
                <span className="text-xs font-normal mr-1">تومان</span>
              </p>
            </div>
          </div>
          <div className="relative mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-white/70">{fa(events.length)} رویداد پرداخت</span>
            <span className="text-white/70">میانگین: {fa(Math.round(totalMonthPayments / events.length).toLocaleString())} تومان</span>
          </div>
        </motion.div>
      </div>

      {/* Month navigation */}
      <div className="px-4 mb-3 flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth((m) => Math.max(0, m - 1))}
          className="p-2 rounded-xl hover:bg-muted transition-colors"
          aria-label="ماه قبل"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
        <h2 className="font-bold text-base">{monthNames[currentMonth]} ۱۴۰۵</h2>
        <button
          onClick={() => setCurrentMonth((m) => Math.min(11, m + 1))}
          className="p-2 rounded-xl hover:bg-muted transition-colors"
          aria-label="ماه بعد"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="px-4">
        <div className="rounded-2xl bg-card border border-border p-3 shadow-soft">
          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((d) => (
              <div key={d} className="text-center text-[10px] font-bold text-muted-foreground py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Offset for first day */}
            {Array.from({ length: firstDayOffset }).map((_, i) => (
              <div key={`off-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = eventsByDay[day] || [];
              const hasEvents = dayEvents.length > 0;
              const isToday = day === 25; // mock today

              return (
                <button
                  key={day}
                  onClick={() => hasEvents && toast.info(`${fa(day)} ${monthNames[currentMonth]}: ${fa(dayEvents.length)} رویداد`)}
                  className={cn(
                    "aspect-square rounded-lg flex flex-col items-center justify-center relative transition-all",
                    hasEvents ? "hover:bg-accent cursor-pointer" : "cursor-default",
                    isToday && "ring-2 ring-[#034ea2] dark:ring-[#6BA0F5]"
                  )}
                >
                  <span
                    className={cn(
                      "text-xs tabular-nums",
                      isToday ? "font-bold text-[#034ea2] dark:text-[#6BA0F5]" : hasEvents ? "font-bold" : "text-muted-foreground"
                    )}
                  >
                    {fa(day)}
                  </span>
                  {hasEvents && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayEvents.slice(0, 3).map((e, idx) => (
                        <div
                          key={idx}
                          className="w-1 h-1 rounded-full"
                          style={{ background: e.color }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming events list */}
      <div className="px-4 mt-4">
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
          <CalIcon className="w-4 h-4 text-[#034ea2] dark:text-[#6BA0F5]" />
          رویدادهای پیش رو
        </h3>

        <div className="space-y-2">
          {events
            .sort((a, b) => a.day - b.day)
            .map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border shadow-soft"
              >
                {/* Date column */}
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl shrink-0" style={{ background: `${event.color}15` }}>
                  <span className="text-base font-bold tabular-nums" style={{ color: event.color }}>
                    {fa(event.day)}
                  </span>
                  <span className="text-[9px] text-muted-foreground">{monthNames[currentMonth].slice(0, 3)}</span>
                </div>

                {/* Event info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <event.icon className="w-3.5 h-3.5 shrink-0" style={{ color: event.color }} />
                    <p className="text-sm font-medium truncate">{event.title}</p>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {event.type === "bill" && "قبض"}
                    {event.type === "installment" && "قسط"}
                    {event.type === "subscription" && "اشتراک"}
                    {event.type === "contract" && "قرارداد"}
                  </p>
                </div>

                {/* Amount */}
                <div className="text-left shrink-0">
                  <p className="text-sm font-bold tabular-nums">{event.amount}</p>
                  <p className="text-[10px] text-muted-foreground">تومان</p>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}
