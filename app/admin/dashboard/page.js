'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { CATEGORIES, slugify } from '@/lib/categories';

const emptyForm = {
  id: null,
  title: '',
  excerpt: '',
  content: '',
  category: CATEGORIES[0].slug,
  source: '',
  image_url: '',
  image_urls: [],
  video_url: '',
  is_featured: false,
  is_breaking: false,
};

const emptyAdForm = {
  id: null,
  title: '',
  description: '',
  image_url: '',
  link_url: '',
  advertiser_name: '',
  position: 'homepage',
  start_date: '',
  end_date: '',
  is_active: true,
};

export default function AdminDashboard() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [checking, setChecking] = useState(true);

  const [activeSection, setActiveSection] = useState('articles');

  const [articles, setArticles] = useState([]);
  const [advertisements, setAdvertisements] = useState([]);

  const [form, setForm] = useState(emptyForm);
  const [adForm, setAdForm] = useState(emptyAdForm);

  const [uploading, setUploading] = useState(false);
  const [videoUploading, setVideoUploading] = useState(false);
  const [adUploading, setAdUploading] = useState(false);

  const [saving, setSaving] = useState(false);
  const [adSaving, setAdSaving] = useState(false);

  const [message, setMessage] = useState('');

  /* =========================
     XƏBƏRLƏRİ YÜKLƏ
  ========================= */

  const loadArticles = useCallback(async () => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      setMessage(
        'Xəbərlər yüklənərkən xəta: ' + error.message
      );
      return;
    }

    setArticles(data || []);
  }, []);

  /* =========================
     REKLAMLARI YÜKLƏ
  ========================= */

  const loadAdvertisements = useCallback(async () => {
    const { data, error } = await supabase
      .from('advertisements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
      setMessage(
        'Reklamlar yüklənərkən xəta: ' + error.message
      );
      return;
    }

    setAdvertisements(data || []);
  }, []);

  /* =========================
     LOGIN
  ========================= */

  useEffect(() => {
    let mounted = true;

    async function checkUser() {
      try {
        const { data, error } =
          await supabase.auth.getSession();

        if (error || !data?.session) {
          if (mounted) {
            setChecking(false);
            router.replace('/admin');
          }
          return;
        }

        if (mounted) {
          setSession(data.session);
          setChecking(false);
        }
      } catch (error) {
        console.error(error);

        if (mounted) {
          setChecking(false);
          router.replace('/admin');
        }
      }
    }

    checkUser();

    return () => {
      mounted = false;
    };
  }, [router]);

  /* =========================
     DATA
  ========================= */

  useEffect(() => {
    if (session) {
      loadArticles();
      loadAdvertisements();
    }
  }, [
    session,
    loadArticles,
    loadAdvertisements,
  ]);

  /* =========================
     LOGOUT
  ========================= */

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/admin');
  }

  /* =========================
     ŞƏKİLLƏRİ YÜKLƏ
  ========================= */

  async function handleImageUpload(e) {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    setUploading(true);
    setMessage('');

    const uploadedUrls = [];

    for (const file of files) {
      const safeName = file.name
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9._-]/g, '');

      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}-${safeName}`;

      const { error } = await supabase.storage
        .from('xeber-sekiller')
        .upload(fileName, file);

      if (error) {
        setMessage(
          'Şəkil yüklənərkən xəta: ' +
            error.message
        );

        setUploading(false);
        return;
      }

      const { data } = supabase.storage
        .from('xeber-sekiller')
        .getPublicUrl(fileName);

      if (data?.publicUrl) {
        uploadedUrls.push(data.publicUrl);
      }
    }

    setForm((current) => ({
      ...current,

      image_urls: [
        ...current.image_urls,
        ...uploadedUrls,
      ],

      image_url:
        current.image_url ||
        uploadedUrls[0] ||
        '',
    }));

    setUploading(false);

    setMessage(
      `✅ ${uploadedUrls.length} şəkil yükləndi.`
    );

    e.target.value = '';
  }

  /* =========================
     ŞƏKİL SİL
  ========================= */

  function removeImage(index) {
    setForm((current) => {
      const newImages =
        current.image_urls.filter(
          (_, i) => i !== index
        );

      return {
        ...current,
        image_urls: newImages,
        image_url: newImages[0] || '',
      };
    });
  }

  /* =========================
     ŞƏKİLİ YUXARI QALDIR
  ========================= */

  function moveImageUp(index) {
    if (index === 0) return;

    setForm((current) => {
      const images = [...current.image_urls];

      [images[index - 1], images[index]] = [
        images[index],
        images[index - 1],
      ];

      return {
        ...current,
        image_urls: images,
        image_url: images[0] || '',
      };
    });
  }

  /* =========================
     ŞƏKİLİ AŞAĞI SAL
  ========================= */

  function moveImageDown(index) {
    setForm((current) => {
      const images = [...current.image_urls];

      if (index >= images.length - 1) {
        return current;
      }

      [images[index], images[index + 1]] = [
        images[index + 1],
        images[index],
      ];

      return {
        ...current,
        image_urls: images,
        image_url: images[0] || '',
      };
    });
  }

  /* =========================
     VİDEO
  ========================= */

  async function handleVideoUpload(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setMessage(
        '❌ Zəhmət olmasa video faylı seç.'
      );
      e.target.value = '';
      return;
    }

    setVideoUploading(true);
    setMessage('');

    const extension =
      file.name.split('.').pop() || 'mp4';

    const safeName = file.name
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9._-]/g, '');

    const fileName =
      `video-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}-${safeName ||
        `video.${extension}`}`;

    const { error } = await supabase.storage
      .from('xeber-videolar')
      .upload(fileName, file);

    if (error) {
      console.error(error);

      setMessage(
        '❌ Video yüklənərkən xəta: ' +
          error.message
      );

      setVideoUploading(false);
      e.target.value = '';
      return;
    }

    const { data } = supabase.storage
      .from('xeber-videolar')
      .getPublicUrl(fileName);

    if (!data?.publicUrl) {
      setMessage(
        '❌ Videonun linki yaradıla bilmədi.'
      );

      setVideoUploading(false);
      return;
    }

    setForm((current) => ({
      ...current,
      video_url: data.publicUrl,
    }));

    setVideoUploading(false);

    setMessage('✅ Video uğurla yükləndi.');

    e.target.value = '';
  }

  /* =========================
     VİDEO SİL
  ========================= */

  function removeVideo() {
    setForm((current) => ({
      ...current,
      video_url: '',
    }));

    setMessage('');
  }

  /* =========================
     XƏBƏR SAXLA
  ========================= */

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.title.trim()) {
      setMessage('Başlıq yaz.');
      return;
    }

    if (!form.content.trim()) {
      setMessage('Xəbər mətnini yaz.');
      return;
    }

    setSaving(true);
    setMessage('');

    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      category: form.category,
      source: form.source,

      image_url:
        form.image_urls[0] || '',

      image_urls:
        form.image_urls,

      video_url:
        form.video_url || '',

      is_featured:
        form.is_featured,

      is_breaking:
        form.is_breaking,
    };

    let error = null;

    if (form.id) {
      const result = await supabase
        .from('articles')
        .update(payload)
        .eq('id', form.id);

      error = result.error;
    } else {
      payload.slug = slugify(form.title);

      const result = await supabase
        .from('articles')
        .insert(payload);

      error = result.error;
    }

    setSaving(false);

    if (error) {
      console.error(error);

      setMessage(
        'Xəta: ' + error.message
      );

      return;
    }

    setMessage(
      form.id
        ? '✅ Xəbər yeniləndi.'
        : '✅ Xəbər əlavə edildi.'
    );

    setForm(emptyForm);

    await loadArticles();
  }

  /* =========================
     XƏBƏR REDAKTƏ
  ========================= */

  function handleEdit(article) {
    let images = [];

    if (Array.isArray(article.image_urls)) {
      images = article.image_urls;
    } else if (article.image_url) {
      images = [article.image_url];
    }

    setForm({
      id: article.id,
      title: article.title || '',
      excerpt: article.excerpt || '',
      content: article.content || '',

      category:
        article.category ||
        CATEGORIES[0].slug,

      source:
        article.source || '',

      image_url:
        images[0] || '',

      image_urls:
        images,

      video_url:
        article.video_url || '',

      is_featured:
        !!article.is_featured,

      is_breaking:
        !!article.is_breaking,
    });

    setActiveSection('articles');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  /* =========================
     XƏBƏR SİL
  ========================= */

  async function handleDelete(id) {
    if (
      !confirm(
        'Bu xəbəri silmək istədiyinə əminsən?'
      )
    ) {
      return;
    }

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage(
        'Xəta: ' + error.message
      );
      return;
    }

    await loadArticles();
  }

  /* =========================
     BAŞ XƏBƏR
  ========================= */

  async function toggleFeatured(article) {
    const { error } = await supabase
      .from('articles')
      .update({
        is_featured:
          !article.is_featured,
      })
      .eq('id', article.id);

    if (error) {
      setMessage(
        'Xəta: ' + error.message
      );
      return;
    }

    await loadArticles();
  }

  /* =========================
     TƏCİLİ XƏBƏR
  ========================= */

  async function toggleBreaking(article) {
    const { error } = await supabase
      .from('articles')
      .update({
        is_breaking:
          !article.is_breaking,
      })
      .eq('id', article.id);

    if (error) {
      setMessage(
        'Xəta: ' + error.message
      );
      return;
    }

    await loadArticles();
  }

  /* =========================
     REKLAM ŞƏKLİ
  ========================= */

  async function handleAdImageUpload(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setAdUploading(true);
    setMessage('');

    const safeName = file.name
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9._-]/g, '');

    const fileName =
      `reklam-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}-${safeName}`;

    const { error } = await supabase.storage
      .from('xeber-sekiller')
      .upload(fileName, file);

    if (error) {
      setMessage(
        'Reklam şəkli yüklənərkən xəta: ' +
          error.message
      );

      setAdUploading(false);
      return;
    }

    const { data } = supabase.storage
      .from('xeber-sekiller')
      .getPublicUrl(fileName);

    setAdForm((current) => ({
      ...current,
      image_url:
        data.publicUrl,
    }));

    setAdUploading(false);

    setMessage(
      '✅ Reklam şəkli yükləndi.'
    );

    e.target.value = '';
  }

  /* =========================
     REKLAM SAXLA
  ========================= */

  async function handleAdSubmit(e) {
    e.preventDefault();

    if (!adForm.title.trim()) {
      setMessage(
        'Reklam başlığı yaz.'
      );
      return;
    }

    setAdSaving(true);
    setMessage('');

    const payload = {
      title: adForm.title,

      description:
        adForm.description || null,

      image_url:
        adForm.image_url || null,

      link_url:
        adForm.link_url || null,

      advertiser_name:
        adForm.advertiser_name || null,

      position:
        adForm.position || 'homepage',

      start_date:
        adForm.start_date
          ? new Date(
              adForm.start_date
            ).toISOString()
          : null,

      end_date:
        adForm.end_date
          ? new Date(
              adForm.end_date
            ).toISOString()
          : null,

      is_active:
        adForm.is_active,
    };

    let error = null;

    if (adForm.id) {
      const result = await supabase
        .from('advertisements')
        .update(payload)
        .eq('id', adForm.id);

      error = result.error;
    } else {
      const result = await supabase
        .from('advertisements')
        .insert(payload);

      error = result.error;
    }

    setAdSaving(false);

    if (error) {
      console.error(error);

      setMessage(
        'Reklamda xəta: ' +
          error.message
      );

      return;
    }

    setMessage(
      adForm.id
        ? '✅ Reklam yeniləndi.'
        : '✅ Reklam əlavə edildi.'
    );

    setAdForm(emptyAdForm);

    await loadAdvertisements();
  }

  /* =========================
     REKLAM REDAKTƏ
  ========================= */

  function handleAdEdit(ad) {
    function formatDateForInput(date) {
      if (!date) return '';

      const d = new Date(date);

      if (Number.isNaN(d.getTime())) {
        return '';
      }

      const offset =
        d.getTimezoneOffset();

      const localDate =
        new Date(
          d.getTime() -
            offset * 60 * 1000
        );

      return localDate
        .toISOString()
        .slice(0, 16);
    }

    setAdForm({
      id: ad.id,
      title: ad.title || '',
      description: ad.description || '',
      image_url: ad.image_url || '',
      link_url: ad.link_url || '',
      advertiser_name:
        ad.advertiser_name || '',

      position:
        ad.position || 'homepage',

      start_date:
        formatDateForInput(
          ad.start_date
        ),

      end_date:
        formatDateForInput(
          ad.end_date
        ),

      is_active:
        !!ad.is_active,
    });

    setActiveSection('ads');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  /* =========================
     REKLAM SİL
  ========================= */

  async function handleAdDelete(id) {
    if (
      !confirm(
        'Bu reklamı silmək istədiyinə əminsən?'
      )
    ) {
      return;
    }

    const { error } = await supabase
      .from('advertisements')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage(
        'Xəta: ' + error.message
      );
      return;
    }

    setMessage(
      '✅ Reklam silindi.'
    );

    await loadAdvertisements();
  }

  /* =========================
     REKLAM AKTİV / DEAKTİV
  ========================= */

  async function toggleAdvertisement(ad) {
    const { error } = await supabase
      .from('advertisements')
      .update({
        is_active:
          !ad.is_active,
      })
      .eq('id', ad.id);

    if (error) {
      setMessage(
        'Xəta: ' + error.message
      );
      return;
    }

    await loadAdvertisements();
  }

  /* =========================
     LOADING
  ========================= */

  if (checking) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="font-serif text-xl font-semibold mb-2">
          Admin panel
        </div>

        <p className="text-sm text-gray-500">
          Yüklənir...
        </p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

      {/* =========================
          BAŞLIQ
      ========================= */}

      <div className="flex items-center justify-between mb-8">

        <div>
          <p className="text-xs uppercase tracking-widest text-blue font-semibold mb-1">
            PANORAMA XƏBƏR
          </p>

          <h1 className="font-serif text-2xl font-bold">
            Admin panel
          </h1>
        </div>

        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-crimson"
        >
          Çıxış et
        </button>

      </div>

      {/* =========================
          BÖLMƏLƏR
      ========================= */}

      <div className="flex flex-wrap gap-2 mb-8">

        <button
          type="button"
          onClick={() => {
            setActiveSection('articles');
            setMessage('');
          }}
          className={
            activeSection === 'articles'
              ? 'bg-ink text-white px-5 py-2 rounded-sm text-sm font-semibold'
              : 'border border-line px-5 py-2 rounded-sm text-sm font-semibold hover:bg-gray-50'
          }
        >
          📰 Xəbərlər
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveSection('ads');
            setMessage('');
          }}
          className={
            activeSection === 'ads'
              ? 'bg-ink text-white px-5 py-2 rounded-sm text-sm font-semibold'
              : 'border border-line px-5 py-2 rounded-sm text-sm font-semibold hover:bg-gray-50'
          }
        >
          📢 Reklamlar
        </button>

      </div>

      {/* =========================
          MESAJ
      ========================= */}

      {message && (
        <div className="mb-6 border border-line bg-panel px-4 py-3 text-sm">
          {message}
        </div>
      )}

      {/* =====================================================
          XƏBƏRLƏR
      ===================================================== */}

      {activeSection === 'articles' && (
        <>
          <form
            onSubmit={handleSubmit}
            className="bg-panel border border-line p-5 sm:p-6 mb-10 flex flex-col gap-4"
          >

            <h2 className="font-serif text-lg font-semibold">
              {form.id
                ? '✏️ Xəbəri redaktə et'
                : '➕ Yeni xəbər əlavə et'}
            </h2>

            {/* BAŞLIQ */}

            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                📝 Başlıq
              </label>

              <input
                required
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
                className="w-full border border-line rounded-sm px-3 py-2 text-sm bg-white"
              />
            </div>

            {/* QISA TƏSVİR */}

            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                Qısa təsvir
              </label>

              <input
                value={form.excerpt}
                onChange={(e) =>
                  setForm({
                    ...form,
                    excerpt: e.target.value,
                  })
                }
                className="w-full border border-line rounded-sm px-3 py-2 text-sm bg-white"
              />
            </div>

            {/* XƏBƏR MƏTNİ */}

            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                📄 Xəbər mətni
              </label>

              <textarea
                required
                rows={8}
                value={form.content}
                onChange={(e) =>
                  setForm({
                    ...form,
                    content: e.target.value,
                  })
                }
                className="w-full border border-line rounded-sm px-3 py-2 text-sm bg-white"
              />
            </div>

            {/* KATEQORİYA + MƏNBƏ */}

            <div className="grid sm:grid-cols-2 gap-4">

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">
                  📂 Kateqoriya
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                  className="w-full border border-line rounded-sm px-3 py-2 text-sm bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option
                      key={c.slug}
                      value={c.slug}
                    >
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">
                  📰 Mənbə
                </label>

                <input
                  value={form.source}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      source: e.target.value,
                    })
                  }
                  placeholder="məs. APA.AZ"
                  className="w-full border border-line rounded-sm px-3 py-2 text-sm bg-white"
                />
              </div>

            </div>

            {/* =========================
                ŞƏKİLLƏR
            ========================= */}

            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                🖼️ Xəbər şəkilləri
              </label>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="text-sm"
              />

              <p className="text-xs text-gray-400 mt-2">
                Bir neçə şəkil seçə bilərsən. Şəkillər tam görünəcək və ardıcıllığını dəyişə biləcəksən.
              </p>

              {uploading && (
                <p className="text-xs text-blue mt-2">
                  ⏳ Şəkillər yüklənir...
                </p>
              )}

              {form.image_urls.length > 0 && (
                <div className="flex flex-col gap-4 mt-4">

                  {form.image_urls.map(
                    (url, index) => (
                      <div
                        key={`${url}-${index}`}
                        className="border border-line rounded-sm bg-white p-3"
                      >

                        {/* TAM ŞƏKİL */}

                        <div className="w-full bg-gray-50 flex items-center justify-center overflow-hidden rounded-sm">
                          <img
                            src={url}
                            alt={`Şəkil ${index + 1}`}
                            className="block w-full h-auto max-h-[600px] object-contain"
                          />
                        </div>

                        {/* ŞƏKİL NÖMRƏSİ */}

                        <div className="flex items-center justify-between mt-3">

                          <span className="text-xs font-semibold text-gray-500">
                            Şəkil {index + 1}
                          </span>

                          <div className="flex items-center gap-2">

                            {/* YUXARI */}

                            <button
                              type="button"
                              onClick={() =>
                                moveImageUp(index)
                              }
                              disabled={index === 0}
                              className="border border-line px-3 py-1 text-xs rounded-sm disabled:opacity-30"
                            >
                              ↑ Yuxarı
                            </button>

                            {/* AŞAĞI */}

                            <button
                              type="button"
                              onClick={() =>
                                moveImageDown(index)
                              }
                              disabled={
                                index ===
                                form.image_urls.length - 1
                              }
                              className="border border-line px-3 py-1 text-xs rounded-sm disabled:opacity-30"
                            >
                              ↓ Aşağı
                            </button>

                            {/* SİL */}

                            <button
                              type="button"
                              onClick={() =>
                                removeImage(index)
                              }
                              className="bg-crimson text-white px-3 py-1 text-xs rounded-sm"
                            >
                              Sil
                            </button>

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}
            </div>

            {/* =========================
                VİDEO
            ========================= */}

            <div className="border border-line rounded-sm p-4">

              <label className="text-xs font-semibold text-gray-500 block mb-2">
                🎥 Xəbər videosu
              </label>

              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                className="text-sm"
              />

              <p className="text-xs text-gray-400 mt-2">
                MP4, WebM və digər video formatlarından istifadə edə bilərsən.
              </p>

              {videoUploading && (
                <div className="mt-3 text-sm text-blue">
                  ⏳ Video yüklənir, zəhmət olmasa gözlə...
                </div>
              )}

              {form.video_url && (
                <div className="mt-4">

                  <div className="relative">

                    <video
                      src={form.video_url}
                      controls
                      className="w-full max-h-96 rounded-sm border border-line bg-black"
                    />

                    <button
                      type="button"
                      onClick={removeVideo}
                      className="absolute top-2 right-2 bg-crimson text-white rounded-full w-8 h-8"
                    >
                      ×
                    </button>

                  </div>

                  <p className="text-xs text-green-600 mt-2">
                    ✅ Video hazırdır.
                  </p>

                </div>
              )}

            </div>

            {/* BAŞ XƏBƏR */}

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) =>
                  setForm({
                    ...form,
                    is_featured:
                      e.target.checked,
                  })
                }
              />

              ⭐ Baş xəbər et
            </label>

            {/* TƏCİLİ */}

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_breaking}
                onChange={(e) =>
                  setForm({
                    ...form,
                    is_breaking:
                      e.target.checked,
                  })
                }
              />

              🚨 Təcili xəbər
            </label>

            {/* BUTTON */}

            <div className="flex gap-3">

              <button
                type="submit"
                disabled={
                  saving ||
                  uploading ||
                  videoUploading
                }
                className="bg-ink text-white px-5 py-2 rounded-sm text-sm font-semibold hover:bg-ink2 disabled:opacity-50"
              >
                {saving
                  ? 'Saxlanılır...'
                  : form.id
                  ? 'Yenilə'
                  : 'Əlavə et'}
              </button>

              {form.id && (
                <button
                  type="button"
                  onClick={() => {
                    setForm(emptyForm);
                    setMessage('');
                  }}
                  className="text-sm text-gray-500"
                >
                  Ləğv et
                </button>
              )}

            </div>

          </form>

          {/* XƏBƏRLƏR SİYAHISI */}

          <h2 className="font-serif text-lg font-semibold mb-4">
            Bütün xəbərlər ({articles.length})
          </h2>

          <div className="flex flex-col gap-2">

            {articles.map((article) => (
              <div
                key={article.id}
                className="border border-line rounded-sm px-4 py-3"
              >

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                  <div className="min-w-0">

                    <div className="text-sm font-semibold">

                      {article.is_featured &&
                        '⭐ '}

                      {article.is_breaking &&
                        '🚨 '}

                      {article.video_url &&
                        '🎥 '}

                      {article.title}

                    </div>

                    <div className="text-xs text-gray-400 mt-1">
                      {article.category} ·{' '}
                      {article.views || 0}{' '}
                      baxış

                      {article.video_url &&
                        ' · 🎥 Video var'}
                    </div>

                  </div>

                  <div className="flex flex-wrap gap-3">

                    <button
                      onClick={() =>
                        toggleFeatured(article)
                      }
                      className="text-xs text-gray-500 hover:text-blue"
                    >
                      {article.is_featured
                        ? 'Baş xəbərdən çıxar'
                        : 'Baş xəbər et'}
                    </button>

                    <button
                      onClick={() =>
                        toggleBreaking(article)
                      }
                      className="text-xs text-gray-500 hover:text-crimson"
                    >
                      {article.is_breaking
                        ? 'Təcili söndür'
                        : 'Təcili et'}
                    </button>

                    <button
                      onClick={() =>
                        handleEdit(article)
                      }
                      className="text-xs text-blue"
                    >
                      Redaktə
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(article.id)
                      }
                      className="text-xs text-crimson"
                    >
                      Sil
                    </button>

                  </div>

                </div>

              </div>
            ))}

            {articles.length === 0 && (
              <p className="text-sm text-gray-400">
                Hələ xəbər yoxdur.
              </p>
            )}

          </div>
        </>
      )}

      {/* =====================================================
          REKLAMLAR
      ===================================================== */}

      {activeSection === 'ads' && (
        <>
          <form
            onSubmit={handleAdSubmit}
            className="bg-panel border border-line p-5 sm:p-6 mb-10 flex flex-col gap-4"
          >

            <h2 className="font-serif text-lg font-semibold">
              {adForm.id
                ? '✏️ Reklamı redaktə et'
                : '📢 Yeni reklam əlavə et'}
            </h2>

            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                📢 Reklam başlığı
              </label>

              <input
                required
                value={adForm.title}
                onChange={(e) =>
                  setAdForm({
                    ...adForm,
                    title: e.target.value,
                  })
                }
                placeholder="Məsələn: Yeni mağazamız açıldı"
                className="w-full border border-line rounded-sm px-3 py-2 text-sm bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                🏢 Reklam verən
              </label>

              <input
                value={adForm.advertiser_name}
                onChange={(e) =>
                  setAdForm({
                    ...adForm,
                    advertiser_name:
                      e.target.value,
                  })
                }
                placeholder="Şirkət və ya şəxs adı"
                className="w-full border border-line rounded-sm px-3 py-2 text-sm bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                📝 Reklam mətni
              </label>

              <textarea
                rows={4}
                value={adForm.description}
                onChange={(e) =>
                  setAdForm({
                    ...adForm,
                    description:
                      e.target.value,
                  })
                }
                placeholder="Reklam haqqında qısa məlumat"
                className="w-full border border-line rounded-sm px-3 py-2 text-sm bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                🖼️ Reklam banneri
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={handleAdImageUpload}
                className="text-sm"
              />

              {adUploading && (
                <p className="text-xs text-blue mt-2">
                  ⏳ Reklam şəkli yüklənir...
                </p>
              )}

              {adForm.image_url && (
                <div className="mt-4 relative max-w-xl">

                  <img
                    src={adForm.image_url}
                    alt="Reklam"
                    className="w-full h-auto max-h-96 object-contain rounded-sm border border-line bg-gray-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setAdForm({
                        ...adForm,
                        image_url: '',
                      })
                    }
                    className="absolute top-2 right-2 bg-crimson text-white rounded-full w-8 h-8"
                  >
                    ×
                  </button>

                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                🔗 Reklam linki
              </label>

              <input
                type="url"
                value={adForm.link_url}
                onChange={(e) =>
                  setAdForm({
                    ...adForm,
                    link_url:
                      e.target.value,
                  })
                }
                placeholder="https://..."
                className="w-full border border-line rounded-sm px-3 py-2 text-sm bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 block mb-1">
                📍 Reklamın yeri
              </label>

              <select
                value={adForm.position}
                onChange={(e) =>
                  setAdForm({
                    ...adForm,
                    position:
                      e.target.value,
                  })
                }
                className="w-full border border-line rounded-sm px-3 py-2 text-sm bg-white"
              >
                <option value="homepage">
                  Ana səhifə
                </option>

                <option value="article">
                  Xəbər səhifələri
                </option>

                <option value="both">
                  Ana səhifə + Xəbərlər
                </option>
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">
                  📅 Başlama tarixi
                </label>

                <input
                  type="datetime-local"
                  value={adForm.start_date}
                  onChange={(e) =>
                    setAdForm({
                      ...adForm,
                      start_date:
                        e.target.value,
                    })
                  }
                  className="w-full border border-line rounded-sm px-3 py-2 text-sm bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 block mb-1">
                  📅 Bitmə tarixi
                </label>

                <input
                  type="datetime-local"
                  value={adForm.end_date}
                  onChange={(e) =>
                    setAdForm({
                      ...adForm,
                      end_date:
                        e.target.value,
                    })
                  }
                  className="w-full border border-line rounded-sm px-3 py-2 text-sm bg-white"
                />
              </div>

            </div>

            <label className="flex items-center gap-2 text-sm">

              <input
                type="checkbox"
                checked={adForm.is_active}
                onChange={(e) =>
                  setAdForm({
                    ...adForm,
                    is_active:
                      e.target.checked,
                  })
                }
              />

              🟢 Reklam aktiv olsun

            </label>

            <div className="flex gap-3">

              <button
                type="submit"
                disabled={
                  adSaving ||
                  adUploading
                }
                className="bg-ink text-white px-5 py-2 rounded-sm text-sm font-semibold hover:bg-ink2 disabled:opacity-50"
              >
                {adSaving
                  ? 'Saxlanılır...'
                  : adForm.id
                  ? 'Reklamı yenilə'
                  : 'Reklamı əlavə et'}
              </button>

              {adForm.id && (
                <button
                  type="button"
                  onClick={() => {
                    setAdForm(emptyAdForm);
                    setMessage('');
                  }}
                  className="text-sm text-gray-500"
                >
                  Ləğv et
                </button>
              )}

            </div>

          </form>

          <h2 className="font-serif text-lg font-semibold mb-4">
            Bütün reklamlar ({advertisements.length})
          </h2>

          <div className="flex flex-col gap-3">

            {advertisements.map((ad) => (
              <div
                key={ad.id}
                className="border border-line rounded-sm p-4"
              >

                <div className="flex flex-col sm:flex-row gap-4">

                  {ad.image_url && (
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      className="w-full sm:w-40 h-auto max-h-32 object-contain rounded-sm bg-gray-50"
                    />
                  )}

                  <div className="flex-1 min-w-0">

                    <div className="font-semibold text-sm">
                      📢 {ad.title}
                    </div>

                    {ad.advertiser_name && (
                      <div className="text-xs text-gray-500 mt-1">
                        🏢 {ad.advertiser_name}
                      </div>
                    )}

                    <div className="text-xs text-gray-400 mt-1">
                      📍{' '}
                      {ad.position === 'homepage'
                        ? 'Ana səhifə'
                        : ad.position === 'article'
                        ? 'Xəbər səhifələri'
                        : 'Ana səhifə + Xəbərlər'}
                    </div>

                    <div className="text-xs mt-1">
                      {ad.is_active ? (
                        <span className="text-green-600">
                          🟢 Aktiv
                        </span>
                      ) : (
                        <span className="text-gray-400">
                          ⚪ Deaktiv
                        </span>
                      )}
                    </div>

                  </div>

                  <div className="flex flex-wrap gap-3 items-start">

                    <button
                      onClick={() =>
                        toggleAdvertisement(ad)
                      }
                      className="text-xs text-gray-500 hover:text-blue"
                    >
                      {ad.is_active
                        ? 'Deaktiv et'
                        : 'Aktiv et'}
                    </button>

                    <button
                      onClick={() =>
                        handleAdEdit(ad)
                      }
                      className="text-xs text-blue"
                    >
                      Redaktə
                    </button>

                    <button
                      onClick={() =>
                        handleAdDelete(ad.id)
                      }
                      className="text-xs text-crimson"
                    >
                      Sil
                    </button>

                  </div>

                </div>

              </div>
            ))}

            {advertisements.length === 0 && (
              <p className="text-sm text-gray-400">
                Hələ reklam yoxdur.
              </p>
            )}

          </div>
        </>
      )}

    </div>
  );
}