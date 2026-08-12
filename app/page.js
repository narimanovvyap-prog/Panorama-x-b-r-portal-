import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import ArticleCard from '@/components/ArticleCard';
import { categoryName, categoryColor } from '@/lib/categories';

export const revalidate = 0; // hər dəfə təzə məlumat çəksin

async function getData() {
  const { data: featured } = await supabase
    .from('articles')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(1);

  const { data: latest } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(9);

  const { data: mostRead } = await supabase
    .from('articles')
    .select('id, title, slug, views')
    .order('views', { ascending: false })
    .limit(5);

  return {
    featured: featured?.[0] || latest?.[0] || null,
    latest: latest || [],
    mostRead: mostRead || [],
  };
}

export default async function HomePage() {
  const { featured, latest, mostRead } = await getData();
  const restLatest = latest.filter((a) => a.id !== featured?.id);

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {featured && (
        <section className="grid md:grid-cols-[1.6fr_1fr] gap-8 pb-8 border-b border-line mb-8">
          <div>
            <Link href={`/article/${featured.slug}`}>
              <div className="aspect-[16/10] bg-ink2 mb-4 overflow-hidden">
                {featured.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={featured.image_url} alt={featured.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div
                className="font-mono text-[11px] font-semibold uppercase tracking-wider mb-2"
                style={{ color: categoryColor(featured.category) }}
              >
                ◆ Baş xəbər · {categoryName(featured.category)}
              </div>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold leading-tight mb-3">
                {featured.title}
              </h1>
              {featured.excerpt && (
                <p className="text-gray-600 leading-relaxed mb-3">{featured.excerpt}</p>
              )}
              {featured.source && (
                <div className="text-xs text-gray-400">Mənbə: {featured.source}</div>
              )}
            </Link>
          </div>

          <div className="flex flex-col">
            {restLatest.slice(0, 4).map((a, i) => (
              <Link key={a.id} href={`/article/${a.slug}`} className="flex gap-4 py-4 border-b border-line group">
                <div className="font-serif text-2xl font-semibold text-ink/20 w-8 flex-none">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div>
                  <div
                    className="font-mono text-[10.5px] font-semibold uppercase tracking-wider mb-1"
                    style={{ color: categoryColor(a.category) }}
                  >
                    {categoryName(a.category)}
                  </div>
                  <h3 className="font-serif text-[15px] font-semibold leading-snug group-hover:text-blue">
                    {a.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="grid md:grid-cols-[2fr_1fr] gap-10">
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-xl font-semibold">Gündəm</h2>
          </div>
          {restLatest.length === 0 ? (
            <p className="text-gray-500 text-sm">Hələ xəbər əlavə edilməyib. Admin paneldən əlavə edə bilərsən.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {restLatest.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="bg-panel p-5">
            <h4 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
              Ən çox oxunanlar
            </h4>
            {mostRead.map((a, i) => (
              <Link
                key={a.id}
                href={`/article/${a.slug}`}
                className="flex gap-3 items-baseline py-3 border-b border-line last:border-none"
              >
                <span className="font-serif font-bold text-lg text-blue flex-none w-5">{i + 1}</span>
                <h5 className="text-[13.5px] font-semibold leading-snug">{a.title}</h5>
              </Link>
            ))}
            {mostRead.length === 0 && (
              <p className="text-xs text-gray-400">Hələ baxış statistikası yoxdur.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
