import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Beer, Menu, X } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/insights", label: "What You'll See" },
  { to: "/pricing", label: "Pricing" },
  { to: "/faq", label: "FAQ" },
];

const ACCENT = "#D4AF37";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="bg-[#2C2C2C] border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <Beer className="w-7 h-7" style={{ color: ACCENT }} />
          <span className="text-lg font-bold text-white">Pulse of the Pint</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/login"
            className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/claim"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-[#2C2C2C] transition-all hover:scale-105"
            style={{ backgroundColor: ACCENT }}
          >
            Claim Your Survey
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-gray-300"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#2C2C2C] border-t border-gray-700 px-6 pb-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block text-sm font-medium py-2 ${
                location.pathname === link.to ? "text-white" : "text-gray-400"
              }`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/login"
            className="block text-sm font-medium py-2 text-gray-400"
            onClick={() => setOpen(false)}
          >
            Sign In
          </Link>
          <Link
            to="/claim"
            className="block text-center px-4 py-2 rounded-lg text-sm font-semibold text-[#2C2C2C]"
            style={{ backgroundColor: ACCENT }}
            onClick={() => setOpen(false)}
          >
            Claim Your Survey
          </Link>
        </div>
      )}
    </nav>
  );
}
