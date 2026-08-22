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
  const [menuOpen, setMenuOpen] = useState(false);

  // =====================================================
  // CANLI SAAT
  // =====================================================

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

  // =====================================================
  // BAKI HAVA
  // =====================================================

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

    const interval = setInterval(
      getWeather,
      30 * 60 * 1000
    );

    return () => clearInterval(interval);
  }, []);

  // =====================================================
  // HAVA MƏLUMATI
  // =====================================================

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

  // =====================================================
  // AXTARIŞ
  // =====================================================

  function handleSearch(e) {
    e.preventDefault();

    if (q.trim()) {
      router.push(
        `/axtar?q=${encodeURIComponent(q.trim())}`
      );

      setMenuOpen(false);
    }
  }

  const weatherInfo = weather
    ? getWeatherInfo(weather.code)
    : null;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">

      {/* =================================================
          YUXARI İNFORMASİYA XƏTTİ
      ================================================= */}

      <div className="hidden lg:block bg-[#111827] text-white">

        <div className="max-w-7xl mx-auto px-4">

          <div className="h-9 flex items-center justify-between text-[11px]">

            <div className="flex items-center gap-5 text-gray-300">

              <span>
                PANORAMA XƏBƏR PORTALI
              </span>

              <span className="text-gray-600">
                |
              </span>

              <span>
                Azərbaycandan və dünyadan ən son xəbərlər
              </span>

            </div>

            <div className="flex items-center gap-5">

              <span>
                Bakı
              </span>

              <span className="text-gray-500">
                {time || '--:--:--'}
              </span>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          ƏSAS HEADER
      ================================================= */}

      <div className="bg-white">

        <div className="max-w-7xl mx-auto px-4">

          <div className="min-h-[92px] flex items-center justify-between gap-6">

            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              href="/"
              className="flex items-center gap-3 group flex-none"
              onClick={() => setMenuOpen(false)}
            >

              {/* LOGO İKONU */}

              <div className="relative w-12 h-12">

                <div className="absolute inset-0 rounded-full border-[3px] border-[#172b4d]" />

                <div className="absolute inset-[6px] rounded-full border border-[#2563eb]" />

                <svg
                  viewBox="0 0 48 48"
                  className="absolute inset-0 w-full h-full"
                  fill="none"
                >

                  <path
                    d="M9 27C13 27 15 19 19 19C23 19 25 29 29 29C33 29 35 20 39 20"
                    stroke="#2563eb"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  <circle
                    cx="39"
                    cy="20"
                    r="2"
                    fill="#2563eb"
                  />

                </svg>

              </div>


              {/* LOGO YAZISI */}

              <div>

                <div className="text-[25px] md:text-[29px] font-black tracking-[-0.04em] text-[#111827] leading-none group-hover:text-[#2563eb] transition-colors">
                  PANORAMA
                </div>

                <div className="text-[9px] md:text-[10px] uppercase tracking-[0.28em] text-gray-400 mt-1">
                  XƏBƏR PORTALI
                </div>

              </div>

            </Link>


            {/* =================================================
                ORTA BLOK
            ================================================= */}

            <div className="hidden md:flex flex-1 justify-center">

              <div className="flex items-center gap-8">

                {/* HAVA */}

                <div className="flex items-center gap-3">

                  <div className="text-2xl">
                    {weatherInfo?.icon || '🌤️'}
                  </div>

                  <div>

                    <div className="text-[9px] uppercase tracking-widest text-gray-400">
                      Bakı
                    </div>

                    <div className="font-bold text-sm text-[#111827]">
                      {weather
                        ? `${weather.temperature}°C`
                        : '--°C'}
                    </div>

                  </div>

                </div>


                <div className="h-9 w-px bg-gray-200" />


                {/* SAAT */}

                <div>

                  <div className="text-[9px] uppercase tracking-widest text-gray-400">
                    İndi
                  </div>

                  <div className="font-mono font-bold text-sm text-[#111827]">
                    {time || '--:--:--'}
                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                SAĞ TƏRƏF
            ================================================= */}

            <div className="flex items-center gap-2">

              {/* DESKTOP AXTARIŞ */}

              <form
                onSubmit={handleSearch}
                className="hidden lg:flex items-center border border-gray-200 rounded-full overflow-hidden h-10"
              >

                <input
                  value={q}
                  onChange={(e) =>
                    setQ(e.target.value)
                  }
                  placeholder="Xəbər axtar..."
                  className="w-44 px-4 text-sm outline-none bg-white"
                />

                <button
                  type="submit"
                  aria-label="Axtar"
                  className="w-10 h-10 flex items-center justify-center bg-[#172b4d] text-white hover:bg-[#2563eb] transition"
                >

                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >

                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                    />

                    <path d="m20 20-4-4" />

                  </svg>

                </button>

              </form>


              {/* MOBİL MENYU */}

              <button
                type="button"
                onClick={() =>
                  setMenuOpen(!menuOpen)
                }
                className="lg:hidden w-10 h-10 border border-gray-200 flex items-center justify-center"
                aria-label="Menyu"
              >

                <div className="space-y-1">

                  <span className="block w-5 h-[2px] bg-[#172b4d]" />
                  <span className="block w-5 h-[2px] bg-[#172b4d]" />
                  <span className="block w-5 h-[2px] bg-[#172b4d]" />

                </div>

              </button>

            </div>

          </div>

        </div>

      </div>


      {/* =================================================
          ƏSAS MENYU
      ================================================= */}

      <nav className="bg-[#172b4d]">

        <div className="max-w-7xl mx-auto px-4">

          <div className="hidden lg:flex items-center h-12">

            <Link
              href="/"
              className="h-12 flex items-center px-4 text-white text-sm font-bold bg-[#2563eb] hover:bg-[#1d4ed8] transition"
            >
              Əsas səhifə
            </Link>

            {CATEGORIES.map((category) => (
              <Link
                key={category.slug}
                href={`/${category.slug}`}
                className="h-12 flex items-center px-4 text-gray-200 text-sm font-semibold hover:bg-white/10 hover:text-white transition"
              >
                {category.name}
              </Link>
            ))}

            <Link
              href="/"
              className="ml-auto text-gray-300 text-xs font-semibold hover:text-white transition"
            >
              Bütün xəbərlər →
            </Link>

          </div>


          {/* TABLET / MOBİL */}

          <div className="lg:hidden flex items-center h-11 overflow-x-auto">

            <Link
              href="/"
              className="text-white text-xs font-bold px-3 whitespace-nowrap"
            >
              Əsas
            </Link>

            {CATEGORIES.slice(0, 5).map(
              (category) => (
                <Link
                  key={category.slug}
                  href={`/${category.slug}`}
                  className="text-gray-300 text-xs font-semibold px-3 whitespace-nowrap"
                >
                  {category.name}
                </Link>
              )
            )}

          </div>

        </div>

      </nav>


      {/* =================================================
          MOBİL MENYU
      ================================================= */}

      {menuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-lg">

          <div className="max-w-7xl mx-auto px-4 py-4">

            {/* AXTARIŞ */}

            <form
              onSubmit={handleSearch}
              className="flex border border-gray-200 mb-4"
            >

              <input
                value={q}
                onChange={(e) =>
                  setQ(e.target.value)
                }
                placeholder="Xəbər axtar..."
                className="flex-1 min-w-0 px-4 py-3 text-sm outline-none"
              />

              <button
                type="submit"
                className="px-5 bg-[#172b4d] text-white text-sm font-semibold"
              >
                Axtar
              </button>

            </form>


            {/* KATEQORİYALAR */}

            <div className="grid grid-cols-2 gap-1">

              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="p-3 bg-gray-50 text-sm font-semibold text-[#172b4d]"
              >
                Əsas səhifə
              </Link>

              {CATEGORIES.map((category) => (
                <Link
                  key={category.slug}
                  href={`/${category.slug}`}
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="p-3 bg-gray-50 text-sm font-semibold text-[#172b4d]"
                >
                  {category.name}
                </Link>
              ))}

            </div>


            {/* MOBİL HAVA */}

            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">

              <div className="flex items-center gap-3">

                <span className="text-xl">
                  {weatherInfo?.icon || '🌤️'}
                </span>

                <div>

                  <div className="text-[9px] uppercase tracking-widest text-gray-400">
                    Bakı
                  </div>

                  <div className="font-bold text-sm">
                    {weather
                      ? `${weather.temperature}°C`
                      : '--°C'}
                  </div>

                </div>

              </div>


              <div className="text-right">

                <div className="text-[9px] uppercase tracking-widest text-gray-400">
                  Saat
                </div>

                <div className="font-mono font-bold text-sm">
                  {time || '--:--:--'}
                </div>

              </div>

            </div>

          </div>

        </div>
      )}

    </header>
  );
}