import Link from 'next/link';
import { categoryName, categoryColor } from '@/lib/categories';

export default function ArticleCard({ article }) {
  return (
    <Link href={`/article/${article.slug}`} className="group block">
      <div className="aspect-[16/10] bg-ink2 mb-3 overflow-hidden">
        {article.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
            Şəkil yoxdur
          </div>
        )}
      </div>
      <div
        className="font-mono text-[10.5px] font-semibold uppercase tracking-wider mb-1"
        style={{ color: categoryColor(article.category) }}
      >
        {categoryName(article.category)}
      </div>
      <h3 className="font-serif text-[17px] font-semibold leading-snug mb-1 group-hover:text-blue line-clamp-2">
        {article.title}
      </h3>
      {article.excerpt && (
        <p className="text-[12.5px] text-gray-500 line-clamp-2 mb-1">{article.excerpt}</p>
      )}
      <div className="text-[11px] text-gray-400">
        {article.source ? `Mənbə: ${article.source}` : ''}
      </div>
    </Link>
  );
}
