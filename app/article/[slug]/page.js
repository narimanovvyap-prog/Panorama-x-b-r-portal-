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

  // ==========================================
  // BAXIŞ SAYINI ARTIR
  // ==========================================

  await supabase.rpc('increment_views', {
    article_id: article.id,
  });

  const currentViews = Number(article.views || 0) + 1;

  // ==========================================
  // KATEQORİYA
  // ==========================================

  const color = categoryColor(article.category);

  // ==========================================
  // XƏBƏR MƏTNİ
  // ==========================================

  const cleanContent = article.content || '';

  // ==========================================
  // TARİX VƏ SAAT
  // ==========================================

  const publishedDate = article.created_at
    ? new Date(article.created_at)
    : null;

  const formattedDate = publishedDate
    ? publishedDate.toLocaleDateString('az-AZ', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    : '';

  const formattedTime = publishedDate
    ? publishedDate.toLocaleTimeString('az-AZ', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  // ==========================================
  // PAYLAŞIM LİNKLƏRİ
  // ==========================================

  const articleUrl =
    `https://panoramaxeber.info.az/article/${article.slug}`;

  const encodedUrl = encodeURIComponent(articleUrl);

  const encodedTitle = encodeURIComponent(
    article.title || 'PANORAMA XƏBƏR'
  );

  const telegramShareUrl =
    `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;

  const whatsappShareUrl =
    `https://wa.me/?text=${encodeURIComponent(
      `${article.title || 'PANORAMA XƏBƏR'}\n\n${articleUrl}`
    )}`;

  return (
    <main className="min-h-screen bg-white">

      <article className="max-w-5xl mx-auto px-4 py-8 md:py-12">

        {/* ==========================================
            KATEQORİYA
        ========================================== */}

        <div className="mb-5">
          <span
            className="
              inline-flex
              items-center
              px-3.5
              py-1.5
              text-sm
              font-bold
              text-white
              rounded-full
              shadow-sm
            "
            style={{
              backgroundColor: color,
            }}
          >
            {categoryName(article.category)}
          </span>
        </div>

        {/* ==========================================
            BAŞLIQ
        ========================================== */}

        <h1
          className="
            text-3xl
            md:text-5xl
            lg:text-[52px]
            font-extrabold
            leading-[1.12]
            tracking-tight
            text-gray-950
            mb-6
          "
        >
          {article.title}
        </h1>

        {/* ==========================================
            QISA MƏTN
        ========================================== */}

        {article.excerpt && (
          <p
            className="
              text-lg
              md:text-xl
              text-gray-600
              leading-relaxed
              mb-7
              max-w-4xl
            "
          >
            {article.excerpt}
          </p>
        )}

        {/* ==========================================
            MƏLUMAT PANELİ
        ========================================== */}

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-x-5
            gap-y-3
            mb-8
            py-4
            px-4
            rounded-xl
            bg-gray-50
            border
            border-gray-100
          "
        >

          {article.source && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">
                Mənbə:
              </span>

              <strong className="text-gray-900">
                {article.source}
              </strong>
            </div>
          )}

          {article.source && publishedDate && (
            <span className="hidden sm:block text-gray-300">
              •
            </span>
          )}

          {publishedDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-base">
                📅
              </span>

              <span>
                {formattedDate}
              </span>
            </div>
          )}

          {publishedDate && (
            <>
              <span className="hidden sm:block text-gray-300">
                •
              </span>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="text-base">
                  🕐
                </span>

                <span>
                  {formattedTime}
                </span>
              </div>
            </>
          )}

          <span className="hidden sm:block text-gray-300">
            •
          </span>

          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <span className="text-base">
              👁
            </span>

            <span>
              {currentViews.toLocaleString('az-AZ')} baxış
            </span>
          </div>

        </div>

        {/* ==========================================
            ƏSAS ŞƏKİL
        ========================================== */}

        {article.image_url && (
          <div
            className="
              w-full
              mb-9
              bg-gray-100
              rounded-2xl
              overflow-hidden
              border
              border-gray-100
              shadow-sm
            "
          >
            <img
              src={article.image_url}
              alt={article.title}
              className="
                w-full
                h-auto
                object-contain
                block
              "
            />
          </div>
        )}

        {/* ==========================================
            XƏBƏR MƏTNİ
        ========================================== */}

        <div
          className="
            prose
            prose-lg
            max-w-none
            text-gray-900
            text-left
            leading-relaxed
            whitespace-pre-wrap
          "
          style={{
            whiteSpace: 'pre-wrap',
            textAlign: 'left',
          }}
          dangerouslySetInnerHTML={{
            __html: cleanContent,
          }}
        />

        {/* ==========================================
            PAYLAŞ
        ========================================== */}

        <div className="mt-10 border-y border-gray-200 py-6">

          <div
            className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-5
            "
          >

            {/* Başlıq */}

            <div>
              <div
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.16em]
                  text-gray-400
                "
              >
                Xəbəri paylaş
              </div>

              <div className="mt-1 text-sm font-semibold text-gray-800">
                Bu xəbəri dostlarınızla paylaşın
              </div>
            </div>

            {/* Düymələr */}

            <div className="flex flex-wrap items-center gap-2">

              {/* Telegram */}

              <a
                href={telegramShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram-da paylaş"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#229ED9]
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  text-white
                  shadow-sm
                  transition
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
              >
                <span className="text-base">
                  ✈
                </span>

                <span>
                  Telegram
                </span>
              </a>

              {/* WhatsApp */}

              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp-da paylaş"
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-xl
                  bg-[#25D366]
                  px-4
                  py-2.5
                  text-sm
                  font-bold
                  text-white
                  shadow-sm
                  transition
                  hover:-translate-y-0.5
                  hover:shadow-md
                "
              >
                <span className="text-base">
                  ☎
                </span>

                <span>
                  WhatsApp
                </span>
              </a>

            </div>

          </div>

        </div>

        {/* ==========================================
            TELEGRAM KANAL BLOKU
        ========================================== */}

        <div className="mt-10">

          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              bg-gradient-to-r
              from-slate-950
              via-slate-900
              to-slate-800
              p-6
              md:p-7
              shadow-lg
            "
          >

            <div
              className="
                absolute
                -right-12
                -top-12
                w-36
                h-36
                rounded-full
                bg-blue-500/20
                blur-2xl
              "
            />

            <div
              className="
                absolute
                -left-10
                -bottom-10
                w-32
                h-32
                rounded-full
                bg-cyan-400/10
                blur-2xl
              "
            />

            <div
              className="
                relative
                flex
                flex-col
                sm:flex-row
                items-center
                justify-between
                gap-5
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-4
                  text-center
                  sm:text-left
                "
              >

                <div
                  className="
                    flex-shrink-0
                    w-14
                    h-14
                    rounded-2xl
                    bg-white/10
                    backdrop-blur
                    flex
                    items-center
                    justify-center
                    border
                    border-white/10
                  "
                >
                  <span className="text-3xl">
                    ✈️
                  </span>
                </div>

                <div>
                  <p
                    className="
                      text-white
                      text-lg
                      md:text-xl
                      font-bold
                    "
                  >
                    PANORAMA XƏBƏR
                  </p>

                  <p
                    className="
                      text-gray-300
                      text-sm
                      mt-1
                    "
                  >
                    Ən son xəbərləri Telegram kanalımızdan izləyin
                  </p>
                </div>

              </div>

              <a
                href="https://t.me/panoramaxeberinfoaz"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex-shrink-0
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  px-5
                  py-3
                  rounded-xl
                  bg-white
                  text-slate-900
                  font-bold
                  text-sm
                  hover:bg-gray-100
                  hover:scale-[1.02]
                  transition-all
                  duration-200
                  shadow-md
                "
              >
                <span>
                  Telegram-a keç
                </span>

                <span className="text-lg">
                  →
                </span>
              </a>

            </div>

          </div>

        </div>

        {/* ==========================================
            ALT MƏLUMAT
        ========================================== */}

        <div
          className="
            mt-8
            pt-6
            border-t
            border-gray-200
            flex
            flex-wrap
            items-center
            justify-between
            gap-4
          "
        >

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-4
              text-sm
              text-gray-500
            "
          >

            <span>
              👁 {currentViews.toLocaleString('az-AZ')} baxış
            </span>

            {publishedDate && (
              <span>
                🕐 {formattedTime}
              </span>
            )}

          </div>

          <Link
            href="/"
            className="
              inline-flex
              items-center
              text-sm
              font-semibold
              text-gray-700
              hover:text-black
              hover:underline
              transition
            "
          >
            ← Ana səhifəyə qayıt
          </Link>

        </div>

      </article>

    </main>
  );
}
