'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CATEGORIES } from '@/lib/categories';

const LANGUAGES = [
  { code: 'az', label: 'AZ', flag: '🇦🇿' },
  { code: 'ru', label: 'RU', flag: '🇷🇺' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
];

const translations = {
  az: {
    portal: 'Xəbər Portalı',
    search: 'Axtar',
    searchNews: 'Xəbər axtar...',
    home: 'Əsas səhifə',
  },

  ru: {
    portal: 'Новостной портал',
    search: 'Поиск',
    searchNews: 'Поиск новостей...',
    home: 'Главная',
  },

  en: {
    portal: 'News Portal',
    search: 'Search',
    searchNews: 'Search news...',
    home: 'Home',
  },
};

export default function Header() {
  const router = useRouter();

  const [q, setQ] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [language, setLanguage] = useState('az');

  // =========================
  // DİLİ YADDA SAXLA
  // =========================

  useEffect(() => {
    const savedLanguage = localStorage.getItem(
      'panorama-language'
    );

    if (
      savedLanguage === 'az' ||
      savedLanguage === 'ru' ||
      savedLanguage === 'en'
    ) {
      setLanguage(savedLanguage);
    }
  }, []);

  // =========================
  // DİL DƏYİŞ
  // =========================

  function changeLanguage(code) {
    setLanguage(code);

    localStorage.setItem(
      'panorama-language',
      code
    );

    window.location.reload();
  }

  // =========================
  // TARİX VƏ SAAT
  // =========================

  useEffect(() => {
    function updateDateTime() {
      const now = new Date();

      const locales = {
        az: 'az-AZ',
        ru: 'ru-RU',
        en: 'en-GB',
      };

      const locale =
        locales[language] || 'az-AZ';

      const date = new Intl.DateTimeFormat(
        locale,
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }
      ).format(now);

      const time = new Intl.DateTimeFormat(
        locale,
        {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }
      ).format(now);

      setDateTime(
        `${date} · ${time}`
      );
    }

    updateDateTime();

    const interval = setInterval(
      updateDateTime,
      60000
    );

    return () =>
      clearInterval(interval);
  }, [language]);

  const t =
    translations[language] ||
    translations.az;

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

  return (
    <header className="border-b-2 border-ink bg-bg sticky top-0 z-30">

      {/* =========================
          YUXARI HİSSƏ
      ========================= */}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">

        <div className="flex items-center justify-between gap-4">

          {/* LOGO */}

          <Link
            href="/"
            className="flex items-center gap-3 flex-shrink-0"
          >

            <div className="w-[34px] h-[34px] flex-shrink-0">

              <svg
                width="34"
                height="34"
                viewBox="0 0 40 40"
                xmlns="http://www.w3.org/2000/svg"
              >

                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  fill="white"
                  stroke="#10151C"
                  strokeWidth="2"
                />

                <path
                  d="M8 22C12 18 16 26 20 20C24 14 28 22 32 18"
                  stroke="#1D4E89"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />

              </svg>

            </div>

            <div>

              <div className="font-serif text-2xl font-bold tracking-tight">
                PANORAMA
              </div>

              <div className="text-[10px] uppercase tracking-widest text-gray-500">
                {t.portal}
              </div>

            </div>

          </Link>

          {/* SAĞ TƏRƏF */}

          <div className="flex flex-col items-end gap-2">

            {/* =========================
                DİL DÜYMƏLƏRİ
            ========================= */}

            <div className="flex items-center gap-1">

              {LANGUAGES.map((lang) => (

                <button
                  key={lang.code}
                  type="button"
                  onClick={() =>
                    changeLanguage(lang.code)
                  }
                  className={`text-xs px-2 py-1 border ${
                    language === lang.code
                      ? 'bg-ink text-white border-ink'
                      : 'border-line text-gray-500'
                  }`}
                >
                  {lang.flag} {lang.label}
                </button>

              ))}

            </div>

            {/* TARİX */}

            {dateTime && (
              <div className="text-[11px] sm:text-xs text-gray-500 whitespace-nowrap">
                {dateTime}
              </div>
            )}

            {/* DESKTOP AXTARIŞ */}

            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center border border-line rounded-sm overflow-hidden"
            >

              <input
                value={q}
                onChange={(e) =>
                  setQ(e.target.value)
                }
                placeholder={t.search}
                className="px-3 py-1.5 text-sm outline-none w-52"
              />

              <button
                type="submit"
                className="bg-ink text-white px-3 py-1.5 text-sm"
              >
                {t.search}
              </button>

            </form>

          </div>

        </div>

      </div>

      {/* =========================
          NAVİQASİYA
      ========================= */}

      <nav className="bg-ink overflow-x-auto">

        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center">

          <Link
            href="/"
            className="text-gray-300 hover:text-white text-sm font-semibold px-3 py-3 whitespace-nowrap"
          >
            {t.home}
          </Link>

          {CATEGORIES.map((c) => (

            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="text-gray-300 hover:text-white text-sm font-semibold px-3 py-3 whitespace-nowrap"
            >
              {c.name}
            </Link>

          ))}

        </div>

      </nav>

      {/* =========================
          MOBİL AXTARIŞ
      ========================= */}

      <form
        onSubmit={handleSearch}
        className="md:hidden flex border-b border-line"
      >

        <input
          value={q}
          onChange={(e) =>
            setQ(e.target.value)
          }
          placeholder={t.searchNews}
          className="flex-1 px-4 py-2 text-sm outline-none"
        />

        <button
          type="submit"
          className="bg-ink text-white px-4 text-sm"
        >
          {t.search}
        </button>

      </form>

    </header>
  );
}