'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HeroSlider({ articles = [] }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (articles.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % articles.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [articles.length]);

  if (!articles.length) return null;

  const article = articles[current];

  const previous = () => {
    setCurrent((prev) =>
      prev === 0 ? articles.length - 1 : prev - 1
    );
  };

  const next = () => {
    setCurrent((prev) =>
      (prev + 1) % articles.length
    );
  };

  return (
    <div className="relative h-[430px] md:h-[500px] overflow-hidden bg-[#172b4d]">

      <Link
        href={`/article/${article.slug}`}
        className="group absolute inset-0 block"
      >

        {article.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image_url}
            alt={article.title || 'Panorama xəbər'}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#172b4d]">
            <span className="text-white/30 text-5xl font-bold">
              PANORAMA
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/5" />

        <div className="absolute top-5 left-5">
          <span className="bg-white text-[#172b4d] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest">
            Baş xəbər
          </span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">

          <div className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3 text-white/80">
            PANORAMA XƏBƏR
          </div>

          <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-4xl">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-white/75 text-sm md:text-base mt-4 max-w-2xl line-clamp-2">
              {article.excerpt}
            </p>
          )}

          <div className="flex items-center gap-3 text-xs text-white/55 mt-5">

            <span>
              {article.source || 'PANORAMA Xəbər'}
            </span>

            <span>•</span>

            <span>
              {article.created_at
                ? new Date(
                    article.created_at
                  ).toLocaleDateString('az-AZ')
                : ''}
            </span>

          </div>

        </div>

      </Link>

      {articles.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              previous();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 text-white text-2xl hover:bg-black/70 transition"
            aria-label="Əvvəlki xəbər"
          >
            ‹
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              next();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/40 text-white text-2xl hover:bg-black/70 transition"
            aria-label="Növbəti xəbər"
          >
            ›
          </button>

          <div className="absolute bottom-5 right-6 z-20 flex gap-2">

            {articles.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setCurrent(index);
                }}
                className={`h-2 rounded-full transition-all ${
                  index === current
                    ? 'w-7 bg-white'
                    : 'w-2 bg-white/50'
                }`}
                aria-label={`${index + 1}-ci xəbər`}
              />
            ))}

          </div>
        </>
      )}

    </div>
  );
}