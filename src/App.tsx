import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { Presentation, CheckSquare, Wallet, AlertTriangle, MessageSquare, Zap, LayoutDashboard, LogOut, Menu, X, Home, GraduationCap, CreditCard } from 'lucide-react';
import DashboardView from './components/DashboardView';
import ClassesView from './components/ClassesView';
import AttendanceView from './components/AttendanceView';
import CashLedgerView from './components/CashLedgerView';
import ViolationsView from './components/ViolationsView';
import WhatsAppView from './components/WhatsAppView';
import PremiumView from './components/PremiumView';
import PaymentView from './components/PaymentView';
import PublicAttendanceView from './components/PublicAttendanceView';
import LandingPage from './components/LandingPage';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import { User as UserType } from './types';

// Protected Route Component
function ProtectedRoute({ children, user }: { children: React.ReactNode; user: UserType | null }) {
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

// Sidebar Component
function Sidebar({ user, onLogout }: { user: UserType; onLogout: () => void }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/app/classes', label: 'Kelas & Siswa', icon: Presentation },
    { path: '/app/attendance', label: 'Presensi Harian', icon: CheckSquare },
    { path: '/app/cash', label: 'Kas & Keuangan', icon: Wallet, premium: true },
    { path: '/app/violations', label: 'Pelanggaran', icon: AlertTriangle, premium: true },
    { path: '/app/whatsapp', label: 'WhatsApp Gateway', icon: MessageSquare, premium: true },
    { path: '/app/premium', label: 'Layanan Premium', icon: Zap, highlight: true },
  ];

  const isPremium = user?.premium_expires_at !== null && user?.premium_expires_at !== undefined;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-extrabold text-white tracking-wide text-sm leading-none">WALIKELAS<span className="text-emerald-400">PRO</span></div>
            <div className="text-[10px] text-slate-400 font-semibold mt-1">ASISTEN WALI KELAS</div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const canAccess = !item.premium || isPremium;

            if (!canAccess) return null;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : item.highlight
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.premium && !isPremium && (
                  <span className="ml-auto text-[9px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-bold">PRO</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-3 p-2 text-slate-400 hover:text-white transition"
          >
            <Home className="w-5 h-5" />
            <span className="text-sm font-semibold">Landing Page</span>
          </Link>
          <div className="flex items-center gap-3 p-2 bg-slate-800/50 border border-slate-700/50 rounded-xl">
            <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center font-bold">{user.name?.charAt(0) || 'U'}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-200 truncate">{user.name || 'User'}</div>
              <div className="text-[10px] text-slate-400 truncate">{user.school_name || 'Sekolah'}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 p-2 text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-semibold">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="flex-1 flex flex-col">
        <header className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-white">WALIKELAS<span className="text-emerald-400">PRO</span></span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/premium" className="p-2 text-amber-400" title="Premium">
              <CreditCard className="w-6 h-6" />
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-400">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-b border-slate-700 p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              const canAccess = !item.premium || isPremium;
              if (!canAccess) return null;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-sm font-semibold ${
                    isActive ? 'bg-emerald-600 text-white' : 'text-slate-300'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
            {/* Theme Toggle */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 text-slate-300"
            >
            </button>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 p-3 text-rose-400"
            >
              <LogOut className="w-5 h-5" />
              Keluar
            </button>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// Wrapper component to handle navigation for DashboardView
function DashboardViewWithNavigate({ user }: { user: UserType }) {
  const navigate = useNavigate();
  const onNavigate = (tab: string, extra?: any) => {
    // Build the path
    let path = `/app/${tab}`;
    navigate(path);
  };
  return <DashboardView user={user} onNavigate={onNavigate} />;
}

// App Content with Routes
function AppContent() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in via server session
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          // Also save to localStorage for backup
          localStorage.setItem('walaspro_user', JSON.stringify(userData));
        } else {
          // Not logged in, clear localStorage
          localStorage.removeItem('walaspro_user');
        }
      } catch (err) {
        // Network error, try localStorage as fallback
        const savedUser = localStorage.getItem('walaspro_user');
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (e) {
            localStorage.removeItem('walaspro_user');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (userData: UserType) => {
    localStorage.setItem('walaspro_user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (err) {
      console.error('Logout API error:', err);
    } finally {
      localStorage.removeItem('walaspro_user');
      setUser(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-400">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* public Routes */}
      <Route path="/" element={
        user ? <Navigate to="/app/dashboard" replace /> : <LandingPage onLogin={() => {}} onRegister={() => {}} />
      } />
      <Route path="/login" element={<LoginView onLogin={handleLogin} onSwitchToRegister={() => {}} />} />
      <Route path="/register" element={<RegisterView onRegister={handleLogin} onSwitchToLogin={() => {}} />} />
      <Route path="/absensi/:token" element={<PublicAttendanceView token="" />} />

      {/* Protected App Routes */}
      <Route path="/app" element={
        <ProtectedRoute user={user}>
          <Sidebar user={user!} onLogout={handleLogout} />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardViewWithNavigate user={user!} />} />
        <Route path="classes" element={<ClassesView />} />
        <Route path="attendance" element={<AttendanceView />} />
        <Route path="cash" element={<CashLedgerView />} />
        <Route path="violations" element={<ViolationsView />} />
        <Route path="whatsapp" element={<WhatsAppView />} />
        <Route path="premium" element={<PremiumView onUpgrade={() => {}} onDowngrade={() => {}} />} />
        <Route path="payment" element={<PaymentView />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return <AppContent />;
}
