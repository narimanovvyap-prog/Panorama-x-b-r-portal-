import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import { categoryName, categoryColor } from '@/lib/categories';

export const revalidate = 0;

async function getData() {
  const { data: articles, error: articlesError } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(40);

  if (articlesError) {
    console.error('Xəbər xətası:', articlesError);
  }

  const { data: featured } = await supabase
    .from('articles')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(1);

  const { data: mostRead } = await supabase
    .from('articles')
    .select(
      'id, title, slug, views, image_url, category, created_at'
    )
    .order('views', { ascending: false })
    .limit(6);

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

  const remaining = articles.filter(
    (article) => article.id !== featured?.id
  );

  const homepageAd =
    advertisements?.[0] || null;

  const sideNews = remaining.slice(0, 4);

  const gündemNews = remaining.slice(4, 12);

  const lowerNews = remaining.slice(12, 20);

  const politics = articles
    .filter(
      (article) =>
        article.category === 'siyaset' &&
        article.id !== featured?.id
    )
    .slice(0, 4);

  const economy = articles
    .filter(
      (article) =>
        article.category === 'iqtisadiyyat' &&
        article.id !== featured?.id
    )
    .slice(0, 4);

  const society = articles
    .filter(
      (article) =>
        article.category === 'cemiyyet' &&
        article.id !== featured?.id
    )
    .slice(0, 4);

  const world = articles
    .filter(
      (article) =>
        article.category === 'dunya' &&
        article.id !== featured?.id
    )
    .slice(0, 4);

  return (
    <main className="bg-white">

      {/* ================================
          BAŞ XƏBƏR
      ================================= */}

      {featured && (
        <section className="max-w-7xl mx-auto px-4 pt-6">

          <div className="grid lg:grid-cols-[1.75fr_1fr] gap-6">

            {/* ƏSAS XƏBƏR */}

            <Link
              href={`/article/${featured.slug}`}
              className="group relative block h-[430px] md:h-[500px] overflow-hidden bg-[#172b4d]"
            >

              {featured.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featured.image_url}
                  alt={featured.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#172b4d]">
                  <span className="text-white/30 text-5xl font-bold">
                    PANORAMA
                  </span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/5" />

              <div className="absolute top-5 left-5">
                <span className="bg-white text-[#172b4d] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest">
                  Baş xəbər
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">

                <div
                  className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3"
                  style={{
                    color: categoryColor(
                      featured.category
                    ),
                  }}
                >
                  {categoryName(featured.category)}
                </div>

                <h1 className="text-white text-2xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-4xl">
                  {featured.title}
                </h1>

                {featured.excerpt && (
                  <p className="text-white/75 text-sm md:text-base mt-4 max-w-2xl line-clamp-2">
                    {featured.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-3 text-xs text-white/55 mt-5">

                  <span>
                    {featured.source ||
                      'PANORAMA Xəbər'}
                  </span>

                  <span>•</span>

                  <span>
                    {new Date(
                      featured.created_at
                    ).toLocaleDateString('az-AZ')}
                  </span>

                </div>

              </div>

            </Link>

            {/* GÜNÜN SEÇİMİ */}

            <aside className="border border-gray-200">

              <div className="px-5 py-5 border-b border-gray-200">

                <div className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-1">
                  PANORAMA
                </div>

                <h2 className="text-xl font-bold text-[#172b4d]">
                  Günün seçimi
                </h2>

              </div>

              <div>

                {sideNews.map(
                  (article, index) => (
                    <Link
                      key={article.id}
                      href={`/article/${article.slug}`}
                      className="group flex gap-3 p-4 border-b border-gray-200 last:border-0"
                    >

                      <div className="relative w-[105px] h-[72px] flex-none overflow-hidden bg-gray-100">

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
                          0{index + 1}
                        </span>

                      </div>

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

                        <h3 className="text-[13px] font-semibold leading-snug line-clamp-3 group-hover:text-[#1D4E89] transition-colors">
                          {article.title}
                        </h3>

                      </div>

                    </Link>
                  )
                )}

              </div>

            </aside>

          </div>

        </section>
      )}

      {/* ================================
          REKLAM
      ================================= */}

      <section className="max-w-7xl mx-auto px-4 py-6">

        {homepageAd ? (
          <a
            href={
              homepageAd.link_url || '#'
            }
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
                  'Reklam'
                }
                className="w-full max-h-[150px] object-cover"
              />
            ) : (
              <div className="h-[90px] flex items-center justify-center text-xs text-gray-400">
                {homepageAd.title ||
                  'Reklam'}
              </div>
            )}

          </a>
        ) : (
          <div className="h-[70px] border border-dashed border-gray-300 bg-gray-50 flex items-center justify-center text-[10px] text-gray-400 uppercase tracking-[0.2em]">
            Reklam sahəsi
          </div>
        )}

      </section>

      {/* ================================
          GÜNDƏM
      ================================= */}

      <section className="max-w-7xl mx-auto px-4 py-7">

        <div className="grid lg:grid-cols-[2fr_0.85fr] gap-8">

          <div>

            <SectionTitle
              title="Gündəm"
              href="/"
            />

            <div className="grid sm:grid-cols-2 gap-x-6 gap-y-8">

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

          {/* ƏN ÇOX OXUNAN */}

          <aside>

            <div className="border border-gray-200">

              <div className="bg-[#172b4d] text-white px-5 py-4">

                <div className="text-[9px] uppercase tracking-[0.2em] text-white/50 mb-1">
                  Oxucuların seçimi
                </div>

                <h2 className="font-bold text-lg">
                  Ən çox oxunanlar
                </h2>

              </div>

              {mostRead.map(
                (article, index) => (
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

                      <h3 className="text-[13px] font-semibold leading-snug group-hover:text-[#1D4E89] transition-colors">
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

      {/* ================================
          SİYASƏT
      ================================= */}

      {politics.length > 0 && (
        <CategorySection
          title="Siyasət"
          slug="siyaset"
          articles={politics}
        />
      )}

      {/* ================================
          İQTİSADİYYAT
      ================================= */}

      {economy.length > 0 && (
        <CategorySection
          title="İqtisadiyyat"
          slug="iqtisadiyyat"
          articles={economy}
        />
      )}

      {/* ================================
          CƏMİYYƏT
      ================================= */}

      {society.length > 0 && (
        <CategorySection
          title="Cəmiyyət"
          slug="cemiyyet"
          articles={society}
        />
      )}

      {/* ================================
          DÜNYA
      ================================= */}

      {world.length > 0 && (
        <CategorySection
          title="Dünya"
          slug="dunya"
          articles={world}
        />
      )}

      {/* ================================
          DİGƏR XƏBƏRLƏR
      ================================= */}

      {lowerNews.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">

          <SectionTitle
            title="Digər xəbərlər"
          />

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

      {/* ================================
          FOTO / VİDEO
      ================================= */}

      <section className="max-w-7xl mx-auto px-4 py-8">

        <div className="grid md:grid-cols-2 gap-5">

          <Link
            href="/foto"
            className="group relative overflow-hidden bg-[#172b4d] min-h-[190px] p-7"
          >

            <div className="absolute right-5 bottom-[-25px] text-[120px] font-black text-white/5">
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

              <span className="inline-block mt-5 text-xs font-bold text-white">
                Bax →
              </span>

            </div>

          </Link>

          <Link
            href="/video"
            className="group relative overflow-hidden bg-gray-100 min-h-[190px] p-7"
          >

            <div className="absolute right-5 bottom-[-25px] text-[120px] font-black text-gray-200">
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

              <span className="inline-block mt-5 text-xs font-bold text-[#172b4d]">
                Bax →
              </span>

            </div>

          </Link>

        </div>

      </section>

      {/* ================================
          ƏMƏKDAŞLIQ
      ================================= */}

      <section className="max-w-7xl mx-auto px-4 pb-10">

        <div className="border border-gray-200 bg-[#f7f8fa] p-6 md:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">

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
            className="bg-[#172b4d] text-white px-6 py-3 text-sm font-semibold hover:bg-[#1D4E89] transition-colors"
          >
            Əlaqə saxla →
          </a>

        </div>

      </section>

    </main>
  );
}

/* ================================
   BÖLMƏ BAŞLIĞI
================================ */

function SectionTitle({ title, href }) {
  return (
    <div className="flex items-center gap-4 mb-6">

      <h2 className="text-2xl font-bold text-[#172b4d] whitespace-nowrap">
        {title}
      </h2>

      <div className="h-[2px] flex-1 bg-[#172b4d]" />

      {href && (
        <Link
          href={href}
          className="text-xs font-semibold text-[#1D4E89] whitespace-nowrap hover:text-[#172b4d] transition-colors"
        >
          Hamısı →
        </Link>
      )}

    </div>
  );
}

/* ================================
   KATEQORİYA BÖLMƏSİ
================================ */

function CategorySection({
  title,
  slug,
  articles,
}) {
  return (
    <section className="bg-[#f7f8fa] border-y border-gray-200">

      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="flex items-center gap-4 mb-6">

          <div>

            <div className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-1">
              PANORAMA
            </div>

            <h2 className="text-2xl font-bold text-[#172b4d]">
              {title}
            </h2>

          </div>

          <div className="h-[2px] flex-1 bg-[#172b4d]" />

          <Link
            href={`/${slug}`}
            className="text-xs font-semibold text-[#1D4E89] whitespace-nowrap hover:text-[#172b4d] transition-colors"
          >
            Daha çox →
          </Link>

        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

          {articles.map(
            (article) => (
              <ArticleCard
                key={article.id}
                article={article}
              />
            )
          )}

        </div>

      </div>

    </section>
  );
}