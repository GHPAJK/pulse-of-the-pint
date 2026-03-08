import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useDashboard } from "@/hooks/useDashboard";
import { buildBreweryMockData } from "@/data/sampleData";
import ScoreGauge from "@/components/charts/ScoreGauge";
import HorizontalBar from "@/components/charts/HorizontalBar";
import DonutChart from "@/components/charts/DonutChart";
import StackedBar from "@/components/charts/StackedBar";
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
  const { location, responseCount, loading } = useDashboard();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  const breweryName = location?.name || user?.user_metadata?.brewery_name || "Your Brewery";
  const accentColor = location?.primary_color || ACCENT;

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
          <FullDashboard accentColor={accentColor} />
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
              desc: "Print them for table tents, coasters, bar mats, and menus.",
              action: (
                <button
                  className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg text-sm font-semibold text-[#2C2C2C] transition-all hover:scale-105"
                  style={{ backgroundColor: accentColor }}
                >
                  <Download className="w-4 h-4" />
                  Download QR Code (coming soon)
                </button>
              ),
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
                {item.action}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Survey link */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-2xl mx-auto">
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

      {/* Preview */}
      <div className="max-w-2xl mx-auto">
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
// 25+ responses — full dashboard (placeholder for now)
// ============================================================
function FullDashboard({ accentColor }: { accentColor: string }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-2">
        <BarChart3 className="w-6 h-6" style={{ color: accentColor }} />
        <h1 className="text-2xl font-bold text-gray-900">Your Dashboard</h1>
      </div>
      <p className="text-gray-500">
        Live data from your customers. Updated in real time.
      </p>

      {/* TODO: Replace with live Supabase queries */}
      <DashboardPreview accentColor={accentColor} showBanner={false} />
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
