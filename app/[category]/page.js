import { supabase } from '@/lib/supabaseClient';
import ArticleCard from '@/components/ArticleCard';
import { categoryName, CATEGORIES } from '@/lib/categories';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function CategoryPage({ params }) {
  const { category } = params;
  const isValid = CATEGORIES.some((c) => c.slug === category);
  if (!isValid) notFound();

  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-baseline gap-4 mb-6 border-b-2 border-ink pb-3">
        <h1 className="font-serif text-2xl font-semibold">{categoryName(category)}</h1>
        <span className="text-sm text-gray-400">{articles?.length || 0} xəbər</span>
      </div>

      {(!articles || articles.length === 0) ? (
        <p className="text-gray-500 text-sm">Bu kateqoriyada hələ xəbər yoxdur.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
