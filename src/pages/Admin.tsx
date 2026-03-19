import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  Download,
  Upload,
  Loader2,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RotateCcw,
} from "lucide-react";

type DatePreset = "30" | "90" | "custom";

interface SessionRow {
  id: string;
  location_name: string;
  city: string;
  state: string;
  vertical: string;
  completed_at: string;
  duration_seconds: number;
  device_type: string;
  source: string;
  first_name: string | null;
  email: string | null;
  zip: string | null;
  quality_flags: Record<string, boolean>;
  excluded: boolean;
  exclude_reason: string | null;
  responses: Record<string, string | string[]>;
}

export default function Admin() {
  const [preset, setPreset] = useState<DatePreset>("30");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [vertical, setVertical] = useState<string>("");
  const [includeExcluded, setIncludeExcluded] = useState(false);

  const [loading, setLoading] = useState(false);
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [stats, setStats] = useState<{ count: number } | null>(null);
  const [error, setError] = useState("");

  // Import state
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  function getDateRange(): { from: string; to: string } {
    const now = new Date();
    const to = now.toISOString();

    if (preset === "custom" && dateFrom && dateTo) {
      return {
        from: new Date(dateFrom).toISOString(),
        to: new Date(dateTo + "T23:59:59").toISOString(),
      };
    }

    const days = preset === "90" ? 90 : 30;
    const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return { from: from.toISOString(), to };
  }

  async function handleExport() {
    setLoading(true);
    setError("");

    try {
      const { from, to } = getDateRange();
      const { data, error: rpcError } = await supabase.rpc("export_sessions", {
        p_date_from: from,
        p_date_to: to,
        p_vertical: vertical || null,
        p_include_excluded: includeExcluded,
      });

      if (rpcError) {
        setError(rpcError.message);
        return;
      }

      if (data?.error) {
        setError(data.error);
        return;
      }

      setSessions(data.sessions || []);
      setStats({ count: data.count });
    } catch (err) {
      setError("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function downloadCSV() {
    if (sessions.length === 0) return;

    // Collect all unique response variable names across all sessions
    const allVars = new Set<string>();
    sessions.forEach((s) => {
      if (s.responses) {
        Object.keys(s.responses).forEach((k) => allVars.add(k));
      }
    });
    const sortedVars = Array.from(allVars).sort();

    const headers = [
      "id",
      "location_name",
      "city",
      "state",
      "vertical",
      "completed_at",
      "duration_seconds",
      "device_type",
      "source",
      "first_name",
      "email",
      "zip",
      "quality_flags",
      "excluded",
      "exclude_reason",
      ...sortedVars,
    ];

    const rows = sessions.map((s) => {
      const base = [
        s.id,
        s.location_name || "",
        s.city || "",
        s.state || "",
        s.vertical || "",
        s.completed_at || "",
        String(s.duration_seconds || ""),
        s.device_type || "",
        s.source || "",
        s.first_name || "",
        s.email || "",
        s.zip || "",
        Object.keys(s.quality_flags || {}).join("; "),
        String(s.excluded),
        s.exclude_reason || "",
      ];

      const responseValues = sortedVars.map((v) => {
        const val = s.responses?.[v];
        if (val == null) return "";
        if (Array.isArray(val)) return val.join("; ");
        return String(val);
      });

      return [...base, ...responseValues];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const { from, to } = getDateRange();
    const fromDate = from.slice(0, 10);
    const toDate = to.slice(0, 10);
    link.download = `survey-export-${fromDate}-to-${toDate}.csv`;
    link.href = URL.createObjectURL(blob);
    link.click();
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const text = await file.text();
      const lines = text.trim().split("\n");
      const headers = parseCSVLine(lines[0]);

      const idIdx = headers.indexOf("id");
      const excludedIdx = headers.indexOf("excluded");
      const reasonIdx = headers.indexOf("exclude_reason");

      if (idIdx === -1 || excludedIdx === -1) {
        setImportResult("CSV must have 'id' and 'excluded' columns.");
        return;
      }

      const toExclude: string[] = [];
      const toRestore: string[] = [];
      const reasons: Record<string, string> = {};

      for (let i = 1; i < lines.length; i++) {
        const cols = parseCSVLine(lines[i]);
        const id = cols[idIdx]?.trim();
        const excluded = cols[excludedIdx]?.trim().toLowerCase();
        const reason = reasonIdx !== -1 ? cols[reasonIdx]?.trim() : "";

        if (!id) continue;

        if (excluded === "true" || excluded === "1" || excluded === "yes") {
          toExclude.push(id);
          if (reason) reasons[id] = reason;
        } else if (excluded === "false" || excluded === "0" || excluded === "no") {
          toRestore.push(id);
        }
      }

      let resultMsg = "";

      if (toExclude.length > 0) {
        const { data } = await supabase.rpc("flag_sessions", {
          p_session_ids: toExclude,
          p_excluded: true,
          p_reason: "Flagged via CSV review",
        });
        resultMsg += `Excluded: ${data?.updated || 0} sessions. `;
      }

      if (toRestore.length > 0) {
        const { data } = await supabase.rpc("flag_sessions", {
          p_session_ids: toRestore,
          p_excluded: false,
        });
        resultMsg += `Restored: ${data?.updated || 0} sessions.`;
      }

      setImportResult(resultMsg || "No changes detected in CSV.");
    } catch (err) {
      setImportResult("Import failed. Check CSV format and try again.");
    } finally {
      setImporting(false);
      e.target.value = "";
    }
  }

  // Parse a single CSV line respecting quoted fields
  function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ",") {
          result.push(current);
          current = "";
        } else {
          current += ch;
        }
      }
    }
    result.push(current);
    return result;
  }

  const flaggedCount = sessions.filter(
    (s) => Object.keys(s.quality_flags || {}).length > 0
  ).length;
  const excludedCount = sessions.filter((s) => s.excluded).length;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900" style={{ backgroundColor: "#f9fafb", color: "#111827" }}>
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Data Management</h1>
          <p className="text-gray-500 mt-1">
            Export survey data, review quality flags, and manage exclusions.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Export Filters
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Date preset */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Date Range
              </label>
              <select
                value={preset}
                onChange={(e) => setPreset(e.target.value as DatePreset)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="custom">Custom range</option>
              </select>
            </div>

            {/* Custom date from */}
            {preset === "custom" && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    From
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    To
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </>
            )}

            {/* Vertical filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Vertical
              </label>
              <select
                value={vertical}
                onChange={(e) => setVertical(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">All verticals</option>
                <option value="brewery">Brewery</option>
                <option value="dispensary">Dispensary</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={includeExcluded}
                onChange={(e) => setIncludeExcluded(e.target.checked)}
                className="rounded border-gray-300"
              />
              Include excluded sessions
            </label>

            <button
              onClick={handleExport}
              disabled={loading}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Calendar className="w-4 h-4" />
              )}
              Load Data
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Results */}
        {stats && (
          <>
            {/* Stats bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Total Sessions
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.count}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Quality Flagged
                </div>
                <div className="text-2xl font-bold text-amber-600">
                  {flaggedCount}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <XCircle className="w-4 h-4 text-red-500" />
                  Excluded
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {excludedCount}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                onClick={downloadCSV}
                disabled={sessions.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Download CSV ({sessions.length} rows)
              </button>

              <label className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer">
                {importing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                Upload Flagged CSV
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImport}
                  className="hidden"
                  disabled={importing}
                />
              </label>
            </div>

            {/* Import result */}
            {importResult && (
              <div className="mb-6 p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-700 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                {importResult}
              </div>
            )}

            {/* Preview table */}
            {sessions.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">
                          Location
                        </th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">
                          Date
                        </th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">
                          Duration
                        </th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">
                          Device
                        </th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">
                          Flags
                        </th>
                        <th className="text-left px-4 py-3 font-medium text-gray-500">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {sessions.slice(0, 50).map((s) => {
                        const flags = Object.keys(s.quality_flags || {});
                        return (
                          <tr
                            key={s.id}
                            className={
                              s.excluded ? "bg-red-50/50" : flags.length > 0 ? "bg-amber-50/50" : ""
                            }
                          >
                            <td className="px-4 py-3">
                              <div className="font-medium text-gray-900">
                                {s.location_name || "Unknown"}
                              </div>
                              <div className="text-xs text-gray-400">
                                {s.city}, {s.state}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {new Date(s.completed_at).toLocaleDateString()}
                            </td>
                            <td className="px-4 py-3 text-gray-600">
                              {Math.floor(s.duration_seconds / 60)}m{" "}
                              {s.duration_seconds % 60}s
                            </td>
                            <td className="px-4 py-3 text-gray-600 capitalize">
                              {s.device_type}
                            </td>
                            <td className="px-4 py-3">
                              {flags.length > 0 ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                  <AlertTriangle className="w-3 h-3" />
                                  {flags.join(", ")}
                                </span>
                              ) : (
                                <span className="text-xs text-gray-400">
                                  Clean
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {s.excluded ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                  <XCircle className="w-3 h-3" />
                                  Excluded
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Active
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {sessions.length > 50 && (
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
                    Showing first 50 of {sessions.length} sessions. Download CSV
                    for full dataset.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
