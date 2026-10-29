# İşyer — Tauri v2 Mobil (iOS / Android) ve Masaüstü Derleyici (`isyer-builder`)

Bu repo, **İşyer (`my.isyer.com`)** ve **İşyer Panel (`app.isyer.com`)** için Tauri v2 tabanlı iOS (`.ipa`), Android (`.apk`), Windows (`.exe` / `.msi`) ve macOS (`.dmg`) kurulum paketlerini GitHub Actions üzerinde ücretsiz derlemek için hazırlanmıştır.

> **Güvenlik Notu:** Asıl backend ve frontend kaynak kodları bu repoda yer almaz; yalnızca Tauri v2 yerel başlatıcı kabuğu, uygulama ikonları ve kamera izin tanımları bulunur.

---

## 1. Hızlı Kullanım (GitHub Actions ile Derleme)

1. GitHub'da **`isyer-builder`** adında **Public** bir repo oluştur.
2. Bu klasörü `push-to-github.ps1` script'i ile (veya standart `git push` ile) yeni repoya gönder:
   ```powershell
   .\push-to-github.ps1 -RepoUrl "https://github.com/<KULLANICI_ADIN>/isyer-builder.git"
   ```
3. GitHub'da `isyer-builder` reponun **Actions** sekmesine gir:
   - **Build iOS (.ipa):** `macos-15` üzerinde iOS `.ipa` paketi üretir (`target: my` veya `app` seçilebilir).
   - **Build Desktop (Windows & macOS):** Windows `.exe`/`.msi` ve macOS `.dmg` kurulum dosyalarını üretir (`target: app` veya `my` seçilebilir).
   - **Build Android (.apk):** Android `.apk` paketi üretir.
4. Derleme bittiğinde sayfanın altındaki **Artifacts** bölümünden `.ipa`, `.exe`, `.dmg` veya `.apk` dosyasını indir.

---

## 2. Apple Developer Hesabı Olmadan vs. Hesap Aldıktan Sonra

`build-ios.yml` iş akışı **otomatik sertifika algılamalı (hibrit)** çalışır:

### A) Şu An (Apple Developer Hesabı Yokken — Varsayılan)
- Hiçbir Secret eklemene gerek yoktur.
- Workflow otomatik olarak **İmzasız (`Unsigned .ipa`)** modunda çalışır ve `Isyer-my-unsigned.ipa` üretir.
- Bu dosyayı **Sideloadly**, **AltStore** veya **TrollStore** ile iPhone/iPad cihazına yükleyip test edebilirsin.

### B) İleride Apple Developer Hesabı Aldığında (Sıfır Kod Değişikliği)
Kodda hiçbir değişiklik yapmadan, GitHub reponda **Settings → Secrets and variables → Actions** bölümüne şu Secret'ları eklemen yeterlidir:

| Secret Adı | Açıklama |
|---|---|
| `APPLE_CERTIFICATE` | `.p12` dağıtım sertifikanın Base64 hali (`[Convert]::ToBase64String([IO.File]::ReadAllBytes("cert.p12"))`) |
| `APPLE_CERTIFICATE_PASSWORD` | `.p12` sertifikasına verdiğin parola |
| `APPLE_PROVISIONING_PROFILE` | `.mobileprovision` dosyasının Base64 hali |
| `APPLE_DEVELOPMENT_TEAM` | 10 haneli Apple Team ID kodun |
| `APPSTORE_API_KEY_ID` *(İsteğe bağlı)* | Otomatik TestFlight yüklemesi için App Store Connect Key ID |
| `APPSTORE_ISSUER_ID` *(İsteğe bağlı)* | App Store Connect Issuer ID |
| `APPSTORE_API_PRIVATE_KEY` *(İsteğe bağlı)* | `.p8` anahtar dosyasının içeriği |

Bu Secret'lar eklendiği anda `Build iOS (.ipa)` workflow'u otomatik olarak **imzalı `.ipa`** üretmeye ve **TestFlight**'a göndermeye başlar.

