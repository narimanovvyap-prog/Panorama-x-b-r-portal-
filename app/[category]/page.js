import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { categoryName, categoryColor } from '@/lib/categories';

export const revalidate = 0;

async function getData(category) {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Xəbərlər xətası:', error);
  }

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

    return startOk && endOk;
  });

  return {
    articles: articles || [],
    advertisements: activeAdvertisements,
  };
}

export default async function CategoryPage({ params }) {
  const category = params.category;

  const { articles, advertisements } = await getData(category);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

      {/* ================= BAŞLIQ ================= */}

      <div className="border-b-2 border-ink pb-4 mb-7">

        <div
          className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-2"
          style={{
            color: categoryColor(category),
          }}
        >
          PANORAMA
        </div>

        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold">
          {categoryName(category)}
        </h1>

      </div>

      {/* ================= REKLAMLAR ================= */}

      {advertisements.length > 0 && (
        <section className="mb-8">

          <div className="flex items-center gap-3 mb-4">

            <div className="h-px bg-line flex-1" />

            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500">
              📢 REKLAM
            </span>

            <div className="h-px bg-line flex-1" />

          </div>

          <div className="grid grid-cols-1 gap-4">

            {advertisements.map((ad) => {

              const adContent = (
                <div className="border border-line bg-panel overflow-hidden rounded-sm hover:shadow-md transition-shadow">

                  {/* REKLAM ŞƏKLİ */}

                  {ad.image_url && (
                    <div className="w-full bg-ink2 overflow-hidden">

                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ad.image_url}
                        alt={ad.title || 'Reklam'}
                        className="w-full max-h-[320px] object-cover"
                      />

                    </div>
                  )}

                  {/* REKLAM MƏLUMATI */}

                  <div className="p-4 sm:p-5">

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <h2 className="font-serif text-lg sm:text-xl font-bold">
                          {ad.title}
                        </h2>

                        {ad.advertiser_name && (
                          <p className="text-xs text-gray-400 mt-1">
                            {ad.advertiser_name}
                          </p>
                        )}

                      </div>

                      <span className="flex-none text-[9px] uppercase tracking-wider text-gray-400 border border-line px-2 py-1">
                        Reklam
                      </span>

                    </div>

                    {ad.description && (
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        {ad.description}
                      </p>
                    )}

                    {ad.link_url && (
                      <div className="text-sm font-semibold text-blue mt-3">
                        Ətraflı bax →
                      </div>
                    )}

                  </div>

                </div>
              );

              if (ad.link_url) {
                return (
                  <a
                    key={ad.id}
                    href={ad.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    {adContent}
                  </a>
                );
              }

              return (
                <div key={ad.id}>
                  {adContent}
                </div>
              );
            })}

          </div>

        </section>
      )}

      {/* ================= XƏBƏRLƏR ================= */}

      {articles.length === 0 ? (

        <div className="py-16 text-center">

          <p className="text-gray-500">
            Bu bölmədə hələ xəbər yoxdur.
          </p>

          <Link
            href="/"
            className="inline-block mt-4 text-sm font-semibold text-blue hover:underline"
          >
            Ana səhifəyə qayıt
          </Link>

        </div>

      ) : (

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">

          {articles.map((article) => (

            <Link
              key={article.id}
              href={`/article/${article.slug}`}
              className="group block"
            >

              {/* ŞƏKİL */}

              <div className="aspect-[16/10] bg-ink2 overflow-hidden mb-3 rounded-sm">

                {article.image_url ? (

                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                ) : (

                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    PANORAMA
                  </div>

                )}

              </div>

              {/* KATEQORİYA */}

              <div
                className="font-mono text-[10px] font-bold uppercase tracking-wider mb-1"
                style={{
                  color: categoryColor(article.category),
                }}
              >
                {article.is_breaking && '🚨 '}
                {categoryName(article.category)}
              </div>

              {/* BAŞLIQ */}

              <h2 className="font-serif text-lg font-bold leading-snug line-clamp-2 group-hover:text-blue transition-colors">
                {article.title}
              </h2>

              {/* QISA MƏTN */}

              {article.excerpt && (
                <p className="text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
              )}

              {/* TARİX */}

              <div className="text-[11px] text-gray-400 mt-3">
                {new Date(article.created_at).toLocaleDateString('az-AZ')}
              </div>

            </Link>

          ))}

        </section>

      )}

    </main>
  );
}