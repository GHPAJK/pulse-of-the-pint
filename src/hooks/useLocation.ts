import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface LocationData {
  id: string;
  name: string;
  city: string;
  state: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  instagram: string | null;
}

const DEMO_LOCATION: LocationData = {
  id: "DEMO-001",
  name: "The Craft House",
  city: "Philadelphia",
  state: "PA",
  logo_url: null,
  primary_color: "#D4AF37",
  secondary_color: "#B8860B",
  accent_color: "#F5DEB3",
  instagram: null,
};

export function useLocation() {
  const [searchParams] = useSearchParams();
  const locId = searchParams.get("loc");

  const [location, setLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocation() {
      // No loc param — use demo
      if (!locId) {
        setLocation(DEMO_LOCATION);
        setLoading(false);
        return;
      }

      // Supabase not configured — use demo with the loc ID
      if (!isSupabaseConfigured) {
        setLocation({ ...DEMO_LOCATION, id: locId });
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from("locations")
          .select("id,name,city,state,logo_url,primary_color,secondary_color,accent_color,instagram")
          .eq("id", locId)
          .single();

        if (fetchError) {
          console.error("Location fetch error:", fetchError);
          setError(`Location "${locId}" not found.`);
          setLocation(DEMO_LOCATION);
        } else if (data) {
          setLocation({
            id: data.id,
            name: data.name,
            city: data.city,
            state: data.state,
            logo_url: data.logo_url,
            primary_color: data.primary_color || "#D4AF37",
            secondary_color: data.secondary_color || "#B8860B",
            accent_color: data.accent_color || "#F5DEB3",
            instagram: data.instagram,
          });
        }
      } catch (err) {
        console.error("Failed to fetch location:", err);
        setError("Failed to load location data.");
        setLocation(DEMO_LOCATION);
      } finally {
        setLoading(false);
      }
    }

    fetchLocation();
  }, [locId]);

  return { location, loading, error, locId };
}
