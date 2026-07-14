import React, { useState, useEffect } from 'react';
import { Presentation, Clock, Calendar, CheckSquare, Plus, Check, X, KeyRound, ExternalLink, Link, AlertCircle, Share2 } from 'lucide-react';
import { ClassRoom, Student, AttendanceSession, Attendance } from '../types';

interface AttendanceViewProps {
  initialClassId?: string;
  initialSessionId?: string;
  onNavigate: (tab: string, extra?: any) => void;
}

export default function AttendanceView({ initialClassId, initialSessionId, onNavigate }: AttendanceViewProps) {
  const [classesList, setClassesList] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(initialClassId || null);
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
  
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, { status: 'hadir' | 'sakit' | 'izin' | 'alfa'; notes: string }>>({});
  
  // New session state
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [dailyPinInput, setDailyPinInput] = useState('');
  const [expireHoursInput, setExpireHoursInput] = useState('4');
  const [savingRecords, setSavingRecords] = useState(false);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchSessions(selectedClassId);
      fetchStudents(selectedClassId);
      setSelectedSession(null);
    }
  }, [selectedClassId]);

  useEffect(() => {
    if (selectedSession) {
      fetchRecords(selectedSession.id);
    }
  }, [selectedSession]);

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

  const fetchSessions = async (classId: string) => {
    try {
      const res = await fetch(`/api/classes/${classId}/attendance-sessions`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
        
        // Auto-select session if passed as prop
        if (initialSessionId) {
          const found = data.find((s: any) => s.id === initialSessionId);
          if (found) {
            setSelectedSession(found);
          }
        }
      }
    } catch (err) {
      console.error(err);
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

  const fetchRecords = async (sessionId: string) => {
    try {
      const res = await fetch(`/api/attendance-sessions/${sessionId}/records`);
      if (res.ok) {
        const data: Attendance[] = await res.json();
        
        // Initialize records map with existing records or defaults
        const map: Record<string, { status: 'hadir' | 'sakit' | 'izin' | 'alfa'; notes: string }> = {};
        
        students.forEach(s => {
          const found = data.find(rec => rec.student_id === s.id);
          map[s.id] = {
            status: found ? found.status : 'hadir',
            notes: found ? found.notes || '' : ''
          };
        });
        
        setAttendanceRecords(map);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSessionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) return;

    try {
      const res = await fetch(`/api/classes/${selectedClassId}/attendance-sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          daily_pin: dailyPinInput || Math.floor(1000 + Math.random() * 9000).toString(),
          expires_hours: expireHoursInput
        })
      });

      if (res.ok) {
        setShowCreateSession(false);
        setDailyPinInput('');
        fetchSessions(selectedClassId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExpireSession = async (sessionId: string) => {
    if (!confirm('Apakah Anda yakin ingin mengakhiri sesi absensi ini sekarang?')) return;
    try {
      const res = await fetch(`/api/attendance-sessions/${sessionId}/expire`, { method: 'PATCH' });
      if (res.ok) {
        const updated = await res.json();
        setSelectedSession(updated);
        if (selectedClassId) {
          fetchSessions(selectedClassId);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRecordChange = (studentId: string, status: 'hadir' | 'sakit' | 'izin' | 'alfa', notes?: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        status,
        notes: notes !== undefined ? notes : prev[studentId]?.notes || ''
      }
    }));
  };

  const handleSaveRecords = async () => {
    if (!selectedSession) return;
    try {
      setSavingRecords(true);
      const recordsArray = Object.entries(attendanceRecords).map(([student_id, val]) => ({
        student_id,
        status: val.status,
        notes: val.notes
      }));

      const res = await fetch(`/api/attendance-sessions/${selectedSession.id}/records`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: recordsArray })
      });

      if (res.ok) {
        alert('Kehadiran siswa berhasil disimpan & divalidasi!');
        fetchRecords(selectedSession.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingRecords(false);
    }
  };

  const selectedClass = classesList.find(c => c.id === selectedClassId);

  return (
    <div className="space-y-6">
      {/* Header with class selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-emerald-400" />
            Presensi & Kehadiran Siswa
          </h1>
          <p className="text-sm text-slate-400">Buat QR/Token absensi mandiri siswa, atau absen secara manual.</p>
        </div>

        {classesList.length > 0 && (
          <select
            value={selectedClassId || ''}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-4 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-sm focus:outline-none transition appearance-none cursor-pointer"
          >
            {classesList.map(c => (
              <option key={c.id} value={c.id}>{c.name} (TA {c.academic_year})</option>
            ))}
          </select>
        )}
      </div>

      {classesList.length === 0 ? (
        <div className="bg-slate-800 p-8 rounded-2xl text-center border border-dashed border-slate-700">
          <p className="text-slate-400 font-medium">Anda harus membuat kelas terlebih dahulu untuk memulai absensi.</p>
          <button
            onClick={() => onNavigate('classes')}
            className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition"
          >
            Buat Kelas Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT PANEL: Sessions list */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base">Riwayat Sesi Absen</h3>
                <button
                  onClick={() => setShowCreateSession(!showCreateSession)}
                  className="p-1 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition cursor-pointer"
                  title="Buat Sesi Baru"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Create session quick form */}
              {showCreateSession && (
                <form onSubmit={handleCreateSessionSubmit} className="p-4 bg-slate-900/60 border border-slate-700/50 rounded-xl space-y-3.5">
                  <h4 className="font-bold text-sm text-slate-200">Sesi Absensi Mandiri Baru</h4>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">PIN Harian (4-6 angka)</label>
                    <input
                      type="text"
                      placeholder="Contoh: 1234 (Kosongkan untuk acak)"
                      value={dailyPinInput}
                      onChange={(e) => setDailyPinInput(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 focus:border-emerald-500 text-white rounded-lg text-xs font-mono focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Masa Berlaku (Jam)</label>
                    <select
                      value={expireHoursInput}
                      onChange={(e) => setExpireHoursInput(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 focus:border-emerald-500 text-white rounded-lg text-xs focus:outline-none transition"
                    >
                      <option value="1">1 Jam</option>
                      <option value="2">2 Jam</option>
                      <option value="4">4 Jam</option>
                      <option value="8">8 Jam</option>
                      <option value="24">1 Hari</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 text-xs pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCreateSession(false)}
                      className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md font-medium cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md font-semibold cursor-pointer"
                    >
                      Buka Sesi
                    </button>
                  </div>
                </form>
              )}

              {/* Sessions list iterator */}
              <div className="space-y-2.5 max-h-[400px] overflow-y-auto scrollbar-thin pr-1">
                {sessions.map((sess) => {
                  const isActive = sess.status === 'active' && new Date(sess.expires_at) > new Date();
                  const isSelected = selectedSession?.id === sess.id;
                  return (
                    <button
                      key={sess.id}
                      onClick={() => setSelectedSession(sess)}
                      className={`w-full text-left p-3 rounded-xl border transition flex flex-col gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500'
                          : 'bg-slate-900/40 border-slate-700/50 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs text-slate-500 font-mono">
                          {new Date(sess.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} • PIN {sess.daily_pin}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                          isActive
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-slate-700 text-slate-400'
                        }`}>
                          {isActive ? 'Aktif' : 'Selesai'}
                        </span>
                      </div>
                      <p className="font-bold text-sm text-slate-200">
                        {new Date(sess.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                      </p>
                    </button>
                  );
                })}

                {sessions.length === 0 && (
                  <p className="text-center text-xs text-slate-500 py-6">Belum ada sesi absensi di kelas ini.</p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL: Session students list / sheet */}
          <div className="lg:col-span-8">
            {selectedSession ? (
              <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-lg space-y-6">
                
                {/* Selected Session Info Section */}
                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-base">Detail Sesi Absensi {selectedClass?.name}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
                      <span>Tanggal: <span className="font-semibold text-slate-300">{new Date(selectedSession.created_at).toLocaleDateString('id-ID')}</span></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                        PIN Kelas: <span className="font-mono text-emerald-400 font-bold">{selectedSession.daily_pin}</span>
                      </span>
                    </p>
                    
                    {/* Shareable Link Box */}
                    {selectedSession.status === 'active' && new Date(selectedSession.expires_at) > new Date() && (
                      <div className="pt-2 flex items-center gap-2">
                        <span className="text-xs text-slate-500 shrink-0">Link Siswa:</span>
                        <div className="bg-slate-800 border border-slate-700 px-2.5 py-1 rounded text-[11px] font-mono text-slate-300 truncate max-w-[200px] md:max-w-xs">
                          {window.location.origin}/absensi/{selectedSession.token}
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`${window.location.origin}/absensi/${selectedSession.token}`);
                            alert('Tautan absensi disalin ke clipboard! Bagikan link ini ke grup WA kelas siswa.');
                          }}
                          className="p-1 hover:bg-slate-800 rounded text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
                          title="Salin Link"
                        >
                          <Link className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onNavigate('public-attendance', { token: selectedSession.token })}
                          className="p-1 hover:bg-slate-800 rounded text-indigo-400 hover:text-indigo-300 transition flex items-center gap-0.5 text-[10px] font-bold cursor-pointer"
                          title="Tes Sebagai Siswa"
                        >
                          <ExternalLink className="w-4 h-4" />
                          TES
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    {selectedSession.status === 'active' && new Date(selectedSession.expires_at) > new Date() ? (
                      <button
                        onClick={() => handleExpireSession(selectedSession.id)}
                        className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 rounded-lg text-xs font-bold transition cursor-pointer"
                      >
                        Akhiri Sesi
                      </button>
                    ) : (
                      <span className="bg-slate-800 text-slate-500 border border-slate-700 text-xs px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider">
                        Sesi Selesai
                      </span>
                    )}
                  </div>
                </div>

                {/* Students list sheet */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white text-base">Lembar Kehadiran Siswa</h4>
                    <span className="text-xs text-slate-400">Total: {students.length} Siswa</span>
                  </div>

                  <div className="border border-slate-700/60 rounded-xl overflow-hidden divide-y divide-slate-700/60">
                    {students.map((student) => {
                      const record = attendanceRecords[student.id] || { status: 'hadir', notes: '' };
                      return (
                        <div key={student.id} className="p-4 bg-slate-900/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <h5 className="font-bold text-slate-200 text-sm">{student.name}</h5>
                            <p className="text-xs text-slate-500">NIS: {student.nis} • {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                          </div>

                          {/* Options column */}
                          <div className="flex flex-col sm:items-end gap-2.5">
                            <div className="flex items-center gap-1.5">
                              {[
                                { val: 'hadir', label: 'Hadir', active: 'bg-emerald-600/20 text-emerald-400 border-emerald-500/40', inactive: 'bg-slate-800 hover:bg-slate-800/80 border-slate-700 text-slate-400' },
                                { val: 'sakit', label: 'Sakit', active: 'bg-amber-600/20 text-amber-400 border-amber-500/40', inactive: 'bg-slate-800 hover:bg-slate-800/80 border-slate-700 text-slate-400' },
                                { val: 'izin', label: 'Izin', active: 'bg-indigo-600/20 text-indigo-400 border-indigo-500/40', inactive: 'bg-slate-800 hover:bg-slate-800/80 border-slate-700 text-slate-400' },
                                { val: 'alfa', label: 'Alfa', active: 'bg-rose-600/20 text-rose-400 border-rose-500/40', inactive: 'bg-slate-800 hover:bg-slate-800/80 border-slate-700 text-slate-400' }
                              ].map((opt) => (
                                <button
                                  key={opt.val}
                                  type="button"
                                  onClick={() => handleRecordChange(student.id, opt.val as any)}
                                  className={`px-3 py-1.5 border rounded-lg text-xs font-semibold cursor-pointer transition ${
                                    record.status === opt.val ? opt.active : opt.inactive
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              ))}
                            </div>
                            
                            {/* Notes input for non-Hadir */}
                            {record.status !== 'hadir' && (
                              <input
                                type="text"
                                placeholder="Keterangan tambahan (cth: Surat dokter)"
                                value={record.notes}
                                onChange={(e) => handleRecordChange(student.id, record.status, e.target.value)}
                                className="px-3 py-1 bg-slate-850 border border-slate-700 focus:border-emerald-500 text-white rounded-lg text-xs w-full sm:w-64 focus:outline-none transition"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {students.length === 0 && (
                      <p className="p-6 text-center text-xs text-slate-500">Tidak ada siswa terdaftar di kelas ini.</p>
                    )}
                  </div>
                </div>

                {/* Save action button */}
                {students.length > 0 && (
                  <div className="pt-4 border-t border-slate-700/60 flex justify-end">
                    <button
                      onClick={handleSaveRecords}
                      disabled={savingRecords}
                      className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white text-sm font-semibold rounded-xl shadow-lg shadow-emerald-900/20 transition duration-150 flex items-center gap-1.5 cursor-pointer"
                    >
                      {savingRecords ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                      Verifikasi & Simpan Presensi
                    </button>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[350px] shadow-lg">
                <Clock className="w-12 h-12 text-slate-600 mb-3" />
                <h4 className="font-bold text-white text-base">Silakan Pilih Sesi Absensi</h4>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Pilih salah satu sesi absensi aktif atau selesai dari panel kiri, atau buat sesi baru untuk memantau rekap absensi siswa secara detail.
                </p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
