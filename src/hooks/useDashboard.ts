import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import type { LocationData } from "@/hooks/useLocation";

interface DashboardData {
  location: (LocationData & { tier?: string }) | null;
  responseCount: number;
  monthlyCount: number;
  loading: boolean;
}

export function useDashboard(): DashboardData {
  const { user } = useAuth();
  const [location, setLocation] = useState<(LocationData & { tier?: string }) | null>(null);
  const [responseCount, setResponseCount] = useState(0);
  const [monthlyCount, setMonthlyCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function fetchDashboardData() {
      try {
        // Get location linked to this user (now includes tier)
        const { data: loc } = await supabase
          .from("locations")
          .select("id,name,city,state,logo_url,primary_color,secondary_color,accent_color,instagram,tier")
          .eq("owner_id", user!.id)
          .single();

        if (loc) {
          setLocation({
            id: loc.id,
            name: loc.name,
            city: loc.city,
            state: loc.state,
            logo_url: loc.logo_url,
            primary_color: loc.primary_color || "#D4AF37",
            secondary_color: loc.secondary_color || "#B8860B",
            accent_color: loc.accent_color || "#F5DEB3",
            instagram: loc.instagram,
            tier: loc.tier || "basic",
          });

          // Get total response count
          const { count } = await supabase
            .from("survey_sessions")
            .select("*", { count: "exact", head: true })
            .eq("location_id", loc.id)
            .eq("status", "completed");

          setResponseCount(count || 0);

          // Get current month count (for cap warning on Basic tier)
          const monthStart = new Date();
          monthStart.setDate(1);
          monthStart.setHours(0, 0, 0, 0);

          const { count: mCount } = await supabase
            .from("survey_sessions")
            .select("*", { count: "exact", head: true })
            .eq("location_id", loc.id)
            .eq("status", "completed")
            .gte("completed_at", monthStart.toISOString());

          setMonthlyCount(mCount || 0);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  return { location, responseCount, monthlyCount, loading };
}
