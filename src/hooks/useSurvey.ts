import { useState, useCallback, useMemo, useRef } from "react";
import {
  buildQuestionList,
  assignRandomBlocks,
  pickRandomFunQuestion,
  type SurveyQuestion,
} from "@/data/questions";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { LocationData } from "@/hooks/useLocation";

export type SurveyPhase =
  | "welcome"
  | "age_gate"
  | "survey"
  | "terminated"
  | "completed"
  | "submitting"
  | "thank_you";

export interface SurveyState {
  phase: SurveyPhase;
  currentIndex: number;
  answers: Record<string, string | string[]>;
  assignedBlocks: number[];
  funQuestionIndex: number;
  questions: SurveyQuestion[];
  totalVisible: number;
  currentVisibleIndex: number;
  startTime: number;
}

export function useSurvey(location: LocationData | null) {
  const [assignedBlocks] = useState(() => assignRandomBlocks());
  const [funQuestionIndex] = useState(() => pickRandomFunQuestion());
  const startTimeRef = useRef(Date.now());

  const allQuestions = useMemo(
    () => buildQuestionList(assignedBlocks, funQuestionIndex),
    [assignedBlocks, funQuestionIndex]
  );

  const [phase, setPhase] = useState<SurveyPhase>("welcome");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});

  // Get visible questions (filtering out conditional ones that shouldn't show)
  const visibleQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      if (!q.showIf) return true;
      const depValue = answers[q.showIf.variable];
      if (Array.isArray(q.showIf.value)) {
        return q.showIf.value.includes(depValue as string);
      }
      return depValue === q.showIf.value;
    });
  }, [allQuestions, answers]);

  const currentQuestion = visibleQuestions[currentIndex] || null;
  const totalQuestions = visibleQuestions.length;
  const isLastQuestion = currentIndex >= totalQuestions - 1;

  // Progress: skip age gate in the count for progress display
  const progressTotal = visibleQuestions.filter(
    (q) => q.section !== "age_gate"
  ).length;
  const progressCurrent = visibleQuestions
    .slice(0, currentIndex + 1)
    .filter((q) => q.section !== "age_gate").length;

  const setAnswer = useCallback(
    (variable: string, value: string | string[]) => {
      setAnswers((prev) => ({ ...prev, [variable]: value }));
    },
    []
  );

  const startSurvey = useCallback(() => {
    setPhase("survey");
    setCurrentIndex(0);
    startTimeRef.current = Date.now();
  }, []);

  const handleNext = useCallback(() => {
    if (!currentQuestion) return;

    const answer = answers[currentQuestion.variable];

    // Age gate termination
    if (currentQuestion.section === "age_gate" && answer === "no") {
      setPhase("terminated");
      return;
    }

    // Check for skipTo in single select answers
    if (
      currentQuestion.type === "single_select" ||
      currentQuestion.type === "age_gate"
    ) {
      const selectedOption = currentQuestion.options?.find(
        (o) => o.value === answer
      );
      if (selectedOption?.skipTo) {
        // Find the index of the target question in visible questions
        const targetIdx = visibleQuestions.findIndex(
          (q) => q.variable === selectedOption.skipTo
        );
        if (targetIdx !== -1) {
          setCurrentIndex(targetIdx);
          return;
        }
      }
    }

    // Check multi-select for skipTo (e.g., P2's "I'd rather not say")
    if (
      currentQuestion.type === "multi_select" &&
      Array.isArray(answer) &&
      answer.length === 1
    ) {
      const selectedOption = currentQuestion.options?.find(
        (o) => o.value === answer[0]
      );
      if (selectedOption?.skipTo) {
        const targetIdx = visibleQuestions.findIndex(
          (q) => q.variable === selectedOption.skipTo
        );
        if (targetIdx !== -1) {
          setCurrentIndex(targetIdx);
          return;
        }
      }
    }

    if (isLastQuestion) {
      submitSurvey();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentQuestion, answers, visibleQuestions, isLastQuestion]);

  const handleBack = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  const submitSurvey = useCallback(async () => {
    setPhase("submitting");

    const duration = Math.round((Date.now() - startTimeRef.current) / 1000);
    // Extract PII fields from answers
    const piiFirstName = answers["PII_FIRST_NAME"] as string || null;
    const piiEmail = answers["PII_EMAIL"] as string || null;
    const piiZip = answers["PII_ZIP"] as string || null;
    const piiPhone = answers["PII_PHONE"] as string || null;
    const piiTerms = answers["PII_TERMS"] as string === "yes";
    const piiMarketing = answers["PII_MARKETING"] as string === "yes";
    const piiResearch = answers["PII_RESEARCH"] as string === "yes";
    const piiSweepstakes = answers["PII_SWEEPSTAKES"] as string === "yes";

    const sessionData = {
      location_id: location?.id || "UNKNOWN",
      vertical: "brewery" as const,
      status: "completed" as const,
      started_at: new Date(startTimeRef.current).toISOString(),
      completed_at: new Date().toISOString(),
      duration_seconds: duration,
      blocks_assigned: assignedBlocks.map((b) => `block_${b}`),
      device_type: getDeviceType(),
      source: new URLSearchParams(window.location.search).get("src") || "qr",
      user_agent: navigator.userAgent,
      first_name: piiFirstName,
      email: piiEmail,
      zip: piiZip,
      phone: piiPhone,
      agreed_to_terms: piiTerms,
      opted_in_marketing: piiMarketing,
      opted_in_research: piiResearch,
      opted_in_sweepstakes: piiSweepstakes,
    };

    if (isSupabaseConfigured) {
      try {
        // Insert session
        const { data: session, error: sessionError } = await supabase
          .from("survey_sessions")
          .insert(sessionData)
          .select("id")
          .single();

        if (sessionError) {
          console.error("Session insert error:", sessionError);
        } else if (session) {
          // Insert responses (non-PII answers only)
          const responses = Object.entries(answers)
            .filter(([variable]) => !variable.startsWith("PII_"))
            .map(([variable, value]) => ({
              session_id: session.id,
              location_id: location?.id || "UNKNOWN",
              variable_name: variable,
              response_value: Array.isArray(value) ? null : value,
              response_values: Array.isArray(value) ? value : null,
              response_text:
                typeof value === "string" && value.length > 50 ? value : null,
            }));

          const { error: respError } = await supabase
            .from("session_responses")
            .insert(responses);

          if (respError) {
            console.error("Responses insert error:", respError);
          }
        }
      } catch (err) {
        console.error("Submit failed:", err);
      }
    } else {
      // Demo mode: log to console
      console.log("Survey session (demo):", sessionData);
      console.log("Survey answers (demo):", answers);
    }

    setPhase("thank_you");
  }, [answers, location, assignedBlocks, funQuestionIndex]);

  const canGoNext = useCallback((): boolean => {
    if (!currentQuestion) return false;

    // PII is always optional — can skip
    if (currentQuestion.type === "pii") return true;

    // Open end fun questions are optional
    if (currentQuestion.section === "fun") return true;

    const answer = answers[currentQuestion.variable];
    if (!answer) return false;
    if (Array.isArray(answer) && answer.length === 0) return false;

    return true;
  }, [currentQuestion, answers]);

  return {
    phase,
    currentIndex,
    currentQuestion,
    answers,
    assignedBlocks,
    totalQuestions,
    progressTotal,
    progressCurrent,
    isLastQuestion,
    setAnswer,
    startSurvey,
    handleNext,
    handleBack,
    canGoNext,
    setPhase,
  };
}

function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (
    /mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)
  )
    return "mobile";
  return "desktop";
}
