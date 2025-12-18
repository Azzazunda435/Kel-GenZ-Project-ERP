# Kalkulator Analisis Bisnis - 7 Metode Perhitungan

Website kalkulator komprehensif untuk 7 metode analisis bisnis dengan penjelasan detail setiap tahap perhitungan.

## 🎯 Tujuan Proyek

Menyediakan tool analisis bisnis yang lengkap dan interaktif untuk membantu pengambilan keputusan dalam berbagai aspek bisnis seperti produksi, penjualan, penjadwalan, evaluasi, dan prediksi.

## ✨ Fitur Utama yang Telah Diimplementasikan

### 1. **BOM (Bill of Materials)** ✅
- **Fungsi**: Perhitungan biaya produksi dengan struktur hierarkis multi-level
- **Fitur**:
  - Input komponen utama dan sub-komponen
  - Perhitungan biaya per komponen
  - Akumulasi kebutuhan material untuk produksi massal
  - Breakdown biaya detail dari level terendah ke produk akhir
- **Use Case**: Menghitung cost produksi laptop, furniture, elektronik, dll.

### 2. **Forecasting - Trend Linear** ✅
- **Fungsi**: Prediksi permintaan/penjualan menggunakan metode Least Square
- **Fitur**:
  - Input data historis per periode
  - Perhitungan koefisien a dan b
  - Persamaan trend Y = a + bX
  - Visualisasi grafik dengan Chart.js
  - Prediksi untuk periode masa depan
- **Use Case**: Forecasting penjualan, permintaan produk, trend bisnis

### 3. **JSM (Job Sequencing Method)** ✅
- **Fungsi**: Penjadwalan optimal untuk 2 mesin dengan Algoritma Johnson
- **Fitur**:
  - Input waktu proses job pada 2 mesin
  - Penerapan aturan Johnson step-by-step
  - Perhitungan makespan (total waktu)
  - Analisis idle time per mesin
  - Efisiensi mesin
- **Use Case**: Penjadwalan produksi, optimasi mesin, manajemen workshop

### 4. **SAW (Simple Additive Weighting)** ✅
- **Fungsi**: Sistem pendukung keputusan multi-kriteria
- **Fitur**:
  - Input kriteria dengan tipe benefit/cost
  - Pembobotan kriteria (harus total 100%)
  - Normalisasi matriks keputusan
  - Perhitungan skor preferensi
  - Ranking alternatif
- **Use Case**: Pemilihan supplier, evaluasi karyawan, seleksi vendor

### 5. **Market Basket Analysis** ✅
- **Fungsi**: Analisis pola pembelian produk (Association Rules)
- **Fitur**:
  - Input transaksi pembelian
  - Perhitungan Support, Confidence, Lift Ratio
  - Filter minimum support & confidence
  - Identifikasi aturan asosiasi positif/negatif
  - Rekomendasi bundle promo
- **Use Case**: Analisis keranjang belanja, cross-selling strategy, product placement

### 6. **Profile Matching** ✅
- **Fungsi**: Evaluasi kandidat dengan Gap Analysis
- **Fitur**:
  - Input profil ideal dan profil kandidat
  - Kategori Core Factor (60%) & Secondary Factor (40%)
  - Perhitungan GAP dan konversi ke bobot
  - Nilai NCF, NSF, dan Total
  - Ranking kandidat
- **Use Case**: Rekrutmen karyawan, evaluasi supplier, assessment karyawan

### 7. **Markov Chain** ✅
- **Fungsi**: Prediksi probabilitas transisi antar state
- **Fitur**:
  - Generate matriks probabilitas transisi
  - Input distribusi state awal
  - Perhitungan distribusi state per periode
  - Analisis steady state (keseimbangan jangka panjang)
  - Prediksi kondisi masa depan
- **Use Case**: Customer retention analysis, churn prediction, loyalty program

## 📂 Struktur File

```
├── index.html              # Halaman utama dengan 7 tab metode
├── css/
│   └── style.css          # Styling modern dan responsive
├── js/
│   ├── main.js            # Navigasi dan fungsi utility
│   ├── bom.js             # Implementasi BOM
│   ├── forecasting.js     # Implementasi Forecasting
│   ├── jsm.js             # Implementasi JSM
│   ├── saw.js             # Implementasi SAW
│   ├── market-basket.js   # Implementasi Market Basket
│   ├── profile-matching.js # Implementasi Profile Matching
│   └── markov.js          # Implementasi Markov Chain
└── README.md              # Dokumentasi proyek
```

## 🚀 Cara Menggunakan

### Akses Website
1. Buka `index.html` di browser modern (Chrome, Firefox, Edge)
2. Pilih metode yang ingin digunakan dari menu navigasi
3. Setiap metode sudah memiliki data contoh untuk mempermudah pemahaman

### Penggunaan Setiap Metode

#### BOM (Bill of Materials)
1. Masukkan nama produk dan jumlah yang akan diproduksi
2. Tambah komponen utama (Motherboard, RAM, SSD, dll)
3. Untuk setiap komponen, tambahkan sub-komponen dengan jumlah dan harga
4. Klik "Hitung BOM" untuk melihat breakdown biaya lengkap

#### Forecasting
1. Masukkan nama data (Penjualan, Permintaan, dll)
2. Input data historis per periode (minimal 2 periode)
3. Tentukan periode yang ingin diprediksi
4. Klik "Hitung Forecasting" untuk melihat hasil dan grafik

#### JSM (Job Sequencing Method)
1. Input nama job dan waktu proses di Mesin 1 & Mesin 2
2. Tambah job sesuai kebutuhan (minimal 2 job)
3. Klik "Hitung JSM" untuk melihat urutan optimal
4. Lihat jadwal per mesin dan analisis makespan

#### SAW (Simple Additive Weighting)
1. Tambahkan kriteria dengan bobot (total harus 100%)
2. Tentukan tipe kriteria: Benefit atau Cost
3. Tambahkan alternatif dan isi nilai setiap kriteria
4. Klik "Hitung SAW" untuk melihat ranking

#### Market Basket Analysis
1. Input transaksi pembelian (pisahkan item dengan koma)
2. Set minimum support dan confidence (%)
3. Klik "Hitung Market Basket" untuk melihat aturan asosiasi
4. Analisis lift ratio dan rekomendasi bundle promo

#### Profile Matching
1. Tambahkan aspek penilaian dengan nilai target ideal
2. Tentukan kategori: Core Factor atau Secondary Factor
3. Input nilai kandidat untuk setiap aspek
4. Klik "Hitung Profile Matching" untuk melihat ranking

#### Markov Chain
1. Masukkan nama state (pisahkan dengan koma)
2. Klik "Generate Matriks" untuk membuat matriks transisi
3. Sesuaikan probabilitas transisi (total tiap baris = 1)
4. Set distribusi state awal
5. Tentukan jumlah periode prediksi
6. Klik "Hitung Markov Chain" untuk melihat evolusi state

## 🎨 Teknologi yang Digunakan

- **HTML5**: Struktur semantic dan accessible
- **CSS3**: Styling modern dengan Flexbox & Grid
- **JavaScript (Vanilla)**: Logika perhitungan dan interaktivitas
- **Chart.js**: Visualisasi grafik forecasting
- **Font Awesome**: Icon library
- **Google Fonts (Inter)**: Typography modern

## 📊 Keunggulan Website

### 1. Penjelasan Detail Step-by-Step
Setiap metode menampilkan:
- Konsep dan rumus dasar
- Proses perhitungan tahap demi tahap
- Interpretasi hasil
- Kesimpulan dan rekomendasi

### 2. Data Contoh Pre-loaded
Setiap metode sudah memiliki data contoh yang dapat langsung dihitung untuk memudahkan pembelajaran.

### 3. Interaktif & User-Friendly
- Form input yang intuitif
- Tambah/hapus data secara dinamis
- Validasi input real-time
- Alert notifikasi yang informatif

### 4. Responsive Design
- Tampilan optimal di desktop, tablet, dan mobile
- Navigasi tab yang smooth
- Tabel yang scroll-able di layar kecil

### 5. Professional UI/UX
- Color scheme bisnis (biru & hijau)
- Gradient background yang menarik
- Card-based layout
- Hover effects & transitions

## 🔧 Fitur Teknis

### Validasi Input
- Validasi data minimum untuk setiap metode
- Validasi total bobot (SAW: harus 100%)
- Validasi probabilitas (Markov: total baris = 1)
- Validasi state awal (Markov: total = 1)

### Perhitungan Matematis
- Operasi matriks (perkalian, pangkat) untuk Markov Chain
- Least square regression untuk Forecasting
- Normalisasi benefit/cost untuk SAW
- Gap analysis dengan tabel konversi untuk Profile Matching
- Algoritma Johnson untuk JSM

### Data Management
- State management untuk setiap metode
- Dynamic rendering komponen
- Real-time update saat input berubah

## 📈 Manfaat untuk Bisnis

1. **BOM**: Menghitung cost produksi akurat untuk pricing strategy
2. **Forecasting**: Prediksi demand untuk inventory planning
3. **JSM**: Optimasi produksi untuk efisiensi maksimal
4. **SAW**: Keputusan objektif berdasarkan multi-kriteria
5. **Market Basket**: Strategi cross-selling dan bundle promo
6. **Profile Matching**: Seleksi karyawan/supplier yang tepat
7. **Markov Chain**: Prediksi customer behavior dan retention

## 🔮 Pengembangan Selanjutnya (Roadmap)

### Fitur yang Dapat Ditambahkan:
1. **Export Hasil**: Download hasil perhitungan ke PDF/Excel
2. **Save/Load Data**: Simpan konfigurasi perhitungan
3. **Lebih Banyak Visualisasi**: Grafik untuk SAW, Profile Matching, Markov
4. **Perbandingan Skenario**: Compare multiple calculations
5. **Sensitivity Analysis**: Analisis sensitivitas parameter
6. **Template Library**: Library template untuk berbagai industri
7. **Tutorial Video**: Panduan video untuk setiap metode
8. **API Integration**: Integrasi dengan sistem ERP/CRM

### Metode Tambahan yang Dapat Diimplementasikan:
- **EOQ (Economic Order Quantity)**: Optimasi inventory
- **Linear Programming**: Optimasi sumber daya
- **AHP (Analytical Hierarchy Process)**: Decision making advanced
- **TOPSIS**: Multi-criteria decision making
- **Monte Carlo Simulation**: Risk analysis
- **Regression Analysis**: Analisis hubungan variabel
- **Time Series Decomposition**: Analisis seasonal pattern

## 💡 Tips Penggunaan

1. **Mulai dengan Data Contoh**: Setiap metode sudah memiliki data contoh. Klik "Hitung" untuk melihat cara kerja metode.
2. **Pahami Konsep**: Baca bagian "Konsep dan Rumus Dasar" sebelum input data.
3. **Validasi Data**: Pastikan data input valid (tidak ada yang kosong, format sesuai).
4. **Interpretasi Hasil**: Perhatikan bagian kesimpulan untuk memahami makna hasil perhitungan.
5. **Eksperimen**: Coba variasi data untuk memahami sensitivitas hasil terhadap input.

## 🎓 Use Case per Industri

### Manufaktur
- BOM untuk cost calculation
- JSM untuk production scheduling
- Forecasting untuk demand planning

### Retail
- Market Basket untuk merchandising
- Forecasting untuk inventory management
- SAW untuk vendor selection

### HR & Recruitment
- Profile Matching untuk candidate evaluation
- SAW untuk performance appraisal

### Marketing
- Market Basket untuk campaign strategy
- Markov Chain untuk customer journey analysis
- Forecasting untuk sales target

## 📞 Support & Kontribusi

Website ini dibuat sebagai tool edukasi dan praktis untuk analisis bisnis. Semua metode telah diimplementasikan dengan algoritma yang akurat dan penjelasan yang lengkap.

## 🏆 Kesimpulan

Website Kalkulator Analisis Bisnis ini menyediakan 7 metode perhitungan bisnis yang lengkap dengan:
- ✅ 7 metode fully functional
- ✅ Step-by-step explanation
- ✅ Data contoh pre-loaded
- ✅ Responsive design
- ✅ Professional UI/UX
- ✅ Detailed calculation breakdown
- ✅ Business recommendations

**Status**: 🎉 **COMPLETE - Siap digunakan untuk analisis bisnis profesional!**
