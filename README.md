# NotifKu Reminder App 🔔
> **Coursera Mobile Development Capstone Project**  
> Proyek Akhir Pengembangan Aplikasi Mobile menggunakan React Native & Expo.

---

## 📱 Ringkasan Proyek (Overview)
**NotifKu** adalah aplikasi mobile pengingat (*reminder*) dan produktivitas yang dirancang dengan arsitektur modern berbasis **React Native**, **TypeScript**, dan **Expo SDK 57**. Aplikasi ini mengimplementasikan sistem autentikasi lokal yang aman dengan enkripsi kata sandi SHA-256, manajemen pengingat dengan penjadwalan notifikasi lokal, integrasi REST API eksternal, manajemen preferensi tema dinamis (*Dark & Light Mode*), dan penyimpanan data lokal persisten menggunakan `AsyncStorage`.

---

## 🎯 Panduan Penilaian Rekan Sejawat (Peer-Reviewer Rubric Guide)

Tabel berikut memetakan 28 tugas penilaian proyek (100 Poin) ke file implementasi spesifik di dalam repositori ini:

| No | Kriteria Tugas Penilaian | Lokasi File / Bukti di Repositori | Poin |
|:--:|---|---|:--:|
| **1** | Repositori GitHub disetel ke visibilitas **"Public"** | Halaman Utama Repositori GitHub | 2 Pts |
| **2** | File markdown (.md) berisi **9 Cerita Pengguna (User Stories)** | [`user-stories.md`](user-stories.md) | 9 Pts |
| **3** | Tangkapan layar `figma-evidence1.png` (5 Layar Figma: Login, Register, Home, Detail, Profil) | Berkas Unggahan Gambar | 5 Pts |
| **4** | Tangkapan layar `figma-evidence2.png` (4 Layar Figma: API Edukasi, Menu Settings, Settings Screen, Notifikasi) | Berkas Unggahan Gambar | 4 Pts |
| **5** | Implementasi **Pendaftaran (Sign Up / Register)** | [`src/screens/RegisterScreen.tsx`](src/screens/RegisterScreen.tsx) | 4 Pts |
| **6** | Tangkapan layar `signup_screen_evidence.png` (3 Kolom: Username, Email, Password, Tombol Daftar, Link Login) | Berkas Unggahan Gambar | 6 Pts |
| **7** | Tangkapan layar `signup_error.png` (Validasi Kesalahan Registrasi) | Berkas Unggahan Gambar | 2 Pts |
| **8** | Implementasi **Login (Masuk)** | [`src/screens/LoginScreen.tsx`](src/screens/LoginScreen.tsx) | 4 Pts |
| **9** | Tangkapan layar `login_screen_evidence.png` (2 Kolom: Email/Username, Password, Tombol Masuk, Link Daftar) | Berkas Unggahan Gambar | 5 Pts |
| **10** | Tangkapan layar `login_error.png` (Validasi Kesalahan Login) | Berkas Unggahan Gambar | 2 Pts |
| **11** | Implementasi **Layar Beranda (Home Screen)** | [`src/screens/HomeScreen.tsx`](src/screens/HomeScreen.tsx) | 4 Pts |
| **12** | Tangkapan layar `home-screen-evidence.png` (Tata Letak Beranda & Logo `🔔 NotifKu` di Header) | Berkas Unggahan Gambar | 4 Pts |
| **13** | Implementasi **Layar Detail (Detail Screen)** | [`src/screens/DetailScreen.tsx`](src/screens/DetailScreen.tsx) | 4 Pts |
| **14** | Tangkapan layar `bukti-detail-navigasi.png` (Ikon Navigasi `→` pada Item Layar Utama) | Berkas Unggahan Gambar | 2 Pts |
| **15** | Tangkapan layar `evidence-detail-screen.png` (Layar Detail Menampilkan Informasi Item) | Berkas Unggahan Gambar | 2 Pts |
| **16** | Implementasi **Penyimpanan Lokal (Local Storage / Persistence)** | [`src/services/storageService.ts`](src/services/storageService.ts) | 4 Pts |
| **17** | Tangkapan layar `evidence-persistence.png` (Bukti Data Tersimpan di Penyimpanan Lokal) | Berkas Unggahan Gambar | 2 Pts |
| **18** | Tangkapan layar `evidence-integrateScreen-persistence.png` (Data Sinkron di UI Frontend & Storage Lokal) | Berkas Unggahan Gambar | 2 Pts |
| **19** | Implementasi **Integrasi API Eksternal (External API)** | [`src/services/apiService.ts`](src/services/apiService.ts) | 4 Pts |
| **20** | Tangkapan layar `evidence-api-ux.png` (Aplikasi Menampilkan Data yang Diambil dari API) | Berkas Unggahan Gambar | 2 Pts |
| **21** | Implementasi **Menu Pengaturan** | [`src/screens/SettingsScreen.tsx`](src/screens/SettingsScreen.tsx) | 4 Pts |
| **22** | Tangkapan layar `evidence-menu-icon.png` (Ikon Menu Pengaturan `⚙️` di Header) | Berkas Unggahan Gambar | 2 Pts |
| **23** | Tangkapan layar `evidence-menu-items.png` (Item Menu di Halaman Pengaturan) | Berkas Unggahan Gambar | 5 Pts |
| **24** | Implementasi **Layar Pengaturan (Settings Screen)** | [`src/screens/SettingsScreen.tsx`](src/screens/SettingsScreen.tsx) | 4 Pts |
| **25** | Tangkapan layar `evidence-settings-screen.png` (Tampilan Lengkap Layar Pengaturan) | Berkas Unggahan Gambar | 2 Pts |
| **26** | Implementasi **Sistem Notifikasi Lokal** | [`src/services/notificationService.ts`](src/services/notificationService.ts) | 4 Pts |
| **27** | Tangkapan layar `evidence-notification-configure.png` (Pengaturan Konfigurasi Notifikasi) | Berkas Unggahan Gambar | 2 Pts |
| **28** | Tangkapan layar `evidence-notification-alert.png` (Notifikasi Pengujian Berhasil Dipicu) | Berkas Unggahan Gambar | 4 Pts |
| **TOTAL** | **28 Tugas Penilaian Capstone Project** | **Selesai Lengkap** | **100 Pts** |

---

## 🛠️ Arsitektur & Teknologi (Tech Stack)

* **Framework**: [React Native](https://reactnative.dev/) + [Expo SDK 57](https://expo.dev/)
* **Bahasa**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
* **Navigasi**: [React Navigation V7 (Native Stack)](https://reactnavigation.org/)
* **Penyimpanan Lokal**: [`@react-native-async-storage/async-storage`](https://github.com/react-native-async-storage/async-storage)
* **Keamanan & Hashing**: [`expo-crypto`](https://docs.expo.dev/versions/latest/sdk/crypto/) (Enkripsi SHA-256)
* **Notifikasi Lokal**: [`expo-notifications`](https://docs.expo.dev/versions/latest/sdk/notifications/)
* **Date & Time Picker**: [`@react-native-community/datetimepicker`](https://github.com/react-native-datetimepicker/datetimepicker) + Preset Cepat
* **REST API**: Integrasi Real-Time dengan JSONPlaceholder API (`https://jsonplaceholder.typicode.com/posts`)

---

## 📂 Struktur Direktori Proyek

```text
├── assets/                  # Ikon aplikasi, splash screen, dan gambar
├── src/
│   ├── components/          # Komponen UI Reusable (CustomButton, CustomInput, ReminderCard, Container)
│   ├── context/             # State Management (AuthContext, ThemeContext)
│   ├── screens/             # Halaman Aplikasi:
│   │   ├── LoginScreen.tsx          # Layar Masuk / Autentikasi
│   │   ├── RegisterScreen.tsx       # Layar Pendaftaran Akun Baru
│   │   ├── HomeScreen.tsx           # Layar Beranda (Daftar Pengingat & Tab Edukasi API)
│   │   ├── CreateReminderScreen.tsx # Layar Buat Pengingat & Jadwal Notifikasi
│   │   ├── DetailScreen.tsx         # Layar Rincian Artikel & Toggle Favorit
│   │   ├── ProfileScreen.tsx        # Layar Profil Pengguna & Daftar Favorit
│   │   ├── SettingsScreen.tsx       # Layar Pengaturan (Tema Gelap, Notifikasi, Uji Alert)
│   │   └── AboutScreen.tsx          # Layar Informasi Tentang Aplikasi
│   ├── services/            # Modul Layanan:
│   │   ├── apiService.ts            # Komunikasi REST API JSONPlaceholder
│   │   ├── notificationService.ts   # Penjadwalan & Pengujian Notifikasi Lokal
│   │   └── storageService.ts        # Operasi CRUD AsyncStorage Persisten
│   └── utils/               # Utilitas Enkripsi (SHA-256 Hashing)
├── App.tsx                  # Root Navigation & Provider Wrap
├── app.json                 # Konfigurasi Expo & Plugin Android/iOS
├── package.json             # Dependensi Proyek
├── tsconfig.json            # Konfigurasi Kompiler TypeScript
└── user-stories.md          # Dokumentasi 9 Cerita Pengguna Lengkap
```

---

## 🚀 Cara Menjalankan Proyek (Getting Started)

### 1. Prasyarat (Prerequisites)
* [Node.js](https://nodejs.org/) (Versi 18 LTS atau lebih baru)
* npm atau yarn
* Aplikasi **Expo Go** pada perangkat HP Android / iOS (Opsional untuk testing fisik)

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Aplikasi
* **Jalankan di Web Browser**:
  ```bash
  npm run web
  ```
  Buka `http://localhost:8081` di browser Anda.

* **Jalankan di Android Emulator / Fisik**:
  ```bash
  npm run android
  ```

* **Jalankan di iOS Simulator**:
  ```bash
  npm run ios
  ```

---

## ✨ Fitur-Fitur Utama

1. 🔐 **Autentikasi & Keamanan**:
   * Pendaftaran akun dengan validasi email dan panjang kata sandi.
   * Kata sandi di-hash dengan SHA-256 sebelum disimpan ke `AsyncStorage`.
   * Otentikasi login aman dengan manajemen session pengguna aktif.

2. 📅 **Manajemen Pengingat (Reminders)**:
   * Pembuatan pengingat dengan judul, deskripsi, tanggal, dan jam.
   * Tombol preset waktu cepat (+15 Menit, +1 Jam, +3 Jam, Hari Ini, Besok, Lusa).
   * Validasi waktu masa depan (mencegah pemilihan waktu lampau).
   * Menghapus pengingat dan membatalkan jadwal notifikasi sistem terkait.

3. 🔔 **Sistem Notifikasi Lokal**:
   * Penjadwalan notifikasi alarm/suara tepat waktu menggunakan `expo-notifications`.
   * Tombol *Uji Notifikasi Sekarang* di halaman Pengaturan untuk memicu notifikasi pengujian.

4. 📰 **Integrasi REST API**:
   * Mengambil artikel tips produktivitas dan edukasi dari JSONPlaceholder API.
   * Membaca rincian artikel di Layar Detail dan menyimpannya ke daftar Favorit.

5. 🎨 **Personalisasi Tema & Profil**:
   * Dukungan Mode Gelap (*Dark Mode*) dan Mode Terang (*Light Mode*) yang tersimpan persisten.
   * Halaman profil menampilkan avatar, identitas pengguna, dan daftar artikel favorit.

---

## 📄 Lisensi
Proyek ini dibuat untuk keperluan penyelesaian **Capstone Project Coursera - Mobile App Development**. Bebas digunakan untuk referensi pembelajaran.
