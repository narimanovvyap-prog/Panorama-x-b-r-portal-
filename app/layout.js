import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsTicker from '@/components/NewsTicker';
import { supabase } from '@/lib/supabaseClient';

export const metadata = {
  metadataBase: new URL('https://panoramaxeber.info.az'),

  title: {
    default: 'PANORAMA — Xəbər Portalı',
    template: '%s | PANORAMA',
  },

  description:
    'PANORAMA — Azərbaycandan və dünyadan ən son xəbərlər.',

  applicationName: 'PANORAMA',

  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },

  openGraph: {
    title: 'PANORAMA — Xəbər Portalı',
    description:
      'Azərbaycandan və dünyadan ən son xəbərlər.',
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
  },
};

async function getLatestNews() {
  const { data } = await supabase
    .from('articles')
    .select('id, title, slug')
    .order('created_at', { ascending: false })
    .limit(10);

  return data || [];
}

export default async function RootLayout({ children }) {
  const latestNews = await getLatestNews();

  return (
    <html lang="az">
      <body className="font-sans">
        <Header />

        <NewsTicker articles={latestNews} />

        <main>{children}</main>

        <Footer />
      </body>
    </html>
  );
}