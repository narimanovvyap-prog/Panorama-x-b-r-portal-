'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NewsTicker({ articles = [] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (articles.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % articles.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [articles.length]);

  if (!articles.length) return null;

  const article = articles[index];

  return (
    <section className="bg-[#c1121f] text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">

        <div className="min-h-[46px] flex items-center gap-3">

          {/* SON DƏQİQƏ */}
          <div className="flex items-center gap-2 flex-none">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
            </span>

            <span className="text-[11px] sm:text-xs font-extrabold tracking-[0.12em] whitespace-nowrap">
              SON DƏQİQƏ
            </span>
          </div>

          {/* AYIRICI */}
          <div className="w-px h-5 bg-white/30 flex-none" />

          {/* XƏBƏR */}
          <Link
            href={`/article/${article.slug}`}
            className="min-w-0 flex-1 text-[12px] sm:text-sm font-semibold truncate hover:underline"
          >
            {article.title}
          </Link>

          {/* GÖSTƏRİCİLƏR */}
          {articles.length > 1 && (
            <div className="hidden sm:flex items-center gap-1.5 flex-none">
              {articles.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`${i + 1}-ci son dəqiqə xəbəri`}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === index
                      ? 'bg-white scale-125'
                      : 'bg-white/40 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          )}

        </div>

      </div>
    </section>
  );
}