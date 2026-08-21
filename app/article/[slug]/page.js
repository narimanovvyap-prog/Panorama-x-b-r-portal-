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

  if (!article) notFound();

  // Baxış sayını artır
  try {
    await supabase.rpc('increment_views', {
      article_id: article.id,
    });
  } catch (error) {
    console.error('View count error:', error);
  }

  // Əlaqəli xəbərlər
  const { data: related } = await supabase
    .from('articles')
    .select('id, title, slug, image_url, category')
    .eq('category', article.category)
    .neq('id', article.id)
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <main className="max-w-3xl mx-auto px-6 py-8 bg-white text-gray-900">

      {/* Kateqoriya */}
      <div
        className="font-mono text-[11px] font-semibold uppercase tracking-wider mb-3"
        style={{ color: categoryColor(article.category) }}
      >
        <Link
          href={`/${article.category}`}
          className="hover:opacity-70 transition-opacity"
        >
          {categoryName(article.category)}
        </Link>
      </div>

      {/* Başlıq */}
      <h1 className="font-serif text-3xl md:text-4xl font-semibold leading-tight mb-4 text-gray-900">
        {article.title}
      </h1>

      {/* Mənbə / tarix / baxış */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-6 pb-6 border-b border-gray-200">
        {article.source && (
          <span>
            Mənbə: {article.source}
          </span>
        )}

        <span>
          {new Date(article.created_at).toLocaleDateString('az-AZ')}
        </span>

        <span>
          {article.views || 0} baxış
        </span>
      </div>

      {/* ƏSAS ŞƏKİL */}
      {article.image_url && (
        <div className="w-full mb-8 bg-gray-50 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-auto object-contain block"
          />
        </div>
      )}

      {/* Xəbərin mətni */}
      <article className="text-[16px] md:text-[17px] leading-8 text-gray-900 whitespace-pre-line">
        {article.content}
      </article>

      {/* Əlaqəli xəbərlər */}
      {related && related.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">

          <h3 className="font-serif text-xl font-semibold mb-5 text-gray-900">
            Bunları da oxu
          </h3>

          <div className="grid sm:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/article/${r.slug}`}
                className="block group"
              >

                {/* Əlaqəli xəbər şəkli */}
                <div className="aspect-[16/10] bg-gray-100 mb-2 overflow-hidden">
                  {r.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.image_url}
                      alt={r.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      Şəkil yoxdur
                    </div>
                  )}
                </div>

                {/* Əlaqəli xəbər başlığı */}
                <h4 className="font-serif text-sm font-semibold leading-snug text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
                  {r.title}
                </h4>

              </Link>
            ))}
          </div>
        </div>
      )}

    </main>
  );
}