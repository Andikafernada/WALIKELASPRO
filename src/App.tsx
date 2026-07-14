import React, { useState, useEffect } from 'react';
import { Presentation, CheckSquare, Wallet, AlertTriangle, MessageSquare, Zap, LayoutDashboard, Settings, User, LogOut, Menu, X } from 'lucide-react';
import DashboardView from './components/DashboardView';
import ClassesView from './components/ClassesView';
import AttendanceView from './components/AttendanceView';
import CashLedgerView from './components/CashLedgerView';
import ViolationsView from './components/ViolationsView';
import WhatsAppView from './components/WhatsAppView';
import PremiumView from './components/PremiumView';
import PublicAttendanceView from './components/PublicAttendanceView';
import { User as UserType } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Extra routing state passed to views
  const [extraState, setExtraState] = useState<any>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data);
      }
    } catch (err) {
      console.error('Error loading user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeUser = async () => {
    try {
      const res = await fetch('/api/auth/upgrade', { method: 'POST' });
      if (res.ok) {
        const updated = await res.json();
        setCurrentUser(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDowngradeUser = async () => {
    try {
      const res = await fetch('/api/auth/downgrade', { method: 'POST' });
      if (res.ok) {
        const updated = await res.json();
        setCurrentUser(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Check if we should render student self-attendance page
  const pathname = window.location.pathname;
  if (pathname.startsWith('/absensi/')) {
    const token = pathname.split('/').pop() || '';
    return <PublicAttendanceView token={token} />;
  }

  // Handle direct navigation requests from inside dashboards
  const handleNavigation = (tab: string, extra?: any) => {
    setExtraState(extra || null);
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    
    // Smooth scroll to top on change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium text-sm">Menghubungkan ke Portal Wali Kelas...</p>
        </div>
      </div>
    );
  }

  const isPremium = currentUser?.premium_expires_at !== null && currentUser?.premium_expires_at !== undefined;

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'classes', label: 'Daftar Kelas & Siswa', icon: Presentation },
    { id: 'attendance', label: 'Presensi Harian', icon: CheckSquare },
    { id: 'cash', label: 'Kas & Keuangan', icon: Wallet, premiumRequired: true },
    { id: 'violations', label: 'Pelanggaran & Poin', icon: AlertTriangle, premiumRequired: true },
    { id: 'whatsapp', label: 'WhatsApp Gateway', icon: MessageSquare, premiumRequired: true },
    { id: 'premium', label: 'Layanan Premium', icon: Zap, highlight: true }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* ----------------- SIDEBAR LAYOUT (Desktop) ----------------- */}
      <aside className="hidden md:flex md:w-64 lg:w-72 bg-slate-900 border-r border-slate-800 flex-col shrink-0">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-emerald-700/20">
            W
          </div>
          <div>
            <h2 className="font-extrabold text-white tracking-wide text-sm leading-none uppercase">Pro Walas</h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">ASISTEN WALI KELAS</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4 py-6 space-y-1.5 overflow-y-auto scrollbar-thin">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const canAccess = !item.premiumRequired || isPremium;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                    : item.highlight
                    ? 'bg-amber-500/10 hover:bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.premiumRequired && !isPremium && (
                  <span className="bg-slate-800 text-slate-500 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    PRO
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User profile footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/40 border border-slate-800">
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 font-bold text-slate-200">
              {currentUser?.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-200 truncate">{currentUser?.name}</h4>
              <p className="text-[10px] text-slate-400 truncate">{currentUser?.school_name}</p>
            </div>
          </div>
        </div>

      </aside>

      {/* ----------------- MOBILE TOP HEADER ----------------- */}
      <header className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-base shadow-lg shadow-emerald-700/20">
            W
          </div>
          <h2 className="font-extrabold text-white tracking-wide text-xs uppercase">Pro Walas</h2>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[65px] bg-slate-950/95 backdrop-blur-sm z-50 p-4 flex flex-col justify-between">
          <nav className="space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : item.highlight
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                  {item.premiumRequired && !isPremium && (
                    <span className="bg-slate-800 text-slate-500 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">PRO</span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center font-bold text-slate-200">
              {currentUser?.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-200 truncate">{currentUser?.name}</h4>
              <p className="text-[10px] text-slate-400 truncate">{currentUser?.school_name}</p>
            </div>
          </div>
        </div>
      )}

      {/* ----------------- MAIN VIEW CONTENT CONTAINER ----------------- */}
      <main className="flex-1 p-5 sm:p-8 md:max-w-4xl lg:max-w-5xl xl:max-w-7xl mx-auto w-full space-y-6">
        
        {/* Render Tab View */}
        {currentTab === 'dashboard' && (
          <DashboardView onNavigate={handleNavigation} user={currentUser} />
        )}

        {currentTab === 'classes' && (
          <ClassesView initialSelectClassId={extraState?.selectClassId} user={currentUser} />
        )}

        {currentTab === 'attendance' && (
          <AttendanceView
            initialClassId={extraState?.classId}
            initialSessionId={extraState?.openSessionId}
            onNavigate={handleNavigation}
          />
        )}

        {currentTab === 'cash' && (
          isPremium ? (
            <CashLedgerView initialClassId={extraState?.classId} />
          ) : (
            <div className="text-center py-16 bg-slate-800 border border-slate-700/60 rounded-3xl max-w-lg mx-auto p-6 space-y-5">
              <div className="p-4 bg-amber-500/10 text-amber-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto animate-bounce">
                <Wallet className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">Kas & Keuangan Adalah Fitur Premium</h3>
                <p className="text-xs text-slate-400">Upgrade akun Anda ke layanan PRO Walas Premium untuk mengelola laporan kas masuk/keluar kelas dan pencatatan iuran bulanan siswa secara transparan.</p>
              </div>
              <button
                onClick={() => handleNavigation('premium')}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-900/20 cursor-pointer"
              >
                Upgrade Premium Sekarang
              </button>
            </div>
          )
        )}

        {currentTab === 'violations' && (
          isPremium ? (
            <ViolationsView initialClassId={extraState?.classId} user={currentUser} />
          ) : (
            <div className="text-center py-16 bg-slate-800 border border-slate-700/60 rounded-3xl max-w-lg mx-auto p-6 space-y-5">
              <div className="p-4 bg-amber-500/10 text-amber-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto animate-bounce">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">Sanksi & Pelanggaran Adalah Fitur Premium</h3>
                <p className="text-xs text-slate-400">Upgrade ke layanan PRO Walas Premium untuk mencatat denda poin perilaku pelanggaran tata tertib dan mengawasi kedisiplinan siswa harian.</p>
              </div>
              <button
                onClick={() => handleNavigation('premium')}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-900/20 cursor-pointer"
              >
                Upgrade Premium Sekarang
              </button>
            </div>
          )
        )}

        {currentTab === 'whatsapp' && (
          isPremium ? (
            <WhatsAppView />
          ) : (
            <div className="text-center py-16 bg-slate-800 border border-slate-700/60 rounded-3xl max-w-lg mx-auto p-6 space-y-5">
              <div className="p-4 bg-amber-500/10 text-amber-400 rounded-full w-16 h-16 flex items-center justify-center mx-auto animate-bounce">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-bold text-white">WhatsApp Gateway Adalah Fitur Premium</h3>
                <p className="text-xs text-slate-400">Hubungkan bot nomor WhatsApp Anda untuk mengirimkan notifikasi absensi dan denda poin pelanggaran tata tertib otomatis ke wali murid.</p>
              </div>
              <button
                onClick={() => handleNavigation('premium')}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-900/20 cursor-pointer"
              >
                Upgrade Premium Sekarang
              </button>
            </div>
          )
        )}

        {currentTab === 'premium' && (
          <PremiumView user={currentUser} onUpgrade={handleUpgradeUser} onDowngrade={handleDowngradeUser} />
        )}

      </main>

    </div>
  );
}
