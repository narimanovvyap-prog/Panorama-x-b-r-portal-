import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsTicker from '@/components/NewsTicker';
import { supabase } from '@/lib/supabaseClient';

export const metadata = {
  title: 'PANORAMA — Xəbər Portalı',
  description: 'Gündəlik xəbər portalı',
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