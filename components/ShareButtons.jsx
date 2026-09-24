'use client';

import { useState } from 'react';

export default function ShareButtons({ articleUrl, title }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(title || 'PANORAMA XƏBƏR');

  const telegramShareUrl =
    `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;

  const whatsappShareUrl =
    `https://wa.me/?text=${encodeURIComponent(
      `${title || 'PANORAMA XƏBƏR'}\n\n${articleUrl}`
    )}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Link kopyalanmadı:', error);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">

      {/* Telegram */}

      <a
        href={telegramShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-[#229ED9]
          px-4
          py-2.5
          text-sm
          font-bold
          text-white
          shadow-sm
          transition
          hover:-translate-y-0.5
          hover:shadow-md
        "
      >
        <span className="text-base">✈</span>
        <span>Telegram</span>
      </a>

      {/* WhatsApp */}

      <a
        href={whatsappShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-[#25D366]
          px-4
          py-2.5
          text-sm
          font-bold
          text-white
          shadow-sm
          transition
          hover:-translate-y-0.5
          hover:shadow-md
        "
      >
        <span className="text-base">☎</span>
        <span>WhatsApp</span>
      </a>

      {/* Linki kopyala */}

      <button
        type="button"
        onClick={copyLink}
        className="
          inline-flex
          items-center
          gap-2
          rounded-xl
          bg-gray-100
          px-4
          py-2.5
          text-sm
          font-bold
          text-gray-700
          border
          border-gray-200
          shadow-sm
          transition
          hover:-translate-y-0.5
          hover:bg-gray-200
          hover:shadow-md
        "
      >
        <span className="text-base">
          {copied ? '✓' : '🔗'}
        </span>

        <span>
          {copied ? 'Kopyalandı' : 'Linki kopyala'}
        </span>
      </button>

    </div>
  );
}
