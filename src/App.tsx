import React, { useState, useEffect } from 'react';
import { Presentation, CheckSquare, Wallet, AlertTriangle, MessageSquare, Zap, LayoutDashboard, Settings, User, LogOut, Menu, X, Home, LogIn, UserPlus, GraduationCap } from 'lucide-react';
import DashboardView from './components/DashboardView';
import ClassesView from './components/ClassesView';
import AttendanceView from './components/AttendanceView';
import CashLedgerView from './components/CashLedgerView';
import ViolationsView from './components/ViolationsView';
import WhatsAppView from './components/WhatsAppView';
import PremiumView from './components/PremiumView';
import PublicAttendanceView from './components/PublicAttendanceView';
import LandingPage from './components/LandingPage';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import { User as UserType } from './types';

type AuthView = 'landing' | 'login' | 'register' | 'app';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('landing');

  // Extra routing state passed to views
  const [extraState, setExtraState] = useState<any>(null);

  // Check localStorage for saved user on mount (NO auto-login from API)
  useEffect(() => {
    const savedUser = localStorage.getItem('walaspro_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setAuthView('app');
      } catch (e) {
        localStorage.removeItem('walaspro_user');
        setAuthView('landing');
      }
    } else {
      setAuthView('landing');
    }
    setLoading(false);
  }, []);

  // Check localStorage for saved user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('walaspro_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setAuthView('app');
      } catch (e) {
        localStorage.removeItem('walaspro_user');
      }
    }
  }, []);

  const handleLogin = (user: UserType) => {
    // Save to localStorage
    localStorage.setItem('walaspro_user', JSON.stringify(user));
    setCurrentUser(user);
    setAuthView('app');
  };

  const handleRegister = (user: UserType) => {
    // Save to localStorage
    localStorage.setItem('walaspro_user', JSON.stringify(user));
    setCurrentUser(user);
    setAuthView('app');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    // Clear localStorage
    localStorage.removeItem('walaspro_user');
    setCurrentUser(null);
    setAuthView('landing');
    setCurrentTab('dashboard');
    setMobileMenuOpen(false);
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

  // Check for public attendance URL
  const pathname = window.location.pathname;
  if (pathname.startsWith('/absensi/')) {
    const token = pathname.split('/').pop() || '';
    return <PublicAttendanceView token={token} />;
  }

  // Render auth views
  if (authView === 'login') {
    return (
      <LoginView
        onLogin={handleLogin}
        onSwitchToRegister={() => setAuthView('register')}
      />
    );
  }

  if (authView === 'register') {
    return (
      <RegisterView
        onRegister={handleRegister}
        onSwitchToLogin={() => setAuthView('login')}
      />
    );
  }

  if (authView === 'landing') {
    return (
      <LandingPage
        onLogin={() => setAuthView('login')}
        onRegister={() => setAuthView('register')}
      />
    );
  }

  // App authenticated view
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

  const handleNavigation = (tab: string, extra?: any) => {
    setExtraState(extra || null);
    setCurrentTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView onNavigate={handleNavigation} user={currentUser} onUpgrade={handleUpgradeUser} />;
      case 'classes':
        return <ClassesView />;
      case 'attendance':
        return <AttendanceView />;
      case 'cash':
        return <CashLedgerView />;
      case 'violations':
        return <ViolationsView />;
      case 'whatsapp':
        return <WhatsAppView />;
      case 'premium':
        return <PremiumView onUpgrade={handleUpgradeUser} onDowngrade={handleDowngradeUser} />;
      default:
        return <DashboardView onNavigate={handleNavigation} user={currentUser} onUpgrade={handleUpgradeUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 bg-slate-900 border-r border-slate-800 flex-col shrink-0">

        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-white tracking-wide text-sm leading-none">WALIKELAS<span className="text-emerald-400">PRO</span></h2>
            <p className="text-[10px] text-slate-400 font-semibold mt-1">ASISTEN WALI KELAS</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 py-6 space-y-1.5 overflow-y-auto scrollbar-thin">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            const canAccess = !item.premiumRequired || isPremium;

            return (
              <button
                key={item.id}
                onClick={() => canAccess && handleNavigation(item.id)}
                disabled={!canAccess}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20'
                    : item.highlight
                    ? 'bg-amber-500/10 hover:bg-amber-500/15 text-amber-400 border border-amber-500/20'
                    : canAccess
                    ? 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                    : 'text-slate-600 cursor-not-allowed'
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

        {/* User Footer with Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          {/* Landing Page Link */}
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 p-2 rounded-xl text-sm font-semibold text-slate-400 hover:bg-slate-800/60 hover:text-white transition"
          >
            <Home className="w-5 h-5" />
            Landing Page
          </a>

          {/* User Profile */}
          <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center border border-slate-600 font-bold text-slate-200">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-200 truncate">{currentUser?.name || 'User'}</h4>
              <p className="text-[10px] text-slate-400 truncate">{currentUser?.school_name || 'Sekolah'}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-2 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition"
          >
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <h2 className="font-extrabold text-white tracking-wide text-xs uppercase">WALIKELAS<span className="text-emerald-400">PRO</span></h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Keluar"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] bg-slate-950/95 backdrop-blur-sm z-50 p-4 flex flex-col overflow-y-auto">
          <nav className="space-y-1.5">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              const canAccess = !item.premiumRequired || isPremium;

              return (
                <button
                  key={item.id}
                  onClick={() => canAccess && handleNavigation(item.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : item.highlight
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : canAccess
                      ? 'text-slate-300 hover:bg-slate-800'
                      : 'text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </div>
                  {item.premiumRequired && !isPremium && (
                    <span className="bg-slate-800 text-slate-500 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">PRO</span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="mt-6 pt-6 border-t border-slate-800">
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-3 p-3.5 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-800"
            >
              <Home className="w-5 h-5" />
              Landing Page
            </a>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
}
