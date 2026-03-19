import { useRef, useState, useCallback } from "react";
import { Download, RefreshCw } from "lucide-react";

interface Quote {
  question: string;
  answer: string;
}

interface Props {
  quotes: Quote[];
  locationName: string;
  accentColor?: string;
  logoUrl?: string;
}

const CARD_W = 1080;
const CARD_H = 1350;

export default function QuoteCardGenerator({
  quotes,
  locationName,
  accentColor = "#D4AF37",
  logoUrl,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [generating, setGenerating] = useState(false);

  const quote = quotes[currentIndex];

  const generateCard = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !quote) return;

    setGenerating(true);
    const ctx = canvas.getContext("2d")!;
    canvas.width = CARD_W;
    canvas.height = CARD_H;

    // Background
    ctx.fillStyle = "#2C2C2C";
    ctx.fillRect(0, 0, CARD_W, CARD_H);

    // Accent bar at top
    ctx.fillStyle = accentColor;
    ctx.fillRect(0, 0, CARD_W, 8);

    // Decorative quote mark
    ctx.font = "bold 200px Georgia";
    ctx.fillStyle = accentColor;
    ctx.globalAlpha = 0.15;
    ctx.fillText("\u201C", 60, 280);
    ctx.globalAlpha = 1;

    // Question (prompt)
    ctx.font = "600 28px Inter, Arial, sans-serif";
    ctx.fillStyle = "#9ca3af";
    wrapText(ctx, quote.question, 80, 380, CARD_W - 160, 36);

    // Answer (the quote)
    ctx.font = "bold 48px Inter, Arial, sans-serif";
    ctx.fillStyle = "#ffffff";
    const answerY = 500;
    wrapText(ctx, `"${quote.answer}"`, 80, answerY, CARD_W - 160, 62);

    // Accent line separator
    ctx.fillStyle = accentColor;
    ctx.fillRect(80, CARD_H - 260, 120, 4);

    // Location name
    ctx.font = "bold 32px Inter, Arial, sans-serif";
    ctx.fillStyle = accentColor;
    ctx.fillText(locationName, 80, CARD_H - 210);

    // Attribution
    ctx.font = "400 22px Inter, Arial, sans-serif";
    ctx.fillStyle = "#6b7280";
    ctx.fillText("Real customer feedback", 80, CARD_H - 170);

    // Logo placeholder if no logo URL
    if (logoUrl) {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject();
          img.src = logoUrl;
        });
        ctx.drawImage(img, CARD_W - 160, CARD_H - 160, 80, 80);
      } catch {
        // Skip logo if it fails to load
      }
    }

    // Bottom bar
    ctx.fillStyle = accentColor;
    ctx.fillRect(0, CARD_H - 8, CARD_W, 8);

    setGenerating(false);
  }, [quote, locationName, accentColor, logoUrl]);

  const downloadCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${locationName.replace(/[^a-zA-Z0-9]/g, "_")}_quote_${currentIndex + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, "image/png");
  }, [locationName, currentIndex]);

  const nextQuote = () => {
    const next = (currentIndex + 1) % quotes.length;
    setCurrentIndex(next);
  };

  if (!quotes || quotes.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Quote Card Generator
        </h3>
        <span className="text-xs text-gray-400">
          {currentIndex + 1} of {quotes.length}
        </span>
      </div>

      {/* Preview */}
      <div className="bg-gray-100 rounded-lg p-4 mb-4">
        <div
          className="rounded-lg overflow-hidden mx-auto shadow-lg"
          style={{ maxWidth: 360, aspectRatio: `${CARD_W}/${CARD_H}` }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ display: "block" }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => { generateCard(); }}
          disabled={generating}
          className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg text-white transition-colors"
          style={{ backgroundColor: accentColor }}
        >
          {generating ? "Generating..." : "Generate Card"}
        </button>
        <button
          onClick={downloadCard}
          className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Download className="w-4 h-4" />
        </button>
        {quotes.length > 1 && (
          <button
            onClick={() => { nextQuote(); setTimeout(generateCard, 50); }}
            className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            title="Next quote"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-2">
        1080 x 1350px — optimized for Instagram feed posts
      </p>
    </div>
  );
}

// Canvas text wrapping helper
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (const word of words) {
    const testLine = line + (line ? " " : "") + word;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line) {
      ctx.fillText(line, x, currentY);
      line = word;
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}
