import { motion } from "framer-motion";
import { PartyPopper } from "lucide-react";
import type { LocationData } from "@/hooks/useLocation";

interface ThankYouScreenProps {
  location: LocationData;
}

export default function ThankYouScreen({ location }: ThankYouScreenProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        initial={{ rotate: -20, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <PartyPopper
          size={64}
          className="mb-6"
          style={{ color: "var(--primary)" }}
        />
      </motion.div>

      <h2 className="text-3xl font-bold mb-4">Cheers!</h2>
      <p className="text-lg text-gray-300 mb-2">
        Thanks for your feedback.
      </p>
      <p className="text-gray-400 mb-8 max-w-sm">
        Enjoy the rest of your time at{" "}
        <span
          className="font-semibold"
          style={{ color: "var(--primary)" }}
        >
          {location.name}
        </span>
        !
      </p>

      {location.instagram && (
        <p className="text-sm text-muted-foreground">
          Tag us{" "}
          <a
            href={`https://instagram.com/${location.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
            style={{ color: "var(--primary)" }}
          >
            @{location.instagram}
          </a>
        </p>
      )}
    </motion.div>
  );
}
