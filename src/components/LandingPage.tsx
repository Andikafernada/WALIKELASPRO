import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Star, CheckCircle, Clock, Smartphone, Zap, Globe, ArrowRight, Play, Menu, X, CreditCard, Gift } from 'lucide-react';

export default function LandingPage({ onLogin, onRegister }: { onLogin?: () => void; onRegister?: () => void }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-lg border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">WALIKELAS<span className="text-emerald-400">PRO</span></span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="text-slate-300 hover:text-white transition">Masuk</button>
            <button onClick={() => navigate('/register')} className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl transition">Daftar Gratis</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-sm font-medium mb-8">
            <Star className="w-4 h-4 fill-emerald-400" />
            <span>Solusi Wali Kelas Masa Kini</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Manage Kelas jadi<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Lebih Praktis</span>
          </h1>

          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">
            Aplikasi manajemen kelas digital untuk wali kelas Indonesia.
            Absensi, notifikasi WhatsApp, kas kelas, dan pelanggaran - semua dalam satu platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button onClick={() => navigate('/register')} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl flex items-center justify-center gap-2">
              Mulai Gratis Sekarang <ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2">
              <Play className="w-5 h-5" /> Lihat Demo
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-slate-400">
            <span className="flex items-center gap-2"><Clock className="w-5 h-5 text-emerald-400" /> Hemat waktu 70%</span>
            <span className="flex items-center gap-2"><Smartphone className="w-5 h-5 text-emerald-400" /> Akses dari HP</span>
            <span className="flex items-center gap-2"><Zap className="w-5 h-5 text-emerald-400" /> Mudah digunakan</span>
            <span className="flex items-center gap-2"><Globe className="w-5 h-5 text-emerald-400" /> Online 24/7</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">Fitur Lengkap</h2>
          <p className="text-slate-400 text-center mb-12">Semua yang Anda butuhkan untuk mengelola kelas</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📚', title: 'Manajemen Kelas', desc: 'Kelola data kelas & siswa' },
              { icon: '✅', title: 'Absensi Praktis', desc: 'PIN & QR untuk absensi mandiri' },
              { icon: '💬', title: 'WhatsApp Otomatis', desc: 'Notifikasi ke wali murid' },
              { icon: '💰', title: 'Kas Kelas Digital', desc: 'Catat pemasukan & pengeluaran' },
              { icon: '⚠️', title: 'Pelanggaran', desc: 'Sistem poin disiplin' },
              { icon: '🔒', title: 'Aman & Terpercaya', desc: 'Data tersimpan aman' },
            ].map((f, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="harga" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">Harga Terjangkau</h2>
          <p className="text-slate-400 text-center mb-12">Mulai gratis, upgrade sesuai kebutuhan</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free */}
            <div className="bg-slate-800 border border-slate-700/50 rounded-2xl p-8">
              <div className="text-slate-400 font-medium">Gratis</div>
              <div className="text-4xl font-bold text-white my-2">Rp 0</div>
              <div className="text-slate-400 mb-6">Selamanya</div>
              <ul className="space-y-3 mb-8 text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" /> 1 Kelas</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" /> 50 Siswa</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" /> Absensi Harian</li>
              </ul>
              <button onClick={() => navigate('/register')} className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl">Mulai Gratis</button>
            </div>

            {/* Premium */}
            <div className="bg-gradient-to-b from-emerald-500/10 to-slate-800 border-2 border-emerald-500/50 rounded-2xl p-8 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-white text-sm font-semibold rounded-full">Populer</div>
              <div className="text-emerald-400 font-medium">Premium</div>
              <div className="text-4xl font-bold text-white my-2">Rp 25.000</div>
              <div className="text-slate-400 mb-6">per bulan</div>
              <ul className="space-y-3 mb-8 text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" /> 5 Kelas</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" /> 200 Siswa</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" /> Semua Fitur</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" /> WhatsApp Otomatis</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-400" /> Priority Support</li>
              </ul>
              <button onClick={() => navigate('/register?plan=premium')} className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl">Berlangganan</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Siap Mempermudah Pekerjaan Anda?</h2>
        <p className="text-slate-400 mb-8">Bergabung dengan ratusan wali kelas di seluruh Indonesia</p>
        <button onClick={() => navigate('/register')} className="px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/25">
          Daftar Gratis Sekarang <ArrowRight className="w-5 h-5 inline" />
        </button>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-800 text-center text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">WALIKELAS<span className="text-emerald-400">PRO</span></span>
        </div>
        <p>© 2024 WALIKELASPRO. All rights reserved.</p>
      </footer>
    </div>
  );
}
