import { Link } from "react-router-dom";
import { CheckCircle2, ArrowRight, Sparkles, Crown, Map, Share2 } from "lucide-react";

const ACCENT = "#D4AF37";

interface Tier {
  name: string;
  price: string;
  ogPrice?: string;
  subtitle: string;
  highlight?: boolean;
  features: string[];
  cta: string;
}

const tiers: Tier[] = [
  {
    name: "Basic",
    price: "Free",
    subtitle: "Always free — for every location",
    features: [
      "Branded survey (your logo & colors)",
      "QR code generation (print-ready)",
      "Overall satisfaction score",
      "Response count & 30-day trend",
      "New vs returning breakdown",
      "Staff rating average",
      "Return likelihood summary",
      "Monthly email summary report",
      "Up to 100 responses/month",
    ],
    cta: "Get Started Free",
  },
  {
    name: "Regular",
    price: "$79",
    ogPrice: "$49",
    subtitle: "per month",
    highlight: true,
    features: [
      "Everything in Basic, plus:",
      "Unlimited responses",
      "Full dashboard — all question breakdowns",
      "Product preferences & visit drivers",
      "Value perception & spend patterns",
      "Open-ended response feed",
      "Weekly email summary report",
      "CSV export of aggregated data",
      "Low-score alerts (email notification)",
      "12 months rolling history",
      "State average benchmarking",
      "Quote card generator for social media",
      "Auto-generated Instagram posts",
    ],
    cta: "Start Regular",
  },
  {
    name: "Advanced",
    price: "$199",
    ogPrice: "$129",
    subtitle: "per month",
    features: [
      "Everything in Regular, plus:",
      "Individual response detail",
      "Unlimited historical data",
      "Up to 3 custom questions",
      "Trend analysis (WoW, MoM, seasonal)",
      "National average benchmarking",
      "Quarterly written insights report",
      "API access to your data (JSON)",
      "White-label PDF reports",
      "Monthly social media content pack",
      "Auto-post to Instagram & download-ready TikTok content",
      "Priority support",
    ],
    cta: "Start Advanced",
  },
];

export default function Pricing() {
  return (
    <>
      {/* Header */}
      <section className="bg-[#2C2C2C] text-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
          <p className="text-lg text-gray-300 max-w-xl mx-auto">
            Start free. Upgrade when you need more. No per-response fees,
            no surprises. OGs get rewarded.
          </p>
        </div>
      </section>

      {/* Launch promo */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200">
              <Sparkles className="w-4 h-4" style={{ color: ACCENT }} />
              <span className="text-sm font-medium text-gray-700">
                First 50 breweries get Regular free for 3 months — then OG pricing for life
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tier cards */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl border p-8 flex flex-col ${
                  tier.highlight
                    ? "border-2 bg-white shadow-lg relative"
                    : "border-gray-200 bg-white"
                }`}
                style={tier.highlight ? { borderColor: ACCENT } : undefined}
              >
                {tier.highlight && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-[#2C2C2C]"
                    style={{ backgroundColor: ACCENT }}
                  >
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900">{tier.name}</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">{tier.price}</span>
                    {tier.price !== "Free" && (
                      <span className="text-gray-500">/ mo</span>
                    )}
                  </div>
                  {tier.ogPrice && (
                    <div className="mt-1 flex items-center gap-2">
                      <Crown className="w-3.5 h-3.5" style={{ color: ACCENT }} />
                      <span className="text-sm font-medium" style={{ color: ACCENT }}>
                        OG price: {tier.ogPrice}/mo forever
                      </span>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 mt-1">{tier.subtitle}</p>
                </div>

                <ul className="space-y-3 flex-1 mb-8">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      {f.endsWith(":") ? (
                        <span className="text-sm font-semibold text-gray-700">{f}</span>
                      ) : (
                        <>
                          <CheckCircle2
                            className="w-4 h-4 mt-0.5 flex-shrink-0"
                            style={{ color: ACCENT }}
                          />
                          <span className="text-sm text-gray-600">{f}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/claim"
                  className={`block text-center px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 ${
                    tier.highlight
                      ? "text-[#2C2C2C]"
                      : "text-[#2C2C2C] bg-gray-100 hover:bg-gray-200"
                  }`}
                  style={tier.highlight ? { backgroundColor: ACCENT } : undefined}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OG Loyalty */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Crown className="w-6 h-6" style={{ color: ACCENT }} />
                  <h3 className="text-2xl font-bold text-gray-900">OG Rewards</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  The first 50 breweries to join get the founding member deal. You
                  trusted us early — we reward that forever.
                </p>
                <ul className="space-y-3">
                  {[
                    "Regular plan free for 3 months — full access, zero cost",
                    "After trial: locked-in OG rate of $49/mo (vs $79 standard)",
                    "Advanced plan at $129/mo forever (vs $199 standard)",
                    "First in your state? You qualify automatically",
                    "Your brewery on our national map as a founding partner",
                    "Early access to every new feature we ship",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: ACCENT }}
                      />
                      <span className="text-sm text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center">
                <div className="text-6xl font-bold mb-2" style={{ color: ACCENT }}>
                  50
                </div>
                <div className="text-lg font-semibold text-gray-700 mb-1">
                  founding spots available
                </div>
                <p className="text-sm text-gray-500 mb-6">
                  Once they're gone, they're gone. Standard pricing applies after.
                </p>
                <Link
                  to="/claim"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-[#2C2C2C] transition-all hover:scale-105"
                  style={{ backgroundColor: ACCENT }}
                >
                  Claim Your Spot
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Engine */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Your data becomes your content
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Every survey response feeds a content engine that works for you
              across every channel. One source. Multiple outputs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Share2,
                title: "Instagram & Social",
                desc: "Auto-generated quote cards, stat highlights, and branded images. Regular plan auto-posts to Instagram. Advanced adds download-ready TikTok content and a monthly social pack.",
                tier: "Regular+",
              },
              {
                icon: Map,
                title: "National Map & Benchmarks",
                desc: "See where you stand. Every participating brewery appears on our national map. Compare your scores to state and national averages as the network grows.",
                tier: "All Plans",
              },
              {
                icon: Crown,
                title: "Industry Newsletter",
                desc: "Your anonymized insights contribute to the Pulse of the Pint national report — a go-to resource for brewers, PR, and industry writers. OGs get featured.",
                tier: "All Plans",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-gray-50 rounded-xl border border-gray-200 p-6"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${ACCENT}20` }}
                >
                  <item.icon className="w-5 h-5" style={{ color: ACCENT }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  {item.desc}
                </p>
                <span
                  className="text-xs font-semibold uppercase tracking-wide"
                  style={{ color: ACCENT }}
                >
                  {item.tier}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise callout */}
      <section className="pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-[#2C2C2C] text-white rounded-2xl p-8 lg:p-12 text-center">
            <h3 className="text-2xl font-bold mb-3">Multi-location or enterprise?</h3>
            <p className="text-gray-300 max-w-lg mx-auto mb-6">
              Portfolio dashboards, cross-location benchmarking, custom survey
              design, and dedicated support. Let's talk.
            </p>
            <a
              href="mailto:info@goodhumanpartners.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-[#2C2C2C] transition-all hover:scale-105"
              style={{ backgroundColor: ACCENT }}
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ link */}
      <section className="bg-gray-50 py-12 text-center">
        <p className="text-gray-500 mb-2">Have questions?</p>
        <Link
          to="/faq"
          className="text-sm font-semibold hover:underline"
          style={{ color: ACCENT }}
        >
          Read our FAQ &rarr;
        </Link>
      </section>
    </>
  );
}
