'use client';

import { useEffect, useState } from 'react';

export default function HeroSlider({ articles = [] }) {
  console.log('SLIDER XƏBƏRLƏRİ:', articles.length);

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (articles.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % articles.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [articles.length]);

  if (!articles.length) {
    return null;
  }

  const article = articles[current];

  return (
    <div className="relative h-[430px] md:h-[500px] overflow-hidden bg-[#172b4d]">

      {article.image_url ? (
        <img
          src={article.image_url}
          alt={article.title || 'Panorama Xəbər'}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/30 text-5xl font-bold">
            PANORAMA
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />

      <div className="absolute top-5 left-5 z-10">
        <span className="bg-white text-[#172b4d] px-3 py-2 text-xs font-bold">
          BAŞ XƏBƏR
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-8">

        <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold leading-tight">
          {article.title}
        </h1>

        {article.excerpt && (
          <p className="text-white/75 mt-4 max-w-2xl">
            {article.excerpt}
          </p>
        )}

      </div>

      {articles.length > 1 && (
        <div className="absolute bottom-5 right-6 z-20 flex gap-2">
          {articles.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCurrent(index)}
              className={
                index === current
                  ? 'w-7 h-2 rounded-full bg-white'
                  : 'w-2 h-2 rounded-full bg-white/50'
              }
            />
          ))}
        </div>
      )}

    </div>
  );
}