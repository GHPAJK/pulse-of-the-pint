import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Beer, ArrowRight, Mail, Loader2 } from "lucide-react";

const ACCENT = "#D4AF37";

export default function Login() {
  const { signIn, signInWithMagicLink } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<"password" | "magic">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await signIn(email, password);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate("/dashboard");
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await signInWithMagicLink(email);
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setMagicSent(true);
      setLoading(false);
    }
  };

  if (magicSent) {
    return (
      <>
        <section className="bg-[#2C2C2C] text-white py-20">
          <div className="max-w-md mx-auto px-6 text-center">
            <div
              className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ backgroundColor: `${ACCENT}20` }}
            >
              <Mail className="w-8 h-8" style={{ color: ACCENT }} />
            </div>
            <h1 className="text-2xl font-bold mb-4">Check your email</h1>
            <p className="text-gray-300">
              We sent a login link to <strong>{email}</strong>. Click it to sign in
              — no password needed.
            </p>
          </div>
        </section>
        <section className="py-12 text-center">
          <button
            onClick={() => { setMagicSent(false); setEmail(""); }}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Try a different email
          </button>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="bg-[#2C2C2C] text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-4">
            <Beer className="w-8 h-8" style={{ color: ACCENT }} />
            <h1 className="text-3xl font-bold">Sign In</h1>
          </div>
          <p className="text-gray-300">
            Access your brewery dashboard and customer insights.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-md mx-auto px-6">
          {/* Mode toggle */}
          <div className="flex rounded-lg bg-gray-100 p-1 mb-8">
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === "password" ? "bg-white shadow text-gray-900" : "text-gray-500"
              }`}
              onClick={() => setMode("password")}
            >
              Email & Password
            </button>
            <button
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === "magic" ? "bg-white shadow text-gray-900" : "text-gray-500"
              }`}
              onClick={() => setMode("magic")}
            >
              Magic Link
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
              {error}
            </div>
          )}

          {mode === "password" ? (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="Your password"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-[#2C2C2C] transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{ backgroundColor: ACCENT }}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  placeholder="you@yourbrewery.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-[#2C2C2C] transition-all hover:scale-[1.02] disabled:opacity-50"
                style={{ backgroundColor: ACCENT }}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Magic Link <Mail className="w-4 h-4" /></>}
              </button>
              <p className="text-xs text-gray-400 text-center">
                We'll email you a link that signs you in instantly — no password needed.
              </p>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/claim" className="font-semibold hover:underline" style={{ color: ACCENT }}>
              Claim your free survey
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
