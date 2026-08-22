import './globals.css';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsTicker from '@/components/NewsTicker';

import { supabase } from '@/lib/supabaseClient';

export const metadata = {
  metadataBase: new URL(
    'https://panoramaxeber.info.az'
  ),

  title: {
    default: 'PANORAMA — Xəbər Portalı',
    template: '%s | PANORAMA',
  },

  description:
    'PANORAMA — Azərbaycandan və dünyadan ən son xəbərlər, gündəm, siyasət, iqtisadiyyat, cəmiyyət, dünya və idman xəbərləri.',

  applicationName: 'PANORAMA',

  keywords: [
    'Panorama',
    'Panorama Xəbər',
    'Azərbaycan xəbərləri',
    'son xəbərlər',
    'gündəm',
    'xəbər portalı',
    'Bakı xəbərləri',
  ],

  authors: [
    {
      name: 'PANORAMA Xəbər Portalı',
    },
  ],

  creator: 'PANORAMA Xəbər Portalı',

  publisher: 'PANORAMA Xəbər Portalı',

  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },

  openGraph: {
    title: 'PANORAMA — Xəbər Portalı',

    description:
      'Azərbaycandan və dünyadan ən son xəbərləri PANORAMA-da izləyin.',

    url: 'https://panoramaxeber.info.az',

    siteName: 'PANORAMA',

    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'PANORAMA — Xəbər Portalı',
      },
    ],

    locale: 'az_AZ',

    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',

    title: 'PANORAMA — Xəbər Portalı',

    description:
      'Azərbaycandan və dünyadan ən son xəbərlər.',

    images: ['/logo.png'],
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,

      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};


// =====================================================
// SON XƏBƏRLƏR
// =====================================================

async function getLatestNews() {
  const { data, error } = await supabase
    .from('articles')
    .select(
      'id, title, slug, category, created_at, is_breaking'
    )
    .order('created_at', {
      ascending: false,
    })
    .limit(12);

  if (error) {
    console.error(
      'Son xəbərlər xətası:',
      error
    );

    return [];
  }

  return data || [];
}


// =====================================================
// ROOT LAYOUT
// =====================================================

export default async function RootLayout({
  children,
}) {
  const latestNews = await getLatestNews();

  return (
    <html lang="az">
      <body className="font-sans bg-bg text-ink">

        {/* =================================================
            HEADER
        ================================================= */}

        <Header />


        {/* =================================================
            SON XƏBƏRLƏR LENTİ
        ================================================= */}

        {latestNews.length > 0 && (
          <NewsTicker
            articles={latestNews}
          />
        )}


        {/* =================================================
            ƏSAS MƏZMUN
        ================================================= */}

        <main className="min-h-screen">
          {children}
        </main>


        {/* =================================================
            FOOTER
        ================================================= */}

        <Footer />

      </body>
    </html>
  );
}