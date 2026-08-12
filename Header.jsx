'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CATEGORIES } from '@/lib/categories';

export default function Header() {
  const router = useRouter();
  const [q, setQ] = useState('');

  function handleSearch(e) {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/axtar?q=${encodeURIComponent(q.trim())}`);
    }
  }

  return (
    <header className="border-b-2 border-ink bg-bg sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="#10151C" strokeWidth="2" />
            <path d="M8 22C12 18 16 26 20 20C24 14 28 22 32 18" stroke="#1D4E89" strokeWidth="2" fill="none" />
          </svg>
          <div>
            <div className="font-serif text-2xl font-bold tracking-tight">PANORAMA</div>
            <div className="text-[10px] uppercase tracking-widest text-gray-500">Xəbər Portalı</div>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="hidden md:flex items-center border border-line rounded-sm overflow-hidden">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Axtar..."
            className="px-3 py-1.5 text-sm outline-none w-52"
          />
          <button type="submit" className="bg-ink text-white px-3 py-1.5 text-sm">Axtar</button>
        </form>
      </div>

      <nav className="bg-ink overflow-x-auto">
        <div className="max-w-6xl mx-auto px-6 flex items-center">
          <Link href="/" className="text-gray-300 hover:text-white text-sm font-semibold px-3 py-3 whitespace-nowrap">
            Əsas səhifə
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              className="text-gray-300 hover:text-white text-sm font-semibold px-3 py-3 whitespace-nowrap"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </nav>

      <form onSubmit={handleSearch} className="md:hidden flex border-b border-line">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Xəbər axtar..."
          className="flex-1 px-4 py-2 text-sm outline-none"
        />
        <button type="submit" className="bg-ink text-white px-4 text-sm">Axtar</button>
      </form>
    </header>
  );
}
