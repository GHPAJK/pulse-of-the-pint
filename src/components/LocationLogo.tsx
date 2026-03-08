import { useState, useCallback } from "react";

interface LocationLogoProps {
  logoUrl?: string;
  locationName: string;
  primaryColor?: string;
  secondaryColor?: string;
  maxHeight?: number;
}

/**
 * LocationLogo — resilient logo component with fallback.
 *
 * - Renders the logo image if it loads successfully.
 * - Falls back to a styled text block using the location's brand colors.
 * - Adds a contrasting background pill for logos with possible transparency.
 * - Constrains dimensions and applies a subtle fade-in on load.
 */
export default function LocationLogo({
  logoUrl,
  locationName,
  primaryColor = "#D4AF37",
  secondaryColor = "#B8860B",
  maxHeight = 60,
}: LocationLogoProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  const handleLoad = useCallback(() => setImgLoaded(true), []);
  const handleError = useCallback(() => setImgFailed(true), []);

  const hasValidUrl = logoUrl && logoUrl.trim().length > 0;
  const showFallback = !hasValidUrl || imgFailed;

  // Determine if primary color is light or dark for contrast decisions
  const primaryIsDark = !isLightColor(primaryColor);

  // Background pill for transparent PNGs — contrast against the primary
  const pillBg = primaryIsDark
    ? "rgba(255, 255, 255, 0.12)"
    : "rgba(0, 0, 0, 0.06)";

  if (showFallback) {
    return (
      <FallbackLogo
        locationName={locationName}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        maxHeight={maxHeight}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center"
      style={{
        maxHeight: `${maxHeight}px`,
        maxWidth: "80%",
      }}
    >
      <div
        className="flex items-center justify-center rounded-lg px-2 py-1"
        style={{ backgroundColor: pillBg }}
      >
        <img
          src={logoUrl}
          alt={locationName}
          onLoad={handleLoad}
          onError={handleError}
          className="object-contain rounded-md"
          style={{
            maxHeight: `${maxHeight}px`,
            maxWidth: "100%",
            opacity: imgLoaded ? 1 : 0,
            transition: "opacity 0.35s ease-in-out",
          }}
        />
      </div>
    </div>
  );
}

// --- Fallback: styled text block ---

function FallbackLogo({
  locationName,
  primaryColor,
  secondaryColor,
  maxHeight,
}: {
  locationName: string;
  primaryColor: string;
  secondaryColor: string;
  maxHeight: number;
}) {
  // Build initials from location name (up to 3 chars)
  const initials = locationName
    .split(/\s+/)
    .filter((w) => w.length > 0 && /^[A-Za-z0-9]/.test(w))
    .slice(0, 3)
    .map((w) => w[0].toUpperCase())
    .join("");

  const textColor = isLightColor(primaryColor) ? "#1a1a1a" : "#ffffff";

  return (
    <div
      className="flex items-center justify-center rounded-lg"
      style={{
        height: `${maxHeight}px`,
        minWidth: `${maxHeight}px`,
        maxWidth: "80%",
        padding: "0 12px",
        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
        color: textColor,
        fontWeight: 700,
        fontSize: `${Math.max(12, maxHeight * 0.35)}px`,
        letterSpacing: "0.05em",
        userSelect: "none",
        opacity: 1,
        animation: "fadeIn 0.35s ease-in-out",
      }}
      title={locationName}
    >
      {initials || locationName.charAt(0).toUpperCase()}
    </div>
  );
}

// --- Utility ---

function isLightColor(hex: string): boolean {
  const c = hex.replace("#", "");
  if (c.length < 6) return true;
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
