import Link from 'next/link';

export const metadata = {
  title: 'Haqqımızda — PANORAMA',
  description: 'PANORAMA Xəbər Portalı haqqında',
};

export default function HaqqimizdaPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">

      <div className="border-b-2 border-ink pb-5 mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue mb-2">
          PANORAMA
        </p>

        <h1 className="font-serif text-3xl md:text-4xl font-bold">
          Haqqımızda
        </h1>
      </div>

      <div className="space-y-8 text-gray-700 leading-relaxed">

        <section>
          <h2 className="font-serif text-2xl font-semibold text-ink mb-3">
            PANORAMA Xəbər Portalı
          </h2>

          <p>
            PANORAMA oxuculara Azərbaycanda və dünyada baş verən ən son
            hadisələr barədə operativ, aktual və faydalı məlumat təqdim edən
            müasir xəbər portalıdır.
          </p>

          <p className="mt-3">
            Portalımızın əsas məqsədi xəbərləri mümkün qədər sürətli,
            aydın və oxucu üçün əlçatan formada təqdim etməkdir.
          </p>
        </section>

        <section className="border-t border-line pt-8">
          <h2 className="font-serif text-2xl font-semibold text-ink mb-3">
            Missiyamız
          </h2>

          <p>
            PANORAMA olaraq cəmiyyət üçün əhəmiyyətli olan hadisələri
            işıqlandırmağı, oxucularımıza aktual məlumat çatdırmağı və
            informasiya əldə etmək üçün etibarlı platforma formalaşdırmağı
            qarşıya məqsəd qoyuruq.
          </p>
        </section>

        <section className="border-t border-line pt-8">
          <h2 className="font-serif text-2xl font-semibold text-ink mb-3">
            Əsas prinsiplərimiz
          </h2>

          <ul className="space-y-3 list-disc pl-6">
            <li>Dəqiq və yoxlanılmış məlumatlara üstünlük vermək.</li>
            <li>Operativ xəbərləri oxuculara çatdırmaq.</li>
            <li>Məlumat mənbələrinə mümkün qədər istinad etmək.</li>
            <li>Oxucuya aydın və anlaşıqlı informasiya təqdim etmək.</li>
            <li>Şəxsi məlumatlara və müəllif hüquqlarına hörmət etmək.</li>
          </ul>
        </section>

        <section className="border-t border-line pt-8">
          <h2 className="font-serif text-2xl font-semibold text-ink mb-3">
            Bizimlə əlaqə
          </h2>

          <p>
            Təklif, irad, əməkdaşlıq və digər məsələlərlə bağlı bizimlə
            əlaqə saxlaya bilərsiniz.
          </p>

          <div className="mt-4">
            <Link
              href="/elaqe"
              className="inline-block bg-ink text-white px-5 py-2.5 text-sm font-semibold hover:bg-ink2"
            >
              Əlaqə səhifəsinə keç
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}