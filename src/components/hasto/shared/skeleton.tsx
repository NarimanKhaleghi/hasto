"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-3xl bg-card border border-border p-4 shadow-soft", className)}>
      <div className="flex items-center gap-2 mb-3">
        <Skeleton className="w-8 h-8 rounded-xl" />
        <div className="flex-1">
          <Skeleton className="h-3 w-24 rounded mb-1.5" />
          <Skeleton className="h-2 w-16 rounded" />
        </div>
      </div>
      <Skeleton className="h-8 w-32 rounded mb-3" />
      <Skeleton className="h-2 w-full rounded-full" />
    </div>
  );
}

export function SkeletonWalletCard() {
  return (
    <div className="rounded-3xl p-5 wallet-gradient h-44 relative overflow-hidden">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Skeleton className="h-2 w-20 rounded bg-white/20 mb-2" />
          <Skeleton className="h-3 w-24 rounded bg-white/20" />
        </div>
        <Skeleton className="w-9 h-9 rounded-full bg-white/20" />
      </div>
      <Skeleton className="h-2 w-28 rounded bg-white/20 mb-2" />
      <Skeleton className="h-8 w-40 rounded bg-white/30 mb-6" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-32 rounded bg-white/20" />
        <Skeleton className="h-3 w-12 rounded bg-white/20" />
      </div>
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-muted/50 rounded",
        className
      )}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["200% 0", "-200% 0"] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-3 w-24 rounded mb-1.5" />
        <Skeleton className="h-2 w-16 rounded" />
      </div>
      <Skeleton className="h-4 w-16 rounded" />
    </div>
  );
}
