import React from 'react';

// Base Skeleton Component with shimmer animation
interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'wave',
}: SkeletonProps) {
  const baseClasses = 'bg-slate-700/50';

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'relative overflow-hidden',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width ?? (variant === 'circular' ? 40 : '100%'),
    height: height ?? (variant === 'text' ? 16 : 20),
    ...(width === undefined && variant !== 'circular' && { width: '100%' }),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    >
      {animation === 'wave' && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-600/30 to-transparent" />
      )}
    </div>
  );
}

// Preset Skeleton Components

// Card Skeleton
export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton height={16} width="60%" />
          <Skeleton height={12} width="40%" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} height={12} width={`${85 - i * 10}%`} />
        ))}
      </div>
    </div>
  );
}

// Stats Card Skeleton
export function StatsCardSkeleton() {
  return (
    <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 flex items-center gap-4">
      <Skeleton variant="circular" width={48} height={48} />
      <div className="space-y-2">
        <Skeleton height={10} width={80} />
        <Skeleton height={24} width={120} />
      </div>
    </div>
  );
}

// Table Row Skeleton
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 p-4 border-b border-slate-700/40">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} height={14} width={`${100 / columns}%`} />
      ))}
    </div>
  );
}

// Table Skeleton
export function TableSkeleton({ rows = 5, columns = 5 }: { rows?: number; columns?: number }) {
  return (
    <div className="rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900/60 p-4 flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height={12} width={`${100 / columns}%`} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <TableRowSkeleton key={i} columns={columns} />
      ))}
    </div>
  );
}

// Student Card Skeleton
export function StudentCardSkeleton() {
  return (
    <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 h-64">
      <div className="flex items-start gap-3.5 mb-4">
        <Skeleton variant="circular" width={48} height={48} />
        <div className="flex-1 space-y-2">
          <Skeleton height={18} width="70%" />
          <Skeleton height={12} width="50%" />
        </div>
      </div>
      <div className="space-y-2 mt-4">
        <Skeleton height={12} width="80%" />
        <Skeleton height={12} width="60%" />
      </div>
      <div className="border-t border-slate-700/50 pt-3 mt-4 flex justify-between">
        <Skeleton height={20} width={80} />
        <div className="flex gap-2">
          <Skeleton width={32} height={32} />
          <Skeleton width={32} height={32} />
        </div>
      </div>
    </div>
  );
}

// Class Card Skeleton
export function ClassCardSkeleton() {
  return (
    <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5 h-56">
      <div className="space-y-3">
        <div className="flex justify-between">
          <Skeleton height={22} width="50%" />
          <div className="flex gap-1">
            <Skeleton width={28} height={28} />
            <Skeleton width={28} height={28} />
          </div>
        </div>
        <Skeleton height={12} width="40%" />
        <div className="space-y-1.5 pt-2">
          <Skeleton height={12} width="70%" />
          <Skeleton height={12} width="55%" />
        </div>
      </div>
      <div className="border-t border-slate-700/50 pt-4 mt-auto">
        <Skeleton height={32} width="100%" />
      </div>
    </div>
  );
}

// Form Skeleton
export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton height={12} width={100} />
          <Skeleton height={40} />
        </div>
      ))}
      <div className="flex gap-3 pt-4">
        <Skeleton height={40} width={100} />
        <Skeleton height={40} width={120} />
      </div>
    </div>
  );
}

// Dashboard Skeleton (Complete dashboard layout)
export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-slate-800 border border-slate-700/60 rounded-3xl p-8">
        <div className="flex flex-wrap gap-3 mb-4">
          <Skeleton height={28} width={150} />
          <Skeleton height={28} width={120} />
        </div>
        <Skeleton height={36} width="50%" className="mb-3" />
        <Skeleton height={20} width="80%" />
        <div className="flex gap-3 pt-4">
          <Skeleton height={40} width={140} />
          <Skeleton height={40} width={160} />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-8">
          {/* Active Sessions */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <Skeleton height={20} width={180} />
              <Skeleton height={24} width={60} />
            </div>
            <div className="space-y-4">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 flex justify-between">
                <div className="space-y-2">
                  <Skeleton height={14} width={100} />
                  <Skeleton height={18} width={150} />
                  <Skeleton height={12} width={200} />
                </div>
                <div className="flex gap-2">
                  <Skeleton height={32} width={100} />
                  <Skeleton height={32} width={100} />
                </div>
              </div>
            </div>
          </div>

          {/* Class List */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6">
            <Skeleton height={20} width={120} className="mb-4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <ClassCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-5 space-y-8">
          {/* Violations */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6">
            <Skeleton height={20} width={180} className="mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton height={14} width={120} />
                    <Skeleton height={20} width={60} />
                  </div>
                  <Skeleton height={12} width="80%" />
                </div>
              ))}
            </div>
            <Skeleton height={36} width="100%" className="mt-4" />
          </div>

          {/* Transactions */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6">
            <Skeleton height={20} width={160} className="mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-3 bg-slate-900/50 rounded-xl border border-slate-800 flex justify-between">
                  <div className="space-y-1">
                    <Skeleton height={14} width={150} />
                    <Skeleton height={12} width={100} />
                  </div>
                  <Skeleton height={20} width={80} />
                </div>
              ))}
            </div>
            <Skeleton height={36} width="100%" className="mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Classes View Skeleton
export function ClassesSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton height={28} width={200} />
          <Skeleton height={16} width={300} />
        </div>
        <Skeleton height={40} width={140} />
      </div>

      {/* Class Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <ClassCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Attendance View Skeleton
export function AttendanceSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton height={28} width={250} />
          <Skeleton height={16} width={350} />
        </div>
        <Skeleton height={40} width={150} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sessions List */}
        <div className="lg:col-span-4">
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <Skeleton height={18} width={120} />
              <Skeleton width={32} height={32} />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} height={60} />
              ))}
            </div>
          </div>
        </div>

        {/* Attendance Sheet */}
        <div className="lg:col-span-8">
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6">
            <div className="bg-slate-900/60 p-4 rounded-xl mb-6 flex justify-between">
              <div className="space-y-2">
                <Skeleton height={18} width={200} />
                <Skeleton height={14} width={300} />
              </div>
              <Skeleton height={36} width={100} />
            </div>
            <TableSkeleton rows={8} columns={4} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Violations View Skeleton
export function ViolationsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton height={28} width={280} />
          <Skeleton height={16} width={400} />
        </div>
        <div className="flex gap-3">
          <Skeleton height={40} width={180} />
          <Skeleton height={40} width={200} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Violations List */}
        <div className="lg:col-span-8">
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6">
            <Skeleton height={20} width={200} className="mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 bg-slate-900/40 border border-slate-700/50 rounded-xl flex justify-between">
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Skeleton height={18} width={150} />
                      <Skeleton height={20} width={80} />
                    </div>
                    <Skeleton height={14} width={200} />
                    <Skeleton height={14} width="60%" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton width={32} height={32} />
                    <Skeleton width={32} height={32} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-4">
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-5">
            <Skeleton height={20} width={180} className="mb-3" />
            <Skeleton height={40} width="100%" className="mb-2" />
            <div className="space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-slate-900/30 rounded-xl">
                  <div className="space-y-1">
                    <Skeleton height={14} width={120} />
                    <Skeleton height={10} width={60} />
                  </div>
                  <Skeleton height={28} width={70} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cash Ledger Skeleton
export function CashLedgerSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton height={28} width={200} />
          <Skeleton height={16} width={300} />
        </div>
        <div className="flex gap-3">
          <Skeleton height={40} width={180} />
          <Skeleton height={40} width={160} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      {/* Table */}
      <div className="bg-slate-800 border border-slate-700/60 rounded-2xl p-6">
        <Skeleton height={20} width={200} className="mb-4" />
        <TableSkeleton rows={10} columns={6} />
      </div>
    </div>
  );
}

// Empty State Component
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 max-w-sm mb-6">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// Error State Component
interface ErrorStateProps {
  icon?: React.ReactNode;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  icon,
  title = 'Terjadi Kesalahan',
  message = 'Gagal memuat data. Silakan coba lagi.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-4 text-rose-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-xl transition"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
}

// Add shimmer animation to tailwind config inline styles
// This CSS should be added to index.css or tailwind
export const skeletonStyles = `
@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

.shimmer {
  animation: shimmer 2s infinite;
}
`;
