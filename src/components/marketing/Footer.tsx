import { Link } from "react-router-dom";
import { Beer } from "lucide-react";

const ACCENT = "#D4AF37";

export default function Footer() {
  return (
    <footer className="bg-[#1A1A1A] text-gray-400 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Beer className="w-5 h-5" style={{ color: ACCENT }} />
              <span className="text-white font-semibold">Pulse of the Pint</span>
            </div>
            <p className="text-sm leading-relaxed">
              Real-time customer experience insights for breweries and taprooms.
              Built by{" "}
              <a
                href="https://goodhumanpartners.com"
                className="underline hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                Good Human Partners
              </a>
              .
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/insights" className="hover:text-white">What You'll See</Link></li>
              <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li>
                <a href="mailto:info@goodhumanpartners.com" className="hover:text-white">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-xs text-gray-500 text-center">
          &copy; {new Date().getFullYear()} Good Human Partners, LLC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
