import { supabase } from '@/lib/supabaseClient';
import { categoryName, categoryColor } from '@/lib/categories';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 0;

async function getArticle(slug) {
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  return data;
}

export default async function ArticlePage({ params }) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  // =====================================================
  // BAXIŞ SAYINI ARTIR
  // =====================================================

  try {
    await supabase.rpc('increment_views', {
      article_id: article.id,
    });
  } catch (error) {
    console.error('View count error:', error);
  }

  // =====================================================
  // ƏLAQƏLİ XƏBƏRLƏR
  // =====================================================

  const { data: related } = await supabase
    .from('articles')
    .select(
      'id, title, slug, image_url, category, created_at'
    )
    .eq('category', article.category)
    .neq('id', article.id)
    .order('created_at', { ascending: false })
    .limit(3);

  const createdDate = article.created_at
    ? new Date(article.created_at)
    : null;

  const formattedDate = createdDate
    ? createdDate.toLocaleDateString('az-AZ', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const formattedTime = createdDate
    ? createdDate.toLocaleTimeString('az-AZ', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  const currentViews =
    typeof article.views === 'number'
      ? article.views + 1
      : 1;

  return (
    <main className="bg-[#f8fafc] min-h-screen">

      {/* =================================================
          MƏQALƏ
      ================================================= */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10">

        <div className="max-w-5xl mx-auto">

          {/* =================================================
              BREADCRUMB
          ================================================= */}

          <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-6">

            <Link
              href="/"
              className="hover:text-[#2563eb] transition-colors"
            >
              Əsas səhifə
            </Link>

            <span>
              /
            </span>

            <Link
              href={`/${article.category}`}
              className="hover:text-[#2563eb] transition-colors"
              style={{
                color: categoryColor(article.category),
              }}
            >
              {categoryName(article.category)}
            </Link>

            <span>
              /
            </span>

            <span className="truncate max-w-[220px]">
              Xəbər
            </span>

          </div>


          {/* =================================================
              XƏBƏR BAŞLIĞI
          ================================================= */}

          <div className="bg-white border border-gray-200">

            <div className="p-5 sm:p-7 md:p-10">

              {/* KATEQORİYA */}

              <div className="flex flex-wrap items-center gap-3 mb-5">

                {article.is_breaking ? (
                  <span className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest">

                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />

                    Təcili xəbər

                  </span>
                ) : (
                  <span
                    className="inline-block px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest"
                    style={{
                      color: categoryColor(
                        article.category
                      ),
                      backgroundColor: `${categoryColor(
                        article.category
                      )}12`,
                    }}
                  >
                    {categoryName(article.category)}
                  </span>
                )}

              </div>


              {/* BAŞLIQ */}

              <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.12] tracking-tight text-[#111827] max-w-4xl">
                {article.title}
              </h1>


              {/* QISA AÇIQLAMA */}

              {article.excerpt && (
                <p className="mt-5 text-base md:text-lg leading-relaxed text-gray-600 max-w-3xl">
                  {article.excerpt}
                </p>
              )}


              {/* =================================================
                  MƏLUMAT PANELİ
              ================================================= */}

              <div className="mt-7 pt-5 border-t border-gray-200 flex flex-wrap items-center justify-between gap-5">

                <div className="flex flex-wrap items-center gap-4">

                  {/* TARİX */}

                  {formattedDate && (
                    <div className="flex items-center gap-2">

                      <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                        📅
                      </span>

                      <div>

                        <div className="text-[9px] uppercase tracking-widest text-gray-400">
                          Tarix
                        </div>

                        <div className="text-xs font-semibold text-gray-700">
                          {formattedDate}
                        </div>

                      </div>

                    </div>
                  )}


                  {/* SAAT */}

                  {formattedTime && (
                    <div className="flex items-center gap-2">

                      <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                        🕐
                      </span>

                      <div>

                        <div className="text-[9px] uppercase tracking-widest text-gray-400">
                          Saat
                        </div>

                        <div className="text-xs font-semibold text-gray-700">
                          {formattedTime}
                        </div>

                      </div>

                    </div>
                  )}


                  {/* BAXIŞ */}

                  <div className="flex items-center gap-2">

                    <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                      👁
                    </span>

                    <div>

                      <div className="text-[9px] uppercase tracking-widest text-gray-400">
                        Baxış
                      </div>

                      <div className="text-xs font-semibold text-gray-700">
                        {currentViews}
                      </div>

                    </div>

                  </div>

                </div>


                {/* PAYLAŞ */}

                <div className="flex items-center gap-2">

                  <span className="text-[10px] uppercase tracking-widest text-gray-400 mr-1">
                    Paylaş
                  </span>

                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                      `https://panorama.az/article/${article.slug}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-xs font-bold text-[#172b4d] hover:bg-[#172b4d] hover:text-white transition"
                    aria-label="Facebook-da paylaş"
                  >
                    f
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      article.title
                    )}&url=${encodeURIComponent(
                      `https://panorama.az/article/${article.slug}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-xs font-bold text-[#172b4d] hover:bg-[#172b4d] hover:text-white transition"
                    aria-label="X-də paylaş"
                  >
                    𝕏
                  </a>

                </div>

              </div>

            </div>


            {/* =================================================
                ƏSAS ŞƏKİL
            ================================================= */}

            {article.image_url && (
              <div className="border-t border-gray-200 bg-gray-100">

                {/* eslint-disable-next-line @next/next/no-img-element */}

                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full max-h-[650px] object-cover block"
                />

              </div>
            )}


            {/* =================================================
                MƏNBƏ
            ================================================= */}

            {article.source && (
              <div className="px-5 sm:px-7 md:px-10 py-3 bg-gray-50 border-t border-gray-200">

                <div className="text-[10px] uppercase tracking-widest text-gray-400">
                  Mənbə
                </div>

                <div className="text-xs font-semibold text-gray-600 mt-1">
                  {article.source}
                </div>

              </div>
            )}

          </div>


          {/* =================================================
              MƏQALƏ MƏTNİ
          ================================================= */}

          <div className="mt-6 bg-white border border-gray-200">

            <article className="px-5 sm:px-8 md:px-12 py-7 md:py-10">

              <div className="max-w-3xl mx-auto">

                <div className="text-[17px] md:text-[18px] leading-[1.9] text-[#1f2937] whitespace-pre-line">
                  {article.content}
                </div>

              </div>

            </article>


            {/* MƏNBƏ / AŞAĞI PANEL */}

            <div className="border-t border-gray-200 px-5 sm:px-8 md:px-12 py-5">

              <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-between gap-4">

                <div className="text-xs text-gray-400">
                  {formattedDate}
                  {formattedTime &&
                    ` · ${formattedTime}`}
                </div>

                <div className="text-xs text-gray-400">
                  Panorama Xəbər Portalı
                </div>

              </div>

            </div>

          </div>


          {/* =================================================
              ƏLAQƏLİ XƏBƏRLƏR
          ================================================= */}

          {related && related.length > 0 && (
            <section className="mt-10">

              <div className="flex items-end justify-between gap-4 mb-5">

                <div>

                  <div className="text-[10px] uppercase tracking-[0.2em] text-[#2563eb] font-bold mb-1">
                    Davam edin
                  </div>

                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-[#111827]">
                    Əlaqəli xəbərlər
                  </h2>

                </div>

                <Link
                  href={`/${article.category}`}
                  className="hidden sm:block text-xs font-semibold text-gray-500 hover:text-[#2563eb] transition"
                >
                  Kateqoriyaya bax →
                </Link>

              </div>


              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">

                {related.map((item) => {

                  const relatedDate =
                    item.created_at
                      ? new Date(
                          item.created_at
                        ).toLocaleDateString(
                          'az-AZ'
                        )
                      : '';

                  return (
                    <Link
                      key={item.id}
                      href={`/article/${item.slug}`}
                      className="group block bg-white border border-gray-200 hover:shadow-lg transition-all duration-300"
                    >

                      {/* ŞƏKİL */}

                      <div className="aspect-[16/10] bg-gray-100 overflow-hidden">

                        {item.image_url ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}

                            <img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            Şəkil yoxdur
                          </div>
                        )}

                      </div>


                      {/* MƏLUMAT */}

                      <div className="p-4">

                        <div className="flex items-center justify-between gap-2 mb-2">

                          <span
                            className="text-[9px] font-bold uppercase tracking-widest"
                            style={{
                              color: categoryColor(
                                item.category
                              ),
                            }}
                          >
                            {categoryName(
                              item.category
                            )}
                          </span>

                          <span className="text-[9px] text-gray-400">
                            {relatedDate}
                          </span>

                        </div>

                        <h3 className="font-serif text-base font-bold leading-snug text-[#111827] line-clamp-3 group-hover:text-[#2563eb] transition-colors">
                          {item.title}
                        </h3>

                        <div className="mt-3 pt-3 border-t border-gray-100 text-[10px] font-bold text-gray-400 group-hover:text-[#2563eb] transition-colors">
                          Xəbəri oxu →
                        </div>

                      </div>

                    </Link>
                  );
                })}

              </div>

            </section>
          )}


          {/* =================================================
              GERİ QAYIT
          ================================================= */}

          <div className="mt-8 text-center">

            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-3 border border-gray-200 bg-white text-xs font-bold text-[#172b4d] hover:bg-[#172b4d] hover:text-white transition"
            >
              ← Əsas səhifəyə qayıt
            </Link>

          </div>

        </div>

      </div>

    </main>
  );
}