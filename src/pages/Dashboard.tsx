import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { useDashboardAnalytics } from "@/hooks/useDashboardAnalytics";
import { useExportCSV } from "@/hooks/useExportCSV";
import { buildBreweryMockData } from "@/data/sampleData";
import ScoreGauge from "@/components/charts/ScoreGauge";
import HorizontalBar from "@/components/charts/HorizontalBar";
import DonutChart from "@/components/charts/DonutChart";
import StackedBar from "@/components/charts/StackedBar";
import SpendChart from "@/components/charts/SpendChart";
import QuoteCarousel from "@/components/charts/QuoteCarousel";
import QRGenerator from "@/components/QRGenerator";
import QuoteCardGenerator from "@/components/QuoteCardGenerator";
import {
  Beer,
  QrCode,
  CheckCircle2,
  Download,
  LogOut,
  Loader2,
  BarChart3,
  ExternalLink,
} from "lucide-react";

const ACCENT = "#D4AF37";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { location, responseCount, monthlyCount, loading } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const breweryName = location?.name || user?.user_metadata?.brewery_name || "Your Brewery";
  const accentColor = location?.primary_color || ACCENT;
  const isBasic = (location as any)?.tier === "basic" || !(location as any)?.tier;
  const capWarning = isBasic && monthlyCount >= 80;
  const capReached = isBasic && monthlyCount >= 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard nav */}
      <nav className="bg-[#2C2C2C] border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            {location?.logo_url ? (
              <img src={location.logo_url} alt="" className="w-7 h-7 rounded" />
            ) : (
              <Beer className="w-6 h-6" style={{ color: accentColor }} />
            )}
            <span className="text-white font-semibold">{breweryName}</span>
            {responseCount > 0 && (
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
                {responseCount} responses
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400 hidden sm:block">{user?.email}</span>
            <button
              onClick={signOut}
              className="text-gray-400 hover:text-white transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Response cap warning for Basic tier */}
      {capReached && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3 text-center text-sm text-red-800">
          <strong>Response limit reached.</strong> Your Basic plan allows 100 responses/month ({monthlyCount} used).
          New survey responses are paused until next month.{" "}
          <Link to="/pricing" className="underline font-semibold">Upgrade to Regular</Link> for unlimited responses.
        </div>
      )}
      {capWarning && !capReached && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3 text-center text-sm text-amber-800">
          <strong>Approaching limit:</strong> {monthlyCount} of 100 monthly responses used on your Basic plan.{" "}
          <Link to="/pricing" className="underline font-semibold">Upgrade to Regular</Link> for unlimited responses.
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-8">
        {responseCount === 0 ? (
          <EmptyState breweryName={breweryName} accentColor={accentColor} locationId={location?.id} />
        ) : responseCount < 25 ? (
          <EarlyState
            breweryName={breweryName}
            accentColor={accentColor}
            responseCount={responseCount}
            locationId={location?.id}
          />
        ) : (
          <FullDashboard
            accentColor={accentColor}
            locationId={location?.id}
            locationName={breweryName}
            secondaryColor={location?.secondary_color || "#2C2C2C"}
            tier={(location as any)?.tier || "basic"}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================
// 0 responses — onboarding / get started
// ============================================================
function EmptyState({
  breweryName,
  accentColor,
  locationId,
}: {
  breweryName: string;
  accentColor: string;
  locationId?: string;
}) {
  const surveyUrl = locationId
    ? `${window.location.origin}/survey?loc=${locationId}`
    : `${window.location.origin}/survey`;

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome, {breweryName}
        </h1>
        <p className="text-gray-500 text-lg">
          Your survey is ready. Let's get your first responses.
        </p>
      </div>

      {/* Get Started checklist */}
      <div className="bg-white rounded-2xl border border-gray-200 p-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" style={{ color: accentColor }} />
          Get Started Checklist
        </h2>
        <div className="space-y-5">
          {[
            {
              done: true,
              title: "Account created",
              desc: "You're signed in and your survey is live.",
            },
            {
              done: false,
              title: "Download your QR codes",
              desc: "Print them for table tents, coasters, bar mats, and menus. Use the QR generator below.",
            },
            {
              done: false,
              title: "Place QR codes at your location",
              desc: "Best spots: on tables, at the bar, on receipts, and near the exit.",
            },
            {
              done: false,
              title: "Get your first response",
              desc: "Once a customer scans and completes the survey, your dashboard lights up.",
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-4">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  item.done ? "" : "border-2 border-gray-300"
                }`}
                style={item.done ? { backgroundColor: accentColor } : undefined}
              >
                {item.done && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
              <div>
                <h3 className={`font-semibold ${item.done ? "text-gray-400 line-through" : "text-gray-900"}`}>
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QR Code Generator + Survey Link */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <QRGenerator
          url={surveyUrl}
          breweryName={breweryName}
          accentColor={accentColor}
        />
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
              <QrCode className="w-4 h-4" />
              Your Survey Link
            </h3>
            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
              <code className="text-sm text-gray-700 flex-1 truncate">{surveyUrl}</code>
              <a
                href={surveyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-700"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Share this link directly or use the QR code — they go to the same place.
            </p>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="max-w-4xl mx-auto">
        <DashboardPreview accentColor={accentColor} />
      </div>
    </div>
  );
}

// ============================================================
// 1-24 responses — early data, encouraging
// ============================================================
function EarlyState({
  breweryName,
  accentColor,
  responseCount,
  locationId,
}: {
  breweryName: string;
  accentColor: string;
  responseCount: number;
  locationId?: string;
}) {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{breweryName}</h1>
          <p className="text-gray-500">
            {responseCount} response{responseCount !== 1 ? "s" : ""} so far — trends
            become more reliable after 25+
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold" style={{ color: accentColor }}>
            {responseCount}
          </div>
          <div className="text-xs text-gray-400">of 25 for full insights</div>
          <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${Math.min(100, (responseCount / 25) * 100)}%`,
                backgroundColor: accentColor,
              }}
            />
          </div>
        </div>
      </div>

      {/* Show preview with "collecting data" overlay */}
      <DashboardPreview accentColor={accentColor} />

      <div className="text-center py-4">
        <p className="text-sm text-gray-500">
          Keep those QR codes visible — every response makes your insights sharper.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// 25+ responses — full dashboard with REAL data
// ============================================================
function FullDashboard({
  accentColor,
  locationId,
  locationName,
  secondaryColor,
  tier,
}: {
  accentColor: string;
  locationId?: string;
  locationName?: string;
  secondaryColor?: string;
  tier?: string;
}) {
  const { data, loading, error } = useDashboardAnalytics(
    locationId,
    accentColor,
    secondaryColor || "#2C2C2C"
  );
  const { exportCSV, exporting } = useExportCSV();
  const [exportRange, setExportRange] = useState<"30" | "90" | "all">("30");
  const canExport = tier && tier !== "basic";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
      </div>
    );
  }

  // Fallback to mock data if analytics query fails or returns empty
  if (error || !data) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="w-6 h-6" style={{ color: accentColor }} />
          <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
            Could not load analytics: {error}
          </div>
        )}
        <DashboardPreview accentColor={accentColor} showBanner={false} />
      </div>
    );
  }

  const d = data;
  const returningPct = d.newVsReturning.find((r) => r.label === "Returning")?.value || 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <BarChart3 className="w-6 h-6" style={{ color: accentColor }} />
        <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
      </div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <p className="text-gray-500">
          Live data from your customers. Updated in real time.
        </p>

        {/* Export Controls */}
        {canExport ? (
          <div className="flex items-center gap-2">
            <select
              value={exportRange}
              onChange={(e) => setExportRange(e.target.value as "30" | "90" | "all")}
              className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 text-gray-700 bg-white"
            >
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="all">All time</option>
            </select>
            <button
              onClick={() => exportCSV({ locationId: locationId!, locationName: locationName || "export", dateRange: exportRange })}
              disabled={exporting}
              className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              {exporting ? "Exporting..." : "Export CSV"}
            </button>
          </div>
        ) : (
          <div className="text-xs text-gray-400">
            <Link to="/pricing" className="underline hover:text-gray-600">Upgrade to Regular</Link> to export your data
          </div>
        )}
      </div>

      {/* Row 1: Experience + Return Likelihood */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScoreGauge
          label="Overall Experience"
          score={d.overallExperience.score}
          distribution={d.overallExperience.distribution}
          accentColor={accentColor}
        />
        <StackedBar
          title="Return Likelihood"
          summaryPct={d.returnLikelihood.summary}
          summaryLabel="would definitely or probably return"
          data={d.returnLikelihood.data}
        />
      </div>

      {/* Row 2: New vs Returning + Visit Drivers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DonutChart
          title="New vs Returning"
          data={d.newVsReturning}
          centerValue={`${returningPct}%`}
          centerLabel="returning"
        />
        <HorizontalBar
          title="What Brought Them In"
          data={d.visitDrivers}
          accentColor={accentColor}
        />
      </div>

      {/* Row 3: What They Had + Beer Styles */}
      {(d.whatTheyHad.length > 0 || d.beerStyles.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {d.whatTheyHad.length > 0 && (
            <HorizontalBar
              title="What They Had"
              data={d.whatTheyHad}
              accentColor={accentColor}
            />
          )}
          {d.beerStyles.length > 0 && (
            <HorizontalBar
              title="Beer Styles"
              data={d.beerStyles}
              accentColor={accentColor}
            />
          )}
        </div>
      )}

      {/* Row 4: Service Rating + Vibe */}
      {(d.serviceRating.score > 0 || d.vibeDescription.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {d.serviceRating.score > 0 && (
            <ScoreGauge
              label="Service Rating"
              score={d.serviceRating.score}
              distribution={d.serviceRating.distribution}
              accentColor={accentColor}
            />
          )}
          {d.vibeDescription.length > 0 && (
            <DonutChart
              title="Vibe Description"
              data={d.vibeDescription}
            />
          )}
        </div>
      )}

      {/* Row 5: Spend + Value Most */}
      {(d.spendPerVisit.length > 0 || d.valueMost.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {d.spendPerVisit.length > 0 && (
            <SpendChart
              title="Spend Per Visit"
              data={d.spendPerVisit}
              accentColor={accentColor}
            />
          )}
          {d.valueMost.length > 0 && (
            <HorizontalBar
              title="What They Value Most"
              data={d.valueMost}
              accentColor={accentColor}
            />
          )}
        </div>
      )}

      {/* Row 6: Social + Visit More */}
      {(d.socialFollow.length > 0 || d.visitMore.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {d.socialFollow.length > 0 && (
            <DonutChart
              title="Follow on Social?"
              data={d.socialFollow}
            />
          )}
          {d.visitMore.length > 0 && (
            <HorizontalBar
              title="What Would Bring Them Back"
              data={d.visitMore}
              accentColor={accentColor}
            />
          )}
        </div>
      )}

      {/* Fun Quotes */}
      {d.funQuotes.length > 0 && (
        <QuoteCarousel
          title="Fun Quotes from Your Customers"
          quotes={d.funQuotes}
          accentColor={accentColor}
        />
      )}

      {/* Quote Card Generator — Regular+ */}
      {canExport && d.funQuotes.length > 0 && (
        <QuoteCardGenerator
          quotes={d.funQuotes}
          locationName={locationName || "Your Brewery"}
          accentColor={accentColor}
        />
      )}
    </div>
  );
}

// ============================================================
// Sample charts with optional "preview" banner
// ============================================================
function DashboardPreview({
  accentColor,
  showBanner = true,
}: {
  accentColor: string;
  showBanner?: boolean;
}) {
  const d = buildBreweryMockData(accentColor, "#2C2C2C");

  return (
    <div className="space-y-6">
      {showBanner && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-gray-700 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 flex-shrink-0" style={{ color: accentColor }} />
          <span>
            <strong>Preview mode</strong> — this is sample data showing what your
            dashboard will look like with real responses.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScoreGauge
          label="Overall Experience"
          score={d.overallExperience.score}
          distribution={d.overallExperience.distribution}
          accentColor={accentColor}
        />
        <StackedBar
          title="Return Likelihood"
          summaryPct={d.returnLikelihood.summary}
          summaryLabel="would definitely or probably return"
          data={d.returnLikelihood.data}
        />
        <DonutChart
          title="New vs Returning"
          data={d.newVsReturning}
          centerValue="66%"
          centerLabel="returning"
        />
        <HorizontalBar
          title="What Brought Them In"
          data={d.visitDrivers}
          accentColor={accentColor}
        />
      </div>
    </div>
  );
}
