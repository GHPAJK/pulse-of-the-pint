import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Simplified US state paths — each state is a positioned rectangle on a grid
// This avoids needing a full GeoJSON/topojson dependency
// Grid positions: [col, row] on a 12x8 grid

const STATE_GRID: Record<string, [number, number]> = {
  AK: [0, 7], HI: [1, 7],
  WA: [1, 0], OR: [0, 1], CA: [0, 2], NV: [1, 2], ID: [1, 1],
  MT: [2, 0], WY: [2, 1], UT: [2, 2], CO: [2, 3], AZ: [1, 3], NM: [2, 4],
  ND: [3, 0], SD: [3, 1], NE: [3, 2], KS: [3, 3], OK: [3, 4], TX: [3, 5],
  MN: [4, 0], IA: [4, 1], MO: [4, 2], AR: [4, 3], LA: [4, 4],
  WI: [5, 0], IL: [5, 1], MS: [5, 3], MI: [6, 0],
  IN: [6, 1], KY: [6, 2], TN: [5, 2], AL: [6, 3],
  OH: [7, 1], WV: [7, 2], VA: [8, 2], NC: [8, 3],
  PA: [8, 1], NJ: [9, 2], MD: [9, 3], DE: [9, 2.5],
  NY: [8, 0], CT: [9, 1], RI: [10, 1], MA: [10, 0.5],
  VT: [9, 0], NH: [10, 0], ME: [11, 0],
  SC: [7, 3], GA: [7, 4], FL: [7, 5],
};

const STATE_NAMES: Record<string, string> = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi",
  MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire",
  NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina",
  ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
  RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee",
  TX: "Texas", UT: "Utah", VT: "Vermont", VA: "Virginia", WA: "Washington",
  WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

interface Props {
  accentColor?: string;
  title?: string;
  subtitle?: string;
  vertical?: string;
}

export default function USMap({
  accentColor = "#D4AF37",
  title = "Our Growing Network",
  subtitle,
  vertical,
}: Props) {
  const [stateCounts, setStateCounts] = useState<Record<string, number>>({});
  const [totalLocations, setTotalLocations] = useState(0);
  const [totalStates, setTotalStates] = useState(0);
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocations() {
      let query = supabase
        .from("locations")
        .select("state")
        .eq("survey_status", "active");

      if (vertical) {
        query = query.eq("vertical", vertical);
      }

      const { data } = await query;

      if (data) {
        const counts: Record<string, number> = {};
        for (const row of data) {
          const st = (row.state || "").toUpperCase().trim();
          if (st && st.length === 2) {
            counts[st] = (counts[st] || 0) + 1;
          }
        }
        setStateCounts(counts);
        setTotalLocations(data.length);
        setTotalStates(Object.keys(counts).length);
      }
    }

    fetchLocations();
  }, [vertical]);

  const cellW = 48;
  const cellH = 40;
  const padding = 8;
  const svgW = 12 * cellW + padding * 2;
  const svgH = 8 * cellH + padding * 2;

  const maxCount = Math.max(1, ...Object.values(stateCounts));

  function stateOpacity(state: string): number {
    const count = stateCounts[state] || 0;
    if (count === 0) return 0.08;
    return 0.3 + (count / maxCount) * 0.7;
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
        <div className="flex items-center justify-center gap-8 mt-4">
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: accentColor }}>
              {totalLocations}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Locations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold" style={{ color: accentColor }}>
              {totalStates}
            </div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">States</div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full max-w-3xl mx-auto"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          {Object.entries(STATE_GRID).map(([state, [col, row]]) => {
            const x = padding + col * cellW;
            const y = padding + row * cellH;
            const count = stateCounts[state] || 0;
            const isHovered = hoveredState === state;
            const hasLocations = count > 0;

            return (
              <g
                key={state}
                onMouseEnter={() => setHoveredState(state)}
                onMouseLeave={() => setHoveredState(null)}
                style={{ cursor: hasLocations ? "pointer" : "default" }}
              >
                <rect
                  x={x + 2}
                  y={y + 2}
                  width={cellW - 4}
                  height={cellH - 4}
                  rx={4}
                  fill={hasLocations ? accentColor : "#e5e7eb"}
                  opacity={stateOpacity(state)}
                  stroke={isHovered && hasLocations ? accentColor : "transparent"}
                  strokeWidth={2}
                />
                <text
                  x={x + cellW / 2}
                  y={y + (hasLocations ? cellH / 2 - 4 : cellH / 2 + 2)}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={hasLocations ? 11 : 10}
                  fontWeight={hasLocations ? 700 : 400}
                  fill={hasLocations ? "#1a1a1a" : "#9ca3af"}
                >
                  {state}
                </text>
                {hasLocations && (
                  <text
                    x={x + cellW / 2}
                    y={y + cellH / 2 + 10}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={10}
                    fontWeight={600}
                    fill={accentColor}
                  >
                    {count}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredState && stateCounts[hoveredState] && (
          <div className="absolute top-2 right-2 bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-sm">
            <div className="font-semibold text-gray-900">
              {STATE_NAMES[hoveredState] || hoveredState}
            </div>
            <div className="text-gray-500">
              {stateCounts[hoveredState]} location{stateCounts[hoveredState] !== 1 ? "s" : ""}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      {totalLocations > 0 && (
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: "#e5e7eb" }} />
            <span>No locations yet</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: accentColor, opacity: 0.4 }} />
            <span>1+</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: accentColor }} />
            <span>Most active</span>
          </div>
        </div>
      )}
    </div>
  );
}
