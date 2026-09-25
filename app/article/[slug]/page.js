import { supabase } from '@/lib/supabaseClient';
import { categoryName, categoryColor } from '@/lib/categories';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 0;

/* =========================================================
   ARTICLE
========================================================= */

async function getArticle(slug) {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;

  return data;
}

/* =========================================================
   SEO / TELEGRAM / FACEBOOK PREVIEW
========================================================= */

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

  const url =
    `https://panoramaxeber.info.az/article/${article.slug}`;

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

      publishedTime: article.created_at || undefined,

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

/* =========================================================
   PAGE
========================================================= */

export default async function ArticlePage({ params }) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  /* =======================================================
     BAXIŞ SAYI
  ======================================================= */

  await supabase.rpc('increment_views', {
    article_id: article.id,
  });

  const currentViews = Number(article.views || 0) + 1;

  /* =======================================================
     KATEQORİYA
  ======================================================= */

  const color = categoryColor(article.category);

  /* =======================================================
     MƏTN
  ======================================================= */

  const cleanContent = article.content || '';

  /* =======================================================
     TARİX
  ======================================================= */

  const publishedDate = article.created_at
    ? new Date(article.created_at)
    : null;

  const formattedDate = publishedDate
    ? publishedDate.toLocaleDateString('az-AZ', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  const formattedTime = publishedDate
    ? publishedDate.toLocaleTimeString('az-AZ', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

  /* =======================================================
     PAYLAŞIM
  ======================================================= */

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
    <main className="min-h-screen bg-[#f8fafc]">

      <article className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:py-10">

        {/* =================================================
            ÜST NAVİQASİYA
        ================================================= */}

        <div className="mb-6 flex items-center gap-2 text-sm text-gray-400">
          <Link
            href="/"
            className="transition hover:text-gray-900"
          >
            Ana səhifə
          </Link>

          <span>›</span>

          <span className="text-gray-600">
            {categoryName(article.category)}
          </span>
        </div>

        {/* =================================================
            ƏSAS XƏBƏR BLOKU
        ================================================= */}

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100 sm:p-8 md:p-10">

          {/* KATEQORİYA */}

          <div className="mb-5">
            <span
              className="
                inline-flex
                items-center
                rounded-full
                px-4
                py-1.5
                text-xs
                font-bold
                uppercase
                tracking-wide
                text-white
                shadow-sm
              "
              style={{
                backgroundColor: color,
              }}
            >
              {categoryName(article.category)}
            </span>
          </div>

          {/* =================================================
              BAŞLIQ
          ================================================= */}

          <h1
            className="
              max-w-5xl
              text-[30px]
              font-black
              leading-[1.12]
              tracking-[-0.02em]
              text-[#111827]
              sm:text-[38px]
              md:text-[48px]
              lg:text-[54px]
            "
          >
            {article.title}
          </h1>

          {/* =================================================
              QISA MƏTN
          ================================================= */}

          {article.excerpt && (
            <p
              className="
                mt-6
                max-w-4xl
                border-l-4
                pl-4
                text-base
                leading-7
                text-gray-600
                sm:text-lg
                md:text-xl
                md:leading-8
              "
              style={{
                borderColor: color,
              }}
            >
              {article.excerpt}
            </p>
          )}

          {/* =================================================
              MƏLUMAT PANELİ
          ================================================= */}

          <div
            className="
              mt-7
              flex
              flex-wrap
              items-center
              gap-x-5
              gap-y-3
              border-y
              border-gray-100
              py-4
              text-sm
              text-gray-500
            "
          >

            {article.source && (
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-400">
                  Mənbə
                </span>

                <strong className="text-gray-800">
                  {article.source}
                </strong>
              </div>
            )}

            {article.source && publishedDate && (
              <span className="hidden text-gray-200 sm:block">
                |
              </span>
            )}

            {publishedDate && (
              <div className="flex items-center gap-2">
                <span>📅</span>
                <span>{formattedDate}</span>
              </div>
            )}

            {publishedDate && (
              <>
                <span className="hidden text-gray-200 sm:block">
                  |
                </span>

                <div className="flex items-center gap-2">
                  <span>🕐</span>
                  <span>{formattedTime}</span>
                </div>
              </>
            )}

            <span className="hidden text-gray-200 sm:block">
              |
            </span>

            <div className="flex items-center gap-2 font-semibold text-gray-600">
              <span>👁</span>
              <span>
                {currentViews.toLocaleString('az-AZ')} baxış
              </span>
            </div>

          </div>

          {/* =================================================
              ƏSAS ŞƏKİL
          ================================================= */}

          {article.image_url && (
            <figure className="mt-8 overflow-hidden rounded-2xl bg-gray-100 ring-1 ring-gray-100">

              <img
                src={article.image_url}
                alt={article.title}
                className="
                  block
                  h-auto
                  w-full
                  object-contain
                "
              />

              <figcaption className="border-t border-gray-100 bg-gray-50 px-4 py-3 text-xs text-gray-400">
                PANORAMA XƏBƏR
              </figcaption>

            </figure>
          )}

          {/* =================================================
              XƏBƏR MƏTNİ
          ================================================= */}

          <div
            className="
              article-content
              prose
              prose-lg
              mt-10
              max-w-none
              text-gray-800
              prose-headings:text-gray-950
              prose-p:leading-8
              prose-p:text-gray-800
              prose-a:text-blue-700
              prose-strong:text-gray-950
              sm:mt-12
            "
            dangerouslySetInnerHTML={{
              __html: cleanContent,
            }}
          />

          {/* =================================================
              PAYLAŞIM
          ================================================= */}

          <div className="mt-12 border-t border-gray-100 pt-7">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">
                  Xəbəri paylaş
                </div>

                <div className="mt-1 text-sm font-semibold text-gray-800">
                  Bu xəbəri sosial şəbəkələrdə paylaşın
                </div>
              </div>

              <div className="flex flex-wrap gap-2">

                {/* TELEGRAM */}

                <a
                  href={telegramShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
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
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-md
                  "
                >
                  <span>✈</span>
                  Telegram
                </a>

                {/* WHATSAPP */}

                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
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
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-md
                  "
                >
                  <span>☎</span>
                  WhatsApp
                </a>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            TELEGRAM KANALI
        ================================================= */}

        <div className="mt-8">

          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              bg-[#0f172a]
              p-6
              shadow-sm
              sm:p-8
            "
          >

            <div
              className="
                absolute
                -right-16
                -top-16
                h-40
                w-40
                rounded-full
                bg-blue-500/10
                blur-3xl
              "
            />

            <div
              className="
                relative
                flex
                flex-col
                gap-6
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div className="flex items-center gap-4">

                <div
                  className="
                    flex
                    h-14
                    w-14
                    flex-none
                    items-center
                    justify-center
                    rounded-2xl
                    bg-white/10
                    text-2xl
                  "
                >
                  ✈️
                </div>

                <div>
                  <p className="text-lg font-bold text-white">
                    PANORAMA XƏBƏR
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    Ən son xəbərləri Telegram kanalımızdan izləyin
                  </p>
                </div>

              </div>

              <a
                href="https://t.me/panoramaxeberinfoaz"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-slate-900
                  transition
                  hover:bg-gray-100
                "
              >
                Telegram-a keç
                <span>→</span>
              </a>

            </div>

          </div>

        </div>

        {/* =================================================
            ALT MƏLUMAT
        ================================================= */}

        <div
          className="
            mt-8
            flex
            flex-col
            gap-4
            border-t
            border-gray-200
            pt-6
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">

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
              transition
              hover:text-black
            "
          >
            ← Ana səhifəyə qayıt
          </Link>

        </div>

      </article>

    </main>
  );
}
