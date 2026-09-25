'use client';

import Link from 'next/link';

export default function NewsTicker({ articles = [] }) {
  if (!articles.length) return null;

  const items = [...articles, ...articles];

  return (
    <section className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-0 sm:px-4 lg:px-0">
        <div className="flex h-[50px] items-center overflow-hidden">

          {/* SON XƏBƏRLƏR */}
          <div className="relative flex h-full flex-none items-center border-r border-slate-200 bg-white px-4 sm:px-5">

            {/* Qırmızı alt xətt */}
            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C62828]" />

            {/* Canlı nöqtə */}
            <div className="relative mr-3 flex h-3 w-3 items-center justify-center">
              <span className="absolute h-3 w-3 animate-ping rounded-full bg-[#C62828]/20" />
              <span className="relative h-2 w-2 rounded-full bg-[#C62828]" />
            </div>

            <div className="leading-none">
              <div className="text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                CANLI
              </div>

              <div className="mt-1 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.1em] text-[#102A43] sm:text-[11px]">
                SON DƏQİQƏ
              </div>
            </div>
          </div>

          {/* XƏBƏR LENTİ */}
          <div className="relative h-full min-w-0 flex-1 overflow-hidden bg-white">

            {/* Sol keçid */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-white to-transparent" />

            {/* Sağ keçid */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-white to-transparent" />

            <div className="news-ticker flex h-full items-center whitespace-nowrap">

              {items.map((article, index) => (
                <Link
                  key={`${article.id}-${index}`}
                  href={`/article/${article.slug}`}
                  className="group flex h-full flex-none items-center gap-3 px-5 text-[13px] font-medium text-slate-600 transition-colors hover:text-[#102A43] sm:px-7"
                >

                  {/* Xəbər nöqtəsi */}
                  <span className="h-1.5 w-1.5 flex-none rounded-full bg-[#C62828] transition-transform group-hover:scale-125" />

                  {/* Başlıq */}
                  <span className="max-w-[440px] truncate">
                    {article.title}
                  </span>

                  {/* Ayırıcı */}
                  <span className="text-slate-300">
                    •
                  </span>

                </Link>
              ))}

            </div>
          </div>

          {/* XƏBƏR AXINI */}
          <div className="hidden h-full flex-none items-center border-l border-slate-200 bg-slate-50 px-5 xl:flex">
            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-400">
              XƏBƏR AXINI
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
