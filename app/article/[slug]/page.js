import { supabase } from '@/lib/supabaseClient';
import { categoryName, categoryColor } from '@/lib/categories';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 0;

async function getArticle(slug) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;

  return data;
}

export async function generateMetadata({ params }) {
  const article = await getArticle(params.slug);

  if (!article) {
    return {
      title: 'Xəbər tapılmadı | PANORAMA XƏBƏR',
    };
  }

  const title = article.title || 'PANORAMA XƏBƏR';
  const description =
    article.excerpt ||
    article.content?.replace(/<[^>]*>/g, '').slice(0, 200) ||
    'PANORAMA XƏBƏR — gündəlik xəbərlər';

  const image = article.image_url
    ? article.image_url.startsWith('http')
      ? article.image_url
      : `https://panoramaxeber.info.az${article.image_url}`
    : 'https://panoramaxeber.info.az/og-image.jpg';

  const url = `https://panoramaxeber.info.az/article/${article.slug}`;

  return {
    title: `${title} | PANORAMA XƏBƏR`,
    description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title,
      description,
      url,
      siteName: 'PANORAMA XƏBƏR',
      type: 'article',
      locale: 'az_AZ',

      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function ArticlePage({ params }) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  const color = categoryColor(article.category);

  const cleanContent = article.content || '';

  return (
    <main className="min-h-screen bg-white">
      <article className="max-w-5xl mx-auto px-4 py-8 md:py-12">

        {/* Kateqoriya */}
        <div className="mb-4">
          <span
            className="inline-block px-3 py-1 text-sm font-semibold text-white rounded"
            style={{ backgroundColor: color }}
          >
            {categoryName(article.category)}
          </span>
        </div>

        {/* Başlıq */}
        <h1 className="text-3xl md:text-5xl font-bold leading-tight text-gray-900 mb-5">
          {article.title}
        </h1>

        {/* Qısa mətn */}
        {article.excerpt && (
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6">
            {article.excerpt}
          </p>
        )}

        {/* Mənbə və tarix */}
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-7">
          {article.source && (
            <span>
              Mənbə: <strong>{article.source}</strong>
            </span>
          )}

          {article.created_at && (
            <span>
              {new Date(article.created_at).toLocaleDateString('az-AZ')}
            </span>
          )}
        </div>

        {/* Əsas şəkil */}
        {article.image_url && (
          <div className="w-full mb-8 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-auto object-contain"
            />
          </div>
        )}

        {/* Xəbər mətni */}
        <div
          className="prose prose-lg max-w-none text-gray-900 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: cleanContent }}
        />

        {/* Geri qayıt */}
        <div className="mt-10 pt-6 border-t">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold hover:underline"
          >
            ← Ana səhifəyə qayıt
          </Link>
        </div>

      </article>
    </main>
  );
}