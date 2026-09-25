'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CATEGORIES } from '@/lib/categories';

const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/panoramaxeber',
  facebook: 'https://www.facebook.com/profile.php?id=61594450214117',
  telegram: 'https://t.me/panoramaxeberinfoaz',
  whatsapp: 'https://wa.me/994553737900',
};

/* =========================
   INSTAGRAM
========================= */

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle
        cx="12"
        cy="12"
        r="4"
        stroke="currentColor"
        strokeWidth="2"
      />

      <circle
        cx="17.5"
        cy="6.5"
        r="1.2"
        fill="currentColor"
      />
    </svg>
  );
}

/* =========================
   FACEBOOK
========================= */

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.6-1.6h1.7V3.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.3v3h2.8v8h3.4Z"
      />
    </svg>
  );
}

/* =========================
   TELEGRAM
========================= */

function TelegramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M21.7 3.3 18.5 20c-.2 1.2-.9 1.5-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L6 13.7l-4.9-1.5c-1.1-.3-1.1-1.1.2-1.6L20.4 3c.9-.3 1.7.2 1.3.3Z"
      />
    </svg>
  );
}

/* =========================
   WHATSAPP
========================= */

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M12 2a9.9 9.9 0 0 0-8.5 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1 1 12 20Zm4.4-5.9c-.2-.1-1.3-.6-1.5-.7-.2-.1-.4-.1-.5.1-.2.2-.6.7-.7.8-.1.1-.3.2-.5.1-1.5-.7-2.5-1.3-3.5-2.9-.3-.5.3-.4.8-1.3.1-.2.1-.3 0-.5-.1-.1-.5-1.2-.7-1.6-.2-.4-.4-.4-.5-.4h-.4c-.2 0-.5.1-.7.3-.7.7-.9 1.6-.6 2.5.1.3.2.6.4.9.9 1.7 2.3 3.1 4.1 3.9.6.3 1.1.5 1.5.6.6.2 1.1.2 1.5.1.5-.1 1.3-.5 1.5-1 .2-.5.2-.9.1-1-.1-.1-.2-.2-.4-.3Z"
      />
    </svg>
  );
}

/* =========================
   SOSİAL İKON
========================= */

function SocialIcon({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="
        w-8
        h-8
        rounded-full
        border
        border-line
        flex
        items-center
        justify-center
        text-gray-600
        hover:bg-ink
        hover:text-white
        hover:border-ink
        transition-all
        duration-200
        flex-shrink-0
      "
    >
      {children}
    </a>
  );
}

export default function Header() {
  const router = useRouter();

  const [q, setQ] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [language, setLanguage] = useState('az');

  /* =========================
     DİL
  ========================= */

  useEffect(() => {
    const savedLanguage =
      localStorage.getItem('site-language') || 'az';

    setLanguage(savedLanguage);
  }, []);

  /* =========================
     TARİX + SAAT
  ========================= */

  useEffect(() => {
    function updateDateTime() {
      const now = new Date();

      const date = new Intl.DateTimeFormat('az-AZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now);

      const time = new Intl.DateTimeFormat('az-AZ', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(now);

      setDateTime(`${date} · ${time}`);
    }

    updateDateTime();

    const interval = setInterval(
      updateDateTime,
      60000
    );

    return () => clearInterval(interval);
  }, []);

  /* =========================
     DİL DƏYİŞ
  ========================= */

  function changeLanguage(lang) {
    setLanguage(lang);

    localStorage.setItem(
      'site-language',
      lang
    );

    window.location.reload();
  }

  /* =========================
     AXTARIŞ
  ========================= */

  function handleSearch(e) {
    e.preventDefault();

    if (q.trim()) {
      router.push(
        `/axtar?q=${encodeURIComponent(q.trim())}`
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

          {/* =========================
              LOGO
          ========================= */}

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
                Xəbər Portalı
              </div>

            </div>

          </Link>

          {/* =========================
              SAĞ TƏRƏF
          ========================= */}

          <div className="flex flex-col items-end gap-2">

            {/* TARİX + SOSİAL ŞƏBƏKƏLƏR */}

            <div className="flex items-center gap-3">

              {dateTime && (
                <div className="text-[11px] sm:text-xs text-gray-500 whitespace-nowrap">
                  {dateTime}
                </div>
              )}

              {/* SOSİAL İKONLAR
                  MOBİLDA DA GÖRÜNÜR */}

              <div className="flex items-center gap-1.5">

                <SocialIcon
                  href={SOCIAL_LINKS.instagram}
                  label="Instagram"
                >
                  <InstagramIcon />
                </SocialIcon>

                <SocialIcon
                  href={SOCIAL_LINKS.facebook}
                  label="Facebook"
                >
                  <FacebookIcon />
                </SocialIcon>

                <SocialIcon
                  href={SOCIAL_LINKS.telegram}
                  label="Telegram"
                >
                  <TelegramIcon />
                </SocialIcon>

                <SocialIcon
                  href={SOCIAL_LINKS.whatsapp}
                  label="WhatsApp"
                >
                  <WhatsAppIcon />
                </SocialIcon>

              </div>

            </div>

            {/* =========================
                DİL SEÇİMİ
            ========================= */}

            <div className="flex items-center gap-1">

              <button
                type="button"
                onClick={() =>
                  changeLanguage('az')
                }
                className={`text-xs font-semibold px-2 py-1 rounded-sm transition ${
                  language === 'az'
                    ? 'bg-ink text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                AZ 🇦🇿
              </button>

              <button
                type="button"
                onClick={() =>
                  changeLanguage('tr')
                }
                className={`text-xs font-semibold px-2 py-1 rounded-sm transition ${
                  language === 'tr'
                    ? 'bg-ink text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                TR 🇹🇷
              </button>

              <button
                type="button"
                onClick={() =>
                  changeLanguage('ru')
                }
                className={`text-xs font-semibold px-2 py-1 rounded-sm transition ${
                  language === 'ru'
                    ? 'bg-ink text-white'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                RU 🇷🇺
              </button>

            </div>

            {/* =========================
                DESKTOP AXTARIŞ
            ========================= */}

            <form
              onSubmit={handleSearch}
              className="hidden md:flex items-center border border-line rounded-sm overflow-hidden"
            >

              <input
                value={q}
                onChange={(e) =>
                  setQ(e.target.value)
                }
                placeholder="Axtar..."
                className="px-3 py-1.5 text-sm outline-none w-52"
              />

              <button
                type="submit"
                className="bg-ink text-white px-3 py-1.5 text-sm"
              >
                Axtar
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
            Əsas səhifə
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
          MOBİL SOSİAL İKONLAR
      ========================= */}

      <div className="sm:hidden flex items-center justify-center gap-2 py-2 border-b border-line bg-bg">

        <SocialIcon
          href={SOCIAL_LINKS.instagram}
          label="Instagram"
        >
          <InstagramIcon />
        </SocialIcon>

        <SocialIcon
          href={SOCIAL_LINKS.facebook}
          label="Facebook"
        >
          <FacebookIcon />
        </SocialIcon>

        <SocialIcon
          href={SOCIAL_LINKS.telegram}
          label="Telegram"
        >
          <TelegramIcon />
        </SocialIcon>

        <SocialIcon
          href={SOCIAL_LINKS.whatsapp}
          label="WhatsApp"
        >
          <WhatsAppIcon />
        </SocialIcon>

      </div>

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
          placeholder="Xəbər axtar..."
          className="flex-1 px-4 py-2 text-sm outline-none"
        />

        <button
          type="submit"
          className="bg-ink text-white px-4 text-sm"
        >
          Axtar
        </button>

      </form>

    </header>
  );
}
