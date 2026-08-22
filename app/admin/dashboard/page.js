'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Fraunces, Inter, IBM_Plex_Mono } from 'next/font/google';
import { supabase } from '@/lib/supabaseClient';
import { CATEGORIES } from '@/lib/categories';

/* =========================================================
   TYPOGRAPHY
========================================================= */

const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  weight: ['600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-display',
});

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});

const FONT_VARS = `${fraunces.variable} ${inter.variable} ${plexMono.variable}`;

/* =========================================================
   SUPABASE STORAGE BUCKETS
========================================================= */

const NEWS_IMAGE_BUCKET = 'xeber-sekiller';
const VIDEO_BUCKET = 'xeber-videolari';
const GALLERY_BUCKET = 'gallery-images';
const AD_BUCKET = 'advertisements';

/* =========================================================
   DESIGN TOKENS
========================================================= */

const c = {
  ink: '#12192B',
  inkSoft: '#1E2A45',
  paper: '#F5F4EF',
  surface: '#FFFFFF',
  line: '#E4E1D7',
  text: '#1B2033',
  muted: '#71727F',
  gold: '#B8842A',
  goldSoft: '#F3E7CD',
  blue: '#2C5AA0',
  danger: '#B0473A',
  success: '#2E7D53',
};

/* =========================================================
   NAVIGATION
========================================================= */

const NAV_ITEMS = [
  {
    key: 'dashboard',
    code: 'PAN',
    label: 'Ümumi görünüş',
    icon: '▦',
  },
  {
    key: 'news',
    code: 'NWS',
    label: 'Xəbər paylaş',
    icon: '📰',
  },
  {
    key: 'video',
    code: 'VID',
    label: 'Video paylaş',
    icon: '🎥',
  },
  {
    key: 'gallery',
    code: 'GAL',
    label: 'Foto qalereya',
    icon: '📸',
  },
  {
    key: 'ads',
    code: 'REK',
    label: 'Reklamlar',
    icon: '📢',
  },
  {
    key: 'manage',
    code: 'MNG',
    label: 'Paylaşımları idarə et',
    icon: '✏️',
  },
  {
    key: 'statistics',
    code: 'STA',
    label: 'Statistika',
    icon: '📊',
  },
];

/* =========================================================
   ROOT
========================================================= */

export default function AdminDashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [active, setActive] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error(error);
      }

      if (!user) {
        router.replace('/admin');
        return;
      }

      setUser(user);
      setLoading(false);
    } catch (error) {
      console.error(error);
      router.replace('/admin');
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace('/admin');
  }

  const today = useMemo(
    () =>
      new Date().toLocaleDateString('az-AZ', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }),
    []
  );

  if (loading) {
    return (
      <div
        className={`${FONT_VARS} min-h-screen flex items-center justify-center`}
        style={{ background: c.paper }}
      >
        <div className="flex items-center gap-3">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: c.gold }}
          />

          <span
            className="text-xs tracking-[0.2em] uppercase font-[family-name:var(--font-mono)]"
            style={{ color: c.muted }}
          >
            Admin panel yüklənir
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${FONT_VARS} min-h-screen font-[family-name:var(--font-body)]`}
      style={{
        background: c.paper,
        color: c.text,
      }}
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header
        className="sticky top-0 z-30 border-b"
        style={{
          background: c.ink,
          borderColor: c.inkSoft,
        }}
      >
        <div className="max-w-[1600px] mx-auto px-5 md:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setNavOpen((v) => !v)}
                className="md:hidden text-white/70 text-lg leading-none px-1"
                aria-label="Menyu"
              >
                ☰
              </button>

              <div>
                <div className="font-[family-name:var(--font-display)] italic font-black tracking-tight text-white text-xl leading-none">
                  Panorama
                </div>

                <div className="font-[family-name:var(--font-mono)] text-[9px] text-white/45 uppercase tracking-[0.25em] mt-1">
                  Redaksiya idarə paneli
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-5">
              <div className="hidden lg:flex items-center gap-2 pr-5 border-r border-white/10">
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: c.gold }}
                />

                <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em] text-white/50">
                  Canlı sessiya
                </span>
              </div>

              <div className="hidden md:block text-right">
                <div className="text-xs text-white/70">
                  {user?.email}
                </div>

                <div className="font-[family-name:var(--font-mono)] text-[9px] text-white/35 uppercase tracking-[0.15em] capitalize">
                  {today}
                </div>
              </div>

              <button
                onClick={logout}
                className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.1em] text-white/80 border border-white/15 px-4 py-2 hover:bg-white/10 hover:border-white/30 transition-colors"
              >
                Çıxış
              </button>
            </div>
          </div>
        </div>

        <div
          style={{ background: c.gold }}
          className="h-[3px]"
        />

        <div
          style={{ background: c.inkSoft }}
          className="h-px"
        />
      </header>

      <div className="max-w-[1600px] mx-auto flex">
        {/* =====================================================
            SIDEBAR
        ===================================================== */}

        <aside
          className={`
            w-64 shrink-0 border-r
            ${navOpen ? 'block' : 'hidden'} md:block
            fixed md:sticky top-16 md:top-16 left-0 z-20
            h-[calc(100vh-64px)] overflow-y-auto
          `}
          style={{
            background: c.surface,
            borderColor: c.line,
          }}
        >
          <div className="p-4">
            <div
              className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.25em] px-3 mb-3"
              style={{ color: c.muted }}
            >
              Desklər
            </div>

            <nav className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <DeskNavItem
                  key={item.key}
                  {...item}
                  active={active === item.key}
                  onClick={() => {
                    setActive(item.key);
                    setNavOpen(false);
                  }}
                />
              ))}
            </nav>

            <div
              className="my-5 h-px"
              style={{ background: c.line }}
            />

            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-3 py-3 text-sm hover:bg-black/[0.03] transition-colors"
              style={{ color: c.muted }}
            >
              <span>🌐</span>
              Sayta bax
            </a>
          </div>
        </aside>

        {navOpen && (
          <div
            className="fixed inset-0 top-16 bg-black/30 z-10 md:hidden"
            onClick={() => setNavOpen(false)}
          />
        )}

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <main className="flex-1 min-w-0 p-5 md:p-10">
          {active === 'dashboard' && (
            <DashboardHome setActive={setActive} />
          )}

          {active === 'news' && <NewsForm />}

          {active === 'video' && <VideoForm />}

          {active === 'gallery' && <GalleryForm />}

          {active === 'ads' && <AdvertisementForm />}

          {active === 'manage' && <ManageContent />}

          {active === 'statistics' && <Statistics />}
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   NAV ITEM
========================================================= */

function DeskNavItem({
  active,
  onClick,
  icon,
  code,
  label,
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-3 text-sm text-left transition-colors group"
      style={{
        background: active ? c.ink : 'transparent',
        color: active ? '#fff' : c.text,
      }}
    >
      <span
        className="font-[family-name:var(--font-mono)] text-[9px] w-8 shrink-0 tracking-wider"
        style={{
          color: active ? c.gold : c.muted,
        }}
      >
        {code}
      </span>

      <span className="shrink-0">
        {icon}
      </span>

      <span className="truncate">
        {label}
      </span>
    </button>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function DashboardHome({ setActive }) {
  const [stats, setStats] = useState({
    articles: 0,
    videos: 0,
    galleries: 0,
    views: 0,
  });

  const [recent, setRecent] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoadingStats(true);

    try {
      const { data: articles } = await supabase
        .from('articles')
        .select('id,title,video_url,views,created_at')
        .order('created_at', {
          ascending: false,
        });

      const { data: galleries } = await supabase
        .from('photo_galleries')
        .select('id');

      const normalArticles = (articles || []).filter(
        (a) => !a.video_url
      );

      const videos = (articles || []).filter(
        (a) => a.video_url
      );

      const views = (articles || []).reduce(
        (total, a) => total + Number(a.views || 0),
        0
      );

      setStats({
        articles: normalArticles.length,
        videos: videos.length,
        galleries: galleries?.length || 0,
        views,
      });

      setRecent((articles || []).slice(0, 5));
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingStats(false);
    }
  }

  return (
    <div>
      <PageHeading
        eyebrow="Panorama Xəbər"
        title="Admin panel"
        description="Xəbər portalını buradan idarə et — paylaş, izlə, yenilə."
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        <ActionCard
          icon="📰"
          title="Yeni xəbər"
          description="Adi xəbər paylaş"
          button="Xəbər paylaş"
          onClick={() => setActive('news')}
        />

        <ActionCard
          icon="🎥"
          title="Video xəbər"
          description="Video xəbər yerləşdir"
          button="Video paylaş"
          onClick={() => setActive('video')}
        />

        <ActionCard
          icon="📸"
          title="Foto qalereya"
          description="Bir neçə şəkil paylaş"
          button="Qalereya yarat"
          onClick={() => setActive('gallery')}
        />

        <ActionCard
          icon="📢"
          title="Reklam"
          description="Sayta reklam yerləşdir"
          button="Reklam əlavə et"
          onClick={() => setActive('ads')}
        />
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        <StatCard
          title="Xəbərlər"
          value={stats.articles}
          description="Adi xəbərlər"
          loading={loadingStats}
        />

        <StatCard
          title="Videolar"
          value={stats.videos}
          description="Video xəbərlər"
          loading={loadingStats}
        />

        <StatCard
          title="Fotolar"
          value={stats.galleries}
          description="Foto qalereyalar"
          loading={loadingStats}
        />

        <StatCard
          title="Baxışlar"
          value={stats.views}
          description="Ümumi baxış"
          loading={loadingStats}
          accent
        />
      </div>

      <div
        className="border"
        style={{
          background: c.surface,
          borderColor: c.line,
        }}
      >
        <div
          className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: c.line }}
        >
          <h2 className="font-[family-name:var(--font-display)] font-bold text-lg">
            Son paylaşımlar
          </h2>

          <button
            onClick={() => setActive('manage')}
            className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.15em]"
            style={{ color: c.blue }}
          >
            İdarə et →
          </button>
        </div>

        {recent.length === 0 ? (
          <EmptyState text="Hələ paylaşım yoxdur. İlk xəbəri buradan paylaş." />
        ) : (
          recent.map((article) => (
            <div
              key={article.id}
              className="px-6 py-4 border-b last:border-b-0 flex items-center justify-between gap-4"
              style={{
                borderColor: c.line,
              }}
            >
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">
                  {article.title}
                </div>

                <div
                  className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider mt-1"
                  style={{
                    color: c.muted,
                  }}
                >
                  {article.video_url
                    ? '🎥 Video'
                    : '📰 Xəbər'}
                </div>
              </div>

              <div
                className="font-[family-name:var(--font-mono)] text-xs shrink-0"
                style={{
                  color: c.muted,
                }}
              >
                {article.views || 0} baxış
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* =========================================================
   SHARED
========================================================= */

function PageHeading({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="mb-8">
      <div
        className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.25em] mb-2"
        style={{ color: c.gold }}
      >
        {eyebrow}
      </div>

      <h1 className="font-[family-name:var(--font-display)] font-black text-3xl md:text-4xl">
        {title}
      </h1>

      {description && (
        <p
          className="text-sm mt-2"
          style={{ color: c.muted }}
        >
          {description}
        </p>
      )}
    </div>
  );
}

function ActionCard({
  icon,
  title,
  description,
  button,
  onClick,
}) {
  return (
    <div
      className="border p-6 transition-colors hover:border-[#12192B]"
      style={{
        background: c.surface,
        borderColor: c.line,
      }}
    >
      <div className="text-3xl mb-5">
        {icon}
      </div>

      <h2 className="font-[family-name:var(--font-display)] font-bold text-lg">
        {title}
      </h2>

      <p
        className="text-sm mt-1 mb-5"
        style={{ color: c.muted }}
      >
        {description}
      </p>

      <button
        onClick={onClick}
        className="w-full text-white py-3 text-sm font-semibold transition-colors"
        style={{ background: c.ink }}
      >
        + {button}
      </button>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  loading,
  accent,
}) {
  return (
    <div
      className="border p-6 relative overflow-hidden"
      style={{
        background: c.surface,
        borderColor: c.line,
      }}
    >
      {accent && (
        <div
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{ background: c.gold }}
        />
      )}

      <div
        className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em]"
        style={{ color: c.muted }}
      >
        {title}
      </div>

      <div className="font-[family-name:var(--font-display)] font-black text-4xl mt-3">
        {loading
          ? '—'
          : Number(value || 0).toLocaleString('az-AZ')}
      </div>

      <div
        className="text-xs mt-1"
        style={{ color: c.muted }}
      >
        {description}
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div
      className="p-10 text-center text-sm"
      style={{ color: c.muted }}
    >
      {text}
    </div>
  );
}

function Banner({ status, text }) {
  if (!text) return null;

  const styles = {
    success: {
      border: c.success,
      bg: '#EAF6EF',
      fg: '#1E5E3B',
      icon: '✓',
    },

    error: {
      border: c.danger,
      bg: '#FBEEEC',
      fg: '#8C3A2F',
      icon: '✕',
    },
  };

  const s = styles[status] || styles.error;

  return (
    <div
      className="mt-5 border-l-4 px-4 py-3 text-sm flex items-start gap-3"
      style={{
        background: s.bg,
        borderColor: s.border,
        color: s.fg,
      }}
    >
      <span className="font-bold">
        {s.icon}
      </span>

      <span>{text}</span>
    </div>
  );
}

function FormShell({
  eyebrow,
  title,
  description,
  children,
  onSubmit,
}) {
  return (
    <div>
      <PageHeading
        eyebrow={eyebrow}
        title={title}
        description={description}
      />

      <form
        onSubmit={onSubmit}
        className="border p-6 md:p-8"
        style={{
          background: c.surface,
          borderColor: c.line,
        }}
      >
        {children}
      </form>
    </div>
  );
}

function FieldLabel({
  children,
  required,
}) {
  return (
    <label
      className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.15em] mb-2"
      style={{ color: c.muted }}
    >
      {children}

      {required && (
        <span style={{ color: c.gold }}>
          {' '}*
        </span>
      )}
    </label>
  );
}

const fieldClass =
  'w-full px-4 py-3 text-sm border outline-none transition-colors focus:border-[#12192B] bg-white';

function TextField({
  label,
  value,
  onChange,
  placeholder,
  required,
  className = '',
}) {
  return (
    <div className={`mb-5 ${className}`}>
      <FieldLabel required={required}>
        {label}
      </FieldLabel>

      <input
        type="text"
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
        style={{ borderColor: c.line }}
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  required,
  className = '',
}) {
  return (
    <div className={`mb-5 ${className}`}>
      <FieldLabel required={required}>
        {label}
      </FieldLabel>

      <textarea
        value={value}
        required={required}
        placeholder={placeholder}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className={`${fieldClass} resize-y`}
        style={{ borderColor: c.line }}
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  className = '',
}) {
  return (
    <div className={className}>
      <FieldLabel>
        {label}
      </FieldLabel>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
        style={{ borderColor: c.line }}
      >
        {options}
      </select>
    </div>
  );
}

function SubmitButton({
  loading,
  children,
  loadingText,
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="mt-2 w-full md:w-auto text-white px-8 py-3 font-semibold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      style={{ background: c.ink }}
    >
      {loading && (
        <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      )}

      {loading ? loadingText : children}
    </button>
  );
}

function FileDropZone({
  selected,
  onSelect,
  accept,
  multiple,
  icon,
  activeIcon,
  title,
  hint,
  minHeight = 190,
}) {
  return (
    <label
      className="flex flex-col items-center justify-center border-2 border-dashed cursor-pointer transition-colors"
      style={{
        minHeight,
        borderColor: selected ? c.gold : c.line,
        background: selected ? c.goldSoft : '#FAFAF8',
      }}
    >
      <div className="text-center px-4">
        <div className="text-4xl mb-3">
          {selected ? activeIcon : icon}
        </div>

        <div className="font-semibold text-sm truncate max-w-[280px]">
          {selected || title}
        </div>

        <div
          className="text-xs mt-1"
          style={{ color: c.muted }}
        >
          {hint}
        </div>
      </div>

      <input
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={onSelect}
      />
    </label>
  );
}

function CategorySelect({
  value,
  onChange,
}) {
  return (
    <SelectField
      label="Kateqoriya"
      value={value}
      onChange={onChange}
      options={CATEGORIES.map((item) => (
        <option
          key={item.slug}
          value={item.slug}
        >
          {item.name ||
            item.title ||
            item.label ||
            item.slug}
        </option>
      ))}
    />
  );
}

/* =========================================================
   XƏBƏR
========================================================= */

function NewsForm() {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(
    CATEGORIES?.[0]?.slug || ''
  );
  const [source, setSource] = useState('');
  const [image, setImage] = useState(null);
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function publishNews(e) {
    e.preventDefault();

    setLoading(true);
    setMessage(null);

    try {
      if (!title.trim()) {
        throw new Error(
          'Xəbər başlığı yazılmalıdır.'
        );
      }

      if (!content.trim()) {
        throw new Error(
          'Xəbər mətni yazılmalıdır.'
        );
      }

      let imageUrl = '';

      if (image) {
        const extension =
          image.name.split('.').pop()?.toLowerCase() ||
          'jpg';

        const fileName =
          `${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } =
          await supabase.storage
            .from(NEWS_IMAGE_BUCKET)
            .upload(fileName, image, {
              cacheControl: '3600',
              upsert: false,
              contentType: image.type || undefined,
            });

        if (uploadError) {
          throw new Error(
            `Şəkil yüklənmədi: ${uploadError.message}`
          );
        }

        const { data: publicUrlData } =
          supabase.storage
            .from(NEWS_IMAGE_BUCKET)
            .getPublicUrl(fileName);

        imageUrl =
          publicUrlData?.publicUrl || '';
      }

      const slug =
        slugify(title) + '-' + Date.now();

      const { error: insertError } =
        await supabase
          .from('articles')
          .insert({
            title: title.trim(),
            excerpt: excerpt.trim(),
            content: content.trim(),
            category,
            source: source.trim(),
            image_url: imageUrl,
            video_url: null,
            slug,
            is_featured: featured,
            views: 0,
          });

      if (insertError) {
        throw new Error(
          `Xəbər bazaya əlavə olunmadı: ${insertError.message}`
        );
      }

      setTitle('');
      setExcerpt('');
      setContent('');
      setSource('');
      setImage(null);
      setFeatured(false);

      setMessage({
        status: 'success',
        text: 'Xəbər uğurla yayımlandı.',
      });
    } catch (error) {
      console.error('NEWS ERROR:', error);

      setMessage({
        status: 'error',
        text:
          error?.message ||
          'Xəta baş verdi.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormShell
      eyebrow="Xəbər deski · NWS"
      title="Yeni xəbər paylaş"
      description="Adi xəbəri saytda yayımla."
      onSubmit={publishNews}
    >
      <TextField
        label="Xəbər başlığı"
        value={title}
        onChange={setTitle}
        placeholder="Xəbərin başlığını yaz..."
        required
      />

      <TextAreaField
        label="Qısa açıqlama"
        value={excerpt}
        onChange={setExcerpt}
        placeholder="Xəbərin qısa açıqlaması..."
        rows={3}
      />

      <TextAreaField
        label="Xəbər mətni"
        value={content}
        onChange={setContent}
        placeholder="Xəbərin tam mətnini yaz..."
        rows={12}
        required
      />

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <CategorySelect
          value={category}
          onChange={setCategory}
        />

        <TextField
          label="Mənbə"
          value={source}
          onChange={setSource}
          placeholder="Məsələn: APA"
        />
      </div>

      <div className="mb-6">
        <FieldLabel>
          Əsas şəkil
        </FieldLabel>

        <FileDropZone
          selected={image?.name}
          onSelect={(e) => {
            const selected =
              e.target.files?.[0] || null;

            setImage(selected);
            setMessage(null);
          }}
          accept="image/*"
          icon="📷"
          activeIcon="🖼️"
          title="Şəkil seç"
          hint={
            image
              ? 'Başqa şəkil seçmək üçün kliklə'
              : 'Kompüterindən şəkil seç'
          }
        />
      </div>

      {image && (
        <div
          className="mb-6 border px-4 py-3 text-sm"
          style={{
            borderColor: c.line,
            background: '#FAFAF8',
          }}
        >
          <div className="font-semibold">
            Seçilmiş şəkil
          </div>

          <div
            className="text-xs mt-1"
            style={{ color: c.muted }}
          >
            {image.name}
          </div>

          <div
            className="text-xs mt-1"
            style={{ color: c.muted }}
          >
            Ölçü:{' '}
            {(image.size / 1024 / 1024).toFixed(2)} MB
          </div>
        </div>
      )}

      <label className="flex items-center gap-3 mb-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) =>
            setFeatured(e.target.checked)
          }
          className="w-4 h-4 accent-[#B8842A]"
        />

        <span className="text-sm font-medium">
          Bu xəbəri baş xəbər et
        </span>
      </label>

      <Banner
        status={message?.status}
        text={message?.text}
      />

      <div className="mt-6">
        <SubmitButton
          loading={loading}
          loadingText="Yüklənir..."
        >
          📰 Xəbəri yayımla
        </SubmitButton>
      </div>
    </FormShell>
  );
}

/* =========================================================
   VIDEO (Qapaq şəkli / poster dəstəyi ilə)
========================================================= */

function VideoForm() {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState(
    CATEGORIES?.[0]?.slug || ''
  );
  const [source, setSource] = useState('');
  const [video, setVideo] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function publishVideo(e) {
    e.preventDefault();

    setLoading(true);
    setMessage(null);

    try {
      if (!title.trim()) {
        throw new Error(
          'Video başlığı yazılmalıdır.'
        );
      }

      if (!video) {
        throw new Error(
          'Video seçilməyib.'
        );
      }

      const maxSize =
        100 * 1024 * 1024;

      if (video.size > maxSize) {
        throw new Error(
          'Video çox böyükdür. Maksimum 100 MB video yükləyə bilərsən.'
        );
      }

      const extension =
        video.name.split('.').pop()?.toLowerCase() ||
        'mp4';

      const fileName =
        `${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from(VIDEO_BUCKET)
          .upload(fileName, video, {
            cacheControl: '3600',
            upsert: false,
            contentType: video.type || undefined,
          });

      if (uploadError) {
        throw new Error(
          `Video yüklənmədi: ${uploadError.message}`
        );
      }

      const { data: publicUrlData } =
        supabase.storage
          .from(VIDEO_BUCKET)
          .getPublicUrl(fileName);

      if (!publicUrlData?.publicUrl) {
        throw new Error(
          'Video yükləndi, amma public link alınmadı.'
        );
      }

      // Qapaq şəkli (poster) — istəyə bağlı
      let coverImageUrl = '';
      let coverFileName = null;

      if (coverImage) {
        const coverExtension =
          coverImage.name.split('.').pop()?.toLowerCase() ||
          'jpg';

        coverFileName =
          `${crypto.randomUUID()}.${coverExtension}`;

        const { error: coverUploadError } =
          await supabase.storage
            .from(NEWS_IMAGE_BUCKET)
            .upload(coverFileName, coverImage, {
              cacheControl: '3600',
              upsert: false,
              contentType: coverImage.type || undefined,
            });

        if (coverUploadError) {
          // Qapaq şəkli yüklənmədisə videonu bloklamırıq,
          // sadəcə qapaqsız davam edirik.
          console.error(
            'COVER UPLOAD ERROR:',
            coverUploadError
          );

          coverFileName = null;
        } else {
          const { data: coverPublicUrlData } =
            supabase.storage
              .from(NEWS_IMAGE_BUCKET)
              .getPublicUrl(coverFileName);

          coverImageUrl =
            coverPublicUrlData?.publicUrl || '';
        }
      }

      const slug =
        slugify(title) + '-' + Date.now();

      const { error: insertError } =
        await supabase
          .from('articles')
          .insert({
            title: title.trim(),
            excerpt: excerpt.trim(),
            content: excerpt.trim(),
            category,
            source: source.trim(),
            image_url: coverImageUrl,
            video_url: publicUrlData.publicUrl,
            slug,
            is_featured: false,
            views: 0,
          });

      if (insertError) {
        await supabase.storage
          .from(VIDEO_BUCKET)
          .remove([fileName]);

        if (coverFileName) {
          await supabase.storage
            .from(NEWS_IMAGE_BUCKET)
            .remove([coverFileName]);
        }

        throw new Error(
          `Video xəbəri bazaya əlavə olunmadı: ${insertError.message}`
        );
      }

      setTitle('');
      setExcerpt('');
      setSource('');
      setVideo(null);
      setCoverImage(null);

      setMessage({
        status: 'success',
        text: 'Video xəbər uğurla yayımlandı.',
      });
    } catch (error) {
      console.error('VIDEO ERROR:', error);

      setMessage({
        status: 'error',
        text:
          error?.message ||
          'Video yüklənmədi.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormShell
      eyebrow="Video deski · VID"
      title="Video paylaş"
      description="Kompüterindən video seç və saytda yayımla."
      onSubmit={publishVideo}
    >
      <TextField
        label="Video başlığı"
        value={title}
        onChange={setTitle}
        placeholder="Video xəbərin başlığı..."
        required
      />

      <TextAreaField
        label="Açıqlama"
        value={excerpt}
        onChange={setExcerpt}
        placeholder="Video haqqında qısa məlumat..."
        rows={4}
      />

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <CategorySelect
          value={category}
          onChange={setCategory}
        />

        <TextField
          label="Mənbə"
          value={source}
          onChange={setSource}
          placeholder="Mənbə"
        />
      </div>

      <div className="mb-6">
        <FieldLabel required>
          Video faylı
        </FieldLabel>

        <FileDropZone
          selected={video?.name}
          onSelect={(e) => {
            const selected =
              e.target.files?.[0] || null;

            setVideo(selected);
            setMessage(null);
          }}
          accept="video/mp4,video/webm,video/quicktime,video/*"
          icon="🎥"
          activeIcon="🎬"
          title="Video seç"
          hint={
            video
              ? `${video.name} — ${(video.size / 1024 / 1024).toFixed(1)} MB`
              : 'MP4, MOV, WebM — maksimum 100 MB'
          }
          minHeight={220}
        />
      </div>

      {video && (
        <div
          className="mb-6 border px-4 py-3 text-sm"
          style={{
            borderColor: c.line,
            background: '#FAFAF8',
          }}
        >
          <div className="font-semibold">
            Seçilmiş video
          </div>

          <div
            className="text-xs mt-1"
            style={{ color: c.muted }}
          >
            {video.name}
          </div>

          <div
            className="text-xs mt-1"
            style={{ color: c.muted }}
          >
            Ölçü:{' '}
            {(video.size / 1024 / 1024).toFixed(2)} MB
          </div>
        </div>
      )}

      <div className="mb-6">
        <FieldLabel>
          Video qapağı (şəkil)
        </FieldLabel>

        <FileDropZone
          selected={coverImage?.name}
          onSelect={(e) => {
            const selected =
              e.target.files?.[0] || null;

            setCoverImage(selected);
            setMessage(null);
          }}
          accept="image/*"
          icon="🖼️"
          activeIcon="🖼️"
          title="Qapaq şəkli seç"
          hint={
            coverImage
              ? 'Başqa şəkil seçmək üçün kliklə'
              : 'Seçilməsə video kadrı sayt tərəfindən göstərilir'
          }
          minHeight={160}
        />
      </div>

      {coverImage && (
        <div
          className="mb-6 border px-4 py-3 text-sm"
          style={{
            borderColor: c.line,
            background: '#FAFAF8',
          }}
        >
          <div className="font-semibold">
            Seçilmiş qapaq şəkli
          </div>

          <div
            className="text-xs mt-1"
            style={{ color: c.muted }}
          >
            {coverImage.name}
          </div>
        </div>
      )}

      <Banner
        status={message?.status}
        text={message?.text}
      />

      <div className="mt-6">
        <SubmitButton
          loading={loading}
          loadingText="Video yüklənir..."
        >
          🎥 Videonu yayımla
        </SubmitButton>
      </div>
    </FormShell>
  );
}

/* =========================================================
   FOTO QALEREYA
========================================================= */

function GalleryForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] =
    useState('');
  const [category, setCategory] =
    useState(CATEGORIES?.[0]?.slug || '');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  function selectImages(e) {
    setImages(
      Array.from(e.target.files || [])
    );

    setMessage(null);
  }

  function removeImage(index) {
    setImages((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  async function publishGallery(e) {
    e.preventDefault();

    setLoading(true);
    setMessage(null);

    try {
      if (!title.trim()) {
        throw new Error(
          'Qalereyanın başlığını yaz.'
        );
      }

      if (images.length === 0) {
        throw new Error(
          'Ən azı bir şəkil seç.'
        );
      }

      const uploadedImages = [];

      for (const image of images) {
        const extension =
          image.name.split('.').pop()?.toLowerCase() ||
          'jpg';

        const fileName =
          `${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } =
          await supabase.storage
            .from(GALLERY_BUCKET)
            .upload(fileName, image, {
              cacheControl: '3600',
              upsert: false,
              contentType: image.type || undefined,
            });

        if (uploadError) {
          throw new Error(
            `Şəkil yüklənmədi: ${uploadError.message}`
          );
        }

        const { data: publicUrlData } =
          supabase.storage
            .from(GALLERY_BUCKET)
            .getPublicUrl(fileName);

        uploadedImages.push(
          publicUrlData.publicUrl
        );
      }

      const { error: insertError } =
        await supabase
          .from('photo_galleries')
          .insert({
            title: title.trim(),
            description: description.trim(),
            category,
            images: uploadedImages,
          });

      if (insertError) {
        throw insertError;
      }

      setTitle('');
      setDescription('');
      setImages([]);

      setMessage({
        status: 'success',
        text: 'Foto qalereya uğurla yayımlandı.',
      });
    } catch (error) {
      console.error(
        'GALLERY ERROR:',
        error
      );

      setMessage({
        status: 'error',
        text:
          error?.message ||
          'Qalereya yaradılmadı.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormShell
      eyebrow="Foto deski · GAL"
      title="Foto qalereya paylaş"
      description="Bir xəbərə bir neçə şəkil əlavə et."
      onSubmit={publishGallery}
    >
      <TextField
        label="Qalereya başlığı"
        value={title}
        onChange={setTitle}
        placeholder="Məsələn: Bakıda möhtəşəm tədbir"
        required
      />

      <TextAreaField
        label="Açıqlama"
        value={description}
        onChange={setDescription}
        placeholder="Qalereya haqqında məlumat..."
        rows={4}
      />

      <div className="mb-6">
        <CategorySelect
          value={category}
          onChange={setCategory}
        />
      </div>

      <div className="mb-6">
        <FieldLabel required>
          Şəkillər
        </FieldLabel>

        <FileDropZone
          selected={
            images.length
              ? `${images.length} şəkil seçildi`
              : null
          }
          onSelect={selectImages}
          accept="image/*"
          multiple
          icon="📸"
          activeIcon="📸"
          title="Bir neçə şəkil seç"
          hint="Bir neçə şəkil seçə bilərsən"
          minHeight={200}
        />
      </div>

      {images.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div
              className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.15em]"
              style={{ color: c.muted }}
            >
              Seçilmiş şəkillər
            </div>

            <div
              className="text-xs"
              style={{ color: c.muted }}
            >
              {images.length} şəkil
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {images.map((image, index) => (
              <div
                key={`${image.name}-${index}`}
                className="relative border aspect-square overflow-hidden"
                style={{
                  borderColor: c.line,
                  background: '#F0EFEA',
                }}
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />

                <button
                  type="button"
                  onClick={() =>
                    removeImage(index)
                  }
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 text-white text-xs leading-none"
                >
                  ✕
                </button>

                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-2 py-1 truncate font-[family-name:var(--font-mono)]">
                  {index + 1}. {image.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Banner
        status={message?.status}
        text={message?.text}
      />

      <div className="mt-6">
        <SubmitButton
          loading={loading}
          loadingText="Şəkillər yüklənir..."
        >
          📸 Qalereyanı yayımla
        </SubmitButton>
      </div>
    </FormShell>
  );
}

/* =========================================================
   REKLAM
========================================================= */

function AdvertisementForm() {
  const [title, setTitle] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [position, setPosition] =
    useState('homepage');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function publishAdvertisement(e) {
    e.preventDefault();

    setLoading(true);
    setMessage(null);

    try {
      if (!title.trim()) {
        throw new Error(
          'Reklam adı yazılmalıdır.'
        );
      }

      let imageUrl = '';

      if (image) {
        const extension =
          image.name.split('.').pop()?.toLowerCase() ||
          'jpg';

        const fileName =
          `${crypto.randomUUID()}.${extension}`;

        const { error: uploadError } =
          await supabase.storage
            .from(AD_BUCKET)
            .upload(fileName, image, {
              cacheControl: '3600',
              upsert: false,
              contentType: image.type || undefined,
            });

        if (uploadError) {
          throw uploadError;
        }

        const { data } =
          supabase.storage
            .from(AD_BUCKET)
            .getPublicUrl(fileName);

        imageUrl =
          data?.publicUrl || '';
      }

      const { error: insertError } =
        await supabase
          .from('advertisements')
          .insert({
            title: title.trim(),
            image_url: imageUrl,
            link_url: linkUrl.trim(),
            position,
            start_date: startDate || null,
            end_date: endDate || null,
            is_active: true,
          });

      if (insertError) {
        throw insertError;
      }

      setTitle('');
      setLinkUrl('');
      setStartDate('');
      setEndDate('');
      setImage(null);

      setMessage({
        status: 'success',
        text: 'Reklam uğurla əlavə edildi.',
      });
    } catch (error) {
      console.error(
        'ADVERTISEMENT ERROR:',
        error
      );

      setMessage({
        status: 'error',
        text:
          error?.message ||
          'Reklam əlavə olunmadı.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormShell
      eyebrow="Reklam deski · REK"
      title="Yeni reklam"
      description="Saytda göstəriləcək reklamı əlavə et."
      onSubmit={publishAdvertisement}
    >
      <TextField
        label="Reklam adı"
        value={title}
        onChange={setTitle}
        placeholder="Reklamın adı..."
        required
      />

      <TextField
        label="Keçid linki"
        value={linkUrl}
        onChange={setLinkUrl}
        placeholder="https://..."
      />

      <div className="grid md:grid-cols-3 gap-5 mb-6">
        <SelectField
          label="Mövqe"
          value={position}
          onChange={setPosition}
          options={
            <>
              <option value="homepage">
                Əsas səhifə
              </option>

              <option value="both">
                Əsas səhifə + digər
              </option>
            </>
          }
        />

        <div>
          <FieldLabel>
            Başlama tarixi
          </FieldLabel>

          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) =>
              setStartDate(e.target.value)
            }
            className={fieldClass}
            style={{ borderColor: c.line }}
          />
        </div>

        <div>
          <FieldLabel>
            Bitmə tarixi
          </FieldLabel>

          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) =>
              setEndDate(e.target.value)
            }
            className={fieldClass}
            style={{ borderColor: c.line }}
          />
        </div>
      </div>

      <div className="mb-6">
        <FieldLabel>
          Reklam şəkli
        </FieldLabel>

        <FileDropZone
          selected={image?.name}
          onSelect={(e) =>
            setImage(
              e.target.files?.[0] || null
            )
          }
          accept="image/*"
          icon="📢"
          activeIcon="🖼️"
          title="Reklam şəklini seç"
          hint=""
          minHeight={180}
        />
      </div>

      <Banner
        status={message?.status}
        text={message?.text}
      />

      <div className="mt-6">
        <SubmitButton
          loading={loading}
          loadingText="Yüklənir..."
        >
          📢 Reklamı əlavə et
        </SubmitButton>
      </div>
    </FormShell>
  );
}

/* =========================================================
   PAYLAŞIMLARI İDARƏ ET
========================================================= */

function ManageContent() {
  const [tab, setTab] = useState('articles');

  return (
    <div>
      <PageHeading
        eyebrow="İdarəetmə · MNG"
        title="Paylaşımları idarə et"
        description="Saytda olan xəbərləri, videoları, qalereyaları və reklamları redaktə et və ya sil."
      />

      <div
        className="flex flex-wrap gap-2 mb-6 p-1 border"
        style={{
          background: c.surface,
          borderColor: c.line,
        }}
      >
        <ManageTab
          active={tab === 'articles'}
          onClick={() => setTab('articles')}
        >
          📰 Xəbərlər
        </ManageTab>

        <ManageTab
          active={tab === 'videos'}
          onClick={() => setTab('videos')}
        >
          🎥 Videolar
        </ManageTab>

        <ManageTab
          active={tab === 'galleries'}
          onClick={() => setTab('galleries')}
        >
          📸 Qalereyalar
        </ManageTab>

        <ManageTab
          active={tab === 'ads'}
          onClick={() => setTab('ads')}
        >
          📢 Reklamlar
        </ManageTab>
      </div>

      {tab === 'articles' && (
        <ArticleManager type="news" />
      )}

      {tab === 'videos' && (
        <ArticleManager type="video" />
      )}

      {tab === 'galleries' && (
        <GalleryManager />
      )}

      {tab === 'ads' && (
        <AdvertisementManager />
      )}
    </div>
  );
}

function ManageTab({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-3 text-sm font-semibold transition-colors"
      style={{
        background: active ? c.ink : 'transparent',
        color: active ? '#fff' : c.text,
      }}
    >
      {children}
    </button>
  );
}

/* =========================================================
   ARTICLE MANAGER
========================================================= */

function ArticleManager({ type }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadItems();
  }, [type]);

  async function loadItems() {
    setLoading(true);

    try {
      let query = supabase
        .from('articles')
        .select(
          'id,title,excerpt,content,category,source,image_url,video_url,slug,is_featured,views,created_at'
        )
        .order('created_at', {
          ascending: false,
        });

      if (type === 'news') {
        query = query.is('video_url', null);
      } else {
        query = query.not('video_url', 'is', null);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setItems(data || []);
    } catch (error) {
      console.error(error);

      setMessage({
        status: 'error',
        text:
          error?.message ||
          'Paylaşımlar yüklənmədi.',
      });
    } finally {
      setLoading(false);
    }
  }

  const filtered = items.filter((item) =>
    `${item.title} ${item.source || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  async function deleteArticle(item) {
    const confirmed = window.confirm(
      `“${item.title}” paylaşımını silmək istədiyinə əminsən? Bu əməliyyat geri qaytarılmır.`
    );

    if (!confirmed) return;

    try {
      setMessage(null);

      const filesToDelete = [];

      if (item.image_url) {
        const imagePath =
          getStoragePathFromPublicUrl(
            item.image_url,
            NEWS_IMAGE_BUCKET
          );

        if (imagePath) {
          filesToDelete.push({
            bucket: NEWS_IMAGE_BUCKET,
            path: imagePath,
          });
        }
      }

      if (item.video_url) {
        const videoPath =
          getStoragePathFromPublicUrl(
            item.video_url,
            VIDEO_BUCKET
          );

        if (videoPath) {
          filesToDelete.push({
            bucket: VIDEO_BUCKET,
            path: videoPath,
          });
        }
      }

      const { error } =
        await supabase
          .from('articles')
          .delete()
          .eq('id', item.id);

      if (error) {
        throw error;
      }

      for (const file of filesToDelete) {
        await supabase.storage
          .from(file.bucket)
          .remove([file.path]);
      }

      setItems((current) =>
        current.filter(
          (article) =>
            article.id !== item.id
        )
      );

      setMessage({
        status: 'success',
        text: 'Paylaşım uğurla silindi.',
      });
    } catch (error) {
      console.error(error);

      setMessage({
        status: 'error',
        text:
          error?.message ||
          'Paylaşım silinmədi.',
      });
    }
  }

  return (
    <div>
      <div
        className="border p-4 mb-5"
        style={{
          background: c.surface,
          borderColor: c.line,
        }}
      >
        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder={
            type === 'news'
              ? 'Xəbərlərdə axtar...'
              : 'Videolarda axtar...'
          }
          className={fieldClass}
          style={{ borderColor: c.line }}
        />
      </div>

      <Banner
        status={message?.status}
        text={message?.text}
      />

      {loading ? (
        <LoadingBox text="Paylaşımlar yüklənir..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          text={
            search
              ? 'Axtarışa uyğun paylaşım tapılmadı.'
              : type === 'news'
              ? 'Hələ xəbər yoxdur.'
              : 'Hələ video yoxdur.'
          }
        />
      ) : (
        <div className="space-y-3 mt-5">
          {filtered.map((item) => (
            <ArticleManageCard
              key={item.id}
              item={item}
              type={type}
              onEdit={() =>
                setEditing(item)
              }
              onDelete={() =>
                deleteArticle(item)
              }
            />
          ))}
        </div>
      )}

      {editing && (
        <EditArticleModal
          item={editing}
          type={type}
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            setItems((current) =>
              current.map((item) =>
                item.id === updated.id
                  ? updated
                  : item
              )
            );

            setEditing(null);

            setMessage({
              status: 'success',
              text: 'Paylaşım uğurla yeniləndi.',
            });
          }}
        />
      )}
    </div>
  );
}

/* =========================================================
   ARTICLE CARD
========================================================= */

function ArticleManageCard({
  item,
  type,
  onEdit,
  onDelete,
}) {
  return (
    <div
      className="border p-4 md:p-5"
      style={{
        background: c.surface,
        borderColor: c.line,
      }}
    >
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <div className="w-full md:w-32 h-24 shrink-0 bg-[#F0EFEA] overflow-hidden">
          {item.video_url ? (
            <video
              src={item.video_url}
              poster={item.image_url || undefined}
              className="w-full h-full object-cover"
              muted
              preload="metadata"
            />
          ) : item.image_url ? (
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">
              📰
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div
            className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider mb-1"
            style={{ color: c.gold }}
          >
            {type === 'video'
              ? '🎥 Video'
              : '📰 Xəbər'}
          </div>

          <h3 className="font-[family-name:var(--font-display)] font-bold text-lg truncate">
            {item.title}
          </h3>

          <p
            className="text-sm mt-1 line-clamp-2"
            style={{ color: c.muted }}
          >
            {item.excerpt ||
              item.content ||
              'Açıqlama yoxdur.'}
          </p>

          <div
            className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider mt-2"
            style={{ color: c.muted }}
          >
            {item.source || 'Mənbə yoxdur'} ·{' '}
            {item.views || 0} baxış
          </div>
        </div>

        <div className="flex md:flex-col gap-2 shrink-0">
          <button
            type="button"
            onClick={onEdit}
            className="px-4 py-2 text-sm font-semibold border transition-colors hover:bg-black/[0.04]"
            style={{
              borderColor: c.line,
              color: c.blue,
            }}
          >
            ✏️ Redaktə
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="px-4 py-2 text-sm font-semibold border transition-colors hover:bg-[#FBEEEC]"
            style={{
              borderColor: '#E8C7C2',
              color: c.danger,
            }}
          >
            🗑️ Sil
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   EDIT ARTICLE MODAL
========================================================= */

function EditArticleModal({
  item,
  type,
  onClose,
  onSaved,
}) {
  const [title, setTitle] =
    useState(item.title || '');

  const [excerpt, setExcerpt] =
    useState(item.excerpt || '');

  const [content, setContent] =
    useState(item.content || '');

  const [category, setCategory] =
    useState(
      item.category ||
        CATEGORIES?.[0]?.slug ||
        ''
    );

  const [source, setSource] =
    useState(item.source || '');

  const [featured, setFeatured] =
    useState(Boolean(item.is_featured));

  const [newFile, setNewFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState(null);

  async function saveChanges(e) {
    e.preventDefault();

    setLoading(true);
    setMessage(null);

    try {
      if (!title.trim()) {
        throw new Error(
          'Başlıq boş ola bilməz.'
        );
      }

      let imageUrl =
        item.image_url || '';

      let videoUrl =
        item.video_url || '';

      let oldFileToDelete = null;
      let newBucket = null;

      if (newFile) {
        const extension =
          newFile.name
            .split('.')
            .pop()
            ?.toLowerCase() ||
          (type === 'video'
            ? 'mp4'
            : 'jpg');

        const fileName =
          `${crypto.randomUUID()}.${extension}`;

        newBucket =
          type === 'video'
            ? VIDEO_BUCKET
            : NEWS_IMAGE_BUCKET;

        const { error } =
          await supabase.storage
            .from(newBucket)
            .upload(
              fileName,
              newFile,
              {
                cacheControl: '3600',
                upsert: false,
                contentType:
                  newFile.type ||
                  undefined,
              }
            );

        if (error) {
          throw new Error(
            `Fayl yüklənmədi: ${error.message}`
          );
        }

        const { data } =
          supabase.storage
            .from(newBucket)
            .getPublicUrl(
              fileName
            );

        if (!data?.publicUrl) {
          throw new Error(
            'Yeni faylın public linki alınmadı.'
          );
        }

        if (type === 'video') {
          videoUrl = data.publicUrl;

          if (item.video_url) {
            oldFileToDelete = {
              bucket: VIDEO_BUCKET,
              path:
                getStoragePathFromPublicUrl(
                  item.video_url,
                  VIDEO_BUCKET
                ),
            };
          }
        } else {
          imageUrl = data.publicUrl;

          if (item.image_url) {
            oldFileToDelete = {
              bucket: NEWS_IMAGE_BUCKET,
              path:
                getStoragePathFromPublicUrl(
                  item.image_url,
                  NEWS_IMAGE_BUCKET
                ),
            };
          }
        }
      }

      const slug =
        item.slug ||
        slugify(title) +
          '-' +
          Date.now();

      const { data, error } =
        await supabase
          .from('articles')
          .update({
            title: title.trim(),
            excerpt: excerpt.trim(),
            content: content.trim(),
            category,
            source: source.trim(),
            image_url: imageUrl,
            video_url: videoUrl || null,
            slug,
            is_featured:
              type === 'news'
                ? featured
                : false,
          })
          .eq('id', item.id)
          .select()
          .single();

      if (error) {
        throw error;
      }

      if (
        oldFileToDelete?.path
      ) {
        await supabase.storage
          .from(
            oldFileToDelete.bucket
          )
          .remove([
            oldFileToDelete.path,
          ]);
      }

      onSaved(data);
    } catch (error) {
      console.error(
        'EDIT ERROR:',
        error
      );

      setMessage({
        status: 'error',
        text:
          error?.message ||
          'Dəyişiklik yadda saxlanmadı.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        style={{
          background: c.surface,
        }}
      >
        <div
          className="sticky top-0 z-10 px-6 py-5 border-b flex items-center justify-between"
          style={{
            background: c.surface,
            borderColor: c.line,
          }}
        >
          <div>
            <div
              className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em]"
              style={{ color: c.gold }}
            >
              {type === 'video'
                ? 'Video redaktəsi'
                : 'Xəbər redaktəsi'}
            </div>

            <h2 className="font-[family-name:var(--font-display)] font-black text-2xl">
              Paylaşımı redaktə et
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 border text-lg"
            style={{
              borderColor: c.line,
            }}
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={saveChanges}
          className="p-6"
        >
          <TextField
            label="Başlıq"
            value={title}
            onChange={setTitle}
            required
          />

          <TextAreaField
            label="Qısa açıqlama"
            value={excerpt}
            onChange={setExcerpt}
            rows={4}
          />

          <TextAreaField
            label={
              type === 'video'
                ? 'Mətn / açıqlama'
                : 'Xəbər mətni'
            }
            value={content}
            onChange={setContent}
            rows={10}
            required
          />

          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <CategorySelect
              value={category}
              onChange={setCategory}
            />

            <TextField
              label="Mənbə"
              value={source}
              onChange={setSource}
              placeholder="Mənbə"
            />
          </div>

          {type === 'news' && (
            <label className="flex items-center gap-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) =>
                  setFeatured(
                    e.target.checked
                  )
                }
                className="w-4 h-4 accent-[#B8842A]"
              />

              <span className="text-sm font-medium">
                Bu xəbəri baş xəbər et
              </span>
            </label>
          )}

          <div className="mb-5">
            <FieldLabel>
              {type === 'video'
                ? 'Yeni video'
                : 'Yeni şəkil'}
            </FieldLabel>

            <FileDropZone
              selected={newFile?.name}
              onSelect={(e) => {
                setNewFile(
                  e.target.files?.[0] ||
                    null
                );

                setMessage(null);
              }}
              accept={
                type === 'video'
                  ? 'video/*'
                  : 'image/*'
              }
              icon={
                type === 'video'
                  ? '🎥'
                  : '📷'
              }
              activeIcon={
                type === 'video'
                  ? '🎬'
                  : '🖼️'
              }
              title={
                type === 'video'
                  ? 'Yeni video seç'
                  : 'Yeni şəkil seç'
              }
              hint={
                newFile
                  ? 'Yeni fayl seçildi'
                  : 'Mövcud faylı dəyişmək istəmirsənsə boş saxla'
              }
              minHeight={180}
            />
          </div>

          {!newFile &&
            (type === 'video'
              ? item.video_url
              : item.image_url) && (
              <div
                className="mb-6 border p-3"
                style={{
                  borderColor: c.line,
                  background: '#FAFAF8',
                }}
              >
                <div
                  className="text-xs mb-2"
                  style={{
                    color: c.muted,
                  }}
                >
                  Mövcud fayl
                </div>

                {type === 'video' ? (
                  <video
                    src={item.video_url}
                    poster={item.image_url || undefined}
                    controls
                    className="w-full max-h-64"
                  />
                ) : (
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full max-h-64 object-contain"
                  />
                )}
              </div>
            )}

          <Banner
            status={message?.status}
            text={message?.text}
          />

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 text-white px-6 py-3 font-semibold disabled:opacity-50"
              style={{
                background: c.ink,
              }}
            >
              {loading
                ? 'Yadda saxlanılır...'
                : '✓ Dəyişiklikləri yadda saxla'}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border font-semibold"
              style={{
                borderColor: c.line,
              }}
            >
              Ləğv et
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   GALLERY MANAGER
========================================================= */

function GalleryManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    loadGalleries();
  }, []);

  async function loadGalleries() {
    setLoading(true);

    try {
      const { data, error } =
        await supabase
          .from('photo_galleries')
          .select(
            'id,title,description,category,images,created_at'
          )
          .order('created_at', {
            ascending: false,
          });

      if (error) {
        throw error;
      }

      setItems(data || []);
    } catch (error) {
      console.error(error);

      setMessage({
        status: 'error',
        text:
          error?.message ||
          'Qalereyalar yüklənmədi.',
      });
    } finally {
      setLoading(false);
    }
  }

  const filtered = items.filter((item) =>
    `${item.title} ${item.description || ''}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  async function deleteGallery(item) {
    const confirmed = window.confirm(
      `“${item.title}” qalereyasını silmək istəyirsən?`
    );

    if (!confirmed) return;

    try {
      const paths = [];

      for (const imageUrl of item.images || []) {
        const path =
          getStoragePathFromPublicUrl(
            imageUrl,
            GALLERY_BUCKET
          );

        if (path) {
          paths.push(path);
        }
      }

      const { error } =
        await supabase
          .from('photo_galleries')
          .delete()
          .eq('id', item.id);

      if (error) {
        throw error;
      }

      if (paths.length > 0) {
        await supabase.storage
          .from(GALLERY_BUCKET)
          .remove(paths);
      }

      setItems((current) =>
        current.filter(
          (gallery) =>
            gallery.id !== item.id
        )
      );

      setMessage({
        status: 'success',
        text: 'Qalereya silindi.',
      });
    } catch (error) {
      console.error(error);

      setMessage({
        status: 'error',
        text:
          error?.message ||
          'Qalereya silinmədi.',
      });
    }
  }

  return (
    <div>
      <div
        className="border p-4 mb-5"
        style={{
          background: c.surface,
          borderColor: c.line,
        }}
      >
        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Qalereyalarda axtar..."
          className={fieldClass}
          style={{
            borderColor: c.line,
          }}
        />
      </div>

      <Banner
        status={message?.status}
        text={message?.text}
      />

      {loading ? (
        <LoadingBox text="Qalereyalar yüklənir..." />
      ) : filtered.length === 0 ? (
        <EmptyState text="Qalereya tapılmadı." />
      ) : (
        <div className="space-y-4 mt-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="border p-4 md:p-5"
              style={{
                background: c.surface,
                borderColor: c.line,
              }}
            >
              <div className="flex flex-col lg:flex-row gap-5">
                <div className="grid grid-cols-4 gap-2 lg:w-72 shrink-0">
                  {(item.images || [])
                    .slice(0, 4)
                    .map((image, index) => (
                      <img
                        key={`${image}-${index}`}
                        src={image}
                        alt=""
                        className="w-full aspect-square object-cover"
                      />
                    ))}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider mb-1"
                    style={{
                      color: c.gold,
                    }}
                  >
                    📸 Foto qalereya
                  </div>

                  <h3 className="font-[family-name:var(--font-display)] font-bold text-xl">
                    {item.title}
                  </h3>

                  <p
                    className="text-sm mt-2"
                    style={{
                      color: c.muted,
                    }}
                  >
                    {item.description ||
                      'Açıqlama yoxdur.'}
                  </p>

                  <div
                    className="text-xs mt-3"
                    style={{
                      color: c.muted,
                    }}
                  >
                    {item.images?.length || 0}{' '}
                    şəkil
                  </div>
                </div>

                <div className="flex lg:flex-col gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setEditing(item)
                    }
                    className="px-4 py-2 border text-sm font-semibold"
                    style={{
                      borderColor: c.line,
                      color: c.blue,
                    }}
                  >
                    ✏️ Redaktə
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteGallery(item)
                    }
                    className="px-4 py-2 border text-sm font-semibold"
                    style={{
                      borderColor: '#E8C7C2',
                      color: c.danger,
                    }}
                  >
                    🗑️ Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <EditGalleryModal
          item={editing}
          onClose={() =>
            setEditing(null)
          }
          onSaved={(updated) => {
            setItems((current) =>
              current.map((item) =>
                item.id === updated.id
                  ? updated
                  : item
              )
            );

            setEditing(null);

            setMessage({
              status: 'success',
              text: 'Qalereya yeniləndi.',
            });
          }}
        />
      )}
    </div>
  );
}

/* =========================================================
   EDIT GALLERY MODAL
========================================================= */

function EditGalleryModal({
  item,
  onClose,
  onSaved,
}) {
  const [title, setTitle] =
    useState(item.title || '');

  const [description, setDescription] =
    useState(item.description || '');

  const [category, setCategory] =
    useState(
      item.category ||
        CATEGORIES?.[0]?.slug ||
        ''
    );

  const [existingImages, setExistingImages] =
    useState(item.images || []);

  const [newImages, setNewImages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState(null);

  function removeExisting(index) {
    setExistingImages((current) =>
      current.filter(
        (_, i) => i !== index
      )
    );
  }

  function selectNewImages(e) {
    setNewImages(
      Array.from(
        e.target.files || []
      )
    );
  }

  async function saveGallery(e) {
    e.preventDefault();

    setLoading(true);
    setMessage(null);

    try {
      if (!title.trim()) {
        throw new Error(
          'Qalereyanın başlığı boş ola bilməz.'
        );
      }

      if (
        existingImages.length === 0 &&
        newImages.length === 0
      ) {
        throw new Error(
          'Ən azı bir şəkil saxlanmalıdır.'
        );
      }

      const finalImages = [
        ...existingImages,
      ];

      const newlyUploadedPaths = [];

      for (const image of newImages) {
        const extension =
          image.name
            .split('.')
            .pop()
            ?.toLowerCase() ||
          'jpg';

        const fileName =
          `${crypto.randomUUID()}.${extension}`;

        const { error } =
          await supabase.storage
            .from(GALLERY_BUCKET)
            .upload(
              fileName,
              image,
              {
                cacheControl: '3600',
                upsert: false,
                contentType:
                  image.type ||
                  undefined,
              }
            );

        if (error) {
          throw error;
        }

        const { data } =
          supabase.storage
            .from(GALLERY_BUCKET)
            .getPublicUrl(
              fileName
            );

        if (data?.publicUrl) {
          finalImages.push(
            data.publicUrl
          );

          newlyUploadedPaths.push(
            fileName
          );
        }
      }

      const oldImages =
        item.images || [];

      const removedImages =
        oldImages.filter(
          (oldImage) =>
            !existingImages.includes(
              oldImage
            )
        );

      const { data, error } =
        await supabase
          .from('photo_galleries')
          .update({
            title: title.trim(),
            description:
              description.trim(),
            category,
            images: finalImages,
          })
          .eq('id', item.id)
          .select()
          .single();

      if (error) {
        if (
          newlyUploadedPaths.length
        ) {
          await supabase.storage
            .from(GALLERY_BUCKET)
            .remove(
              newlyUploadedPaths
            );
        }

        throw error;
      }

      const removedPaths =
        removedImages
          .map((url) =>
            getStoragePathFromPublicUrl(
              url,
              GALLERY_BUCKET
            )
          )
          .filter(Boolean);

      if (removedPaths.length) {
        await supabase.storage
          .from(GALLERY_BUCKET)
          .remove(
            removedPaths
          );
      }

      onSaved(data);
    } catch (error) {
      console.error(error);

      setMessage({
        status: 'error',
        text:
          error?.message ||
          'Qalereya yenilənmədi.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        style={{
          background: c.surface,
        }}
      >
        <div
          className="sticky top-0 z-10 px-6 py-5 border-b flex items-center justify-between"
          style={{
            background: c.surface,
            borderColor: c.line,
          }}
        >
          <div>
            <div
              className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em]"
              style={{ color: c.gold }}
            >
              Qalereya redaktəsi
            </div>

            <h2 className="font-[family-name:var(--font-display)] font-black text-2xl">
              Qalereyanı redaktə et
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 border"
            style={{
              borderColor: c.line,
            }}
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={saveGallery}
          className="p-6"
        >
          <TextField
            label="Qalereya başlığı"
            value={title}
            onChange={setTitle}
            required
          />

          <TextAreaField
            label="Açıqlama"
            value={description}
            onChange={setDescription}
            rows={5}
          />

          <div className="mb-6">
            <CategorySelect
              value={category}
              onChange={setCategory}
            />
          </div>

          <FieldLabel>
            Mövcud şəkillər
          </FieldLabel>

          {existingImages.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
              {existingImages.map(
                (image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative aspect-square border overflow-hidden"
                    style={{
                      borderColor:
                        c.line,
                    }}
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeExisting(
                          index
                        )
                      }
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white"
                    >
                      ✕
                    </button>
                  </div>
                )
              )}
            </div>
          ) : (
            <div
              className="border p-5 mb-6 text-sm"
              style={{
                borderColor: c.line,
                color: c.muted,
              }}
            >
              Mövcud şəkil qalmayıb.
            </div>
          )}

          <div className="mb-6">
            <FieldLabel>
              Yeni şəkillər əlavə et
            </FieldLabel>

            <FileDropZone
              selected={
                newImages.length
                  ? `${newImages.length} yeni şəkil seçildi`
                  : null
              }
              onSelect={selectNewImages}
              accept="image/*"
              multiple
              icon="📸"
              activeIcon="🖼️"
              title="Yeni şəkillər seç"
              hint="İstəsən mövcud şəkillərə əlavə edə bilərsən"
              minHeight={180}
            />
          </div>

          {newImages.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {newImages.map(
                (image, index) => (
                  <div
                    key={`${image.name}-${index}`}
                    className="aspect-square overflow-hidden border"
                    style={{
                      borderColor:
                        c.line,
                    }}
                  >
                    <img
                      src={URL.createObjectURL(
                        image
                      )}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                )
              )}
            </div>
          )}

          <Banner
            status={message?.status}
            text={message?.text}
          />

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 text-white px-6 py-3 font-semibold disabled:opacity-50"
              style={{
                background: c.ink,
              }}
            >
              {loading
                ? 'Yadda saxlanılır...'
                : '✓ Dəyişiklikləri yadda saxla'}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border font-semibold"
              style={{
                borderColor: c.line,
              }}
            >
              Ləğv et
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   ADVERTISEMENT MANAGER
========================================================= */

function AdvertisementManager() {
  const [items, setItems] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState('');

  const [editing, setEditing] =
    useState(null);

  const [message, setMessage] =
    useState(null);

  useEffect(() => {
    loadAds();
  }, []);

  async function loadAds() {
    setLoading(true);

    try {
      const { data, error } =
        await supabase
          .from('advertisements')
          .select(
            'id,title,image_url,link_url,position,start_date,end_date,is_active,created_at'
          )
          .order('created_at', {
            ascending: false,
          });

      if (error) {
        throw error;
      }

      setItems(data || []);
    } catch (error) {
      console.error(error);

      setMessage({
        status: 'error',
        text:
          error?.message ||
          'Reklamlar yüklənmədi.',
      });
    } finally {
      setLoading(false);
    }
  }

  const filtered =
    items.filter((item) =>
      `${item.title} ${item.link_url || ''}`
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  async function deleteAd(item) {
    const confirmed =
      window.confirm(
        `“${item.title}” reklamını silmək istəyirsən?`
      );

    if (!confirmed) return;

    try {
      const { error } =
        await supabase
          .from('advertisements')
          .delete()
          .eq('id', item.id);

      if (error) {
        throw error;
      }

      if (item.image_url) {
        const path =
          getStoragePathFromPublicUrl(
            item.image_url,
            AD_BUCKET
          );

        if (path) {
          await supabase.storage
            .from(AD_BUCKET)
            .remove([path]);
        }
      }

      setItems((current) =>
        current.filter(
          (ad) =>
            ad.id !== item.id
        )
      );

      setMessage({
        status: 'success',
        text: 'Reklam silindi.',
      });
    } catch (error) {
      console.error(error);

      setMessage({
        status: 'error',
        text:
          error?.message ||
          'Reklam silinmədi.',
      });
    }
  }

  return (
    <div>
      <div
        className="border p-4 mb-5"
        style={{
          background: c.surface,
          borderColor: c.line,
        }}
      >
        <input
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="Reklamlarda axtar..."
          className={fieldClass}
          style={{
            borderColor: c.line,
          }}
        />
      </div>

      <Banner
        status={message?.status}
        text={message?.text}
      />

      {loading ? (
        <LoadingBox text="Reklamlar yüklənir..." />
      ) : filtered.length === 0 ? (
        <EmptyState text="Reklam tapılmadı." />
      ) : (
        <div className="space-y-3 mt-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="border p-4 md:p-5"
              style={{
                background: c.surface,
                borderColor: c.line,
              }}
            >
              <div className="flex flex-col md:flex-row gap-4 md:items-center">
                <div className="w-full md:w-40 h-24 shrink-0 bg-[#F0EFEA] overflow-hidden">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl">
                      📢
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider"
                    style={{
                      color: c.gold,
                    }}
                  >
                    📢 Reklam
                  </div>

                  <h3 className="font-[family-name:var(--font-display)] font-bold text-lg truncate">
                    {item.title}
                  </h3>

                  <div
                    className="text-xs mt-1 truncate"
                    style={{
                      color: c.muted,
                    }}
                  >
                    {item.link_url ||
                      'Link yoxdur'}
                  </div>

                  <div
                    className="text-xs mt-2"
                    style={{
                      color: item.is_active
                        ? c.success
                        : c.danger,
                    }}
                  >
                    {item.is_active
                      ? '● Aktiv'
                      : '● Deaktiv'}
                  </div>
                </div>

                <div className="flex md:flex-col gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setEditing(item)
                    }
                    className="px-4 py-2 border text-sm font-semibold"
                    style={{
                      borderColor:
                        c.line,
                      color: c.blue,
                    }}
                  >
                    ✏️ Redaktə
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      deleteAd(item)
                    }
                    className="px-4 py-2 border text-sm font-semibold"
                    style={{
                      borderColor:
                        '#E8C7C2',
                      color: c.danger,
                    }}
                  >
                    🗑️ Sil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <EditAdvertisementModal
          item={editing}
          onClose={() =>
            setEditing(null)
          }
          onSaved={(updated) => {
            setItems((current) =>
              current.map((item) =>
                item.id === updated.id
                  ? updated
                  : item
              )
            );

            setEditing(null);

            setMessage({
              status: 'success',
              text: 'Reklam yeniləndi.',
            });
          }}
        />
      )}
    </div>
  );
}

/* =========================================================
   EDIT ADVERTISEMENT
========================================================= */

function EditAdvertisementModal({
  item,
  onClose,
  onSaved,
}) {
  const [title, setTitle] =
    useState(item.title || '');

  const [linkUrl, setLinkUrl] =
    useState(item.link_url || '');

  const [position, setPosition] =
    useState(
      item.position || 'homepage'
    );

  const [startDate, setStartDate] =
    useState(
      formatDateTimeLocal(
        item.start_date
      )
    );

  const [endDate, setEndDate] =
    useState(
      formatDateTimeLocal(
        item.end_date
      )
    );

  const [active, setActive] =
    useState(
      item.is_active !== false
    );

  const [image, setImage] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState(null);

  async function saveAd(e) {
    e.preventDefault();

    setLoading(true);
    setMessage(null);

    try {
      if (!title.trim()) {
        throw new Error(
          'Reklam adı boş ola bilməz.'
        );
      }

      let imageUrl =
        item.image_url || '';

      let oldImagePath = null;

      if (image) {
        const extension =
          image.name
            .split('.')
            .pop()
            ?.toLowerCase() ||
          'jpg';

        const fileName =
          `${crypto.randomUUID()}.${extension}`;

        const { error } =
          await supabase.storage
            .from(AD_BUCKET)
            .upload(
              fileName,
              image,
              {
                cacheControl: '3600',
                upsert: false,
                contentType:
                  image.type ||
                  undefined,
              }
            );

        if (error) {
          throw error;
        }

        const { data } =
          supabase.storage
            .from(AD_BUCKET)
            .getPublicUrl(
              fileName
            );

        imageUrl =
          data?.publicUrl || '';

        if (item.image_url) {
          oldImagePath =
            getStoragePathFromPublicUrl(
              item.image_url,
              AD_BUCKET
            );
        }
      }

      const { data, error } =
        await supabase
          .from('advertisements')
          .update({
            title: title.trim(),
            image_url: imageUrl,
            link_url: linkUrl.trim(),
            position,
            start_date:
              startDate || null,
            end_date:
              endDate || null,
            is_active: active,
          })
          .eq('id', item.id)
          .select()
          .single();

      if (error) {
        throw error;
      }

      if (oldImagePath) {
        await supabase.storage
          .from(AD_BUCKET)
          .remove([
            oldImagePath,
          ]);
      }

      onSaved(data);
    } catch (error) {
      console.error(error);

      setMessage({
        status: 'error',
        text:
          error?.message ||
          'Reklam yenilənmədi.',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{
          background: c.surface,
        }}
      >
        <div
          className="sticky top-0 z-10 px-6 py-5 border-b flex items-center justify-between"
          style={{
            background: c.surface,
            borderColor: c.line,
          }}
        >
          <div>
            <div
              className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-[0.2em]"
              style={{ color: c.gold }}
            >
              Reklam redaktəsi
            </div>

            <h2 className="font-[family-name:var(--font-display)] font-black text-2xl">
              Reklamı redaktə et
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 border"
            style={{
              borderColor: c.line,
            }}
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={saveAd}
          className="p-6"
        >
          <TextField
            label="Reklam adı"
            value={title}
            onChange={setTitle}
            required
          />

          <TextField
            label="Keçid linki"
            value={linkUrl}
            onChange={setLinkUrl}
            placeholder="https://..."
          />

          <div className="grid md:grid-cols-3 gap-5 mb-6">
            <SelectField
              label="Mövqe"
              value={position}
              onChange={setPosition}
              options={
                <>
                  <option value="homepage">
                    Əsas səhifə
                  </option>

                  <option value="both">
                    Əsas səhifə + digər
                  </option>
                </>
              }
            />

            <div>
              <FieldLabel>
                Başlama tarixi
              </FieldLabel>

              <input
                type="datetime-local"
                value={startDate}
                onChange={(e) =>
                  setStartDate(
                    e.target.value
                  )
                }
                className={fieldClass}
                style={{
                  borderColor: c.line,
                }}
              />
            </div>

            <div>
              <FieldLabel>
                Bitmə tarixi
              </FieldLabel>

              <input
                type="datetime-local"
                value={endDate}
                onChange={(e) =>
                  setEndDate(
                    e.target.value
                  )
                }
                className={fieldClass}
                style={{
                  borderColor: c.line,
                }}
              />
            </div>
          </div>

          <label className="flex items-center gap-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={active}
              onChange={(e) =>
                setActive(
                  e.target.checked
                )
              }
              className="w-4 h-4 accent-[#B8842A]"
            />

            <span className="text-sm font-medium">
              Reklam aktiv olsun
            </span>
          </label>

          <div className="mb-5">
            <FieldLabel>
              Reklam şəklini dəyiş
            </FieldLabel>

            <FileDropZone
              selected={image?.name}
              onSelect={(e) =>
                setImage(
                  e.target.files?.[0] ||
                    null
                )
              }
              accept="image/*"
              icon="📢"
              activeIcon="🖼️"
              title="Yeni reklam şəkli seç"
              hint="Dəyişmək istəmirsənsə boş saxla"
              minHeight={180}
            />
          </div>

          {!image &&
            item.image_url && (
              <div className="mb-6">
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full max-h-64 object-contain border"
                  style={{
                    borderColor: c.line,
                  }}
                />
              </div>
            )}

          <Banner
            status={message?.status}
            text={message?.text}
          />

          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 text-white px-6 py-3 font-semibold disabled:opacity-50"
              style={{
                background: c.ink,
              }}
            >
              {loading
                ? 'Yadda saxlanılır...'
                : '✓ Dəyişiklikləri yadda saxla'}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border font-semibold"
              style={{
                borderColor: c.line,
              }}
            >
              Ləğv et
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   LOADING
========================================================= */

function LoadingBox({ text }) {
  return (
    <div
      className="border p-10 flex items-center justify-center gap-3"
      style={{
        background: c.surface,
        borderColor: c.line,
        color: c.muted,
      }}
    >
      <span
        className="w-4 h-4 border-2 border-black/10 border-t-black/70 rounded-full animate-spin"
      />

      <span className="text-sm">
        {text}
      </span>
    </div>
  );
}

/* =========================================================
   STATİSTİKA
========================================================= */

function Statistics() {
  const [articles, setArticles] =
    useState([]);

  const [galleries, setGalleries] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  async function loadStatistics() {
    setLoading(true);

    try {
      const {
        data: articleData,
      } = await supabase
        .from('articles')
        .select(
          'id,title,views,video_url,created_at'
        )
        .order(
          'created_at',
          {
            ascending: false,
          }
        );

      const {
        data: galleryData,
      } = await supabase
        .from('photo_galleries')
        .select(
          'id,title,created_at'
        )
        .order(
          'created_at',
          {
            ascending: false,
          }
        );

      setArticles(
        articleData || []
      );

      setGalleries(
        galleryData || []
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const totalViews =
    articles.reduce(
      (sum, item) =>
        sum + Number(item.views || 0),
      0
    );

  const videos =
    articles.filter(
      (item) =>
        item.video_url
    );

  const news =
    articles.filter(
      (item) =>
        !item.video_url
    );

  return (
    <div>
      <PageHeading
        eyebrow="Statistika deski · STA"
        title="Sayt statistikası"
        description="Panorama portalının ümumi göstəriciləri."
      />

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Xəbərlər"
          value={news.length}
          description="Adi xəbərlər"
          loading={loading}
        />

        <StatCard
          title="Videolar"
          value={videos.length}
          description="Video xəbərlər"
          loading={loading}
        />

        <StatCard
          title="Fotolar"
          value={galleries.length}
          description="Foto qalereyalar"
          loading={loading}
        />

        <StatCard
          title="Baxışlar"
          value={totalViews}
          description="Ümumi baxış"
          loading={loading}
          accent
        />
      </div>

      <div
        className="border"
        style={{
          background: c.surface,
          borderColor: c.line,
        }}
      >
        <div
          className="px-6 py-4 border-b"
          style={{
            borderColor: c.line,
          }}
        >
          <h2 className="font-[family-name:var(--font-display)] font-bold">
            Son paylaşımlar
          </h2>
        </div>

        {articles.length === 0 ? (
          <EmptyState text="Hələ paylaşım yoxdur." />
        ) : (
          articles
            .slice(0, 10)
            .map((article) => (
              <div
                key={article.id}
                className="px-6 py-4 border-b last:border-b-0 flex items-center justify-between gap-4"
                style={{
                  borderColor: c.line,
                }}
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate">
                    {article.title}
                  </div>

                  <div
                    className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider mt-1"
                    style={{
                      color: c.muted,
                    }}
                  >
                    {article.video_url
                      ? '🎥 Video'
                      : '📰 Xəbər'}
                  </div>
                </div>

                <div
                  className="font-[family-name:var(--font-mono)] text-xs shrink-0"
                  style={{
                    color: c.muted,
                  }}
                >
                  {article.views || 0}{' '}
                  baxış
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

/*
  Supabase public URL-dən Storage daxilindəki
  fayl yolunu çıxarır.

  Məsələn:
  https://xxxx.supabase.co/storage/v1/object/public/
  xeber-sekiller/abc.jpg

  nəticə:
  abc.jpg
*/

function getStoragePathFromPublicUrl(
  publicUrl,
  bucket
) {
  if (!publicUrl) return null;

  try {
    const marker =
      `/storage/v1/object/public/${bucket}/`;

    const index =
      publicUrl.indexOf(marker);

    if (index === -1) {
      return null;
    }

    return decodeURIComponent(
      publicUrl.slice(
        index + marker.length
      )
    );
  } catch {
    return null;
  }
}

function formatDateTimeLocal(
  value
) {
  if (!value) return '';

  try {
    const date =
      new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    const pad = (number) =>
      String(number).padStart(
        2,
        '0'
      );

    return `${date.getFullYear()}-${pad(
      date.getMonth() + 1
    )}-${pad(
      date.getDate()
    )}T${pad(
      date.getHours()
    )}:${pad(
      date.getMinutes()
    )}`;
  } catch {
    return '';
  }
}

/* =========================================================
   SLUG
========================================================= */

function slugify(text) {
  const map = {
    ə: 'e',
    Ə: 'e',
    ı: 'i',
    İ: 'i',
    ö: 'o',
    Ö: 'o',
    ü: 'u',
    Ü: 'u',
    ş: 's',
    Ş: 's',
    ç: 'c',
    Ç: 'c',
    ğ: 'g',
    Ğ: 'g',
  };

  return text
    .split('')
    .map(
      (char) =>
        map[char] || char
    )
    .join('')
    .toLowerCase()
    .replace(
      /[^a-z0-9]+/g,
      '-'
    )
    .replace(
      /^-+|-+$/g,
      '');
}