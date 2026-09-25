'use client';

import Link from 'next/link';

export default function NewsTicker({ articles = [] }) {
  if (!articles.length) return null;

  const items = [...articles, ...articles];

  return (
    <section className="w-full border-b border-[#263B5A] bg-[#0B1F3A]">
      <div className="mx-auto max-w-7xl px-0 sm:px-4 lg:px-0">
        <div className="relative flex h-[54px] items-center overflow-hidden">

          {/* =====================================================
              SON XƏBƏRLƏR BLOKU
          ====================================================== */}
          <div className="relative z-20 flex h-full flex-none items-center bg-[#102A43] px-4 shadow-[4px_0_12px_rgba(0,0,0,0.15)] sm:px-5">

            {/* Alt qırmızı xətt */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#D62828]" />

            {/* Canlı nöqtə */}
            <div className="relative mr-3 flex h-3.5 w-3.5 items-center justify-center">
              <span className="absolute h-3.5 w-3.5 animate-ping rounded-full bg-[#D62828]/30" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-[#D62828] shadow-[0_0_8px_rgba(214,40,40,0.7)]" />
            </div>

            <div className="leading-none">
              <div className="text-[8px] font-semibold uppercase tracking-[0.18em] text-white/45 sm:text-[9px]">
                CANLI XƏBƏRLƏR
              </div>

              <div className="mt-1 whitespace-nowrap text-[10px] font-extrabold uppercase tracking-[0.13em] text-white sm:text-[11px]">
                SON DƏQİQƏ
              </div>
            </div>
          </div>

          {/* =====================================================
              XƏBƏR LENTİ
          ====================================================== */}
          <div className="relative h-full min-w-0 flex-1 overflow-hidden bg-[#0B1F3A]">

            {/* Sol yumşaq keçid */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-[#0B1F3A] to-transparent" />

            {/* Sağ yumşaq keçid */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-[#0B1F3A] to-transparent" />

            <div className="news-ticker flex h-full items-center whitespace-nowrap">

              {items.map((article, index) => (
                <Link
                  key={`${article.id}-${index}`}
                  href={`/article/${article.slug}`}
                  className="group flex h-full flex-none items-center gap-3 px-5 text-[13px] font-medium text-white/85 transition-colors hover:text-white sm:px-7"
                >

                  {/* Xəbər nöqtəsi */}
                  <span className="h-1.5 w-1.5 flex-none rounded-full bg-[#D62828] shadow-[0_0_6px_rgba(214,40,40,0.55)] transition-transform group-hover:scale-150" />

                  {/* Başlıq */}
                  <span className="max-w-[440px] truncate">
                    {article.title}
                  </span>

                  {/* Ayırıcı */}
                  <span className="text-white/20">
                    •
                  </span>

                </Link>
              ))}

            </div>
          </div>

          {/* =====================================================
              SAĞ TƏRƏF
          ====================================================== */}
          <div className="hidden h-full flex-none items-center border-l border-white/10 bg-[#102A43] px-5 xl:flex">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D62828]" />

              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/50">
                XƏBƏR AXINI
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
