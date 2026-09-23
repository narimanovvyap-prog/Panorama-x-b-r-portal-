'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HeroSlider({ articles = [] }) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (articles.length <= 1) return;

    const timer = setInterval(() => {
      goToNext();
    }, 5000);

    return () => clearInterval(timer);
  }, [articles.length, current]);

  if (!articles.length) {
    return null;
  }

  const article = articles[current];

  const goToNext = () => {
    if (articles.length <= 1) return;

    setIsAnimating(true);

    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % articles.length);
      setIsAnimating(false);
    }, 180);
  };

  const goToPrevious = () => {
    if (articles.length <= 1) return;

    setIsAnimating(true);

    setTimeout(() => {
      setCurrent(
        (prev) =>
          (prev - 1 + articles.length) %
          articles.length
      );
      setIsAnimating(false);
    }, 180);
  };

  const goToSlide = (index) => {
    if (index === current) return;

    setIsAnimating(true);

    setTimeout(() => {
      setCurrent(index);
      setIsAnimating(false);
    }, 180);
  };

  return (
    <div className="relative h-[430px] md:h-[500px] overflow-hidden bg-[#172b4d] group">

      {/* ================================
          XƏBƏR
      ================================= */}

      <Link
        href={`/article/${article.slug}`}
        className="absolute inset-0 block"
        aria-label={article.title}
      >

        {/* ŞƏKİL */}

        {article.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={article.id}
            src={article.image_url}
            alt={article.title || 'Panorama Xəbər'}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
              isAnimating
                ? 'opacity-0 scale-[1.02]'
                : 'opacity-100 scale-100'
            }`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#172b4d]">
            <span className="text-white/20 text-4xl md:text-6xl font-bold tracking-tight">
              PANORAMA
            </span>
          </div>
        )}

        {/* TƏBƏQƏ */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/5" />

        {/* BAŞ XƏBƏR */}

        <div className="absolute top-5 left-5 z-10">
          <span className="inline-flex bg-white text-[#172b4d] px-3 py-2 text-[10px] md:text-xs font-bold tracking-wide">
            BAŞ XƏBƏR
          </span>
        </div>

        {/* MƏTN */}

        <div
          className={`absolute bottom-0 left-0 right-0 z-10 p-5 md:p-8 transition-all duration-500 ${
            isAnimating
              ? 'opacity-0 translate-y-2'
              : 'opacity-100 translate-y-0'
          }`}
        >

          {article.category && (
            <div className="mb-2">
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-white/70">
                {article.category}
              </span>
            </div>
          )}

          <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold leading-[1.12] max-w-4xl">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-white/75 mt-3 md:mt-4 max-w-2xl text-sm md:text-base leading-relaxed line-clamp-2">
              {article.excerpt}
            </p>
          )}

          <div className="mt-4 text-white/80 text-xs md:text-sm font-semibold">
            Xəbəri oxu
          </div>

        </div>

      </Link>

      {/* ================================
          SOL DÜYMƏ
      ================================= */}

      {articles.length > 1 && (
        <button
          type="button"
          onClick={goToPrevious}
          aria-label="Əvvəlki xəbər"
          className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-30
                     w-10 h-10 md:w-11 md:h-11
                     flex items-center justify-center
                     bg-black/35 hover:bg-white
                     border border-white/25 hover:border-white
                     text-white hover:text-[#172b4d]
                     backdrop-blur-sm
                     transition-all duration-200
                     opacity-0 group-hover:opacity-100
                     focus:opacity-100"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {/* ================================
          SAĞ DÜYMƏ
      ================================= */}

      {articles.length > 1 && (
        <button
          type="button"
          onClick={goToNext}
          aria-label="Növbəti xəbər"
          className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-30
                     w-10 h-10 md:w-11 md:h-11
                     flex items-center justify-center
                     bg-black/35 hover:bg-white
                     border border-white/25 hover:border-white
                     text-white hover:text-[#172b4d]
                     backdrop-blur-sm
                     transition-all duration-200
                     opacity-0 group-hover:opacity-100
                     focus:opacity-100"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}

      {/* ================================
          SLIDER NÖQTƏLƏRİ
      ================================= */}

      {articles.length > 1 && (
        <div className="absolute bottom-5 right-5 md:right-7 z-30 flex items-center gap-2">

          {articles.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                goToSlide(index);
              }}
              aria-label={`${index + 1}-ci xəbərə keç`}
              className={`h-2 transition-all duration-300 ${
                index === current
                  ? 'w-8 bg-white'
                  : 'w-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}

        </div>
      )}

    </div>
  );
}