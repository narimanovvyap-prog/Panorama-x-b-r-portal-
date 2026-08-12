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
  is_featured: false,
};

export default function AdminDashboard() {
  const router = useRouter();
  const [session, setSession] = useState(undefined); // undefined = yoxlanılır
  const [articles, setArticles] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.replace('/admin');
      } else {
        setSession(data.session);
      }
    });
  }, [router]);

  const loadArticles = useCallback(async () => {
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
    setArticles(data || []);
  }, []);

  useEffect(() => {
    if (session) loadArticles();
  }, [session, loadArticles]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/admin');
  }

  async function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage('');
    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const { error } = await supabase.storage.from('xeber-sekiller').upload(fileName, file);
    if (error) {
      setMessage('Şəkil yüklənərkən xəta: ' + error.message);
      setUploading(false);
      return;
    }
    const { data: publicUrlData } = supabase.storage.from('xeber-sekiller').getPublicUrl(fileName);
    setForm((f) => ({ ...f, image_url: publicUrlData.publicUrl }));
    setUploading(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      category: form.category,
      source: form.source,
      image_url: form.image_url,
      is_featured: form.is_featured,
    };

    let error;
    if (form.id) {
      ({ error } = await supabase.from('articles').update(payload).eq('id', form.id));
    } else {
      payload.slug = slugify(form.title || 'xeber');
      ({ error } = await supabase.from('articles').insert(payload));
    }

    setSaving(false);
    if (error) {
      setMessage('Xəta: ' + error.message);
      return;
    }
    setMessage(form.id ? 'Xəbər yeniləndi.' : 'Xəbər əlavə edildi.');
    setForm(emptyForm);
    loadArticles();
  }

  function handleEdit(article) {
    setForm({
      id: article.id,
      title: article.title,
      excerpt: article.excerpt || '',
      content: article.content,
      category: article.category,
      source: article.source || '',
      image_url: article.image_url || '',
      is_featured: article.is_featured,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function handleDelete(id) {
    if (!confirm('Bu xəbəri silmək istədiyinə əminsən?')) return;
    await supabase.from('articles').delete().eq('id', id);
    loadArticles();
  }

  async function toggleFeatured(article) {
    await supabase.from('articles').update({ is_featured: !article.is_featured }).eq('id', article.id);
    loadArticles();
  }

  if (session === undefined) {
    return <div className="max-w-4xl mx-auto px-6 py-16 text-sm text-gray-500">Yüklənir...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-serif text-2xl font-semibold">Admin panel</h1>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-crimson">
          Çıxış et
        </button>
      </div>

      {/* ---------- FORM ---------- */}
      <form onSubmit={handleSubmit} className="bg-panel p-6 mb-10 flex flex-col gap-4">
        <h2 className="font-serif text-lg font-semibold">
          {form.id ? '✏️ Xəbəri redaktə et' : '➕ Yeni xəbər əlavə et'}
        </h2>

        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1">📝 Başlıq</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-line rounded-sm px-3 py-2 text-sm bg-white"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1">Qısa təsvir (excerpt)</label>
          <input
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="w-full border border-line rounded-sm px-3 py-2 text-sm bg-white"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1">📄 Xəbər mətni</label>
          <textarea
            required
            rows={8}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full border border-line rounded-sm px-3 py-2 text-sm bg-white"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">📂 Kateqoriya</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-line rounded-sm px-3 py-2 text-sm bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">📰 Mənbə</label>
            <input
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
              placeholder="məs. APA.AZ"
              className="w-full border border-line rounded-sm px-3 py-2 text-sm bg-white"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 block mb-1">🖼️ Xəbər şəkli</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
          {uploading && <p className="text-xs text-gray-400 mt-1">Yüklənir...</p>}
          {form.image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.image_url} alt="Önbaxış" className="mt-2 h-28 object-cover rounded-sm" />
          )}
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
          />
          ⭐ Baş xəbər et
        </label>

        {message && <p className="text-sm text-blue">{message}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-ink text-white px-5 py-2 rounded-sm text-sm font-semibold hover:bg-ink2 disabled:opacity-50"
          >
            {saving ? 'Saxlanılır...' : form.id ? 'Yenilə' : 'Əlavə et'}
          </button>
          {form.id && (
            <button
              type="button"
              onClick={() => setForm(emptyForm)}
              className="text-sm text-gray-500"
            >
              Ləğv et
            </button>
          )}
        </div>
      </form>

      {/* ---------- LIST ---------- */}
      <h2 className="font-serif text-lg font-semibold mb-4">Bütün xəbərlər ({articles.length})</h2>
      <div className="flex flex-col gap-2">
        {articles.map((a) => (
          <div key={a.id} className="flex items-center justify-between border border-line rounded-sm px-4 py-3">
            <div className="min-w-0">
              <div className="text-sm font-semibold truncate">
                {a.is_featured && '⭐ '}
                {a.title}
              </div>
              <div className="text-xs text-gray-400">{a.category} · {a.views || 0} baxış</div>
            </div>
            <div className="flex gap-3 flex-none ml-4">
              <button onClick={() => toggleFeatured(a)} className="text-xs text-gray-500 hover:text-blue">
                {a.is_featured ? 'Baş xəbərdən çıxar' : 'Baş xəbər et'}
              </button>
              <button onClick={() => handleEdit(a)} className="text-xs text-blue">Redaktə</button>
              <button onClick={() => handleDelete(a.id)} className="text-xs text-crimson">Sil</button>
            </div>
          </div>
        ))}
        {articles.length === 0 && <p className="text-sm text-gray-400">Hələ xəbər yoxdur.</p>}
      </div>
    </div>
  );
}
