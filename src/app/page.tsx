"use client";

import { useAppStore } from "@/lib/hasto-store";
import { ThemeSync } from "@/components/hasto/theme-sync";
import { AppShell } from "@/components/hasto/app-shell";

export default function Page() {
  return (
    <>
      <ThemeSync />
      <AppShell />
    </>
  );
}
