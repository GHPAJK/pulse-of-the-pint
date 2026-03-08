import { Link } from "react-router-dom";
import { Beer } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] px-6 text-center">
      <Beer size={48} className="text-gray-500 mb-6" />
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-gray-400 mb-6">
        Looks like this page went flat. Nothing to see here.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-xl font-medium transition-all active:scale-95"
        style={{
          backgroundColor: "var(--primary)",
          color: "var(--primary-foreground)",
        }}
      >
        Back to Survey
      </Link>
    </div>
  );
}
