'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { CATEGORIES } from '@/lib/categories';

export default function AdminDashboard() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [active, setActive] = useState('dashboard');
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6f8]">
        <div className="text-sm text-gray-500">
          Admin panel yüklənir...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-[#172b4d]">

      {/* HEADER */}

      <header className="h-16 bg-[#172b4d] text-white flex items-center justify-between px-5 md:px-8">

        <div>
          <div className="font-black tracking-wide text-lg">
            PANORAMA
          </div>

          <div className="text-[9px] text-white/50 uppercase tracking-[0.2em]">
            Admin panel
          </div>
        </div>

        <div className="flex items-center gap-4">

          <div className="hidden md:block text-xs text-white/60">
            {user?.email}
          </div>

          <button
            onClick={logout}
            className="text-xs border border-white/20 px-4 py-2 hover:bg-white/10"
          >
            Çıxış
          </button>

        </div>

      </header>

      <div className="flex">

        {/* =====================================================
            SOL MENYU
        ===================================================== */}

        <aside className="w-64 min-h-[calc(100vh-64px)] bg-white border-r border-gray-200 p-4 hidden md:block">

          <div className="text-[9px] text-gray-400 uppercase tracking-[0.2em] px-3 mb-3">
            İdarəetmə
          </div>

          <SidebarButton
            active={active === 'dashboard'}
            onClick={() => setActive('dashboard')}
            icon="▦"
            text="Ümumi görünüş"
          />

          <SidebarButton
            active={active === 'news'}
            onClick={() => setActive('news')}
            icon="📰"
            text="Xəbər paylaş"
          />

          <SidebarButton
            active={active === 'video'}
            onClick={() => setActive('video')}
            icon="🎥"
            text="Video paylaş"
          />

          <SidebarButton
            active={active === 'gallery'}
            onClick={() => setActive('gallery')}
            icon="📸"
            text="Foto qalereya"
          />

          <SidebarButton
            active={active === 'ads'}
            onClick={() => setActive('ads')}
            icon="📢"
            text="Reklamlar"
          />

          <SidebarButton
            active={active === 'statistics'}
            onClick={() => setActive('statistics')}
            icon="📊"
            text="Statistika"
          />

          <div className="border-t border-gray-200 my-5" />

          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-3 text-sm text-gray-600 hover:bg-gray-50"
          >
            <span>🌐</span>
            Sayta bax
          </a>

        </aside>

        {/* =====================================================
            ƏSAS HİSSƏ
        ===================================================== */}

        <main className="flex-1 p-5 md:p-8 max-w-[1500px]">

          {active === 'dashboard' && (
            <DashboardHome setActive={setActive} />
          )}

          {active === 'news' && (
            <NewsForm />
          )}

          {active === 'video' && (
            <VideoForm />
          )}

          {active === 'gallery' && (
            <GalleryForm />
          )}

          {active === 'ads' && (
            <AdvertisementForm />
          )}

          {active === 'statistics' && (
            <Statistics />
          )}

        </main>

      </div>

    </div>
  );
}

/* =========================================================
   SIDEBAR BUTTON
========================================================= */

function SidebarButton({
  active,
  onClick,
  icon,
  text,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 text-sm text-left transition ${
        active
          ? 'bg-[#172b4d] text-white'
          : 'text-gray-600 hover:bg-gray-50'
      }`}
    >
      <span>{icon}</span>
      <span>{text}</span>
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

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {

    const { data: articles } = await supabase
      .from('articles')
      .select('id, video_url, views');

    const { data: galleries } = await supabase
      .from('photo_galleries')
      .select('id');

    const normalArticles =
      (articles || []).filter(
        (item) =>
          !item.video_url
      );

    const videos =
      (articles || []).filter(
        (item) =>
          item.video_url
      );

    const views =
      (articles || []).reduce(
        (total, item) =>
          total + Number(item.views || 0),
        0
      );

    setStats({
      articles: normalArticles.length,
      videos: videos.length,
      galleries: galleries?.length || 0,
      views,
    });
  }

  return (
    <div>

      <div className="mb-8">

        <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
          PANORAMA XƏBƏR
        </div>

        <h1 className="text-3xl md:text-4xl font-black">
          Admin panel
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          Xəbər portalını buradan idarə et.
        </p>

      </div>

      {/* PAYLAŞIM DÜYMƏLƏRİ */}

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

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

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <InfoCard
          title="Xəbərlər"
          value={stats.articles}
          description="Adi xəbərlər"
        />

        <InfoCard
          title="Videolar"
          value={stats.videos}
          description="Video xəbərlər"
        />

        <InfoCard
          title="Fotolar"
          value={stats.galleries}
          description="Foto qalereyalar"
        />

        <InfoCard
          title="Baxışlar"
          value={stats.views}
          description="Ümumi baxış"
        />

      </div>

    </div>
  );
}

/* =========================================================
   ACTION CARD
========================================================= */

function ActionCard({
  icon,
  title,
  description,
  button,
  onClick,
}) {
  return (
    <div className="bg-white border border-gray-200 p-6 hover:border-[#172b4d] transition">

      <div className="text-3xl mb-5">
        {icon}
      </div>

      <h2 className="font-bold text-lg">
        {title}
      </h2>

      <p className="text-sm text-gray-500 mt-1 mb-5">
        {description}
      </p>

      <button
        onClick={onClick}
        className="w-full bg-[#172b4d] text-white py-3 text-sm font-semibold hover:bg-[#1D4E89]"
      >
        + {button}
      </button>

    </div>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  title,
  value,
  description,
}) {
  return (
    <div className="bg-white border border-gray-200 p-6">

      <div className="text-xs text-gray-400 uppercase tracking-wider">
        {title}
      </div>

      <div className="text-3xl font-black mt-3">
        {value}
      </div>

      <div className="text-xs text-gray-500 mt-1">
        {description}
      </div>

    </div>
  );
}

/* =========================================================
   XƏBƏR PAYLAŞ
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
  const [message, setMessage] = useState('');

  async function publishNews(e) {

    e.preventDefault();

    setLoading(true);
    setMessage('');

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

      /* ŞƏKİL YÜKLƏ */

      if (image) {

        const extension =
          image.name
            .split('.')
            .pop();

        const fileName =
          `${crypto.randomUUID()}.${extension}`;

        const { error } =
          await supabase.storage
            .from('news-images')
            .upload(
              fileName,
              image
            );

        if (error) {
          throw error;
        }

        const { data } =
          supabase.storage
            .from('news-images')
            .getPublicUrl(
              fileName
            );

        imageUrl =
          data.publicUrl;
      }

      /* SLUG */

      const slug =
        slugify(title) +
        '-' +
        Date.now();

      /* DATABASE */

      const { error } =
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

      if (error) {
        throw error;
      }

      setTitle('');
      setExcerpt('');
      setContent('');
      setSource('');
      setImage(null);
      setFeatured(false);

      setMessage(
        '✅ Xəbər uğurla yayımlandı!'
      );

    } catch (error) {

      console.error(error);

      setMessage(
        '❌ ' +
        (error.message ||
          'Xəta baş verdi.')
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <FormLayout
      eyebrow="XƏBƏR İDARƏETMƏSİ"
      title="Yeni xəbər paylaş"
      description="Adi xəbəri saytında yayımla."
    >

      <form
        onSubmit={publishNews}
        className="bg-white border border-gray-200 p-6 md:p-8"
      >

        <Input
          label="Xəbər başlığı"
          value={title}
          onChange={setTitle}
          placeholder="Xəbərin başlığını yaz..."
          required
        />

        <Textarea
          label="Qısa açıqlama"
          value={excerpt}
          onChange={setExcerpt}
          placeholder="Xəbərin qısa açıqlaması..."
          rows={3}
        />

        <Textarea
          label="Xəbər mətni"
          value={content}
          onChange={setContent}
          placeholder="Xəbərin tam mətnini yaz..."
          rows={12}
          required
        />

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="label">
              Kateqoriya
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="input"
            >
              {CATEGORIES.map((item) => (
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
            </select>
          </div>

          <Input
            label="Mənbə"
            value={source}
            onChange={setSource}
            placeholder="Məsələn: APA"
          />

        </div>

        {/* ŞƏKİL */}

        <div className="mt-6">

          <label className="label">
            Əsas şəkil
          </label>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 min-h-[190px] cursor-pointer hover:border-[#172b4d] bg-gray-50">

            {image ? (
              <div className="text-center">

                <div className="text-4xl mb-3">
                  🖼️
                </div>

                <div className="font-semibold text-sm">
                  {image.name}
                </div>

                <div className="text-xs text-gray-400 mt-1">
                  Başqa şəkil seçmək üçün kliklə
                </div>

              </div>
            ) : (
              <>
                <div className="text-4xl mb-3">
                  📷
                </div>

                <div className="font-semibold text-sm">
                  Şəkil seç
                </div>

                <div className="text-xs text-gray-400 mt-1">
                  Kompüterindən şəkil seç
                </div>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setImage(
                  e.target.files?.[0] ||
                  null
                )
              }
            />

          </label>

        </div>

        {/* BAŞ XƏBƏR */}

        <label className="flex items-center gap-3 mt-6 cursor-pointer">

          <input
            type="checkbox"
            checked={featured}
            onChange={(e) =>
              setFeatured(
                e.target.checked
              )
            }
            className="w-4 h-4"
          />

          <span className="text-sm font-medium">
            Bu xəbəri baş xəbər et
          </span>

        </label>

        {message && (
          <Message text={message} />
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full md:w-auto bg-[#172b4d] text-white px-8 py-3 font-semibold text-sm hover:bg-[#1D4E89] disabled:opacity-50"
        >
          {loading
            ? 'Yüklənir...'
            : '📰 Xəbəri yayımla'}
        </button>

      </form>

    </FormLayout>
  );
}

/* =========================================================
   VİDEO PAYLAŞ
========================================================= */

function VideoForm() {

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState(
    CATEGORIES?.[0]?.slug || ''
  );
  const [source, setSource] = useState('');
  const [video, setVideo] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function publishVideo(e) {

    e.preventDefault();

    setLoading(true);
    setMessage('');

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

      const extension =
        video.name
          .split('.')
          .pop();

      const fileName =
        `${crypto.randomUUID()}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from('news-videos')
          .upload(
            fileName,
            video
          );

      if (uploadError) {
        throw uploadError;
      }

      const { data } =
        supabase.storage
          .from('news-videos')
          .getPublicUrl(
            fileName
          );

      const videoUrl =
        data.publicUrl;

      const slug =
        slugify(title) +
        '-' +
        Date.now();

      const { error } =
        await supabase
          .from('articles')
          .insert({
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

      if (error) {
        throw error;
      }

      setTitle('');
      setExcerpt('');
      setSource('');
      setVideo(null);

      setMessage(
        '✅ Video xəbər uğurla yayımlandı!'
      );

    } catch (error) {

      console.error(error);

      setMessage(
        '❌ ' +
        (error.message ||
          'Video yüklənmədi.')
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <FormLayout
      eyebrow="VİDEO XƏBƏRLƏR"
      title="Video paylaş"
      description="Kompüterindən video seç və saytında yayımla."
    >

      <form
        onSubmit={publishVideo}
        className="bg-white border border-gray-200 p-6 md:p-8"
      >

        <Input
          label="Video başlığı"
          value={title}
          onChange={setTitle}
          placeholder="Video xəbərin başlığı..."
          required
        />

        <Textarea
          label="Açıqlama"
          value={excerpt}
          onChange={setExcerpt}
          placeholder="Video haqqında qısa məlumat..."
          rows={4}
        />

        <div className="grid md:grid-cols-2 gap-5">

          <div>
            <label className="label">
              Kateqoriya
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="input"
            >
              {CATEGORIES.map((item) => (
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
            </select>
          </div>

          <Input
            label="Mənbə"
            value={source}
            onChange={setSource}
            placeholder="Mənbə"
          />

        </div>

        {/* VIDEO */}

        <div className="mt-6">

          <label className="label">
            Video faylı
          </label>

          <label className="flex flex-col items-center justify-center min-h-[220px] border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:border-[#172b4d]">

            {video ? (
              <div className="text-center">

                <div className="text-5xl mb-3">
                  🎬
                </div>

                <div className="font-semibold text-sm">
                  {video.name}
                </div>

                <div className="text-xs text-gray-400 mt-2">
                  Başqa video seçmək üçün kliklə
                </div>

              </div>
            ) : (
              <>
                <div className="text-5xl mb-3">
                  🎥
                </div>

                <div className="font-semibold">
                  Video seç
                </div>

                <div className="text-xs text-gray-400 mt-2">
                  MP4, MOV və digər video faylları
                </div>
              </>
            )}

            <input
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) =>
                setVideo(
                  e.target.files?.[0] ||
                  null
                )
              }
            />

          </label>

        </div>

        {message && (
          <Message text={message} />
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full md:w-auto bg-[#172b4d] text-white px-8 py-3 font-semibold text-sm hover:bg-[#1D4E89] disabled:opacity-50"
        >
          {loading
            ? 'Video yüklənir...'
            : '🎥 Videonu yayımla'}
        </button>

      </form>

    </FormLayout>
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
    useState(
      CATEGORIES?.[0]?.slug || ''
    );

  const [images, setImages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState('');

  function selectImages(e) {

    const selected =
      Array.from(
        e.target.files || []
      );

    setImages(selected);
  }

  function removeImage(index) {

    setImages(
      images.filter(
        (_, i) => i !== index
      )
    );
  }

  async function publishGallery(e) {

    e.preventDefault();

    setLoading(true);
    setMessage('');

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

      /* BÜTÜN ŞƏKİLLƏRİ YÜKLƏ */

      for (const image of images) {

        const extension =
          image.name
            .split('.')
            .pop();

        const fileName =
          `${crypto.randomUUID()}.${extension}`;

        const { error } =
          await supabase.storage
            .from('gallery-images')
            .upload(
              fileName,
              image
            );

        if (error) {
          throw error;
        }

        const { data } =
          supabase.storage
            .from('gallery-images')
            .getPublicUrl(
              fileName
            );

        uploadedImages.push(
          data.publicUrl
        );
      }

      /* DATABASE */

      const { error } =
        await supabase
          .from('photo_galleries')
          .insert({
            title: title.trim(),
            description:
              description.trim(),
            category,
            images: uploadedImages,
          });

      if (error) {
        throw error;
      }

      setTitle('');
      setDescription('');
      setImages([]);

      setMessage(
        '✅ Foto qalereya uğurla yayımlandı!'
      );

    } catch (error) {

      console.error(error);

      setMessage(
        '❌ ' +
        (error.message ||
          'Qalereya yaradılmadı.')
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <FormLayout
      eyebrow="FOTO XƏBƏRLƏR"
      title="Foto qalereya paylaş"
      description="Bir xəbərə bir neçə şəkil əlavə et."
    >

      <form
        onSubmit={publishGallery}
        className="bg-white border border-gray-200 p-6 md:p-8"
      >

        <Input
          label="Qalereya başlığı"
          value={title}
          onChange={setTitle}
          placeholder="Məsələn: Bakıda möhtəşəm tədbir"
          required
        />

        <Textarea
          label="Açıqlama"
          value={description}
          onChange={setDescription}
          placeholder="Qalereya haqqında məlumat..."
          rows={4}
        />

        <div className="mt-5">

          <label className="label">
            Kateqoriya
          </label>

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
            className="input"
          >
            {CATEGORIES.map((item) => (
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
          </select>

        </div>

        {/* ÇOXLU ŞƏKİL */}

        <div className="mt-6">

          <label className="label">
            Şəkillər
          </label>

          <label className="flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:border-[#172b4d]">

            <div className="text-5xl mb-3">
              📸
            </div>

            <div className="font-semibold">
              Bir neçə şəkil seç
            </div>

            <div className="text-xs text-gray-400 mt-2">
              Ctrl düyməsi ilə bir neçə şəkil seçə bilərsən
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={selectImages}
            />

          </label>

        </div>

        {/* ŞƏKİLLƏRİN PREVIEW-İ */}

        {images.length > 0 && (

          <div className="mt-6">

            <div className="flex items-center justify-between mb-3">

              <div className="font-bold text-sm">
                Seçilmiş şəkillər
              </div>

              <div className="text-xs text-gray-400">
                {images.length} şəkil
              </div>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">

              {images.map(
                (image, index) => (

                  <div
                    key={`${image.name}-${index}`}
                    className="relative border border-gray-200 bg-gray-100 aspect-square overflow-hidden"
                  >

                    <img
                      src={URL.createObjectURL(
                        image
                      )}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        removeImage(index)
                      }
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 text-white text-xs"
                    >
                      ✕
                    </button>

                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-2 py-1 truncate">
                      {index + 1}. {image.name}
                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        )}

        {message && (
          <Message text={message} />
        )}

        <button
          type="submit"
          disabled={
            loading ||
            images.length === 0
          }
          className="mt-6 w-full md:w-auto bg-[#172b4d] text-white px-8 py-3 font-semibold text-sm hover:bg-[#1D4E89] disabled:opacity-50"
        >
          {loading
            ? 'Şəkillər yüklənir...'
            : '📸 Qalereyanı yayımla'}
        </button>

      </form>

    </FormLayout>
  );
}

/* =========================================================
   REKLAM
========================================================= */

function AdvertisementForm() {

  const [title, setTitle] =
    useState('');

  const [linkUrl, setLinkUrl] =
    useState('');

  const [position, setPosition] =
    useState('homepage');

  const [startDate, setStartDate] =
    useState('');

  const [endDate, setEndDate] =
    useState('');

  const [image, setImage] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState('');

  async function publishAdvertisement(e) {

    e.preventDefault();

    setLoading(true);
    setMessage('');

    try {

      if (!title.trim()) {
        throw new Error(
          'Reklam adı yazılmalıdır.'
        );
      }

      let imageUrl = '';

      if (image) {

        const extension =
          image.name
            .split('.')
            .pop();

        const fileName =
          `${crypto.randomUUID()}.${extension}`;

        const { error } =
          await supabase.storage
            .from('advertisements')
            .upload(
              fileName,
              image
            );

        if (error) {
          throw error;
        }

        const { data } =
          supabase.storage
            .from('advertisements')
            .getPublicUrl(
              fileName
            );

        imageUrl =
          data.publicUrl;
      }

      const { error } =
        await supabase
          .from('advertisements')
          .insert({
            title: title.trim(),
            image_url: imageUrl,
            link_url: linkUrl.trim(),
            position,
            start_date:
              startDate || null,
            end_date:
              endDate || null,
            is_active: true,
          });

      if (error) {
        throw error;
      }

      setTitle('');
      setLinkUrl('');
      setStartDate('');
      setEndDate('');
      setImage(null);

      setMessage(
        '✅ Reklam uğurla əlavə edildi!'
      );

    } catch (error) {

      console.error(error);

      setMessage(
        '❌ ' +
        (error.message ||
          'Reklam əlavə olunmadı.')
      );

    } finally {
      setLoading(false);
    }
  }

  return (
    <FormLayout
      eyebrow="REKLAM İDARƏETMƏSİ"
      title="Yeni reklam"
      description="Saytda göstəriləcək reklamı əlavə et."
    >

      <form
        onSubmit={publishAdvertisement}
        className="bg-white border border-gray-200 p-6 md:p-8"
      >

        <Input
          label="Reklam adı"
          value={title}
          onChange={setTitle}
          placeholder="Reklamın adı..."
          required
        />

        <Input
          label="Keçid linki"
          value={linkUrl}
          onChange={setLinkUrl}
          placeholder="https://..."
        />

        <div className="grid md:grid-cols-3 gap-5 mt-5">

          <div>
            <label className="label">
              Mövqe
            </label>

            <select
              value={position}
              onChange={(e) =>
                setPosition(
                  e.target.value
                )
              }
              className="input"
            >
              <option value="homepage">
                Əsas səhifə
              </option>

              <option value="both">
                Əsas səhifə + digər
              </option>
            </select>
          </div>

          <div>
            <label className="label">
              Başlama tarixi
            </label>

            <input
              type="datetime-local"
              value={startDate}
              onChange={(e) =>
                setStartDate(
                  e.target.value
                )
              }
              className="input"
            />
          </div>

          <div>
            <label className="label">
              Bitmə tarixi
            </label>

            <input
              type="datetime-local"
              value={endDate}
              onChange={(e) =>
                setEndDate(
                  e.target.value
                )
              }
              className="input"
            />
          </div>

        </div>

        <div className="mt-6">

          <label className="label">
            Reklam şəkli
          </label>

          <label className="flex flex-col items-center justify-center min-h-[180px] border-2 border-dashed border-gray-300 bg-gray-50 cursor-pointer hover:border-[#172b4d]">

            {image ? (
              <div className="text-center">
                <div className="text-4xl">
                  🖼️
                </div>

                <div className="text-sm font-semibold mt-2">
                  {image.name}
                </div>
              </div>
            ) : (
              <>
                <div className="text-4xl">
                  📢
                </div>

                <div className="text-sm font-semibold mt-2">
                  Reklam şəklini seç
                </div>
              </>
            )}

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setImage(
                  e.target.files?.[0] ||
                  null
                )
              }
            />

          </label>

        </div>

        {message && (
          <Message text={message} />
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 bg-[#172b4d] text-white px-8 py-3 text-sm font-semibold hover:bg-[#1D4E89] disabled:opacity-50"
        >
          {loading
            ? 'Yüklənir...'
            : '📢 Reklamı əlavə et'}
        </button>

      </form>

    </FormLayout>
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

  useEffect(() => {
    loadStatistics();
  }, []);

  async function loadStatistics() {

    const { data: articleData } =
      await supabase
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

    const { data: galleryData } =
      await supabase
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
  }

  const totalViews =
    articles.reduce(
      (sum, item) =>
        sum + Number(
          item.views || 0
        ),
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
    <FormLayout
      eyebrow="STATİSTİKA"
      title="Sayt statistikası"
      description="Panorama portalının ümumi göstəriciləri."
    >

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">

        <InfoCard
          title="Xəbərlər"
          value={news.length}
          description="Adi xəbərlər"
        />

        <InfoCard
          title="Videolar"
          value={videos.length}
          description="Video xəbərlər"
        />

        <InfoCard
          title="Fotolar"
          value={galleries.length}
          description="Foto qalereyalar"
        />

        <InfoCard
          title="Baxışlar"
          value={totalViews}
          description="Ümumi baxış"
        />

      </div>

      <div className="mt-8 bg-white border border-gray-200">

        <div className="px-6 py-5 border-b border-gray-200">

          <h2 className="font-bold">
            Son paylaşımlar
          </h2>

        </div>

        <div>

          {articles.slice(0, 10).map(
            (article) => (

              <div
                key={article.id}
                className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4"
              >

                <div className="min-w-0">

                  <div className="text-sm font-semibold truncate">
                    {article.title}
                  </div>

                  <div className="text-[10px] text-gray-400 mt-1">
                    {article.video_url
                      ? '🎥 Video'
                      : '📰 Xəbər'}
                  </div>

                </div>

                <div className="text-xs text-gray-400">
                  {article.views || 0} baxış
                </div>

              </div>

            )
          )}

          {articles.length === 0 && (
            <div className="p-8 text-center text-sm text-gray-400">
              Hələ paylaşım yoxdur.
            </div>
          )}

        </div>

      </div>

    </FormLayout>
  );
}

/* =========================================================
   FORM LAYOUT
========================================================= */

function FormLayout({
  eyebrow,
  title,
  description,
  children,
}) {
  return (
    <div>

      <div className="mb-7">

        <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2">
          {eyebrow}
        </div>

        <h1 className="text-3xl md:text-4xl font-black">
          {title}
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          {description}
        </p>

      </div>

      {children}

    </div>
  );
}

/* =========================================================
   INPUT
========================================================= */

function Input({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div className="mb-5">

      <label className="label">
        {label}
      </label>

      <input
        type="text"
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="input"
      />

    </div>
  );
}

/* =========================================================
   TEXTAREA
========================================================= */

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  required = false,
}) {
  return (
    <div className="mb-5">

      <label className="label">
        {label}
      </label>

      <textarea
        value={value}
        required={required}
        placeholder={placeholder}
        rows={rows}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="input resize-y"
      />

    </div>
  );
}

/* =========================================================
   MESSAGE
========================================================= */

function Message({ text }) {
  return (
    <div className="mt-5 border border-gray-200 bg-gray-50 px-4 py-3 text-sm">
      {text}
    </div>
  );
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