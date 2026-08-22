import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import { categoryName, categoryColor } from '@/lib/categories';

export const revalidate = 0;

async function getData() {
  const { data: featured } = await supabase
    .from('articles')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(1);

  const { data: latest } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30);

  const { data: mostRead } = await supabase
    .from('articles')
    .select('id, title, slug, views, image_url, category')
    .order('views', { ascending: false })
    .limit(8);

  const { data: advertisements, error: adsError } = await supabase
    .from('advertisements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (adsError) {
    console.error('Reklam xətası:', adsError);
  }

  const now = new Date();

  const activeAdvertisements = (advertisements || []).filter((ad) => {
    const startOk =
      !ad.start_date || new Date(ad.start_date) <= now;

    const endOk =
      !ad.end_date || new Date(ad.end_date) >= now;

    const positionOk =
      ad.position === 'homepage' ||
      ad.position === 'both';

    return startOk && endOk && positionOk;
  });

  return {
    featured: featured?.[0] || latest?.[0] || null,
    latest: latest || [],
    mostRead: mostRead || [],
    advertisements: activeAdvertisements,
  };
}

export default async function HomePage() {
  const {
    featured,
    latest,
    mostRead,
    advertisements,
  } = await getData();

  const restLatest = latest.filter(
    (article) => article.id !== featured?.id
  );

  const homepageAd = advertisements?.[0] || null;

  const secondNews = restLatest.slice(0, 4);
  const latestNews = restLatest.slice(4, 12);
  const moreNews = restLatest.slice(12, 20);

  return (
    <main className="bg-white">

      {/* =====================================================
          XƏBƏRLƏR AXINI
      ===================================================== */}

      <div className="border-y border-gray-200 bg-[#f7f7f7]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center h-10 overflow-hidden">

            <div className="bg-[#172b4d] text-white text-[11px] font-bold uppercase px-4 h-10 flex items-center flex-none">
              SON XƏBƏRLƏR
            </div>

            <div className="flex items-center gap-8 px-5 whitespace-nowrap overflow-hidden">

              {latest.slice(0, 8).map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="text-[12px] text-gray-700 hover:text-blue-700 transition"
                >
                  {article.title}
                </Link>
              ))}

            </div>
          </div>
        </div>
      </div>


      {/* =====================================================
          ƏSAS XƏBƏRLƏR
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 pt-6">

        <div className="grid lg:grid-cols-[2fr_1fr_0.85fr] gap-5">

          {/* BAŞ XƏBƏR */}

          {featured && (
            <Link
              href={`/article/${featured.slug}`}
              className="group relative block overflow-hidden bg-black h-[390px]"
            >

              {featured.image_url ? (
                <img
                  src={featured.image_url}
                  alt={featured.title}
                  className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-300" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6">

                <div
                  className="text-[11px] uppercase font-bold tracking-wide mb-2"
                  style={{
                    color: categoryColor(featured.category),
                  }}
                >
                  {categoryName(featured.category)}
                </div>

                <h1 className="text-white text-2xl md:text-3xl font-bold leading-tight">
                  {featured.title}
                </h1>

                {featured.excerpt && (
                  <p className="text-white/80 text-sm mt-3 line-clamp-2">
                    {featured.excerpt}
                  </p>
                )}

              </div>

            </Link>
          )}


          {/* YAN XƏBƏRLƏR */}

          <div className="border border-gray-200 bg-white">

            <div className="bg-[#172b4d] text-white px-4 py-3 font-bold text-sm">
              GÜNÜN XƏBƏRLƏRİ
            </div>

            {secondNews.map((article, index) => (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                className="flex gap-3 p-3 border-b border-gray-200 last:border-none group"
              >

                <div className="w-[100px] h-[68px] flex-none overflow-hidden bg-gray-100">

                  {article.image_url ? (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400">
                      PANORAMA
                    </div>
                  )}

                </div>

                <div className="min-w-0">

                  <div
                    className="text-[9px] uppercase font-bold mb-1"
                    style={{
                      color: categoryColor(article.category),
                    }}
                  >
                    {categoryName(article.category)}
                  </div>

                  <h3 className="text-[13px] font-bold leading-snug line-clamp-3 group-hover:text-blue-700">
                    {article.title}
                  </h3>

                </div>

              </Link>
            ))}

          </div>


          {/* SON XƏBƏRLƏR */}

          <div className="border border-gray-200 bg-white">

            <div className="bg-[#172b4d] text-white px-4 py-3 font-bold text-sm">
              SON XƏBƏRLƏR
            </div>

            <div className="divide-y divide-gray-200">

              {latest.slice(0, 9).map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="block px-4 py-3 group"
                >

                  <div className="text-[10px] text-gray-400 mb-1">
                    {article.created_at
                      ? new Date(article.created_at).toLocaleTimeString(
                          'az-AZ',
                          {
                            hour: '2-digit',
                            minute: '2-digit',
                          }
                        )
                      : ''}
                  </div>

                  <div className="text-[13px] font-semibold leading-snug group-hover:text-blue-700">
                    {article.title}
                  </div>

                </Link>
              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          REKLAM BANNER
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 py-5">

        {homepageAd ? (
          <a
            href={homepageAd.link_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gray-100 border border-gray-200 overflow-hidden"
          >

            {homepageAd.image_url ? (
              <img
                src={homepageAd.image_url}
                alt={homepageAd.title || 'Reklam'}
                className="w-full max-h-[170px] object-cover"
              />
            ) : (
              <div className="h-[100px] flex items-center justify-center text-gray-500">
                {homepageAd.title || 'Reklam'}
              </div>
            )}

          </a>
        ) : (
          <div className="border border-dashed border-gray-300 bg-gray-50 h-[100px] flex items-center justify-center text-gray-400 text-sm">
            REKLAM YERİ
          </div>
        )}

      </section>


      {/* =====================================================
          GÜNDƏM
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 py-6">

        <div className="flex items-center gap-4 mb-5">

          <h2 className="text-2xl font-bold text-[#172b4d]">
            Gündəm
          </h2>

          <div className="h-[2px] bg-[#172b4d] flex-1" />

          <Link
            href="/"
            className="text-xs font-semibold text-blue-700"
          >
            Bütün xəbərlər →
          </Link>

        </div>


        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">

          {/* XƏBƏRLƏR */}

          <div className="grid sm:grid-cols-2 gap-5">

            {latestNews.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
              />
            ))}

          </div>


          {/* ƏN ÇOX OXUNANLAR */}

          <aside>

            <div className="border border-gray-200">

              <div className="bg-[#172b4d] text-white px-4 py-3 font-bold">
                ƏN ÇOX OXUNANLAR
              </div>

              {mostRead.map((article, index) => (

                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="flex gap-3 p-4 border-b border-gray-200 last:border-none group"
                >

                  <div className="text-2xl font-bold text-gray-300 w-7 flex-none">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div>

                    <div
                      className="text-[9px] uppercase font-bold mb-1"
                      style={{
                        color: categoryColor(article.category),
                      }}
                    >
                      {categoryName(article.category)}
                    </div>

                    <h3 className="text-sm font-semibold leading-snug group-hover:text-blue-700">
                      {article.title}
                    </h3>

                    <div className="text-[10px] text-gray-400 mt-2">
                      {article.views || 0} baxış
                    </div>

                  </div>

                </Link>

              ))}

            </div>

          </aside>

        </div>

      </section>


      {/* =====================================================
          KATEQORİYALAR
      ===================================================== */}

      <section className="bg-[#f5f6f8] border-y border-gray-200">

        <div className="max-w-7xl mx-auto px-4 py-8">

          <div className="flex items-center gap-4 mb-6">

            <h2 className="text-2xl font-bold text-[#172b4d]">
              Kateqoriyalar
            </h2>

            <div className="h-[2px] bg-[#172b4d] flex-1" />

          </div>


          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">

            <Link
              href="/category/siyaset"
              className="bg-white border border-gray-200 p-5 text-center font-bold hover:bg-[#172b4d] hover:text-white transition"
            >
              Siyasət
            </Link>

            <Link
              href="/category/iqtisadiyyat"
              className="bg-white border border-gray-200 p-5 text-center font-bold hover:bg-[#172b4d] hover:text-white transition"
            >
              İqtisadiyyat
            </Link>

            <Link
              href="/category/cemiyyet"
              className="bg-white border border-gray-200 p-5 text-center font-bold hover:bg-[#172b4d] hover:text-white transition"
            >
              Cəmiyyət
            </Link>

            <Link
              href="/category/dunya"
              className="bg-white border border-gray-200 p-5 text-center font-bold hover:bg-[#172b4d] hover:text-white transition"
            >
              Dünya
            </Link>

            <Link
              href="/category/idman"
              className="bg-white border border-gray-200 p-5 text-center font-bold hover:bg-[#172b4d] hover:text-white transition"
            >
              İdman
            </Link>

            <Link
              href="/category/magazin"
              className="bg-white border border-gray-200 p-5 text-center font-bold hover:bg-[#172b4d] hover:text-white transition"
            >
              Maqazin
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          DAHA ÇOX XƏBƏR
      ===================================================== */}

      {moreNews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">

          <div className="flex items-center gap-4 mb-5">

            <h2 className="text-2xl font-bold text-[#172b4d]">
              Digər xəbərlər
            </h2>

            <div className="h-[2px] bg-[#172b4d] flex-1" />

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {moreNews.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
              />
            ))}

          </div>

        </section>
      )}


      {/* =====================================================
          FOTO / VİDEO
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 py-8">

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-[#172b4d] text-white p-6 min-h-[180px]">

            <div className="text-xs uppercase tracking-widest text-white/60 mb-3">
              FOTO
            </div>

            <h2 className="text-2xl font-bold mb-3">
              Günün fotoları
            </h2>

            <p className="text-sm text-white/70">
              Azərbaycandan və dünyadan ən maraqlı görüntülər.
            </p>

          </div>


          <div className="bg-gray-100 border border-gray-200 p-6 min-h-[180px]">

            <div className="text-xs uppercase tracking-widest text-gray-400 mb-3">
              VİDEO
            </div>

            <h2 className="text-2xl font-bold text-[#172b4d] mb-3">
              Son videolar
            </h2>

            <p className="text-sm text-gray-500">
              Ən son video xəbərləri izləyin.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          REKLAM / ƏLAQƏ
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 pb-10">

        <div className="bg-[#f5f6f8] border border-gray-200 p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">

          <div>

            <div className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">
              REKLAM
            </div>

            <h3 className="text-xl font-bold text-[#172b4d]">
              Saytımızda reklam yerləşdirin
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Reklam və əməkdaşlıq üçün bizimlə əlaqə saxlayın.
            </p>

          </div>

          <a
            href="https://wa.me/994553737900?text=Salam%2C%20saytınızda%20reklam%20yerləşdirmək%20istəyirəm"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#172b4d] text-white px-6 py-3 text-sm font-semibold hover:bg-blue-800 transition text-center"
          >
            WhatsApp ilə əlaqə →
          </a>

        </div>

      </section>

    </main>
  );
}