import React from 'react';
import {
  Presentation,
  Users,
  Calendar,
  Wallet,
  AlertTriangle,
  MessageSquare,
  Search,
  FileX,
  Inbox,
  UserPlus,
  CheckSquare,
  FolderOpen,
  GraduationCap,
  TrendingUp,
  Bell,
  Settings,
  CreditCard,
  Shield,
  QrCode,
  Send
} from 'lucide-react';

// Base Empty State Props
interface BaseEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
  };
  className?: string;
}

// Base Empty State Component
export function EmptyState({
  icon,
  title,
  description,
  action,
  className = ''
}: BaseEmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {icon && (
        <div className="w-20 h-20 bg-slate-800/80 rounded-3xl flex items-center justify-center mb-5 text-slate-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-200 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition ${
            action.variant === 'secondary'
              ? 'bg-slate-700 hover:bg-slate-600 text-white'
              : action.variant === 'outline'
              ? 'bg-transparent border border-slate-600 hover:border-slate-500 text-slate-300'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// Illustration SVG components
const Illustrations = {
  NoData: () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="30" width="80" height="60" rx="8" fill="#334155" stroke="#475569" strokeWidth="2"/>
      <rect x="30" y="45" width="40" height="4" rx="2" fill="#64748B"/>
      <rect x="30" y="55" width="60" height="4" rx="2" fill="#475569"/>
      <rect x="30" y="65" width="50" height="4" rx="2" fill="#475569"/>
      <circle cx="90" cy="90" r="20" fill="#1e293b" stroke="#334155" strokeWidth="2"/>
      <path d="M85 90H95M90 85V95" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),

  NoClasses: () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="25" width="70" height="50" rx="6" fill="#334155" stroke="#475569" strokeWidth="2"/>
      <path d="M60 35V85" stroke="#64748B" strokeWidth="2"/>
      <path d="M35 60H85" stroke="#64748B" strokeWidth="2"/>
      <circle cx="90" cy="90" r="20" fill="#1e293b" stroke="#334155" strokeWidth="2"/>
      <path d="M90 80V100M80 90H100" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),

  NoStudents: () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="45" r="20" fill="#334155" stroke="#475569" strokeWidth="2"/>
      <path d="M35 90C35 73.4315 48.4315 60 65 60H75C91.5685 60 105 73.4315 105 90V95H35V90Z" fill="#334155" stroke="#475569" strokeWidth="2"/>
      <circle cx="95" cy="90" r="15" fill="#1e293b" stroke="#334155" strokeWidth="2"/>
      <path d="M90 90H100M95 85V95" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),

  NoAttendance: () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="30" y="20" width="60" height="80" rx="8" fill="#334155" stroke="#475569" strokeWidth="2"/>
      <path d="M45 35H75" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="60" cy="60" r="15" stroke="#64748B" strokeWidth="2"/>
      <path d="M60 50V60L65 65" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
      <rect x="40" y="75" width="40" height="3" rx="1.5" fill="#475569"/>
      <rect x="45" y="82" width="30" height="3" rx="1.5" fill="#475569"/>
    </svg>
  ),

  NoMoney: () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="35" width="70" height="50" rx="8" fill="#334155" stroke="#475569" strokeWidth="2"/>
      <circle cx="60" cy="60" r="15" stroke="#64748B" strokeWidth="2"/>
      <path d="M55 55V65M65 55V65" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
      <path d="M60 45C60 45 50 50 50 58C50 66 60 68 60 68C60 68 70 66 70 58C70 50 60 45 60 45Z" stroke="#64748B" strokeWidth="2"/>
    </svg>
  ),

  NoViolations: () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="35" fill="#334155" stroke="#475569" strokeWidth="2"/>
      <path d="M45 75L55 65L65 75L75 55" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="45" cy="45" r="15" fill="#1e293b" stroke="#334155" strokeWidth="2"/>
      <path d="M42 45L44 47L48 43" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),

  NoMessages: () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M25 30H95C97.2091 30 99 31.7909 99 34V76C99 78.2091 97.2091 80 95 80H55L40 95V34C40 31.7909 41.7909 30 44 30H25Z" fill="#334155" stroke="#475569" strokeWidth="2"/>
      <path d="M45 45H75" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
      <path d="M45 55H65" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),

  SearchEmpty: () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="25" fill="#334155" stroke="#475569" strokeWidth="2"/>
      <path d="M68 68L85 85" stroke="#64748B" strokeWidth="4" strokeLinecap="round"/>
      <path d="M42 50H58M50 42V58" stroke="#64748B" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),

  Success: () => (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="35" fill="#064e3b" stroke="#059669" strokeWidth="2"/>
      <path d="M45 60L55 70L75 50" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};

// Preset Empty States
export function NoClassesState({ onCreateClass }: { onCreateClass?: () => void }) {
  return (
    <EmptyState
      icon={<Illustrations.NoClasses />}
      title="Belum Ada Kelas"
      description="Mulai dengan menambahkan kelas pertama Anda. Setiap kelas bisa memiliki daftar siswa, absensi, kas, dan catatan pelanggaran."
      action={onCreateClass ? {
        label: 'Tambah Kelas Baru',
        onClick: onCreateClass,
        variant: 'primary'
      } : undefined}
    />
  );
}

export function NoStudentsState({ onAddStudent }: { onAddStudent?: () => void }) {
  return (
    <EmptyState
      icon={<Illustrations.NoStudents />}
      title="Belum Ada Siswa"
      description="Tambahkan siswa ke kelas ini. Anda bisa mengimpor dari file Excel atau menambahkan satu per satu."
      action={onAddStudent ? {
        label: 'Tambah Siswa',
        onClick: onAddStudent,
        variant: 'primary'
      } : undefined}
    />
  );
}

export function NoAttendanceState({ onCreateSession }: { onCreateSession?: () => void }) {
  return (
    <EmptyState
      icon={<Illustrations.NoAttendance />}
      title="Belum Ada Sesi Absensi"
      description="Buat sesi absensi mandiri agar siswa bisa mengisi kehadiran mereka sendiri melalui tautan atau QR code."
      action={onCreateSession ? {
        label: 'Buat Sesi Absensi',
        onClick: onCreateSession,
        variant: 'primary'
      } : undefined}
    />
  );
}

export function NoTransactionsState({ onAddTransaction }: { onAddTransaction?: () => void }) {
  return (
    <EmptyState
      icon={<Illustrations.NoMoney />}
      title="Belum Ada Transaksi"
      description="Catat pemasukan dan pengeluaran kas kelas untuk transparansi keuangan yang lebih baik."
      action={onAddTransaction ? {
        label: 'Catat Transaksi',
        onClick: onAddTransaction,
        variant: 'primary'
      } : undefined}
    />
  );
}

export function NoViolationsState({ onAddViolation }: { onAddViolation?: () => void }) {
  return (
    <EmptyState
      icon={<Illustrations.NoViolations />}
      title="Tidak Ada Pelanggaran"
      description="Keren! Belum ada catatan pelanggaran di kelas ini. Tetap pertahankan kedisiplinan siswa."
      action={onAddViolation ? {
        label: 'Catat Pelanggaran',
        onClick: onAddViolation,
        variant: 'outline'
      } : undefined}
    />
  );
}

export function NoMessagesState() {
  return (
    <EmptyState
      icon={<Illustrations.NoMessages />}
      title="Belum Ada Pesan"
      description="Pesan notifikasi WhatsApp akan muncul di sini setelah Anda mengirim pesan ke wali murid."
    />
  );
}

export function SearchEmptyState({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={<Illustrations.SearchEmpty />}
      title={query ? `Tidak Ada Hasil untuk "${query}"` : 'Tidak Ada Hasil'}
      description={query
        ? `Coba gunakan kata kunci lain atau periksa ejaan Anda.`
        : 'Mulai mengetik untuk mencari.'}
    />
  );
}

export function NoDataState({ message }: { message?: string }) {
  return (
    <EmptyState
      icon={<Illustrations.NoData />}
      title="Belum Ada Data"
      description={message || 'Data akan muncul di sini setelah Anda menambahkannya.'}
    />
  );
}

// Icon-based Empty States (simpler version)
export function ClassesEmptyState({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon={<Presentation className="w-10 h-10" />}
      title="Belum Ada Kelas"
      description="Tambahkan kelas pertama Anda untuk mulai mengelola data siswa dan absensi."
      action={onAdd ? {
        label: 'Tambah Kelas',
        onClick: onAdd,
        variant: 'primary'
      } : undefined}
    />
  );
}

export function StudentsEmptyState({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon={<Users className="w-10 h-10" />}
      title="Belum Ada Siswa"
      description="Daftar siswa kosong. Tambahkan siswa untuk mulai mengelola absensi dan catatan."
      action={onAdd ? {
        label: 'Tambah Siswa',
        onClick: onAdd,
        variant: 'primary'
      } : undefined}
    />
  );
}

export function AttendanceEmptyState({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={<CheckSquare className="w-10 h-10" />}
      title="Belum Ada Sesi Absensi"
      description="Tidak ada sesi absensi aktif. Buat sesi baru untuk absensi mandiri siswa."
      action={onCreate ? {
        label: 'Buat Sesi',
        onClick: onCreate,
        variant: 'primary'
      } : undefined}
    />
  );
}

export function CashEmptyState({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon={<Wallet className="w-10 h-10" />}
      title="Belum Ada Transaksi Kas"
      description="Mulai catat pemasukan dan pengeluaran kas kelas untuk laporan keuangan yang transparan."
      action={onAdd ? {
        label: 'Catat Transaksi',
        onClick: onAdd,
        variant: 'primary'
      } : undefined}
    />
  );
}

export function ViolationsEmptyState({ onAdd }: { onAdd?: () => void }) {
  return (
    <EmptyState
      icon={<Shield className="w-10 h-10" />}
      title="Belum Ada Pelanggaran"
      description="Tidak ada catatan pelanggaran. Pertahankan kedisiplinan kelas Anda!"
      action={onAdd ? {
        label: 'Catat Pelanggaran',
        onClick: onAdd,
        variant: 'outline'
      } : undefined}
    />
  );
}

export function WhatsAppEmptyState() {
  return (
    <EmptyState
      icon={<MessageSquare className="w-10 h-10" />}
      title="Belum Ada Pesan"
      description="Pesan WhatsApp yang dikirim akan muncul di sini."
    />
  );
}

// Inline Empty States for tables/lists
export function TableEmptyState({ columns, message }: { columns: number; message?: string }) {
  return (
    <tr>
      <td colSpan={columns} className="py-12 text-center">
        <EmptyState
          icon={<Inbox className="w-8 h-8" />}
          title={message || 'Tidak ada data'}
          description=""
        />
      </td>
    </tr>
  );
}

export function GridEmptyState({ message }: { message?: string }) {
  return (
    <div className="col-span-full py-16 text-center">
      <EmptyState
        icon={<FolderOpen className="w-10 h-10" />}
        title={message || 'Tidak ada data'}
        description=""
      />
    </div>
  );
}

// Full page empty state
export function PageEmptyState({
  icon,
  title,
  description,
  action
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="max-w-md w-full">
        <EmptyState
          icon={icon}
          title={title}
          description={description}
          action={action}
        />
      </div>
    </div>
  );
}
