'use client';

import Link from 'next/link';

export default function NewsTicker({ articles = [] }) {
  if (!articles.length) return null;

  // Köhnə işləyən lent məntiqi
  const items = [...articles, ...articles];

  return (
    <section className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-0 sm:px-4 lg:px-0">
        <div className="flex h-[52px] items-center overflow-hidden">

          {/* SON DƏQİQƏ */}
          <div className="relative flex h-full flex-none items-center border-r border-slate-200 bg-[#102A43] px-4 sm:px-5">

            {/* Aşağı vurğu xətti */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#C62828]" />

            {/* Canlı nöqtə */}
            <div className="relative mr-3 flex h-3 w-3 items-center justify-center">
              <span className="absolute h-3 w-3 animate-ping rounded-full bg-[#C62828]/30" />
              <span className="relative h-2 w-2 rounded-full bg-[#C62828]" />
            </div>

            <div className="leading-none">
              <div className="text-[9px] font-medium uppercase tracking-[0.16em] text-white/50">
                CANLI
              </div>

              <div className="mt-1 whitespace-nowrap text-[10px] font-extrabold uppercase tracking-[0.12em] text-white sm:text-[11px]">
                SON DƏQİQƏ
              </div>
            </div>
          </div>

          {/* XƏBƏR LENTİ — KÖHNƏ İŞLƏYƏN MƏNTİQ */}
          <div className="relative h-full flex-1 overflow-hidden">

            <div className="absolute left-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-r from-white to-transparent pointer-events-none" />

            <div className="absolute right-0 top-0 bottom-0 z-10 w-10 bg-gradient-to-l from-white to-transparent pointer-events-none" />

            <div className="news-ticker flex h-full items-center whitespace-nowrap">

              {items.map((article, index) => (
                <Link
                  key={`${article.id}-${index}`}
                  href={`/article/${article.slug}`}
                  className="group flex h-full items-center gap-3 px-5 text-[13px] font-medium text-[#263A4D] transition-colors hover:text-[#102A43] sm:px-7"
                >

                  {/* Xəbər nöqtəsi */}
                  <span className="h-1.5 w-1.5 flex-none rounded-full bg-[#C62828] transition-transform group-hover:scale-125" />

                  <span className="max-w-[420px] truncate">
                    {article.title}
                  </span>

                  <span className="text-slate-300">
                    •
                  </span>

                </Link>
              ))}

            </div>
          </div>

          {/* Sağ tərəf */}
          <div className="hidden flex-none items-center border-l border-slate-200 bg-slate-50 px-4 xl:flex">
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-400">
              XƏBƏR AXINI
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
