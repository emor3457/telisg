<div align="center">
  <img src="assets/icon.png" alt="Logo" width="100" height="100">
  <h1 align="center">Telisg Pro - EHS Management System</h1>
  <p align="center">
    Yeni Nesil, Yapay Zeka Destekli İş Sağlığı ve Güvenliği Uygulaması
    <br />
    <br />
    <a href="https://github.com/emor3457/telisg/issues">Hata Bildir</a>
    ·
    <a href="https://github.com/emor3457/telisg/issues">Özellik İste</a>
  </p>
</div>

<details>
  <summary>Tablo İçeriği</summary>
  <ol>
    <li><a href="#proje-hakkında">Proje Hakkında</a></li>
    <li><a href="#özellikler">Özellikler</a></li>
    <li><a href="#teknoloji-yığını">Teknoloji Yığını</a></li>
    <li><a href="#kurulum">Kurulum</a></li>
    <li><a href="#mimari-ve-veri-yönetimi">Mimari ve Veri Yönetimi</a></li>
    <li><a href="#yapay-zeka-entegrasyonu">Yapay Zeka Entegrasyonu</a></li>
    <li><a href="#lisans">Lisans</a></li>
  </ol>
</details>

## Proje Hakkında

**Telisg Pro**, sahadaki İş Sağlığı ve Güvenliği (İSG / EHS) süreçlerini modernize etmek için geliştirilmiş mobil odaklı bir yönetim sistemidir. Kullanıcıların sahadaki tehlikeleri anında fotoğraflayıp raporlamasını, yapay zeka desteğiyle risk analizi yapmasını ve ISO 45001 standartlarına uygun düzeltici/önleyici faaliyet (DÖF) oluşturmasını sağlar.

## Özellikler

*   📸 **Fotoğraflı Saha Gözlemi:** Anında fotoğraf çekerek veya galeriden seçerek tehlikeleri kayıt altına alma.
*   🤖 **AI Destekli Risk Analizi:** Google Gemini 2.5 Flash modeli ile görseller üzerinden otomatik tehlike tespiti, risk seviyesi belirleme ve aksiyon önerme.
*   ⏱️ **Dinamik SLA Yönetimi:** Risk seviyelerine göre otomatik hedeflenen kapanış tarihleri (Kritik: 1 Gün, Yüksek: 7 Gün, Orta: 1 Ay, Düşük: 2 Ay).
*   🔢 **İzlenebilir Kodlama:** Tüm gözlem ve aksiyonların `IST-TT-SG26-XXXX` ve `IST-TT-DF26-XXXX` formatında hiyerarşik olarak kodlanması.
*   📄 **ISO 45001 Uyumlu Raporlama:** Gözlem ve aksiyonların profesyonel, kurum içi standartlara uygun PDF formatında dışa aktarılması.
*   🗄️ **Veri Yönetimi:** Local-first mimaride verilerin JSON olarak yedeklenmesi ve geri yüklenmesi.
*   🎨 **Gelişmiş UX/UI:** Anthropic marka kimliği (Brand Guidelines) ve "Systematic Reverence" tasarım felsefesini yansıtan temiz, odaklı ve profesyonel arayüz (Poppins ve Lora font aileleri).

## Teknoloji Yığını

*   **Framework:** [React Native](https://reactnative.dev/) / [Expo](https://expo.dev/) (SDK 54)
*   **Navigasyon:** Expo Router (File-based Routing)
*   **Durum Yönetimi (State):** [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) + AsyncStorage (Persist)
*   **Yapay Zeka:** `@google/generative-ai` (Gemini API)
*   **Raporlama & Dosya İşlemleri:** `expo-print`, `expo-sharing`, `expo-file-system`, `expo-document-picker`
*   **UI/Animasyon:** `react-native-reanimated`, `react-native-svg`, `react-native-swipe-list-view`, `react-native-chart-kit`

## Kurulum

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin.

### Ön Koşullar

*   Node.js (v18 veya üzeri önerilir)
*   npm veya yarn
*   Expo Go (Telefonunuzda test etmek için)

### Adımlar

1.  Repoyu klonlayın
    ```sh
    git clone https://github.com/emor3457/telisg.git
    ```
2.  Proje dizinine gidin
    ```sh
    cd telisg/ehs-management-system
    ```
3.  NPM paketlerini yükleyin
    ```sh
    npm install
    ```
4.  Gerekirse Gemini API Anahtarını ayarlayın
    *   `.env` dosyasını açıp `EXPO_PUBLIC_GEMINI_API_KEY` alanına kendi anahtarınızı girebilirsiniz. (Repo'da tanımlı olan anahtar test amaçlıdır).
5.  Uygulamayı başlatın
    ```sh
    npm start
    ```

## Mimari ve Veri Yönetimi

Uygulama, "Offline-First" prensibine yakın bir şekilde tasarlanmıştır. `store/observationStore.ts` ve `store/actionStore.ts` kullanılarak Zustand üzerinden tutulan veriler, AsyncStorage ile cihazın yerel hafızasına yazılır. 

*   **Veri Yedekleme:** `Profil` ekranındaki Veri Yönetimi panelinden tüm verileri JSON olarak indirebilir ve paylaşabilirsiniz.
*   **Şema:** Her aksiyon, türetildiği gözlemin izini (`parentDisplayId`) sürer.

## Yapay Zeka Entegrasyonu

Gözlem sırasında alınan fotoğraf base64 formatına çevrilerek Google Gemini API'sine gönderilir. Özel bir prompt ile görseldeki riskler Türkçe olarak analiz edilir, risk skoru hesaplanır ve mühendislik/idari kontrol tavsiyeleri JSON olarak döndürülerek doğrudan sisteme kaydedilir.

## Tasarım Felsefesi

Proje, **Systematic Reverence** adını verdiğimiz özel bir tasarım felsefesine dayanmaktadır. Bu felsefe;
*   Klinik ve teknik hassasiyeti,
*   İnsan odaklı güvenliği,
*   Grid sistemlerini ve dikkat dağıtmayan "Sinyal Renklerini" vurgular.

## Lisans

Bu proje kişisel / eğitim amaçlı bir geliştirme olup, ticari kullanımda sorumluluk kullanıcıya aittir.

---
*Bu README dosyası Gemini CLI asistanı tarafından oluşturulmuştur.*
