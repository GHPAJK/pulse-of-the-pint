import { useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import SampleBadge from "./SampleBadge";

interface Quote {
  question: string;
  answer: string;
}

interface Props {
  title: string;
  quotes: Quote[];
  accentColor?: string;
}

const QuoteCarousel = ({ title, quotes, accentColor = "#D4AF37" }: Props) => {
  const [index, setIndex] = useState(0);
  const current = quotes[index];

  const next = () => setIndex((i) => (i + 1) % quotes.length);
  const prev = () => setIndex((i) => (i - 1 + quotes.length) % quotes.length);

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 p-6">
      <SampleBadge />
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        {title}
      </h3>
      <div
        className="rounded-lg p-6 min-h-[160px] flex flex-col justify-between"
        style={{ backgroundColor: `${accentColor}10` }}
      >
        <div>
          <div className="flex items-start gap-2 mb-3">
            <MessageCircle
              className="w-5 h-5 mt-0.5 flex-shrink-0"
              style={{ color: accentColor }}
            />
            <p className="text-sm text-gray-500 italic">{current.question}</p>
          </div>
          <p className="text-xl font-semibold text-gray-900 pl-7">
            &ldquo;{current.answer}&rdquo;
          </p>
        </div>
        <div className="flex items-center justify-between mt-4 pl-7">
          <span className="text-xs text-gray-400">
            — Survey Respondent
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="p-1 rounded-full hover:bg-gray-200 transition"
            >
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
            <span className="text-xs text-gray-400">
              {index + 1} / {quotes.length}
            </span>
            <button
              onClick={next}
              className="p-1 rounded-full hover:bg-gray-200 transition"
            >
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteCarousel;
