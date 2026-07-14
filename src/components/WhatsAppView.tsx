import React, { useState, useEffect } from 'react';
import { MessageSquare, CheckCircle, Smartphone, Send, Power, AlertCircle, Wifi, RefreshCw, RefreshCw as LoopIcon } from 'lucide-react';

export default function WhatsAppView() {
  const [waStatus, setWaStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [qrCodeActive, setQrCodeActive] = useState(false);
  
  // Test broadcast state
  const [testPhone, setTestPhone] = useState('08561234567');
  const [testMessage, setTestMessage] = useState('Halo Bapak/Ibu Wali Murid, kami menginfokan bahwa ananda Budi Santoso hari ini hadir di sekolah tepat waktu.');
  const [sendingTest, setSendingTest] = useState(false);

  useEffect(() => {
    fetchWaStatus();
  }, []);

  const fetchWaStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/settings/whatsapp');
      if (res.ok) {
        const data = await res.json();
        setWaStatus(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWa = () => {
    setConnecting(true);
    setQrCodeActive(true);
    setTimeout(() => {
      setConnecting(false);
    }, 1500);
  };

  const handleScanSimulation = async () => {
    try {
      setConnecting(true);
      const res = await fetch('/api/settings/whatsapp/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '081234567890' })
      });
      if (res.ok) {
        const data = await res.json();
        setWaStatus(data);
        setQrCodeActive(false);
        alert('WhatsApp berhasil terhubung dengan sukses!');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnectWa = async () => {
    if (!confirm('Apakah Anda yakin ingin memutuskan koneksi WhatsApp? Sistem tidak akan mengirimkan notifikasi otomatis ke wali murid lagi.')) return;
    try {
      setConnecting(true);
      const res = await fetch('/api/settings/whatsapp/disconnect', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setWaStatus(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setConnecting(false);
    }
  };

  const handleSendTestMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone || !testMessage) return;

    try {
      setSendingTest(true);
      const res = await fetch('/api/settings/whatsapp/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: testPhone, message: testMessage })
      });

      if (res.ok) {
        alert('Pesan tes WhatsApp berhasil terkirim via server bot!');
        fetchWaStatus();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSendingTest(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-emerald-400" />
          WhatsApp Gateway Integrasi
        </h1>
        <p className="text-sm text-slate-400">Hubungkan akun WhatsApp Anda untuk mengirim pemberitahuan otomatis seputar kehadiran & pelanggaran disiplin siswa kepada orang tua secara instan.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Connection status & scan */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-lg space-y-6">
            <h3 className="font-bold text-white text-base">Status Integrasi</h3>

            {waStatus?.connected ? (
              // Connected State UI
              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg animate-pulse">
                    <Wifi className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-400 flex items-center gap-1">
                      TERHUBUNG
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">Device: <span className="font-mono text-slate-200">{waStatus.phone}</span></p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400">
                  <p className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Notifikasi Absensi Siswa <span className="text-emerald-400 font-semibold">(Aktif)</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Peringatan Pelanggaran Tata Tertib <span className="text-emerald-400 font-semibold">(Aktif)</span>
                  </p>
                </div>

                <button
                  onClick={handleDisconnectWa}
                  disabled={connecting}
                  className="w-full py-2.5 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Power className="w-4 h-4" />
                  Putuskan Sambungan
                </button>
              </div>
            ) : qrCodeActive ? (
              // Scan QR Simulation UI
              <div className="flex flex-col items-center text-center space-y-5">
                <div className="bg-white p-4 rounded-2xl shadow-xl w-48 h-48 flex items-center justify-center relative border border-slate-200">
                  {connecting ? (
                    <div className="absolute inset-0 bg-white/90 flex items-center justify-center rounded-2xl">
                      <div className="w-8 h-8 border-3 border-slate-800 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : null}
                  {/* Fake QR code block generator */}
                  <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center rounded-xl p-2">
                    <div className="grid grid-cols-5 gap-1.5 w-full h-full">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-sm ${
                            (i * 7 + 3) % 5 === 0 || i % 4 === 0 ? 'bg-white' : 'bg-transparent'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1 max-w-sm">
                  <h4 className="font-bold text-slate-200 text-sm">Pindai QR Code Menggunakan WhatsApp Anda</h4>
                  <p className="text-xs text-slate-400">Buka WhatsApp &gt; Perangkat Tertaut &gt; Tautkan Perangkat. Arahkan kamera Anda ke QR di atas.</p>
                </div>

                <button
                  onClick={handleScanSimulation}
                  disabled={connecting}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-emerald-900/20 cursor-pointer"
                >
                  Simulasi Scan Berhasil
                </button>
              </div>
            ) : (
              // Disconnected State UI
              <div className="space-y-6 text-center py-4">
                <div className="w-16 h-16 bg-slate-700/60 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Smartphone className="w-8 h-8" />
                </div>
                <div className="space-y-1.5 max-w-sm mx-auto">
                  <h4 className="font-bold text-slate-200 text-sm">WhatsApp Gateway Belum Terhubung</h4>
                  <p className="text-xs text-slate-400">Hubungkan bot server WhatsApp untuk mengaktifkan broadcast notifikasi otomatis laporan absensi harian dan denda poin pelanggaran langsung ke wali murid.</p>
                </div>

                <button
                  onClick={handleConnectWa}
                  disabled={connecting}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition cursor-pointer"
                >
                  Hubungkan Perangkat Sekarang
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Broadcast Test & logs */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Test broadcast message */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="font-bold text-white text-base">Uji Kirim Pesan (WhatsApp)</h3>
            <form onSubmit={handleSendTestMessage} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">No. HP Orang Tua / Tujuan *</label>
                <input
                  type="text"
                  placeholder="Contoh: 08561234567"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl text-sm focus:outline-none transition font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Pesan WhatsApp *</label>
                <textarea
                  rows={3}
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl text-sm focus:outline-none transition"
                  required
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={sendingTest || !waStatus?.connected}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:text-slate-400 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Kirim Pesan Tes
                </button>
              </div>
            </form>
          </div>

          {/* Broadcast logs */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <h3 className="font-bold text-white text-base">Riwayat Broadcast WhatsApp</h3>
              <span className="text-xs text-slate-400">Terkirim: {waStatus?.logs?.length || 0}</span>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto scrollbar-thin pr-1">
              {waStatus?.logs?.map((log: any) => (
                <div key={log.id} className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <p className="font-bold text-slate-200">{log.student_name} <span className="font-normal text-slate-400">({log.type})</span></p>
                    <p className="text-slate-400 font-mono">No. HP: {log.recipient}</p>
                    <p className="text-slate-500 text-[10px]">{new Date(log.timestamp).toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <span className="bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}

              {waStatus?.logs?.length === 0 && (
                <p className="text-center text-xs text-slate-500 py-6">Belum ada riwayat notifikasi WhatsApp terkirim.</p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
