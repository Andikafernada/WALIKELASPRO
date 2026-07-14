import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, Edit2, Trash2, ShieldAlert, Sparkles, User, Calendar, MessageSquare, ShieldCheck } from 'lucide-react';
import { ClassRoom, Student, Violation } from '../types';

interface ViolationsViewProps {
  initialClassId?: string;
  user: any;
}

export default function ViolationsView({ initialClassId, user }: ViolationsViewProps) {
  const [classesList, setClassesList] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(initialClassId || null);
  const [violations, setViolations] = useState<Violation[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);
  const [studentIdInput, setStudentIdInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('Disiplin');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [pointDeductedInput, setPointDeductedInput] = useState('10');
  const [violationDateInput, setViolationDateInput] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchViolations(selectedClassId);
      fetchStudents(selectedClassId);
    }
  }, [selectedClassId]);

  const fetchClasses = async () => {
    try {
      const res = await fetch('/api/classes');
      if (res.ok) {
        const data = await res.json();
        setClassesList(data);
        if (data.length > 0 && !selectedClassId) {
          setSelectedClassId(data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchViolations = async (classId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/classes/${classId}/violations`);
      if (res.ok) {
        const data = await res.json();
        setViolations(data.sort((a: any, b: any) => new Date(b.violation_date).getTime() - new Date(a.violation_date).getTime()));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (classId: string) => {
    try {
      const res = await fetch(`/api/classes/${classId}/students`);
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) return;

    if (!studentIdInput || !categoryInput || !descriptionInput || !pointDeductedInput || !violationDateInput) {
      alert('Semua kolom formulir wajib diisi.');
      return;
    }

    const payload = {
      student_id: studentIdInput,
      category: categoryInput,
      description: descriptionInput,
      point_deducted: pointDeductedInput,
      violation_date: violationDateInput
    };

    const url = formId ? `/api/violations/${formId}` : `/api/classes/${selectedClassId}/violations`;
    const method = formId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowModal(false);
        setFormId(null);
        resetForm();
        fetchViolations(selectedClassId);
        fetchStudents(selectedClassId); // refresh student points
        alert(formId ? 'Laporan pelanggaran diperbarui!' : 'Laporan pelanggaran dicatat & poin disiplin siswa berhasil dikurangi! Notifikasi WhatsApp otomatis terkirim ke Orang Tua jika terhubung.');
      } else {
        const err = await res.json();
        alert(err.error || 'Terjadi kesalahan saat menyimpan laporan');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (v: Violation) => {
    setFormId(v.id);
    setStudentIdInput(v.student_id);
    setCategoryInput(v.category);
    setDescriptionInput(v.description);
    setPointDeductedInput(v.point_deducted.toString());
    setViolationDateInput(v.violation_date);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan pelanggaran ini? Poin disiplin siswa akan dikembalikan otomatis.')) {
      return;
    }
    try {
      const res = await fetch(`/api/violations/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (selectedClassId) {
          fetchViolations(selectedClassId);
          fetchStudents(selectedClassId);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setStudentIdInput('');
    setCategoryInput('Disiplin');
    setDescriptionInput('');
    setPointDeductedInput('10');
    setViolationDateInput(new Date().toISOString().split('T')[0]);
  };

  const getDisciplineLeaderboard = () => {
    return [...students].sort((a, b) => a.discipline_points - b.discipline_points);
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-rose-500" />
            Catatan Pelanggaran & Poin Disiplin
          </h1>
          <p className="text-sm text-slate-400">Catat pelanggaran tata tertib, kurangi poin disiplin, dan pantau perilaku siswa.</p>
        </div>

        <div className="flex items-center gap-3">
          {classesList.length > 0 && (
            <select
              value={selectedClassId || ''}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-sm focus:outline-none transition appearance-none cursor-pointer"
            >
              {classesList.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}

          <button
            onClick={() => {
              setFormId(null);
              resetForm();
              setShowModal(true);
            }}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-semibold text-sm transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            Laporkan Pelanggaran
          </button>
        </div>
      </div>

      {classesList.length === 0 ? (
        <div className="bg-slate-800 p-8 rounded-2xl text-center border border-dashed border-slate-700">
          <p className="text-slate-400 font-medium">Anda harus membuat kelas terlebih dahulu untuk menggunakan fitur Pelanggaran Disiplin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Violations list */}
          <div className="lg:col-span-8 bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="font-bold text-white text-base">Log Laporan Pelanggaran Siswa</h3>

            {loading ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin pr-1">
                {violations.map((v) => {
                  const student = students.find((s) => s.id === v.student_id);
                  return (
                    <div key={v.id} className="p-4 bg-slate-900/40 border border-slate-700/50 rounded-xl flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-200 text-base">{student?.name || 'Siswa'}</span>
                          <span className="bg-rose-500/10 text-rose-400 text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            -{v.point_deducted} Poin
                          </span>
                        </div>
                        <p className="text-sm text-slate-400"><span className="font-semibold text-slate-300">Kategori:</span> {v.category}</p>
                        <p className="text-sm text-slate-300 italic">"{v.description}"</p>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {v.violation_date}</span>
                          {v.handled_by && (
                            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Ditangani oleh: {v.handled_by}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-start">
                        <button
                          onClick={() => handleEdit(v)}
                          className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="p-1.5 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-400 transition cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {violations.length === 0 && (
                  <p className="text-center text-xs text-slate-500 py-10">Belum ada catatan pelanggaran tata tertib di kelas ini.</p>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Discipline points leaderboard */}
          <div className="lg:col-span-4 bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-4">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              Skor Perilaku & Poin Siswa
            </h3>
            <p className="text-xs text-slate-400">Poin bawaan standar siswa adalah 100. Pelanggaran akan mendepresiasi poin siswa secara bertahap.</p>

            <div className="space-y-3.5">
              {getDisciplineLeaderboard().map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-xl border border-slate-700/40">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-200 text-sm truncate">{s.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">NIS: {s.nis}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-base font-bold px-2.5 py-1 rounded-lg ${
                      s.discipline_points >= 80
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : s.discipline_points >= 60
                        ? 'bg-amber-500/15 text-amber-400'
                        : 'bg-rose-500/15 text-rose-400'
                    }`}>
                      {s.discipline_points} Pts
                    </span>
                  </div>
                </div>
              ))}

              {students.length === 0 && (
                <p className="text-center text-xs text-slate-500 py-6">Tidak ada siswa terdaftar di kelas ini.</p>
              )}
            </div>
          </div>

        </div>
      )}

      {/* ----------------- VIOLATION LOG FORM MODAL ----------------- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-lg">{formId ? 'Edit Laporan Pelanggaran' : 'Laporkan Pelanggaran Disiplin'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-white/10 rounded-lg transition cursor-pointer">
                <ShieldCheck className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Pilih Siswa Pelanggar *</label>
                <select
                  value={studentIdInput}
                  onChange={(e) => setStudentIdInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl text-sm focus:outline-none transition appearance-none"
                  required
                >
                  <option value="">-- Pilih Siswa --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.nis}) [Sisa Poin: {s.discipline_points}]</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Kategori Pelanggaran *</label>
                <select
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl text-sm focus:outline-none transition appearance-none"
                  required
                >
                  <option value="Disiplin">Disiplin (Terlambat,bolos,dll)</option>
                  <option value="Kerapihan">Kerapihan (Seragam,rambut,dll)</option>
                  <option value="Etika">Etika / Sopan Santun</option>
                  <option value="Keamanan">Keamanan / Perkelahian</option>
                  <option value="Akademik">Akademik / Mencontek</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Poin yang Dikurangi *</label>
                <select
                  value={pointDeductedInput}
                  onChange={(e) => setPointDeductedInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl text-sm focus:outline-none transition appearance-none"
                  required
                >
                  <option value="5">5 Poin (Pelanggaran Ringan)</option>
                  <option value="10">10 Poin (Pelanggaran Sedang)</option>
                  <option value="15">15 Poin (Pelanggaran Berulang)</option>
                  <option value="25">25 Poin (Pelanggaran Berat)</option>
                  <option value="50">50 Poin (Pelanggaran Sangat Berat)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Keterangan Pelanggaran *</label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Menggunakan sepatu berwarna cokelat saat upacara bendera hari Senin."
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl text-sm focus:outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Tanggal Pelanggaran *</label>
                <input
                  type="date"
                  value={violationDateInput}
                  onChange={(e) => setViolationDateInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl text-sm focus:outline-none transition"
                  required
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-sm font-semibold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-semibold transition cursor-pointer"
                >
                  Catat & Kurangi Poin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
