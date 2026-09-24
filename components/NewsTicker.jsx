'use client';

import Link from 'next/link';

export default function NewsTicker({ articles = [] }) {
  if (!articles.length) return null;

  const items = [...articles, ...articles];

  return (
    <section className="w-full border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[48px] max-w-7xl">

        {/* =====================================================
            SON DƏQİQƏ
        ===================================================== */}

        <div className="relative z-20 flex flex-none items-center border-r border-slate-200 bg-[#172B4D] px-4 sm:px-5">

          {/* Qırmızı canlı nöqtə */}
          <span className="relative mr-2.5 flex h-3 w-3 items-center justify-center">
            <span className="absolute h-3 w-3 animate-ping rounded-full bg-[#C62828]/30" />
            <span className="relative h-2 w-2 rounded-full bg-[#C62828]" />
          </span>

          <span className="whitespace-nowrap text-[10px] font-extrabold uppercase tracking-[0.13em] text-white sm:text-[11px]">
            SON DƏQİQƏ
          </span>
        </div>

        {/* =====================================================
            XƏBƏR AXINI
        ===================================================== */}

        <div className="relative min-w-0 flex-1 overflow-hidden">

          {/* Sol keçid */}
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-white to-transparent" />

          {/* Sağ keçid */}
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-white to-transparent" />

          <div className="news-ticker flex h-full w-max items-center">

            {items.map((article, index) => (
              <Link
                key={`${article.id}-${index}`}
                href={`/article/${article.slug}`}
                className="group flex h-full items-center gap-3 px-5 text-[12px] font-medium text-[#263A4D] transition-colors hover:text-[#172B4D] sm:px-7 sm:text-[13px]"
              >

                {/* Xəbər nöqtəsi */}
                <span className="h-[5px] w-[5px] flex-none rounded-full bg-[#C62828] transition-transform group-hover:scale-125" />

                {/* Başlıq */}
                <span className="max-w-[460px] truncate">
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

        {/* =====================================================
            SAĞ TƏRƏF
        ===================================================== */}

        <div className="hidden flex-none items-center border-l border-slate-200 px-4 xl:flex">
          <span className="whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-400">
            XƏBƏR AXINI
          </span>
        </div>

      </div>
    </section>
  );
}
