import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';

export default function Footer() {
  return (
    <footer className="bg-ink text-gray-300 mt-10">

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* ================= YUXARI HİSSƏ ================= */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-white/10">

          {/* BÖLMƏLƏR */}

          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-3">
              Bölmələr
            </h4>

            <ul className="space-y-2 text-sm">

              {CATEGORIES.slice(0, 4).map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/${c.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}

            </ul>
          </div>

          {/* DAHA ÇOX */}

          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-3">
              Daha çox
            </h4>

            <ul className="space-y-2 text-sm">

              <li>
                <Link
                  href="/haqqimizda"
                  className="hover:text-white transition-colors"
                >
                  Haqqımızda
                </Link>
              </li>

              <li>
                <Link
                  href="/elaqe"
                  className="hover:text-white transition-colors"
                >
                  Əlaqə
                </Link>
              </li>

            </ul>
          </div>

          {/* ƏLAQƏ */}

          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-3">
              Əlaqə
            </h4>

            <div className="space-y-2 text-sm text-gray-400">

              <p>
                📍 Bakı, Azərbaycan
              </p>

              <p>
                ☎️ 055 373 79 00
              </p>

              <p className="break-all">
                📧 panoramaxeber@gmail.com
              </p>

            </div>
          </div>

        </div>

        {/* ================= REDAKSİYA ================= */}

        <div className="py-7 border-b border-white/10">

          <div className="space-y-4 text-xs text-gray-400 leading-relaxed">

            <p>
              <span className="font-semibold text-gray-300">
                Baş redaktor:
              </span>{' '}
              Aydan Əliyeva
            </p>

            <p>
              ©️ 2026. Bütün hüquqlar qorunur.
              Saytda yayımlanan materiallardan istifadə edildikdə
              PANORAMA Xəbərə istinad edilməsi zəruridir.
            </p>

            <p>
              Saytda yayımlanan reklamların məzmununa görə
              redaksiya məsuliyyət daşımır.
            </p>

          </div>

        </div>

        {/* ================= ALT ================= */}

        <div className="pt-6 text-xs text-gray-500 text-center">

          <span>
            PANORAMA Xəbər Portalı
          </span>

        </div>

      </div>

    </footer>
  );
}