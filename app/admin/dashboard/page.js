'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { CATEGORIES } from '@/lib/categories';

const emptyForm = {
  title: '',
  excerpt: '',
  content: '',
  category: CATEGORIES?.[0]?.slug || 'siyaset',
  source: '',
  image_url: '',
  video_url: '',
  is_featured: false,
};

export default function AdminDashboard() {
  const [form, setForm] = useState(emptyForm);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('news');

  useEffect(() => {
    loadArticles();
  }, []);

  async function loadArticles() {
    setLoadingArticles(true);

    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    if (!error) {
      setArticles(data || []);
    }

    setLoadingArticles(false);
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function createSlug(title) {
    return title
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

  async function handleSubmit(e) {
    e.preventDefault();

    setMessage('');
    setError('');
    setLoading(true);

    if (!form.title.trim()) {
      setError('Xəbərin başlığını yaz.');
      setLoading(false);
      return;
    }

    if (!form.content.trim()) {
      setError('Xəbərin mətnini yaz.');
      setLoading(false);
      return;
    }

    if (activeTab === 'video' && !form.video_url.trim()) {
      setError('Video xəbəri üçün video URL daxil et.');
      setLoading(false);
      return;
    }

    const slug =
      createSlug(form.title) +
      '-' +
      Date.now().toString().slice(-6);

    const articleData = {
      title: form.title.trim(),
      excerpt: form.excerpt.trim(),
      content: form.content.trim(),
      category: form.category,
      source: form.source.trim(),
      image_url: form.image_url.trim() || null,
      video_url:
        activeTab === 'video'
          ? form.video_url.trim()
          : null,
      is_featured:
        activeTab === 'news'
          ? form.is_featured
          : false,
      slug,
      views: 0,
    };

    const { error } = await supabase
      .from('articles')
      .insert([articleData]);

    if (error) {
      console.error(error);
      setError(
        'Xəbər əlavə olunmadı: ' +
          error.message
      );
      setLoading(false);
      return;
    }

    setMessage(
      activeTab === 'video'
        ? '🎥 Video xəbər uğurla paylaşıldı!'
        : '📰 Xəbər uğurla paylaşıldı!'
    );

    setForm(emptyForm);

    await loadArticles();

    setLoading(false);
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
        'Xəbər silinmədi: ' + error.message
      );
      return;
    }

    setMessage('Xəbər silindi.');
    loadArticles();
  }

  function resetForm() {
    setForm(emptyForm);
    setMessage('');
    setError('');
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8]">

      {/* HEADER */}

      <header className="bg-[#172b4d] text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

            <div>
              <div className="text-[10px] tracking-[0.25em] uppercase text-white/50">
                PANORAMA
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mt-1">
                Admin panel
              </h1>

              <p className="text-sm text-white/60 mt-1">
                Xəbərləri və video xəbərləri idarə et
              </p>
            </div>

            <a
              href="/"
              className="border border-white/20 px-4 py-2 text-sm hover:bg-white/10 transition"
            >
              ← Sayta bax
            </a>

          </div>

        </div>
      </header>

      {/* CONTENT */}

      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* ÜST MENYU */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">

          <div className="bg-white border border-gray-200 p-4">
            <div className="text-xs text-gray-400">
              Ümumi xəbərlər
            </div>

            <div className="text-2xl font-bold text-[#172b4d] mt-1">
              {articles.length}
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-4">
            <div className="text-xs text-gray-400">
              Video xəbərlər
            </div>

            <div className="text-2xl font-bold text-[#172b4d] mt-1">
              {
                articles.filter(
                  (item) =>
                    item.video_url
                ).length
              }
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-4">
            <div className="text-xs text-gray-400">
              Baş xəbərlər
            </div>

            <div className="text-2xl font-bold text-[#172b4d] mt-1">
              {
                articles.filter(
                  (item) =>
                    item.is_featured
                ).length
              }
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-4">
            <div className="text-xs text-gray-400">
              Status
            </div>

            <div className="text-sm font-bold text-green-600 mt-2">
              ● Sistem aktivdir
            </div>
          </div>

        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">

          {/* SOL — XƏBƏR PAYLAŞ */}

          <section className="bg-white border border-gray-200">

            <div className="border-b border-gray-200 px-5 py-4">

              <h2 className="text-xl font-bold text-[#172b4d]">
                Xəbər paylaş
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                Saytda yayımlamaq üçün yeni xəbər əlavə et
              </p>

            </div>

            {/* TABLAR */}

            <div className="grid grid-cols-2 border-b border-gray-200">

              <button
                type="button"
                onClick={() => {
                  setActiveTab('news');
                  setForm(emptyForm);
                  setMessage('');
                  setError('');
                }}
                className={`py-4 text-sm font-semibold ${
                  activeTab === 'news'
                    ? 'bg-[#172b4d] text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                📰 Adi xəbər
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('video');
                  setForm(emptyForm);
                  setMessage('');
                  setError('');
                }}
                className={`py-4 text-sm font-semibold ${
                  activeTab === 'video'
                    ? 'bg-[#172b4d] text-white'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                🎥 Video xəbər
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="p-5 space-y-5"
            >

              {/* BAŞLIQ */}

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">
                  Xəbər başlığı *
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Məsələn: Azərbaycanda mühüm qərar qəbul edildi"
                  className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#172b4d]"
                  required
                />
              </div>

              {/* QISA MƏTN */}

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">
                  Qısa açıqlama
                </label>

                <textarea
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Xəbərin qısa açıqlaması..."
                  className="w-full border border-gray-300 px-4 py-3 text-sm resize-none outline-none focus:border-[#172b4d]"
                />
              </div>

              {/* TAM MƏTN */}

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">
                  Xəbərin tam mətni *
                </label>

                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={12}
                  placeholder="Xəbərin tam mətnini buraya yaz..."
                  className="w-full border border-gray-300 px-4 py-3 text-sm resize-y outline-none focus:border-[#172b4d]"
                  required
                />
              </div>

              {/* KATEQORİYA + MƏNBƏ */}

              <div className="grid md:grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">
                    Kateqoriya
                  </label>

                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-4 py-3 text-sm bg-white outline-none focus:border-[#172b4d]"
                  >
                    {CATEGORIES.map(
                      (category) => (
                        <option
                          key={category.slug}
                          value={category.slug}
                        >
                          {category.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-2">
                    Mənbə
                  </label>

                  <input
                    name="source"
                    value={form.source}
                    onChange={handleChange}
                    placeholder="Məsələn: APA, Report..."
                    className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#172b4d]"
                  />
                </div>

              </div>

              {/* ŞƏKİL */}

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">
                  Şəkil URL-i
                </label>

                <input
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#172b4d]"
                />

                {form.image_url && (
                  <div className="mt-3 border border-gray-200 overflow-hidden">

                    <img
                      src={form.image_url}
                      alt="Önizləmə"
                      className="w-full max-h-[260px] object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display =
                          'none';
                      }}
                    />

                  </div>
                )}
              </div>

              {/* VIDEO */}

              {activeTab === 'video' && (
                <div>

                  <label className="block text-xs font-bold text-gray-600 mb-2">
                    Video URL-i *
                  </label>

                  <input
                    name="video_url"
                    value={form.video_url}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="w-full border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#172b4d]"
                    required
                  />

                  <p className="text-[11px] text-gray-400 mt-2">
                    Video faylının birbaşa URL ünvanını daxil et.
                  </p>
                </div>
              )}

              {/* BAŞ XƏBƏR */}

              {activeTab === 'news' && (
                <label className="flex items-center gap-3 border border-gray-200 bg-gray-50 px-4 py-4 cursor-pointer">

                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={form.is_featured}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />

                  <div>
                    <div className="text-sm font-bold text-[#172b4d]">
                      ⭐ Baş xəbər et
                    </div>

                    <div className="text-[11px] text-gray-400 mt-1">
                      Bu xəbər əsas səhifədə böyük şəkildə göstəriləcək.
                    </div>
                  </div>

                </label>
              )}

              {/* MESAJ */}

              {message && (
                <div className="border border-green-200 bg-green-50 text-green-700 px-4 py-3 text-sm">
                  {message}
                </div>
              )}

              {error && (
                <div className="border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              {/* BUTTONS */}

              <div className="flex flex-col sm:flex-row gap-3">

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#172b4d] text-white py-3.5 text-sm font-bold hover:bg-[#1D4E89] transition disabled:opacity-50"
                >
                  {loading
                    ? 'Paylaşılır...'
                    : activeTab === 'video'
                    ? '🎥 Video xəbəri paylaş'
                    : '📰 Xəbəri paylaş'}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="border border-gray-300 px-6 py-3.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Təmizlə
                </button>

              </div>

            </form>

          </section>

          {/* SAĞ — SON XƏBƏRLƏR */}

          <aside className="bg-white border border-gray-200 h-fit">

            <div className="px-5 py-4 border-b border-gray-200">

              <div className="text-[9px] uppercase tracking-[0.2em] text-gray-400">
                PANORAMA
              </div>

              <h2 className="text-lg font-bold text-[#172b4d] mt-1">
                Son paylaşımlar
              </h2>

            </div>

            {loadingArticles ? (

              <div className="p-5 text-sm text-gray-400">
                Yüklənir...
              </div>

            ) : articles.length === 0 ? (

              <div className="p-5 text-sm text-gray-400">
                Hələ xəbər yoxdur.
              </div>

            ) : (

              <div>

                {articles.map((article) => (

                  <div
                    key={article.id}
                    className="p-4 border-b border-gray-200 last:border-0"
                  >

                    <div className="flex gap-3">

                      {article.image_url ? (
                        <img
                          src={article.image_url}
                          alt=""
                          className="w-20 h-14 object-cover flex-none"
                        />
                      ) : (
                        <div className="w-20 h-14 bg-[#172b4d] flex items-center justify-center text-[8px] text-white/50">
                          PANORAMA
                        </div>
                      )}

                      <div className="min-w-0 flex-1">

                        <div className="text-[9px] uppercase font-bold text-[#1D4E89]">
                          {article.video_url
                            ? '🎥 Video'
                            : '📰 Xəbər'}
                        </div>

                        <h3 className="text-xs font-semibold leading-snug mt-1 line-clamp-2">
                          {article.title}
                        </h3>

                      </div>

                    </div>

                    <div className="flex items-center justify-between mt-3">

                      <span className="text-[10px] text-gray-400">
                        {article.views || 0} baxış
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          deleteArticle(
                            article.id
                          )
                        }
                        className="text-[10px] font-semibold text-red-500 hover:text-red-700"
                      >
                        Sil
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            )}

          </aside>

        </div>

      </div>

    </main>
  );
}