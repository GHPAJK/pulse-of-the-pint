import { motion } from "framer-motion";
import { ShieldCheck, XCircle } from "lucide-react";

interface AgeGateProps {
  onConfirm: (isOfAge: boolean) => void;
}

export default function AgeGate({ onConfirm }: AgeGateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[80dvh] px-6 text-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ShieldCheck
        size={48}
        className="mb-6"
        style={{ color: "var(--primary)" }}
      />
      <h2 className="text-2xl font-bold mb-4">Age Verification</h2>
      <p className="text-gray-300 mb-8 max-w-sm">
        Please confirm you are 21 years of age or older to continue.
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => onConfirm(true)}
          className="w-full py-4 rounded-xl text-lg font-semibold transition-all active:scale-95 hover:brightness-110"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          Yes, I'm 21+
        </button>
        <button
          onClick={() => onConfirm(false)}
          className="w-full py-4 rounded-xl text-lg font-medium bg-[var(--surface)] text-gray-400 transition-all active:scale-95 hover:bg-[var(--muted)]"
        >
          No
        </button>
      </div>
    </motion.div>
  );
}

export function TerminatedScreen() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <XCircle size={48} className="text-red-400 mb-6" />
      <h2 className="text-2xl font-bold mb-4">Sorry!</h2>
      <p className="text-gray-300 max-w-sm">
        You must be 21 or older to participate in this survey. Thanks for
        stopping by!
      </p>
    </motion.div>
  );
}
