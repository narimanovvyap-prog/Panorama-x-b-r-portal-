import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';

export default function Footer() {
  return (
    <footer className="bg-[#0b1220] text-gray-300 mt-16">

      {/* =====================================================
          ÜST HİSSƏ
      ===================================================== */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-10 py-12">

          {/* =================================================
              LOGO / HAQQIMIZDA
          ================================================= */}

          <div>

            <Link
              href="/"
              className="inline-flex items-center gap-3 group"
            >

              <div className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center">

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

                <div className="font-serif text-2xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
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


            {/* SOSİAL ŞƏBƏKƏLƏR */}

            <div className="flex items-center gap-2 mt-6">

              <a
                href="#"
                className="w-9 h-9 border border-white/10 rounded-full flex items-center justify-center text-xs font-bold hover:bg-white hover:text-[#0b1220] transition"
                aria-label="Facebook"
              >
                f
              </a>

              <a
                href="#"
                className="w-9 h-9 border border-white/10 rounded-full flex items-center justify-center text-xs font-bold hover:bg-white hover:text-[#0b1220] transition"
                aria-label="Instagram"
              >
                ◎
              </a>

              <a
                href="#"
                className="w-9 h-9 border border-white/10 rounded-full flex items-center justify-center text-xs font-bold hover:bg-white hover:text-[#0b1220] transition"
                aria-label="Telegram"
              >
                ➤
              </a>

            </div>

          </div>


          {/* =================================================
              KATEQORİYALAR
          ================================================= */}

          <div>

            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-5">
              Kateqoriyalar
            </h3>

            <ul className="space-y-3">

              {CATEGORIES.slice(0, 6).map((category) => (

                <li key={category.slug}>

                  <Link
                    href={`/${category.slug}`}
                    className="text-sm text-gray-400 hover:text-white hover:translate-x-1 inline-block transition-all"
                  >
                    {category.name}
                  </Link>

                </li>

              ))}

            </ul>

          </div>


          {/* =================================================
              FAYDALI LİNKLƏR
          ================================================= */}

          <div>

            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-5">
              Faydalı keçidlər
            </h3>

            <ul className="space-y-3">

              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Əsas səhifə
                </Link>
              </li>

              <li>
                <Link
                  href="/haqqimizda"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Haqqımızda
                </Link>
              </li>

              <li>
                <Link
                  href="/elaqe"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Əlaqə
                </Link>
              </li>

              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
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

            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white mb-5">
              Əlaqə
            </h3>


            <div className="space-y-4">

              <div className="flex gap-3">

                <span className="w-8 h-8 flex-none rounded-full bg-white/5 flex items-center justify-center text-xs">
                  📍
                </span>

                <div>

                  <div className="text-[9px] uppercase tracking-widest text-gray-600">
                    Ünvan
                  </div>

                  <div className="text-sm text-gray-400 mt-1">
                    Bakı, Azərbaycan
                  </div>

                </div>

              </div>


              <div className="flex gap-3">

                <span className="w-8 h-8 flex-none rounded-full bg-white/5 flex items-center justify-center text-xs">
                  ☎
                </span>

                <div>

                  <div className="text-[9px] uppercase tracking-widest text-gray-600">
                    Telefon
                  </div>

                  <a
                    href="tel:+994553737900"
                    className="text-sm text-gray-400 mt-1 block hover:text-white transition"
                  >
                    055 373 79 00
                  </a>

                </div>

              </div>


              <div className="flex gap-3">

                <span className="w-8 h-8 flex-none rounded-full bg-white/5 flex items-center justify-center text-xs">
                  @
                </span>

                <div className="min-w-0">

                  <div className="text-[9px] uppercase tracking-widest text-gray-600">
                    E-poçt
                  </div>

                  <a
                    href="mailto:panoramaxeber@gmail.com"
                    className="text-sm text-gray-400 mt-1 block break-all hover:text-white transition"
                  >
                    panoramaxeber@gmail.com
                  </a>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* =====================================================
            REDAKSİYA MƏLUMATLARI
        ===================================================== */}

        <div className="border-t border-white/10 py-7">

          <div className="grid md:grid-cols-2 gap-6">

            <div>

              <div className="text-[9px] uppercase tracking-[0.2em] text-gray-600 mb-2">
                Redaksiya
              </div>

              <p className="text-sm text-gray-400">
                <span className="text-gray-300 font-semibold">
                  Baş redaktor:
                </span>{' '}
                Aydan Əliyeva
              </p>

            </div>


            <div className="md:text-right">

              <div className="text-[9px] uppercase tracking-[0.2em] text-gray-600 mb-2">
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
            HÜQUQİ MƏLUMAT
        ===================================================== */}

        <div className="border-t border-white/10 py-5">

          <div className="flex flex-col md:flex-row items-center justify-between gap-3">

            <p className="text-[11px] text-gray-600 text-center md:text-left">
              © 2026 PANORAMA Xəbər Portalı. Bütün hüquqlar qorunur.
            </p>

            <p className="text-[11px] text-gray-600 text-center">
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