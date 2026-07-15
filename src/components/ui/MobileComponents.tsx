import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronUp, Plus, Minus, Check } from 'lucide-react';

// Touch-friendly button with ripple effect
interface TouchButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  fullWidth?: boolean;
}

export function TouchButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  fullWidth = false,
}: TouchButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;

    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { x, y, id }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);

    onClick?.();
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const variantClasses = {
    primary: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-white',
    outline: 'bg-transparent border border-slate-600 hover:border-slate-500 text-slate-300',
    ghost: 'bg-transparent hover:bg-slate-700 text-slate-300',
    danger: 'bg-rose-600 hover:bg-rose-500 text-white',
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden rounded-xl font-semibold transition-all
        active:scale-[0.98] select-none touch-manipulation
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 20,
            height: 20,
            marginLeft: -10,
            marginTop: -10,
          }}
        />
      ))}
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

// Mobile-safe modal that handles notches
interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  className?: string;
}

export function MobileModal({
  isOpen,
  onClose,
  title,
  children,
  showCloseButton = true,
  className = '',
}: MobileModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md sm:w-full">
        <div
          className={`
            bg-slate-800 border border-slate-700 rounded-t-3xl sm:rounded-2xl
            max-h-[85vh] sm:max-h-[90vh] overflow-hidden
            shadow-2xl animate-slide-up
            ${className}
          `}
        >
          {/* Handle for mobile */}
          <div className="flex justify-center pt-3 pb-2 sm:hidden">
            <div className="w-10 h-1 bg-slate-600 rounded-full" />
          </div>

          {/* Header */}
          {title && (
            <div className="flex items-center justify-between px-5 py-3 border-b border-slate-700">
              <h3 className="text-lg font-bold text-white">{title}</h3>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 hover:bg-slate-700 rounded-xl transition"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(85vh-60px)] sm:max-h-[calc(90vh-60px)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// Swipeable tabs for mobile
interface SwipeTabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function SwipeTabs({ tabs, activeTab, onChange, className = '' }: SwipeTabsProps) {
  return (
    <div
      className={`
        flex gap-1 p-1 bg-slate-800 rounded-xl overflow-x-auto
        scrollbar-none snap-x snap-mandatory
        ${className}
      `}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
            whitespace-nowrap snap-start transition-all
            min-h-[44px]
            ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white'
                : 'text-slate-400 hover:text-white hover:bg-slate-700'
            }
          `}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

// Expandable card for mobile
interface ExpandableCardProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}

export function ExpandableCard({
  title,
  children,
  defaultExpanded = false,
  className = '',
}: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`bg-slate-800 rounded-xl border border-slate-700 overflow-hidden ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 min-h-[56px] touch-manipulation"
      >
        <span className="font-semibold text-white text-left">{title}</span>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
        )}
      </button>
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="p-4 pt-0 border-t border-slate-700">{children}</div>
      </div>
    </div>
  );
}

// Quantity stepper for mobile
interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  className?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 0,
  max = 999,
  className = '',
}: QuantityStepperProps) {
  const decrease = () => onChange(Math.max(min, value - 1));
  const increase = () => onChange(Math.min(max, value + 1));

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={decrease}
        disabled={value <= min}
        className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition touch-manipulation"
      >
        <Minus className="w-5 h-5 text-white" />
      </button>
      <span className="w-12 text-center font-bold text-white text-lg">{value}</span>
      <button
        onClick={increase}
        disabled={value >= max}
        className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition touch-manipulation"
      >
        <Plus className="w-5 h-5 text-white" />
      </button>
    </div>
  );
}

// Mobile bottom navigation bar
interface BottomNavProps {
  items: {
    id: string;
    label: string;
    icon: React.ReactNode;
    activeIcon?: React.ReactNode;
    onClick: () => void;
    badge?: number;
  }[];
  activeItem: string;
  className?: string;
}

export function BottomNav({ items, activeItem, className = '' }: BottomNavProps) {
  return (
    <nav
      className={`
        fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-lg
        border-t border-slate-800
        flex items-stretch justify-around
        safe-area-inset-bottom
        z-50
        ${className}
      `}
    >
      {items.map((item) => {
        const isActive = activeItem === item.id;
        return (
          <button
            key={item.id}
            onClick={item.onClick}
            className={`
              flex-1 flex flex-col items-center justify-center
              py-2 px-1 min-h-[56px]
              touch-manipulation transition-colors
              ${isActive ? 'text-emerald-400' : 'text-slate-500'}
            `}
          >
            <div className="relative">
              {isActive && item.activeIcon ? item.activeIcon : item.icon}
              {item.badge && item.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium mt-1">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

// Mobile-friendly data table
interface DataTableProps {
  columns: { key: string; label: string; width?: string }[];
  data: { [key: string]: React.ReactNode }[];
  onRowClick?: (row: { [key: string]: React.ReactNode }) => void;
  className?: string;
}

export function DataTable({ columns, data, onRowClick, className = '' }: DataTableProps) {
  return (
    <div className={`overflow-x-auto -mx-4 md:mx-0 ${className}`}>
      <div className="min-w-full">
        {/* Header */}
        <div className="hidden md:flex bg-slate-900/60 border-b border-slate-700">
          {columns.map((col) => (
            <div
              key={col.key}
              className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider"
              style={{ width: col.width || 'auto', flex: col.width ? 'none' : 1 }}
            >
              {col.label}
            </div>
          ))}
        </div>

        {/* Rows */}
        {data.map((row, index) => (
          <div
            key={index}
            onClick={() => onRowClick?.(row)}
            className={`
              md:flex md:border-b md:border-slate-700/50
              ${onRowClick ? 'cursor-pointer' : ''}
              ${index % 2 === 0 ? 'bg-slate-800/30' : 'bg-transparent'}
              hover:bg-slate-700/50 transition-colors
            `}
          >
            {columns.map((col, colIndex) => (
              <div
                key={col.key}
                className={`
                  flex md:block justify-between items-center
                  px-4 py-3 min-h-[48px]
                  md:px-4 md:py-3.5
                  ${colIndex === 0 ? 'font-semibold text-white' : 'text-slate-400 text-sm'}
                  ${colIndex === 0 ? 'md:font-normal' : ''}
                  ${col.width ? '' : 'md:flex-1'}
                `}
                style={{ width: col.width, flex: col.width ? 'none' : 1 }}
              >
                <span className="md:hidden text-xs text-slate-500 uppercase mr-2">{col.label}:</span>
                {row[col.key]}
              </div>
            ))}
          </div>
        ))}

        {data.length === 0 && (
          <div className="py-12 text-center text-slate-500">
            Tidak ada data
          </div>
        )}
      </div>
    </div>
  );
}

// Safe area padding for mobile notches
interface SafeAreaProps {
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'both';
  className?: string;
}

export function SafeArea({
  children,
  position = 'both',
  className = '',
}: SafeAreaProps) {
  const paddingClasses = {
    top: 'pt-safe',
    bottom: 'pb-safe',
    both: 'pt-safe pb-safe',
  };

  return <div className={`${paddingClasses[position]} ${className}`}>{children}</div>;
}

// Pull to refresh indicator
interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  className?: string;
}

export function PullToRefresh({ onRefresh, children, className = '' }: PullToRefreshProps) {
  const [pulling, setPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleTouchStart = () => {
    setPulling(true);
  };

  const handleTouchEnd = async () => {
    setPulling(false);
    if (refreshing) return;

    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`${className} ${refreshing ? 'animate-pulse' : ''}`}
    >
      {pulling && !refreshing && (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {children}
    </div>
  );
}

// Skeleton loader for mobile lists
interface MobileListSkeletonProps {
  items?: number;
  className?: string;
}

export function MobileListSkeleton({ items = 5, className = '' }: MobileListSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="bg-slate-800 rounded-xl p-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-700 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-700 rounded w-3/4" />
              <div className="h-3 bg-slate-700 rounded w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Status badge variants
interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  label: string;
  className?: string;
}

export function StatusBadge({ status, label, className = '' }: StatusBadgeProps) {
  const colors = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    neutral: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border
        min-h-[24px]
        ${colors[status]}
        ${className}
      `}
    >
      {label}
    </span>
  );
}
