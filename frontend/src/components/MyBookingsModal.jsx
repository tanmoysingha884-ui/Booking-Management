import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  RotateCw,
  FileText
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyBookingsModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [actionMsg, setActionMsg] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get('/bookings/my');
      if (res.data.success) {
        setBookings(res.data.bookings);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      fetchBookings();
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation at Goa Resort?')) {
      return;
    }

    setCancellingId(bookingId);
    setActionMsg('');

    try {
      const res = await api.put(`/bookings/${bookingId}/cancel`);
      if (res.data.success) {
        setActionMsg('Reservation has been cancelled.');
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Could not cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-8 flex flex-col max-h-[88vh]"
      >
        {/* Header */}
        <div className="bg-ocean-950 p-6 text-white flex items-center justify-between border-b border-gold-400/20">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-gold-300">
              Goa Resort Guest Desk
            </span>
            <h3 className="font-serif text-2xl font-bold">My Reservations</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchBookings}
              title="Refresh"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action message */}
        {actionMsg && (
          <div className="bg-gold-50 border-b border-gold-200 px-6 py-2.5 text-xs text-gold-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-gold-600" />
            <span>{actionMsg}</span>
          </div>
        )}

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-40 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 bg-sand-50 rounded-3xl border border-sand-200 p-8">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-serif text-xl font-bold text-slate-700">No Reservations Found</h4>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                You haven't reserved any suites at Goa Resort yet. Explore our rooms and book your dream coastal getaway!
              </p>
            </div>
          ) : (
            bookings.map((booking) => {
              const room = booking.room;
              const isCancelled = booking.bookingStatus === 'Cancelled';
              const checkInStr = new Date(booking.checkIn).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const checkOutStr = new Date(booking.checkOut).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={booking._id}
                  className={`rounded-2xl border p-5 transition-all ${
                    isCancelled
                      ? 'bg-slate-50 border-slate-200 opacity-75'
                      : 'bg-white border-slate-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    {/* Thumbnail */}
                    <div className="w-full sm:w-44 h-32 rounded-xl overflow-hidden flex-shrink-0 bg-slate-200 relative">
                      <img
                        src={room?.images?.[0] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80'}
                        alt={room?.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[10px] text-white font-mono">
                        {booking.bookingReference}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h4 className="font-serif text-lg font-bold text-ocean-950">
                            {room?.name || 'Luxury Room'}
                          </h4>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              booking.bookingStatus === 'Confirmed'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : booking.bookingStatus === 'Checked-Out' || booking.bookingStatus === 'Completed'
                                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                : booking.bookingStatus === 'Cancelled'
                                ? 'bg-red-100 text-red-800 border border-red-300'
                                : 'bg-gold-100 text-gold-800 border border-gold-300'
                            }`}
                          >
                            {booking.bookingStatus}
                          </span>
                        </div>

                        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                          <div>
                            <span className="text-slate-400 block">Check-In</span>
                            <span className="font-semibold text-slate-800">{checkInStr}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Check-Out</span>
                            <span className="font-semibold text-slate-800">{checkOutStr}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Duration & Guests</span>
                            <span className="font-semibold text-slate-800">
                              {booking.totalNights} Nights · {booking.guests?.adults || 2} Adults
                            </span>
                          </div>
                        </div>

                        {booking.guestDetails?.specialRequests && (
                          <p className="mt-2 text-xs text-slate-500 italic bg-sand-50 p-2 rounded-lg border border-sand-200">
                            Requests: {booking.guestDetails.specialRequests}
                          </p>
                        )}
                      </div>

                      {/* Pricing and Cancel Row */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="text-xs">
                          <span className="text-slate-500">Total Paid: </span>
                          <span className="font-serif font-bold text-base text-ocean-950">
                            ₹{booking.totalAmount?.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-emerald-600 ml-1.5 font-semibold">
                            ({booking.paymentStatus})
                          </span>
                        </div>

                        {!isCancelled && booking.bookingStatus !== 'Checked-Out' && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={cancellingId === booking._id}
                            className="px-3.5 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors disabled:opacity-50"
                          >
                            {cancellingId === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                          </button>
                        )}
                        {booking.bookingStatus === 'Checked-Out' && (
                          <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                            Stay Completed · Rating Invitation Sent
                          </span>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-sand-50 border-t border-sand-200 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-ocean-950 text-gold-300 font-semibold text-xs hover:bg-ocean-900 transition-colors"
          >
            Close
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default MyBookingsModal;
