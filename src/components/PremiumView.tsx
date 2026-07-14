import React, { useState } from 'react';
import { Zap, Check, ShieldCheck, CreditCard, Sparkles, AlertCircle } from 'lucide-react';

interface PremiumViewProps {
  user: any;
  onUpgrade: () => void;
  onDowngrade: () => void;
}

export default function PremiumView({ user, onUpgrade, onDowngrade }: PremiumViewProps) {
  const [upgrading, setUpgrading] = useState(false);

  const handleSimulatedUpgrade = () => {
    setUpgrading(true);
    setTimeout(() => {
      onUpgrade();
      setUpgrading(false);
      alert('Selamat! Pembayaran berhasil. Akun Anda telah diupgrade ke PREMIUM selama 1 Tahun!');
    }, 1500);
  };

  const hasPremium = !!user.premium_expires_at;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <span className="bg-amber-500/10 text-amber-400 text-xs px-4 py-1.5 rounded-full font-bold uppercase tracking-wider inline-flex items-center gap-1.5 animate-pulse">
          <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
          PRO WALAS PREMIUM
        </span>
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
          Layanan Lebih Hebat dengan Fitur Premium
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">
          Dapatkan kontrol penuh atas kelas Anda, jalankan kas transparan, catat kedisiplinan siswa, dan kirimkan notifikasi WA langsung ke wali murid.
        </p>
      </div>

      {/* Active Premium Profile */}
      {hasPremium && (
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Akun Premium Anda Aktif!</h3>
              <p className="text-xs text-slate-400 mt-1">Berlaku hingga: <span className="font-mono text-emerald-400 font-semibold">{new Date(user.premium_expires_at!).toLocaleDateString('id-ID', { dateStyle: 'long' })}</span></p>
            </div>
          </div>
          <button
            onClick={() => {
              onDowngrade();
              alert('Akun diturunkan ke versi FREE untuk keperluan pengujian.');
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Downgrade (Kembali ke FREE)
          </button>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Monthly Plan */}
        <div className={`bg-slate-800 border rounded-2xl p-6 shadow-lg flex flex-col justify-between h-[360px] ${
          !hasPremium ? 'border-slate-700/60' : 'border-slate-800 opacity-60'
        }`}>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-400 text-sm uppercase tracking-wide">Bulanan</h3>
              <h4 className="text-3xl font-extrabold text-white mt-1">Rp 29.000<span className="text-xs font-normal text-slate-400">/bulan</span></h4>
            </div>
            <p className="text-xs text-slate-400">Layanan penuh bulanan tanpa batasan untuk 1 kelas penuh.</p>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> WhatsApp Integration</p>
              <p className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Catatan Kas Kelas & Pelanggaran</p>
              <p className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400" /> Auto-notifikasi Orang Tua</p>
            </div>
          </div>
          <button
            disabled={hasPremium || upgrading}
            onClick={handleSimulatedUpgrade}
            className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white font-semibold text-xs rounded-xl transition cursor-pointer"
          >
            Pilih Bulanan
          </button>
        </div>

        {/* Yearly Plan (Best Choice) */}
        <div className={`bg-slate-800 border rounded-2xl p-6 shadow-xl flex flex-col justify-between h-[360px] relative overflow-hidden ${
          !hasPremium ? 'border-amber-500/40 shadow-amber-900/10' : 'border-slate-800 opacity-60'
        }`}>
          <div className="absolute right-0 top-0 bg-amber-500 text-slate-950 font-bold text-[10px] px-3.5 py-1 rounded-bl-xl uppercase tracking-wider">
            Hemat 50%
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-amber-400 text-sm uppercase tracking-wide">1 Tahun Penuh</h3>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h4 className="text-3xl font-extrabold text-white mt-1">Rp 149.000<span className="text-xs font-normal text-slate-400">/tahun</span></h4>
              <p className="text-[10px] text-emerald-400 font-semibold mt-1">Setara Rp 12.400 / bulan</p>
            </div>
            <p className="text-xs text-slate-400">Pilihan terpopuler wali kelas se-Indonesia untuk satu tahun ajaran penuh.</p>
            <div className="space-y-2 text-xs text-slate-300">
              <p className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> WhatsApp Integration</p>
              <p className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Catatan Kas Kelas & Pelanggaran</p>
              <p className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Auto-notifikasi Orang Tua</p>
              <p className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-400" /> Bantuan Teknis Prioritas 24/7</p>
            </div>
          </div>
          <button
            disabled={hasPremium || upgrading}
            onClick={handleSimulatedUpgrade}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-amber-900/20 cursor-pointer"
          >
            {upgrading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin mx-auto"></div>
            ) : (
              'Upgrade Tahun Sekarang'
            )}
          </button>
        </div>

      </div>

      {/* Feature matrix */}
      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-lg space-y-4">
        <h3 className="font-bold text-white text-base">Perbandingan Fitur Layanan</h3>
        <div className="border border-slate-700/60 rounded-xl overflow-hidden divide-y divide-slate-700/60 text-xs">
          {[
            { feat: 'Presensi Mandiri Siswa (PIN Harian)', free: true, prem: true },
            { feat: 'Kelola Data Siswa & Orang Tua', free: true, prem: true },
            { feat: 'Arus Kas Kelas Transparan', free: false, prem: true },
            { feat: 'Poin Pelanggaran & Skor Perilaku', free: false, prem: true },
            { feat: 'Integrasi WhatsApp Gateway & Bot', free: false, prem: true },
            { feat: 'Notifikasi Otomatis Orang Tua (Sakit/Izin/Bolos/Melanggar)', free: false, prem: true }
          ].map((row, i) => (
            <div key={i} className="grid grid-cols-12 p-3 bg-slate-900/20">
              <div className="col-span-8 font-medium text-slate-200">{row.feat}</div>
              <div className="col-span-2 text-center">
                {row.free ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <span className="text-slate-600">-</span>}
              </div>
              <div className="col-span-2 text-center">
                {row.prem ? <Check className="w-4 h-4 text-amber-400 mx-auto" /> : <span className="text-slate-600">-</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
