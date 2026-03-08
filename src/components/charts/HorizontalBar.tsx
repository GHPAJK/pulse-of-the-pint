import SampleBadge from "./SampleBadge";

interface Props {
  title: string;
  data: { label: string; value: number }[];
  accentColor?: string;
  maxItems?: number;
  unit?: string;
}

const HorizontalBar = ({
  title,
  data,
  accentColor = "#D4AF37",
  maxItems = 8,
  unit = "%",
}: Props) => {
  const items = data.slice(0, maxItems);
  const maxValue = Math.max(...items.map((d) => d.value));

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 p-6">
      <SampleBadge />
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        {title}
      </h3>
      <div className="space-y-3">
        {items.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <div className="w-36 text-sm text-gray-700 text-right truncate" title={d.label}>
              {d.label}
            </div>
            <div className="flex-1 bg-gray-100 rounded-full h-6 overflow-hidden">
              <div
                className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                style={{
                  width: `${(d.value / maxValue) * 100}%`,
                  backgroundColor: accentColor,
                  minWidth: "2rem",
                }}
              >
                <span className="text-xs font-semibold text-white">
                  {d.value}{unit}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HorizontalBar;
