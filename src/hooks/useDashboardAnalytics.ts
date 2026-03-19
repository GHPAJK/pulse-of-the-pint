import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { distributionPalette } from "@/lib/theme";

// ─── Types matching chart component props ───

interface DistributionItem {
  label: string;
  value: number;
  color: string;
}

interface BarItem {
  label: string;
  value: number;
}

interface Quote {
  question: string;
  answer: string;
}

export interface DashboardAnalytics {
  overallExperience: { score: number; distribution: DistributionItem[] };
  returnLikelihood: { summary: number; data: DistributionItem[] };
  whatTheyHad: BarItem[];
  beerStyles: BarItem[];
  visitDrivers: BarItem[];
  serviceRating: { score: number; distribution: DistributionItem[] };
  newVsReturning: DistributionItem[];
  valueMost: BarItem[];
  vibeDescription: DistributionItem[];
  spendPerVisit: BarItem[];
  socialFollow: DistributionItem[];
  visitMore: BarItem[];
  funQuotes: Quote[];
}

interface AnalyticsResult {
  data: DashboardAnalytics | null;
  loading: boolean;
  error: string | null;
}

// ─── Label maps — variable values → display labels ───

const SCALE_LABELS: Record<string, string> = {
  "5": "Excellent",
  "4": "Very Good",
  "3": "Good",
  "2": "Fair",
  "1": "Poor",
};

const P1_LABELS: Record<string, string> = {
  yes: "First visit",
  no: "Returning",
};

const P2_LABELS: Record<string, string> = {
  beer_tap: "Draft beer (on tap)",
  beer_togo: "Cans / Bottles (to go)",
  flight: "Flight / Sampler",
  cider: "Cider",
  seltzer: "Seltzer",
  non_alc: "Non-alcoholic",
  food: "Food",
  merch: "Merchandise",
  nothing: "Nothing yet",
  decline: "Rather not say",
};

const P3_LABELS: Record<string, string> = {
  regular: "My go-to spot",
  first_time: "First time here",
  specific_beer: "Specific beer or release",
  social: "Friends / family",
  event: "Event / live music",
  recommendation: "Recommendation",
  social_media: "Social media",
  passerby: "Just passing by",
  other: "Other",
};

const P7_LABELS: Record<string, string> = {
  definitely: "Definitely will",
  probably: "Probably will",
  maybe: "Might or might not",
  probably_not: "Probably won't",
  definitely_not: "Definitely won't",
};

const B1A_LABELS: Record<string, string> = {
  ipa: "IPA / Hazy / DIPA",
  pale_ale: "Pale Ale",
  lager: "Lager / Pilsner",
  stout: "Stout / Porter",
  wheat: "Wheat / Hefe",
  sour: "Sour / Wild Ale",
  amber: "Amber / Red Ale",
  brown: "Brown Ale",
  belgian: "Belgian / Farmhouse",
  seasonal: "Seasonal",
  non_alc: "Non-alcoholic",
  anything: "I'll try anything",
};

const B2B_LABELS: Record<string, string> = {
  under_20: "Under $20",
  "20_40": "$20 - $40",
  "41_60": "$41 - $60",
  "61_80": "$61 - $80",
  "81_100": "$81 - $100",
  over_100: "Over $100",
  decline: "Prefer not to say",
};

const B3A_LABELS: Record<string, string> = {
  beer_quality: "Quality of the beer",
  atmosphere: "Atmosphere / Vibe",
  outdoor: "Outdoor space / Patio",
  food: "Food options",
  music: "Live music / Events",
  dogs: "Dog-friendly",
  kids: "Kid-friendly",
  location: "Location / Convenience",
  rotating_taps: "Unique / Rotating taps",
  local: "Supporting local",
};

const B3B_LABELS: Record<string, string> = {
  chill: "Chill and relaxed",
  lively: "Lively and social",
  family: "Family-friendly",
  upscale: "Upscale / Classy",
  divey: "Dive-y / No frills",
  crowded: "Packed / Too crowded",
};

const B4A_LABELS: Record<string, string> = {
  yes: "Yes",
  no_would: "No, but I would",
  no: "Not my thing",
};

const B4B_LABELS: Record<string, string> = {
  variety: "More beer variety",
  food: "Better food options",
  events: "More events / Music",
  loyalty: "Loyalty / Rewards",
  happy_hour: "Happy hour deals",
  trivia: "Trivia nights",
  hours: "Better hours",
  already_loyal: "Already come a lot",
};

const FUN_Q_TEXT: Record<string, string> = {
  C1: "If this brewery made a beer just for you, what would it be called?",
  C2: "What song should be playing in a brewery right now?",
  C3: "Perfect food pairing with your go-to beer?",
  C4: "Describe your ideal brewery experience in 3 words.",
};

// ─── Helpers ───

function countToPercent(counts: Record<string, number>): Record<string, number> {
  const total = Object.values(counts).reduce((s, v) => s + v, 0);
  if (total === 0) return {};
  const result: Record<string, number> = {};
  for (const [k, v] of Object.entries(counts)) {
    result[k] = Math.round((v / total) * 100);
  }
  return result;
}

function scaleAverage(counts: Record<string, number>): number {
  let total = 0;
  let sum = 0;
  for (const [val, count] of Object.entries(counts)) {
    const num = parseFloat(val);
    if (!isNaN(num)) {
      total += count;
      sum += num * count;
    }
  }
  return total > 0 ? Math.round((sum / total) * 10) / 10 : 0;
}

function buildDistribution(
  counts: Record<string, number>,
  labels: Record<string, string>,
  palette: string[],
  orderedKeys?: string[]
): DistributionItem[] {
  const pcts = countToPercent(counts);
  const keys = orderedKeys || Object.keys(labels);
  return keys
    .filter((k) => labels[k])
    .map((k, i) => ({
      label: labels[k],
      value: pcts[k] || 0,
      color: palette[i % palette.length],
    }));
}

function buildBarData(
  counts: Record<string, number>,
  labels: Record<string, string>
): BarItem[] {
  return Object.entries(counts)
    .filter(([k]) => labels[k])
    .map(([k, v]) => ({ label: labels[k], value: v }))
    .sort((a, b) => b.value - a.value);
}

// ─── Main Hook ───

export function useDashboardAnalytics(
  locationId: string | undefined,
  primaryColor: string = "#D4AF37",
  secondaryColor: string = "#2C2C2C"
): AnalyticsResult {
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!locationId) {
      setLoading(false);
      return;
    }

    async function fetchAnalytics() {
      try {
        const palette = distributionPalette(primaryColor);

        // Fetch all single-select responses grouped by variable
        const { data: singleRows, error: sErr } = await supabase
          .from("survey_responses")
          .select("variable_name, response_value")
          .eq("location_id", locationId!)
          .not("response_value", "is", null);

        if (sErr) throw sErr;

        // Fetch all multi-select responses
        const { data: multiRows, error: mErr } = await supabase
          .from("survey_responses")
          .select("variable_name, response_values")
          .eq("location_id", locationId!)
          .not("response_values", "is", null);

        if (mErr) throw mErr;

        // Fetch open-end responses for fun quotes
        const { data: openRows, error: oErr } = await supabase
          .from("survey_responses")
          .select("variable_name, response_text")
          .eq("location_id", locationId!)
          .in("variable_name", ["C1", "C2", "C3", "C4"])
          .not("response_text", "is", null)
          .order("created_at", { ascending: false })
          .limit(20);

        if (oErr) throw oErr;

        // ─── Aggregate single-select responses by variable ───
        const singles: Record<string, Record<string, number>> = {};
        for (const row of singleRows || []) {
          const v = row.variable_name;
          const val = row.response_value;
          if (!singles[v]) singles[v] = {};
          singles[v][val] = (singles[v][val] || 0) + 1;
        }

        // ─── Aggregate multi-select responses by variable ───
        const multis: Record<string, Record<string, number>> = {};
        for (const row of multiRows || []) {
          const v = row.variable_name;
          const vals: string[] = row.response_values || [];
          if (!multis[v]) multis[v] = {};
          for (const val of vals) {
            multis[v][val] = (multis[v][val] || 0) + 1;
          }
        }

        // ─── Build chart data ───

        // P4: Overall experience (smiley scale 1-5)
        const p4 = singles["P4"] || {};
        const overallExperience = {
          score: scaleAverage(p4),
          distribution: buildDistribution(p4, SCALE_LABELS, palette, ["5", "4", "3", "2", "1"]),
        };

        // P7: Return likelihood
        const p7 = singles["P7"] || {};
        const p7pcts = countToPercent(p7);
        const returnSummary = (p7pcts["definitely"] || 0) + (p7pcts["probably"] || 0);
        const returnLikelihood = {
          summary: returnSummary,
          data: buildDistribution(
            p7,
            P7_LABELS,
            palette,
            ["definitely", "probably", "maybe", "probably_not", "definitely_not"]
          ),
        };

        // P2: What they had (multi-select)
        const p2 = multis["P2"] || {};
        const whatTheyHad = buildBarData(p2, P2_LABELS);

        // B1A: Beer styles (multi-select)
        const b1a = multis["B1A"] || {};
        const beerStyles = buildBarData(b1a, B1A_LABELS);

        // P3: Visit drivers (single-select)
        const p3 = singles["P3"] || {};
        const visitDrivers = buildBarData(p3, P3_LABELS);

        // P6: Service rating (smiley scale 1-5)
        const p6 = singles["P6"] || {};
        const serviceRating = {
          score: scaleAverage(p6),
          distribution: buildDistribution(p6, SCALE_LABELS, palette, ["5", "4", "3", "2", "1"]),
        };

        // P1: New vs returning
        const p1 = singles["P1"] || {};
        const p1pcts = countToPercent(p1);
        const newVsReturning: DistributionItem[] = [
          { label: "Returning", value: p1pcts["no"] || 0, color: palette[0] },
          { label: "First visit", value: p1pcts["yes"] || 0, color: secondaryColor },
        ];

        // B3A: Value most (multi-select limited)
        const b3a = multis["B3A"] || {};
        const valueMost = buildBarData(b3a, B3A_LABELS);

        // B3B: Vibe description (single-select)
        const b3b = singles["B3B"] || {};
        const vibeDescription = buildDistribution(
          b3b,
          B3B_LABELS,
          palette,
          ["chill", "lively", "family", "upscale", "divey", "crowded"]
        );

        // B2B: Spend per visit (single-select)
        const b2b = singles["B2B"] || {};
        const spendPerVisit = buildBarData(b2b, B2B_LABELS);
        // Re-order spend by amount rather than count
        const spendOrder = ["under_20", "20_40", "41_60", "61_80", "81_100", "over_100"];
        const spendPcts = countToPercent(b2b);
        const spendOrdered: BarItem[] = spendOrder
          .filter((k) => B2B_LABELS[k])
          .map((k) => ({ label: B2B_LABELS[k], value: spendPcts[k] || 0 }));

        // B4A: Social follow (single-select)
        const b4a = singles["B4A"] || {};
        const socialFollow = buildDistribution(
          b4a,
          B4A_LABELS,
          [palette[0], palette[1], secondaryColor],
          ["yes", "no_would", "no"]
        );

        // B4B: Visit more (multi-select)
        const b4b = multis["B4B"] || {};
        const visitMore = buildBarData(b4b, B4B_LABELS);

        // Fun quotes
        const funQuotes: Quote[] = (openRows || []).map((row) => ({
          question: FUN_Q_TEXT[row.variable_name] || row.variable_name,
          answer: row.response_text,
        }));

        setData({
          overallExperience,
          returnLikelihood,
          whatTheyHad,
          beerStyles,
          visitDrivers,
          serviceRating,
          newVsReturning,
          valueMost,
          vibeDescription,
          spendPerVisit: spendOrdered.length > 0 ? spendOrdered : spendPerVisit,
          socialFollow,
          visitMore,
          funQuotes,
        });
      } catch (err: any) {
        console.error("Dashboard analytics error:", err);
        setError(err.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [locationId, primaryColor, secondaryColor]);

  return { data, loading, error };
}
