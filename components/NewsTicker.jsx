'use client';

import Link from 'next/link';

export default function NewsTicker({ articles = [] }) {
  if (!articles.length) return null;

  const items = [...articles, ...articles];

  return (
    <section className="w-full bg-white border-b border-slate-200 shadow-[0_1px_8px_rgba(15,42,67,0.05)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <div className="flex items-center h-[52px] overflow-hidden">

          {/* SOL HİSSƏ */}
          <div className="flex items-center gap-3 pr-5 sm:pr-7 border-r border-slate-200 flex-none">

            <div className="relative flex items-center justify-center">
              <span className="absolute w-3 h-3 rounded-full bg-blue-200 animate-ping" />

              <span className="relative w-2.5 h-2.5 rounded-full bg-[#1D4E89]" />
            </div>

            <div className="leading-none">
              <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#102A43]">
                CANLI
              </div>

              <div className="text-[9px] text-slate-400 mt-1 whitespace-nowrap">
                Son xəbərlər
              </div>
            </div>

          </div>

          {/* XƏBƏR AXINI */}
          <div className="relative flex-1 overflow-hidden h-full">

            {/* Sol gradient */}
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

            {/* Sağ gradient */}
            <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <div className="news-ticker flex items-center h-full whitespace-nowrap">

              {items.map((article, index) => (
                <Link
                  key={`${article.id}-${index}`}
                  href={`/article/${article.slug}`}
                  className="
                    group
                    flex
                    items-center
                    gap-3
                    px-5
                    sm:px-7
                    h-full
                    text-[13px]
                    font-medium
                    text-[#263A4D]
                    hover:text-[#1D4E89]
                    transition-colors
                  "
                >

                  {/* Kiçik xəbər işarəsi */}
                  <span className="
                    flex-none
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-slate-300
                    group-hover:bg-[#1D4E89]
                    transition-colors
                  " />

                  {/* Xəbər başlığı */}
                  <span className="max-w-[420px] truncate">
                    {article.title}
                  </span>

                  {/* Ayırıcı */}
                  <span className="text-slate-300 text-[15px]">
                    •
                  </span>

                </Link>
              ))}

            </div>

          </div>

          {/* SAĞDA XƏBƏRLƏR SAYI */}
          <div className="hidden lg:flex items-center pl-5 border-l border-slate-200 flex-none">

            <span className="text-[10px] uppercase tracking-wider text-slate-400">
              Gündəlik xəbər axını
            </span>

          </div>

        </div>

      </div>
    </section>
  );
}