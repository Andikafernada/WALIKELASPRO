import React, { useState } from 'react';
import {
  MessageSquare, Users, BookOpen, Bell, Shield, Smartphone,
  Clock, CheckCircle, Star, ArrowRight, Menu, X, Play,
  GraduationCap, Wallet, AlertTriangle, Calendar, Zap, Globe,
  Heart, Coffee, Book, Award
} from 'lucide-react';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Manajemen Kelas Terintegrasi",
      description: "Kelola data kelas, siswa, dan absensi dalam satu platform. Semua informasi terpusat dan mudah diakses."
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: "Notifikasi WhatsApp Otomatis",
      description: "Kirim notifikasi absensi, pelanggaran, dan kas kelas langsung ke WhatsApp wali murid secara otomatis."
    },
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "Kas Kelas Digital",
      description: "Catat pemasukan dan pengeluaran kas kelas dengan rapi. Laporan keuangan transparan untuk semua pihak."
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: "Pelanggaran & Poin Disiplin",
      description: "Sistem poin disiplin otomatis. Orang tua langsung tahu jika anaknya melanggar tata tertib."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Absensi Praktis",
      description: "Buat sesi absensi dengan PIN & QR. Siswa bisa absen mandiri dari HP masing-masing."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Aman & Terpercaya",
      description: "Data tersimpan aman di server Indonesia. Privasi wali kelas dan siswa terjaga."
    }
  ];

  const benefits = [
    { icon: <Clock className="w-5 h-5" />, text: "Hemat waktu 70%" },
    { icon: <Smartphone className="w-5 h-5" />, text: "Akses dari HP" },
    { icon: <Zap className="w-5 h-5" />, text: "Mudah digunakan" },
    { icon: <Globe className="w-5 h-5" />, text: "Online 24/7" },
  ];

  const testimonials = [
    {
      name: "Siti Nurhaliza",
      role: "Wali Kelas, SMA Negeri 1 Bandung",
      content: "Dulu harus catat absensi di kertas, sekarang semuanya otomatis. Orang tua langsung dapat notifikasi via WhatsApp. Praktis banget!",
      rating: 5
    },
    {
      name: "Budi Santoso, S.Pd.",
      role: "Wali Kelas, SMP Negeri 2 Surabaya",
      content: "Fitur kas kelasnya sangat membantu. Laporan keuangan bisa langsung dilihat oleh komite sekolah.",
      rating: 5
    },
    {
      name: "Dewi Rahayu",
      role: "Guru BK, SMA Negeri 3 Jakarta",
      content: "Sistem poin disiplinnya bagus. Siswa jadi lebih sadar untuk menjaga perilaku karena tahu orang tuanya langsung dikabari.",
      rating: 5
    }
  ];

  const faqs = [
    {
      q: "Apakah sulit untuk memulai?",
      a: "Sangat mudah! Cukup daftar, buat kelas, masukkan data siswa, dan langsung bisa pakai. Tidak perlu instalasi software."
    },
    {
      q: "Apakah harus punya komputer?",
      a: "Tidak! Bisa diakses dari smartphone, tablet, atau komputer. Yang penting ada koneksi internet."
    },
    {
      q: "Bagaimana dengan privasi data?",
      a: "Data disimpan dengan aman di server Indonesia. Kami tidak akan membagikan data Anda ke pihak manapun."
    },
    {
      q: "Apakah bisa digunakan untuk banyak kelas?",
      a: "Ya! Satu akun bisa mengelola beberapa kelas sekaligus. Sangat cocok untuk guru yang menangani lebih dari satu kelas."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">WALIKELAS<span className="text-emerald-400">PRO</span></span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#fitur" className="text-slate-300 hover:text-white transition">Fitur</a>
              <a href="#cara-kerja" className="text-slate-300 hover:text-white transition">Cara Kerja</a>
              <a href="#testimoni" className="text-slate-300 hover:text-white transition">Testimoni</a>
              <a href="#harga" className="text-slate-300 hover:text-white transition">Harga</a>
              <a href="#faq" className="text-slate-300 hover:text-white transition">FAQ</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <a href="/login" className="text-slate-300 hover:text-white transition">Masuk</a>
              <a href="/register" className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition">
                Daftar Gratis
              </a>
            </div>

            <button
              className="md:hidden text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-t border-slate-700">
            <div className="px-4 py-4 space-y-3">
              <a href="#fitur" className="block text-slate-300 hover:text-white">Fitur</a>
              <a href="#cara-kerja" className="block text-slate-300 hover:text-white">Cara Kerja</a>
              <a href="#testimoni" className="block text-slate-300 hover:text-white">Testimoni</a>
              <a href="#harga" className="block text-slate-300 hover:text-white">Harga</a>
              <a href="/login" className="block text-slate-300 hover:text-white">Masuk</a>
              <a href="/register" className="block px-5 py-2 bg-emerald-500 text-white font-semibold rounded-xl text-center">
                Daftar Gratis
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-8">
            <Star className="w-4 h-4" />
            <span>Solusi Wali Kelas Masa Kini</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Manage Kelas jadi<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Lebih Praktis
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Aplikasi manajemen kelas digital untuk wali kelas Indonesia.
            Absensi, notifikasi WhatsApp, kas kelas, dan pelanggaran - semua dalam satu platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a href="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl text-lg transition shadow-lg shadow-emerald-500/25">
              Mulai Gratis Sekarang
              <ArrowRight className="w-5 h-5" />
            </a>
            <a href="#cara-kerja" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl text-lg transition">
              <Play className="w-5 h-5" />
              Lihat Demo
            </a>
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-20">
            {benefits.map((benefit, i) => (
              <div key={i} className="flex items-center gap-2 text-slate-400">
                {benefit.icon}
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>

          {/* Hero Image/Preview */}
          <div className="relative max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl p-2">
              <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="flex items-center gap-2 px-4 py-3 bg-slate-700/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 bg-slate-600 rounded-lg px-4 py-1.5 text-slate-400 text-sm">
                    walas.my.id/dashboard
                  </div>
                </div>
                <div className="bg-slate-900 p-6">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-slate-800 rounded-xl p-4">
                      <div className="text-3xl font-bold text-emerald-400">12</div>
                      <div className="text-sm text-slate-400">Kelas Aktif</div>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-4">
                      <div className="text-3xl font-bold text-emerald-400">350+</div>
                      <div className="text-sm text-slate-400">Siswa</div>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-4">
                      <div className="text-3xl font-bold text-emerald-400">98%</div>
                      <div className="text-sm text-slate-400">Kehadiran</div>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-4">
                      <div className="text-3xl font-bold text-emerald-400">24/7</div>
                      <div className="text-sm text-slate-400">Online</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Fitur Lengkap untuk Wali Kelas
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk mengelola kelas dengan efisien dalam satu aplikasi.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800 hover:border-emerald-500/30 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-400 mb-4 group-hover:bg-emerald-500/20 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="cara-kerja" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Cara Kerja
            </h2>
            <p className="text-slate-400">
              Mulai dalam 3 langkah mudah
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Daftar & Buat Kelas", desc: "Daftar gratis, buat kelas, dan masukkan data siswa dalam hitungan menit." },
              { step: "02", title: "Hubungkan WhatsApp", desc: "Scan QR code untuk menghubungkan WhatsApp Anda dengan aplikasi." },
              { step: "03", title: "Mulai Menggunakan", desc: "Buat absensi, catat kas, dan kelola pelanggaran dengan mudah." }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-7xl font-bold text-emerald-500/10 mb-4">{item.step}</div>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 right-0 translate-x-1/2">
                    <ArrowRight className="w-6 h-6 text-emerald-500/30" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimoni" className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Kata Mereka yang Sudah Pakai
            </h2>
            <p className="text-slate-400">
              Dipakai oleh ratusan wali kelas di seluruh Indonesia
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testi, i) => (
              <div key={i} className="bg-slate-800 border border-slate-700/50 rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {Array(testi.rating).fill(0).map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 mb-6 italic">"{testi.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-bold">
                    {testi.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testi.name}</div>
                    <div className="text-sm text-slate-400">{testi.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="harga" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Harga Terjangkau
            </h2>
            <p className="text-slate-400">
              Mulai gratis, upgrade sesuai kebutuhan
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-8">
              <div className="text-slate-400 font-medium mb-2">Gratis</div>
              <div className="text-4xl font-bold text-white mb-1">Rp 0</div>
              <div className="text-slate-400 mb-6">Selamanya</div>

              <ul className="space-y-3 mb-8">
                {[
                  "1 Kelas",
                  "50 Siswa",
                  "Absensi Harian",
                  "Manajemen Siswa",
                  "Absensi WhatsApp (Manual)"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>

              <a href="/register" className="block text-center py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition">
                Mulai Gratis
              </a>
            </div>

            {/* Premium Plan */}
            <div className="relative bg-gradient-to-b from-emerald-500/10 to-slate-800 border-2 border-emerald-500/50 rounded-2xl p-8">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="px-4 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">
                  Populer
                </span>
              </div>

              <div className="text-emerald-400 font-medium mb-2">Premium</div>
              <div className="text-4xl font-bold text-white mb-1">Rp 25.000</div>
              <div className="text-slate-400 mb-6">per bulan</div>

              <ul className="space-y-3 mb-8">
                {[
                  "5 Kelas",
                  "200 Siswa",
                  "Semua Fitur Gratis",
                  "Kas Kelas Digital",
                  "Pelanggaran & Poin",
                  "WhatsApp Otomatis",
                  "Notifikasi Instan",
                  "Export Laporan"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    {item}
                  </li>
                ))}
              </ul>

              <a href="/register?plan=premium" className="block text-center py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition">
                Berlangganan Premium
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pertanyaan Umum
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-slate-800 border border-slate-700/50 rounded-xl">
                <summary className="flex items-center justify-between cursor-pointer p-5 font-semibold text-white">
                  {faq.q}
                  <ArrowRight className="w-5 h-5 text-slate-400 group-open:rotate-90 transition" />
                </summary>
                <div className="px-5 pb-5 text-slate-400">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Siap Mempermudah Pekerjaan Anda?
          </h2>
          <p className="text-slate-400 mb-8">
            Bergabung dengan ratusan wali kelas yang sudah menggunakan WALIKELASPRO
          </p>
          <a href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl text-lg transition shadow-lg shadow-emerald-500/25">
            Daftar Gratis Sekarang
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">WALIKELAS<span className="text-emerald-400">PRO</span></span>
            </div>

            <div className="flex items-center gap-6 text-slate-400 text-sm">
              <a href="#" className="hover:text-white transition">Tentang</a>
              <a href="#" className="hover:text-white transition">Kebijakan Privasi</a>
              <a href="#" className="hover:text-white transition">Syarat & Ketentuan</a>
              <a href="#" className="hover:text-white transition">Kontak</a>
            </div>

            <div className="text-slate-400 text-sm">
              © 2024 WALIKELASPRO. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
