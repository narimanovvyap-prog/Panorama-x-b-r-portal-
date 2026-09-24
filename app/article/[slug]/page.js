// ==========================================
 // PAYLAŞIM LİNKLƏRİ
// ==========================================

const articleUrl = `https://panoramaxeber.info.az/article/${article.slug}`;

const encodedUrl = encodeURIComponent(articleUrl);
const encodedTitle = encodeURIComponent(article.title || 'PANORAMA XƏBƏR');

const telegramShareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;

const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
  `${article.title || 'PANORAMA XƏBƏR'}\n\n${articleUrl}`
)}`;
