import Link from 'next/link';
import { categoryName, categoryColor } from '@/lib/categories';

export default function ArticleCard({ article }) {
  return (
    <Link
      href={`/article/${article.slug}`}
      className="group block"
    >
      {/* Şəkil */}
      <div className="aspect-[16/10] bg-gray-100 mb-3 overflow-hidden rounded-sm">
        {article.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image_url}
            alt={article.title || 'Article image'}
            className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-sm">
              Şəkil yoxdur
            </span>
          </div>
        )}
      </div>

      {/* Kateqoriya */}
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

      {/* Başlıq */}
      <h2 className="text-lg font-bold leading-tight text-black group-hover:text-gray-600 transition-colors">
        {article.title}
      </h2>

      {/* Açıqlama */}
      {article.excerpt && (
        <p className="mt-2 text-sm leading-relaxed text-gray-600 line-clamp-2">
          {article.excerpt}
        </p>
      )}
    </Link>
  );
}