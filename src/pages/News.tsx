import { Newspaper } from "lucide-react";
import { usePanelNews } from "@/hooks/usePanelNews";
import NewsArticleCard from "@/components/NewsArticleCard";
import { Skeleton } from "@/components/ui/skeleton";

const PAGE_TITLE = "Craft Beer News";
const PAGE_DESCRIPTION = "The latest buzz from the craft beer world — new releases, brewery news, and industry trends.";
const ACCENT_COLOR = "#D4AF37";

const News = () => {
  const { data: articles, isLoading, error } = usePanelNews();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <Newspaper className="h-8 w-8 mr-3" style={{ color: ACCENT_COLOR }} />
          <h1 className="text-4xl font-bold" style={{ color: ACCENT_COLOR }}>
            {PAGE_TITLE}
          </h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {PAGE_DESCRIPTION}
        </p>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
              <Skeleton className="h-48 w-full rounded-lg mb-4" />
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3 mb-4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load News</h3>
            <p className="text-red-600">Please try refreshing the page.</p>
          </div>
        </div>
      )}

      {articles && articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsArticleCard key={article.id} article={article} accentColor={ACCENT_COLOR} />
          ))}
        </div>
      )}

      {articles && articles.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Articles Yet</h3>
          <p className="text-gray-500">Check back soon for the latest craft beer news.</p>
        </div>
      )}
    </div>
  );
};

export default News;
