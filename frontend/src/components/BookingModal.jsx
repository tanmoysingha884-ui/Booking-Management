import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Users, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Bed, 
  Maximize,
  ArrowRight,
  AlertCircle,
  Eye,
  Lock
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const BookingModal = ({ room, initialDates, onClose, onBookingSuccess }) => {
  const { user, openAuthModal } = useAuth();

  // Lock background body scrolling while modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const defaultCheckIn = initialDates?.checkIn || today;
  const defaultCheckOut =
    initialDates?.checkOut ||
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [adults, setAdults] = useState(initialDates?.guests || 2);
  const [children, setChildren] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Online Card / UPI');
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!room) return null;

  // Calculate nights & pricing
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const diffTime = checkOutDate - checkInDate;
  const totalNights = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const pricePerNight = room.discountPrice && room.discountPrice > 0 ? room.discountPrice : room.pricePerNight;
  const roomCost = pricePerNight * totalNights;
  const taxAmount = Math.round(roomCost * 0.12);
  const totalAmount = roomCost + taxAmount;

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      openAuthModal('signin');
      return;
    }

    if (checkOutDate <= checkInDate) {
      setError('Check-out date must be after check-in date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        roomId: room._id,
        checkIn,
        checkOut,
        guests: {
          adults: Number(adults),
          children: Number(children),
        },
        guestDetails: {
          name: guestName || user.name,
          email: guestEmail || user.email,
          phone: guestPhone || user.phone || '+91 98765 00000',
          specialRequests,
        },
        paymentMethod,
        paymentStatus: paymentMethod === 'Online Card / UPI' ? 'Paid' : 'Non Paid',
      };

      const res = await api.post('/bookings', payload);
      if (res.data.success) {
        setConfirmedBooking(res.data.booking);
        if (onBookingSuccess) onBookingSuccess(res.data.booking);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error processing reservation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overscroll-contain overflow-y-auto lg:overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative max-w-5xl w-full bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[96vh] flex flex-col"
      >
        {/* Header Bar */}
        <div className="bg-ocean-950 px-5 py-3 text-white flex items-center justify-between border-b border-gold-400/20 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-gold-400/20 text-gold-300 border border-gold-400/30">
              GOA RESORT
            </span>
            <span className="font-serif text-base sm:text-lg font-bold text-white tracking-wide truncate max-w-xs sm:max-w-md">
              Reservation: {room.name}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {confirmedBooking ? (
          /* Confirmation Screen */
          <div className="p-8 sm:p-10 text-center overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs uppercase font-bold tracking-widest text-gold-600 px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20 inline-block mb-1">
              Reservation Confirmed
            </span>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ocean-950 mb-1">
              We look forward to welcoming you!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-5">
              Your luxury stay at Goa Resort has been confirmed. Confirmation details sent to{' '}
              <strong className="text-ocean-950">{confirmedBooking.guestDetails?.email}</strong>.
            </p>

            <div className="bg-sand-50 rounded-2xl p-5 border border-sand-200 text-left max-w-md mx-auto mb-6 space-y-2 text-xs">
              <div className="flex justify-between items-center border-b border-sand-200 pb-2">
                <span className="text-slate-500 font-medium">Booking Reference</span>
                <span className="font-mono font-bold text-ocean-950 text-sm">
                  {confirmedBooking.bookingReference}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Room</span>
                <span className="font-bold text-ocean-950">{room.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Dates</span>
                <span className="font-semibold text-slate-800">
                  {checkIn} to {checkOut} ({totalNights} Nights)
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-sand-200">
                <span className="text-slate-500 font-medium">Total Paid (incl. 12% GST)</span>
                <span className="font-serif font-bold text-base text-emerald-700">
                  ₹{confirmedBooking.totalAmount?.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-ocean-950 text-gold-300 font-semibold hover:bg-ocean-900 transition-colors text-xs"
            >
              Close & Return to Resort
            </button>
          </div>
        ) : (
          /* Form Content: 2-Column Responsive Layout (No scroll needed on Laptop / PC) */
          <form onSubmit={handleBooking} className="flex-1 overflow-y-auto lg:overflow-hidden flex flex-col justify-between">
            <div className="p-4 sm:p-5 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* LEFT COLUMN: Room Summary, Price Breakdown, Payment Method & Confirm Button */}
              <div className="lg:col-span-5 flex flex-col space-y-3.5">
                
                {/* Room Preview Card */}
                <div className="relative rounded-2xl overflow-hidden bg-ocean-950 text-white shadow-md border border-slate-200 h-28 sm:h-32 flex">
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-2/5 h-full object-cover"
                  />
                  <div className="w-3/5 p-3 flex flex-col justify-between bg-gradient-to-r from-ocean-950 via-ocean-900 to-ocean-950">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-gold-400 tracking-wider">
                        {room.roomType}
                      </span>
                      <h4 className="font-serif font-bold text-sm leading-tight text-white line-clamp-1 mt-0.5">
                        {room.name}
                      </h4>
                      <p className="text-[11px] text-slate-300 flex items-center gap-1 mt-1">
                        <Eye className="w-3 h-3 text-gold-400" />
                        <span className="truncate">{room.view}</span>
                      </p>
                    </div>

                    <div className="flex items-baseline gap-1 pt-1 border-t border-white/10">
                      <span className="font-serif text-lg font-bold text-gold-300">
                        ₹{pricePerNight.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400">/ night</span>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown Card */}
                <div className="bg-sand-50 rounded-2xl p-3.5 border border-sand-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Rate: ₹{pricePerNight.toLocaleString('en-IN')} × {totalNights} Night{totalNights > 1 ? 's' : ''}</span>
                    <span className="font-semibold text-slate-800">₹{roomCost.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Goa Luxury Tourism GST (12%)</span>
                    <span className="font-semibold text-slate-800">₹{taxAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="border-t border-sand-300 pt-1.5 flex justify-between items-center text-sm font-bold text-ocean-950">
                    <span>Total Amount</span>
                    <span className="font-serif text-lg text-emerald-800">
                      ₹{totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Payment Preference */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Payment Preference
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <label
                      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === 'Online Card / UPI'
                          ? 'border-gold-500 bg-gold-50/70 ring-1 ring-gold-400'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'Online Card / UPI'}
                        onChange={() => setPaymentMethod('Online Card / UPI')}
                        className="text-gold-500"
                      />
                      <CreditCard className="w-3.5 h-3.5 text-ocean-950 flex-shrink-0" />
                      <span className="text-[11px] font-semibold text-ocean-950 leading-tight">
                        Card / UPI
                      </span>
                    </label>

                    <label
                      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === 'Pay at Resort Check-In'
                          ? 'border-gold-500 bg-gold-50/70 ring-1 ring-gold-400'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'Pay at Resort Check-In'}
                        onChange={() => setPaymentMethod('Pay at Resort Check-In')}
                        className="text-gold-500"
                      />
                      <ShieldCheck className="w-3.5 h-3.5 text-ocean-950 flex-shrink-0" />
                      <span className="text-[11px] font-semibold text-ocean-950 leading-tight">
                        Pay at Check-In
                      </span>
                    </label>
                  </div>
                </div>

                {/* Submit Action Button on PC Left Column */}
                <div className="pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 sm:py-3.5 rounded-xl font-bold text-ocean-950 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 hover:from-gold-400 hover:to-gold-600 shadow-luxury-gold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer disabled:opacity-70"
                  >
                    {loading ? (
                      <span>Securing Reservation...</span>
                    ) : (
                      <>
                        <span>Confirm & Book Stay ({totalNights} Night{totalNights > 1 ? 's' : ''})</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-1.5 flex items-center justify-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-emerald-600" />
                    <span>Free cancellation up to 48 hours before check-in</span>
                  </p>
                </div>

              </div>

              {/* RIGHT COLUMN: Dates, Guests, and Guest Information Inputs */}
              <div className="lg:col-span-7 flex flex-col space-y-3">
                
                {/* Error Banner */}
                {error && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Non-logged in quick sign in prompt */}
                {!user && (
                  <div className="p-2.5 px-3 rounded-xl bg-gold-50 border border-gold-200 text-gold-900 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold">Sign in for member privileges</span>
                      <span className="text-gold-700 hidden sm:inline ml-1">· Required to confirm booking</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openAuthModal('signin')}
                      className="px-3 py-1 rounded-lg bg-ocean-950 text-gold-300 font-bold hover:bg-ocean-900 text-xs flex-shrink-0"
                    >
                      Sign In Now
                    </button>
                  </div>
                )}

                {/* Date Selection Row */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-sand-50 border border-sand-200 focus-within:ring-2 focus-within:ring-gold-400">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3 text-gold-600" /> Check-In Date
                    </label>
                    <input
                      type="date"
                      required
                      min={today}
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
                    />
                  </div>

                  <div className="p-2.5 rounded-xl bg-sand-50 border border-sand-200 focus-within:ring-2 focus-within:ring-gold-400">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1 mb-1">
                      <Calendar className="w-3 h-3 text-gold-600" /> Check-Out Date
                    </label>
                    <input
                      type="date"
                      required
                      min={checkIn || today}
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
                    />
                  </div>
                </div>

                {/* Guests Count Row */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Adults
                    </label>
                    <select
                      value={adults}
                      onChange={(e) => setAdults(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-gold-400 bg-white"
                    >
                      <option value="1">1 Adult (Solo)</option>
                      <option value="2">2 Adults (Couple)</option>
                      <option value="3">3 Adults</option>
                      <option value="4">4 Adults</option>
                      <option value="6">6 Adults (Full Villa)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Children (under 12)
                    </label>
                    <select
                      value={children}
                      onChange={(e) => setChildren(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-gold-400 bg-white"
                    >
                      <option value="0">0 Children</option>
                      <option value="1">1 Child</option>
                      <option value="2">2 Children</option>
                      <option value="3">3 Children</option>
                    </select>
                  </div>
                </div>

                {/* Guest Contact Information */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Guest Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-gold-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="guest@example.com"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-gold-400"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      inputMode="numeric"
                      required
                      maxLength={10}
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit mobile number"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-gold-400"
                    />
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Special Requests (Optional)
                  </label>
                  <input
                    type="text"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Honeymoon bed decor, ocean view high floor, early check-in..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm focus:ring-2 focus:ring-gold-400"
                  />
                </div>

                {/* Amenities Badges Row */}
                <div className="pt-1 flex flex-wrap gap-1.5 text-[10px] text-slate-500">
                  <span className="px-2 py-0.5 rounded-md bg-sand-100 border border-sand-200 text-slate-700 font-medium">
                    ✓ Breakfast Included
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-sand-100 border border-sand-200 text-slate-700 font-medium">
                    ✓ High-Speed Wi-Fi
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-sand-100 border border-sand-200 text-slate-700 font-medium">
                    ✓ Beach Access
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-sand-100 border border-sand-200 text-slate-700 font-medium">
                    ✓ 24/7 Concierge
                  </span>
                </div>

              </div>

            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default BookingModal;
