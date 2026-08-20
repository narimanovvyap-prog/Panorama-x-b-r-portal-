'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CATEGORIES } from '@/lib/categories';
export default function Header() {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [time, setTime] = useState('');
  const [weather, setWeather] = useState(null);
  const [language, setLanguage] = useState('AZ');
  // =========================
  // SAAT
  // =========================
  useEffect(() => {
    function updateTime() {
      const now = new Date();
      setTime(
        new Intl.DateTimeFormat('az-AZ', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }).format(now)
      );
    }
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);
  // =========================
  // HAVA PROQNOZU
  // =========================
  useEffect(() => {
    async function getWeather() {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=40.6828&longitude=46.3606&current=temperature_2m,weather_code&timezone=Asia%2FBaku'
        );
        if (!response.ok) {
          throw new Error('Weather request failed');
        }
        const data = await response.json();
        setWeather({
          temperature: Math.round(
            data.current.temperature_2m
          ),
          code: data.current.weather_code,
        });
      } catch (error) {
        console.error('Hava xətası:', error);
      }
    }
    getWeather();
    const weatherTimer = setInterval(
      getWeather,
      10 * 60 * 1000
    );
    return () => clearInterval(weatherTimer);
  }, []);
  // =========================
  // HAVA İKONU
  // =========================
  function getWeatherIcon(code) {
    if (code === 0) return '☀️';
    if ([1, 2].includes(code)) {
      return '🌤️';
    }
    if (code === 3) {
      return '☁️';
    }
    if ([45, 48].includes(code)) {
      return '🌫️';
    }
    if (
      [51, 53, 55, 56, 57].includes(code)
    ) {
      return '🌦️';
    }
    if (
      [61, 63, 65, 66, 67].includes(code)
    ) {
      return '🌧️';
    }
    if (
      [71, 73, 75, 77].includes(code)
    ) {
      return '❄️';
    }
    if (
      [80, 81, 82].includes(code)
    ) {
      return '🌧️';
    }
    if (
      [95, 96, 99].includes(code)
    ) {
      return '⛈️';
    }
    return '🌤️';
  }
  // =========================
  // AXTARIŞ
  // =========================
  function handleSearch(e) {
    e.preventDefault();
    if (q.trim()) {
      router.push(
        `/axtar?q=${encodeURIComponent(
          q.trim()
        )}`
      );
    }
  }
  // =========================
  // DİL
  // =========================
  function changeLanguage(lang) {
    setLanguage(lang);
    /*
      Hələlik yalnız düymə dəyişir.
      Tərcümə sistemi sonrakı mərhələdə
      buraya qoşulacaq.
    */
  }
  return (
    <header className="sticky top-0 z-50 bg-bg border-b border-line">
      {/* =================================
          YUXARI MƏLUMAT PANELİ
      ================================= */}
      <div className="border-b border-line bg-panel">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-3 py-2">
            {/* SOL */}
            <div className="flex items-center gap-3 text-[11px] sm:text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <span>🕐</span>
                <span className="font-mono font-semibold text-ink">
                  {time || '--:--:--'}
                </span>
              </div>
              <span className="hidden sm:block text-gray-300">
                |
              </span>
              <div className="flex items-center gap-1.5">
                <span>
                  {weather
                    ? getWeatherIcon(
                        weather.code
                      )
                    : '🌤️'}
                </span>
                <span className="font-semibold text-ink">
                  {weather
                    ? `${weather.temperature}°C`
                    : '--°C'}
                </span>
                <span className="hidden sm:inline text-gray-400">
                  Gəncə
                </span>
              </div>
            </div>
            {/* SAĞ */}
            <div className="flex items-center gap-1">
              {['AZ', 'TR', 'RU'].map(
                (lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() =>
                      changeLanguage(lang)
                    }
                    className={`px-2 py-1 text-[10px] sm:text-[11px] font-bold rounded-sm transition ${
                      language === lang
                        ? 'bg-ink text-white'
                        : 'text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {lang}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      {/* =================================
          ƏSAS HEADER
      ================================= */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* LOGO */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            {/* DAİRƏVİ LOGO */}
            <div className="relative flex-none">
              <svg
                width="44"
                height="44"
                viewBox="0 0 44 44"
                fill="none"
                className="transition-transform duration-300 group-hover:rotate-3"
              >
                <circle
                  cx="22"
                  cy="22"
                  r="20"
                  stroke="#10151C"
                  strokeWidth="2"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="16"
                  stroke="#1D4E89"
                  strokeWidth="1"
                  opacity="0.5"
                />
                <path
                  d="M9 24C13 19 17 29 22 21C27 13 31 24 35 18"
                  stroke="#1D4E89"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
            {/* YAZI */}
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold tracking-tight leading-none">
                PANORAMA
              </div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] text-gray-500 mt-1">
                Xəbər Portalı
              </div>
            </div>
          </Link>
          {/* AXTARIŞ */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center border border-line rounded-sm overflow-hidden bg-white"
          >
            <input
              value={q}
              onChange={(e) =>
                setQ(e.target.value)
              }
              placeholder="Xəbər axtar..."
              className="px-3 py-2 text-sm outline-none w-56"
            />
            <button
              type="submit"
              className="bg-ink text-white px-4 py-2 text-sm font-semibold hover:bg-ink2 transition"
            >
              🔎
            </button>
          </form>
        </div>
      </div>
      {/* =================================
          NAVİQASİYA
      ================================= */}
      <nav className="bg-ink overflow-x-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center">
          <Link
            href="/"
            className="text-gray-300 hover:text-white text-sm font-semibold px-3 py-3 whitespace-nowrap transition"
          >
            Əsas səhifə
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="text-gray-300 hover:text-white text-sm font-semibold px-3 py-3 whitespace-nowrap transition"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </nav>
      {/* =================================
          MOBİL AXTARIŞ
      ================================= */}
      <form
        onSubmit={handleSearch}
        className="md:hidden flex border-b border-line bg-white"
      >
        <input
          value={q}
          onChange={(e) =>
            setQ(e.target.value)
          }
          placeholder="Xəbər axtar..."
          className="flex-1 px-4 py-2.5 text-sm outline-none"
        />
        <button
          type="submit"
          className="bg-ink text-white px-5 text-sm font-semibold"
        >
          Axtar
        </button>
      </form>
    </header>
  );
}