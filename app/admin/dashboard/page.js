'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Fraunces, Inter, IBM_Plex_Mono } from 'next/font/google';
import { supabase } from '@/lib/supabaseClient';
import { CATEGORIES } from '@/lib/categories';

/* =========================================================
   TYPOGRAPHY
   Fraunces  -> masthead / section headings (editorial serif)
   Inter     -> body copy, forms, UI chrome
   IBM Plex Mono -> desk codes, stats, timestamps (wire-service feel)
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
   DESIGN TOKENS
========================================================= */

const c = {
  ink: '#12192B',       // primary dark surface (header / sidebar)
  inkSoft: '#1E2A45',   // hover / active dark surface
  paper: '#F5F4EF',     // page background
  surface: '#FFFFFF',   // card background
  line: '#E4E1D7',      // hairline borders
  text: '#1B2033',      // primary text
  muted: '#71727F',     // secondary text
  gold: '#B8842A',      // editorial accent — flags, live, featured
  goldSoft: '#F3E7CD',
  blue: '#2C5AA0',      // links / focus / primary buttons on light
  danger: '#B0473A',
  success: '#2E7D53',
};

const NAV_ITEMS = [
  { key: 'dashboard', code: 'PAN', label: 'Ümumi görünüş', icon: '▦' },
  { key: 'news', code: 'NWS', label: 'Xəbər paylaş', icon: '📰' },
  { key: 'video', code: 'VID', label: 'Video paylaş', icon: '🎥' },
  { key: 'gallery', code: 'GAL', label: 'Foto qalereya', icon: '📸' },
  { key: 'ads', code: 'REK', label: 'Reklamlar', icon: '📢' },
  { key: 'statistics', code: 'STA', label: 'Statistika', icon: '📊' },
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

  const currentNav = NAV_ITEMS.find((n) => n.key === active);

  return (
    <div
      className={`${FONT_VARS} min-h-screen font-[family-name:var(--font-body)]`}
      style={{ background: c.paper, color: c.text }}
    >
      {/* =====================================================
          MASTHEAD
      ===================================================== */}

      <header
        className="sticky top-0 z-30 border-b"
        style={{ background: c.ink, borderColor: c.inkSoft }}
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
                <div
                  className="font-[family-name:var(--font-display)] italic font-black tracking-tight text-white text-xl leading-none"
                >
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
                <div className="text-xs text-white/70">{user?.email}</div>
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

        {/* double hairline — masthead rule */}
        <div style={{ background: c.gold }} className="h-[3px]" />
        <div style={{ background: c.inkSoft }} className="h-px" />
      </header>

      <div className="max-w-[1600px] mx-auto flex">
        {/* =====================================================
            DESK NAVIGATION
        ===================================================== */}

        <aside
          className={`
            w-64 shrink-0 border-r
            ${navOpen ? 'block' : 'hidden'} md:block
            fixed md:sticky top-16 md:top-16 left-0 z-20
            h-[calc(100vh-64px)] overflow-y-auto
          `}
          style={{ background: c.surface, borderColor: c.line }}
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

            <div className="my-5 h-px" style={{ background: c.line }} />

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
          {active === 'dashboard' && <DashboardHome setActive={setActive} />}
          {active === 'news' && <NewsForm />}
          {active === 'video' && <VideoForm />}
          {active === 'gallery' && <GalleryForm />}
          {active === 'ads' && <AdvertisementForm />}
          {active === 'statistics' && <Statistics />}
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   DESK NAV ITEM
========================================================= */

function DeskNavItem({ active, onClick, icon, code, label }) {
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
        style={{ color: active ? c.gold : c.muted }}
      >
        {code}
      </span>
      <span className="shrink-0">{icon}</span>
      <span className="truncate">{label}</span>
    </button>
  );
}

/* =========================================================
   DASHBOARD HOME
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

    const { data: articles } = await supabase
      .from('articles')
      .select('id, title, video_url, views, created_at')
      .order('created_at', { ascending: false });

    const { data: galleries } = await supabase
      .from('photo_galleries')
      .select('id');

    const normalArticles = (articles || []).filter((a) => !a.video_url);
    const videos = (articles || []).filter((a) => a.video_url);
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
    setLoadingStats(false);
  }

  return (
    <div>
      <PageHeading
        eyebrow="Panorama Xəbər"
        title="Admin panel"
        description="Xəbər portalını buradan idarə et — paylaş, izlə, yenilə."
      />

      {/* PAYLAŞIM DÜYMƏLƏRİ */}
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

      {/* STATİSTİKA */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        <StatCard title="Xəbərlər" value={stats.articles} description="Adi xəbərlər" loading={loadingStats} />
        <StatCard title="Videolar" value={stats.videos} description="Video xəbərlər" loading={loadingStats} />
        <StatCard title="Fotolar" value={stats.galleries} description="Foto qalereyalar" loading={loadingStats} />
        <StatCard title="Baxışlar" value={stats.views} description="Ümumi baxış" loading={loadingStats} accent />
      </div>

      {/* SON PAYLAŞIMLAR */}
      <div className="border" style={{ background: c.surface, borderColor: c.line }}>
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: c.line }}>
          <h2 className="font-[family-name:var(--font-display)] font-bold text-lg">
            Son paylaşımlar
          </h2>
          <button
            onClick={() => setActive('statistics')}
            className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.15em]"
            style={{ color: c.blue }}
          >
            Hamısına bax →
          </button>
        </div>

        {recent.length === 0 ? (
          <EmptyState text="Hələ paylaşım yoxdur. İlk xəbəri buradan paylaş." />
        ) : (
          recent.map((article) => (
            <div
              key={article.id}
              className="px-6 py-4 border-b last:border-b-0 flex items-center justify-between gap-4"
              style={{ borderColor: c.line }}
            >
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{article.title}</div>
                <div
                  className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider mt-1"
                  style={{ color: c.muted }}
                >
                  {article.video_url ? '🎥 Video' : '📰 Xəbər'}
                </div>
              </div>
              <div
                className="font-[family-name:var(--font-mono)] text-xs shrink-0"
                style={{ color: c.muted }}
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
   SHARED PRIMITIVES
========================================================= */

function PageHeading({ eyebrow, title, description }) {
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
        <p className="text-sm mt-2" style={{ color: c.muted }}>
          {description}
        </p>
      )}
    </div>
  );
}

function ActionCard({ icon, title, description, button, onClick }) {
  return (
    <div
      className="border p-6 transition-colors hover:border-[#12192B]"
      style={{ background: c.surface, borderColor: c.line }}
    >
      <div className="text-3xl mb-5">{icon}</div>
      <h2 className="font-[family-name:var(--font-display)] font-bold text-lg">{title}</h2>
      <p className="text-sm mt-1 mb-5" style={{ color: c.muted }}>
        {description}
      </p>
      <button
        onClick={onClick}
        className="w-full text-white py-3 text-sm font-semibold transition-colors"
        style={{ background: c.ink }}
        onMouseEnter={(e) => (e.currentTarget.style.background = c.inkSoft)}
        onMouseLeave={(e) => (e.currentTarget.style.background = c.ink)}
      >
        + {button}
      </button>
    </div>
  );
}

function StatCard({ title, value, description, loading, accent }) {
  return (
    <div
      className="border p-6 relative overflow-hidden"
      style={{ background: c.surface, borderColor: c.line }}
    >
      {accent && (
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: c.gold }} />
      )}
      <div
        className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.2em]"
        style={{ color: c.muted }}
      >
        {title}
      </div>
      <div className="font-[family-name:var(--font-display)] font-black text-4xl mt-3">
        {loading ? '—' : value.toLocaleString('az-AZ')}
      </div>
      <div className="text-xs mt-1" style={{ color: c.muted }}>
        {description}
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="p-10 text-center text-sm" style={{ color: c.muted }}>
      {text}
    </div>
  );
}

function Banner({ status, text }) {
  if (!text) return null;

  const styles = {
    success: { border: c.success, bg: '#EAF6EF', fg: '#1E5E3B', icon: '✓' },
    error: { border: c.danger, bg: '#FBEEEC', fg: '#8C3A2F', icon: '✕' },
  };
  const s = styles[status] || styles.error;

  return (
    <div
      className="mt-5 border-l-4 px-4 py-3 text-sm flex items-start gap-3"
      style={{ background: s.bg, borderColor: s.border, color: s.fg }}
    >
      <span className="font-bold">{s.icon}</span>
      <span>{text}</span>
    </div>
  );
}

function FormShell({ eyebrow, title, description, children, onSubmit }) {
  return (
    <div>
      <PageHeading eyebrow={eyebrow} title={title} description={description} />
      <form
        onSubmit={onSubmit}
        className="border p-6 md:p-8"
        style={{ background: c.surface, borderColor: c.line }}
      >
        {children}
      </form>
    </div>
  );
}

function FieldLabel({ children, required }) {
  return (
    <label
      className="block font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.15em] mb-2"
      style={{ color: c.muted }}
    >
      {children}
      {required && <span style={{ color: c.gold }}> *</span>}
    </label>
  );
}

const fieldClass =
  'w-full px-4 py-3 text-sm border outline-none transition-colors focus:border-[#12192B] bg-white';

function TextField({ label, value, onChange, placeholder, required, className = '' }) {
  return (
    <div className={`mb-5 ${className}`}>
      <FieldLabel required={required}>{label}</FieldLabel>
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

function TextAreaField({ label, value, onChange, placeholder, rows = 5, required, className = '' }) {
  return (
    <div className={`mb-5 ${className}`}>
      <FieldLabel required={required}>{label}</FieldLabel>
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

function SelectField({ label, value, onChange, options, className = '' }) {
  return (
    <div className={className}>
      <FieldLabel>{label}</FieldLabel>
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

function SubmitButton({ loading, children, loadingText }) {
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

function FileDropZone({ selected, onSelect, accept, multiple, icon, activeIcon, title, hint, minHeight = 190 }) {
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
        <div className="text-4xl mb-3">{selected ? activeIcon : icon}</div>
        <div className="font-semibold text-sm truncate max-w-[280px]">
          {selected || title}
        </div>
        <div className="text-xs mt-1" style={{ color: c.muted }}>
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

function CategorySelect({ value, onChange }) {
  return (
    <SelectField
      label="Kateqoriya"
      value={value}
      onChange={onChange}
      options={CATEGORIES.map((item) => (
        <option key={item.slug} value={item.slug}>
          {item.name || item.title || item.label || item.slug}
        </option>
      ))}
    />
  );
}

/* =========================================================
   XƏBƏR PAYLAŞ
========================================================= */

function NewsForm() {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORIES?.[0]?.slug || '');
  const [source, setSource] = useState('');
  const [image, setImage] = useState(null);
  const [featured, setFeatured] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { status, text }

  async function publishNews(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!title.trim()) throw new Error('Xəbər başlığı yazılmalıdır.');
      if (!content.trim()) throw new Error('Xəbər mətni yazılmalıdır.');

      let imageUrl = '';

      if (image) {
        const extension = image.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${extension}`;

        const { error } = await supabase.storage
          .from('news-images')
          .upload(fileName, image);
        if (error) throw error;

        const { data } = supabase.storage.from('news-images').getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      const slug = slugify(title) + '-' + Date.now();

      const { error } = await supabase.from('articles').insert({
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
      if (error) throw error;

      setTitle('');
      setExcerpt('');
      setContent('');
      setSource('');
      setImage(null);
      setFeatured(false);
      setMessage({ status: 'success', text: 'Xəbər uğurla yayımlandı.' });
    } catch (error) {
      console.error(error);
      setMessage({ status: 'error', text: error.message || 'Xəta baş verdi.' });
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
      <TextField label="Xəbər başlığı" value={title} onChange={setTitle} placeholder="Xəbərin başlığını yaz..." required />
      <TextAreaField label="Qısa açıqlama" value={excerpt} onChange={setExcerpt} placeholder="Xəbərin qısa açıqlaması..." rows={3} />
      <TextAreaField label="Xəbər mətni" value={content} onChange={setContent} placeholder="Xəbərin tam mətnini yaz..." rows={12} required />

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <CategorySelect value={category} onChange={setCategory} />
        <TextField label="Mənbə" value={source} onChange={setSource} placeholder="Məsələn: APA" />
      </div>

      <div className="mb-6">
        <FieldLabel>Əsas şəkil</FieldLabel>
        <FileDropZone
          selected={image?.name}
          onSelect={(e) => setImage(e.target.files?.[0] || null)}
          accept="image/*"
          icon="📷"
          activeIcon="🖼️"
          title="Şəkil seç"
          hint={image ? 'Başqa şəkil seçmək üçün kliklə' : 'Kompüterindən şəkil seç'}
        />
      </div>

      <label className="flex items-center gap-3 mb-2 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="w-4 h-4 accent-[#B8842A]"
        />
        <span className="text-sm font-medium">Bu xəbəri baş xəbər et</span>
      </label>

      <Banner status={message?.status} text={message?.text} />

      <div className="mt-6">
        <SubmitButton loading={loading} loadingText="Yüklənir...">
          📰 Xəbəri yayımla
        </SubmitButton>
      </div>
    </FormShell>
  );
}

/* =========================================================
   VİDEO PAYLAŞ
========================================================= */

function VideoForm() {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState(CATEGORIES?.[0]?.slug || '');
  const [source, setSource] = useState('');
  const [video, setVideo] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function publishVideo(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!title.trim()) throw new Error('Video başlığı yazılmalıdır.');
      if (!video) throw new Error('Video seçilməyib.');

      const extension = video.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from('news-videos')
        .upload(fileName, video);
      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('news-videos').getPublicUrl(fileName);
      const videoUrl = data.publicUrl;

      const slug = slugify(title) + '-' + Date.now();

      const { error } = await supabase.from('articles').insert({
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: excerpt.trim(),
        category,
        source: source.trim(),
        image_url: '',
        video_url: videoUrl,
        slug,
        is_featured: false,
        views: 0,
      });
      if (error) throw error;

      setTitle('');
      setExcerpt('');
      setSource('');
      setVideo(null);
      setMessage({ status: 'success', text: 'Video xəbər uğurla yayımlandı.' });
    } catch (error) {
      console.error(error);
      setMessage({ status: 'error', text: error.message || 'Video yüklənmədi.' });
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
      <TextField label="Video başlığı" value={title} onChange={setTitle} placeholder="Video xəbərin başlığı..." required />
      <TextAreaField label="Açıqlama" value={excerpt} onChange={setExcerpt} placeholder="Video haqqında qısa məlumat..." rows={4} />

      <div className="grid md:grid-cols-2 gap-5 mb-6">
        <CategorySelect value={category} onChange={setCategory} />
        <TextField label="Mənbə" value={source} onChange={setSource} placeholder="Mənbə" />
      </div>

      <div className="mb-6">
        <FieldLabel required>Video faylı</FieldLabel>
        <FileDropZone
          selected={video?.name}
          onSelect={(e) => setVideo(e.target.files?.[0] || null)}
          accept="video/*"
          icon="🎥"
          activeIcon="🎬"
          title="Video seç"
          hint={video ? 'Başqa video seçmək üçün kliklə' : 'MP4, MOV və digər video faylları'}
          minHeight={220}
        />
      </div>

      <Banner status={message?.status} text={message?.text} />

      <div className="mt-6">
        <SubmitButton loading={loading} loadingText="Video yüklənir...">
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
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES?.[0]?.slug || '');
  const [images, setImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  function selectImages(e) {
    setImages(Array.from(e.target.files || []));
  }

  function removeImage(index) {
    setImages(images.filter((_, i) => i !== index));
  }

  async function publishGallery(e) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!title.trim()) throw new Error('Qalereyanın başlığını yaz.');
      if (images.length === 0) throw new Error('Ən azı bir şəkil seç.');

      const uploadedImages = [];

      for (const image of images) {
        const extension = image.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${extension}`;

        const { error } = await supabase.storage
          .from('gallery-images')
          .upload(fileName, image);
        if (error) throw error;

        const { data } = supabase.storage.from('gallery-images').getPublicUrl(fileName);
        uploadedImages.push(data.publicUrl);
      }

      const { error } = await supabase.from('photo_galleries').insert({
        title: title.trim(),
        description: description.trim(),
        category,
        images: uploadedImages,
      });
      if (error) throw error;

      setTitle('');
      setDescription('');
      setImages([]);
      setMessage({ status: 'success', text: 'Foto qalereya uğurla yayımlandı.' });
    } catch (error) {
      console.error(error);
      setMessage({ status: 'error', text: error.message || 'Qalereya yaradılmadı.' });
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
      <TextField label="Qalereya başlığı" value={title} onChange={setTitle} placeholder="Məsələn: Bakıda möhtəşəm tədbir" required />
      <TextAreaField label="Açıqlama" value={description} onChange={setDescription} placeholder="Qalereya haqqında məlumat..." rows={4} />

      <div className="mb-6">
        <CategorySelect value={category} onChange={setCategory} />
      </div>

      <div className="mb-6">
        <FieldLabel required>Şəkillər</FieldLabel>
        <FileDropZone
          selected={images.length ? `${images.length} şəkil seçildi` : null}
          onSelect={selectImages}
          accept="image/*"
          multiple
          icon="📸"
          activeIcon="📸"
          title="Bir neçə şəkil seç"
          hint="Ctrl (və ya Cmd) düyməsi ilə bir neçə şəkil seçə bilərsən"
          minHeight={200}
        />
      </div>

      {images.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.15em]" style={{ color: c.muted }}>
              Seçilmiş şəkillər
            </div>
            <div className="text-xs" style={{ color: c.muted }}>
              {images.length} şəkil
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {images.map((image, index) => (
              <div
                key={`${image.name}-${index}`}
                className="relative border aspect-square overflow-hidden"
                style={{ borderColor: c.line, background: '#F0EFEA' }}
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
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

      <Banner status={message?.status} text={message?.text} />

      <div className="mt-6">
        <SubmitButton loading={loading || images.length === 0} loadingText="Şəkillər yüklənir...">
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
  const [position, setPosition] = useState('homepage');
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
      if (!title.trim()) throw new Error('Reklam adı yazılmalıdır.');

      let imageUrl = '';

      if (image) {
        const extension = image.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${extension}`;

        const { error } = await supabase.storage
          .from('advertisements')
          .upload(fileName, image);
        if (error) throw error;

        const { data } = supabase.storage.from('advertisements').getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      const { error } = await supabase.from('advertisements').insert({
        title: title.trim(),
        image_url: imageUrl,
        link_url: linkUrl.trim(),
        position,
        start_date: startDate || null,
        end_date: endDate || null,
        is_active: true,
      });
      if (error) throw error;

      setTitle('');
      setLinkUrl('');
      setStartDate('');
      setEndDate('');
      setImage(null);
      setMessage({ status: 'success', text: 'Reklam uğurla əlavə edildi.' });
    } catch (error) {
      console.error(error);
      setMessage({ status: 'error', text: error.message || 'Reklam əlavə olunmadı.' });
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
      <TextField label="Reklam adı" value={title} onChange={setTitle} placeholder="Reklamın adı..." required />
      <TextField label="Keçid linki" value={linkUrl} onChange={setLinkUrl} placeholder="https://..." />

      <div className="grid md:grid-cols-3 gap-5 mb-6">
        <SelectField
          label="Mövqe"
          value={position}
          onChange={setPosition}
          options={
            <>
              <option value="homepage">Əsas səhifə</option>
              <option value="both">Əsas səhifə + digər</option>
            </>
          }
        />

        <div>
          <FieldLabel>Başlama tarixi</FieldLabel>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={fieldClass}
            style={{ borderColor: c.line }}
          />
        </div>

        <div>
          <FieldLabel>Bitmə tarixi</FieldLabel>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={fieldClass}
            style={{ borderColor: c.line }}
          />
        </div>
      </div>

      <div className="mb-6">
        <FieldLabel>Reklam şəkli</FieldLabel>
        <FileDropZone
          selected={image?.name}
          onSelect={(e) => setImage(e.target.files?.[0] || null)}
          accept="image/*"
          icon="📢"
          activeIcon="🖼️"
          title="Reklam şəklini seç"
          hint=" "
          minHeight={180}
        />
      </div>

      <Banner status={message?.status} text={message?.text} />

      <div className="mt-6">
        <SubmitButton loading={loading} loadingText="Yüklənir...">
          📢 Reklamı əlavə et
        </SubmitButton>
      </div>
    </FormShell>
  );
}

/* =========================================================
   STATİSTİKA
========================================================= */

function Statistics() {
  const [articles, setArticles] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStatistics();
  }, []);

  async function loadStatistics() {
    setLoading(true);

    const { data: articleData } = await supabase
      .from('articles')
      .select('id,title,views,video_url,created_at')
      .order('created_at', { ascending: false });

    const { data: galleryData } = await supabase
      .from('photo_galleries')
      .select('id,title,created_at')
      .order('created_at', { ascending: false });

    setArticles(articleData || []);
    setGalleries(galleryData || []);
    setLoading(false);
  }

  const totalViews = articles.reduce((sum, item) => sum + Number(item.views || 0), 0);
  const videos = articles.filter((item) => item.video_url);
  const news = articles.filter((item) => !item.video_url);

  return (
    <FormShell
      eyebrow="Statistika deski · STA"
      title="Sayt statistikası"
      description="Panorama portalının ümumi göstəriciləri."
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard title="Xəbərlər" value={news.length} description="Adi xəbərlər" loading={loading} />
        <StatCard title="Videolar" value={videos.length} description="Video xəbərlər" loading={loading} />
        <StatCard title="Fotolar" value={galleries.length} description="Foto qalereyalar" loading={loading} />
        <StatCard title="Baxışlar" value={totalViews} description="Ümumi baxış" loading={loading} accent />
      </div>

      <div className="border" style={{ borderColor: c.line }}>
        <div className="px-6 py-4 border-b" style={{ borderColor: c.line }}>
          <h2 className="font-[family-name:var(--font-display)] font-bold">Son paylaşımlar</h2>
        </div>

        {articles.length === 0 ? (
          <EmptyState text="Hələ paylaşım yoxdur." />
        ) : (
          articles.slice(0, 10).map((article) => (
            <div
              key={article.id}
              className="px-6 py-4 border-b last:border-b-0 flex items-center justify-between gap-4"
              style={{ borderColor: c.line }}
            >
              <div className="min-w-0">
                <div className="text-sm font-semibold truncate">{article.title}</div>
                <div
                  className="font-[family-name:var(--font-mono)] text-[9px] uppercase tracking-wider mt-1"
                  style={{ color: c.muted }}
                >
                  {article.video_url ? '🎥 Video' : '📰 Xəbər'}
                </div>
              </div>
              <div className="font-[family-name:var(--font-mono)] text-xs shrink-0" style={{ color: c.muted }}>
                {article.views || 0} baxış
              </div>
            </div>
          ))
        )}
      </div>
    </FormShell>
  );
}

/* =========================================================
   SLUG
========================================================= */

function slugify(text) {
  const map = {
    ə: 'e', Ə: 'e',
    ı: 'i', İ: 'i',
    ö: 'o', Ö: 'o',
    ü: 'u', Ü: 'u',
    ş: 's', Ş: 's',
    ç: 'c', Ç: 'c',
    ğ: 'g', Ğ: 'g',
  };

  return text
    .split('')
    .map((char) => map[char] || char)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}