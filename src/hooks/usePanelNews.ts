import { useQuery } from "@tanstack/react-query";

const SUPABASE_URL = "https://aaybsowygiaxrawxpmqj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFheWJzb3d5Z2lheHJhd3hwbXFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI0ODk1NjEsImV4cCI6MjA4ODA2NTU2MX0.dymT9LZdTu-hcU5ylF4_LkSiN3HMq7aCQYGSYNyR52U";
const PANEL_SLUG = "pulse-of-the-pint";

export interface NewsArticle {
  id: string;
  title: string;
  url: string;
  source_name: string;
  excerpt: string | null;
  image_url: string | null;
  category: string | null;
  author: string | null;
  published_at: string | null;
  fetched_at: string;
}

// Fallback images for articles without images — all Unsplash (free, permanent URLs)
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&h=400&fit=crop", // beer taps
  "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=600&h=400&fit=crop", // beer glasses
  "https://images.unsplash.com/photo-1559526642-c3f001ea68ee?w=600&h=400&fit=crop", // hops closeup
  "https://images.unsplash.com/photo-1532634922-8fe0b757fb13?w=600&h=400&fit=crop", // brewery tanks
  "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=600&h=400&fit=crop", // craft beer flight
  "https://images.unsplash.com/photo-1504502350688-00f5d59bbdeb?w=600&h=400&fit=crop", // pint glass
  "https://images.unsplash.com/photo-1436076863939-06870fe779c2?w=600&h=400&fit=crop", // brewery interior
  "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=600&h=400&fit=crop", // beer pour
  "https://images.unsplash.com/photo-1566633806327-68e152aaf26d?w=600&h=400&fit=crop", // grain/barley
  "https://images.unsplash.com/photo-1584225064785-c62a8b43d148?w=600&h=400&fit=crop", // beer bottles
  "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&h=400&fit=crop", // taproom
  "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=600&h=400&fit=crop", // beer garden
];

function assignFallbackImage(index: number): string {
  return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
}

/**
 * Interleave articles so no single source dominates the feed.
 * Round-robin across sources, preserving recency within each source.
 */
function interleaveBySource(articles: NewsArticle[]): NewsArticle[] {
  if (articles.length <= 1) return articles;

  // Group by source, preserving order (already sorted by published_at desc)
  const buckets = new Map<string, NewsArticle[]>();
  for (const a of articles) {
    const key = a.source_name;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key)!.push(a);
  }

  // Round-robin: take one from each source in turn
  const result: NewsArticle[] = [];
  const iterators = Array.from(buckets.values()).map((arr) => ({ arr, idx: 0 }));
  let remaining = articles.length;

  while (remaining > 0) {
    for (const it of iterators) {
      if (it.idx < it.arr.length) {
        result.push(it.arr[it.idx]);
        it.idx++;
        remaining--;
      }
    }
  }

  return result;
}

async function fetchNews(category?: string): Promise<NewsArticle[]> {
  const params = new URLSearchParams({
    select: "id,title,url,source_name,excerpt,image_url,category,author,published_at,fetched_at",
    is_active: "eq.true",
    order: "published_at.desc.nullslast,fetched_at.desc",
    limit: "30",
  });

  const panelRes = await fetch(
    `${SUPABASE_URL}/rest/v1/panels?slug=eq.${PANEL_SLUG}&select=id`,
    { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
  );
  const panels = await panelRes.json();
  if (!panels?.length) return [];

  params.set("panel_id", `eq.${panels[0].id}`);
  if (category && category !== "all") {
    params.set("category", `eq.${category}`);
  }

  const res = await fetch(`${SUPABASE_URL}/rest/v1/panel_articles?${params}`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` },
  });
  if (!res.ok) throw new Error(`Failed to fetch news: ${res.status}`);

  const articles: NewsArticle[] = await res.json();

  // Assign fallback images to articles missing one
  let fallbackIdx = 0;
  for (const article of articles) {
    if (!article.image_url) {
      article.image_url = assignFallbackImage(fallbackIdx++);
    }
  }

  // Interleave so no single source dominates
  return interleaveBySource(articles);
}

export function usePanelNews(category?: string) {
  return useQuery({
    queryKey: ["panel-news", PANEL_SLUG, category],
    queryFn: () => fetchNews(category),
    staleTime: 30 * 60 * 1000,
    retry: 2,
  });
}
