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

  // ================= BAKI HAVA =================

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
      } catch (error) {
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

    router.push(
      `/axtar?q=${encodeURIComponent(value)}`
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">

      {/* ================= ƏSAS HEADER ================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="h-[76px] flex items-center justify-between gap-6">

          {/* LOGO */}

          <Link
            href="/"
            className="flex items-center gap-3 shrink-0 group"
          >

            {/* LOGO İKONU */}

            <div className="w-11 h-11 rounded-full bg-gray-900 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">

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

            {/* LOGO YAZISI */}

            <div className="leading-none">

              <div className="font-serif text-[25px] font-bold tracking-tight text-gray-900">
                PANORAMA
              </div>

              <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-gray-500">
                Xəbər Portalı
              </div>

            </div>

          </Link>

          {/* SAĞ TƏRƏF */}

          <div className="flex items-center gap-3">

            {/* BAKI HAVASI */}

            <div className="hidden sm:flex items-center gap-2 rounded-full bg-gray-50 border border-gray-200 px-4 py-2 text-xs text-gray-600 shadow-sm">

              <span className="text-base">
                ☀️
              </span>

              <span className="font-medium">
                {weather}
              </span>

            </div>

            {/* SAAT */}

            <div className="hidden sm:flex items-center gap-2 rounded-full bg-gray-50 border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 tabular-nums shadow-sm">

              <span className="text-gray-500">
                ◷
              </span>

              {time}

            </div>

          </div>

        </div>

      </div>

      {/* ================= NAVİQASİYA ================= */}

      <nav className="bg-gray-900">

        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">

            <Link
              href="/"
              className="text-white text-sm font-semibold px-4 py-3 whitespace-nowrap rounded-md hover:bg-white/10 transition"
            >
              Əsas səhifə
            </Link>

            {CATEGORIES.map((category) => (

              <Link
                key={category.slug}
                href={`/${category.slug}`}
                className="text-gray-300 hover:text-white text-sm font-semibold px-4 py-3 whitespace-nowrap rounded-md hover:bg-white/10 transition"
              >
                {category.name}
              </Link>

            ))}

          </div>

        </div>

      </nav>

      {/* ================= AXTARIŞ ================= */}

      <div className="bg-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">

          <form
            onSubmit={handleSearch}
            className="w-full flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden focus-within:bg-white focus-within:border-gray-400 focus-within:shadow-sm transition"
          >

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
                  d="m20 20-3.5-3.5"
                />
              </svg>

            </div>

            <input
              type="text"
              value={q}
              onChange={(e) =>
                setQ(e.target.value)
              }
              placeholder="Xəbər axtar..."
              className="flex-1 bg-transparent px-3 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none"
            />

            <button
              type="submit"
              className="mr-1 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 transition"
            >
              Axtar
            </button>

          </form>

        </div>

      </div>

    </header>
  );
}