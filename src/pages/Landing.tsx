import { Link } from "react-router-dom";
import {
  Beer,
  QrCode,
  BarChart3,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Star,
  Users,
  Zap,
} from "lucide-react";
import USMap from "@/components/USMap";

const ACCENT = "#D4AF37";

const steps = [
  {
    icon: Zap,
    title: "We build your branded survey",
    desc: "Your logo, your colors, your name. We handle everything — no design work needed from you.",
  },
  {
    icon: QrCode,
    title: "You place QR codes",
    desc: "Print-ready codes for table tents, coasters, menus, receipts — wherever customers will see them.",
  },
  {
    icon: Users,
    title: "Customers give feedback",
    desc: "A quick 5-minute mobile survey. One question at a time, conversational and easy. No app needed.",
  },
  {
    icon: BarChart3,
    title: "You get real-time insights",
    desc: "Satisfaction scores, product preferences, service ratings, and customer comments — updated live.",
  },
];

const benefits = [
  "Know exactly how customers feel about every visit",
  "See which products and styles your customers prefer",
  "Understand what brings people in — and what brings them back",
  "Spot service issues before they become bad reviews",
  "Benchmark against anonymized industry averages",
  "Unlimited survey responses on all paid plans",
];

export default function Landing() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#2C2C2C] text-white py-20 lg:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <Beer className="w-10 h-10" style={{ color: ACCENT }} />
              <span
                className="text-sm font-semibold uppercase tracking-widest"
                style={{ color: ACCENT }}
              >
                Pulse of the Pint
              </span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Hear from your customers.{" "}
              <span style={{ color: ACCENT }}>Before they review you.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Real-time customer experience surveys for breweries and taprooms.
              Your brand, your insights, your competitive edge — starting free.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/claim"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-lg font-semibold text-[#2C2C2C] transition-all hover:scale-105"
                style={{ backgroundColor: ACCENT }}
              >
                Claim Your Free Survey
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/insights"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-lg font-semibold text-white border border-gray-600 hover:border-gray-400 transition-all"
              >
                See Sample Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-6 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4" style={{ color: ACCENT }} />
            <span>Built by market research professionals</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" style={{ color: ACCENT }} />
            <span>No app download required</span>
          </div>
          <div className="flex items-center gap-2">
            <QrCode className="w-4 h-4" style={{ color: ACCENT }} />
            <span>Scan &rarr; Survey &rarr; Insights</span>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              How it works
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Go from zero to real customer insights in under 48 hours.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center">
                <div
                  className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${ACCENT}20` }}
                >
                  <step.icon className="w-7 h-7" style={{ color: ACCENT }} />
                </div>
                <div className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                  Step {i + 1}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Customer intelligence that actually helps you run your brewery
              </h2>
              <ul className="space-y-4">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2
                      className="w-5 h-5 mt-0.5 flex-shrink-0"
                      style={{ color: ACCENT }}
                    />
                    <span className="text-gray-600">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8">
              <div className="text-center mb-6">
                <div
                  className="text-5xl font-bold mb-1"
                  style={{ color: ACCENT }}
                >
                  4.2
                </div>
                <div className="text-sm text-gray-500">
                  Average satisfaction score
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Excellent", pct: 38 },
                  { label: "Very Good", pct: 31 },
                  { label: "Good", pct: 19 },
                  { label: "Fair", pct: 8 },
                  { label: "Poor", pct: 4 },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-16 text-right">
                      {row.label}
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{
                          width: `${row.pct}%`,
                          backgroundColor: ACCENT,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 w-8">
                      {row.pct}%
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center mt-4">
                Sample data — your dashboard shows real responses
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Your brand, not ours */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your brand, not ours
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-8">
            Every survey is white-labeled to your business. Your logo, your
            colors, your name. Customers see YOUR brand — never ours.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { label: "Your Logo", desc: "Displayed on every screen" },
              { label: "Your Colors", desc: "Buttons, accents, progress bar" },
              { label: "Your Name", desc: "Welcome screen & thank you page" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div
                  className="text-lg font-semibold mb-1"
                  style={{ color: ACCENT }}
                >
                  {item.label}
                </div>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Network Map */}
      <section className="bg-white py-20 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <USMap
            accentColor={ACCENT}
            title="Join the Growing Network"
            subtitle="Breweries and taprooms across the country are already listening to their customers."
            vertical="brewery"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#2C2C2C] text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to hear from your customers?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
            Your survey is already built and branded. Claim it for free and
            start collecting real insights today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/claim"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-lg font-semibold text-[#2C2C2C] transition-all hover:scale-105"
              style={{ backgroundColor: ACCENT }}
            >
              Claim Your Free Survey
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-lg font-semibold text-white border border-gray-600 hover:border-gray-400 transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
