export const metadata = {
  title: 'Əlaqə — PANORAMA',
  description: 'PANORAMA Xəbər Portalı ilə əlaqə',
};

export default function ElaqePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <div className="border-b-2 border-ink pb-5 mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue mb-2">
          PANORAMA
        </p>

        <h1 className="font-serif text-3xl md:text-4xl font-bold">
          Əlaqə
        </h1>

        <p className="text-gray-600 mt-3">
          PANORAMA Xəbər Portalı ilə əlaqə saxlamaq üçün aşağıdakı
          vasitələrdən istifadə edə bilərsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {/* TELEFON */}
        <a
          href="tel:+994553737900"
          className="border border-line bg-panel p-6"
        >
          <div className="text-3xl mb-3">📱</div>

          <h2 className="font-serif text-xl font-bold mb-2">
            Telefon
          </h2>

          <p className="text-blue font-semibold">
            055 373 79 00
          </p>
        </a>

        {/* E-POÇT */}
        <a
          href="mailto:panoramaxeber@gmail.com"
          className="border border-line bg-panel p-6"
        >
          <div className="text-3xl mb-3">📧</div>

          <h2 className="font-serif text-xl font-bold mb-2">
            E-poçt
          </h2>

          <p className="text-blue font-semibold break-all">
            panoramaxeber@gmail.com
          </p>
        </a>

        {/* WHATSAPP */}
        <a
          href="https://wa.me/994553737900"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-line bg-panel p-6"
        >
          <div className="text-3xl mb-3">💬</div>

          <h2 className="font-serif text-xl font-bold mb-2">
            WhatsApp
          </h2>

          <span className="inline-block bg-ink text-white px-4 py-2 text-sm font-semibold">
            WhatsApp-la əlaqə saxla
          </span>
        </a>

        {/* XƏBƏR GÖNDƏR */}
        <div className="border border-line bg-panel p-6">
          <div className="text-3xl mb-3">📰</div>

          <h2 className="font-serif text-xl font-bold mb-2">
            Xəbər göndər
          </h2>

          <p className="text-sm text-gray-500 mb-4">
            Xəbər, foto və video materiallarınızı bizimlə paylaşın.
          </p>

          <a
            href="mailto:panoramaxeber@gmail.com"
            className="inline-block bg-ink text-white px-4 py-2 text-sm font-semibold"
          >
            Xəbər göndər
          </a>
        </div>

      </div>
    </main>
  );
}