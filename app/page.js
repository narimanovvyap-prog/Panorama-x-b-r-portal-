import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import ArticleCard from '@/components/ArticleCard';
import HeroSlider from '@/components/HeroSlider';
import NewsTicker from '@/components/NewsTicker';
import { categoryName, categoryColor } from '@/lib/categories';

export const revalidate = 0;

/* =========================================================
   DATA
========================================================= */

async function getData() {
  const now = new Date().toISOString();

  const [
    articlesRes,
    featuredRes,
    mostReadRes,
    breakingRes,
    advertisementsRes,
  ] = await Promise.all([
    supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(80),

    supabase
      .from('articles')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(6),

    supabase
      .from('articles')
      .select('*')
      .order('views', { ascending: false })
      .limit(6),

    supabase
      .from('articles')
      .select('*')
      .eq('is_breaking', true)
      .order('created_at', { ascending: false })
      .limit(8),

    supabase
      .from('advertisements')
      .select('*')
      .eq('is_active', true),
  ]);

  const articles = articlesRes.data || [];
  const featuredRaw = featuredRes.data || [];
  const mostRead = mostReadRes.data || [];
  const breakingNews = breakingRes.data || [];
  const advertisements = advertisementsRes.data || [];

  const activeAds = advertisements.filter((ad) => {
    const startOk = !ad.start_date || new Date(ad.start_date) <= new Date(now);
    const endOk = !ad.end_date || new Date(ad.end_date) >= new Date(now);

    return startOk && endOk;
  });

  const featured =
    featuredRaw.length > 0
      ? featuredRaw
      : articles.slice(0, 6);

  return {
    articles,
    featured,
    mostRead,
    breakingNews,
    activeAds,
  };
}

/* =========================================================
   HELPERS
========================================================= */

function SectionTitle({ title, href = '/xeberler' }) {
  return (
    <div className="mb-5 flex items-end justify-between border-b border-slate-200 pb-3">
      <div>
        <h2 className="text-[21px] font-bold tracking-tight text-[#102A43]">
          {title}
        </h2>

        <div className="mt-1 h-[3px] w-10 bg-[#1D4E89]" />
      </div>

      <Link
        href={href}
        className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400 transition-colors hover:text-[#1D4E89]"
      >
        Hamısına bax →
      </Link>
    </div>
  );
}

function EmptyNews() {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-400">
      Hazırda bu bölmədə xəbər yoxdur.
    </div>
  );
}

/* =========================================================
   CATEGORY SECTION
========================================================= */

function CategorySection({ title, category, articles }) {
  if (!articles.length) return null;

  return (
    <section className="mb-12">
      <SectionTitle
        title={title}
        href={`/kateqoriya/${category}`}
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
          />
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   VIDEO SECTION
========================================================= */

function VideoSection({ articles }) {
  if (!articles.length) return null;

  return (
    <section className="mb-12">
      <SectionTitle
        title="Video xəbərlər"
        href="/video"
      />

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="group block overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <div className="relative aspect-video overflow-hidden bg-slate-900">
              {article.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-white/30">
                  PANORAMA
                </div>
              )}

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-[#102A43] shadow-lg transition-transform group-hover:scale-110">
                  ▶
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#1D4E89]">
                VİDEO
              </div>

              <h3 className="line-clamp-2 text-[16px] font-bold leading-snug text-[#102A43] group-hover:text-[#1D4E89]">
                {article.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   AD BANNER
========================================================= */

function AdvertisementBanner() {
  return (
    <div className="relative mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-[#0F2742] via-[#173B61] to-[#1D4E89] shadow-sm">
      {/* dekorativ dairələr */}
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-white/5" />
      <div className="absolute -bottom-14 -left-10 h-28 w-28 rounded-full bg-white/5" />

      <div className="relative z-10 p-6">
        <div className="mb-3 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/80">
            REKLAM
          </span>
        </div>

        <h3 className="text-[21px] font-bold leading-tight text-white">
          Sizin reklamınız burada
        </h3>

        <p className="mt-2 text-[12px] leading-relaxed text-white/65">
          Brendinizi PANORAMA XƏBƏR-in geniş auditoriyasına təqdim edin.
        </p>

        <a
          href="https://wa.me/994553737900"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#173B61] transition-all hover:-translate-y-0.5 hover:bg-slate-100"
        >
          Reklam yerləşdir
          <span className="text-base leading-none">
            →
          </span>
        </a>
      </div>
    </div>
  );
}

/* =========================================================
   TELEGRAM
========================================================= */

function TelegramBanner() {
  return (
    <section className="mb-12 overflow-hidden rounded-2xl bg-[#102A43]">
      <div className="relative px-6 py-8 text-center sm:px-10">
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">
            PANORAMA XƏBƏR
          </div>

          <h2 className="text-2xl font-bold text-white">
            Xəbərləri Telegram-da izləyin
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm text-white/60">
            Ən son xəbərlərdən operativ xəbərdar olmaq üçün
            Telegram kanalımıza qoşulun.
          </p>

          <a
            href="https://t.me/panoramaxeberinfoaz"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center rounded-lg bg-white px-5 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#102A43] transition hover:bg-slate-100"
          >
            Telegram kanalına qoşul →
          </a>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   PAGE
========================================================= */

export default async function HomePage() {
  const {
    articles,
    featured,
    mostRead,
    breakingNews,
    activeAds,
  } = await getData();

  const featuredIds = new Set(
    featured.map((article) => article.id)
  );

  const videoNews = articles
    .filter((article) => article.video_url)
    .slice(0, 6);

  const nonVideo = articles.filter(
    (article) => !article.video_url
  );

  const sideNews = nonVideo
    .filter((article) => !featuredIds.has(article.id))
    .slice(0, 5);

  const gündəmNews = nonVideo
    .filter((article) => !featuredIds.has(article.id))
    .slice(5, 15);

  const lowerNews = nonVideo
    .filter((article) => !featuredIds.has(article.id))
    .slice(15, 23);

  const categoryNews = (category) =>
    articles
      .filter(
        (article) =>
          article.category === category &&
          !featuredIds.has(article.id)
      )
      .slice(0, 4);

  const activeTopAd = activeAds.find(
    (ad) =>
      ad.position === 'homepage' ||
      ad.position === 'both' ||
      !ad.position
  );

  return (
    <main className="bg-white">

      {/* =====================================================
          SON DƏQİQƏ / XƏBƏR AXINI
      ===================================================== */}

      <NewsTicker articles={breakingNews} />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_330px]">

          {/* HERO SLIDER */}
          <div className="overflow-hidden rounded-2xl">
            <HeroSlider articles={featured} />
          </div>

          {/* GÜNÜN SEÇİMİ */}
          <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="mb-5 flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1D4E89]">
                  PANORAMA
                </div>

                <h2 className="mt-1 text-[20px] font-bold text-[#102A43]">
                  Günün seçimi
                </h2>
              </div>
            </div>

            <div className="space-y-4">
              {sideNews.map((article, index) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="group flex gap-3"
                >
                  <div className="relative h-[76px] w-[96px] flex-none overflow-hidden rounded-lg bg-slate-100">
                    {article.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[9px] text-slate-400">
                        ŞƏKİL YOXDUR
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="mb-1 text-[9px] font-bold text-[#1D4E89]">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <h3 className="line-clamp-3 text-[13px] font-semibold leading-snug text-[#263A4D] group-hover:text-[#1D4E89]">
                      {article.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* =====================================================
          TOP REKLAM
      ===================================================== */}

      {activeTopAd && (
        <section className="mx-auto max-w-7xl px-4 pb-7 sm:px-6 lg:px-8">
          <a
            href={activeTopAd.link_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
          >
            {activeTopAd.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={activeTopAd.image_url}
                alt={activeTopAd.title || 'Reklam'}
                className="h-auto max-h-[180px] w-full object-cover"
              />
            ) : (
              <div className="flex min-h-[110px] items-center justify-center text-sm text-slate-400">
                {activeTopAd.title || 'Reklam'}
              </div>
            )}
          </a>
        </section>
      )}

      {/* =====================================================
          GÜNDƏM + ƏN ÇOX OXUNANLAR
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">

          {/* GÜNDƏM */}
          <div>
            <SectionTitle
              title="Gündəm"
              href="/xeberler"
            />

            {gündəmNews.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
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

          {/* SAĞ SÜTUN */}
          <aside>

            {/* ƏN ÇOX OXUNANLAR */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="mb-5 border-b border-slate-200 pb-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#1D4E89]">
                  OXUNMA GÖSTƏRİCİLƏRİ
                </div>

                <h2 className="mt-1 text-[20px] font-bold text-[#102A43]">
                  Ən çox oxunanlar
                </h2>
              </div>

              <div className="space-y-4">
                {mostRead.map((article, index) => (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    className="group flex gap-3"
                  >
                    <div className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#F1F5F9] text-[12px] font-bold text-[#1D4E89] group-hover:bg-[#1D4E89] group-hover:text-white">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-[#263A4D] group-hover:text-[#1D4E89]">
                        {article.title}
                      </h3>

                      <div className="mt-1 text-[10px] text-slate-400">
                        {article.views || 0} baxış
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* =================================================
                REKLAM BANNERİ
            ================================================= */}

            <AdvertisementBanner />

          </aside>
        </div>
      </section>

      {/* =====================================================
          SİYASƏT
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategorySection
          title="Siyasət"
          category="siyaset"
          articles={categoryNews('siyaset')}
        />
      </section>

      {/* =====================================================
          İQTİSADİYYAT
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategorySection
          title="İqtisadiyyat"
          category="iqtisadiyyat"
          articles={categoryNews('iqtisadiyyat')}
        />
      </section>

      {/* =====================================================
          CƏMİYYƏT
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategorySection
          title="Cəmiyyət"
          category="cemiyyet"
          articles={categoryNews('cemiyyet')}
        />
      </section>

      {/* =====================================================
          DÜNYA
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategorySection
          title="Dünya"
          category="dunya"
          articles={categoryNews('dunya')}
        />
      </section>

      {/* =====================================================
          İDMAN
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategorySection
          title="İdman"
          category="idman"
          articles={categoryNews('idman')}
        />
      </section>

      {/* =====================================================
          MƏDƏNİYYƏT
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategorySection
          title="Mədəniyyət"
          category="medeniyyet"
          articles={categoryNews('medeniyyet')}
        />
      </section>

      {/* =====================================================
          TEXNOLOGİYA
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CategorySection
          title="Texnologiya"
          category="texnologiya"
          articles={categoryNews('texnologiya')}
        />
      </section>

      {/* =====================================================
          DİGƏR XƏBƏRLƏR
      ===================================================== */}

      {lowerNews.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <section className="mb-12">
            <SectionTitle
              title="Digər xəbərlər"
              href="/xeberler"
            />

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {lowerNews.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                />
              ))}
            </div>
          </section>
        </section>
      )}

      {/* =====================================================
          VİDEO XƏBƏRLƏR
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <VideoSection articles={videoNews} />
      </section>

      {/* =====================================================
          FOTO / VİDEO KEÇİDİ
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section className="mb-12">
          <div className="grid gap-5 md:grid-cols-2">

            <Link
              href="/foto"
              className="group relative overflow-hidden rounded-2xl bg-[#102A43] p-7"
            >
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/5" />

              <div className="relative z-10">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                  PANORAMA
                </div>

                <h3 className="mt-2 text-2xl font-bold text-white">
                  Foto xəbərlər
                </h3>

                <p className="mt-2 text-sm text-white/60">
                  Hadisələrdən ən maraqlı görüntülər.
                </p>

                <div className="mt-5 text-[11px] font-bold uppercase tracking-wider text-white">
                  Fotolara bax →
                </div>
              </div>
            </Link>

            <Link
              href="/video"
              className="group relative overflow-hidden rounded-2xl bg-[#1D4E89] p-7"
            >
              <div className="absolute -bottom-10 -right-5 h-36 w-36 rounded-full bg-white/5" />

              <div className="relative z-10">
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/50">
                  PANORAMA
                </div>

                <h3 className="mt-2 text-2xl font-bold text-white">
                  Video xəbərlər
                </h3>

                <p className="mt-2 text-sm text-white/60">
                  Ən son hadisələri videolarda izləyin.
                </p>

                <div className="mt-5 text-[11px] font-bold uppercase tracking-wider text-white">
                  Videolara bax →
                </div>
              </div>
            </Link>

          </div>
        </section>
      </section>

      {/* =====================================================
          TELEGRAM
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <TelegramBanner />
      </section>

    </main>
  );
}
