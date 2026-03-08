import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ArrowRight } from "lucide-react";

const ACCENT = "#D4AF37";

interface FAQItem {
  q: string;
  a: string;
}

interface FAQSection {
  title: string;
  items: FAQItem[];
}

const sections: FAQSection[] = [
  {
    title: "Getting Started",
    items: [
      {
        q: "What is Pulse of the Pint?",
        a: "Pulse of the Pint is a custom-branded customer experience survey tool built for breweries and taprooms. Your customers scan a QR code, take a quick 5-minute survey on their phone, and you get real-time insights about what's working and what's not.",
      },
      {
        q: "What do I need to provide?",
        a: "Just your logo (PNG or JPG) and your brand colors. We handle everything else. If you don't have brand colors defined, we'll pull them from your website or logo.",
      },
      {
        q: "How long does setup take?",
        a: "Most locations are live within 24-48 hours of providing your logo and brand assets.",
      },
      {
        q: "Do I need to install anything?",
        a: "No. The survey is a web app — no app store, no downloads, no software to install. Customers just scan and go.",
      },
    ],
  },
  {
    title: "The Survey",
    items: [
      {
        q: "How long is the survey?",
        a: "About 5 minutes. Typically 16-20 questions depending on which optional sections are shown. It's designed to feel conversational, not tedious — one question at a time.",
      },
      {
        q: "Will customers actually do this?",
        a: "Yes. Short, mobile-friendly surveys with a reward incentive see strong completion rates. The format is designed to be quick and engaging.",
      },
      {
        q: "Do customers need to download an app?",
        a: "No. It's a mobile web page that works in any phone browser. No app download, no account creation. Scan and start.",
      },
      {
        q: "Can someone take the survey multiple times?",
        a: "The system is designed for one survey per visit. Our Terms of Service prohibit multiple completions for the same visit, and we monitor for patterns.",
      },
      {
        q: "Why is there an age gate?",
        a: "Pulse of the Pint serves breweries where customers must be 21+. The age verification is the first question on every survey. Anyone under 21 sees a polite message and cannot proceed — no data is collected.",
      },
    ],
  },
  {
    title: "QR Codes & Placement",
    items: [
      {
        q: "Where should I put the QR codes?",
        a: "Best placements for breweries: table tents on each table, coasters, at the bar (counter card or bar mat), on the receipt or check, and menu inserts. The key is to catch customers right after their experience while it's fresh.",
      },
      {
        q: "Can I have multiple QR codes for one location?",
        a: "Yes. All codes point to the same survey. Print as many as you need in whatever formats work for your space.",
      },
      {
        q: "Do QR codes expire?",
        a: "No. Your QR code is permanent and tied to your location. It works as long as your subscription is active.",
      },
    ],
  },
  {
    title: "Data & Privacy",
    items: [
      {
        q: "What data do you collect?",
        a: "The survey collects feedback about the visit: experience rating, what they ordered (categories, not brands), what brought them in, service rating, return likelihood, and open-ended comments. Contact info (name, email, zip, phone) is only collected at the end and is 100% optional.",
      },
      {
        q: "Do you sell customer data?",
        a: "No. Never. We do not sell, rent, or trade personal information to anyone for any purpose.",
      },
      {
        q: "Is the data secure?",
        a: "Yes. All data is encrypted in transit (HTTPS) and at rest. Access is controlled and limited. We follow industry-standard security practices.",
      },
      {
        q: "Who owns the survey data?",
        a: "Good Human Partners owns the raw survey data. You receive aggregated insights and reports. See our Terms of Service for full details.",
      },
    ],
  },
  {
    title: "Reporting & Insights",
    items: [
      {
        q: "How often is data updated?",
        a: "Real-time. As soon as a customer submits a response, it appears in your dashboard.",
      },
      {
        q: "Can I export my data?",
        a: "Yes. Regular and Advanced plans include CSV export of aggregated data. Advanced plan also offers API access and white-label PDF reports.",
      },
      {
        q: "Can I compare my performance to others?",
        a: "Yes. Regular plan includes state average benchmarking. Advanced plan adds national benchmarking. You'll never see another location's specific data, and they'll never see yours.",
      },
      {
        q: "Do I get alerts for bad reviews?",
        a: "Yes. Regular and Advanced plans include low-score alerts — you'll get an email notification when someone rates their experience as 'Poor' or 'Fair' so you can address issues quickly.",
      },
    ],
  },
  {
    title: "Pricing & Billing",
    items: [
      {
        q: "Is there a free plan?",
        a: "Yes. The first 5 locations to sign up in each state qualify for our free Basic plan. Plus, the first location in any new state always gets Basic free. The free plan includes your branded survey, QR codes, and a simplified dashboard.",
      },
      {
        q: "Are there per-response fees?",
        a: "No. All paid plans include unlimited survey responses. Whether you get 10 or 10,000 responses, the price stays the same.",
      },
      {
        q: "Can I cancel anytime?",
        a: "Yes. No long-term commitments required.",
      },
      {
        q: "Is there a discount for multiple locations?",
        a: "Yes. Contact us for multi-location pricing.",
      },
    ],
  },
];

function Accordion({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex items-center justify-between py-4 text-left"
        onClick={() => setOpen(!open)}
      >
        <span className="text-base font-medium text-gray-900 pr-4">{item.q}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="pb-4 text-sm text-gray-600 leading-relaxed">{item.a}</div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <>
      {/* Header */}
      <section className="bg-[#2C2C2C] text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-300 max-w-xl">
            Everything you need to know about Pulse of the Pint.
          </p>
        </div>
      </section>

      {/* FAQ sections */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6 space-y-12">
          {sections.map((section) => (
            <div key={section.title}>
              <h2
                className="text-lg font-bold mb-4 uppercase tracking-wide"
                style={{ color: ACCENT }}
              >
                {section.title}
              </h2>
              <div>
                {section.items.map((item) => (
                  <Accordion key={item.q} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#2C2C2C] text-white py-16 text-center">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
          <p className="text-gray-300 mb-6">
            We'd love to hear from you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:info@goodhumanpartners.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-[#2C2C2C] transition-all hover:scale-105"
              style={{ backgroundColor: ACCENT }}
            >
              Email Us
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              to="/claim"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white border border-gray-600 hover:border-gray-400 transition-all"
            >
              Claim Your Free Survey
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
