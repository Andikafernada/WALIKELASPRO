import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Edit2, Trash2, ArrowUpRight, ArrowDownRight, Users, Calendar, Sparkles, AlertCircle } from 'lucide-react';
import { ClassRoom, Student, CashLedger } from '../types';

interface CashLedgerViewProps {
  initialClassId?: string;
}

export default function CashLedgerView({ initialClassId }: CashLedgerViewProps) {
  const [classesList, setClassesList] = useState<ClassRoom[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(initialClassId || null);
  const [ledgers, setLedgers] = useState<CashLedger[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);
  const [studentIdInput, setStudentIdInput] = useState('');
  const [typeInput, setTypeInput] = useState<'income' | 'expense'>('income');
  const [amountInput, setAmountInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [transactionDateInput, setTransactionDateInput] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchLedgerData(selectedClassId);
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

  const fetchLedgerData = async (classId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/classes/${classId}/cash-ledgers`);
      if (res.ok) {
        const data = await res.json();
        setLedgers(data.sort((a: any, b: any) => new Date(b.transaction_date).getTime() - new Date(a.transaction_date).getTime()));
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

  const calculateTotals = () => {
    let income = 0;
    let expense = 0;
    ledgers.forEach((l) => {
      if (l.type === 'income') {
        income += Number(l.amount);
      } else {
        expense += Number(l.amount);
      }
    });
    return { income, expense, balance: income - expense };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClassId) return;

    if (!amountInput || !descriptionInput || !transactionDateInput) {
      alert('Semua kolom bertanda bintang (*) wajib diisi.');
      return;
    }

    const payload = {
      student_id: studentIdInput || null,
      type: typeInput,
      amount: amountInput,
      description: descriptionInput,
      transaction_date: transactionDateInput
    };

    const url = formId ? `/api/cash-ledgers/${formId}` : `/api/classes/${selectedClassId}/cash-ledgers`;
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
        fetchLedgerData(selectedClassId);
      } else {
        const err = await res.json();
        alert(err.error || 'Terjadi kesalahan saat menyimpan transaksi');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (ledger: CashLedger) => {
    setFormId(ledger.id);
    setStudentIdInput(ledger.student_id || '');
    setTypeInput(ledger.type);
    setAmountInput(ledger.amount.toString());
    setDescriptionInput(ledger.description);
    setTransactionDateInput(ledger.transaction_date);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan kas ini?')) return;
    try {
      const res = await fetch(`/api/cash-ledgers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (selectedClassId) fetchLedgerData(selectedClassId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setStudentIdInput('');
    setTypeInput('income');
    setAmountInput('');
    setDescriptionInput('');
    setTransactionDateInput(new Date().toISOString().split('T')[0]);
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const { income, expense, balance } = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-400" />
            Kas Kelas & Keuangan
          </h1>
          <p className="text-sm text-slate-400">Kelola arus kas masuk, pengeluaran kelas, dan tagihan bulanan siswa.</p>
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
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-sm transition flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            Catat Keuangan
          </button>
        </div>
      </div>

      {classesList.length === 0 ? (
        <div className="bg-slate-800 p-8 rounded-2xl text-center border border-dashed border-slate-700">
          <p className="text-slate-400 font-medium">Anda harus membuat kelas terlebih dahulu untuk menggunakan fitur Kas Kelas.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Kas Masuk</p>
                <h3 className="text-2xl font-bold text-emerald-400">{formatRupiah(income)}</h3>
              </div>
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <ArrowUpRight className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Pengeluaran</p>
                <h3 className="text-2xl font-bold text-rose-400">{formatRupiah(expense)}</h3>
              </div>
              <div className="p-3 bg-rose-500/10 text-rose-400 rounded-xl">
                <ArrowDownRight className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 shadow-lg flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo Bersih Saat Ini</p>
                <h3 className={`text-2xl font-bold ${balance >= 0 ? 'text-indigo-400' : 'text-rose-500'}`}>{formatRupiah(balance)}</h3>
              </div>
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <Wallet className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Ledger Table Section */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6 shadow-lg space-y-4">
            <h3 className="font-bold text-white text-base">Jurnal Keuangan Kas Kelas</h3>

            {loading ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-700/50">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-900/60 text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-700/60">
                      <th className="py-3 px-4">Tanggal</th>
                      <th className="py-3 px-4">Deskripsi / Catatan</th>
                      <th className="py-3 px-4">Siswa Pembayar</th>
                      <th className="py-3 px-4">Jenis</th>
                      <th className="py-3 px-4 text-right">Jumlah</th>
                      <th className="py-3 px-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/40 text-sm text-slate-300">
                    {ledgers.map((l) => {
                      const student = students.find((s) => s.id === l.student_id);
                      return (
                        <tr key={l.id} className="hover:bg-slate-900/25 transition">
                          <td className="py-3.5 px-4 font-mono text-xs">{l.transaction_date}</td>
                          <td className="py-3.5 px-4 font-semibold text-slate-200">{l.description}</td>
                          <td className="py-3.5 px-4">
                            {student ? (
                              <span className="flex items-center gap-1">
                                <Users className="w-3.5 h-3.5 text-slate-500" />
                                {student.name}
                              </span>
                            ) : (
                              <span className="text-slate-500 italic">Umum</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              l.type === 'income'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-rose-500/10 text-rose-400'
                            }`}>
                              {l.type === 'income' ? 'Masuk' : 'Keluar'}
                            </span>
                          </td>
                          <td className={`py-3.5 px-4 text-right font-bold ${
                            l.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                          }`}>
                            {l.type === 'income' ? '+' : '-'}{formatRupiah(l.amount)}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleEdit(l)}
                                className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
                                title="Edit"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(l.id)}
                                className="p-1.5 hover:bg-rose-500/10 rounded-lg text-slate-400 hover:text-rose-400 transition cursor-pointer"
                                title="Hapus"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {ledgers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-slate-500">
                          Belum ada data catatan keuangan kas di kelas ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------- CASH LEDGER FORM MODAL ----------------- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-lg">{formId ? 'Edit Catatan Kas' : 'Catat Kas / Keuangan Baru'}</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-white/10 rounded-lg transition cursor-pointer">
                <AlertCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Jenis Transaksi *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTypeInput('income')}
                    className={`py-2.5 px-3 border rounded-xl font-bold text-sm text-center transition cursor-pointer ${
                      typeInput === 'income'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-slate-900 border-slate-700 hover:bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    Pemasukan / Uang Masuk
                  </button>
                  <button
                    type="button"
                    onClick={() => setTypeInput('expense')}
                    className={`py-2.5 px-3 border rounded-xl font-bold text-sm text-center transition cursor-pointer ${
                      typeInput === 'expense'
                        ? 'bg-rose-500/10 border-rose-500 text-rose-400'
                        : 'bg-slate-900 border-slate-700 hover:bg-slate-900/60 text-slate-400'
                    }`}
                  >
                    Pengeluaran / Uang Keluar
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Siswa Pembayar (Opsional)</label>
                <select
                  value={studentIdInput}
                  onChange={(e) => setStudentIdInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl text-sm focus:outline-none transition appearance-none"
                >
                  <option value="">-- Pengeluaran Umum / Bukan Siswa --</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} ({s.nis})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Jumlah Uang (Rupiah) *</label>
                <input
                  type="number"
                  placeholder="Contoh: 50000"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl text-sm focus:outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Keterangan / Deskripsi *</label>
                <input
                  type="text"
                  placeholder="Contoh: Pembayaran kas bulan Juli, Pembelian sapu"
                  value={descriptionInput}
                  onChange={(e) => setDescriptionInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 focus:border-emerald-500 text-white rounded-xl text-sm focus:outline-none transition"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1.5">Tanggal Transaksi *</label>
                <input
                  type="date"
                  value={transactionDateInput}
                  onChange={(e) => setTransactionDateInput(e.target.value)}
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
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-semibold transition cursor-pointer"
                >
                  Simpan Transaksi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
