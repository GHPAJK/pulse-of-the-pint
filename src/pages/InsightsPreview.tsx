import { Link } from "react-router-dom";
import ScoreGauge from "@/components/charts/ScoreGauge";
import HorizontalBar from "@/components/charts/HorizontalBar";
import DonutChart from "@/components/charts/DonutChart";
import StackedBar from "@/components/charts/StackedBar";
import QuoteCarousel from "@/components/charts/QuoteCarousel";
import SpendChart from "@/components/charts/SpendChart";
import { buildBreweryMockData } from "@/data/sampleData";
import { brand } from "@/lib/theme";
import { Beer, BarChart3, Users, Star, TrendingUp, MessageCircle, ArrowRight } from "lucide-react";

const d = buildBreweryMockData(brand.primary, brand.secondary);
const ACCENT = brand.primary;

const sections = [
  {
    icon: Star,
    title: "Customer Satisfaction",
    subtitle: "Know exactly how your guests feel about every visit",
  },
  {
    icon: Beer,
    title: "Product Insights",
    subtitle: "See what's selling and what styles your customers prefer",
  },
  {
    icon: Users,
    title: "Customer Behavior",
    subtitle: "Understand who visits, why they come, and what brings them back",
  },
  {
    icon: TrendingUp,
    title: "Business Intelligence",
    subtitle: "Value perception, spend patterns, and growth opportunities",
  },
  {
    icon: MessageCircle,
    title: "In Their Own Words",
    subtitle: "Real quotes from real customers — the insights data can't capture",
  },
];

const InsightsPreview = () => {
  return (
    <>
      {/* Header */}
      <div className="bg-[#2C2C2C] text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-8 h-8" style={{ color: ACCENT }} />
            <h1 className="text-4xl font-bold">What You'll See</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl">
            Every chart below maps to a real question on your survey. This is
            what your dashboard delivers — real customer insights, updated in
            real time.
          </p>
          <p className="mt-4 text-sm text-gray-400 border border-gray-600 rounded-lg px-4 py-2 inline-block">
            All data shown is sample data for demonstration purposes.
            Your actual results will reflect your customers' real responses.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        {/* Section 1: Satisfaction */}
        <section>
          <SectionHeader {...sections[0]} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ScoreGauge
              label="Overall Experience"
              score={d.overallExperience.score}
              distribution={d.overallExperience.distribution}
              accentColor={ACCENT}
            />
            <StackedBar
              title="Return Likelihood"
              summaryPct={d.returnLikelihood.summary}
              summaryLabel="would definitely or probably return"
              data={d.returnLikelihood.data}
            />
          </div>
        </section>

        {/* Section 2: In Their Own Words */}
        <section>
          <SectionHeader {...sections[4]} />
          <div className="max-w-2xl">
            <QuoteCarousel
              title="Fun Responses"
              quotes={d.funQuotes}
              accentColor={ACCENT}
            />
          </div>
        </section>

        {/* Section 3: Products */}
        <section>
          <SectionHeader {...sections[1]} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HorizontalBar
              title="What Customers Ordered"
              data={d.whatTheyHad}
              accentColor={ACCENT}
            />
            <HorizontalBar
              title="Beer Styles"
              data={d.beerStyles}
              accentColor={brand.primaryLight}
            />
          </div>
        </section>

        {/* Section 4: Customers */}
        <section>
          <SectionHeader {...sections[2]} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DonutChart
              title="New vs Returning Customers"
              data={d.newVsReturning}
              centerValue="66%"
              centerLabel="returning"
            />
            <HorizontalBar
              title="What Brought Them In"
              data={d.visitDrivers}
              accentColor={ACCENT}
            />
            <HorizontalBar
              title="What They Value Most"
              data={d.valueMost}
              accentColor={brand.primaryLight}
            />
            <HorizontalBar
              title="What Would Bring Them Back More"
              data={d.visitMore}
              accentColor={ACCENT}
            />
          </div>
        </section>

        {/* Section 5: Business Intelligence */}
        <section>
          <SectionHeader {...sections[3]} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SpendChart
              title="Average Spend Per Visit"
              data={d.spendPerVisit}
              accentColor={ACCENT}
            />
            <DonutChart
              title="Social Media Following"
              data={d.socialFollow}
              centerValue="45%"
              centerLabel="would follow"
            />
            <ScoreGauge
              label="Service Rating"
              score={d.serviceRating.score}
              distribution={d.serviceRating.distribution}
              accentColor={ACCENT}
            />
            <DonutChart
              title="Vibe Check"
              data={d.vibeDescription}
            />
          </div>
        </section>

        {/* Turn Quotes into Content — upsell */}
        <section>
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Turn quotes into content
                </h3>
                <p className="text-gray-600 mb-4">
                  With the Regular plan, auto-generate branded social media images
                  from your best customer quotes. Ready for Instagram, Facebook,
                  and TikTok — one click to download.
                </p>
                <p className="text-gray-600">
                  Advanced plan unlocks a monthly social media pack — 4-8
                  ready-to-post images with your branding, stats highlights,
                  and customer quotes. Just download and share.
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-6 border border-dashed border-gray-300">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div
                    className="w-16 h-16 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${ACCENT}20` }}
                  >
                    <MessageCircle className="w-6 h-6" style={{ color: ACCENT }} />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-700 text-base">Quote Card Generator</div>
                    <div>Available on Regular + Advanced plans</div>
                  </div>
                </div>
                <div className="rounded-lg p-4" style={{ backgroundColor: `${ACCENT}10` }}>
                  <p className="text-sm italic text-gray-600 mb-1">&ldquo;Best IPA I've ever had. Staff was incredible.&rdquo;</p>
                  <p className="text-xs text-gray-400">— Survey Respondent &middot; Your Logo &middot; Your Colors</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to hear from your customers?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
            Your survey is already built and branded. Claim it for free and
            start collecting insights today.
          </p>
          <Link
            to="/claim"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-lg font-semibold text-[#2C2C2C] transition-all hover:scale-105"
            style={{ backgroundColor: ACCENT }}
          >
            Claim Your Free Survey
            <ArrowRight className="w-5 h-5" />
          </Link>
        </section>
      </div>
    </>
  );
};

function SectionHeader({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${ACCENT}20` }}
      >
        <Icon className="w-5 h-5" style={{ color: ACCENT }} />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

export default InsightsPreview;
