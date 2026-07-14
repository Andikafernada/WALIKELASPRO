import React, { useState, useEffect } from 'react';
import { User, CheckCircle2, AlertTriangle, KeyRound, ArrowRight, UserCheck, Smile } from 'lucide-react';
import { motion } from 'motion/react';

interface PublicAttendanceViewProps {
  token: string;
}

export default function PublicAttendanceView({ token }: PublicAttendanceViewProps) {
  const [session, setSession] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [className, setClassName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState<'hadir' | 'sakit' | 'izin' | 'alfa'>('hadir');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchSessionDetails();
  }, [token]);

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/attendance-public/session/${token}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Terjadi kesalahan saat memuat absensi');
      }
      const data = await res.json();
      setSession(data.session);
      setStudents(data.students);
      setClassName(data.class_name);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      alert('Silakan pilih nama Anda terlebih dahulu.');
      return;
    }
    if (!pin) {
      alert('Silakan masukkan PIN harian.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/attendance-public/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: session.id,
          pin,
          student_id: selectedStudentId,
          status,
          notes
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Gagal menyimpan absensi');
      }

      setSuccess(true);
      setError(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Memuat formulir absensi...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl text-center">
          <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Akses Absensi Gagal</h2>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    const student = students.find(s => s.id === selectedStudentId);
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-slate-800 border border-emerald-500/30 rounded-2xl p-8 shadow-2xl text-center"
        >
          <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-5 animate-bounce" />
          <h2 className="text-2xl font-bold text-white mb-2">Absensi Berhasil!</h2>
          <p className="text-slate-300 mb-6">
            Terima kasih, <span className="font-semibold text-emerald-400">{student?.name}</span>. Kehadiran Anda hari ini telah dicatat sebagai <span className="capitalize font-semibold text-emerald-400">{status}</span>.
          </p>
          <div className="bg-slate-900/60 p-4 rounded-xl mb-6 text-left border border-slate-700 text-sm space-y-2">
            <div><span className="text-slate-400">Kelas:</span> <span className="text-white font-medium">{className}</span></div>
            <div><span className="text-slate-400">Waktu:</span> <span className="text-white font-medium">{new Date().toLocaleTimeString('id-ID')}</span></div>
            {notes && <div><span className="text-slate-400">Keterangan:</span> <span className="text-slate-300 italic">"{notes}"</span></div>}
          </div>
          <button
            onClick={() => {
              setSuccess(false);
              setSelectedStudentId('');
              setPin('');
              setNotes('');
              setStatus('hadir');
              fetchSessionDetails();
            }}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-lg shadow-emerald-600/20 transition-all duration-200"
          >
            Isi Absensi Lain (Siswa Berbeda)
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center bg-slate-950 p-4 py-12">
      <div className="max-w-lg w-full mx-auto bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 text-white text-center">
          <span className="bg-emerald-500/30 text-emerald-200 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider">
            Formulir Mandiri Siswa
          </span>
          <h1 className="text-2xl font-bold mt-2">{className}</h1>
          <p className="text-emerald-100 text-sm mt-1">Silakan pilih nama Anda dan isi PIN kehadiran hari ini.</p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Student Selector */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-emerald-400" />
              Nama Lengkap Anda
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white rounded-xl focus:outline-none transition appearance-none"
              required
            >
              <option value="">-- Pilih Nama Anda --</option>
              {students.map((std) => (
                <option key={std.id} value={std.id} disabled={std.already_submitted}>
                  {std.name} ({std.nis}) {std.already_submitted ? ' [Sudah Absen]' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Daily Pin */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              PIN Harian Kelas
            </label>
            <input
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={6}
              placeholder="Masukkan PIN harian"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white rounded-xl text-center font-mono text-lg tracking-widest focus:outline-none transition"
              required
            />
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-3 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              Status Kehadiran
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { val: 'hadir', label: 'Hadir', activeBg: 'bg-emerald-600 border-emerald-500 text-white', inactiveBg: 'bg-slate-800 border-slate-700 hover:bg-slate-800/80 text-slate-300' },
                { val: 'sakit', label: 'Sakit', activeBg: 'bg-amber-600 border-amber-500 text-white', inactiveBg: 'bg-slate-800 border-slate-700 hover:bg-slate-800/80 text-slate-300' },
                { val: 'izin', label: 'Izin', activeBg: 'bg-indigo-600 border-indigo-500 text-white', inactiveBg: 'bg-slate-800 border-slate-700 hover:bg-slate-800/80 text-slate-300' }
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setStatus(item.val as any)}
                  className={`py-3 px-2 border rounded-xl font-medium text-sm text-center transition-all duration-150 cursor-pointer ${
                    status === item.val ? item.activeBg : item.inactiveBg
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes for Sick/Permit */}
          {status !== 'hadir' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <label className="block text-sm font-medium text-slate-300">
                Alasan / Keterangan tambahan
              </label>
              <textarea
                rows={3}
                placeholder="Contoh: Demam, Surat dokter terlampir, dll."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white rounded-xl focus:outline-none transition"
                required
              />
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/30 transition duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Kirim Kehadiran Saya
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="text-center mt-6 text-xs text-slate-600 flex items-center justify-center gap-1">
        <Smile className="w-3.5 h-3.5" />
        Sistem Absensi Wali Kelas Mandiri
      </div>
    </div>
  );
}
