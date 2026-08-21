# Cerita Pengguna (User Stories) - Aplikasi NotifKu

Dokumen ini berisi sembilan (9) cerita pengguna yang menjelaskan fungsionalitas utama aplikasi pengingat, notifikasi, integrasi API, dan personalisasi tema di aplikasi NotifKu.

---

### Cerita Pengguna 1: Registrasi Akun Pengguna Baru
*   **Sebagai:** Pengguna baru aplikasi
*   **Saya ingin:** Mendaftarkan akun baru menggunakan nama pengguna (username), email, dan kata sandi (password)
*   **Agar:** Saya memiliki akun pribadi yang aman untuk mengelola pengingat saya.
*   **Kriteria Penerimaan:**
    *   Sistem memvalidasi bahwa semua kolom wajib diisi.
    *   Sistem memvalidasi format email yang benar.
    *   Sistem memvalidasi panjang kata sandi minimal 6 karakter.
    *   Data kata sandi di-hash menggunakan SHA-256 sebelum disimpan ke AsyncStorage agar aman.

### Cerita Pengguna 2: Otentikasi dan Masuk (Login)
*   **Sebagai:** Pengguna yang sudah terdaftar
*   **Saya ingin:** Masuk ke aplikasi menggunakan email atau nama pengguna dan kata sandi yang sesuai
*   **Agar:** Saya dapat mengakses dashboard pengingat pribadi saya.
*   **Kriteria Penerimaan:**
    *   Sistem memverifikasi kredensial pengguna yang disimpan di AsyncStorage.
    *   Jika berhasil, sistem menyimpan status session login dan mengarahkan pengguna ke halaman Home.
    *   Jika gagal, sistem menampilkan pesan kesalahan login yang informatif.

### Cerita Pengguna 3: Sambutan Pengguna & Profil Personal
*   **Sebagai:** Pengguna yang sudah masuk
*   **Saya ingin:** Melihat sapaan nama pengguna saya ("Selamat datang, [username]") di halaman utama
*   **Agar:** Saya merasa bahwa aplikasi ini dipersonalisasi untuk akun saya.
*   **Kriteria Penerimaan:**
    *   Halaman utama menampilkan sapaan nama pengguna aktif secara dinamis dari data session.

### Cerita Pengguna 4: Daftar Pengingat (Reminders List)
*   **Sebagai:** Pengguna aplikasi
*   **Saya ingin:** Melihat daftar pengingat saya lengkap dengan judul, deskripsi, tanggal, waktu, dan statusnya
*   **Agar:** Saya dapat memantau jadwal dan aktivitas penting saya sehari-hari.
*   **Kriteria Penerimaan:**
    *   Daftar pengingat menampilkan data dalam bentuk kartu yang rapi.
    *   Jika belum ada data pengingat, aplikasi menampilkan pesan "Belum ada pengingat."
    *   Pengguna hanya dapat melihat pengingat yang dibuat oleh akun mereka sendiri (terfilter berdasarkan user ID).

### Cerita Pengguna 5: Membuat Pengingat Baru (Create Reminder)
*   **Sebagai:** Pengguna aplikasi
*   **Saya ingin:** Membuat pengingat baru dengan menentukan judul, deskripsi, tanggal, dan waktu menggunakan pemilih native (picker)
*   **Agar:** Saya dapat menjadwalkan notifikasi peringatan secara otomatis.
*   **Kriteria Penerimaan:**
    *   Sistem memvalidasi bahwa judul wajib diisi.
    *   Sistem melarang pemilihan waktu yang sudah lewat (lampau).
    *   Pengingat baru disimpan di AsyncStorage dan langsung memperbarui tampilan daftar di halaman utama.

### Cerita Pengguna 6: Menerima Notifikasi Lokal
*   **Sebagai:** Pengguna aplikasi
*   **Saya ingin:** Menerima notifikasi suara/peringatan di perangkat saya tepat pada waktu pengingat yang disetel
*   **Agar:** Saya tetap teringat pada jadwal tersebut meskipun aplikasi sedang ditutup atau berjalan di latar belakang.
*   **Kriteria Penerimaan:**
    *   Sistem menggunakan `expo-notifications` untuk menjadwalkan notifikasi lokal.
    *   Notifikasi menampilkan judul dan deskripsi pengingat dengan benar.

### Cerita Pengguna 7: Menghapus Pengingat & Pembatalan Notifikasi
*   **Sebagai:** Pengguna aplikasi
*   **Saya ingin:** Menghapus pengingat yang sudah selesai atau tidak diperlukan lagi
*   **Agar:** Daftar pengingat bersih, dan notifikasi yang telah dijadwalkan untuk pengingat tersebut dibatalkan dari sistem.
*   **Kriteria Penerimaan:**
    *   Terdapat tombol "Hapus" pada setiap kartu pengingat.
    *   Saat dihapus, data terhapus dari AsyncStorage dan jadwal notifikasi terkait dibatalkan menggunakan Notification ID.

### Cerita Pengguna 8: Membaca Artikel Edukasi (Integrasi API Eksternal)
*   **Sebagai:** Pengguna aplikasi
*   **Saya ingin:** Membaca artikel edukasi eksternal yang dimuat secara dinamis dari API internet di halaman utama
*   **Agar:** Saya bisa mendapatkan wawasan tambahan seputar tips kesehatan dan aktivitas produktif.
*   **Kriteria Penerimaan:**
    *   Aplikasi mengambil data secara real-time dari JSONPlaceholder API (`https://jsonplaceholder.typicode.com/posts`).
    *   Terdapat tombol navigasi pada setiap artikel untuk beralih ke halaman detail artikel.

### Cerita Pengguna 9: Menyetel Preferensi Notifikasi & Tema Aplikasi
*   **Sebagai:** Pengguna aplikasi
*   **Saya ingin:** Menyalakan/mematikan notifikasi dan mengganti tema (terang/gelap) di halaman pengaturan, serta menyimpan artikel favorit
*   **Agar:** Tampilan aplikasi nyaman di mata dan fungsionalitas notifikasi sesuai dengan keinginan saya.
*   **Kriteria Penerimaan:**
    *   Preferensi tema gelap/terang dan preferensi notifikasi tersimpan secara persisten di AsyncStorage.
    *   Mematikan notifikasi akan membatalkan seluruh jadwal notifikasi aktif di perangkat.
    *   Pengguna dapat menandai artikel favorit yang akan disimpan dan ditampilkan pada halaman profil mereka.
