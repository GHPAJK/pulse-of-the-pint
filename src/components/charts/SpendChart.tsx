import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";
import SampleBadge from "./SampleBadge";

interface Props {
  title: string;
  data: { label: string; value: number }[];
  accentColor?: string;
}

const SpendChart = ({ title, data, accentColor = "#D4AF37" }: Props) => {
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 p-6">
      <SampleBadge />
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        {title}
      </h3>
      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#6B7280" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.value === maxValue ? accentColor : `${accentColor}66`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendChart;
