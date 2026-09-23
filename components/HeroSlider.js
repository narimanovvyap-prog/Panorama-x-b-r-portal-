'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HeroSlider({ articles = [] }) {
  const [current, setCurrent] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  const article = articles[current];

  const changeSlide = (nextIndex) => {
    if (articles.length <= 1 || nextIndex === current) return;

    setIsChanging(true);

    setTimeout(() => {
      setCurrent(nextIndex);
      setIsChanging(false);
    }, 180);
  };

  const nextSlide = () => {
    const nextIndex =
      (current + 1) % articles.length;

    changeSlide(nextIndex);
  };

  const previousSlide = () => {
    const previousIndex =
      (current - 1 + articles.length) %
      articles.length;

    changeSlide(previousIndex);
  };

  /* ================================
     5 SANİYƏLİK AVTOMATİK SLAYDER
  ================================= */

  useEffect(() => {
    if (articles.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % articles.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [articles.length]);

  /* ================================
     BOŞDURSA
  ================================= */

  if (!articles.length) {
    return null;
  }

  return (
    <div className="relative group h-[390px] sm:h-[450px] lg:h-[520px] overflow-hidden bg-[#111827]">

      {/* =================================
          ƏSAS ŞƏKİL + MƏQALƏ KEÇİDİ
      ================================== */}

      <Link
        href={`/article/${article.slug}`}
        className="absolute inset-0 z-10 block"
        aria-label={article.title}
      >

        {/* ŞƏKİL */}

        {article.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={article.id}
            src={article.image_url}
            alt={article.title || 'PANORAMA XƏBƏR'}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
              isChanging
                ? 'opacity-0 scale-[1.03]'
                : 'opacity-100 scale-100'
            }`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[#172b4d]">
            <span className="text-white/20 text-4xl md:text-6xl font-black tracking-tight">
              PANORAMA
            </span>
          </div>
        )}

        {/* =================================
            YUMŞAQ QARA GRADIENT
        ================================== */}

        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/5" />

        {/* =================================
            ÜST SOL — BAŞ XƏBƏR
        ================================== */}

        <div className="absolute top-5 left-5 md:top-7 md:left-7">

          <span className="inline-flex items-center bg-white px-3.5 py-2 text-[10px] font-bold tracking-[0.12em] text-[#172b4d] shadow-sm">
            BAŞ XƏBƏR
          </span>

        </div>

        {/* =================================
            AŞAĞI MƏTN
        ================================== */}

        <div
          className={`absolute left-0 right-0 bottom-0 px-5 pb-7 pt-20 sm:px-7 sm:pb-8 md:px-9 md:pb-10 transition-all duration-500 ${
            isChanging
              ? 'opacity-0 translate-y-3'
              : 'opacity-100 translate-y-0'
          }`}
        >

          {/* Kateqoriya */}

          {article.category && (
            <div className="mb-3">

              <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.18em] text-white/75">
                {article.category}
              </span>

            </div>
          )}

          {/* Başlıq */}

          <h1 className="max-w-4xl text-[25px] sm:text-[31px] md:text-[40px] lg:text-[46px] font-bold leading-[1.1] tracking-[-0.02em] text-white">
            {article.title}
          </h1>

          {/* Excerpt */}

          {article.excerpt && (
            <p className="mt-3 max-w-2xl text-[13px] sm:text-sm md:text-base leading-relaxed text-white/75 line-clamp-2">
              {article.excerpt}
            </p>
          )}

          {/* Xəbəri oxu */}

          <div className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white/90">
            Xəbəri oxu

            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </div>

        </div>

      </Link>

      {/* =================================
          SOL OX
      ================================== */}

      {articles.length > 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            previousSlide();
          }}
          aria-label="Əvvəlki xəbər"
          className="absolute left-4 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/30 bg-black/30 text-white backdrop-blur-sm transition-all duration-200 hover:border-white hover:bg-white hover:text-[#172b4d] md:left-6 md:h-11 md:w-11"
        >
          <svg
            width="18"
            height="18"
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

      {/* =================================
          SAĞ OX
      ================================== */}

      {articles.length > 1 && (
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            nextSlide();
          }}
          aria-label="Növbəti xəbər"
          className="absolute right-4 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/30 bg-black/30 text-white backdrop-blur-sm transition-all duration-200 hover:border-white hover:bg-white hover:text-[#172b4d] md:right-6 md:h-11 md:w-11"
        >
          <svg
            width="18"
            height="18"
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

      {/* =================================
          AŞAĞI SLIDER GÖSTƏRİCİLƏRİ
      ================================== */}

      {articles.length > 1 && (
        <div className="absolute bottom-5 right-5 z-30 flex items-center gap-2 md:right-8 md:bottom-7">

          {articles.map((item, index) => (
            <button
              key={item.id}
              type="button"
              aria-label={`${index + 1}-ci xəbərə keç`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                changeSlide(index);
              }}
              className={`h-[3px] transition-all duration-300 ${
                index === current
                  ? 'w-8 bg-white'
                  : 'w-3 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}

        </div>
      )}

      {/* =================================
          AŞAĞIDA XƏBƏR NÖMRƏSİ
      ================================== */}

      {articles.length > 1 && (
        <div className="absolute bottom-6 left-5 z-30 text-[10px] font-semibold tracking-[0.15em] text-white/60 md:left-8">
          {String(current + 1).padStart(2, '0')}
          <span className="mx-1.5 text-white/30">/</span>
          {String(articles.length).padStart(2, '0')}
        </div>
      )}

    </div>
  );
}