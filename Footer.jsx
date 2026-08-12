import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';

export default function Footer() {
  return (
    <footer className="bg-ink text-gray-300 mt-10">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          <div className="col-span-2">
            <div className="font-serif text-xl font-bold text-white mb-2">PANORAMA</div>
            <p className="text-sm text-gray-400 max-w-xs">
              Gündəlik xəbər portalı — sürətli, dəqiq və mobil dostu.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Bölmələr</h4>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.slice(0, 4).map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}`} className="hover:text-white">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-gray-500 mb-3">Daha çox</h4>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.slice(4).map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}`} className="hover:text-white">{c.name}</Link>
                </li>
              ))}
              <li><Link href="/admin" className="hover:text-white">Admin panel</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 text-xs text-gray-500 flex justify-between flex-wrap gap-2">
          <span>© {new Date().getFullYear()} PANORAMA</span>
          <span>Supabase + Vercel ilə qurulub</span>
        </div>
      </div>
    </footer>
  );
}
