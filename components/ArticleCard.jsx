import Link from 'next/link';
import { categoryName, categoryColor } from '@/lib/categories';

export default function ArticleCard({ article }) {
  const date = article.created_at
    ? new Date(article.created_at).toLocaleDateString(
        'az-AZ',
        {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }
      )
    : '';

  const time = article.created_at
    ? new Date(article.created_at).toLocaleTimeString(
        'az-AZ',
        {
          hour: '2-digit',
          minute: '2-digit',
        }
      )
    : '';

  return (
    <Link
      href={`/article/${article.slug}`}
      className="group block h-full"
    >
      <article className="h-full bg-white border border-gray-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">

        {/* =================================================
            ŞƏKİL
        ================================================= */}

        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">

          {article.image_url ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.image_url}
                alt={
                  article.title ||
                  'Panorama xəbər'
                }
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* ŞƏKİL ÜZƏRİNDƏ TƏBƏQƏ */}

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="text-3xl mb-1">
                  📰
                </div>

                <span className="text-xs text-gray-400">
                  Şəkil yoxdur
                </span>
              </div>
            </div>
          )}

          {/* BREAKING */}

          {article.is_breaking && (
            <div className="absolute top-3 left-3">

              <span className="inline-flex items-center gap-1 bg-red-600 text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                Təcili
              </span>

            </div>
          )}

          {/* KATEQORİYA */}

          {!article.is_breaking && (
            <div className="absolute top-3 left-3">

              <span
                className="inline-block bg-white/95 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
                style={{
                  color: categoryColor(
                    article.category
                  ),
                }}
              >
                {categoryName(article.category)}
              </span>

            </div>
          )}

          {/* BAXIŞ */}

          {typeof article.views === 'number' && (
            <div className="absolute bottom-3 right-3">

              <span className="bg-black/60 text-white px-2 py-1 text-[10px] backdrop-blur-sm">
                {article.views} baxış
              </span>

            </div>
          )}

        </div>


        {/* =================================================
            MƏZMUN
        ================================================= */}

        <div className="p-4">

          {/* KATEQORİYA + TARİX */}

          <div className="flex items-center justify-between gap-3 mb-2">

            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{
                color: categoryColor(
                  article.category
                ),
              }}
            >
              {categoryName(article.category)}
            </span>

            {date && (
              <span className="text-[10px] text-gray-400 whitespace-nowrap">
                {date}
              </span>
            )}

          </div>


          {/* BAŞLIQ */}

          <h2 className="text-[17px] md:text-[18px] font-bold leading-[1.3] text-[#111827] line-clamp-3 group-hover:text-[#2563eb] transition-colors">
            {article.title}
          </h2>


          {/* AÇIQLAMA */}

          {article.excerpt && (
            <p className="mt-2.5 text-[13px] leading-relaxed text-gray-500 line-clamp-2">
              {article.excerpt}
            </p>
          )}


          {/* ALT HİSSƏ */}

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">

            <div className="flex items-center gap-2">

              {/* SAAT */}

              {time && (
                <span className="text-[10px] text-gray-400">
                  {time}
                </span>
              )}

              {article.source && (
                <>
                  <span className="text-gray-300">
                    •
                  </span>

                  <span className="text-[10px] text-gray-400 truncate max-w-[100px]">
                    {article.source}
                  </span>
                </>
              )}

            </div>


            {/* ƏTRAFLI OXU */}

            <span className="text-[10px] font-bold uppercase tracking-wider text-[#172b4d] group-hover:text-[#2563eb] transition-colors">
              Oxu →
            </span>

          </div>

        </div>

      </article>
    </Link>
  );
}