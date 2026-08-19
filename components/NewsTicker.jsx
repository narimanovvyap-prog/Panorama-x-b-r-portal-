'use client';

import Link from 'next/link';

export default function NewsTicker({ articles = [] }) {
  if (!articles.length) return null;

  const items = [...articles, ...articles];

  return (
    <div className="w-full border-y border-line bg-panel overflow-hidden">
      <div className="flex items-stretch">

        <div className="flex-none bg-crimson text-white px-3 sm:px-4 py-3 text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center z-10">
          🚨 SON XƏBƏRLƏR
        </div>

        <div className="overflow-hidden flex-1 relative">
          <div className="news-ticker flex items-center whitespace-nowrap">

            {items.map((article, index) => (
              <Link
                key={`${article.id}-${index}`}
                href={`/article/${article.slug}`}
                className="inline-flex items-center text-sm font-semibold hover:text-blue transition-colors px-5 py-3"
              >
                {article.title}

                <span className="ml-6 text-gray-300">
                  ◆
                </span>
              </Link>
            ))}

          </div>
        </div>

      </div>
    </div>
  );
}