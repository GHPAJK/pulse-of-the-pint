import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface ExportOptions {
  locationId: string;
  locationName: string;
  dateRange: "30" | "90" | "all";
}

export function useExportCSV() {
  const [exporting, setExporting] = useState(false);

  const exportCSV = useCallback(async ({ locationId, locationName, dateRange }: ExportOptions) => {
    setExporting(true);

    try {
      // Calculate date filter
      let dateFrom: string | null = null;
      if (dateRange === "30") {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        dateFrom = d.toISOString();
      } else if (dateRange === "90") {
        const d = new Date();
        d.setDate(d.getDate() - 90);
        dateFrom = d.toISOString();
      }

      // Fetch sessions for this location
      let sessionsQuery = supabase
        .from("survey_sessions")
        .select("id, started_at, completed_at, duration_seconds, device_type, source, first_name, email, zip, phone, quality_flags")
        .eq("location_id", locationId)
        .eq("status", "completed")
        .eq("excluded", false)
        .order("completed_at", { ascending: false });

      if (dateFrom) {
        sessionsQuery = sessionsQuery.gte("completed_at", dateFrom);
      }

      const { data: sessions, error: sessErr } = await sessionsQuery;

      if (sessErr || !sessions || sessions.length === 0) {
        alert(sessions?.length === 0 ? "No responses found for this date range." : "Export failed. Please try again.");
        setExporting(false);
        return;
      }

      // Fetch all responses for these sessions
      const sessionIds = sessions.map((s) => s.id);

      // Supabase .in() has a limit, batch if needed
      const batchSize = 100;
      const allResponses: any[] = [];

      for (let i = 0; i < sessionIds.length; i += batchSize) {
        const batch = sessionIds.slice(i, i + batchSize);
        const { data: responses } = await supabase
          .from("survey_responses")
          .select("session_id, variable_name, response_value, response_values, response_text")
          .in("session_id", batch);

        if (responses) {
          allResponses.push(...responses);
        }
      }

      // Group responses by session
      const responseMap: Record<string, Record<string, string>> = {};
      const allVariables = new Set<string>();

      for (const r of allResponses) {
        if (!responseMap[r.session_id]) {
          responseMap[r.session_id] = {};
        }
        allVariables.add(r.variable_name);

        if (r.response_values && r.response_values.length > 0) {
          responseMap[r.session_id][r.variable_name] = r.response_values.join("; ");
        } else if (r.response_text) {
          responseMap[r.session_id][r.variable_name] = r.response_text;
        } else if (r.response_value) {
          responseMap[r.session_id][r.variable_name] = r.response_value;
        }
      }

      // Sort variables for consistent column order
      const sortedVars = Array.from(allVariables).sort((a, b) => {
        // Core first (P1-P7), then blocks (B1A-B5B), then fun (C1-C4), then PII
        const order = (v: string) => {
          if (v.startsWith("P")) return 0;
          if (v.startsWith("B")) return 1;
          if (v.startsWith("C")) return 2;
          if (v.startsWith("PII")) return 3;
          return 4;
        };
        return order(a) - order(b) || a.localeCompare(b);
      });

      // Build CSV
      const headers = [
        "completed_at",
        "duration_seconds",
        "device_type",
        "source",
        "first_name",
        "email",
        "zip",
        "phone",
        "quality_flags",
        ...sortedVars,
      ];

      const escapeCSV = (val: string): string => {
        if (!val) return "";
        if (val.includes(",") || val.includes('"') || val.includes("\n")) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      };

      const rows = sessions.map((s) => {
        const resp = responseMap[s.id] || {};
        const flags = s.quality_flags && Object.keys(s.quality_flags).length > 0
          ? Object.keys(s.quality_flags).join("; ")
          : "";

        return [
          s.completed_at || "",
          String(s.duration_seconds || ""),
          s.device_type || "",
          s.source || "",
          s.first_name || "",
          s.email || "",
          s.zip || "",
          s.phone || "",
          flags,
          ...sortedVars.map((v) => resp[v] || ""),
        ].map(escapeCSV).join(",");
      });

      const csv = [headers.map(escapeCSV).join(","), ...rows].join("\n");

      // Download
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      const dateSuffix = new Date().toISOString().slice(0, 10);
      a.href = url;
      a.download = `${locationName.replace(/[^a-zA-Z0-9]/g, "_")}_responses_${dateRange}d_${dateSuffix}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      alert("Export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  }, []);

  return { exportCSV, exporting };
}
