import Link from 'next/link';
import { categoryName, categoryColor } from '@/lib/categories';

function formatDate(date) {
  if (!date) return '';

  const d = new Date(date);

  return new Intl.DateTimeFormat('az-AZ', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

export default function ArticleCard({ article }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group block"
    >
      {/* ŞƏKİL */}
      <div className="relative mb-3 aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">

        {article.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image_url}
            alt={article.title || 'PANORAMA XƏBƏR'}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#102A43]">
            <span className="text-xs font-bold tracking-[0.15em] text-white/30">
              PANORAMA
            </span>
          </div>
        )}

        {/* Şəkil üzərində kateqoriya */}
        <div className="absolute left-3 top-3">
          <span
            className="rounded-md bg-white/95 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] shadow-sm"
            style={{
              color: categoryColor(article.category),
            }}
          >
            {categoryName(article.category)}
          </span>
        </div>
      </div>

      {/* KATEQORİYA */}
      <div
        className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.15em]"
        style={{
          color: categoryColor(article.category),
        }}
      >
        {categoryName(article.category)}
      </div>

      {/* BAŞLIQ */}
      <h3 className="line-clamp-2 text-[17px] font-bold leading-[1.3] tracking-[-0.01em] text-[#172B4D] transition-colors duration-200 group-hover:text-[#1D4E89]">
        {article.title}
      </h3>

      {/* XÜLASƏ */}
      {article.excerpt && (
        <p className="mt-2 line-clamp-2 text-[12.5px] leading-relaxed text-slate-500">
          {article.excerpt}
        </p>
      )}

      {/* TARİX + SAAT + BAXIŞ */}
      <div className="mt-3 flex items-center gap-3 border-t border-slate-100 pt-2.5 text-[10px] text-slate-400">

        {article.created_at && (
          <span>
            {formatDate(article.created_at)}
          </span>
        )}

        {article.created_at && article.views != null && (
          <span className="text-slate-300">
            •
          </span>
        )}

        {article.views != null && (
          <span className="flex items-center gap-1">
            <span className="text-[10px]">◉</span>
            {article.views}
          </span>
        )}

        {article.source && (
          <>
            <span className="text-slate-300">
              •
            </span>

            <span className="truncate">
              {article.source}
            </span>
          </>
        )}

      </div>
    </Link>
  );
}
