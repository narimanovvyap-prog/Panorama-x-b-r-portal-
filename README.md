# PANORAMA — Xəbər Saytı (Supabase + Vercel)

Bu, tam işlək bir xəbər saytıdır: admin paneldən xəbər əlavə et, sayt avtomatik yenilənsin.

Aşağıdakı addımları ardıcıl et. Hər addımda ekran görüntüsü göndərsən, birlikdə yoxlaya bilərik.

---

## 1-Cİ ADDIM — Supabase layihəsi yarat

1. https://supabase.com ünvanına get, **Start your project** düyməsinə bas.
2. GitHub və ya e-poçtla qeydiyyatdan keç.
3. **New project** düyməsinə bas.
4. Layihəyə ad ver (məs. `xeber-sayti`), bir verilənlər bazası şifrəsi seç (yadda saxla!), region seç (Avropa üçün `eu-central` uyğundur).
5. **Create new project** düyməsinə bas və 1-2 dəqiqə gözlə.

## 2-Cİ ADDIM — SQL sxemini işə sal

1. Sol menyudan **SQL Editor** bölməsinə keç.
2. **New query** düyməsinə bas.
3. Bu layihədəki `supabase-schema.sql` faylının **tam məzmununu** kopyala və oraya yapışdır.
4. **Run** düyməsinə bas. "Success" mesajı görməlisən.

Bu, `articles` cədvəlini, təhlükəsizlik qaydalarını (RLS) və baxış sayğacı funksiyasını yaradır.

## 3-CÜ ADDIM — Media üçün Storage bucket-ları yarat

1. Sol menyudan **Storage** bölməsinə keç.
2. **New bucket** düyməsinə bas.
3. Aşağıdakı iki bucket-ı yarat (məhz bu adlarla):
   - `xeber-sekiller`
   - `xeber-videolari`
4. Hər ikisi üçün **Public bucket** seçimini AÇIQ et (toggle-ı yaşıl et).
5. **Create bucket** düyməsinə bas.

(Bucket policy-ləri artıq `supabase-schema.sql` faylında var, avtomatik işə düşür.)

## 4-CÜ ADDIM — Admin istifadəçisi yarat

1. Sol menyudan **Authentication** → **Users** bölməsinə keç.
2. **Add user** → **Create new user** düyməsinə bas.
3. Öz e-poçtunu və bir şifrə yaz.
4. **Auto Confirm User** seçimini aktiv et (əks halda təsdiq e-poçtu gözləməli olacaqsan).
5. Yarat.

Bu, admin panelə giriş üçün istifadə edəcəyin hesabdır.

## 5-Cİ ADDIM — API açarlarını götür

1. Sol menyudan **Project Settings** → **API** bölməsinə keç.
2. **Project URL** və **anon public** açarını kopyala.
3. Bu layihədəki `.env.local.example` faylını `.env.local` adı ilə köçür (kopyala, adını dəyiş).
4. İçindəki iki dəyəri öz Supabase məlumatlarınla doldur:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

## 6-CI ADDIM — Kompüterdə sına (könüllü, amma tövsiyə olunur)

Node.js quraşdırılmış olmalıdır (https://nodejs.org).

```bash
npm install
npm run dev
```

Sonra brauzerdə `http://localhost:3000` aç. `/admin` ünvanından daxil ol və ilk xəbərini əlavə et.

## 7-Cİ ADDIM — Vercel-ə yerləşdir

1. Bu layihəni GitHub-a yüklə (yeni repository yarat, faylları push et).
   - Əgər GitHub bilmirsənsə, mənə de — addım-addım göstərərəm.
2. https://vercel.com ünvanına get, GitHub hesabınla daxil ol.
3. **Add New Project** → az əvvəl yaratdığın repository-ni seç.
4. **Environment Variables** bölməsində eyni iki dəyəri əlavə et:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. **Deploy** düyməsinə bas. 1-2 dəqiqəyə saytın canlı olacaq.

---

## Sayt necə işləyir?

- **Admin panel** (`/admin`): daxil ol, xəbər əlavə et/redaktə et/sil, şəkil və ya video yüklə, "Baş xəbər" işarələ.
- **Əsas səhifə**: baş xəbər + son xəbərlər + "Ən çox oxunanlar". Videolu xəbər əsas bölmədə idarəetmə düymələri ilə görünür.
- **Kateqoriya səhifələri** (`/siyaset`, `/iqtisadiyyat` və s.): həmin kateqoriyadakı bütün xəbərlər.
- **Xəbər səhifəsi** (`/article/xeber-slug`): tam mətn, şəkil, baxış sayğacı avtomatik artır, "bunları da oxu" bölməsi.
- **Axtarış** (`/axtar?q=...`): başlıq, qısa təsvir və mətn üzrə axtarır.

Yeni xəbər əlavə etdiyin kimi, sayt dərhal (səhifə yenilənəndə) göstərəcək — ayrıca heç nə etməyə ehtiyac yoxdur.

---

## Kömək lazımdırsa

Hər addımda ilişsən, elə o addımın ekran görüntüsünü göndər — birlikdə davam edərik.
