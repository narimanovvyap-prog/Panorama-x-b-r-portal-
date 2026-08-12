import { supabase } from '@/lib/supabaseClient';
import { categoryName, categoryColor } from '@/lib/categories';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 0;

async function getArticle(slug) {
  const { data } = await supabase.from('articles').select('*').eq('slug', slug).single();
  return data;
}

export default async function ArticlePage({ params }) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  // Baxış sayını artır (səhv olsa belə səhifə yüklənməyə davam etsin)
  try {
  await supabase.rpc('increment_views', { article_id: article.id });
} catch (error) {
  console.error('View count error:', error);
}

  const { data: related } = await supabase
    .from('articles')
    .select('id, title, slug, image_url, category')
    .eq('category', article.category)
    .neq('id', article.id)
    .order('created_at', { ascending: false })
    .limit(3);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div
        className="font-mono text-[11px] font-semibold uppercase tracking-wider mb-3"
        style={{ color: categoryColor(article.category) }}
      >
        <Link href={`/${article.category}`}>{categoryName(article.category)}</Link>
      </div>

      <h1 className="font-serif text-3xl md:text-4xl font-semibold leading-tight mb-4">
        {article.title}
      </h1>

      <div className="flex items-center gap-4 text-xs text-gray-400 mb-6 pb-6 border-b border-line">
        {article.source && <span>Mənbə: {article.source}</span>}
        <span>{new Date(article.created_at).toLocaleDateString('az-AZ')}</span>
        <span>{article.views || 0} baxış</span>
      </div>

      {article.image_url && (
        <div className="aspect-[16/9] bg-ink2 mb-6 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      <article className="prose max-w-none text-[16px] text-gray-800 whitespace-pre-line">
        {article.content}
      </article>

      {related && related.length > 0 && (
        <div className="mt-12 pt-8 border-t border-line">
          <h3 className="font-serif text-xl font-semibold mb-5">Bunları da oxu</h3>
          <div className="grid sm:grid-cols-3 gap-6">
            {related.map((r) => (
              <Link key={r.id} href={`/article/${r.slug}`} className="block group">
                <div className="aspect-[16/10] bg-ink2 mb-2 overflow-hidden">
                  {r.image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.image_url} alt={r.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <h4 className="font-serif text-sm font-semibold leading-snug group-hover:text-blue line-clamp-2">
                  {r.title}
                </h4>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
