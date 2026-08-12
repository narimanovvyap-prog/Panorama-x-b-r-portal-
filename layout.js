import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'PANORAMA — Xəbər Portalı',
  description: 'Gündəlik xəbər portalı',
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
