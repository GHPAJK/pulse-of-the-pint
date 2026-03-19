import { useLocation } from "@/hooks/useLocation";
import { useSurvey } from "@/hooks/useSurvey";
import WelcomeScreen from "@/components/WelcomeScreen";
import AgeGate, { TerminatedScreen } from "@/components/AgeGate";
import SurveyShell from "@/components/SurveyShell";
import ThankYouScreen from "@/components/ThankYouScreen";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Survey() {
  const { location, loading, error } = useLocation();
  const survey = useSurvey(location);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh]">
        <Loader2
          size={40}
          className="animate-spin"
          style={{ color: "var(--primary)" }}
        />
      </div>
    );
  }

  // No location found (should not happen with fallback, but safety)
  if (!location) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Location Not Found</h2>
        <p className="text-gray-400">
          {error || "Please scan the QR code at your location to start the survey."}
        </p>
      </div>
    );
  }

  // Phase routing
  switch (survey.phase) {
    case "welcome":
      return (
        <WelcomeScreen location={location} onStart={survey.startSurvey} />
      );

    case "terminated":
      return <TerminatedScreen />;

    case "submitting":
      return (
        <div className="flex flex-col items-center justify-center min-h-[100dvh] gap-4">
          <Loader2
            size={40}
            className="animate-spin"
            style={{ color: "var(--primary)" }}
          />
          <p className="text-gray-400">Submitting your responses...</p>
        </div>
      );

    case "thank_you":
      return <ThankYouScreen location={location} />;

    case "survey":
    default:
      if (!survey.currentQuestion) {
        return null;
      }

      // Handle age gate as first question in the survey flow
      if (survey.currentQuestion.section === "age_gate") {
        return (
          <AgeGate
            onConfirm={(isOfAge) => {
              survey.setAnswer("AG1", isOfAge ? "yes" : "no");
              if (!isOfAge) {
                survey.setPhase("terminated");
              } else {
                survey.handleNext();
              }
            }}
          />
        );
      }

      return (
        <>
          {/* Honeypot: invisible to humans, bots auto-fill it */}
          <input
            type="text"
            name="website_url"
            value={survey.honeypot}
            onChange={(e) => survey.setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }}
          />
          <SurveyShell
            location={location}
            currentQuestion={survey.currentQuestion}
            currentIndex={survey.currentIndex}
            progressCurrent={survey.progressCurrent}
            progressTotal={survey.progressTotal}
            answers={survey.answers}
            isLastQuestion={survey.isLastQuestion}
            canGoNext={survey.canGoNext()}
            onAnswer={survey.setAnswer}
            onNext={survey.handleNext}
            onBack={survey.handleBack}
          />
        </>
      );
  }
}
