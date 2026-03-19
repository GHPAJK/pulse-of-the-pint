import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Beer, ArrowRight, CheckCircle2, Sparkles, MapPin, Clock, Crown, Loader2 } from "lucide-react";

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";

const ACCENT = "#D4AF37";

export default function Claim() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form fields
  const [breweryName, setBreweryName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [website, setWebsite] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || typeof window === "undefined") return;
    const id = "cf-turnstile-script";
    if (!document.getElementById(id)) {
      const script = document.createElement("script");
      script.id = id;
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad";
      script.async = true;
      document.head.appendChild(script);
    }
    (window as any).onTurnstileLoad = () => {
      if (turnstileRef.current && (window as any).turnstile) {
        (window as any).turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => setTurnstileToken(token),
        });
      }
    };
    if ((window as any).turnstile && turnstileRef.current) {
      (window as any).turnstile.render(turnstileRef.current, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => setTurnstileToken(token),
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setError("Please complete the verification check.");
      setLoading(false);
      return;
    }

    try {
      // 1. Create auth user
      const { error: authError } = await signUp(email, password, {
        full_name: contactName,
        brewery_name: breweryName,
        role_at_business: role,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // 2. Create a lead event for tracking
      await supabase.from("lead_events").insert({
        location_id: null, // Will be linked when we match or create location
        event_type: "claim_submitted",
        event_data: {
          brewery_name: breweryName,
          city,
          state: state.toUpperCase(),
          contact_name: contactName,
          email,
          role,
          website,
        },
      });

      setSubmitted(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <section className="bg-[#2C2C2C] text-white py-20">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ backgroundColor: `${ACCENT}20` }}
            >
              <CheckCircle2 className="w-8 h-8" style={{ color: ACCENT }} />
            </div>
            <h1 className="text-3xl font-bold mb-4">You're in.</h1>
            <p className="text-lg text-gray-300 mb-2">
              Welcome to Pulse of the Pint, {breweryName}.
            </p>
            <p className="text-gray-400">
              Check your email to verify your account, then sign in to access
              your dashboard — including your QR codes and survey link.
            </p>
          </div>
        </section>
        <section className="py-16">
          <div className="max-w-2xl mx-auto px-6 text-center space-y-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-[#2C2C2C] transition-all hover:scale-105"
              style={{ backgroundColor: ACCENT }}
            >
              Sign In to Your Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-sm text-gray-400">
              Or{" "}
              <Link to="/insights" className="underline hover:text-gray-600">
                preview the sample dashboard
              </Link>{" "}
              while you wait.
            </p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="bg-[#2C2C2C] text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <Beer className="w-8 h-8" style={{ color: ACCENT }} />
            <h1 className="text-4xl font-bold">Claim Your Survey</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl">
            Get your branded customer experience survey — completely free for 3 months.
            No credit card. No catch.
          </p>
        </div>
      </section>

      {/* Launch promo banner */}
      <section className="bg-white border-b border-gray-200 py-5">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200">
              <Sparkles className="w-4 h-4" style={{ color: ACCENT }} />
              <span className="font-medium text-gray-700">
                Launch special — first 50 breweries get Regular plan free for 3 months
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <MapPin className="w-4 h-4" style={{ color: ACCENT }} />
              <span>First in your state? You qualify automatically.</span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Tell us about your brewery
            </h2>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brewery / Taproom Name *
                </label>
                <input
                  type="text"
                  required
                  value={breweryName}
                  onChange={(e) => setBreweryName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="e.g. Half Full Brewery"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="e.g. Stamford"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="e.g. CT"
                    maxLength={2}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="First and last name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="you@yourbrewery.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  minLength={12}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="At least 12 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">Select...</option>
                  <option value="owner">Owner</option>
                  <option value="manager">Manager</option>
                  <option value="marketing">Marketing</option>
                  <option value="taproom_manager">Taproom Manager</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website or Instagram (optional)
                </label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="@yourbrewery or yourbrewery.com"
                />
              </div>

              {TURNSTILE_SITE_KEY && (
                <div ref={turnstileRef} className="flex justify-center" />
              )}

              <button
                type="submit"
                disabled={loading || (!!TURNSTILE_SITE_KEY && !turnstileToken)}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-lg text-lg font-semibold text-[#2C2C2C] transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{ backgroundColor: ACCENT }}
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Claim My Free Survey
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                No credit card required. By signing up you agree to our{" "}
                <Link to="/terms" className="underline">Terms</Link> and{" "}
                <Link to="/privacy" className="underline">Privacy Policy</Link>.
              </p>
            </form>
          </div>

          {/* What you get */}
          <div>
            <div className="bg-white rounded-2xl border border-gray-200 p-8 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5" style={{ color: ACCENT }} />
                <h3 className="text-lg font-bold text-gray-900">
                  What you get — free for 3 months
                </h3>
              </div>

              <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4" style={{ color: ACCENT }} />
                  <span className="text-sm font-semibold text-gray-800">
                    Launch Bonus: Regular Plan ($79/mo value)
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  The first 50 breweries — and the first in every state — get our
                  Regular plan free for 3 months. Full dashboard, unlimited
                  responses, weekly reports, and more.
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {[
                  "Your logo, colors, and name on every screen",
                  "Print-ready QR codes — table tents, coasters, menus",
                  "Full dashboard with all question breakdowns",
                  "Unlimited survey responses",
                  "Weekly email summary reports",
                  "Real-time low-score alerts",
                  "State average benchmarking",
                  "Quote card generator for social media",
                  "CSV export of aggregated data",
                  "12 months rolling history",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2
                      className="w-4 h-4 mt-0.5 flex-shrink-0"
                      style={{ color: ACCENT }}
                    />
                    <span className="text-sm text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Crown className="w-4 h-4" style={{ color: ACCENT }} />
                  <h4 className="text-sm font-semibold text-gray-700">
                    After 3 months? OGs get rewarded.
                  </h4>
                </div>
                <p className="text-sm text-gray-500">
                  Keep Regular at your locked-in OG rate of $49/mo (vs $79
                  standard), downgrade to Basic (always free), or upgrade to
                  Advanced at $129/mo (vs $199). No pressure, no auto-charge.
                  We'll check in before your trial ends.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social proof / urgency */}
      <section className="bg-[#2C2C2C] text-white py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h3 className="text-xl font-bold mb-3">
            Help us build the first national brewery experience database
          </h3>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Early adopters don't just get free access — you help shape the
            product. Your feedback drives what we build next. And when we roll
            out state and national benchmarking, you'll already have months of
            data to compare against.
          </p>
        </div>
      </section>
    </>
  );
}
