import { Calendar, ExternalLink, User } from "lucide-react";
import type { NewsArticle } from "@/hooks/usePanelNews";

interface Props {
  article: NewsArticle;
  accentColor?: string;
}

const NewsArticleCard = ({ article, accentColor = "#D4AF37" }: Props) => {
  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={article.image_url || undefined}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        {article.category && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: accentColor }}
          >
            {article.category}
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 leading-snug line-clamp-3 mb-2 group-hover:text-opacity-80">
          {article.title}
        </h3>

        {article.excerpt && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-3">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
          <div className="flex items-center gap-3">
            {formattedDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
            )}
            {article.author && (
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                <span className="truncate max-w-[120px]">{article.author}</span>
              </span>
            )}
          </div>
          <span className="font-medium" style={{ color: accentColor }}>
            {article.source_name}
          </span>
        </div>

        <div className="mt-3 flex items-center text-xs font-medium gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: accentColor }}>
          Read article <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </div>
    </a>
  );
};

export default NewsArticleCard;
