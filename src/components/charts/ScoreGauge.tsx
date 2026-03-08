import { PieChart, Pie, Cell } from "recharts";
import SampleBadge from "./SampleBadge";

interface Props {
  score: number;
  maxScore?: number;
  label: string;
  accentColor?: string;
  distribution: { label: string; value: number; color: string }[];
}

const ScoreGauge = ({
  score,
  maxScore = 5,
  label,
  accentColor = "#D4AF37",
  distribution,
}: Props) => {
  const pct = (score / maxScore) * 100;
  const gaugeData = [
    { value: pct, color: accentColor },
    { value: 100 - pct, color: "#E5E7EB" },
  ];

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 p-6">
      <SampleBadge />
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        {label}
      </h3>
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32 flex-shrink-0">
          <PieChart width={128} height={128}>
            <Pie
              data={gaugeData}
              cx={60}
              cy={60}
              innerRadius={40}
              outerRadius={58}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              {gaugeData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold" style={{ color: accentColor }}>
                {score}
              </span>
              <span className="text-sm text-gray-400">/{maxScore}</span>
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-1.5">
          {distribution.map((d) => (
            <div key={d.label} className="flex items-center gap-2">
              <div className="w-16 text-xs text-gray-500 text-right">{d.label}</div>
              <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${d.value}%`, backgroundColor: d.color }}
                />
              </div>
              <div className="w-8 text-xs text-gray-500 text-right">{d.value}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreGauge;
