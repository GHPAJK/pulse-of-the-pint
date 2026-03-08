import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { SurveyQuestion, PiiField } from "@/data/questions";
import { interpolateQuestion } from "@/data/questions";

interface QuestionCardProps {
  question: SurveyQuestion;
  answer: string | string[] | undefined;
  onAnswer: (variable: string, value: string | string[]) => void;
  locationName: string;
}

const SMILEY_EMOJIS = ["", "", "", "", ""];
const SMILEY_LABELS_MAP: Record<string, string> = {
  "5": "Excellent",
  "4": "Very Good",
  "3": "Good",
  "2": "Fair",
  "1": "Poor",
};

export default function QuestionCard({
  question,
  answer,
  onAnswer,
  locationName,
}: QuestionCardProps) {
  const displayText = question.usesLocationName
    ? interpolateQuestion(question.text, locationName)
    : question.text;

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-2 leading-tight">
        {displayText}
      </h2>
      {question.subtext && (
        <p className="text-sm text-muted-foreground mb-4">
          {question.subtext}
        </p>
      )}

      <div className="mt-6">
        {question.type === "single_select" && (
          <SingleSelect
            question={question}
            answer={answer as string}
            onAnswer={onAnswer}
          />
        )}
        {question.type === "multi_select" && (
          <MultiSelect
            question={question}
            answer={(answer as string[]) || []}
            onAnswer={onAnswer}
          />
        )}
        {question.type === "multi_select_limited" && (
          <MultiSelect
            question={question}
            answer={(answer as string[]) || []}
            onAnswer={onAnswer}
            maxSelect={question.maxSelect}
          />
        )}
        {question.type === "smiley_scale" && (
          <SmileyScale
            question={question}
            answer={answer as string}
            onAnswer={onAnswer}
          />
        )}
        {question.type === "open_end" && (
          <OpenEnd
            question={question}
            answer={(answer as string) || ""}
            onAnswer={onAnswer}
          />
        )}
        {question.type === "age_gate" && (
          <SingleSelect
            question={question}
            answer={answer as string}
            onAnswer={onAnswer}
          />
        )}
        {question.type === "pii" && (
          <PiiForm
            question={question}
            answers={answer as unknown as Record<string, string>}
            onAnswer={onAnswer}
          />
        )}
      </div>
    </div>
  );
}

// ─── Single Select ───

function SingleSelect({
  question,
  answer,
  onAnswer,
}: {
  question: SurveyQuestion;
  answer: string | undefined;
  onAnswer: (variable: string, value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {question.options?.map((option) => {
        const isSelected = answer === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onAnswer(question.variable, option.value)}
            className={`
              w-full text-left px-5 py-4 rounded-xl border-2 transition-all
              text-base font-medium active:scale-[0.98]
              ${
                isSelected
                  ? "border-[var(--primary)] bg-[var(--primary)]/10"
                  : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/50"
              }
            `}
          >
            <div className="flex items-center justify-between">
              <span>{option.label}</span>
              {isSelected && (
                <Check size={20} style={{ color: "var(--primary)" }} />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Multi Select ───

function MultiSelect({
  question,
  answer,
  onAnswer,
  maxSelect,
}: {
  question: SurveyQuestion;
  answer: string[];
  onAnswer: (variable: string, value: string[]) => void;
  maxSelect?: number;
}) {
  const toggleOption = (value: string) => {
    let newAnswer: string[];
    if (answer.includes(value)) {
      newAnswer = answer.filter((v) => v !== value);
    } else {
      if (maxSelect && answer.length >= maxSelect) return;
      newAnswer = [...answer, value];
    }
    onAnswer(question.variable, newAnswer);
  };

  return (
    <div className="flex flex-col gap-3">
      {question.options?.map((option) => {
        const isSelected = answer.includes(option.value);
        const isDisabled =
          maxSelect !== undefined &&
          answer.length >= maxSelect &&
          !isSelected;

        return (
          <button
            key={option.value}
            onClick={() => toggleOption(option.value)}
            disabled={isDisabled}
            className={`
              w-full text-left px-5 py-4 rounded-xl border-2 transition-all
              text-base font-medium active:scale-[0.98]
              ${
                isSelected
                  ? "border-[var(--primary)] bg-[var(--primary)]/10"
                  : isDisabled
                  ? "border-[var(--border)] bg-[var(--surface)] opacity-40 cursor-not-allowed"
                  : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/50"
              }
            `}
          >
            <div className="flex items-center justify-between">
              <span>{option.label}</span>
              {isSelected && (
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: "var(--primary)" }}
                >
                  <Check
                    size={16}
                    style={{ color: "var(--primary-foreground)" }}
                  />
                </div>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Smiley Scale ───

function SmileyScale({
  question,
  answer,
  onAnswer,
}: {
  question: SurveyQuestion;
  answer: string | undefined;
  onAnswer: (variable: string, value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      {question.options?.map((option, idx) => {
        const isSelected = answer === option.value;
        const emoji = SMILEY_EMOJIS[idx] || "";

        return (
          <button
            key={option.value}
            onClick={() => onAnswer(question.variable, option.value)}
            className={`
              w-full text-left px-5 py-4 rounded-xl border-2 transition-all
              text-base font-medium active:scale-[0.98]
              ${
                isSelected
                  ? "border-[var(--primary)] bg-[var(--primary)]/10"
                  : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--primary)]/50"
              }
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{emoji}</span>
              <span>{option.label}</span>
              {isSelected && (
                <Check
                  size={20}
                  className="ml-auto"
                  style={{ color: "var(--primary)" }}
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Open End ───

function OpenEnd({
  question,
  answer,
  onAnswer,
}: {
  question: SurveyQuestion;
  answer: string;
  onAnswer: (variable: string, value: string) => void;
}) {
  return (
    <textarea
      value={answer}
      onChange={(e) => onAnswer(question.variable, e.target.value)}
      placeholder={question.placeholder || "Type your answer..."}
      rows={3}
      className="w-full px-5 py-4 rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] text-white
        text-base placeholder:text-gray-500 focus:outline-none focus:border-[var(--primary)]
        transition-colors resize-none"
    />
  );
}

// ─── PII Form ───

function PiiForm({
  question,
  answers,
  onAnswer,
}: {
  question: SurveyQuestion;
  answers: Record<string, string> | undefined;
  onAnswer: (variable: string, value: string | string[]) => void;
}) {
  const [piiValues, setPiiValues] = useState<Record<string, string>>(
    (answers as Record<string, string>) || {}
  );
  const [checkboxes, setCheckboxes] = useState<Record<string, boolean>>({
    privacy: false,
    optin: false,
    sweepstakes: false,
  });

  const handleFieldChange = (variable: string, value: string) => {
    const updated = { ...piiValues, [variable]: value };
    setPiiValues(updated);
    // Store all PII as a JSON string in the PII variable
    onAnswer(
      question.variable,
      JSON.stringify({
        ...updated,
        checkboxes,
      })
    );
  };

  const handleCheckbox = (key: string) => {
    const updated = { ...checkboxes, [key]: !checkboxes[key] };
    setCheckboxes(updated);
    onAnswer(
      question.variable,
      JSON.stringify({
        ...piiValues,
        checkboxes: updated,
      })
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {question.piiFields?.map((field: PiiField) => (
        <div key={field.variable}>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            {field.label}
            {field.required && (
              <span className="text-red-400 ml-1">*</span>
            )}
          </label>
          <input
            type={field.type === "zip" ? "text" : field.type}
            inputMode={
              field.type === "zip"
                ? "numeric"
                : field.type === "tel"
                ? "tel"
                : field.type === "email"
                ? "email"
                : "text"
            }
            pattern={field.type === "zip" ? "[0-9]{5}" : undefined}
            maxLength={field.type === "zip" ? 5 : undefined}
            value={piiValues[field.variable] || ""}
            onChange={(e) =>
              handleFieldChange(field.variable, e.target.value)
            }
            placeholder={field.placeholder}
            className="w-full px-5 py-4 rounded-xl border-2 border-[var(--border)] bg-[var(--surface)] text-white
              text-base placeholder:text-gray-500 focus:outline-none focus:border-[var(--primary)]
              transition-colors"
          />
        </div>
      ))}

      <div className="mt-2 flex flex-col gap-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={checkboxes.privacy}
            onChange={() => handleCheckbox("privacy")}
            className="mt-1 w-5 h-5 rounded accent-[var(--primary)]"
          />
          <span className="text-sm text-gray-300">
            I agree to the Privacy Policy and Terms
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={checkboxes.optin}
            onChange={() => handleCheckbox("optin")}
            className="mt-1 w-5 h-5 rounded accent-[var(--primary)]"
          />
          <span className="text-sm text-gray-300">
            Opt-in to future surveys and offers
          </span>
        </label>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={checkboxes.sweepstakes}
            onChange={() => handleCheckbox("sweepstakes")}
            className="mt-1 w-5 h-5 rounded accent-[var(--primary)]"
          />
          <span className="text-sm text-gray-300">
            Enter me in the monthly sweepstakes
          </span>
        </label>
      </div>
    </div>
  );
}
