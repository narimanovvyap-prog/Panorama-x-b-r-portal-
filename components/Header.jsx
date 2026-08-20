'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CATEGORIES } from '@/lib/categories';

export default function Header() {
  const router = useRouter();

  const [q, setQ] = useState('');
  const [time, setTime] = useState('');
  const [weather, setWeather] = useState(null);

  // SAAT
  useEffect(() => {
    function updateTime() {
      const now = new Date();

      const currentTime = new Intl.DateTimeFormat('az-AZ', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);

      setTime(currentTime);
    }

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  // BAKI HAVA PROQNOZU
  useEffect(() => {
    async function getWeather() {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=40.4093&longitude=49.8671&current=temperature_2m,weather_code&timezone=Asia%2FBaku'
        );

        if (!response.ok) {
          throw new Error('Hava məlumatı alınmadı');
        }

        const data = await response.json();

        setWeather(data.current);
      } catch (error) {
        console.error('Hava xətası:', error);
      }
    }

    getWeather();

    const timer = setInterval(
      getWeather,
      10 * 60 * 1000
    );

    return () => clearInterval(timer);
  }, []);

  function getWeatherIcon(code) {
    if (code === 0) return '☀️';
    if (code === 1 || code === 2) return '🌤️';
    if (code === 3) return '☁️';
    if (code === 45 || code === 48) return '🌫️';
    if (code >= 51 && code <= 67) return '🌧️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code >= 80 && code <= 82) return '🌦️';
    if (code >= 95 && code <= 99) return '⛈️';

    return '🌤️';
  }

  // AXTARIŞ
  function handleSearch(e) {
    e.preventDefault();

    const value = q.trim();

    if (!value) return;

    router.push(
      `/axtar?q=${encodeURIComponent(value)}`
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-bg border-b-2 border-ink">

      {/* YUXARI ZOLAQ */}

      <div className="bg-ink text-white">

        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          <div className="flex items-center justify-between min-h-[36px]">

            {/* SAAT + HAVA */}

            <div className="flex items-center gap-4 text-[10px] sm:text-xs">

              <span className="font-medium text-gray-300">
                {time}
              </span>

              <span className="hidden sm:inline text-gray-600">
                |
              </span>

              <span className="flex items-center gap-1.5">

                {weather
                  ? getWeatherIcon(weather.weather_code)
                  : '🌤️'}

                <span className="text-gray-300">
                  Bakı
                </span>

                <span className="font-bold text-white">
                  {weather
                    ? `${Math.round(weather.temperature_2m)}°C`
                    : '...'}
                </span>

              </span>

            </div>

            {/* DİL SEÇİMİ */}

            <div className="flex items-center gap-1">

              <button
                type="button"
                className="px-2 py-1 text-[10px] font-bold text-white bg-white/10 hover:bg-white/20 transition"
              >
                AZ
              </button>

              <button
                type="button"
                className="px-2 py-1 text-[10px] font-bold text-gray-400 hover:text-white transition"
              >
                RU
              </button>

              <button
                type="button"
                className="px-2 py-1 text-[10px] font-bold text-gray-400 hover:text-white transition"
              >
                EN
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* LOGO HİSSƏSİ */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">

        <div className="flex items-center justify-between gap-5">

          {/* LOGO */}

          <Link
            href="/"
            className="flex items-center gap-3 group"
          >

            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              className="group-hover:scale-105 transition-transform"
            >

              <circle
                cx="24"
                cy="24"
                r="22"
                stroke="#10151C"
                strokeWidth="2"
              />

              <path
                d="M9 27C14 21 19 32 24 23C29 15 34 27 39 19"
                stroke="#1D4E89"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

            </svg>

            <div>

              <div className="font-serif text-2xl sm:text-3xl font-bold tracking-tight">
                PANORAMA
              </div>

              <div className="text-[9px] uppercase tracking-[0.25em] text-gray-500">
                XƏBƏR PORTALI
              </div>

            </div>

          </Link>

          {/* AXTARIŞ */}

          <form
            onSubmit={handleSearch}
            className="hidden md:flex border border-line bg-white overflow-hidden"
          >

            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Xəbər axtar..."
              className="w-52 px-3 py-2 text-sm outline-none"
            />

            <button
              type="submit"
              className="bg-ink text-white px-4 hover:bg-blue transition"
            >
              🔎
            </button>

          </form>

        </div>

      </div>

      {/* MENYU */}

      <nav className="bg-ink overflow-x-auto">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center">

          <Link
            href="/"
            className="bg-blue text-white text-sm font-bold px-4 py-3 whitespace-nowrap"
          >
            Əsas səhifə
          </Link>

          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className="text-gray-300 hover:text-white hover:bg-white/10 text-sm font-semibold px-4 py-3 whitespace-nowrap transition"
            >
              {category.name}
            </Link>
          ))}

        </div>

      </nav>

      {/* MOBİL AXTARIŞ */}

      <form
        onSubmit={handleSearch}
        className="md:hidden flex border-b border-line bg-white"
      >

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
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