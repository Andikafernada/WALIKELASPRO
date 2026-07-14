import React, { useState, useEffect } from 'react';
import { Users, Presentation, Wallet, AlertTriangle, KeyRound, Clock, Plus, Zap, ArrowRight, ShieldCheck, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { ClassRoom, Student, CashLedger, Violation, AttendanceSession } from '../types';

interface DashboardViewProps {
  onNavigate: (tab: string, extra?: any) => void;
  user: any;
}

export default function DashboardView({ onNavigate, user }: DashboardViewProps) {
  const [classesList, setClassesList] = useState<ClassRoom[]>([]);
  const [studentsList, setStudentsList] = useState<Student[]>([]);
  const [cashList, setCashList] = useState<CashLedger[]>([]);
  const [violationsList, setViolationsList] = useState<Violation[]>([]);
  const [sessionsList, setSessionsList] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [resClasses, resWa] = await Promise.all([
        fetch('/api/classes'),
        fetch('/api/settings/whatsapp')
      ]);

      if (resClasses.ok) {
        const clsData = await resClasses.json();
        setClassesList(clsData);

        // Fetch students and other data per class (or simplify since we are full-stack in server)
        const studentsPromises = clsData.map((c: any) => fetch(`/api/classes/${c.id}/students`).then(r => r.json()));
        const cashPromises = clsData.map((c: any) => fetch(`/api/classes/${c.id}/cash-ledgers`).then(r => r.json()));
        const violPromises = clsData.map((c: any) => fetch(`/api/classes/${c.id}/violations`).then(r => r.json()));
        const sessPromises = clsData.map((c: any) => fetch(`/api/classes/${c.id}/attendance-sessions`).then(r => r.json()));

        const allStudentsArr = await Promise.all(studentsPromises);
        const allCashArr = await Promise.all(cashPromises);
        const allViolArr = await Promise.all(violPromises);
        const allSessArr = await Promise.all(sessPromises);

        setStudentsList(allStudentsArr.flat());
        setCashList(allCashArr.flat());
        setViolationsList(allViolArr.flat());
        setSessionsList(allSessArr.flat());
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateCashBalance = () => {
    let balance = 0;
    cashList.forEach(item => {
      if (item.type === 'income') {
        balance += Number(item.amount);
      } else {
        balance -= Number(item.amount);
      }
    });
    return balance;
  };

  const getRecentViolations = () => {
    return [...violationsList]
      .sort((a, b) => new Date(b.violation_date).getTime() - new Date(a.violation_date).getTime())
      .slice(0, 4);
  };

  const getRecentTransactions = () => {
    return [...cashList]
      .sort((a, b) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime())
      .slice(0, 4);
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const activeSessions = sessionsList.filter(s => s.status === 'active' && new Date(s.expires_at) > new Date());

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="relative bg-slate-800 border border-slate-700/60 rounded-3xl p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-400 to-transparent"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Wali Kelas Dashboard
            </span>
            {user.premium_expires_at ? (
              <span className="bg-amber-500/15 text-amber-400 text-xs px-3 py-1 rounded-full font-semibold uppercase tracking-wider flex items-center gap-1 animate-pulse">
                <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
                PREMIUM ACTIVE
              </span>
            ) : (
              <span className="bg-slate-700 text-slate-300 text-xs px-3 py-1 rounded-full font-semibold">
                FREE VERSION
              </span>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Halo, {user.name}
            </h1>
            <p className="text-slate-400 mt-1 max-w-2xl text-sm sm:text-base">
              Selamat datang di asisten manajemen kelas Anda. Pantau kehadiran siswa, kas kelas, pelanggaran disiplin, dan kirimkan notifikasi instan langsung ke WhatsApp wali murid.
            </p>
          </div>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('classes')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-medium transition flex items-center gap-2 cursor-pointer"
            >
              Kelola Kelas
              <ArrowRight className="w-4 h-4" />
            </button>
            {!user.premium_expires_at && (
              <button
                onClick={() => onNavigate('premium')}
                className="px-5 py-2.5 bg-slate-700 hover:bg-slate-600 text-amber-400 rounded-xl font-medium transition flex items-center gap-1.5 cursor-pointer border border-amber-500/20"
              >
                <Zap className="w-4 h-4 fill-amber-400" />
                Upgrade Premium
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Presentation className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Kelas</p>
            <h3 className="text-2xl font-bold text-white mt-1">{classesList.length} Kelas</h3>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Total Siswa</p>
            <h3 className="text-2xl font-bold text-white mt-1">{studentsList.length} Siswa</h3>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Saldo Kas Kelas</p>
            <h3 className="text-2xl font-bold text-white mt-1">{formatRupiah(calculateCashBalance())}</h3>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Pelanggaran Log</p>
            <h3 className="text-2xl font-bold text-white mt-1">{violationsList.length} Catatan</h3>
          </div>
        </div>
      </div>

      {/* Main Content Grid Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Sesi Absensi Aktif & Kelas List */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Active Attendance Session Banner */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-400" />
                Sesi Absensi Mandiri Aktif
              </h2>
              <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                {activeSessions.length} Aktif
              </span>
            </div>

            {activeSessions.length > 0 ? (
              <div className="space-y-4">
                {activeSessions.map((sess) => {
                  const classObj = classesList.find(c => c.id === sess.class_id);
                  return (
                    <div key={sess.id} className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs text-slate-500">Kelas</span>
                        <h4 className="font-bold text-white text-base">{classObj?.name || 'Sesi Absensi'}</h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                          <span className="flex items-center gap-1 text-slate-300">
                            <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                            PIN: <span className="font-mono font-bold tracking-wider text-emerald-400">{sess.daily_pin}</span>
                          </span>
                          <span>Berakhir: {new Date(sess.expires_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onNavigate('attendance', { classId: sess.class_id, openSessionId: sess.id })}
                          className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer"
                        >
                          Pantau Rekap
                        </button>
                        <button
                          onClick={() => onNavigate('public-attendance', { token: sess.token })}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                        >
                          Isi Sebagai Siswa
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-6 text-center text-slate-500 space-y-2">
                <p className="text-sm">Tidak ada sesi absensi mandiri yang sedang aktif saat ini.</p>
                <button
                  onClick={() => onNavigate('attendance')}
                  className="px-4 py-1.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-semibold transition cursor-pointer"
                >
                  Mulai Sesi Baru
                </button>
              </div>
            )}
          </div>

          {/* Quick Classroom Quick Access */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-lg space-y-4">
            <h2 className="text-lg font-bold text-white">Daftar Kelas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {classesList.map((cls) => {
                const classStudents = studentsList.filter(s => s.class_id === cls.id);
                return (
                  <div key={cls.id} className="bg-slate-900/40 border border-slate-700/40 rounded-xl p-4 flex flex-col justify-between h-36 hover:border-slate-600 transition">
                    <div>
                      <h4 className="font-bold text-white text-lg">{cls.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Tahun Ajaran {cls.academic_year}</p>
                      <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-indigo-400" />
                        {classStudents.length} Siswa Terdaftar
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800">
                      <button
                        onClick={() => onNavigate('classes', { selectClassId: cls.id })}
                        className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1 cursor-pointer"
                      >
                        Siswa
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-slate-700">|</span>
                      <button
                        onClick={() => onNavigate('attendance', { classId: cls.id })}
                        className="text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
                      >
                        Absensi
                      </button>
                      <span className="text-slate-700">|</span>
                      <button
                        onClick={() => onNavigate('cash', { classId: cls.id })}
                        className="text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer"
                      >
                        Kas
                      </button>
                    </div>
                  </div>
                );
              })}
              {classesList.length === 0 && (
                <div className="col-span-2 text-center py-8 text-slate-500 border border-dashed border-slate-700 rounded-xl">
                  Belum ada kelas yang terdaftar. Tambahkan kelas pertama Anda sekarang.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Violations, Recent Transactions & Quick Actions */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Recent Violations Panel */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-lg space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              Pelanggaran Disiplin Terbaru
            </h2>
            <div className="space-y-3">
              {getRecentViolations().map((v) => {
                const student = studentsList.find(s => s.id === v.student_id);
                return (
                  <div key={v.id} className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-200">{student?.name || 'Siswa'}</span>
                      <span className="bg-rose-500/10 text-rose-400 font-bold px-2 py-0.5 rounded-md">
                        -{v.point_deducted} Poin
                      </span>
                    </div>
                    <p className="text-slate-400">{v.category} • <span className="italic">"{v.description}"</span></p>
                    <p className="text-slate-500 text-[10px] mt-1">{v.violation_date}</p>
                  </div>
                );
              })}
              {violationsList.length === 0 && (
                <p className="text-xs text-slate-500 py-2 text-center">Belum ada pelanggaran disiplin tercatat.</p>
              )}
            </div>
            <button
              onClick={() => onNavigate('violations')}
              className="w-full py-2 bg-slate-700/40 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg transition text-center cursor-pointer"
            >
              Lihat Semua Log Pelanggaran
            </button>
          </div>

          {/* Recent Cash Flow Transactions */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-lg space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-400" />
              Keuangan Kas Terbaru
            </h2>
            <div className="space-y-3">
              {getRecentTransactions().map((t) => {
                const student = studentsList.find(s => s.id === t.student_id);
                return (
                  <div key={t.id} className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 text-xs flex items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-200">{t.description}</p>
                      <p className="text-slate-400">
                        {student ? `Oleh: ${student.name}` : 'Umum'} • {t.transaction_date}
                      </p>
                    </div>
                    <span className={`font-bold text-sm ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {t.type === 'income' ? '+' : '-'}{formatRupiah(t.amount)}
                    </span>
                  </div>
                );
              })}
              {cashList.length === 0 && (
                <p className="text-xs text-slate-500 py-2 text-center">Belum ada transaksi kas kelas tercatat.</p>
              )}
            </div>
            <button
              onClick={() => onNavigate('cash')}
              className="w-full py-2 bg-slate-700/40 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-lg transition text-center cursor-pointer"
            >
              Lihat Laporan Keuangan Lengkap
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
