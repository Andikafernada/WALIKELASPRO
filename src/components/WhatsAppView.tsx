import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, CheckCircle, Smartphone, Send, Power, Wifi, QrCode, Loader2, AlertCircle, Users } from 'lucide-react';

export default function WhatsAppView() {
  const [waStatus, setWaStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('default');

  // Test message state
  const [testPhone, setTestPhone] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [sendingTest, setSendingTest] = useState(false);

  // Fetch status function
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`/api/whatsapp/status?user_id=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setWaStatus(data);

        if (data.qr) {
          setQrCode(data.qr);
        }

        if (data.connected) {
          setQrCode(null);
          setConnecting(false);
        }
      }
    } catch (err) {
      console.error(err);
      setError('Gagal mengambil status WhatsApp');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial load
  useEffect(() => {
    fetchStatus();
    // Poll every 3 seconds
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  const handleConnect = async () => {
    try {
      setConnecting(true);
      setError(null);
      setSuccess(null);
      setQrCode(null);

      const res = await fetch('/api/whatsapp/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });

      const data = await res.json();

      if (data.success) {
        setSuccess('⏳ QR Code sedang di-generate...');
      } else {
        setError(data.error || 'Gagal memulai koneksi');
        setConnecting(false);
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi');
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Putuskan koneksi WhatsApp?')) return;

    try {
      setConnecting(true);
      const res = await fetch('/api/whatsapp/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId })
      });

      if (res.ok) {
        setQrCode(null);
        fetchStatus();
      }
    } catch (err) {
      setError('Terjadi kesalahan');
    } finally {
      setConnecting(false);
    }
  };

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testPhone || !testMessage) return;

    try {
      setSendingTest(true);
      setError(null);

      const res = await fetch('/api/whatsapp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          phone: testPhone,
          message: testMessage
        })
      });

      if (res.ok) {
        setSuccess('✅ Pesan berhasil dikirim!');
        setTestPhone('');
        setTestMessage('');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Gagal mengirim pesan');
      }
    } catch (err) {
      setError('Terjadi kesalahan');
    } finally {
      setSendingTest(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-emerald-400" />
          WhatsApp Gateway
        </h1>
        <p className="text-sm text-slate-400">
          Hubungkan WhatsApp untuk kirim notifikasi otomatis ke wali murid.
        </p>
      </div>

      {/* Messages */}
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-sm text-emerald-400">
          {success}
        </div>
      )}
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-sm text-rose-400 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT: Connection */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-lg space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white">Status Koneksi</h3>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Users className="w-4 h-4" />
                <span>User ID: <code className="text-emerald-400">{userId}</code></span>
              </div>
            </div>

            {waStatus?.connected ? (
              // CONNECTED
              <div className="space-y-6">
                <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                  <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg">
                    <Wifi className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-400 flex items-center gap-2">
                      TERHUBUNG
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">{waStatus.phone}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-slate-400">
                  <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Notifikasi Absensi Otomatis</p>
                  <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Peringatan Pelanggaran</p>
                  <p className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Reminder Kas Kelas</p>
                </div>

                <button
                  onClick={handleDisconnect}
                  className="w-full py-3 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                >
                  <Power className="w-4 h-4" /> Putuskan Koneksi
                </button>
              </div>
            ) : qrCode ? (
              // QR CODE DISPLAY
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="bg-white rounded-2xl p-3 shadow-lg">
                  <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                </div>

                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-200">📱 Scan QR Code Sekarang</p>
                  <p className="text-xs text-slate-400">
                    WhatsApp → Setelan → Perangkat Tertaut → Tautkan Perangkat
                  </p>
                </div>

                <div className="flex items-center gap-2 text-emerald-400 text-sm">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Menunggu scan...
                </div>

                <button
                  onClick={() => { setQrCode(null); setConnecting(false); }}
                  className="text-xs text-slate-400 hover:text-slate-200 underline"
                >
                  Tutup
                </button>
              </div>
            ) : (
              // NOT CONNECTED
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 bg-slate-700/60 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Smartphone className="w-8 h-8" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-200">WhatsApp Belum Terhubung</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Klik tombol di bawah untuk generate QR code
                  </p>
                </div>

                <button
                  onClick={handleConnect}
                  disabled={connecting}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2"
                >
                  {connecting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyiapkan QR...
                    </>
                  ) : (
                    <>
                      <QrCode className="w-4 h-4" />
                      Generate QR Code
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-4 text-xs text-slate-400">
            <p className="font-semibold text-slate-300 mb-2">💡 Info Multi-Tenant:</p>
            <ul className="space-y-1">
              <li>• Setiap wali kelas punya WhatsApp sendiri</li>
              <li>• QR code unik untuk setiap user</li>
              <li>• Scan dalam 20 detik sebelum QR berubah</li>
              <li>• Pastikan HP tetap terhubung internet</li>
            </ul>
          </div>
        </div>

        {/* RIGHT: Send Message */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="font-bold text-white">Kirim Pesan Test</h3>

            {!waStatus?.connected && (
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-300">
                ⚠️ Hubungkan WhatsApp terlebih dahulu untuk mengirim pesan.
              </div>
            )}

            <form onSubmit={handleSendTest} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Nomor HP</label>
                <input
                  type="text"
                  placeholder="08561234567"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl text-sm font-mono"
                  required
                  disabled={!waStatus?.connected}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1.5">Pesan</label>
                <textarea
                  rows={4}
                  value={testMessage}
                  onChange={(e) => setTestMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl text-sm resize-none"
                  required
                  disabled={!waStatus?.connected}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={sendingTest || !waStatus?.connected}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 text-white font-bold rounded-xl text-sm flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {sendingTest ? 'Mengirim...' : 'Kirim Pesan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
