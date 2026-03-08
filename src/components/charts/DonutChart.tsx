import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import SampleBadge from "./SampleBadge";

interface Props {
  title: string;
  data: { label: string; value: number; color: string }[];
  centerLabel?: string;
  centerValue?: string;
}

const DonutChart = ({ title, data, centerLabel, centerValue }: Props) => {
  return (
    <div className="relative bg-white rounded-xl border border-gray-200 p-6">
      <SampleBadge />
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        {title}
      </h3>
      <div className="relative" style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              dataKey="value"
              nameKey="label"
              stroke="#fff"
              strokeWidth={2}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value: string) => (
                <span className="text-xs text-gray-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
        {centerValue && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ marginBottom: 36 }}>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{centerValue}</div>
              {centerLabel && (
                <div className="text-xs text-gray-500">{centerLabel}</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonutChart;
