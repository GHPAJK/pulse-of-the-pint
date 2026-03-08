import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Download, QrCode, Copy, Check } from "lucide-react";

interface Props {
  url: string;
  breweryName: string;
  accentColor?: string;
}

const SIZES = [
  { label: "Small (2in)", px: 200 },
  { label: "Medium (3in)", px: 300 },
  { label: "Large (4in)", px: 400 },
] as const;

export default function QRGenerator({ url, breweryName, accentColor = "#D4AF37" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState<number>(300);
  const [copied, setCopied] = useState(false);
  const [includeLabel, setIncludeLabel] = useState(true);

  useEffect(() => {
    renderQR();
  }, [url, size, accentColor, includeLabel]);

  async function renderQR() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const padding = 24;
    const labelHeight = includeLabel ? 48 : 0;
    const totalSize = size + padding * 2 + labelHeight;

    canvas.width = totalSize;
    canvas.height = totalSize;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // White background with rounded corners
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, totalSize, totalSize);

    // Generate QR to a temp canvas
    const tempCanvas = document.createElement("canvas");
    await QRCode.toCanvas(tempCanvas, url, {
      width: size,
      margin: 0,
      color: { dark: "#1A1A1A", light: "#FFFFFF" },
      errorCorrectionLevel: "M",
    });

    // Draw QR code centered
    ctx.drawImage(tempCanvas, padding, padding);

    // Draw accent border
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 8, totalSize - 16, totalSize - 16);

    // Label below QR
    if (includeLabel) {
      ctx.fillStyle = "#1A1A1A";
      ctx.font = "bold 14px Inter, system-ui, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Scan to share your experience", totalSize / 2, size + padding + 28);

      ctx.fillStyle = "#6B7280";
      ctx.font = "11px Inter, system-ui, sans-serif";
      ctx.fillText(breweryName, totalSize / 2, size + padding + 44);
    }
  }

  function downloadPNG() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${breweryName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}-qr-code.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  async function downloadSVG() {
    const svgString = await QRCode.toString(url, {
      type: "svg",
      width: size,
      margin: 0,
      color: { dark: "#1A1A1A", light: "#FFFFFF" },
      errorCorrectionLevel: "M",
    });
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.download = `${breweryName.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()}-qr-code.svg`;
    link.href = URL.createObjectURL(blob);
    link.click();
    URL.revokeObjectURL(link.href);
  }

  function copyUrl() {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4 flex items-center gap-2">
        <QrCode className="w-4 h-4" />
        Your QR Code
      </h3>

      {/* QR Preview */}
      <div className="flex justify-center mb-6">
        <canvas
          ref={canvasRef}
          className="rounded-lg shadow-sm"
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </div>

      {/* Options */}
      <div className="space-y-4 mb-6">
        {/* Size selector */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-2">Size</label>
          <div className="flex gap-2">
            {SIZES.map((s) => (
              <button
                key={s.px}
                onClick={() => setSize(s.px)}
                className={`flex-1 py-2 text-xs font-medium rounded-lg border transition-all ${
                  size === s.px
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Label toggle */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeLabel}
            onChange={(e) => setIncludeLabel(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-600">
            Include "Scan to share your experience" label
          </span>
        </label>
      </div>

      {/* Download buttons */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={downloadPNG}
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm text-[#2C2C2C] transition-all hover:scale-105"
          style={{ backgroundColor: accentColor }}
        >
          <Download className="w-4 h-4" />
          PNG
        </button>
        <button
          onClick={downloadSVG}
          className="flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
        >
          <Download className="w-4 h-4" />
          SVG
        </button>
      </div>

      {/* Copy URL */}
      <button
        onClick={copyUrl}
        className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm text-gray-500 border border-gray-200 hover:bg-gray-50 transition-all"
      >
        {copied ? (
          <>
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-green-600">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-4 h-4" />
            Copy survey link
          </>
        )}
      </button>

      {/* Placement tips */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Placement Tips
        </h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>Table tents — catch customers during their visit</li>
          <li>Coasters — subtle and always in hand</li>
          <li>Bar counter cards — visible at checkout</li>
          <li>Receipts or menus — right at decision time</li>
        </ul>
      </div>
    </div>
  );
}
