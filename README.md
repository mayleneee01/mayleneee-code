# Mayleneee.code

Mayleneee.code adalah platform pembelajaran coding dan hacking interaktif berbasis proyek (hands-on) yang dirancang untuk pelajar, mahasiswa, dan calon profesional keamanan siber. Platform ini menggabungkan lingkungan laboratorium virtual langsung, modul pembelajaran terstruktur, dan elemen gamifikasi untuk memberikan pengalaman belajar yang mendalam dan tidak membosankan.

---

## Fitur Utama

- **Interactive Cloud Terminals & Labs**: Infrastruktur berbasis kontainer terisolasi yang memungkinkan pengguna menyelesaikan tantangan coding dan hacking secara langsung (gaya HackTheBox).
- **Gamified Leaderboard & Hint System**: Sistem peringkat kompetitif berdasarkan perolehan poin. Dilengkapi fitur petunjuk (hint) bertingkat dengan konsekuensi pengurangan poin demi menjaga integritas kompetisi.
- **University-Standard Modules (ASD)**: Kurikulum akademik khusus untuk Algoritma dan Struktur Data (ASD) menggunakan bahasa C++ guna memperkuat logika dasar pemrograman.
- **Full Coding & Hacking Paths**: Cakupan kurikulum yang luas dari teknologi web dasar (HTML/CSS) hingga bahasa tingkat lanjut, serta metodologi pengujian penetrasi keamanan.
- **Enterprise-Grade Security**: Arsitektur yang diperkeras terhadap kerentanan OWASP Top 10, termasuk mitigasi ketat untuk Broken Access Control, XSS, dan pembatasan akses kontainer.
- **Freemium Access Model**: Akses terbuka untuk materi dasar, dan gerbang berlangganan aman untuk modul serta laboratorium tingkat lanjut.
- **Multi-Language Support (i18n)**: Dukungan penuh berbagai bahasa global dengan Bahasa Inggris sebagai default dan ketersediaan Bahasa Indonesia yang komprehensif.

---

## Desain & UI/UX

Platform ini menerapkan pendekatan visual profesional yang dioptimalkan untuk fokus jangka panjang tanpa gangguan elemen non-akademik (seperti emoji).

- **Default Theme**: Light Mode (Latar belakang putih bersih).
- **Alternative Theme**: Dark Mode (Dapat dialihkan melalui menu navigasi).
- **Palet Warna**:
  - **Biru**: Warna dominan untuk struktur, teks utama, dan navigasi (kepercayaan dan profesionalisme).
  - **Kuning**: Warna aksen untuk indikator penting, petunjuk, dan peringatan.
  - **Hijau**: Warna penanda keberhasilan, penyelesaian tantangan, dan tombol aksi utama.

---

## Arsitektur & Teknologi

Sistem dibangun menggunakan teknologi dengan efisiensi tinggi dan skalabilitas tinggi:

- **Frontend**: Next.js (React), Tailwind CSS, TypeScript.
- **Backend API**: Go (Golang) / Rust (untuk kecepatan eksekusi, manajemen memori aman, dan efisiensi konkurensi).
- **Lab Orchestration**: Docker API / Kubernetes untuk manajemen siklus hidup kontainer lab pengguna secara dinamis.
- **Database**: PostgreSQL (Data pengguna, modul, kuis) & Redis (Sistem Leaderboard dan Caching Session).
- **Authentication**: Paspor OAuth 2.0 (Google & GitHub) dengan enkripsi JWT berbasis rotasi kunci (Key Rotation).

---

## Persyaratan Sistem

Sebelum menjalankan proyek ini secara lokal, pastikan perangkat Anda telah terpasang:

- Docker Engine >= 24.0.0
- Go >= 1.21 / Node.js >= 18.x
- PostgreSQL >= 15

---

## Langkah Instalasi

### 1. Kloning Repositori

```bash
git clone [https://github.com/mayleneee01/mayleneee-code.git](https://github.com/mayleneee01/mayleneee-code.git)
cd mayleneee-code
```
