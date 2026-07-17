"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/hasto-store";
import { onboardingSteps, fa } from "@/lib/hasto-data";
import { X, ChevronLeft, Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function Onboarding() {
  const { showOnboarding, onboardingStep, setOnboardingStep, completeOnboarding } = useAppStore();
  const [exiting, setExiting] = useState(false);

  if (!showOnboarding) return null;

  const step = onboardingSteps[onboardingStep];
  const isLast = onboardingStep === onboardingSteps.length - 1;

  const handleNext = () => {
    if (isLast) {
      setExiting(true);
      setTimeout(() => completeOnboarding(), 300);
    } else {
      setOnboardingStep(onboardingStep + 1);
    }
  };

  const handleSkip = () => {
    setExiting(true);
    setTimeout(() => completeOnboarding(), 300);
  };

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 backdrop-blur-md"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="w-full max-w-[420px] bg-background rounded-t-3xl overflow-hidden relative"
          >
            {/* Skip button */}
            <button
              onClick={handleSkip}
              className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-muted/80 backdrop-blur-sm text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              رد کردن
            </button>

            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-muted">
              <motion.div
                className="h-full"
                style={{ background: `linear-gradient(90deg, ${step.color}, ${step.color}dd)` }}
                initial={{ width: 0 }}
                animate={{ width: `${((onboardingStep + 1) / onboardingSteps.length) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>

            {/* Step indicator */}
            <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-muted/80 backdrop-blur-sm text-[10px] font-bold tabular-nums">
              {fa(onboardingStep + 1)} / {fa(onboardingSteps.length)}
            </div>

            <div className="p-6 pt-16">
              {/* Animated icon */}
              <div className="flex justify-center mb-6">
                <motion.div
                  key={step.id}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 12, stiffness: 200 }}
                  className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}dd)` }}
                >
                  {step.icon}
                </motion.div>
              </div>

              {/* Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center mb-6"
                >
                  <h2 className="font-bold text-xl mb-3" style={{ color: step.color }}>
                    {step.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-2">
                    {step.highlights.map((highlight, idx) => (
                      <motion.div
                        key={highlight}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + idx * 0.1 }}
                        className="flex items-center gap-2 p-2 rounded-xl bg-muted/50"
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                          style={{ background: `${step.color}20` }}
                        >
                          <Check className="w-3 h-3" style={{ color: step.color }} />
                        </div>
                        <span className="text-xs font-medium text-right flex-1">{highlight}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Dots indicator */}
              <div className="flex items-center justify-center gap-1.5 mb-6">
                {onboardingSteps.map((s, idx) => (
                  <button
                    key={s.id}
                    onClick={() => setOnboardingStep(idx)}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      idx === onboardingStep ? "w-6" : "w-1.5 bg-muted"
                    )}
                    style={idx === onboardingStep ? { background: step.color } : {}}
                  />
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {onboardingStep > 0 && (
                  <button
                    onClick={() => setOnboardingStep(onboardingStep - 1)}
                    className="flex items-center gap-1 px-4 h-12 rounded-2xl bg-muted text-foreground font-bold text-sm"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    قبلی
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 h-12 rounded-2xl text-white font-bold text-sm shadow-lg"
                  style={{ background: `linear-gradient(90deg, ${step.color}, ${step.color}dd)` }}
                >
                  {isLast ? (
                    <>
                      <Sparkles className="w-4 h-4" />
                      شروع استفاده
                    </>
                  ) : (
                    "بعدی"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
