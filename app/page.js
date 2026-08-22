import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import { categoryName, categoryColor } from '@/lib/categories';

export const revalidate = 0;

async function getData() {
  // =====================================================
  // BÜTÜN XƏBƏRLƏR
  // =====================================================

  const { data: articles, error: articlesError } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(40);

  if (articlesError) {
    console.error('Xəbər xətası:', articlesError);
  }

  // =====================================================
  // BAŞ XƏBƏR
  // =====================================================

  const { data: featured } = await supabase
    .from('articles')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(1);

  // =====================================================
  // ƏN ÇOX OXUNANLAR
  // =====================================================

  const { data: mostRead } = await supabase
    .from('articles')
    .select(
      'id, title, slug, views, image_url, category, created_at'
    )
    .order('views', { ascending: false })
    .limit(6);

  // =====================================================
  // REKLAMLAR
  // =====================================================

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

      return startOk && endOk && positionOk;
    }
  );

  return {
    articles: articles || [],
    featured:
      featured?.[0] ||
      articles?.[0] ||
      null,
    mostRead: mostRead || [],
    advertisements: activeAdvertisements,
  };
}

export default async function HomePage() {
  const {
    articles,
    featured,
    mostRead,
    advertisements,
  } = await getData();

  // Baş xəbəri digər siyahılardan çıxarırıq
  const remaining = articles.filter(
    (article) => article.id !== featured?.id
  );

  // İlk reklam
  const homepageAd =
    advertisements?.[0] || null;

  // =====================================================
  // XƏBƏR BLOKLARI
  // =====================================================

  const sideNews = remaining.slice(0, 4);

  const gündemNews = remaining.slice(4, 12);

  const lowerNews = remaining.slice(12, 20);

  // Kateqoriyalar üçün xəbərlər
  const politics = articles
    .filter(
      (a) =>
        a.category === 'siyaset' &&
        a.id !== featured?.id
    )
    .slice(0, 4);

  const economy = articles
    .filter(
      (a) =>
        a.category === 'iqtisadiyyat' &&
        a.id !== featured?.id
    )
    .slice(0, 4);

  const society = articles
    .filter(
      (a) =>
        a.category === 'cemiyyet' &&
        a.id !== featured?.id
    )
    .slice(0, 4);

  const world = articles
    .filter(
      (a) =>
        a.category === 'dunya' &&
        a.id !== featured?.id
    )
    .slice(0, 4);

  return (
    <main className="bg-white">

      {/* =====================================================
          BAŞ XƏBƏR BLOKU
      ===================================================== */}

      {featured && (
        <section className="max-w-7xl mx-auto px-4 pt-6">

          <div className="grid lg:grid-cols-[1.8fr_1fr] gap-6">

            {/* BÖYÜK BAŞ XƏBƏR */}

            <Link
              href={`/article/${featured.slug}`}
              className="group relative block h-[420px] overflow-hidden bg-gray-200"
            >

              {featured.image_url ? (
                <img
                  src={featured.image_url}
                  alt={featured.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">
                  PANORAMA
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">

                <div
                  className="text-xs font-bold uppercase tracking-wider mb-3"
                  style={{
                    color: categoryColor(
                      featured.category
                    ),
                  }}
                >
                  {categoryName(
                    featured.category
                  )}
                </div>

                <h1 className="text-white text-2xl md:text-4xl font-bold leading-tight max-w-3xl">
                  {featured.title}
                </h1>

                {featured.excerpt && (
                  <p className="text-white/80 text-sm md:text-base mt-3 max-w-2xl line-clamp-2">
                    {featured.excerpt}
                  </p>
                )}

                <div className="text-white/60 text-xs mt-4">
                  {featured.source
                    ? `Mənbə: ${featured.source}`
                    : 'PANORAMA XƏBƏR'}
                </div>

              </div>

            </Link>


            {/* SAĞDA 4 XƏBƏR */}

            <div className="border border-gray-200">

              <div className="px-5 py-4 border-b-2 border-[#172b4d]">

                <h2 className="text-lg font-bold text-[#172b4d]">
                  Günün seçimi
                </h2>

              </div>

              {sideNews.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="flex gap-3 p-4 border-b border-gray-200 last:border-none group"
                >

                  <div className="w-[105px] h-[72px] flex-none overflow-hidden bg-gray-100">

                    {article.image_url ? (
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400">
                        PANORAMA
                      </div>
                    )}

                  </div>

                  <div className="min-w-0">

                    <div
                      className="text-[9px] font-bold uppercase mb-1"
                      style={{
                        color: categoryColor(
                          article.category
                        ),
                      }}
                    >
                      {categoryName(
                        article.category
                      )}
                    </div>

                    <h3 className="text-[13px] font-semibold leading-snug line-clamp-3 group-hover:text-blue-700 transition-colors">
                      {article.title}
                    </h3>

                  </div>

                </Link>
              ))}

            </div>

          </div>

        </section>
      )}


      {/* =====================================================
          REKLAM
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 py-6">

        {homepageAd ? (
          <a
            href={homepageAd.link_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-gray-200 bg-gray-50 overflow-hidden"
          >

            {homepageAd.image_url ? (
              <img
                src={homepageAd.image_url}
                alt={
                  homepageAd.title ||
                  'Reklam'
                }
                className="w-full max-h-[160px] object-cover"
              />
            ) : (
              <div className="h-[90px] flex items-center justify-center text-sm text-gray-400">
                {homepageAd.title ||
                  'Reklam'}
              </div>
            )}

          </a>
        ) : (
          <div className="h-[90px] border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-xs text-gray-400 uppercase tracking-widest">
            Reklam
          </div>
        )}

      </section>


      {/* =====================================================
          GÜNDƏM + ƏN ÇOX OXUNANLAR
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 py-6">

        <div className="grid lg:grid-cols-[2fr_0.85fr] gap-8">

          {/* GÜNDƏM */}

          <div>

            <div className="flex items-center gap-4 mb-6">

              <h2 className="text-2xl font-bold text-[#172b4d]">
                Gündəm
              </h2>

              <div className="h-[2px] flex-1 bg-[#172b4d]" />

              <Link
                href="/"
                className="text-xs font-semibold text-blue-700 whitespace-nowrap"
              >
                Hamısı →
              </Link>

            </div>


            <div className="grid sm:grid-cols-2 gap-5">

              {gündemNews.map(
                (article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                  />
                )
              )}

            </div>

            {gündemNews.length === 0 && (
              <p className="text-sm text-gray-400">
                Hələ xəbər əlavə edilməyib.
              </p>
            )}

          </div>


          {/* ƏN ÇOX OXUNANLAR */}

          <aside>

            <div className="border border-gray-200">

              <div className="bg-[#172b4d] text-white px-5 py-4">

                <h2 className="font-bold">
                  Ən çox oxunanlar
                </h2>

              </div>

              {mostRead.map(
                (article, index) => (

                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    className="flex gap-3 p-4 border-b border-gray-200 last:border-none group"
                  >

                    <span className="text-2xl font-bold text-gray-300 w-7 flex-none">
                      {String(index + 1).padStart(
                        2,
                        '0'
                      )}
                    </span>

                    <div>

                      <div
                        className="text-[9px] font-bold uppercase mb-1"
                        style={{
                          color:
                            categoryColor(
                              article.category
                            ),
                        }}
                      >
                        {categoryName(
                          article.category
                        )}
                      </div>

                      <h3 className="text-[13px] font-semibold leading-snug group-hover:text-blue-700">
                        {article.title}
                      </h3>

                      <div className="text-[10px] text-gray-400 mt-2">
                        {article.views || 0}{' '}
                        baxış
                      </div>

                    </div>

                  </Link>

                )
              )}

            </div>

          </aside>

        </div>

      </section>


      {/* =====================================================
          SİYASƏT
      ===================================================== */}

      {politics.length > 0 && (
        <CategorySection
          title="Siyasət"
          slug="siyaset"
          articles={politics}
        />
      )}


      {/* =====================================================
          İQTİSADİYYAT
      ===================================================== */}

      {economy.length > 0 && (
        <CategorySection
          title="İqtisadiyyat"
          slug="iqtisadiyyat"
          articles={economy}
        />
      )}


      {/* =====================================================
          CƏMİYYƏT
      ===================================================== */}

      {society.length > 0 && (
        <CategorySection
          title="Cəmiyyət"
          slug="cemiyyet"
          articles={society}
        />
      )}


      {/* =====================================================
          DÜNYA
      ===================================================== */}

      {world.length > 0 && (
        <CategorySection
          title="Dünya"
          slug="dunya"
          articles={world}
        />
      )}


      {/* =====================================================
          DİGƏR XƏBƏRLƏR
      ===================================================== */}

      {lowerNews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">

          <div className="flex items-center gap-4 mb-6">

            <h2 className="text-2xl font-bold text-[#172b4d]">
              Digər xəbərlər
            </h2>

            <div className="h-[2px] flex-1 bg-[#172b4d]" />

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {lowerNews.map(
              (article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                />
              )
            )}

          </div>

        </section>
      )}


      {/* =====================================================
          FOTO / VİDEO
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 py-8">

        <div className="grid md:grid-cols-2 gap-5">

          <div className="relative overflow-hidden bg-[#172b4d] min-h-[190px] p-7">

            <div className="absolute right-5 bottom-[-20px] text-[120px] font-bold text-white/5">
              FOTO
            </div>

            <div className="relative">

              <div className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-3">
                PANORAMA
              </div>

              <h2 className="text-2xl font-bold text-white">
                Foto xəbərlər
              </h2>

              <p className="text-sm text-white/60 mt-2 max-w-sm">
                Azərbaycandan və dünyadan
                ən maraqlı görüntülər.
              </p>

            </div>

          </div>


          <div className="relative overflow-hidden bg-gray-100 min-h-[190px] p-7">

            <div className="absolute right-5 bottom-[-20px] text-[120px] font-bold text-gray-200">
              VIDEO
            </div>

            <div className="relative">

              <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-3">
                PANORAMA
              </div>

              <h2 className="text-2xl font-bold text-[#172b4d]">
                Video xəbərlər
              </h2>

              <p className="text-sm text-gray-500 mt-2 max-w-sm">
                Günün ən vacib video xəbərləri.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          REKLAM ƏLAQƏ BLOKU
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 pb-10">

        <div className="border border-gray-200 bg-[#f7f8fa] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">

          <div>

            <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
              ƏMƏKDAŞLIQ
            </div>

            <h3 className="text-xl font-bold text-[#172b4d]">
              PANORAMA-da reklam yerləşdirin
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Reklam və əməkdaşlıq üçün
              bizimlə əlaqə saxlayın.
            </p>

          </div>

          <a
            href="https://wa.me/994553737900?text=Salam%2C%20saytınızda%20reklam%20yerləşdirmək%20istəyirəm"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#172b4d] text-white px-6 py-3 text-sm font-semibold hover:bg-blue-800 transition"
          >
            Əlaqə saxla →
          </a>

        </div>

      </section>

    </main>
  );
}


/* =========================================================
   KATEQORİYA BÖLMƏSİ
========================================================= */

function CategorySection({
  title,
  slug,
  articles,
}) {
  return (
    <section className="bg-[#f6f7f9] border-y border-gray-200">

      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="flex items-center gap-4 mb-6">

          <h2 className="text-2xl font-bold text-[#172b4d]">
            {title}
          </h2>

          <div className="h-[2px] flex-1 bg-[#172b4d]" />

          <Link
            href={`/category/${slug}`}
            className="text-xs font-semibold text-blue-700 whitespace-nowrap"
          >
            Daha çox →
          </Link>

        </div>


        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
            />
          ))}

        </div>

      </div>

    </section>
  );
}