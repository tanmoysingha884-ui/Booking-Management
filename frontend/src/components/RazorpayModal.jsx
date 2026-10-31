import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  ArrowRight,
  RefreshCw,
  QrCode,
  Sparkles
} from 'lucide-react';

const RazorpayModal = ({
  isOpen,
  onClose,
  amount,
  roomName,
  guestDetails,
  onSuccess,
  onCancelAsNonPaid,
}) => {
  const [activeMethod, setActiveMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState(''); // 'authorizing' | 'success'
  const [upiId, setUpiId] = useState(guestDetails?.email ? guestDetails.email.split('@')[0] + '@okhdfc' : 'guest@upi');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [cardHolder, setCardHolder] = useState(guestDetails?.name || 'Tanmoy Singha');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  if (!isOpen) return null;

  const handleSimulatePayment = (success = true) => {
    setIsProcessing(true);
    setProcessStep('Connecting securely to Razorpay Gateway...');

    setTimeout(() => {
      if (success) {
        setProcessStep('Verifying payment authorization with issuing bank...');
        setTimeout(() => {
          const fakePaymentId = 'pay_' + Math.random().toString(36).substring(2, 10).toUpperCase() + Date.now().toString().slice(-4);
          const fakeOrderId = 'order_' + Math.random().toString(36).substring(2, 10);
          const methodLabel = activeMethod === 'upi' ? `Razorpay UPI (${upiId})` : activeMethod === 'card' ? `Razorpay Card (*${cardNumber.slice(-4)})` : `Razorpay NetBanking (${selectedBank})`;

          setIsProcessing(false);
          onSuccess({
            razorpay_payment_id: fakePaymentId,
            razorpay_order_id: fakeOrderId,
            paymentMethod: methodLabel,
            paidAmount: amount,
          });
        }, 1200);
      } else {
        setIsProcessing(false);
        if (window.confirm('Payment cancelled in Razorpay Demo. Do you want to complete this booking as "Non Paid" (Pay at Check-In)?')) {
          onCancelAsNonPaid();
        } else {
          onClose();
        }
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        className="relative max-w-md w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-300 my-6 flex flex-col font-sans"
      >
        {/* Razorpay Brand Header */}
        <div className="bg-[#0C2340] text-white p-5 relative border-b border-blue-900/60">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-white/10 hover:bg-white/20 rounded-full w-7 h-7 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-between pr-8">
            <div className="flex items-center gap-2">
              {/* Razorpay stylized logo */}
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm text-base">
                R
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm tracking-wide text-white">Razorpay</span>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/30">
                    Test Mode
                  </span>
                </div>
                <p className="text-[11px] text-slate-300">Goa Luxury Resort & Spa</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase text-slate-400 font-semibold block">Total Payable</span>
              <span className="text-xl font-bold text-emerald-400 font-serif">
                ₹{Number(amount).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
            <span className="truncate max-w-[200px] text-slate-200">{roomName}</span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Lock className="w-3 h-3" />
              <span>256-Bit SSL Encrypted</span>
            </span>
          </div>
        </div>

        {/* Processing State Overlay */}
        {isProcessing && (
          <div className="p-8 text-center bg-white flex flex-col items-center justify-center space-y-3 min-h-[320px]">
            <RefreshCw className="w-10 h-10 text-blue-600 animate-spin" />
            <h4 className="font-serif text-lg font-bold text-slate-900">Processing Razorpay Payment</h4>
            <p className="text-xs text-slate-500 max-w-xs">{processStep}</p>
            <span className="text-[10px] text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
              Demo Simulation · Do not close window
            </span>
          </div>
        )}

        {!isProcessing && (
          <div>
            {/* Method Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setActiveMethod('upi')}
                className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeMethod === 'upi'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMethod('card')}
                className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeMethod === 'card'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveMethod('netbanking')}
                className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                  activeMethod === 'netbanking'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Netbanking</span>
              </button>
            </div>

            {/* Method Body */}
            <div className="p-5 space-y-4">
              {/* 1. UPI TAB */}
              {activeMethod === 'upi' && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs">
                    <QrCode className="w-5 h-5 text-blue-600 shrink-0" />
                    <span>Instant demo pay via Google Pay, PhonePe, Paytm or VPA.</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                      Enter UPI ID / VPA
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@okhdfcbank"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                    {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map((app) => (
                      <button
                        key={app}
                        type="button"
                        onClick={() => setUpiId(`${guestDetails?.name?.toLowerCase().replace(/\s+/g, '') || 'guest'}@${app.toLowerCase().replace(/\s+/g, '')}`)}
                        className="p-2 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-[10px] font-bold text-slate-700 transition-colors cursor-pointer"
                      >
                        {app}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. CARD TAB */}
              {activeMethod === 'card' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Card Number</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4111 2222 3333 4444"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                      <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Name on Card</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Cardholder Name"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

              {/* 3. NETBANKING TAB */}
              {activeMethod === 'netbanking' && (
                <div className="space-y-3">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase">Select Bank</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                          selectedBank === bank
                            ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-500'
                            : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {bank}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Razorpay Demo Action Bar */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-2.5">
              <button
                type="button"
                onClick={() => handleSimulatePayment(true)}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Pay ₹{Number(amount).toLocaleString('en-IN')} (Razorpay Demo)</span>
              </button>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => handleSimulatePayment(false)}
                  className="text-[11px] text-red-600 hover:text-red-800 font-semibold underline cursor-pointer"
                >
                  Simulate Failed / Cancel Payment
                </button>

                <button
                  type="button"
                  onClick={onCancelAsNonPaid}
                  className="text-[11px] text-gold-700 hover:text-gold-900 font-semibold underline cursor-pointer"
                >
                  Book with Pay at Check-In (Non Pay) →
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RazorpayModal;
