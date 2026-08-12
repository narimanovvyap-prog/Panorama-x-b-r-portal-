export const CATEGORIES = [
  { slug: 'siyaset', name: 'Siyasət', color: '#B23A2E' },
  { slug: 'iqtisadiyyat', name: 'İqtisadiyyat', color: '#8A6D1F' },
  { slug: 'dunya', name: 'Dünya', color: '#1D4E89' },
  { slug: 'idman', name: 'İdman', color: '#3A7A52' },
  { slug: 'medeniyyet', name: 'Mədəniyyət', color: '#7A3A6D' },
  { slug: 'texnologiya', name: 'Texnologiya', color: '#2C7A78' },
  { slug: 'cemiyyet', name: 'Cəmiyyət', color: '#B2582E' },
];

export function categoryName(slug) {
  const found = CATEGORIES.find((c) => c.slug === slug);
  return found ? found.name : slug;
}

export function categoryColor(slug) {
  const found = CATEGORIES.find((c) => c.slug === slug);
  return found ? found.color : '#5A6473';
}

export function slugify(text) {
  const map = {
    ə: 'e', ı: 'i', ö: 'o', ü: 'u', ş: 's', ç: 'c', ğ: 'g',
    Ə: 'e', I: 'i', İ: 'i', Ö: 'o', Ü: 'u', Ş: 's', Ç: 'c', Ğ: 'g',
  };
  return text
    .split('')
    .map((ch) => map[ch] || ch)
    .join('')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    + '-' + Date.now().toString(36);
}
