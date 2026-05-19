# 🚀 Telisg Pro — Güncelleme & Yayınlama Yol Haritası

> Bu doküman, uygulamanın nasıl güncelleneceğini, yeni sürümlerin nasıl yayınlanacağını
> ve gelecek özellik planlamasını tek bir yerden yönetmek için hazırlanmıştır.
>
> **Son güncelleme:** 19 Mayıs 2026
> **Mevcut sürüm:** v1.1.0 (versionCode: 1)

---

## 📋 İçindekiler

1. [Hızlı Referans — 5 Dakikada Güncelleme Yayınla](#-hızlı-referans--5-dakikada-güncelleme-yayınla)
2. [Sürüm Numaralama Kuralları](#-sürüm-numaralama-kuralları)
3. [Adım Adım Güncelleme Süreci](#-adım-adım-güncelleme-süreci)
4. [Build Profilleri ve Kullanım Senaryoları](#-build-profilleri-ve-kullanım-senaryoları)
5. [Environment Variables Yönetimi](#-environment-variables-yönetimi)
6. [Proje Mevcut Durum Haritası](#-proje-mevcut-durum-haritası)
7. [Gelecek Özellik Yol Haritası](#-gelecek-özellik-yol-haritası)
8. [Sorun Giderme](#-sorun-giderme)

---

## ⚡ Hızlı Referans — 5 Dakikada Güncelleme Yayınla

Her güncelleme için bu adımları sırayla uygulayın:

```bash
# 1. Kodları düzenle ve test et
npm start                          # Expo Go ile yerel test

# 2. Sürüm numaralarını güncelle
#    → app.json: "version" ve "android.versionCode" artır
#    → package.json: "version" güncelle
#    → CHANGELOG.md: değişiklikleri yaz

# 3. Git'e kaydet
git add .
git commit -m "release: v1.2.0 - açıklama"

# 4. Build al ve yayınla
eas build -p android --profile preview     # APK (direkt dağıtım)
eas build -p android --profile production  # AAB (Play Store)
```

> **💡 İpucu:** Build bittikten sonra terminalde çıkan linki telefondan açın, indirin, kurun. Bitti!

---

## 🔢 Sürüm Numaralama Kuralları

[Semantic Versioning](https://semver.org/) kullanıyoruz: `MAJOR.MINOR.PATCH`

| Değişiklik Türü | Örnek | Ne Zaman? |
|---|---|---|
| **PATCH** `1.1.0 → 1.1.1` | Bug fix, typo düzeltme | Küçük hata düzeltmeleri |
| **MINOR** `1.1.0 → 1.2.0` | Yeni özellik ekleme | Push bildirim, offline mod gibi |
| **MAJOR** `1.2.0 → 2.0.0` | Büyük mimari değişiklik | Backend değişikliği, UI overhaul |

### Güncellenmesi Gereken 3 Yer

| Dosya | Alan | Örnek |
|---|---|---|
| `app.json` | `expo.version` | `"1.2.0"` |
| `app.json` | `expo.android.versionCode` | `2` (her build'de +1) |
| `package.json` | `version` | `"1.2.0"` |

> ⚠️ **Kritik:** `versionCode` her Play Store güncellemesinde **mutlaka artmalıdır**. Aksi halde Google reddeder.

---

## 📝 Adım Adım Güncelleme Süreci

### Adım 1: Kodu Düzenle

Değişikliklerinizi yapın. Proje yapısı:

```
app/                    # Ekranlar (file-based routing)
├── (tabs)/             # Alt sekmeler (Dashboard, Actions, vs.)
├── auth/               # Giriş/Kayıt ekranları
├── camera/             # Kamera ekranı
├── observations/       # Gözlem detay ekranları
└── scanner/            # QR tarayıcı

components/             # Yeniden kullanılabilir bileşenler
services/               # API, AI, rapor servisleri
store/                  # Zustand state yönetimi
theme/                  # Renk ve stil tanımları
```

### Adım 2: Yerel Test

```bash
npm start
# Telefonda Expo Go ile QR okutun veya
# Android emülatörde "a" tuşuna basın
```

### Adım 3: Sürüm Güncelle

`app.json` dosyasında:
```json
{
  "expo": {
    "version": "1.2.0",
    "android": {
      "versionCode": 2
    }
  }
}
```

`package.json` dosyasında:
```json
{
  "version": "1.2.0"
}
```

### Adım 4: CHANGELOG.md Güncelle

```markdown
## [1.2.0] - 2026-06-XX
### Eklendi
- Yeni özellik açıklaması

### İyileştirildi
- Düzeltme açıklaması
```

### Adım 5: Git Commit

```bash
git add .
git commit -m "release: v1.2.0 - kısa açıklama"
git tag v1.2.0
```

### Adım 6: Build Al

```bash
# Telefona direkt APK olarak
eas build -p android --profile preview

# VEYA Play Store için AAB olarak
eas build -p android --profile production
```

### Adım 7: Dağıt

- **APK:** Terminaldeki linki telefondan açın → indirin → kurun
- **Play Store:** Google Play Console'a AAB dosyasını yükleyin

---

## 🏗️ Build Profilleri ve Kullanım Senaryoları

| Profil | Komut | Çıktı | Ne İçin? |
|---|---|---|---|
| `preview` | `eas build -p android --profile preview` | `.apk` | Test, doğrudan dağıtım |
| `production` | `eas build -p android --profile production` | `.aab` | Google Play Store |
| `development` | `eas build -p android --profile development` | Dev client | Geliştirme sırasında |

---

## 🔐 Environment Variables Yönetimi

API anahtarları EAS'ta güvenli şekilde saklanıyor. Yeni bir değişken eklemek veya güncellemek için:

### Mevcut Değişkenler (preview ortamı)

| Değişken | Görünürlük |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Plain text |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Sensitive |
| `EXPO_PUBLIC_GEMINI_API_KEY` | Sensitive |

### Yeni Değişken Ekleme

```bash
eas env:create --scope project \
  --name DEGISKEN_ADI \
  --value "deger" \
  --visibility sensitive \
  --environment preview production \
  --non-interactive
```

### Mevcut Değişkeni Güncelleme

```bash
eas env:update --scope project \
  --name DEGISKEN_ADI \
  --value "yeni_deger" \
  --environment preview \
  --non-interactive
```

### Değişkenleri Listeleme

```bash
eas env:list
```

> ⚠️ **Önemli:** Production build'leri için de aynı değişkenlerin `production` ortamına eklenmesi gerekir:
> ```bash
> eas env:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "..." --visibility plaintext --environment production --non-interactive
> ```

---

## 🗺️ Proje Mevcut Durum Haritası

### ✅ Tamamlanan Özellikler (v1.1.0)

| Modül | Durum | Dosyalar |
|---|---|---|
| AI Risk Analizi (Gemini) | ✅ %100 | `services/aiAnalysis.ts` |
| Supabase Auth | ✅ %95 | `context/AuthContext.tsx`, `services/supabase.ts` |
| Supabase Sync | ✅ %100 | `services/syncService.ts` |
| Dashboard | ✅ %100 | `app/(tabs)/dashboard.tsx` |
| Aksiyon Takip | ✅ %100 | `app/(tabs)/actions.tsx`, `store/actionStore.ts` |
| Saha Gözlemleri | ✅ %100 | `app/(tabs)/observations.tsx`, `store/observationStore.ts` |
| Analitik/Grafikler | ✅ %100 | `app/(tabs)/analytics.tsx` |
| QR Kod Denetimi | ✅ %100 | `app/scanner/index.tsx` |
| PDF Raporlama | ✅ %100 | `services/reportService.ts` |
| SLA Yönetimi | ✅ %100 | `services/slaService.ts` |
| Veri Yedekleme | ✅ %100 | `services/dataManager.ts` |
| Profil & Ayarlar | ✅ %100 | `app/(tabs)/profile.tsx` |

### ⚠️ Bilinen Sınırlamalar

- **Push Bildirim:** Henüz yok
- **Offline-First:** Kısmi (AsyncStorage, tam SQLite değil)
- **Rol Tabanlı Erişim:** Temel düzeyde

---

## 🛣️ Gelecek Özellik Yol Haritası

### 🟢 Faz 1 — Kısa Vadeli (v1.2.0 – v1.3.0)
> Tahmini süre: 1-2 hafta each

| # | Özellik | Öncelik | Efor | Etkilenen Dosyalar |
|---|---|---|---|---|
| 1 | **Push Bildirimleri** | 🔴 Yüksek | ~6 saat | Yeni: `services/notificationService.ts` |
| | FCM + `expo-notifications` entegrasyonu | | | `app.json` → plugin ekle |
| | Kritik risk bildirimi, aksiyon atama bildirimi | | | `store/settingsStore.ts` |
| 2 | **OTA (Over-The-Air) Updates** | 🔴 Yüksek | ~2 saat | `eas.json`, `app.json` |
| | `eas update` ile build almadan güncelleme | | | |
| 3 | **Koyu Mod (Dark Mode)** | 🟡 Orta | ~4 saat | `theme/colors.ts` → dark palette |
| | `settingsStore`'da toggle zaten var | | | Tüm ekranlar |
| 4 | **Çoklu Dil Desteği (i18n)** | 🟡 Orta | ~6 saat | Yeni: `i18n/` klasörü |
| | Türkçe + İngilizce başlangıç | | | |

### 🟡 Faz 2 — Orta Vadeli (v1.4.0 – v1.6.0)
> Tahmini süre: 2-4 hafta each

| # | Özellik | Öncelik | Efor |
|---|---|---|---|
| 5 | **Gelişmiş Offline-First** (WatermelonDB/SQLite) | 🟡 Orta | ~3 gün |
| 6 | **Ekip Yönetimi & Rol Tabanlı Erişim** | 🟡 Orta | ~2 gün |
| 7 | **Fotoğraf Galeri & Timeline** | 🟢 Düşük | ~1 gün |
| 8 | **Sesli Not Ekleme** | 🟢 Düşük | ~4 saat |
| 9 | **Harita Entegrasyonu** (gözlem konumu) | 🟢 Düşük | ~1 gün |

### 🔴 Faz 3 — Uzun Vadeli (v2.0.0)
> Tahmini süre: 1-2 ay

| # | Özellik | Öncelik | Efor |
|---|---|---|---|
| 10 | **Web Dashboard** (yönetici paneli) | 🟡 Orta | ~1 hafta |
| 11 | **SAP/ERP Entegrasyonu** | 🔴 Yüksek | ~5 gün |
| 12 | **Gelişmiş AI** (PPE algılama, video analiz) | 🟡 Orta | ~1 hafta |
| 13 | **Power BI Raporlama** | 🟢 Düşük | ~3 gün |

---

## 🔧 Faydalı Komutlar Çizelgesi

```bash
# ──── GELİŞTİRME ────
npm start                              # Expo dev server başlat
npm test                               # Jest testleri çalıştır
npm run lint                           # TypeScript tip kontrolü

# ──── SAĞLIK KONTROLÜ ────
npx expo-doctor                        # Bağımlılık uyumluluğu kontrolü
npx expo install --check               # Paket sürümlerini kontrol et

# ──── BUILD ────
eas build -p android --profile preview      # APK (test/dağıtım)
eas build -p android --profile production   # AAB (Play Store)

# ──── OTA GÜNCELLEME (build almadan) ────
eas update --branch preview --message "v1.2.1 hotfix"

# ──── ENV YÖNETİMİ ────
eas env:list                           # Değişkenleri listele
eas env:create ...                     # Yeni ekle
eas env:update ...                     # Güncelle

# ──── GIT ────
git add .
git commit -m "feat: özellik açıklaması"
git tag v1.2.0
git push origin main --tags

# ──── PLAY STORE ────
eas submit -p android --profile production  # Otomatik Play Store yükleme
```

---

## 🆘 Sorun Giderme

### "supabaseUrl is required" hatası
**Neden:** EAS build ortamında env değişkenleri tanımlı değil.
```bash
eas env:list                           # Kontrol et
eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "..." --visibility plaintext --environment preview production --non-interactive
```

### "expo doctor" hataları
```bash
npx expo install --fix                 # Otomatik düzelt
```

### Build kuyruğu çok uzun
EAS ücretsiz plan kuyruğu yoğun olabiliyor. Alternatifler:
- `eas build --local` (yerel build, Android SDK gerekir)
- EAS Production plan ($99/ay, öncelikli kuyruk)

### Uygulamayı güncelledim ama telefonda eski versiyon
1. Eski APK'yı telefondan **kaldırın**
2. Yeni APK'yı **indirip** kurun
3. Veya OTA updates kullanın (Faz 1 #2)

### Git "not a git repository" hatası
```bash
git init
git add .
git commit -m "init"
```

---

## 📊 Sürüm Geçmişi (Hızlı Referans)

| Sürüm | Tarih | versionCode | Öne Çıkan |
|---|---|---|---|
| v1.0.0 | 2026-05-09 | — | İlk sürüm, temel EHS + Gemini |
| v1.1.0 | 2026-05-19 | 1 | Supabase, QR, PDF, EAS build ✅ |
| v1.2.0 | *Planlanıyor* | 2 | Push bildirim, OTA, Dark mode |

---

> 📌 **Bu dosyayı her güncelleme döngüsünde açın, adımları takip edin, CHANGELOG'u güncelleyin.**
> Tutarlı bir süreç izlemek projenin uzun ömürlü olmasını garanti eder.
