'use client';

import Link from 'next/link';

export default function NewsTicker({ articles = [] }) {
  if (!articles.length) return null;

  const items = [...articles, ...articles];

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-7xl px-0 sm:px-4 lg:px-0">
        <div className="relative flex h-[54px] items-stretch overflow-hidden border-y border-slate-200 bg-white">

          {/* =====================================================
              PREMIUM SON DƏQİQƏ BLOKU
          ===================================================== */}

          <div className="relative z-20 flex flex-none items-center bg-[#102A43] px-4 sm:px-5">

            {/* Dekorativ qırmızı xətt */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#C62828]" />

            {/* Canlı indikator */}
            <div className="mr-3 flex items-center">
              <span className="relative flex h-3 w-3 items-center justify-center">
                <span className="absolute h-3 w-3 animate-ping rounded-full bg-[#C62828]/40" />
                <span className="relative h-[7px] w-[7px] rounded-full bg-[#E53935]" />
              </span>
            </div>

            <div className="flex flex-col justify-center leading-none">
              <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/50">
                CANLI
              </span>

              <span className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.1em] text-white">
                SON DƏQİQƏ
              </span>
            </div>

            {/* Sağ ayırıcı */}
            <div className="ml-5 h-7 w-px bg-white/15" />
          </div>

          {/* =====================================================
              XƏBƏR AXINI
          ===================================================== */}

          <div className="relative min-w-0 flex-1 overflow-hidden">

            {/* Sol fade */}
            <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-12 bg-gradient-to-r from-white via-white/90 to-transparent" />

            {/* Sağ fade */}
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-12 bg-gradient-to-l from-white via-white/90 to-transparent" />

            <div className="news-ticker-premium flex h-full w-max items-center">

              {items.map((article, index) => (
                <Link
                  key={`${article.id}-${index}`}
                  href={`/article/${article.slug}`}
                  className="group flex h-full items-center px-5 sm:px-7"
                >
                  <span className="mr-3 h-[5px] w-[5px] flex-none rounded-full bg-[#C62828] transition-transform duration-200 group-hover:scale-150" />

                  <span className="max-w-[430px] truncate text-[12px] font-medium text-[#34495E] transition-colors duration-200 group-hover:text-[#102A43] sm:max-w-[520px] sm:text-[13px]">
                    {article.title}
                  </span>

                  <span className="mx-5 text-[14px] text-slate-300">
                    /
                  </span>
                </Link>
              ))}

            </div>
          </div>

          {/* =====================================================
              SAĞ ETİKET
          ===================================================== */}

          <div className="hidden flex-none items-center border-l border-slate-200 bg-slate-50 px-5 xl:flex">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C62828]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#64748B]">
                XƏBƏR AXINI
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
