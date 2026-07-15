import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Link } from 'react-router-dom';

// Error Boundary Props
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showStack?: boolean;
  className?: string;
}

// Error Boundary State
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

// Fallback Component Props
interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  resetError: () => void;
  showStack?: boolean;
}

// Error Fallback Component
function ErrorFallback({
  error,
  errorInfo,
  resetError,
  showStack = false
}: ErrorFallbackProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-lg w-full bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-2xl">
        {/* Icon */}
        <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-rose-400" />
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white text-center mb-2">
          Oops! Terjadi Kesalahan
        </h2>
        <p className="text-slate-400 text-sm text-center mb-6">
          Maaf, terjadi kesalahan yang tidak terduga. Silakan coba muat ulang halaman atau kembali ke halaman utama.
        </p>

        {/* Error Message (sanitized) */}
        <div className="bg-slate-900/60 rounded-xl p-4 mb-6 border border-slate-700/50">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-2 font-semibold">
            Pesan Kesalahan:
          </p>
          <p className="text-sm text-rose-300 font-mono break-words">
            {error?.message || 'Unknown error occurred'}
          </p>
        </div>

        {/* Stack Trace (optional, for development) */}
        {showStack && errorInfo && (
          <details className="mb-6">
            <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-400 transition">
              Lihat Detail Teknis
            </summary>
            <pre className="mt-2 p-3 bg-slate-900 rounded-lg text-[10px] text-slate-400 overflow-auto max-h-40 font-mono">
              {error?.stack}
              {'\n\nComponent Stack:'}
              {errorInfo.componentStack}
            </pre>
          </details>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={resetError}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition"
          >
            <RefreshCw className="w-4 h-4" />
            Coba Lagi
          </button>
          <Link
            to="/"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-xl transition"
          >
            <Home className="w-4 h-4" />
            Kembali ke Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// Class-based Error Boundary
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call optional onError callback
    this.props.onError?.(error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Otherwise, render the default error fallback
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetError={this.resetError}
          showStack={this.props.showStack}
        />
      );
    }

    return this.props.children;
  }
}

// Hook-based Error Boundary (wrapper component)
interface UseErrorBoundaryOptions {
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  fallback?: ReactNode;
  showStack?: boolean;
}

export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: UseErrorBoundaryOptions = {}
): React.FC<P> {
  const WithErrorBoundary: React.FC<P> = (props) => (
    <ErrorBoundary
      onError={options.onError}
      fallback={options.fallback}
      showStack={options.showStack}
    >
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundary.displayName = `WithErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithErrorBoundary;
}

// Report Error Function (for manual error reporting)
export function reportError(error: Error, context?: Record<string, unknown>): void {
  if (import.meta.env.DEV) {
    console.error('Reported error:', error, context);
  }

  // In production, you could send to an error tracking service like Sentry
  // Sentry.captureException(error, { extra: context });
}

// Try-Catch Wrapper Hook for async operations
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((err: unknown) => {
    if (err instanceof Error) {
      setError(err);
    } else {
      setError(new Error(String(err)));
    }
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  if (error) {
    throw error; // Re-throw to let ErrorBoundary catch it
  }

  return { handleError, clearError };
}

// Async Error Handler for useEffect
export function useAsyncError() {
  const [, setError] = React.useState<Error | null>(null);

  return React.useCallback((error: Error) => {
    setError(() => {
      // Log error
      if (import.meta.env.DEV) {
        console.error('Async error:', error);
      }
      return error;
    });
  }, []);
}

// Global Error Handler for unhandled promise rejections
export function setupGlobalErrorHandlers() {
  // Handle uncaught errors
  window.addEventListener('error', (event) => {
    if (import.meta.env.DEV) {
      console.error('Global error:', event.error);
    }
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    if (import.meta.env.DEV) {
      console.error('Unhandled promise rejection:', event.reason);
    }
  });
}

// Simple inline error message component
interface InlineErrorProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function InlineError({ message, onRetry, className = '' }: InlineErrorProps) {
  return (
    <div className={`flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl ${className}`}>
      <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
      <p className="flex-1 text-sm text-rose-300">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="shrink-0 p-1.5 hover:bg-rose-500/20 rounded-lg transition"
          title="Coba lagi"
        >
          <RefreshCw className="w-4 h-4 text-rose-400" />
        </button>
      )}
    </div>
  );
}

// Network Error Component
interface NetworkErrorProps {
  onRetry?: () => void;
}

export function NetworkError({ onRetry }: NetworkErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-amber-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">
        Koneksi Gagal
      </h3>
      <p className="text-sm text-slate-400 max-w-sm mb-6">
        Tidak dapat terhubung ke server. Periksa koneksi internet Anda dan coba lagi.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition"
        >
          <RefreshCw className="w-4 h-4" />
          Coba Lagi
        </button>
      )}
    </div>
  );
}

// Permission Error Component
interface PermissionErrorProps {
  message?: string;
}

export function PermissionError({ message = 'Anda tidak memiliki izin untuk mengakses fitur ini.' }: PermissionErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-4">
        <Bug className="w-8 h-8 text-indigo-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">
        Akses Ditolak
      </h3>
      <p className="text-sm text-slate-400 max-w-sm">
        {message}
      </p>
    </div>
  );
}
