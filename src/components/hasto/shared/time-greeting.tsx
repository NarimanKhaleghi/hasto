"use client";

import { useMemo } from "react";
import { Sun, Sunset, Moon, Coffee } from "lucide-react";
import { user } from "@/lib/hasto-data";

export function TimeGreeting() {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { text: "صبح بخیر", icon: Coffee, color: "#F59E0B" };
    }
    if (hour >= 12 && hour < 17) {
      return { text: "ظهر بخیر", icon: Sun, color: "#034ea2" };
    }
    if (hour >= 17 && hour < 20) {
      return { text: "عصر بخیر", icon: Sunset, color: "#EC4899" };
    }
    return { text: "شب بخیر", icon: Moon, color: "#6366F1" };
  }, []);

  const Icon = greeting.icon;

  return (
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: `${greeting.color}20` }}
      >
        <Icon className="w-4 h-4" style={{ color: greeting.color }} />
      </div>
      <div className="leading-tight">
        <p className="text-xs text-muted-foreground">{greeting.text}،</p>
        <p className="font-bold text-sm">{user.name}</p>
      </div>
    </div>
  );
}
