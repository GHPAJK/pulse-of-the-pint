import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, Beer } from "lucide-react";
import type { LocationData } from "@/hooks/useLocation";
import type { SurveyQuestion } from "@/data/questions";
import ProgressBar from "@/components/ProgressBar";
import QuestionCard from "@/components/QuestionCard";
import LocationLogo from "@/components/LocationLogo";

interface SurveyShellProps {
  location: LocationData;
  currentQuestion: SurveyQuestion;
  currentIndex: number;
  progressCurrent: number;
  progressTotal: number;
  answers: Record<string, string | string[]>;
  isLastQuestion: boolean;
  canGoNext: boolean;
  onAnswer: (variable: string, value: string | string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SurveyShell({
  location,
  currentQuestion,
  currentIndex,
  progressCurrent,
  progressTotal,
  answers,
  isLastQuestion,
  canGoNext,
  onAnswer,
  onNext,
  onBack,
}: SurveyShellProps) {
  // Apply dynamic theme
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", location.primary_color);
    root.style.setProperty("--secondary", location.secondary_color);
    root.style.setProperty("--accent", location.accent_color);

    // Compute a contrasting foreground for primary
    const primaryFg = isLightColor(location.primary_color)
      ? "#1a1a1a"
      : "#ffffff";
    root.style.setProperty("--primary-foreground", primaryFg);

    return () => {
      root.style.removeProperty("--primary");
      root.style.removeProperty("--secondary");
      root.style.removeProperty("--accent");
      root.style.removeProperty("--primary-foreground");
    };
  }, [location]);

  // Skip age gate from progress display
  const showProgress = currentQuestion.section !== "age_gate";

  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* Header */}
      <header className="flex items-center justify-center gap-2 px-4 pt-4 pb-1">
        <LocationLogo
          logoUrl={location.logo_url ?? undefined}
          locationName={location.name}
          primaryColor={location.primary_color}
          secondaryColor={location.secondary_color}
          maxHeight={32}
        />
        <span className="text-sm font-medium text-gray-400">
          {location.name}
        </span>
      </header>

      {/* Progress */}
      {showProgress && (
        <ProgressBar current={progressCurrent} total={progressTotal} />
      )}

      {/* Question Area */}
      <div className="flex-1 flex items-center justify-center py-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.variable}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full"
          >
            <QuestionCard
              question={currentQuestion}
              answer={answers[currentQuestion.variable]}
              onAnswer={onAnswer}
              locationName={location.name}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="px-4 pb-6 pt-2">
        <div className="flex gap-3 max-w-lg mx-auto">
          {currentIndex > 0 && (
            <button
              onClick={onBack}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl
                bg-[var(--surface)] text-gray-300 font-medium text-base
                transition-all active:scale-95 hover:bg-[var(--muted)]"
            >
              <ArrowLeft size={18} />
              Back
            </button>
          )}

          <button
            onClick={onNext}
            disabled={!canGoNext}
            className={`
              flex-1 flex items-center justify-center gap-2 py-4 rounded-xl
              text-lg font-semibold transition-all active:scale-95
              ${
                canGoNext
                  ? "hover:brightness-110"
                  : "opacity-40 cursor-not-allowed"
              }
            `}
            style={{
              backgroundColor: canGoNext
                ? "var(--primary)"
                : "var(--muted)",
              color: canGoNext
                ? "var(--primary-foreground)"
                : "var(--muted-foreground)",
            }}
          >
            {isLastQuestion ? "Submit" : "Next"}
            {!isLastQuestion && <ArrowRight size={20} />}
          </button>
        </div>

        {/* Skip hint for optional questions */}
        {(currentQuestion.section === "fun" ||
          currentQuestion.type === "pii") && (
          <p className="text-center text-xs text-gray-500 mt-3">
            {currentQuestion.type === "pii"
              ? "Optional - you can skip this step"
              : "Optional - tap Next to skip"}
          </p>
        )}
      </nav>
    </div>
  );
}

/**
 * Quick luminance check to determine if a hex color is "light."
 */
function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
