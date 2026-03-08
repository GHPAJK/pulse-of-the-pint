// ============================================================
// Brand theme — single source of truth for all colors
// Marketing site uses BRAND colors
// Dashboard uses location colors from Supabase (via useLocation)
// ============================================================

export const brand = {
  // Pulse of the Pint brand palette
  primary: "#D4AF37",      // Gold
  primaryLight: "#E8C94A", // Light gold
  primaryMuted: "#F0D878", // Muted gold
  secondary: "#2C2C2C",    // Dark charcoal
  secondaryLight: "#3D3D3D",
  accent: "#8B7020",       // Dark gold
  background: "#FAF3E3",   // Warm cream
  surface: "#FFFFFF",
  text: "#1A1A1A",
  textMuted: "#6B7280",
  textLight: "#9CA3AF",
} as const;

// Chart color ramps — derived from a base color
// Used by all chart components
export function chartColors(primary: string, secondary?: string) {
  return {
    primary,
    light: secondary || adjustOpacity(primary, 0.6),
    muted: adjustOpacity(primary, 0.35),
    dark: darken(primary, 0.3),
    darkest: darken(primary, 0.5),
  };
}

// Generate a 5-step distribution palette from a base color
export function distributionPalette(base: string): string[] {
  return [
    base,
    adjustOpacity(base, 0.8),
    adjustOpacity(base, 0.55),
    darken(base, 0.2),
    darken(base, 0.4),
  ];
}

// Helpers
function adjustOpacity(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  // Blend with white at the given opacity
  const blend = (c: number) => Math.round(c * opacity + 255 * (1 - opacity));
  return `#${blend(r).toString(16).padStart(2, "0")}${blend(g).toString(16).padStart(2, "0")}${blend(b).toString(16).padStart(2, "0")}`;
}

function darken(hex: string, amount: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const d = (c: number) => Math.round(c * (1 - amount));
  return `#${d(r).toString(16).padStart(2, "0")}${d(g).toString(16).padStart(2, "0")}${d(b).toString(16).padStart(2, "0")}`;
}
