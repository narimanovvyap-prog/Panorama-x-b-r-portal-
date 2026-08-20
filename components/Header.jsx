'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CATEGORIES } from '@/lib/categories';
import { translations } from '@/lib/translations';
export default function Header() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [time, setTime] = useState('');
  const [language, setLanguage] = useState('az');
  const [weather, setWeather] = useState('Bakı');
  const t =
    translations?.[language] ||
    translations?.az || {
      home: 'Əsas səhifə',
      search: 'Axtar...',
      latest: 'Son xəbərlər',
      mostRead: 'Ən çox oxunanlar',
      source: 'Mənbə',
      weather: 'Bakı',
    };
  // =====================================================
  // DİL SİSTEMİ
  // =====================================================
  useEffect(() => {
    try {
      const savedLanguage =
        localStorage.getItem('language');
      if (
        savedLanguage &&
        translations?.[savedLanguage]
      ) {
        setLanguage(savedLanguage);
      }
    } catch {
      setLanguage('az');
    }
  }, []);
  function changeLanguage(lang) {
    if (!translations?.[lang]) return;
    setLanguage(lang);
    try {
      localStorage.setItem(
        'language',
        lang
      );
    } catch {}
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('languageChange', {
          detail: lang,
        })
      );
    }
  }
  // =====================================================
  // SAAT
  // =====================================================
  useEffect(() => {
    function updateTime() {
      const now = new Date();
      const formattedTime =
        new Intl.DateTimeFormat('az-AZ', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(now);
      setTime(formattedTime);
    }
    updateTime();
    const interval = setInterval(
      updateTime,
      1000
    );
    return () => clearInterval(interval);
  }, []);
  // =====================================================
  // BAKI HAVA PROQNOZU
  // =====================================================
  useEffect(() => {
    let cancelled = false;
    async function getWeather() {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=40.4093&longitude=49.8671&current=temperature_2m,weather_code&timezone=Asia%2FBaku'
        );
        if (!response.ok) return;
        const data = await response.json();
        const temperature =
          data?.current?.temperature_2m;
        if (
          temperature !== undefined &&
          !cancelled
        ) {
          setWeather(
            `Bakı ${Math.round(
              temperature
            )}°C`
          );
        }
      } catch {
        if (!cancelled) {
          setWeather('Bakı');
        }
      }
    }
    getWeather();
    const interval = setInterval(
      getWeather,
      10 * 60 * 1000
    );
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);
  // =====================================================
  // AXTARIŞ
  // =====================================================
  function handleSearch(e) {
    e.preventDefault();
    const value = q.trim();
    if (!value) return;
    router.push(
      `/axtar?q=${encodeURIComponent(value)}`
    );
  }
  // =====================================================
  // HEADER
  // =====================================================
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      {/* =================================================
          ÜST HİSSƏ
      ================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="min-h-[78px] flex items-center justify-between gap-5">
          {/* =================================================
              PANORAMA LOGO
          ================================================= */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 group"
          >
            {/* LOGO İKONU */}
            <div className="flex items-center justify-center">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  stroke="#111827"
                  strokeWidth="2"
                />
                <path
                  d="M8 22C12 18 16 26 20 20C24 14 28 22 32 18"
                  stroke="#1D4E89"
                  strokeWidth="2.4"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {/* LOGO YAZISI */}
            <div className="leading-none">
              <div className="font-serif text-[24px] sm:text-[27px] font-bold tracking-tight text-gray-950">
                PANORAMA
              </div>
              <div className="mt-1 text-[9px] sm:text-[10px] uppercase tracking-[0.28em] text-gray-500">
                Xəbər Portalı
              </div>
            </div>
          </Link>
          {/* =================================================
              SAĞ TƏRƏF
          ================================================= */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* BAKI HAVA */}
            <div className="hidden md:flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-2">
              <span className="text-sm">
                ☀️
              </span>
              <span className="text-xs font-medium text-gray-600 whitespace-nowrap">
                {weather}
              </span>
            </div>
            {/* SAAT */}
            <div className="hidden sm:flex items-center rounded-full border border-gray-200 bg-gray-50 px-3.5 py-2">
              <span className="text-sm font-semibold text-gray-800 tabular-nums">
                {time}
              </span>
            </div>
            {/* =================================================
                DİL SEÇİMİ
            ================================================= */}
            <div
              className="flex items-center rounded-full border border-gray-200 bg-white p-1 shadow-sm"
              aria-label="Dil seçimi"
            >
              <button
                type="button"
                onClick={() =>
                  changeLanguage('az')
                }
                className={`min-w-[36px] px-2.5 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                  language === 'az'
                    ? 'bg-gray-950 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-950'
                }`}
              >
                AZ
              </button>
              <button
                type="button"
                onClick={() =>
                  changeLanguage('ru')
                }
                className={`min-w-[36px] px-2.5 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                  language === 'ru'
                    ? 'bg-gray-950 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-950'
                }`}
              >
                RU
              </button>
              <button
                type="button"
                onClick={() =>
                  changeLanguage('en')
                }
                className={`min-w-[36px] px-2.5 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                  language === 'en'
                    ? 'bg-gray-950 text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-950'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* =================================================
          NAVİQASİYA
      ================================================= */}
      <nav className="bg-gray-950 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center min-h-[46px]">
            {/* ƏSAS SƏHİFƏ */}
            <Link
              href="/"
              className="text-white text-sm font-semibold px-3.5 py-3 whitespace-nowrap hover:text-gray-200 transition"
            >
              {t.home}
            </Link>
            {/* KATEQORİYALAR */}
            {CATEGORIES.map(
              (category) => (
                <Link
                  key={category.slug}
                  href={`/${category.slug}`}
                  className="text-gray-300 hover:text-white text-sm font-medium px-3.5 py-3 whitespace-nowrap transition"
                >
                  {category.name}
                </Link>
              )
            )}
          </div>
        </div>
      </nav>
      {/* =================================================
          AXTARIŞ
      ================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <form
          onSubmit={handleSearch}
          className="w-full sm:max-w-[420px] sm:ml-auto flex items-center rounded-full border border-gray-200 bg-gray-50 overflow-hidden focus-within:bg-white focus-within:border-gray-400 focus-within:shadow-sm transition-all"
        >
          {/* AXTARIŞ İKONU */}
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            className="ml-4 shrink-0 text-gray-400"
          >
            <path
              d="M21 21L16.65 16.65"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle
              cx="11"
              cy="11"
              r="7"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          {/* INPUT */}
          <input
            type="text"
            value={q}
            onChange={(e) =>
              setQ(e.target.value)
            }
            placeholder={t.search}
            className="flex-1 min-w-0 bg-transparent px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none"
          />
          {/* AXTAR DÜYMƏSİ */}
          <button
            type="submit"
            className="mr-1 rounded-full bg-gray-950 text-white px-4 py-2 text-xs sm:text-sm font-semibold hover:bg-gray-800 transition"
          >
            {language === 'az'
              ? 'Axtar'
              : language === 'ru'
                ? 'Поиск'
                : 'Search'}
          </button>
        </form>
      </div>
    </header>
  );
}