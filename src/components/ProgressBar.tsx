import { motion } from "framer-motion";

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <div className="w-full px-4 py-2">
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
        <span>
          {current} of {total}
        </span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full h-2 bg-[var(--surface)] rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: "var(--primary)" }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
