import SampleBadge from "./SampleBadge";

interface Props {
  title: string;
  summaryPct: number;
  summaryLabel: string;
  data: { label: string; value: number; color: string }[];
}

const StackedBar = ({ title, summaryPct, summaryLabel, data }: Props) => {
  return (
    <div className="relative bg-white rounded-xl border border-gray-200 p-6">
      <SampleBadge />
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {title}
      </h3>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-4xl font-bold text-gray-900">{summaryPct}%</span>
        <span className="text-sm text-gray-500">{summaryLabel}</span>
      </div>

      {/* Stacked bar */}
      <div className="flex rounded-full overflow-hidden h-8 mb-4">
        {data.map((d) => (
          <div
            key={d.label}
            className="flex items-center justify-center transition-all"
            style={{
              width: `${d.value}%`,
              backgroundColor: d.color,
              minWidth: d.value > 3 ? "auto" : "0",
            }}
          >
            {d.value >= 8 && (
              <span className="text-xs font-semibold text-white">{d.value}%</span>
            )}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: d.color }}
            />
            <span className="text-xs text-gray-600">
              {d.label} ({d.value}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StackedBar;
