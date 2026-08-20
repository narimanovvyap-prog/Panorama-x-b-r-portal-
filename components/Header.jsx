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
  const t = translations?.[language] || translations?.az || {
    home: 'Əsas səhifə',
    search: 'Axtar...',
  };
  // DİL
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations?.[savedLanguage]) {
      setLanguage(savedLanguage);
    }
  }, []);
  function changeLanguage(lang) {
    if (!translations?.[lang]) return;
    setLanguage(lang);
    localStorage.setItem('language', lang);
  }
  // SAAT
  useEffect(() => {
    function updateTime() {
      const now = new Date();
      const formattedTime = new Intl.DateTimeFormat('az-AZ', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(now);
      setTime(formattedTime);
    }
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);
  // BAKI HAVA
  useEffect(() => {
    async function getWeather() {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=40.4093&longitude=49.8671&current=temperature_2m,weather_code&timezone=Asia%2FBaku'
        );
        if (!response.ok) return;
        const data = await response.json();
        if (data?.current?.temperature_2m !== undefined) {
          const temperature = Math.round(
            data.current.temperature_2m
          );
          setWeather(`Bakı ${temperature}°C`);
        }
      } catch {
        setWeather('Bakı');
      }
    }
    getWeather();
    const interval = setInterval(
      getWeather,
      10 * 60 * 1000
    );
    return () => clearInterval(interval);
  }, []);
  // AXTARIŞ
  function handleSearch(e) {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(
      `/axtar?q=${encodeURIComponent(q.trim())}`
    );
  }
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      {/* YUXARI HİSSƏ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 py-4">
          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
          >
            <div className="w-11 h-11 rounded-full bg-gray-900 flex items-center justify-center shadow-sm">
              <svg
                width="30"
                height="30"
                viewBox="0 0 40 40"
                fill="none"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="17"
                  stroke="white"
                  strokeWidth="2"
                />
                <path
                  d="M8 22C12 18 16 26 20 20C24 14 28 22 32 18"
                  stroke="white"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <div className="font-serif text-2xl font-bold tracking-tight">
                PANORAMA
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-gray-500">
                Xəbər Portalı
              </div>
            </div>
          </Link>
          {/* SAĞ TƏRƏF */}
          <div className="flex items-center gap-3">
            {/* BAKI HAVA */}
            <div className="hidden sm:flex items-center gap-2 rounded-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs text-gray-600">
              <span>☀️</span>
              <span>{weather}</span>
            </div>
            {/* SAAT */}
            <div className="hidden sm:block text-sm font-semibold text-gray-700 tabular-nums">
              {time}
            </div>
            {/* DİL */}
            <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 p-1">
              {[
                ['az', 'AZ'],
                ['ru', 'RU'],
                ['en', 'EN'],
              ].map(([code, label]) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => changeLanguage(code)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-full transition ${
                    language === code
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* NAVİQASİYA */}
      <nav className="bg-gray-900 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center">
          <Link
            href="/"
            className="text-gray-300 hover:text-white text-sm font-semibold px-3 py-3 whitespace-nowrap transition"
          >
            {t.home}
          </Link>
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className="text-gray-300 hover:text-white text-sm font-semibold px-3 py-3 whitespace-nowrap transition"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </nav>
      {/* AXTARIŞ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <form
          onSubmit={handleSearch}
          className="flex items-center border border-gray-200 rounded-full overflow-hidden bg-gray-50 focus-within:bg-white focus-within:border-gray-400 transition"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t.search}
            className="flex-1 bg-transparent px-4 py-2 text-sm outline-none"
          />
          <button
            type="submit"
            className="bg-gray-900 text-white px-5 py-2 text-sm font-semibold hover:bg-gray-700 transition"
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