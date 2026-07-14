import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CreditCard, Smartphone, Building2, CheckCircle, XCircle, ArrowLeft, Loader2, QrCode, Wallet, ShoppingCart } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  icon?: string;
  type: string;
  description?: string;
}

export default function PaymentPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'success' | 'failed'>('pending');
  const [selectedMethod, setSelectedMethod] = useState<string>('gopay');
  const [loading, setLoading] = useState(true);
  const [snapToken, setSnapToken] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  const planType = searchParams.get('plan') || 'premium_monthly';
  const amount = searchParams.get('amount') || '25000';

  const plans: Record<string, { name: string; price: string; period: string }> = {
    premium_monthly: { name: 'Premium Bulanan', price: 'Rp 25.000', period: '/bulan' },
    premium_quarterly: { name: 'Premium 3 Bulanan', price: 'Rp 65.000', period: '/3 bulan' },
    premium_yearly: { name: 'Premium Tahunan', price: 'Rp 200.000', period: '/tahun' }
  };

  const currentPlan = plans[planType] || plans.premium_monthly;

  const paymentMethods: PaymentMethod[] = [
    { id: 'gopay', name: 'GoPay', type: 'e-wallet', icon: '💙' },
    { id: 'shopeepay', name: 'ShopeePay', type: 'e-wallet', icon: '🛒' },
    { id: 'qris', name: 'QRIS', type: 'qr_code', icon: '📱' },
    { id: 'bca', name: 'BCA Transfer', type: 'bank_transfer', icon: '🏦' },
    { id: 'bri', name: 'BRI Transfer', type: 'bank_transfer', icon: '🏦' },
    { id: 'mandiri', name: 'Mandiri Transfer', type: 'bank_transfer', icon: '🏦' },
    { id: 'bni', name: 'BNI Transfer', type: 'bank_transfer', icon: '🏦' },
    { id: 'credit_card', name: 'Kartu Kredit', type: 'card', icon: '💳' },
    { id: 'indomaret', name: 'Indomaret', type: 'cstore', icon: '🏪' },
    { id: 'alfamart', name: 'Alfamart', type: 'cstore', icon: '🏪' }
  ];

  useEffect(() => {
    // Load Midtrans Snap.js
    if (!window.Snap) {
      const midtransUrl = 'https://app.midtrans.com/snap/snap.js';
      if (!document.querySelector(`script[src="${midtransUrl}"]`)) {
        const script = document.createElement('script');
        script.src = midtransUrl;
        script.async = true;
        script.onload = () => setLoading(false);
        document.head.appendChild(script);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Get client key
      const configRes = await fetch('/api/payments/config');
      const config = await configRes.json();

      // Set Midtrans Snap.js key
      if (window.snap) {
        window.snap.pay(snapToken || '', {
          onSuccess: (result: any) => {
            setPaymentStatus('success');
            console.log('Payment success:', result);
          },
          onPending: (result: any) => {
            setPaymentStatus('pending');
            console.log('Payment pending:', result);
          },
          onError: (result: any) => {
            setPaymentStatus('failed');
            console.log('Payment error:', result);
          },
          onClose: () => {
            console.log('Payment popup closed');
          }
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
    } finally {
      setLoading(false);
    }
  };

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Pembayaran Berhasil!</h1>
          <p className="text-slate-400 mb-6">
            Terima kasih! Premium Anda sudah aktif.
          </p>
          <button
            onClick={() => navigate('/app/dashboard')}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (paymentStatus === 'failed') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-rose-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Pembayaran Gagal</h1>
          <p className="text-slate-400 mb-6">
            Silakan coba lagi atau hubungi kami jika ada masalah.
          </p>
          <button
            onClick={() => navigate('/app/premium')}
            className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-xl"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/app/premium')}
            className="p-2 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Pembayaran Premium</h1>
            <p className="text-slate-400">{currentPlan.name}</p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Ringkasan Pesanan</h2>
          <div className="flex justify-between items-center py-3 border-b border-slate-700">
            <span className="text-slate-400">{currentPlan.name}</span>
            <span className="text-white font-bold">{currentPlan.price}{currentPlan.period}</span>
          </div>
          <div className="flex justify-between items-center pt-3">
            <span className="text-white font-semibold">Total Pembayaran</span>
            <span className="text-emerald-400 text-xl font-bold">{currentPlan.price}</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Metode Pembayaran</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 rounded-xl border-2 transition ${
                  selectedMethod === method.id
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="text-2xl mb-2">{method.icon}</div>
                <div className="text-sm font-medium text-white">{method.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              Bayar Sekarang
            </>
          )}
        </button>

        {/* Security Note */}
        <p className="text-center text-slate-500 text-sm mt-4">
          🔒 Pembayaran aman via Midtrans
        </p>
      </div>
    </div>
  );
}

// TypeScript declarations
declare global {
  interface Window {
    Snap: any;
    snap: any;
  }
}
