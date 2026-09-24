import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import HeroSlider from '@/components/HeroSlider';
import NewsTicker from '@/components/NewsTicker';
import { categoryName, categoryColor } from '@/lib/categories';

export const revalidate = 0;

/* =========================================================
   MƏLUMATLAR
========================================================= */

async function getData() {
  const { data: articles, error: articlesError } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(80);

  if (articlesError) {
    console.error('Xəbər xətası:', articlesError);
  }

  const { data: featured, error: featuredError } = await supabase
    .from('articles')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (featuredError) {
    console.error('Baş xəbər xətası:', featuredError);
  }

  const { data: mostRead, error: mostReadError } = await supabase
    .from('articles')
    .select(
      'id, title, slug, views, image_url, category, created_at'
    )
    .order('views', { ascending: false })
    .limit(6);

  if (mostReadError) {
    console.error('Ən çox oxunan xətası:', mostReadError);
  }

  const { data: breakingNews, error: breakingError } = await supabase
    .from('articles')
    .select('*')
    .eq('is_breaking', true)
    .order('created_at', { ascending: false })
    .limit(8);

  if (breakingError) {
    console.error('Son dəqiqə xətası:', breakingError);
  }

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

  const activeAdvertisements = (advertisements || []).filter((ad) => {
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
  });

  return {
    articles: articles || [],
    featured: featured || [],
    mostRead: mostRead || [],
    breakingNews: breakingNews || [],
    advertisements: activeAdvertisements,
  };
}

/* =========================================================
   ANA SƏHİFƏ
========================================================= */

export default async function HomePage() {
  const {
    articles,
    featured,
    mostRead,
    breakingNews,
    advertisements,
  } = await getData();

  /* =======================================================
     BAŞ XƏBƏRLƏR
  ======================================================= */

  const featuredArticles =
    featured.length > 0
      ? featured
      : articles.slice(0, 6);

  const featuredIds = new Set(
    featuredArticles.map((article) => article.id)
  );

  const remaining = articles.filter(
    (article) => !featuredIds.has(article.id)
  );

  /* =======================================================
     REKLAM
  ======================================================= */

  const homepageAd =
    advertisements?.[0] || null;

  /* =======================================================
     GÜNÜN SEÇİMİ
  ======================================================= */

  const sideNews = remaining.slice(0, 5);

  /* =======================================================
     GÜNDƏM
  ======================================================= */

  const gündəmNews = remaining
    .filter(
      (article) =>
        !article.video_url &&
        !featuredIds.has(article.id)
    )
    .slice(0, 10);

  /* =======================================================
     DİGƏR XƏBƏRLƏR
  ======================================================= */

  const lowerNews = remaining
    .filter(
      (article) =>
        !article.video_url &&
        !featuredIds.has(article.id)
    )
    .slice(10, 18);

  /* =======================================================
     VİDEO
  ======================================================= */

  const videoNews = articles
    .filter(
      (article) =>
        article.video_url &&
        article.video_url.trim() !== ''
    )
    .slice(0, 6);

  /* =======================================================
     KATEQORİYA XƏBƏRLƏRİ
  ======================================================= */

  const getCategoryNews = (category, limit = 4) =>
    articles
      .filter(
        (article) =>
          article.category === category &&
          !featuredIds.has(article.id) &&
          !article.video_url
      )
      .slice(0, limit);

  const politics = getCategoryNews('siyaset', 4);

  const economy = getCategoryNews(
    'iqtisadiyyat',
    4
  );

  const society = getCategoryNews(
    'cemiyyet',
    4
  );

  const world = getCategoryNews(
    'dunya',
    4
  );

  const sport = getCategoryNews(
    'idman',
    4
  );

  const culture = getCategoryNews(
    'medeniyyet',
    4
  );

  const technology = getCategoryNews(
    'texnologiya',
    4
  );

  return (
    <main className="bg-white">

      {/* =====================================================
          SON DƏQİQƏ
      ===================================================== */}

      <NewsTicker
        articles={breakingNews}
      />

      {/* =====================================================
          BAŞ XƏBƏR + GÜNÜN SEÇİMİ
      ===================================================== */}

      {featuredArticles.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pt-5 sm:pt-6">

          <div className="grid lg:grid-cols-[1.8fr_1fr] gap-5 lg:gap-6">

            {/* BAŞ XƏBƏR */}

            <HeroSlider
              articles={featuredArticles}
            />

            {/* GÜNÜN SEÇİMİ */}

            <aside className="border border-gray-200 bg-white">

              <div className="px-5 py-5 border-b border-gray-200">

                <div className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-1">
                  PANORAMA XƏBƏR
                </div>

                <div className="flex items-center justify-between gap-3">

                  <h2 className="text-xl font-bold text-[#172b4d]">
                    Günün seçimi
                  </h2>

                  <span className="text-[9px] font-bold text-gray-400">
                    01—05
                  </span>

                </div>

              </div>

              <div>
                {sideNews.map((article, index) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    className="group flex gap-3 p-3.5 sm:p-4 border-b border-gray-200 last:border-0"
                  >

                    <div className="relative w-[100px] h-[68px] sm:w-[108px] sm:h-[74px] flex-none overflow-hidden bg-gray-100">

                      {article.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] text-gray-400">
                          PANORAMA
                        </div>
                      )}

                      <span className="absolute top-1 left-1 bg-[#172b4d] text-white text-[9px] font-bold px-1.5 py-0.5">
                        {String(index + 1).padStart(2, '0')}
                      </span>

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

                      <h3 className="text-[13px] font-semibold leading-snug line-clamp-3 group-hover:text-[#1D4E89] transition-colors">
                        {article.title}
                      </h3>

                    </div>

                  </Link>
                ))}
              </div>

            </aside>

          </div>

        </section>
      )}

      {/* =====================================================
          REKLAM
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 py-5">

        {homepageAd ? (
          <a
            href={homepageAd.link_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-gray-200 bg-gray-50 overflow-hidden"
          >

            {homepageAd.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={homepageAd.image_url}
                alt={
                  homepageAd.title ||
                  'PANORAMA XƏBƏR reklam'
                }
                className="w-full max-h-[145px] object-cover"
              />
            ) : (
              <div className="h-[90px] flex items-center justify-center text-xs text-gray-400">
                {homepageAd.title ||
                  'Reklam'}
              </div>
            )}

          </a>
        ) : (
          <div className="relative h-[82px] border border-dashed border-gray-300 bg-[#f8fafc] flex items-center justify-center overflow-hidden">

            <div className="absolute inset-0 opacity-[0.025] text-[80px] font-black text-[#172b4d] flex items-center justify-center">
              PANORAMA
            </div>

            <div className="relative text-center">

              <div className="text-[9px] uppercase tracking-[0.25em] text-gray-400 mb-1">
                Reklam
              </div>

              <div className="text-sm font-semibold text-[#172b4d]">
                Sizin reklamınız burada
              </div>

            </div>

          </div>
        )}

      </section>

      {/* =====================================================
          GÜNDƏM + ƏN ÇOX OXUNAN
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 py-7">

        <div className="grid lg:grid-cols-[2fr_0.9fr] gap-8">

          {/* GÜNDƏM */}

          <div>

            <SectionTitle
              title="Gündəm"
              href="/"
              subtitle="Günün əsas xəbərləri"
            />

            {gündəmNews.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-8">

                {gündəmNews.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                  />
                ))}

              </div>
            ) : (
              <EmptyNews />
            )}

          </div>

          {/* ƏN ÇOX OXUNAN */}

          <aside>

            <div className="border border-gray-200 bg-white">

              <div className="bg-[#172b4d] text-white px-5 py-4">

                <div className="text-[9px] uppercase tracking-[0.2em] text-white/50 mb-1">
                  Oxucuların seçimi
                </div>

                <h2 className="font-bold text-lg">
                  Ən çox oxunanlar
                </h2>

              </div>

              {mostRead.length > 0 ? (
                mostRead.map((article, index) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    className="group flex gap-3 p-4 border-b border-gray-200 last:border-none"
                  >

                    <span className="text-2xl font-bold text-gray-300 w-8 flex-none">
                      {String(index + 1).padStart(
                        2,
                        '0'
                      )}
                    </span>

                    <div className="min-w-0">

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

                      <h3 className="text-[13px] font-semibold leading-snug group-hover:text-[#1D4E89] transition-colors">
                        {article.title}
                      </h3>

                      <div className="text-[10px] text-gray-400 mt-2">
                        {article.views || 0} baxış
                      </div>

                    </div>

                  </Link>
                ))
              ) : (
                <EmptyNews />
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
          eyebrow="GÜNDƏMİN SİYASİ XƏBƏRLƏRİ"
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
          eyebrow="İQTİSADİ GÜNDƏM"
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
          eyebrow="CƏMİYYƏT XƏBƏRLƏRİ"
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
          eyebrow="DÜNYA GÜNDƏMİ"
        />
      )}

      {/* =====================================================
          İDMAN
      ===================================================== */}

      {sport.length > 0 && (
        <CategorySection
          title="İdman"
          slug="idman"
          articles={sport}
          eyebrow="İDMAN XƏBƏRLƏRİ"
        />
      )}

      {/* =====================================================
          MƏDƏNİYYƏT
      ===================================================== */}

      {culture.length > 0 && (
        <CategorySection
          title="Mədəniyyət"
          slug="medeniyyet"
          articles={culture}
          eyebrow="MƏDƏNİYYƏT XƏBƏRLƏRİ"
        />
      )}

      {/* =====================================================
          TEXNOLOGİYA
      ===================================================== */}

      {technology.length > 0 && (
        <CategorySection
          title="Texnologiya"
          slug="texnologiya"
          articles={technology}
          eyebrow="TEXNOLOGİYA XƏBƏRLƏRİ"
        />
      )}

      {/* =====================================================
          DİGƏR XƏBƏRLƏR
      ===================================================== */}

      {lowerNews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-9">

          <SectionTitle
            title="Digər xəbərlər"
            subtitle="Son yeniliklər"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {lowerNews.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
              />
            ))}

          </div>

        </section>
      )}

      {/* =====================================================
          VİDEO XƏBƏRLƏR
      ===================================================== */}

      {videoNews.length > 0 && (
        <VideoSection
          articles={videoNews}
        />
      )}

      {/* =====================================================
          FOTO / VİDEO
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 py-9">

        <div className="grid md:grid-cols-2 gap-5">

          {/* FOTO */}

          <Link
            href="/foto"
            className="group relative overflow-hidden bg-[#172b4d] min-h-[210px] p-7"
          >

            <div className="absolute right-5 bottom-[-30px] text-[130px] font-black text-white/5">
              FOTO
            </div>

            <div className="relative">

              <div className="text-[10px] uppercase tracking-[0.2em] text-white/45 mb-3">
                PANORAMA
              </div>

              <h2 className="text-2xl font-bold text-white">
                Foto xəbərlər
              </h2>

              <p className="text-sm text-white/60 mt-2 max-w-sm">
                Azərbaycandan və dünyadan
                ən maraqlı görüntülər.
              </p>

              <span className="inline-block mt-6 text-xs font-bold text-white">
                Fotolara bax →
              </span>

            </div>

          </Link>

          {/* VİDEO */}

          <Link
            href="/video"
            className="group relative overflow-hidden bg-[#f1f5f9] min-h-[210px] p-7"
          >

            <div className="absolute right-5 bottom-[-30px] text-[130px] font-black text-gray-200">
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

              <span className="inline-block mt-6 text-xs font-bold text-[#172b4d]">
                Videolara bax →
              </span>

            </div>

          </Link>

        </div>

      </section>

      {/* =====================================================
          TELEGRAM + REKLAM
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-4 pb-10">

        <div className="border border-gray-200 bg-[#f7f8fa] p-6 md:p-8">

          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">

            <div>

              <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
                PANORAMA XƏBƏR
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-[#172b4d]">
                Xəbərləri Telegram-da izləyin
              </h3>

              <p className="text-sm text-gray-500 mt-2 max-w-xl">
                Ən son xəbərlər, gündəm və vacib
                yenilikləri birbaşa Telegram kanalımızdan
                izləyin.
              </p>

            </div>

            <div className="flex flex-col sm:flex-row gap-3">

              <a
                href="https://t.me/panoramaxeberinfoaz"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#229ED9] text-white px-6 py-3 text-sm font-semibold text-center hover:bg-[#1688c1] transition-colors"
              >
                Telegram kanalına qoşul →
              </a>

              <a
                href="https://wa.me/994553737900?text=Salam%2C%20saytınızda%20reklam%20yerləşdirmək%20istəyirəm"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#172b4d] text-white px-6 py-3 text-sm font-semibold text-center hover:bg-[#1D4E89] transition-colors"
              >
                Reklam üçün əlaqə →
              </a>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

/* =========================================================
   VİDEO BÖLMƏSİ
========================================================= */

function VideoSection({ articles }) {
  return (
    <section className="bg-[#f7f8fa] border-y border-gray-200">

      <div className="max-w-7xl mx-auto px-4 py-9">

        <div className="flex items-center gap-4 mb-6">

          <div>

            <div className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-1">
              PANORAMA
            </div>

            <h2 className="text-2xl font-bold text-[#172b4d]">
              Video xəbərlər
            </h2>

          </div>

          <div className="h-[2px] flex-1 bg-[#172b4d]" />

          <Link
            href="/video"
            className="text-xs font-semibold text-[#1D4E89] whitespace-nowrap hover:text-[#172b4d] transition-colors"
          >
            Hamısı →
          </Link>

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {articles.map((article) => (

            <div
              key={article.id}
              className="bg-white border border-gray-200 overflow-hidden group"
            >

              <div className="relative bg-black aspect-video">

                <video
                  src={article.video_url}
                  controls
                  preload="metadata"
                  playsInline
                  className="w-full h-full object-cover"
                />

                <div className="absolute top-3 left-3 pointer-events-none">

                  <span className="bg-red-600 text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                    ▶ Video
                  </span>

                </div>

              </div>

              <div className="p-4">

                <div className="flex items-center justify-between gap-3 mb-2">

                  <span
                    className="text-[10px] font-bold uppercase tracking-widest"
                    style={{
                      color: categoryColor(
                        article.category
                      ),
                    }}
                  >
                    {categoryName(
                      article.category
                    )}
                  </span>

                  {article.created_at && (
                    <span className="text-[10px] text-gray-400">
                      {new Date(
                        article.created_at
                      ).toLocaleDateString(
                        'az-AZ'
                      )}
                    </span>
                  )}

                </div>

                <Link
                  href={`/article/${article.slug}`}
                >

                  <h3 className="text-[17px] font-bold leading-[1.3] text-[#111827] line-clamp-3 hover:text-[#2563eb] transition-colors">
                    {article.title}
                  </h3>

                </Link>

                {article.excerpt && (
                  <p className="mt-2 text-[13px] leading-relaxed text-gray-500 line-clamp-2">
                    {article.excerpt}
                  </p>
                )}

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">

                  <span className="text-[10px] text-gray-400">
                    {article.source ||
                      'PANORAMA Xəbər'}
                  </span>

                  <Link
                    href={`/article/${article.slug}`}
                    className="text-[10px] font-bold uppercase tracking-wider text-[#172b4d] hover:text-[#2563eb]"
                  >
                    Xəbəri oxu →
                  </Link>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}

/* =========================================================
   BÖLMƏ BAŞLIĞI
========================================================= */

function SectionTitle({
  title,
  href,
  subtitle,
}) {
  return (
    <div className="flex items-end gap-4 mb-6">

      <div className="min-w-0">

        <div className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-1">
          {subtitle || 'PANORAMA XƏBƏR'}
        </div>

        <h2 className="text-2xl font-bold text-[#172b4d]">
          {title}
        </h2>

      </div>

      <div className="h-[2px] flex-1 bg-[#172b4d] mb-2" />

      {href && (
        <Link
          href={href}
          className="text-xs font-semibold text-[#1D4E89] whitespace-nowrap hover:text-[#172b4d] transition-colors mb-1"
        >
          Hamısı →
        </Link>
      )}

    </div>
  );
}

/* =========================================================
   KATEQORİYA BÖLMƏSİ
========================================================= */

function CategorySection({
  title,
  slug,
  articles,
  eyebrow,
}) {
  return (
    <section className="bg-[#f7f8fa] border-y border-gray-200">

      <div className="max-w-7xl mx-auto px-4 py-9">

        <div className="flex items-end gap-4 mb-6">

          <div className="min-w-0">

            <div className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-1">
              {eyebrow || 'PANORAMA'}
            </div>

            <h2 className="text-2xl font-bold text-[#172b4d]">
              {title}
            </h2>

          </div>

          <div className="h-[2px] flex-1 bg-[#172b4d] mb-2" />

          <Link
            href={`/${slug}`}
            className="text-xs font-semibold text-[#1D4E89] whitespace-nowrap hover:text-[#172b4d] transition-colors mb-1"
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

/* =========================================================
   BOŞ XƏBƏR
========================================================= */

function EmptyNews() {
  return (
    <div className="border border-dashed border-gray-200 bg-gray-50 px-5 py-10 text-center">
      <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400">
        PANORAMA XƏBƏR
      </div>

      <p className="text-sm text-gray-400 mt-2">
        Hələ bu bölmədə xəbər əlavə edilməyib.
      </p>
    </div>
  );
}
