<p align="center">
  <br />
  <a href="https://orbit-sd.vercel.app">
    <picture>
      <img src="https://orbit-sd.vercel.app/orbit-logo.png" alt="Orbit Logo" width="256" height="256">
    </picture>
  </a>
</p>

<p align="center">ORBIT - Optimal Router Balance & Topology</p>

<p align="center">
  <a title="MIT License" href="LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT License" />
  </a>
  <a title="Vercel" href="https://vercel.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/powered%20by-Vercel%20%E2%96%B2-white">
      <img src="https://img.shields.io/badge/powered%20by-Vercel%20%E2%96%B2-black" alt="Powered by Vercel">
    </picture>
  </a>
  <br />
</p>

##

🔗 **Live Demo:** [orbit-sd.vercel.app](https://orbit-sd.vercel.app)

## 📷 Screenshots

<table align="center">
  <tr>
    <td align="center">
      <img src="https://orbit-sd.vercel.app/screenshots/homePage.png" alt="Home Page – Hero Section" width="100%"><br/>
      <b>Home Page</b>
    </td>
    <td align="center">
      <img src="https://orbit-sd.vercel.app/screenshots/simulationPage.png" alt="Simulation Page" width="100%"><br/>
      <b>Simulation Page</b>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://orbit-sd.vercel.app/screenshots/theorySection.png" alt="Theory Section" width="100%"><br/>
      <b>Theory Section</b>
    </td>
    <td align="center">
      <img src="https://orbit-sd.vercel.app/screenshots/memberSection.png" alt="Member Section" width="100%"><br/>
      <b>Member Section</b>
    </td>
  </tr>
</table>

## 📃 Description

**Orbit** adalah aplikasi berbasis web yang mengimplementasikan **Graph Theory** untuk memecahkan masalah optimisasi penggunaan _channel_ pada router Wi-Fi. Aplikasi ini menggunakan algoritma **TSC-DSATUR** untuk meminimalkan interferensi sinyal antar router secara efisien.

## ✨ Features

1. **Interactive Graph Playground**

   - Tambah router (node) dengan klik area playground
   - Posisi node bisa diatur bebas dengan drag & drop

2. **Dynamic Interference Detection**

   - Deteksi otomatis interferensi sinyal antar router berdasarkan jarak
   - Edge dibuat untuk merepresentasikan potensi konflik channel Wi-Fi

3. **Real-Time Graph Update**

   - Graph langsung diperbarui saat node ditambah, digeser, atau dihapus
   - Menggunakan D3.js force simulation & React state sync

4. **Router List (Node Management Panel)**

   - Panel menampilkan daftar router aktif (label, koordinat, tombol hapus)
   - Memudahkan monitoring & manajemen router

5. **Node Deletion & Synchronization**

   - Router bisa dihapus via Control Panel
   - Node & edge terkait otomatis hilang, UI tetap sinkron dengan D3

6. **Configurable Control Panel (Bento Grid Layout)**

   - Panel kontrol bisa ditampilkan/disembunyikan
   - Layout fleksibel: fokus utama tetap pada playground

7. **Reset View (Graph Clearing)**

   - Hapus semua node & edge dalam satu klik
   - Mengembalikan playground ke kondisi awal untuk eksperimen ulang

## 🛠️ Tech Stack

- **Frontend:** React 19
- **Build Tool:** Vite
- **UI Components:** Shadcn UI
- **Styling:** Tailwind CSS v4
- **Graph Engine:** D3.js
- **Animation:** Framer Motion
- **Icons:** Lucide React

## 🚀 Installation

Pastikan sudah menginstall [Node.js](https://nodejs.org/).

1.  **Clone repository ini:**

    ```bash
    git clone https://github.com/Fwrrell/orbit-app.git
    cd orbit-app
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Jalankan server development:**

    ```bash
    npm run dev
    ```

4.  Buka browser dan akses `http://localhost:5173`.

## License

[MIT](https://choosealicense.com/licenses/mit/)
