'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

const CATEGORIES = [
  { value: 'siyaset', label: 'Siyasət' },
  { value: 'iqtisadiyyat', label: 'İqtisadiyyat' },
  { value: 'cemiyyet', label: 'Cəmiyyət' },
  { value: 'dunya', label: 'Dünya' },
  { value: 'idman', label: 'İdman' },
  { value: 'medeniyyet', label: 'Mədəniyyət' },
  { value: 'texnologiya', label: 'Texnologiya' },
  { value: 'hadise', label: 'Hadisə' },
];

const emptyForm = {
  id: null,
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'siyaset',
  source: '',
  image_url: '',
  video_url: '',
  is_featured: false,
};

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/ə/g, 'e')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ğ/g, 'g')
    .replace(/ş/g, 's')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function formatDate(date) {
  if (!date) return '-';

  return new Date(date).toLocaleString('az-AZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const [showEditor, setShowEditor] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [activeMenu, setActiveMenu] = useState('dashboard');

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    setLoading(true);

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', {
        ascending: false,
      });

    if (error) {
      console.error(error);
      setError('Xəbərləri yükləmək mümkün olmadı.');
    } else {
      setArticles(data || []);
    }

    setLoading(false);
  }

  function openNewArticle() {
    setForm(emptyForm);
    setMessage('');
    setError('');
    setShowEditor(true);
  }

  function openEditArticle(article) {
    setForm({
      id: article.id,
      title: article.title || '',
      slug: article.slug || '',
      excerpt: article.excerpt || '',
      content: article.content || '',
      category: article.category || 'siyaset',
      source: article.source || '',
      image_url: article.image_url || '',
      video_url: article.video_url || '',
      is_featured: article.is_featured || false,
    });

    setMessage('');
    setError('');
    setShowEditor(true);
  }

  function updateForm(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleTitleChange(value) {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: prev.id ? prev.slug : slugify(value),
    }));
  }

  async function uploadFile(file, bucket) {
    if (!file) return null;

    const extension =
      file.name.split('.').pop() || 'file';

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.${extension}`;

    const path = `articles/${fileName}`;

    const { error: uploadError } =
      await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        });

    if (uploadError) {
      console.error(uploadError);
      throw new Error(
        `Fayl yüklənmədi: ${uploadError.message}`
      );
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploadingImage(true);
    setError('');
    setMessage('');

    try {
      const url = await uploadFile(
        file,
        'images'
      );

      updateForm('image_url', url);
      setMessage('Şəkil uğurla yükləndi.');
    } catch (err) {
      setError(err.message);
    }

    setUploadingImage(false);
  }

  async function handleVideoUpload(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploadingVideo(true);
    setError('');
    setMessage('');

    try {
      const url = await uploadFile(
        file,
        'videos'
      );

      updateForm('video_url', url);
      setMessage('Video uğurla yükləndi.');
    } catch (err) {
      setError(err.message);
    }

    setUploadingVideo(false);
  }

  async function saveArticle(e) {
    e.preventDefault();

    setSaving(true);
    setError('');
    setMessage('');

    if (!form.title.trim()) {
      setError('Xəbərin başlığını yaz.');
      setSaving(false);
      return;
    }

    const payload = {
      title: form.title.trim(),
      slug:
        form.slug.trim() ||
        slugify(form.title),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      category: form.category,
      source: form.source.trim(),
      image_url: form.image_url.trim(),
      video_url: form.video_url.trim(),
      is_featured: form.is_featured,
    };

    try {
      if (form.is_featured) {
        await supabase
          .from('articles')
          .update({
            is_featured: false,
          })
          .eq('is_featured', true);
      }

      if (form.id) {
        const { error } = await supabase
          .from('articles')
          .update(payload)
          .eq('id', form.id);

        if (error) throw error;

        setMessage(
          'Xəbər uğurla yeniləndi.'
        );
      } else {
        const { error } = await supabase
          .from('articles')
          .insert([payload]);

        if (error) throw error;

        setMessage(
          'Xəbər uğurla əlavə edildi.'
        );
      }

      await loadArticles();

      setTimeout(() => {
        setShowEditor(false);
        setForm(emptyForm);
        setMessage('');
      }, 700);
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          'Xəbəri yadda saxlamaq mümkün olmadı.'
      );
    }

    setSaving(false);
  }

  async function deleteArticle(id) {
    const ok = window.confirm(
      'Bu xəbəri silmək istədiyinə əminsən?'
    );

    if (!ok) return;

    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) {
      setError(
        'Xəbəri silmək mümkün olmadı.'
      );
      return;
    }

    setMessage('Xəbər silindi.');
    loadArticles();
  }

  async function toggleFeatured(article) {
    setError('');
    setMessage('');

    if (!article.is_featured) {
      await supabase
        .from('articles')
        .update({
          is_featured: false,
        })
        .eq('is_featured', true);
    }

    const { error } = await supabase
      .from('articles')
      .update({
        is_featured:
          !article.is_featured,
      })
      .eq('id', article.id);

    if (error) {
      setError(
        'Baş xəbər dəyişdirilə bilmədi.'
      );
      return;
    }

    setMessage(
      article.is_featured
        ? 'Baş xəbər ləğv edildi.'
        : 'Xəbər baş xəbər seçildi.'
    );

    loadArticles();
  }

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === 'all' ||
        article.category ===
          categoryFilter;

      const isVideo =
        Boolean(
          article.video_url
        );

      const matchesType =
        typeFilter === 'all' ||
        (typeFilter === 'video' &&
          isVideo) ||
        (typeFilter === 'news' &&
          !isVideo);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesType
      );
    });
  }, [
    articles,
    search,
    categoryFilter,
    typeFilter,
  ]);

  const stats = {
    total: articles.length,

    videos: articles.filter(
      (a) => a.video_url
    ).length,

    featured: articles.filter(
      (a) => a.is_featured
    ).length,

    views: articles.reduce(
      (sum, a) =>
        sum + Number(a.views || 0),
      0
    ),
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-[#172b4d]">

      {/* SIDEBAR */}

      <aside className="fixed left-0 top-0 bottom-0 w-[250px] bg-[#172b4d] text-white hidden lg:flex flex-col">

        <div className="px-6 py-7 border-b border-white/10">

          <div className="text-[10px] tracking-[0.3em] text-white/40 uppercase">
            PANORAMA
          </div>

          <div className="text-2xl font-black mt-1">
            ADMIN
          </div>

          <div className="text-[10px] text-white/40 mt-1">
            Xəbər idarəetmə sistemi
          </div>

        </div>

        <nav className="p-4 space-y-1">

          <button
            onClick={() =>
              setActiveMenu(
                'dashboard'
              )
            }
            className={`w-full text-left px-4 py-3 rounded-lg text-sm ${
              activeMenu ===
              'dashboard'
                ? 'bg-white/10'
                : 'hover:bg-white/5'
            }`}
          >
            📊 Dashboard
          </button>

          <button
            onClick={() =>
              setActiveMenu('articles')
            }
            className={`w-full text-left px-4 py-3 rounded-lg text-sm ${
              activeMenu ===
              'articles'
                ? 'bg-white/10'
                : 'hover:bg-white/5'
            }`}
          >
            📰 Xəbərlər
          </button>

          <button
            onClick={() =>
              setTypeFilter('video')
            }
            className="w-full text-left px-4 py-3 rounded-lg text-sm hover:bg-white/5"
          >
            🎥 Video xəbərlər
          </button>

          <button
            onClick={() =>
              setActiveMenu('featured')
            }
            className="w-full text-left px-4 py-3 rounded-lg text-sm hover:bg-white/5"
          >
            ⭐ Baş xəbərlər
          </button>

          <div className="pt-5 pb-2 px-4 text-[9px] uppercase tracking-[0.2em] text-white/30">
            İDARƏETMƏ
          </div>

          <button
            onClick={() =>
              setActiveMenu('statistics')
            }
            className="w-full text-left px-4 py-3 rounded-lg text-sm hover:bg-white/5"
          >
            📈 Statistikalar
          </button>

          <button
            onClick={() =>
              setActiveMenu('settings')
            }
            className="w-full text-left px-4 py-3 rounded-lg text-sm hover:bg-white/5"
          >
            ⚙️ Parametrlər
          </button>

        </nav>

        <div className="mt-auto p-5 border-t border-white/10 text-xs text-white/40">
          PANORAMA Xəbər Agentliyi
        </div>

      </aside>

      {/* MAIN */}

      <main className="lg:ml-[250px]">

        {/* TOPBAR */}

        <header className="bg-white border-b border-gray-200 px-5 md:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div>
            <div className="text-xs text-gray-400">
              PANORAMA / ADMIN
            </div>

            <h1 className="text-2xl font-bold mt-1">
              {activeMenu ===
              'dashboard'
                ? 'Dashboard'
                : activeMenu ===
                  'articles'
                ? 'Xəbərlər'
                : activeMenu ===
                  'featured'
                ? 'Baş xəbərlər'
                : activeMenu ===
                  'statistics'
                ? 'Statistikalar'
                : 'Parametrlər'}
            </h1>
          </div>

          <button
            onClick={openNewArticle}
            className="bg-[#172b4d] text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-[#1d4e89] transition"
          >
            + Yeni xəbər
          </button>

        </header>

        <div className="p-5 md:p-8">

          {/* MESSAGES */}

          {message && (
            <div className="mb-5 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              ✓ {message}
            </div>
          )}

          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* STATISTICS */}

          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">

            <StatCard
              title="Ümumi xəbərlər"
              value={stats.total}
              icon="📰"
            />

            <StatCard
              title="Video xəbərlər"
              value={stats.videos}
              icon="🎥"
            />

            <StatCard
              title="Baş xəbərlər"
              value={stats.featured}
              icon="⭐"
            />

            <StatCard
              title="Ümumi baxış"
              value={stats.views.toLocaleString(
                'az-AZ'
              )}
              icon="👁️"
            />

          </div>

          {/* QUICK ACTIONS */}

          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">

            <div className="flex items-center justify-between mb-5">

              <div>
                <h2 className="font-bold text-lg">
                  Sürətli əməliyyatlar
                </h2>

                <p className="text-xs text-gray-400 mt-1">
                  Admin panelindən əsas funksiyalar
                </p>
              </div>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

              <button
                onClick={openNewArticle}
                className="border border-gray-200 rounded-lg p-4 text-left hover:border-[#172b4d] hover:bg-gray-50 transition"
              >
                <div className="text-xl mb-2">
                  📝
                </div>

                <div className="font-semibold text-sm">
                  Yeni xəbər
                </div>

                <div className="text-[11px] text-gray-400 mt-1">
                  Xəbər yarat
                </div>
              </button>

              <button
                onClick={() => {
                  setTypeFilter(
                    'video'
                  );
                  setActiveMenu(
                    'articles'
                  );
                }}
                className="border border-gray-200 rounded-lg p-4 text-left hover:border-[#172b4d] hover:bg-gray-50 transition"
              >
                <div className="text-xl mb-2">
                  🎥
                </div>

                <div className="font-semibold text-sm">
                  Videolar
                </div>

                <div className="text-[11px] text-gray-400 mt-1">
                  Video xəbərləri
                </div>
              </button>

              <button
                onClick={() =>
                  setActiveMenu(
                    'featured'
                  )
                }
                className="border border-gray-200 rounded-lg p-4 text-left hover:border-[#172b4d] hover:bg-gray-50 transition"
              >
                <div className="text-xl mb-2">
                  ⭐
                </div>

                <div className="font-semibold text-sm">
                  Baş xəbər
                </div>

                <div className="text-[11px] text-gray-400 mt-1">
                  Əsas xəbəri seç
                </div>
              </button>

              <button
                onClick={() =>
                  setActiveMenu(
                    'statistics'
                  )
                }
                className="border border-gray-200 rounded-lg p-4 text-left hover:border-[#172b4d] hover:bg-gray-50 transition"
              >
                <div className="text-xl mb-2">
                  📈
                </div>

                <div className="font-semibold text-sm">
                  Statistikalar
                </div>

                <div className="text-[11px] text-gray-400 mt-1">
                  Baxışlara bax
                </div>
              </button>

            </div>

          </div>

          {/* ARTICLES */}

          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

            <div className="p-5 border-b border-gray-200">

              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">

                <div>
                  <h2 className="font-bold text-lg">
                    Xəbərlər
                  </h2>

                  <p className="text-xs text-gray-400 mt-1">
                    {filteredArticles.length}{' '}
                    nəticə göstərilir
                  </p>
                </div>

                <div className="flex flex-col md:flex-row gap-2">

                  <input
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                    placeholder="Xəbər axtar..."
                    className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-[#172b4d]"
                  />

                  <select
                    value={
                      categoryFilter
                    }
                    onChange={(e) =>
                      setCategoryFilter(
                        e.target.value
                      )
                    }
                    className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white"
                  >
                    <option value="all">
                      Bütün kateqoriyalar
                    </option>

                    {CATEGORIES.map(
                      (cat) => (
                        <option
                          key={
                            cat.value
                          }
                          value={
                            cat.value
                          }
                        >
                          {cat.label}
                        </option>
                      )
                    )}
                  </select>

                  <select
                    value={typeFilter}
                    onChange={(e) =>
                      setTypeFilter(
                        e.target.value
                      )
                    }
                    className="border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-white"
                  >
                    <option value="all">
                      Hamısı
                    </option>

                    <option value="news">
                      Adi xəbərlər
                    </option>

                    <option value="video">
                      Videolar
                    </option>
                  </select>

                </div>

              </div>

            </div>

            {loading ? (

              <div className="p-12 text-center text-gray-400 text-sm">
                Xəbərlər yüklənir...
              </div>

            ) : filteredArticles.length ===
              0 ? (

              <div className="p-12 text-center">

                <div className="text-4xl mb-3">
                  📰
                </div>

                <div className="font-semibold">
                  Xəbər tapılmadı
                </div>

                <p className="text-xs text-gray-400 mt-1">
                  Yeni xəbər əlavə edə bilərsən.
                </p>

              </div>

            ) : (

              <div className="divide-y divide-gray-100">

                {filteredArticles.map(
                  (article) => (

                    <div
                      key={article.id}
                      className="p-5 hover:bg-gray-50 transition"
                    >

                      <div className="flex flex-col xl:flex-row gap-5">

                        {/* IMAGE */}

                        <div className="w-full xl:w-[170px] h-[105px] flex-none bg-gray-100 rounded-lg overflow-hidden">

                          {article.image_url ? (

                            <img
                              src={
                                article.image_url
                              }
                              alt={
                                article.title
                              }
                              className="w-full h-full object-cover"
                            />

                          ) : article.video_url ? (

                            <div className="w-full h-full bg-black flex items-center justify-center text-white text-2xl">
                              ▶
                            </div>

                          ) : (

                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                              PANORAMA
                            </div>

                          )}

                        </div>

                        {/* INFO */}

                        <div className="flex-1 min-w-0">

                          <div className="flex flex-wrap gap-2 mb-2">

                            <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-100 px-2 py-1 rounded">
                              {article.category ||
                                'xəbər'}
                            </span>

                            {article.video_url && (
                              <span className="text-[10px] uppercase font-bold bg-[#172b4d] text-white px-2 py-1 rounded">
                                🎥 Video
                              </span>
                            )}

                            {article.is_featured && (
                              <span className="text-[10px] uppercase font-bold bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                                ⭐ Baş xəbər
                              </span>
                            )}

                          </div>

                          <h3 className="font-bold text-base md:text-lg leading-snug">
                            {article.title}
                          </h3>

                          {article.excerpt && (
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                              {article.excerpt}
                            </p>
                          )}

                          <div className="flex flex-wrap gap-4 mt-3 text-[10px] text-gray-400">

                            <span>
                              {formatDate(
                                article.created_at
                              )}
                            </span>

                            <span>
                              👁{' '}
                              {article.views ||
                                0}
                            </span>

                            {article.source && (
                              <span>
                                Mənbə:{' '}
                                {
                                  article.source
                                }
                              </span>
                            )}

                          </div>

                        </div>

                        {/* ACTIONS */}

                        <div className="flex xl:flex-col gap-2 xl:w-[120px]">

                          <button
                            onClick={() =>
                              openEditArticle(
                                article
                              )
                            }
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-white hover:border-[#172b4d]"
                          >
                            ✏️ Redaktə
                          </button>

                          <button
                            onClick={() =>
                              toggleFeatured(
                                article
                              )
                            }
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-white"
                          >
                            ⭐{' '}
                            {article.is_featured
                              ? 'Ləğv et'
                              : 'Baş xəbər'}
                          </button>

                          <button
                            onClick={() =>
                              deleteArticle(
                                article.id
                              )
                            }
                            className="flex-1 border border-red-100 text-red-500 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-red-50"
                          >
                            🗑 Sil
                          </button>

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>

        </div>

      </main>

      {/* EDITOR MODAL */}

      {showEditor && (

        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto p-4 md:p-8">

          <div className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden">

            {/* MODAL HEADER */}

            <div className="bg-[#172b4d] text-white px-6 py-5 flex items-center justify-between">

              <div>

                <div className="text-[9px] uppercase tracking-[0.25em] text-white/40">
                  PANORAMA CMS
                </div>

                <h2 className="text-xl font-bold mt-1">
                  {form.id
                    ? 'Xəbəri redaktə et'
                    : 'Yeni xəbər yarat'}
                </h2>

              </div>

              <button
                onClick={() =>
                  setShowEditor(false)
                }
                className="text-white/60 hover:text-white text-2xl"
              >
                ×
              </button>

            </div>

            <form
              onSubmit={saveArticle}
              className="p-6 space-y-6"
            >

              {/* TITLE */}

              <div>

                <label className="block text-xs font-bold mb-2">
                  Xəbərin başlığı *
                </label>

                <input
                  value={form.title}
                  onChange={(e) =>
                    handleTitleChange(
                      e.target.value
                    )
                  }
                  placeholder="Xəbərin başlığını yaz..."
                  required
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-lg font-semibold outline-none focus:border-[#172b4d]"
                />

              </div>

              {/* SLUG */}

              <div>

                <label className="block text-xs font-bold mb-2">
                  Slug
                </label>

                <input
                  value={form.slug}
                  onChange={(e) =>
                    updateForm(
                      'slug',
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm"
                />

              </div>

              {/* CATEGORY / SOURCE */}

              <div className="grid md:grid-cols-2 gap-4">

                <div>

                  <label className="block text-xs font-bold mb-2">
                    Kateqoriya
                  </label>

                  <select
                    value={
                      form.category
                    }
                    onChange={(e) =>
                      updateForm(
                        'category',
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm bg-white"
                  >

                    {CATEGORIES.map(
                      (cat) => (
                        <option
                          key={
                            cat.value
                          }
                          value={
                            cat.value
                          }
                        >
                          {cat.label}
                        </option>
                      )
                    )}

                  </select>

                </div>

                <div>

                  <label className="block text-xs font-bold mb-2">
                    Mənbə
                  </label>

                  <input
                    value={form.source}
                    onChange={(e) =>
                      updateForm(
                        'source',
                        e.target.value
                      )
                    }
                    placeholder="Məsələn: APA, Report..."
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm"
                  />

                </div>

              </div>

              {/* EXCERPT */}

              <div>

                <label className="block text-xs font-bold mb-2">
                  Qısa açıqlama
                </label>

                <textarea
                  value={form.excerpt}
                  onChange={(e) =>
                    updateForm(
                      'excerpt',
                      e.target.value
                    )
                  }
                  rows={3}
                  placeholder="Xəbər haqqında qısa məlumat..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm resize-none"
                />

              </div>

              {/* CONTENT */}

              <div>

                <label className="block text-xs font-bold mb-2">
                  Xəbərin mətni
                </label>

                <textarea
                  value={form.content}
                  onChange={(e) =>
                    updateForm(
                      'content',
                      e.target.value
                    )
                  }
                  rows={12}
                  placeholder="Xəbərin tam mətnini yaz..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm leading-relaxed resize-y"
                />

              </div>

              {/* IMAGE / VIDEO */}

              <div className="grid md:grid-cols-2 gap-5">

                {/* IMAGE */}

                <div className="border border-gray-200 rounded-xl p-5">

                  <label className="block text-xs font-bold mb-3">
                    🖼 Xəbər şəkli
                  </label>

                  {form.image_url && (
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg mb-3"
                    />
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={
                      handleImageUpload
                    }
                    className="w-full text-xs"
                  />

                  {uploadingImage && (
                    <p className="text-xs text-blue-600 mt-2">
                      Şəkil yüklənir...
                    </p>
                  )}

                  <input
                    value={
                      form.image_url
                    }
                    onChange={(e) =>
                      updateForm(
                        'image_url',
                        e.target.value
                      )
                    }
                    placeholder="və ya şəkil URL-si"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs mt-3"
                  />

                </div>

                {/* VIDEO */}

                <div className="border border-gray-200 rounded-xl p-5">

                  <label className="block text-xs font-bold mb-3">
                    🎥 Video xəbər
                  </label>

                  {form.video_url && (
                    <video
                      src={
                        form.video_url
                      }
                      controls
                      className="w-full h-40 object-cover rounded-lg mb-3 bg-black"
                    />
                  )}

                  <input
                    type="file"
                    accept="video/*"
                    onChange={
                      handleVideoUpload
                    }
                    className="w-full text-xs"
                  />

                  {uploadingVideo && (
                    <p className="text-xs text-blue-600 mt-2">
                      Video yüklənir...
                    </p>
                  )}

                  <input
                    value={
                      form.video_url
                    }
                    onChange={(e) =>
                      updateForm(
                        'video_url',
                        e.target.value
                      )
                    }
                    placeholder="və ya video URL-si"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs mt-3"
                  />

                </div>

              </div>

              {/* FEATURED */}

              <label className="flex items-center gap-3 border border-gray-200 rounded-xl p-4 cursor-pointer">

                <input
                  type="checkbox"
                  checked={
                    form.is_featured
                  }
                  onChange={(e) =>
                    updateForm(
                      'is_featured',
                      e.target.checked
                    )
                  }
                  className="w-4 h-4"
                />

                <div>

                  <div className="text-sm font-bold">
                    ⭐ Baş xəbər kimi göstər
                  </div>

                  <div className="text-xs text-gray-400 mt-1">
                    Bu xəbər ana səhifənin əsas xəbər bölməsində görünəcək.
                  </div>

                </div>

              </label>

              {/* BUTTONS */}

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">

                <button
                  type="button"
                  onClick={() =>
                    setShowEditor(false)
                  }
                  className="px-5 py-3 rounded-lg border border-gray-200 text-sm font-semibold"
                >
                  Ləğv et
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    uploadingImage ||
                    uploadingVideo
                  }
                  className="px-7 py-3 rounded-lg bg-[#172b4d] text-white text-sm font-bold disabled:opacity-50"
                >
                  {saving
                    ? 'Yadda saxlanılır...'
                    : form.id
                    ? 'Dəyişiklikləri saxla'
                    : 'Xəbəri dərc et'}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">

      <div className="flex items-start justify-between">

        <div>

          <div className="text-[11px] text-gray-400 font-medium">
            {title}
          </div>

          <div className="text-2xl font-black mt-2 text-[#172b4d]">
            {value}
          </div>

        </div>

        <div className="w-10 h-10 rounded-lg bg-[#f1f4f7] flex items-center justify-center">
          {icon}
        </div>

      </div>

    </div>
  );
}