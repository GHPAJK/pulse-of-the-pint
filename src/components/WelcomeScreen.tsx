import { motion } from "framer-motion";
import { Beer, ArrowRight } from "lucide-react";
import type { LocationData } from "@/hooks/useLocation";

interface WelcomeScreenProps {
  location: LocationData;
  onStart: () => void;
}

export default function WelcomeScreen({
  location,
  onStart,
}: WelcomeScreenProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {location.logo_url ? (
        <img
          src={location.logo_url}
          alt={location.name}
          className="w-24 h-24 object-contain mb-6 rounded-xl"
        />
      ) : (
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
          style={{ backgroundColor: "var(--primary)" }}
        >
          <Beer
            size={40}
            style={{ color: "var(--primary-foreground)" }}
          />
        </div>
      )}

      <h1 className="text-3xl font-bold mb-2">Pulse of the Pint</h1>

      <p className="text-lg text-muted-foreground mb-2">
        Thanks for stopping by
      </p>
      <h2
        className="text-2xl font-semibold mb-1"
        style={{ color: "var(--primary)" }}
      >
        {location.name}
      </h2>
      <p className="text-muted-foreground mb-8">
        in {location.city}, {location.state}
      </p>

      <p className="text-base text-gray-300 mb-8 max-w-sm leading-relaxed">
        We'd love your take on today's visit. Takes about 5 minutes and earns
        you a reward. Cheers!
      </p>

      <button
        onClick={onStart}
        className="flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold transition-all active:scale-95 hover:brightness-110"
        style={{
          backgroundColor: "var(--primary)",
          color: "var(--primary-foreground)",
        }}
      >
        Start Survey
        <ArrowRight size={20} />
      </button>
    </motion.div>
  );
}
