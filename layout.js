import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  metadataBase: new URL('https://panorama-x-b-r-portal.vercel.app'),

  title: {
    default: 'PANORAMA — Xəbər Portalı',
    template: '%s | PANORAMA XƏBƏR',
  },

  description:
    'PANORAMA XƏBƏR — Azərbaycandan və dünyadan ən son xəbərlər.',

  applicationName: 'PANORAMA XƏBƏR',

  openGraph: {
    title: 'PANORAMA — Xəbər Portalı',
    description:
      'Azərbaycandan və dünyadan ən son xəbərlər.',
    url: 'https://panorama-x-b-r-portal.vercel.app',
    siteName: 'PANORAMA XƏBƏR',
    locale: 'az_AZ',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'PANORAMA — Xəbər Portalı',
    description:
      'Azərbaycandan və dünyadan ən son xəbərlər.',
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="az">
      <body className="font-sans">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}