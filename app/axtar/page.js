import { supabase } from '@/lib/supabaseClient';
import ArticleCard from '@/components/ArticleCard';

export const revalidate = 0;

export default async function SearchPage({ searchParams }) {
  const q = searchParams?.q?.trim() || '';
  let articles = [];

  if (q) {
    const { data } = await supabase
      .from('articles')
      .select('*')
      .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,content.ilike.%${q}%`)
      .order('created_at', { ascending: false });
    articles = data || [];
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <h1 className="font-serif text-2xl font-semibold mb-2">Axtarış nəticələri</h1>
      <p className="text-sm text-gray-500 mb-6">
        "{q}" üçün {articles.length} nəticə tapıldı
      </p>

      {articles.length === 0 ? (
        <p className="text-gray-500 text-sm">Heç nə tapılmadı. Başqa açar sözlə cəhd et.</p>
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
