# Değişim Günlüğü (Changelog)

Tüm önemli değişiklikler bu dosyada kayıt altına alınacaktır.

## [1.2.2] - 2026-05-19

### Eklendi
- **Saha Bilgileri Seçicileri:** Gözlem kaydederken artık şu alanlar doldurulabilir:
  - **Bölüm (Lokasyon):** Ana lokasyon (C Hangar, D Hangar, LMH Binası vb.)
  - **Alt Bölüm:** Lokasyona bağlı alt alan (Dinlenme Alanı, Envanter Deposu vb.)
  - **Faaliyet:** Gözlem anındaki faaliyet türü (Bakım, Temizlik, Denetim vb.)
  - **Sorumlu Departman:** Aksiyon sorumluluğu verilecek departman
- **Referans Veri Yönetimi (Ayarlar):** Profil ekranından tüm listelere CRUD işlemi uygulanabilir:
  - Lokasyon ve alt lokasyon ekleme / düzenleme / silme
  - Departman ekleme / düzenleme / silme
  - Faaliyet türü ekleme / düzenleme / silme
- **Dinamik ID Format Editörü (Ayarlar):** Kayıt numarası şablonu özelleştirilebilir.
  - Token tabanlı yapı: `{LOC}`, `{TYPE}`, `{YEAR}`, `{MONTH}`, `{SEQ}`
  - Lokasyon kodu (örn. `IST`, `ANK`) ayarlanabilir
  - Canlı önizleme ile değişiklik anında görülür
- **Cascade Silme:** Bir gözlem silindiğinde bağlı tüm DÖF/aksiyon kayıtları da otomatik olarak silinir (yerel + Supabase).
  - Benzersiz numara çakışmasının önüne geçer.
  - `parentObservationId` alanı ile ilişki kuruldu.

### İyileştirildi
- `settingsStore.ts` → Lokasyon, departman, faaliyet ve ID format state yönetimi eklendi.
- `observationStore.ts` → `ObservationItem` modeline `location`, `subLocation`, `department`, `activity` alanları eklendi.
- `actionStore.ts` → `ActionItem` modeline `parentObservationId` eklendi; `removeByParentObservationId` fonksiyonu eklendi.
- `idService.ts` → Format token sistemi ve `locationCode` parametresi desteği eklendi (geriye dönük uyumlu).

---

## [1.1.0] - 2026-06-10
### Eklendi
- **Supabase Entegrasyonu:** Gerçek zamanlı veri senkronizasyonu ve bulut tabanlı depolama.
- **QR Kod Tarayıcı:** Saha ekipmanlarının denetimi için QR okuma yeteneği.
- **Kritik Uyarı Sistemi:** Dashboard üzerinde anlık risk bildirim banner'ı.
- **PDF Raporlama v2:** ISO 45001 uyumlu, kurumsal logolu ve imzalı rapor çıktısı.
- **Zustand Mağazaları:** `settingsStore` ve `imageStore` ile gelişmiş state yönetimi.

### İyileştirildi
- **Dashboard UI:** Modern "Systematic Reverence" tasarım felsefesiyle yenilenmiş arayüz.
- **Performans:** Veri yükleme ve senkronizasyon süreçleri optimize edildi.

## [1.0.0] - 2026-05-09
### İlk Sürüm
- Temel EHS yönetim sistemi özellikleri.
- Gemini AI analiz başlangıç entegrasyonu.
- Yerel depolama (AsyncStorage).
