import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import { categoryName, categoryColor } from '@/lib/categories';

export const revalidate = 0;

async function getData() {
  // =========================
  // BAŞ XƏBƏR
  // =========================

  const { data: featured } = await supabase
    .from('articles')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(1);

  // =========================
  // SON XƏBƏRLƏR
  // =========================

  const { data: latest } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(9);

  // =========================
  // ƏN ÇOX OXUNANLAR
  // =========================

  const { data: mostRead } = await supabase
    .from('articles')
    .select('id, title, slug, views')
    .order('views', { ascending: false })
    .limit(5);

  // =========================
  // REKLAMLAR
  // =========================

  const { data: advertisements, error: adsError } =
    await supabase
      .from('advertisements')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

  if (adsError) {
    console.error('Reklam xətası:', adsError);
  }

  const now = new Date();

  const activeAdvertisements = (advertisements || []).filter(
    (ad) => {
      const startOk =
        !ad.start_date ||
        new Date(ad.start_date) <= now;

      const endOk =
        !ad.end_date ||
        new Date(ad.end_date) >= now;

      const positionOk =
        ad.position === 'homepage' ||
        ad.position === 'both';

      return (
        startOk &&
        endOk &&
        positionOk
      );
    }
  );

  return {
    featured:
      featured?.[0] ||
      latest?.[0] ||
      null,

    latest: latest || [],

    mostRead: mostRead || [],

    advertisements:
      activeAdvertisements,
  };
}

export default async function HomePage() {
  const {
    featured,
    latest,
    mostRead,
    advertisements,
  } = await getData();

  // Baş xəbəri Gündəm siyahısından çıxarırıq
  const restLatest = latest.filter(
    (a) => a.id !== featured?.id
  );

  // Ana səhifədə göstəriləcək ilk reklam
  const homepageAd =
    advertisements?.[0] || null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

      {/* =====================================================
          BAŞ XƏBƏR + SON XƏBƏRLƏR
      ===================================================== */}

      {featured && (
        <section className="grid md:grid-cols-[1.6fr_1fr] gap-8 pb-8 border-b border-line mb-8">

          {/* =========================
              BAŞ XƏBƏR
          ========================= */}

          <div>

            <Link
              href={`/article/${featured.slug}`}
              className="group block"
            >

              {/* ŞƏKİL */}

              <div className="aspect-[16/10] bg-ink2 mb-4 overflow-hidden rounded-sm">

                {featured.image_url ? (
                  <img
                    src={featured.image_url}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    PANORAMA
                  </div>
                )}

              </div>

              {/* KATEQORİYA */}

              <div
                className="font-mono text-[11px] font-semibold uppercase tracking-wider mb-2"
                style={{
                  color: categoryColor(
                    featured.category
                  ),
                }}
              >
                ◆ Baş xəbər ·{' '}
                {categoryName(
                  featured.category
                )}
              </div>

              {/* BAŞLIQ */}

              <h1 className="font-serif text-3xl md:text-4xl font-semibold leading-tight mb-3 group-hover:text-blue transition-colors">
                {featured.title}
              </h1>

              {/* QISA TƏSVİR */}

              {featured.excerpt && (
                <p className="text-gray-600 leading-relaxed mb-3">
                  {featured.excerpt}
                </p>
              )}

              {/* MƏNBƏ */}

              {featured.source && (
                <div className="text-xs text-gray-400">
                  Mənbə: {featured.source}
                </div>
              )}

            </Link>

          </div>

          {/* =========================
              SON XƏBƏRLƏR
              01,02,03,04 YOXDUR
              ÖZ ŞƏKİLLƏRİ VAR
          ========================= */}

          <div className="flex flex-col">

            {restLatest
              .slice(0, 4)
              .map((a) => (

                <Link
                  key={a.id}
                  href={`/article/${a.slug}`}
                  className="flex gap-3 py-4 border-b border-line group"
                >

                  {/* XƏBƏR ŞƏKLİ */}

                  <div className="w-24 h-16 flex-none bg-ink2 overflow-hidden rounded-sm">

                    {a.image_url ? (

                      <img
                        src={a.image_url}
                        alt={a.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                    ) : (

                      <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400">
                        PANORAMA
                      </div>

                    )}

                  </div>

                  {/* XƏBƏR MƏLUMATI */}

                  <div className="min-w-0">

                    {/* KATEQORİYA */}

                    <div
                      className="font-mono text-[10px] font-semibold uppercase tracking-wider mb-1"
                      style={{
                        color: categoryColor(
                          a.category
                        ),
                      }}
                    >
                      {a.is_breaking &&
                        '🚨 '}

                      {categoryName(
                        a.category
                      )}
                    </div>

                    {/* BAŞLIQ */}

                    <h3 className="font-serif text-[15px] font-semibold leading-snug line-clamp-3 group-hover:text-blue transition-colors">
                      {a.title}
                    </h3>

                  </div>

                </Link>

              ))}

          </div>

        </section>
      )}

      {/* =====================================================
          GÜNDƏM + SAĞ TƏRƏF
      ===================================================== */}

      <section className="grid md:grid-cols-[2fr_1fr] gap-10">

        {/* =================================================
            GÜNDƏM
        ================================================= */}

        <div>

          <div className="flex items-center justify-between mb-5">

            <h2 className="font-serif text-xl font-semibold">
              Gündəm
            </h2>

            <span className="text-xs text-gray-400">
              Son xəbərlər
            </span>

          </div>

          {restLatest.length === 0 ? (

            <p className="text-gray-500 text-sm">
              Hələ xəbər əlavə edilməyib.
              Admin paneldən əlavə edə bilərsən.
            </p>

          ) : (

            <div className="grid sm:grid-cols-2 gap-6">

              {restLatest.map((a) => (

                <ArticleCard
                  key={a.id}
                  article={a}
                />

              ))}

            </div>

          )}

        </div>

        {/* =================================================
            SAĞ TƏRƏF
        ================================================= */}

        <div>

          {/* =================================================
              KİÇİK REKLAM
          ================================================= */}

          {homepageAd ? (

            <div className="mb-5">

              <div className="flex items-center gap-2 mb-2">

                <div className="h-px bg-line flex-1" />

                <span className="text-[9px] uppercase tracking-widest text-gray-400">
                  Reklam
                </span>

                <div className="h-px bg-line flex-1" />

              </div>

              {homepageAd.link_url ? (

                <a
                  href={homepageAd.link_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-line bg-panel hover:border-gray-400 transition-colors"
                >

                  <div className="flex items-center gap-3 p-3">

                    {/* REKLAM ŞƏKLİ */}

                    {homepageAd.image_url && (

                      <div className="w-20 h-14 flex-none overflow-hidden bg-ink2 rounded-sm">

                        <img
                          src={
                            homepageAd.image_url
                          }
                          alt={
                            homepageAd.title ||
                            'Reklam'
                          }
                          className="w-full h-full object-cover"
                        />

                      </div>

                    )}

                    {/* REKLAM YAZISI */}

                    <div className="min-w-0">

                      <div className="text-[8px] uppercase tracking-wider text-gray-400 mb-1">
                        Sponsorlu
                      </div>

                      <h3 className="text-xs font-semibold leading-snug line-clamp-2">
                        {homepageAd.title}
                      </h3>

                      {homepageAd.advertiser_name && (
                        <p className="text-[10px] text-gray-400 mt-1 truncate">
                          {
                            homepageAd.advertiser_name
                          }
                        </p>
                      )}

                    </div>

                  </div>

                </a>

              ) : (

                <div className="border border-line bg-panel">

                  <div className="flex items-center gap-3 p-3">

                    {homepageAd.image_url && (

                      <div className="w-20 h-14 flex-none overflow-hidden bg-ink2 rounded-sm">

                        <img
                          src={
                            homepageAd.image_url
                          }
                          alt={
                            homepageAd.title ||
                            'Reklam'
                          }
                          className="w-full h-full object-cover"
                        />

                      </div>

                    )}

                    <div className="min-w-0">

                      <div className="text-[8px] uppercase tracking-wider text-gray-400 mb-1">
                        Sponsorlu
                      </div>

                      <h3 className="text-xs font-semibold leading-snug line-clamp-2">
                        {homepageAd.title}
                      </h3>

                      {homepageAd.advertiser_name && (
                        <p className="text-[10px] text-gray-400 mt-1 truncate">
                          {
                            homepageAd.advertiser_name
                          }
                        </p>
                      )}

                    </div>

                  </div>

                </div>

              )}

            </div>

          ) : (

            /* =============================================
               REKLAM YOXDURSA WHATSAPP
            ============================================= */

            <div className="border border-line bg-panel p-3 mb-5">

              <div className="flex items-center justify-between gap-3">

                <div className="min-w-0">

                  <div className="text-[8px] uppercase tracking-widest text-gray-400 mb-1">
                    Reklam
                  </div>

                  <p className="text-xs font-semibold leading-snug">
                    Saytımızda reklam yerləşdirin
                  </p>

                </div>

                <a
                  href="https://wa.me/994553737900?text=Salam%2C%20saytınızda%20reklam%20yerləşdirmək%20istəyirəm."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-none text-[10px] font-semibold text-blue hover:underline"
                >
                  WhatsApp →
                </a>

              </div>

            </div>

          )}

          {/* =================================================
              ƏN ÇOX OXUNANLAR
          ================================================= */}

          <div className="bg-panel p-5">

            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
              Ən çox oxunanlar
            </h4>

            {mostRead.map((a, i) => (

              <Link
                key={a.id}
                href={`/article/${a.slug}`}
                className="flex gap-3 items-baseline py-3 border-b border-line last:border-none group"
              >

                {/* NÖMRƏ */}

                <span className="font-serif font-bold text-lg text-blue flex-none w-5">
                  {i + 1}
                </span>

                {/* BAŞLIQ */}

                <div>

                  <h5 className="text-[13.5px] font-semibold leading-snug group-hover:text-blue transition-colors">
                    {a.title}
                  </h5>

                  <span className="text-[10px] text-gray-400">
                    {a.views || 0} baxış
                  </span>

                </div>

              </Link>

            ))}

            {mostRead.length === 0 && (

              <p className="text-xs text-gray-400">
                Hələ baxış statistikası yoxdur.
              </p>

            )}

          </div>

          {/* =================================================
              KATEQORİYALAR
          ================================================= */}

          <div className="border-t border-line mt-6 pt-5">

            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
              Kateqoriyalar
            </h4>

            <div className="flex flex-wrap gap-2">

              <Link
                href="/"
                className="text-xs border border-line px-3 py-2 hover:bg-panel transition-colors"
              >
                Bütün xəbərlər
              </Link>

              <Link
                href="/category/siyaset"
                className="text-xs border border-line px-3 py-2 hover:bg-panel transition-colors"
              >
                Siyasət
              </Link>

              <Link
                href="/category/iqtisadiyyat"
                className="text-xs border border-line px-3 py-2 hover:bg-panel transition-colors"
              >
                İqtisadiyyat
              </Link>

              <Link
                href="/category/cemiyyet"
                className="text-xs border border-line px-3 py-2 hover:bg-panel transition-colors"
              >
                Cəmiyyət
              </Link>

              <Link
                href="/category/dunya"
                className="text-xs border border-line px-3 py-2 hover:bg-panel transition-colors"
              >
                Dünya
              </Link>

              <Link
                href="/category/idman"
                className="text-xs border border-line px-3 py-2 hover:bg-panel transition-colors"
              >
                İdman
              </Link>

              <Link
                href="/category/magazin"
                className="text-xs border border-line px-3 py-2 hover:bg-panel transition-colors"
              >
                Maqazin
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          AŞAĞI MƏLUMAT BÖLMƏSİ
      ===================================================== */}

      <section className="border-t border-line mt-12 pt-8">

        <div className="grid sm:grid-cols-2 gap-8">

          {/* SAYT HAQQINDA */}

          <div>

            <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
              PANORAMA XƏBƏR
            </div>

            <h3 className="font-serif text-lg font-semibold">
              Günün xəbərləri
            </h3>

            <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-md">
              Azərbaycandan və dünyadan
              ən son xəbərləri operativ şəkildə
              izləyin.
            </p>

          </div>

          {/* REKLAM */}

          <div>

            <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
              REKLAM
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mb-2">
              Saytımızda reklam yerləşdirmək
              istəyirsiniz?
            </p>

            <a
              href="https://wa.me/994553737900?text=Salam%2C%20saytınızda%20reklam%20yerləşdirmək%20istəyirəm."
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-blue hover:underline"
            >
              WhatsApp ilə əlaqə →
            </a>

          </div>

        </div>

      </section>

    </div>
  );
}