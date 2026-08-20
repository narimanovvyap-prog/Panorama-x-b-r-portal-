import Link from 'next/link';
import { categoryName, categoryColor } from '@/lib/categories';

export default function ArticleCard({ article }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group block"
    >
      <div className="bg-ink2 mb-3 overflow-hidden rounded-sm">
        {article.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image_url}
            alt={article.title || 'Article image'}
            className="w-full h-auto object-contain block"
          />
        ) : (
          <div className="aspect-[16/10] flex items-center justify-center">
            <span className="text-white/40 text-sm">
              Şəkil yoxdur
            </span>
          </div>
        )}
      </div>

      <div className="mb-2">
        <span
          className="text-xs font-semibold uppercase tracking-wider"
          style={{
            color: categoryColor(article.category),
          }}
        >
          {categoryName(article.category)}
        </span>
      </div>

      <h2 className="text-lg font-bold leading-tight text-white group-hover:opacity-70 transition-opacity">
        {article.title}
      </h2>

      {article.excerpt && (
        <p className="mt-2 text-sm text-white/60 line-clamp-2">
          {article.excerpt}
        </p>
      )}
    </Link>
  );
}