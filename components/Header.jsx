'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CATEGORIES } from '@/lib/categories';

export default function Header() {
  const router = useRouter();

  const [q, setQ] = useState('');
  const [weather, setWeather] = useState(null);
  const [time, setTime] = useState('');

  // =========================
  // CANLI SAAT
  // =========================

  useEffect(() => {
    function updateTime() {
      const now = new Date();

      setTime(
        now.toLocaleTimeString('az-AZ', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    }

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // =========================
  // BAKI HAVA PROQNOZU
  // =========================

  useEffect(() => {
    async function getWeather() {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=40.4093&longitude=49.8671&current=temperature_2m,weather_code&timezone=Asia%2FBaku',
          {
            cache: 'no-store',
          }
        );

        if (!response.ok) {
          throw new Error('Hava məlumatı alınmadı');
        }

        const data = await response.json();

        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          code: data.current.weather_code,
        });
      } catch (error) {
        console.error('Hava xətası:', error);
      }
    }

    getWeather();

    // Hər 30 dəqiqədən bir yenilənir
    const interval = setInterval(
      getWeather,
      30 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, []);

  // =========================
  // HAVA MƏLUMATI
  // =========================

  function getWeatherInfo(code) {
    if (code === 0) {
      return {
        icon: '☀️',
        text: 'Açıq hava',
      };
    }

    if (code === 1 || code === 2) {
      return {
        icon: '🌤️',
        text: 'Az buludlu',
      };
    }

    if (code === 3) {
      return {
        icon: '☁️',
        text: 'Buludlu',
      };
    }

    if (code === 45 || code === 48) {
      return {
        icon: '🌫️',
        text: 'Dumanlı',
      };
    }

    if (code >= 51 && code <= 57) {
      return {
        icon: '🌦️',
        text: 'Çiskin',
      };
    }

    if (code >= 61 && code <= 67) {
      return {
        icon: '🌧️',
        text: 'Yağışlı',
      };
    }

    if (code >= 71 && code <= 77) {
      return {
        icon: '❄️',
        text: 'Qarlı',
      };
    }

    if (code >= 80 && code <= 82) {
      return {
        icon: '🌦️',
        text: 'Yağışlı',
      };
    }

    if (code >= 95) {
      return {
        icon: '⛈️',
        text: 'Şimşəkli',
      };
    }

    return {
      icon: '🌤️',
      text: 'Hava',
    };
  }

  // =========================
  // AXTARIŞ
  // =========================

  function handleSearch(e) {
    e.preventDefault();

    if (q.trim()) {
      router.push(
        `/axtar?q=${encodeURIComponent(q.trim())}`
      );
    }
  }

  const weatherInfo = weather
    ? getWeatherInfo(weather.code)
    : null;

  return (
    <header className="border-b-2 border-ink bg-bg sticky top-0 z-30">

      {/* ================= YUXARI HİSSƏ ================= */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">

        <div className="flex items-center justify-between gap-3">

          {/* ================= PANORAMA LOGO ================= */}

          <Link
            href="/"
            className="flex items-center gap-3 sm:gap-4 min-w-0 group"
          >

            {/* LOGO İŞARƏSİ */}

            <div className="relative flex-none">

              <svg
                width="42"
                height="42"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="transition-transform duration-300 group-hover:scale-105"
              >

                {/* Xarici dairə */}

                <circle
                  cx="24"
                  cy="24"
                  r="21"
                  stroke="#10151C"
                  strokeWidth="2.5"
                />

                {/* İç dairə */}

                <circle
                  cx="24"
                  cy="24"
                  r="16"
                  stroke="#1D4E89"
                  strokeWidth="1.5"
                  opacity="0.35"
                />

                {/* PANORAMA dalğası */}

                <path
                  d="M10 27C14 27 15 20 19 20C23 20 24 28 28 28C32 28 34 20 38 20"
                  stroke="#1D4E89"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Kiçik nöqtə */}

                <circle
                  cx="38"
                  cy="20"
                  r="2"
                  fill="#1D4E89"
                />

              </svg>

            </div>

            {/* LOGO YAZISI */}

            <div className="min-w-0">

              <div className="font-serif text-xl sm:text-2xl font-bold tracking-tight leading-none group-hover:text-blue transition-colors">
                PANORAMA
              </div>

              <div className="text-[8px] sm:text-[10px] uppercase tracking-[0.22em] text-gray-500 mt-1">
                Xəbər Portalı
              </div>

            </div>

          </Link>

          {/* ================= SAĞ TƏRƏF ================= */}

          <div className="flex items-center gap-2 sm:gap-4">

            {/* ================= HAVA ================= */}

            <div className="hidden sm:flex items-center gap-2 border border-line bg-panel px-3 py-2 rounded-sm">

              <span className="text-lg">
                {weatherInfo
                  ? weatherInfo.icon
                  : '🌤️'}
              </span>

              <div className="leading-tight">

                <div className="text-[10px] uppercase tracking-wider text-gray-400">
                  Bakı
                </div>

                <div className="text-sm font-bold">

                  {weather
                    ? `${weather.temperature}°C`
                    : '--°C'}

                </div>

              </div>

            </div>

            {/* ================= SAAT ================= */}

            <div className="hidden sm:block border-l border-line pl-3 sm:pl-4">

              <div className="text-[10px] uppercase tracking-wider text-gray-400">
                Saat
              </div>

              <div className="font-mono text-sm sm:text-base font-bold">
                {time || '--:--:--'}
              </div>

            </div>

            {/* ================= DESKTOP AXTARIŞ ================= */}

            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center border border-line rounded-sm overflow-hidden"
            >

              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Axtar..."
                className="px-3 py-1.5 text-sm outline-none w-52 bg-bg"
              />

              <button
                type="submit"
                className="bg-ink text-white px-3 py-1.5 text-sm hover:bg-blue transition-colors"
              >
                Axtar
              </button>

            </form>

          </div>

        </div>

        {/* ================= MOBİL HAVA + SAAT ================= */}

        <div className="sm:hidden flex items-center justify-between mt-3 pt-3 border-t border-line">

          {/* HAVA */}

          <div className="flex items-center gap-2">

            <span className="text-lg">
              {weatherInfo
                ? weatherInfo.icon
                : '🌤️'}
            </span>

            <div>

              <div className="text-[9px] uppercase tracking-wider text-gray-400">
                Bakı
              </div>

              <div className="text-sm font-bold">
                {weather
                  ? `${weather.temperature}°C`
                  : '--°C'}
              </div>

            </div>

          </div>

          {/* SAAT */}

          <div className="text-right">

            <div className="text-[9px] uppercase tracking-wider text-gray-400">
              Saat
            </div>

            <div className="font-mono text-sm font-bold">
              {time || '--:--:--'}
            </div>

          </div>

        </div>

      </div>

      {/* ================= CATEGORY MENU ================= */}

      <nav className="bg-ink overflow-x-auto">

        <div className="max-w-6xl mx-auto px-2 sm:px-6 flex items-center">

          <Link
            href="/"
            className="text-gray-300 hover:text-white text-xs sm:text-sm font-semibold px-3 py-3 whitespace-nowrap transition-colors"
          >
            Əsas səhifə
          </Link>

          {CATEGORIES.map((c) => (

            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="text-gray-300 hover:text-white text-xs sm:text-sm font-semibold px-3 py-3 whitespace-nowrap transition-colors"
            >
              {c.name}
            </Link>

          ))}

        </div>

      </nav>

      {/* ================= MOBILE SEARCH ================= */}

      <form
        onSubmit={handleSearch}
        className="md:hidden flex border-b border-line bg-white"
      >

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Xəbər axtar..."
          className="flex-1 min-w-0 px-4 py-3 text-sm outline-none"
        />

        <button
          type="submit"
          className="bg-ink text-white px-4 text-sm font-semibold"
        >
          Axtar
        </button>

      </form>

    </header>
  );
}