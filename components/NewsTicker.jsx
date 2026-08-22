'use client';

import Link from 'next/link';

export default function NewsTicker({ articles = [] }) {
  if (!articles.length) return null;

  const items = [...articles, ...articles];

  return (
    <div className="w-full bg-ink border-b border-white/10 overflow-hidden">
      <div className="max-w-6xl mx-auto flex items-stretch">

        {/* SON XƏBƏRLƏR ETİKETİ */}
        <div className="relative z-10 flex-none flex items-center gap-2 bg-crimson text-white px-4 sm:px-5 py-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white"></span>
          </span>

          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.12em] whitespace-nowrap">
            Son xəbərlər
          </span>
        </div>

        {/* XƏBƏR AXINI */}
        <div className="relative flex-1 overflow-hidden">

          {/* Sol tərəfdə yumşaq keçid */}
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-ink to-transparent z-[5] pointer-events-none" />

          <div className="news-ticker flex items-center whitespace-nowrap h-full">

            {items.map((article, index) => (
              <Link
                key={`${article.id}-${index}`}
                href={`/article/${article.slug}`}
                className="group inline-flex items-center gap-3 px-5 sm:px-6 py-2.5 text-[12px] sm:text-[13px] font-medium text-gray-300 hover:text-white transition-colors"
              >

                {/* Xəbər nöqtəsi */}
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500 group-hover:bg-crimson transition-colors flex-none" />

                {/* Başlıq */}
                <span>
                  {article.title}
                </span>

                {/* Ayırıcı */}
                <span className="text-gray-600 mx-1">
                  /
                </span>

              </Link>
            ))}

          </div>

          {/* Sağ tərəfdə yumşaq keçid */}
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-ink to-transparent z-[5] pointer-events-none" />

        </div>

      </div>
    </div>
  );
}