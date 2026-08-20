'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CATEGORIES } from '@/lib/categories';

export default function Header() {
  const router = useRouter();

  const [q, setQ] = useState('');
  const [time, setTime] = useState('');
  const [weather, setWeather] = useState('Bakı');

  // ================= SAAT =================

  useEffect(() => {
    function updateTime() {
      const now = new Date();

      const formatted = new Intl.DateTimeFormat('az-AZ', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(now);

      setTime(formatted);
    }

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // ================= BAKI HAVA =================

  useEffect(() => {
    async function getWeather() {
      try {
        const response = await fetch(
          'https://api.open-meteo.com/v1/forecast?latitude=40.4093&longitude=49.8671&current=temperature_2m,weather_code&timezone=Asia%2FBaku'
        );

        if (!response.ok) return;

        const data = await response.json();

        const temperature = data?.current?.temperature_2m;

        if (temperature !== undefined) {
          setWeather(`Bakı ${Math.round(temperature)}°C`);
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

  // ================= AXTARIŞ =================

  function handleSearch(e) {
    e.preventDefault();

    const value = q.trim();

    if (!value) return;

    router.push(`/axtar?q=${encodeURIComponent(value)}`);
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">

      {/* ================= ƏSAS HEADER ================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="min-h-[82px] flex items-center justify-between gap-6">

          {/* LOGO */}

          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 group"
          >

            {/* LOGO İKONU */}

            <div className="relative w-12 h-12 flex items-center justify-center">

              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >

                <circle
                  cx="24"
                  cy="24"
                  r="21"
                  stroke="#111827"
                  strokeWidth="2"
                />

                <path
                  d="M9 27C13 23 16 31 20 25C24 19 27 27 31 22C34 18 37 22 39 20"
                  stroke="#111827"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <circle
                  cx="24"
                  cy="24"
                  r="3"
                  fill="#111827"
                />

              </svg>

            </div>

            {/* YAZI */}

            <div className="leading-none">

              <div className="font-serif text-[25px] sm:text-[28px] font-bold tracking-[0.08em] text-gray-900">
                PANORAMA
              </div>

              <div className="mt-1 text-[9px] sm:text-[10px] font-medium uppercase tracking-[0.28em] text-gray-500">
                Xəbər Portalı
              </div>

            </div>

          </Link>

          {/* SAĞ TƏRƏF */}

          <div className="flex items-center gap-4 sm:gap-6">

            {/* HAVA */}

            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">

              <span className="text-lg">
                ☀️
              </span>

              <span className="font-medium">
                {weather}
              </span>

            </div>

            {/* SAAT */}

            <div className="hidden sm:block">

              <div className="text-lg font-semibold tracking-wide text-gray-900 tabular-nums">
                {time}
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ================= NAVİQASİYA ================= */}

      <nav className="bg-gray-900">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="flex items-center overflow-x-auto scrollbar-hide">

            <Link
              href="/"
              className="shrink-0 px-3 sm:px-4 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Əsas səhifə
            </Link>

            {CATEGORIES.map((category) => (

              <Link
                key={category.slug}
                href={`/${category.slug}`}
                className="shrink-0 px-3 sm:px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition"
              >
                {category.name}
              </Link>

            ))}

          </div>

        </div>

      </nav>

      {/* ================= AXTARIŞ ================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">

        <form
          onSubmit={handleSearch}
          className="relative flex items-center w-full border border-gray-200 rounded-xl bg-gray-50 focus-within:bg-white focus-within:border-gray-400 focus-within:shadow-sm transition"
        >

          {/* SEARCH ICON */}

          <div className="pl-4 text-gray-400">

            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
              />

              <path
                d="M20 20L16.65 16.65"
              />

            </svg>

          </div>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Xəbər axtar..."
            className="flex-1 min-w-0 bg-transparent px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none"
          />

          <button
            type="submit"
            className="mr-1.5 rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-700 transition"
          >
            Axtar
          </button>

        </form>

      </div>

    </header>
  );
}