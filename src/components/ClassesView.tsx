import React, { useState, useEffect } from 'react';
import { Presentation, Plus, Edit2, Trash2, Users, Search, UserPlus, ArrowLeft, ShieldAlert, Phone, MapPin, User, Check, X } from 'lucide-react';
import { ClassRoom, Student } from '../types';

interface ClassesViewProps {
  initialSelectClassId?: string;
  user: any;
}

export default function ClassesView({ initialSelectClassId, user }: ClassesViewProps) {
  const [classesList, setClassesList] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(initialSelectClassId || null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState('');

  // Modals / Form States
  const [showClassModal, setShowClassModal] = useState(false);
  const [classFormId, setClassFormId] = useState<string | null>(null);
  const [classNameInput, setClassNameInput] = useState('');
  const [academicYearInput, setAcademicYearInput] = useState('2026/2027');
  const [roomInput, setRoomInput] = useState('');
  const [phonePetugasInput, setPhonePetugasInput] = useState('');
  const [phoneWalikelasInput, setPhoneWalikelasInput] = useState('');

  const [showStudentModal, setShowStudentModal] = useState(false);
  const [studentFormId, setStudentFormId] = useState<string | null>(null);
  const [nisInput, setNisInput] = useState('');
  const [studentNameInput, setStudentNameInput] = useState('');
  const [genderInput, setGenderInput] = useState<'L' | 'P'>('L');
  const [phoneParentInput, setPhoneParentInput] = useState('');
  const [addressInput, setAddressInput] = useState('');

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchStudents(selectedClassId);
    }
  }, [selectedClassId]);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/classes');
      if (res.ok) {
        const data = await res.json();
        setClassesList(data);
        if (initialSelectClassId) {
          setSelectedClassId(initialSelectClassId);
        }
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

  const handleClassSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classNameInput || !academicYearInput) {
      alert('Nama kelas dan tahun akademik wajib diisi.');
      return;
    }

    const payload = {
      name: classNameInput,
      academic_year: academicYearInput,
      room: roomInput,
      phone_petugas: phonePetugasInput,
      phone_walikelas: phoneWalikelasInput
    };

    const url = classFormId ? `/api/classes/${classFormId}` : '/api/classes';
    const method = classFormId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowClassModal(false);
        setClassFormId(null);
        resetClassForm();
        fetchClasses();
      } else {
        const err = await res.json();
        alert(err.error || 'Terjadi kesalahan saat menyimpan kelas');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClassEdit = (cls: ClassRoom) => {
    setClassFormId(cls.id);
    setClassNameInput(cls.name);
    setAcademicYearInput(cls.academic_year);
    setRoomInput(cls.room || '');
    setPhonePetugasInput(cls.phone_petugas || '');
    setPhoneWalikelasInput(cls.phone_walikelas || '');
    setShowClassModal(true);
  };

  const handleClassDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus kelas ini? Semua data siswa dan absensi di dalamnya juga akan terhapus secara permanen.')) {
      return;
    }
    try {
      const res = await fetch(`/api/classes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (selectedClassId === id) {
          setSelectedClassId(null);
        }
        fetchClasses();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetClassForm = () => {
    setClassNameInput('');
    setAcademicYearInput('2026/2027');
    setRoomInput('');
    setPhonePetugasInput('');
    setPhoneWalikelasInput('');
  };

  // Student CRUD
  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) return;

    if (!nisInput || !studentNameInput || !genderInput) {
      alert('NIS, Nama Lengkap, dan Jenis Kelamin wajib diisi.');
      return;
    }

    const payload = {
      nis: nisInput,
      name: studentNameInput,
      gender: genderInput,
      phone_parent: phoneParentInput,
      address: addressInput
    };

    const url = studentFormId ? `/api/students/${studentFormId}` : `/api/classes/${selectedClassId}/students`;
    const method = studentFormId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowStudentModal(false);
        setStudentFormId(null);
        resetStudentForm();
        fetchStudents(selectedClassId);
      } else {
        const err = await res.json();
        alert(err.error || 'Terjadi kesalahan saat menyimpan siswa');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStudentEdit = (std: Student) => {
    setStudentFormId(std.id);
    setNisInput(std.nis);
    setStudentNameInput(std.name);
    setGenderInput(std.gender);
    setPhoneParentInput(std.phone_parent || '');
    setAddressInput(std.address || '');
    setShowStudentModal(true);
  };

  const handleStudentDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus siswa ini beserta seluruh catatan absensi, kas, dan pelanggarannya?')) {
      return;
    }
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (selectedClassId) {
          fetchStudents(selectedClassId);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetStudentForm = () => {
    setNisInput('');
    setStudentNameInput('');
    setGenderInput('L');
    setPhoneParentInput('');
    setAddressInput('');
  };

  const getFilteredStudents = () => {
    return students.filter((std) => {
      const matchSearch = std.name.toLowerCase().includes(searchQuery.toLowerCase()) || std.nis.includes(searchQuery);
      const matchGender = genderFilter ? std.gender === genderFilter : true;
      return matchSearch && matchGender;
    });
  };

  const selectedClass = classesList.find((c) => c.id === selectedClassId);

  return (
    <div className="space-y-6">
      {/* ----------------- IF NO CLASS SELECTED: SHOW CLASS DIRECTORY ----------------- */}
      {!selectedClassId ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                <Presentation className="w-6 h-6 text-emerald-400" />
                Daftar Kelas Binaan
              </h1>
              <p className="text-sm text-slate-400">Pilih salah satu kelas untuk mengelola daftar siswa dan rekap harian.</p>
            </div>
            <button
              onClick={() => {
                setClassFormId(null);
                resetClassForm();
                setShowClassModal(true);
              }}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Tambah Kelas
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {classesList.map((cls) => (
                <div key={cls.id} className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 hover:border-slate-500 transition-all flex flex-col justify-between h-56 shadow-lg group">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition">{cls.name}</h3>
                        <p className="text-xs text-slate-500">Tahun Akademik: {cls.academic_year}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleClassEdit(cls); }}
                          className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                          title="Edit Kelas"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleClassDelete(cls.id); }}
                          className="p-1.5 hover:bg-rose-500/15 rounded-lg text-slate-400 hover:text-rose-400 transition cursor-pointer"
                          title="Hapus Kelas"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-400">
                      {cls.room && (
                        <p className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                          Ruangan: <span className="font-semibold text-slate-300">{cls.room}</span>
                        </p>
                      )}
                      {cls.phone_petugas && (
                        <p className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                          No. Petugas Piket: <span className="font-mono text-slate-300">{cls.phone_petugas}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="border-t border-slate-700/50 pt-4 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedClassId(cls.id)}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Users className="w-4 h-4" />
                      Kelola Siswa & Orang Tua
                    </button>
                  </div>
                </div>
              ))}

              {classesList.length === 0 && (
                <div className="col-span-full py-16 text-center text-slate-500 border border-2 border-dashed border-slate-700 rounded-2xl">
                  <Presentation className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-base font-semibold text-slate-400">Belum ada kelas yang terdaftar</p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Silakan tambahkan kelas pertama Anda dengan menekan tombol "Tambah Kelas" di kanan atas.</p>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        // ----------------- IF CLASS IS SELECTED: SHOW STUDENT WORKSPACE -----------------
        <div className="space-y-6">
          {/* Top Back/Details Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <button
              onClick={() => { setSelectedClassId(null); setSearchQuery(''); setGenderFilter(''); }}
              className="text-slate-400 hover:text-white text-sm font-semibold flex items-center gap-1.5 self-start cursor-pointer transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Daftar Kelas
            </button>

            <button
              onClick={() => {
                setStudentFormId(null);
                resetStudentForm();
                setShowStudentModal(true);
              }}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm transition flex items-center gap-1.5 self-end cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Tambah Siswa Baru
            </button>
          </div>

          {/* Selected Class Profile Details */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  {selectedClass?.name}
                  <span className="text-sm bg-slate-700 text-slate-300 font-semibold px-2.5 py-0.5 rounded-full">
                    {students.length} Siswa
                  </span>
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">Tahun Ajaran: {selectedClass?.academic_year} • Ruangan: {selectedClass?.room || 'Belum Diset'}</p>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 bg-slate-900/40 p-3 rounded-xl border border-slate-700/40">
                {selectedClass?.phone_petugas && (
                  <div><span className="text-slate-500">Piket:</span> <span className="font-mono text-emerald-400 font-medium">{selectedClass.phone_petugas}</span></div>
                )}
                {selectedClass?.phone_walikelas && (
                  <div><span className="text-slate-500">Wali Kelas:</span> <span className="font-mono text-indigo-400 font-medium">{selectedClass.phone_walikelas}</span></div>
                )}
              </div>
            </div>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-4 shadow-lg flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama siswa atau NIS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 text-white placeholder-slate-500 rounded-xl text-sm focus:outline-none transition"
              />
            </div>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full sm:w-44 px-4 py-2.5 bg-slate-900/60 border border-slate-700 focus:border-emerald-500 text-white rounded-xl text-sm focus:outline-none transition appearance-none"
            >
              <option value="">Semua Gender</option>
              <option value="L">Laki-Laki (L)</option>
              <option value="P">Perempuan (P)</option>
            </select>
          </div>

          {/* Student Grid / List */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {getFilteredStudents().map((std) => (
              <div key={std.id} className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between h-64 hover:border-slate-600 transition">
                <div className="space-y-4">
                  {/* Photo & Name */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 bg-slate-700/80 rounded-full flex items-center justify-center font-bold text-white text-base border-2 border-slate-600 uppercase">
                      {std.name.charAt(0)}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="font-bold text-white text-base truncate" title={std.name}>{std.name}</h4>
                      <p className="text-xs text-slate-500 font-mono">NIS: {std.nis} • {std.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                    </div>
                  </div>

                  {/* Attributes */}
                  <div className="space-y-2 text-xs text-slate-400">
                    {std.phone_parent && (
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        No. HP Wali: <span className="font-mono text-slate-300">{std.phone_parent}</span>
                      </p>
                    )}
                    {std.address && (
                      <p className="flex items-start gap-1.5 line-clamp-2">
                        <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        Alamat: <span className="text-slate-300">{std.address}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Score and actions */}
                <div className="border-t border-slate-700/50 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-xs">
                    <ShieldAlert className={`w-4 h-4 ${std.discipline_points >= 80 ? 'text-emerald-400' : std.discipline_points >= 60 ? 'text-amber-400' : 'text-rose-400'}`} />
                    <span className="text-slate-400">Poin Disiplin:</span>
                    <span className={`font-bold ${std.discipline_points >= 80 ? 'text-emerald-400' : std.discipline_points >= 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {std.discipline_points}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleStudentEdit(std)}
                      className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                      title="Edit Siswa"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleStudentDelete(std.id)}
                      className="p-2 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-400 transition cursor-pointer"
                      title="Hapus Siswa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {getFilteredStudents().length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 border border-dashed border-slate-700 rounded-2xl">
                Tidak ada siswa yang cocok dengan pencarian atau filter Anda.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- CLASS MODAL ----------------- */}
      {showClassModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-lg">{classFormId ? 'Edit Kelas Binaan' : 'Tambah Kelas Baru'}</h3>
              <button onClick={() => setShowClassModal(false)} className="p-1 hover:bg-white/10 rounded-lg transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleClassSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Nama Kelas *</label>
                <input
                  type="text"
                  placeholder="Contoh: XII RPL 1, XI MM 2"
                  value={classNameInput}
                  onChange={(e) => setClassNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl text-sm focus:outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Tahun Ajaran *</label>
                <input
                  type="text"
                  placeholder="Contoh: 2026/2027"
                  value={academicYearInput}
                  onChange={(e) => setAcademicYearInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl text-sm focus:outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Ruang Kelas (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: Lab Komputer 3, Gedung B lt. 2"
                  value={roomInput}
                  onChange={(e) => setRoomInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl text-sm focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">No. HP Petugas Piket (Opsional)</label>
                <input
                  type="text"
                  placeholder="Contoh: 0811xxxxxxxx"
                  value={phonePetugasInput}
                  onChange={(e) => setPhonePetugasInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl text-sm focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">No. HP Wali Kelas *</label>
                <input
                  type="text"
                  placeholder="No. HP Anda sendiri"
                  value={phoneWalikelasInput}
                  onChange={(e) => setPhoneWalikelasInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl text-sm focus:outline-none transition"
                />
              </div>
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setShowClassModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-sm font-semibold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition cursor-pointer"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ----------------- STUDENT MODAL ----------------- */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-lg">{studentFormId ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}</h3>
              <button onClick={() => setShowStudentModal(false)} className="p-1 hover:bg-white/10 rounded-lg transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleStudentSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Nomor Induk Siswa (NIS) *</label>
                <input
                  type="text"
                  placeholder="Contoh: 102601"
                  value={nisInput}
                  onChange={(e) => setNisInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl text-sm focus:outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Nama Lengkap Siswa *</label>
                <input
                  type="text"
                  placeholder="Contoh: Aditya Pratama"
                  value={studentNameInput}
                  onChange={(e) => setStudentNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl text-sm focus:outline-none transition"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Jenis Kelamin *</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={genderInput === 'L'}
                      onChange={() => setGenderInput('L')}
                      className="accent-emerald-500"
                    />
                    Laki-Laki (L)
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      checked={genderInput === 'P'}
                      onChange={() => setGenderInput('P')}
                      className="accent-emerald-500"
                    />
                    Perempuan (P)
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">No. HP Orang Tua / Wali (WhatsApp) *</label>
                <input
                  type="text"
                  placeholder="Contoh: 0856xxxxxxxx"
                  value={phoneParentInput}
                  onChange={(e) => setPhoneParentInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl text-sm focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Alamat Tempat Tinggal</label>
                <textarea
                  rows={2}
                  placeholder="Alamat lengkap siswa"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl text-sm focus:outline-none transition"
                />
              </div>
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-sm font-semibold transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition cursor-pointer"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
