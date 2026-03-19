import { Link } from "react-router-dom";
import { Beer, ArrowRight, Users, BarChart3, Globe, Mic, Shield, Heart } from "lucide-react";

const ACCENT = "#D4AF37";

export default function About() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#2C2C2C] text-white py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <Beer className="w-8 h-8" style={{ color: ACCENT }} />
            <span className="text-sm font-medium uppercase tracking-wider" style={{ color: ACCENT }}>
              About Us
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Built by researchers.<br />
            Powered by breweries.
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            Pulse of the Pint is part of the Good Human Panels network — a
            family of industry-specific customer experience tools built by
            the market research professionals at Good Human Partners.
          </p>
        </div>
      </section>

      {/* The Story */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-6">The Story</h2>
          <div className="space-y-4 text-gray-300 leading-relaxed">
            <p>
              Good Human Partners was founded by AJ Keirans, a 20-year veteran
              of the market research industry, and Ginger De Stefano, an
              operations leader with decades of experience running complex
              research programs at scale. Together, they've completed over
              1,000 studies across healthcare, financial services, consumer
              goods, and technology.
            </p>
            <p>
              AJ has also spent the last several years deep in craft beer
              culture as the creator and host of the{" "}
              <strong style={{ color: ACCENT }}>16oz Canvas</strong> podcast — 186+
              episodes exploring the art, stories, and people behind the beer
              you drink. That experience — sitting in taprooms, talking to
              brewers, watching customers interact with the space — is what
              sparked Pulse of the Pint.
            </p>
            <p>
              The question was simple: what if the same research methodology
              that Fortune 500 companies pay six figures for was accessible to
              every brewery in America? What if a brewer in Vermont could
              understand their customers as well as a global brand does?
            </p>
            <p>
              That's what we're building. Professional-grade customer experience
              research, purpose-built for craft breweries and taprooms, at a
              price point that works for a 10-barrel operation.
            </p>
          </div>
        </div>
      </section>

      {/* Good Human Panels Network */}
      <section className="py-16 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5" style={{ color: ACCENT }} />
            <h2 className="text-2xl font-bold text-white">The Good Human Panels Network</h2>
          </div>
          <p className="text-gray-400 mb-8">
            A growing family of industry-specific customer experience tools — all built on
            the same research-grade platform.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
              <div className="flex items-center gap-2 mb-3">
                <Beer className="w-5 h-5" style={{ color: ACCENT }} />
                <h3 className="font-bold text-white">Pulse of the Pint</h3>
              </div>
              <p className="text-sm text-gray-400">
                Customer experience surveys for breweries and taprooms.
                Branded to your business, insights delivered in real time.
              </p>
              <span className="inline-block mt-3 text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: `${ACCENT}20`, color: ACCENT }}>
                You're here
              </span>
            </div>

            <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-green-400 text-lg">🌿</span>
                <h3 className="font-bold text-white">The Session Report</h3>
              </div>
              <p className="text-sm text-gray-400">
                Customer experience surveys for dispensaries and cannabis
                retailers. Built for a regulated industry that deserves
                real data.
              </p>
              <a
                href="https://thesessionreport.com"
                className="inline-block mt-3 text-xs font-medium px-2 py-1 rounded-full bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
              >
                thesessionreport.com →
              </a>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            More verticals coming soon. Same platform, same research rigor,
            different industries.{" "}
            <a
              href="https://goodhumanpanels.com"
              className="underline hover:text-gray-300"
            >
              goodhumanpanels.com
            </a>
          </p>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-16 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-8">What Makes This Different</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                icon: BarChart3,
                title: "Research-Grade Methodology",
                desc: "Randomized question blocks, skip logic, anti-bot detection, and statistical rigor. This isn't a Google Form — it's built by people who've designed surveys for a living.",
              },
              {
                icon: Users,
                title: "Built for Your Industry",
                desc: "Every question is written for breweries and taprooms specifically. We know the difference between a flight and a pint, between a taproom regular and a first-timer.",
              },
              {
                icon: Shield,
                title: "Your Brand, Not Ours",
                desc: "Your logo, your colors, your name on every screen. Customers see your brand — never ours. We're the engine behind the experience.",
              },
              {
                icon: Mic,
                title: "Born from the Community",
                desc: "186+ podcast episodes. Thousands of conversations with brewers, artists, and craft beer fans. We didn't study this industry from the outside — we live in it.",
              },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-xl border border-gray-800 bg-[#2a2a2a]">
                <item.icon className="w-5 h-5 mb-3" style={{ color: ACCENT }} />
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Team */}
      <section className="py-16 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-8">The Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 rounded-xl border border-gray-800 bg-[#2a2a2a]">
              <h3 className="font-bold text-white text-lg mb-1">AJ Keirans</h3>
              <p className="text-sm mb-3" style={{ color: ACCENT }}>Founder & CEO</p>
              <p className="text-sm text-gray-400 leading-relaxed">
                20+ years in market research. Former President, Insights
                Association Central Atlantic Chapter (Chapter of the Year
                winner). Creator and host of the 16oz Canvas podcast. AJ
                brings enterprise-grade research methodology to an industry
                he's spent years embedded in.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-gray-800 bg-[#2a2a2a]">
              <h3 className="font-bold text-white text-lg mb-1">Ginger De Stefano</h3>
              <p className="text-sm mb-3" style={{ color: ACCENT }}>Head of Operations</p>
              <p className="text-sm text-gray-400 leading-relaxed">
                Decades of market research operations at GfK and RTi Research.
                2025 Insights Association Volunteer of the Year. Joyce
                Rachelson Silver Service Award recipient. Author of IA
                training manuals used nationwide. Ginger makes the machine run.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Heart className="w-8 h-8 mx-auto mb-4" style={{ color: ACCENT }} />
          <h2 className="text-2xl font-bold text-white mb-3">
            Ready to hear from your customers?
          </h2>
          <p className="text-gray-400 mb-6 max-w-xl mx-auto">
            Join the first national brewery customer experience network.
            Free for 3 months. No credit card. No catch.
          </p>
          <Link
            to="/claim"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-[#2C2C2C] transition-all hover:scale-105"
            style={{ backgroundColor: ACCENT }}
          >
            Claim Your Free Survey
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
