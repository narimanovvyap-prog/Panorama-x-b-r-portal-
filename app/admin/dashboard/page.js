'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AdminDashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    articles: 0,
    videos: 0,
    views: 0,
    live: 0,
  });

  const [latestArticles, setLatestArticles] = useState([]);
  const [liveNews, setLiveNews] = useState([]);
  const [error, setError] = useState('');

  /* =====================================================
     AUTH
  ===================================================== */

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace('/admin');
        return;
      }

      setUser(user);
      setLoading(false);
    }

    checkUser();
  }, [router]);

  /* =====================================================
     DATA
  ===================================================== */

  useEffect(() => {
    if (!user) return;

    loadDashboard();
  }, [user]);

  async function loadDashboard() {
    setError('');

    try {
      /* BÜTÜN XƏBƏRLƏR */

      const {
        data: articles,
        error: articlesError,
      } = await supabase
        .from('articles')
        .select(
          'id,title,slug,category,views,created_at,video_url,is_featured'
        )
        .order('created_at', {
          ascending: false,
        });

      if (articlesError) {
        throw articlesError;
      }

      const allArticles = articles || [];

      /* VİDEOLAR */

      const videos = allArticles.filter(
        (article) =>
          article.video_url &&
          article.video_url.trim() !== ''
      );

      /* BAXIŞLAR */

      const totalViews = allArticles.reduce(
        (total, article) =>
          total + Number(article.views || 0),
        0
      );

      /* CANLI XƏBƏRLƏR */

      let live = [];

      const {
        data: liveData,
        error: liveError,
      } = await supabase
        .from('live_news')
        .select('*')
        .order('created_at', {
          ascending: false,
        })
        .limit(8);

      if (!liveError) {
        live = liveData || [];
      }

      setStats({
        articles: allArticles.length,
        videos: videos.length,
        views: totalViews,
        live: live.length,
      });

      setLatestArticles(
        allArticles.slice(0, 8)
      );

      setLiveNews(live);
    } catch (err) {
      console.error(err);

      setError(
        'Məlumatları yükləmək mümkün olmadı.'
      );
    }
  }

  /* =====================================================
     LOGOUT
  ===================================================== */

  async function logout() {
    await supabase.auth.signOut();

    router.replace('/admin');
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center">
        <div className="text-sm text-gray-500">
          Admin panel yüklənir...
        </div>
      </div>
    );
  }

  /* =====================================================
     DASHBOARD
  ===================================================== */

  return (
    <div className="min-h-screen bg-[#f5f7fa] text-[#172b4d]">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-5 lg:px-8">

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 bg-[#172b4d] text-white flex items-center justify-center font-black text-sm">
            P
          </div>

          <div>
            <div className="font-bold text-sm tracking-wide">
              PANORAMA
            </div>

            <div className="text-[9px] text-gray-400 uppercase tracking-[0.18em]">
              Admin Panel
            </div>
          </div>

        </div>

        <div className="flex items-center gap-4">

          <Link
            href="/"
            className="hidden sm:block text-xs font-semibold text-gray-500 hover:text-[#172b4d]"
          >
            Sayta bax →
          </Link>

          <div className="hidden sm:flex items-center gap-2">

            <div className="w-8 h-8 rounded-full bg-[#172b4d] text-white flex items-center justify-center text-xs font-bold">
              A
            </div>

            <div className="text-xs">
              Admin
            </div>

          </div>

          <button
            onClick={logout}
            className="text-xs font-semibold text-red-500 hover:text-red-700"
          >
            Çıxış
          </button>

        </div>

      </header>

      {/* =================================================
          LAYOUT
      ================================================= */}

      <div className="flex">

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="hidden md:block w-[190px] min-h-[calc(100vh-64px)] bg-[#172b4d] text-white flex-none">

          <div className="p-4">

            <div className="text-[9px] text-white/40 uppercase tracking-[0.2em] mb-4">
              İdarəetmə
            </div>

            <nav className="space-y-1">

              <SidebarItem
                href="/admin/dashboard"
                icon="⌂"
                text="İcmal"
                active
              />

              <SidebarItem
                href="/admin/dashboard/live"
                icon="●"
                text="Canlı lent"
              />

              <SidebarItem
                href="/admin/dashboard/statistics"
                icon="◈"
                text="Statistika"
              />

              <SidebarItem
                href="/admin/dashboard/parliament"
                icon="▣"
                text="Parlament"
              />

              <SidebarItem
                href="/admin/dashboard/advertisements"
                icon="▤"
                text="Reklamlar"
              />

              <SidebarItem
                href="/admin/dashboard/settings"
                icon="⚙"
                text="Parametrlər"
              />

            </nav>

          </div>

          <div className="mx-4 border-t border-white/10 pt-4 mt-2">

            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-xs text-white/60 hover:text-white hover:bg-white/5 transition"
            >
              <span>←</span>
              <span>Sayta qayıt</span>
            </Link>

          </div>

        </aside>

        {/* =================================================
            MAIN
        ================================================= */}

        <main className="flex-1 min-w-0 p-4 lg:p-7">

          {/* TITLE */}

          <div className="mb-5">

            <div className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-1">
              PANORAMA / İDARƏETMƏ
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">

              <div>

                <h1 className="text-2xl lg:text-3xl font-bold">
                  İdarə paneli
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Saytın əsas göstəricilərinə ümumi baxış.
                </p>

              </div>

              <div className="text-xs text-gray-400">
                {new Date().toLocaleDateString(
                  'az-AZ',
                  {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }
                )}
              </div>

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="mb-5 border border-red-200 bg-red-50 text-red-600 px-4 py-3 text-xs">
              {error}
            </div>
          )}

          {/* =================================================
              STATISTICS
          ================================================= */}

          <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">

            <StatCard
              title="Xəbərlər"
              value={stats.articles}
              icon="📰"
              description="Ümumi xəbər"
            />

            <StatCard
              title="Videolar"
              value={stats.videos}
              icon="▶"
              description="Video xəbər"
            />

            <StatCard
              title="Baxışlar"
              value={stats.views}
              icon="◉"
              description="Ümumi baxış"
            />

            <StatCard
              title="Canlı"
              value={stats.live}
              icon="●"
              description="Canlı lent"
              live
            />

          </section>

          {/* =================================================
              LIVE + QUICK ACTIONS
          ================================================= */}

          <section className="grid xl:grid-cols-[1.6fr_0.8fr] gap-5 mb-5">

            {/* LIVE */}

            <div className="bg-white border border-gray-200">

              <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">

                <div>

                  <div className="flex items-center gap-2">

                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />

                    <h2 className="font-bold text-base">
                      Canlı xəbər lenti
                    </h2>

                  </div>

                  <p className="text-[10px] text-gray-400 mt-1">
                    Son daxil olan canlı məlumatlar
                  </p>

                </div>

                <Link
                  href="/admin/dashboard/live"
                  className="text-[11px] font-semibold text-[#1D4E89]"
                >
                  Hamısına bax →
                </Link>

              </div>

              <div>

                {liveNews.length > 0 ? (

                  liveNews.slice(0, 5).map(
                    (item, index) => (

                      <div
                        key={
                          item.id ||
                          index
                        }
                        className="px-5 py-3 border-b border-gray-100 last:border-0 flex gap-4"
                      >

                        <div className="w-[55px] flex-none text-[10px] text-gray-400 pt-1">
                          {new Date(
                            item.created_at
                          ).toLocaleTimeString(
                            'az-AZ',
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </div>

                        <div className="flex-1">

                          <div className="text-[9px] uppercase tracking-wider text-red-500 font-bold mb-1">
                            CANLI
                          </div>

                          <div className="text-sm font-semibold leading-snug">
                            {item.title ||
                              item.text ||
                              item.content ||
                              'Canlı xəbər'}
                          </div>

                        </div>

                      </div>

                    )
                  )

                ) : (

                  <div className="px-5 py-10 text-center">

                    <div className="text-3xl mb-2">
                      ◌
                    </div>

                    <p className="text-sm text-gray-400">
                      Hazırda canlı xəbər yoxdur.
                    </p>

                  </div>

                )}

              </div>

            </div>

            {/* QUICK ACTIONS */}

            <div className="bg-white border border-gray-200">

              <div className="px-5 py-4 border-b border-gray-200">

                <h2 className="font-bold text-base">
                  Sürətli keçid
                </h2>

                <p className="text-[10px] text-gray-400 mt-1">
                  Əsas idarəetmə bölmələri
                </p>

              </div>

              <div className="p-4 grid grid-cols-2 gap-2">

                <QuickAction
                  href="/admin/dashboard/live"
                  icon="🔴"
                  title="Canlı"
                />

                <QuickAction
                  href="/admin/dashboard/statistics"
                  icon="📊"
                  title="Statistika"
                />

                <QuickAction
                  href="/admin/dashboard/parliament"
                  icon="🏛️"
                  title="Parlament"
                />

                <QuickAction
                  href="/admin/dashboard/advertisements"
                  icon="📢"
                  title="Reklam"
                />

              </div>

            </div>

          </section>

          {/* =================================================
              LATEST ARTICLES
          ================================================= */}

          <section className="bg-white border border-gray-200">

            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">

              <div>

                <h2 className="font-bold text-base">
                  Son xəbərlər
                </h2>

                <p className="text-[10px] text-gray-400 mt-1">
                  Sistemdə ən son əlavə olunan xəbərlər
                </p>

              </div>

              <Link
                href="/admin/dashboard/articles"
                className="text-[11px] font-semibold text-[#1D4E89]"
              >
                Hamısına bax →
              </Link>

            </div>

            {/* TABLE */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px]">

                <thead>

                  <tr className="bg-[#f8f9fb] text-left">

                    <th className="px-5 py-3 text-[9px] uppercase tracking-wider text-gray-400 font-bold">
                      Xəbər
                    </th>

                    <th className="px-4 py-3 text-[9px] uppercase tracking-wider text-gray-400 font-bold">
                      Kateqoriya
                    </th>

                    <th className="px-4 py-3 text-[9px] uppercase tracking-wider text-gray-400 font-bold">
                      Baxış
                    </th>

                    <th className="px-4 py-3 text-[9px] uppercase tracking-wider text-gray-400 font-bold">
                      Tarix
                    </th>

                    <th className="px-4 py-3 text-[9px] uppercase tracking-wider text-gray-400 font-bold">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {latestArticles.length > 0 ? (

                    latestArticles.map(
                      (article) => (

                        <tr
                          key={article.id}
                          className="border-t border-gray-100 hover:bg-gray-50 transition"
                        >

                          <td className="px-5 py-3">

                            <div className="max-w-[360px]">

                              <div className="text-sm font-semibold truncate">
                                {article.title}
                              </div>

                              {article.video_url && (
                                <span className="text-[9px] text-[#1D4E89] font-bold">
                                  VIDEO
                                </span>
                              )}

                            </div>

                          </td>

                          <td className="px-4 py-3">

                            <span className="text-[10px] font-semibold bg-gray-100 px-2 py-1 rounded">
                              {article.category ||
                                '—'}
                            </span>

                          </td>

                          <td className="px-4 py-3">

                            <span className="text-xs text-gray-500">
                              {Number(
                                article.views || 0
                              ).toLocaleString(
                                'az-AZ'
                              )}
                            </span>

                          </td>

                          <td className="px-4 py-3">

                            <span className="text-[10px] text-gray-400 whitespace-nowrap">
                              {new Date(
                                article.created_at
                              ).toLocaleDateString(
                                'az-AZ'
                              )}
                            </span>

                          </td>

                          <td className="px-4 py-3">

                            {article.is_featured ? (

                              <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-amber-50 text-amber-600 px-2 py-1">
                                ★ BAŞ XƏBƏR
                              </span>

                            ) : (

                              <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-green-50 text-green-600 px-2 py-1">
                                ● AKTİV
                              </span>

                            )}

                          </td>

                        </tr>

                      )
                    )

                  ) : (

                    <tr>

                      <td
                        colSpan="5"
                        className="px-5 py-12 text-center text-sm text-gray-400"
                      >
                        Hələ xəbər əlavə edilməyib.
                      </td>

                    </tr>

                  )}

                </tbody>

              </table>

            </div>

          </section>

          {/* =================================================
              FOOTER INFO
          ================================================= */}

          <div className="mt-5 flex flex-col sm:flex-row justify-between gap-2 text-[10px] text-gray-400">

            <span>
              PANORAMA — Peşəkar Xəbər Agentliyi
            </span>

            <span>
              Admin panel
            </span>

          </div>

        </main>

      </div>

    </div>
  );
}

/* =========================================================
   SIDEBAR ITEM
========================================================= */

function SidebarItem({
  href,
  icon,
  text,
  active = false,
}) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3
        px-3 py-2.5
        rounded-md
        text-xs
        transition
        ${
          active
            ? 'bg-white/10 text-white font-semibold'
            : 'text-white/60 hover:text-white hover:bg-white/5'
        }
      `}
    >

      <span
        className={
          active
            ? 'text-white'
            : 'text-white/40'
        }
      >
        {icon}
      </span>

      <span>
        {text}
      </span>

    </Link>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  icon,
  description,
  live = false,
}) {
  return (
    <div className="bg-white border border-gray-200 p-4">

      <div className="flex items-start justify-between">

        <div>

          <div className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">
            {title}
          </div>

          <div className="text-2xl font-bold text-[#172b4d] mt-1">
            {Number(value || 0).toLocaleString(
              'az-AZ'
            )}
          </div>

          <div className="text-[10px] text-gray-400 mt-1">
            {description}
          </div>

        </div>

        <div
          className={`
            w-9 h-9
            flex items-center justify-center
            text-sm
            ${
              live
                ? 'bg-red-50 text-red-500'
                : 'bg-[#f1f4f8] text-[#172b4d]'
            }
          `}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  href,
  icon,
  title,
}) {
  return (
    <Link
      href={href}
      className="border border-gray-200 p-3 hover:border-[#172b4d] hover:bg-[#f8f9fb] transition"
    >

      <div className="text-lg mb-2">
        {icon}
      </div>

      <div className="text-xs font-semibold">
        {title}
      </div>

    </Link>
  );
}