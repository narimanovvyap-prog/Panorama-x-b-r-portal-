'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError('Giriş uğursuz oldu. E-poçt və ya şifrəni yoxla.');
      return;
    }
    router.push('/admin/dashboard');
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <h1 className="font-serif text-2xl font-semibold mb-1">Admin girişi</h1>
      <p className="text-sm text-gray-500 mb-6">
        Supabase Authentication bölməsində yaratdığın istifadəçi ilə daxil ol.
      </p>
      <form onSubmit={handleLogin} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="E-poçt"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-line rounded-sm px-3 py-2 text-sm"
        />
        <input
          type="password"
          required
          placeholder="Şifrə"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-line rounded-sm px-3 py-2 text-sm"
        />
        {error && <p className="text-crimson text-xs">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="bg-ink text-white rounded-sm py-2 text-sm font-semibold hover:bg-ink2 disabled:opacity-50"
        >
          {loading ? 'Yoxlanılır...' : 'Daxil ol'}
        </button>
      </form>
    </div>
  );
}
