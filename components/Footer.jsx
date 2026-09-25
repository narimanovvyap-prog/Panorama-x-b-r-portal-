import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';

/* =========================================================
   SOSİAL İKONLAR
========================================================= */

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="currentColor"
    >
      <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.6 1.7-1.6h1.8V3.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.5v3h2.8v8h3.2Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="currentColor"
    >
      <path d="M21.4 4.6 18.2 20c-.2 1.1-.8 1.4-1.6.9l-4.5-3.3-2.2 2.1c-.2.2-.4.4-.8.4l.3-4.6 8.4-7.6c.4-.4-.1-.6-.6-.2L7 14.1 2.6 12.7c-1-.3-1-1 .2-1.5L20.1 4.4c.8-.3 1.5.2 1.3.2Z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="currentColor"
    >
      <path d="M12 2.5a9.5 9.5 0 0 0-8.2 14.3L2.5 21.5l4.8-1.2A9.5 9.5 0 1 0 12 2.5Zm0 17.1a7.6 7.6 0 0 1-3.9-1.1l-.3-.2-2.8.7.7-2.7-.2-.3A7.6 7.6 0 1 1 12 19.6Zm4.2-5.7c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.7 1-.1.2-.3.2-.5.1-.2-.1-.9-.3-1.8-1.1-.7-.6-1.1-1.3-1.2-1.5-.1-.2 0-.3.1-.5l.4-.4c.1-.1.2-.3.2-.4 0-.1 0-.3-.1-.4-.1-.1-.6-1.5-.8-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 3.9 3.5.5.2.9.4 1.2.5.5.2 1 .2 1.4.1.4-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#0b1220] text-gray-300">

      {/* =====================================================
          ÜST HİSSƏ
      ===================================================== */}

      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        <div className="grid grid-cols-1 gap-10 py-12 md:grid-cols-[1.5fr_1fr_1fr_1.2fr]">

          {/* =================================================
              LOGO / HAQQIMIZDA
          ================================================= */}

          <div>

            <Link
              href="/"
              className="group inline-flex items-center gap-3"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20">

                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 48 48"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    stroke="white"
                    strokeWidth="2"
                  />

                  <path
                    d="M10 27C14 27 15 20 19 20C23 20 24 28 28 28C32 28 34 20 38 20"
                    stroke="#60A5FA"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  <circle
                    cx="38"
                    cy="20"
                    r="2"
                    fill="#60A5FA"
                  />
                </svg>

              </div>

              <div>
                <div className="font-serif text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-blue-400">
                  PANORAMA
                </div>

                <div className="text-[9px] uppercase tracking-[0.25em] text-gray-500">
                  Xəbər Portalı
                </div>
              </div>

            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
              Azərbaycandan və dünyadan ən son xəbərləri,
              mühüm hadisələri və gündəmdə olan məlumatları
              operativ şəkildə təqdim edirik.
            </p>

            {/* =================================================
                SOSİAL ŞƏBƏKƏLƏR
            ================================================= */}

            <div className="mt-6">

              <div className="mb-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-600">
                Bizi izləyin
              </div>

              <div className="flex items-center gap-2">

                {/* Instagram */}
                <a
                  href="https://www.instagram.com/panoramaxeber"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-all hover:border-white/30 hover:bg-white hover:text-[#0b1220]"
                >
                  <InstagramIcon />
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/profile.php?id=61594450214117"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-all hover:border-white/30 hover:bg-white hover:text-[#0b1220]"
                >
                  <FacebookIcon />
                </a>

                {/* Telegram */}
                <a
                  href="https://t.me/panoramaxeberinfoaz"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-all hover:border-white/30 hover:bg-white hover:text-[#0b1220]"
                >
                  <TelegramIcon />
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/994553737900"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-all hover:border-white/30 hover:bg-white hover:text-[#0b1220]"
                >
                  <WhatsAppIcon />
                </a>

              </div>

            </div>

          </div>


          {/* =================================================
              KATEQORİYALAR
          ================================================= */}

          <div>

            <h3 className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Kateqoriyalar
            </h3>

            <ul className="space-y-3">

              {CATEGORIES.slice(0, 6).map((category) => (
                <li key={category.slug}>

                  <Link
                    href={`/${category.slug}`}
                    className="inline-block text-sm text-gray-400 transition-all hover:translate-x-1 hover:text-white"
                  >
                    {category.name}
                  </Link>

                </li>
              ))}

            </ul>

          </div>


          {/* =================================================
              FAYDALI KEÇİDLƏR
          ================================================= */}

          <div>

            <h3 className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Faydalı keçidlər
            </h3>

            <ul className="space-y-3">

              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Əsas səhifə
                </Link>
              </li>

              <li>
                <Link
                  href="/haqqimizda"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Haqqımızda
                </Link>
              </li>

              <li>
                <Link
                  href="/elaqe"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Əlaqə
                </Link>
              </li>

              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-400 transition-colors hover:text-white"
                >
                  Son xəbərlər
                </Link>
              </li>

            </ul>

          </div>


          {/* =================================================
              ƏLAQƏ
          ================================================= */}

          <div>

            <h3 className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-white">
              Əlaqə
            </h3>

            <div className="space-y-4">

              {/* Ünvan */}
              <div className="flex gap-3">

                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white/5 text-xs">
                  📍
                </span>

                <div>
                  <div className="text-[9px] uppercase tracking-widest text-gray-600">
                    Ünvan
                  </div>

                  <div className="mt-1 text-sm text-gray-400">
                    Bakı, Azərbaycan
                  </div>
                </div>

              </div>


              {/* Telefon */}
              <div className="flex gap-3">

                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white/5 text-xs">
                  ☎
                </span>

                <div>
                  <div className="text-[9px] uppercase tracking-widest text-gray-600">
                    Telefon
                  </div>

                  <a
                    href="tel:+994553737900"
                    className="mt-1 block text-sm text-gray-400 transition hover:text-white"
                  >
                    055 373 79 00
                  </a>
                </div>

              </div>


              {/* E-poçt */}
              <div className="flex gap-3">

                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white/5 text-xs">
                  @
                </span>

                <div className="min-w-0">

                  <div className="text-[9px] uppercase tracking-widest text-gray-600">
                    E-poçt
                  </div>

                  <a
                    href="mailto:narimanovvyap@gmail.com"
                    className="mt-1 block break-all text-sm text-gray-400 transition hover:text-white"
                  >
                    narimanovvyap@gmail.com
                  </a>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            REDAKSİYA
        ===================================================== */}

        <div className="border-t border-white/10 py-7">

          <div className="grid gap-6 md:grid-cols-2">

            <div>

              <div className="mb-2 text-[9px] uppercase tracking-[0.2em] text-gray-600">
                Redaksiya
              </div>

              <p className="text-sm text-gray-400">
                <span className="font-semibold text-gray-300">
                  Baş redaktor:
                </span>{' '}
                Aydan Əliyeva
              </p>

            </div>

            <div className="md:text-right">

              <div className="mb-2 text-[9px] uppercase tracking-[0.2em] text-gray-600">
                Reklam
              </div>

              <p className="text-sm text-gray-400">
                Saytımızda reklam yerləşdirmək üçün
                bizimlə əlaqə saxlaya bilərsiniz.
              </p>

            </div>

          </div>

        </div>


        {/* =====================================================
            ALT HİSSƏ
        ===================================================== */}

        <div className="border-t border-white/10 py-5">

          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">

            <p className="text-center text-[11px] text-gray-600 md:text-left">
              © 2026 PANORAMA Xəbər Portalı. Bütün hüquqlar qorunur.
            </p>

            <p className="text-center text-[11px] text-gray-600">
              Materiallardan istifadə zamanı mənbəyə istinad edilməlidir.
            </p>

          </div>

        </div>


        {/* =====================================================
            ALT LOGO
        ===================================================== */}

        <div className="border-t border-white/5 py-5 text-center">

          <span className="text-[9px] uppercase tracking-[0.35em] text-gray-700">
            PANORAMA · XƏBƏR · GÜNDƏM · AZƏRBAYCAN
          </span>

        </div>

      </div>

    </footer>
  );
}
