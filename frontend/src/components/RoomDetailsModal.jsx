import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Users,
  Maximize,
  Bed,
  Eye,
  Star,
  Check,
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

const RoomDetailsModal = ({ room, onClose, onBookNow }) => {
  if (!room) return null;

  // Prevent background scrolling
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const activePrice = room.discountPrice || room.pricePerNight;
  const hasDiscount = room.discountPrice && room.discountPrice < room.pricePerNight;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 my-8"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Gallery Hero */}
        <div className="relative h-72 sm:h-96 bg-ocean-950">
          <img
            src={room.images[activeImageIdx] || room.images[0]}
            alt={room.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row justify-between sm:items-end gap-3">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-gold-300 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 inline-block mb-2">
                {room.roomType}
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl font-bold">{room.name}</h2>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-gold-300 font-bold text-sm">
              <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
              <span>{room.ratingsAverage}</span>
              <span className="text-white/60 text-xs font-normal">({room.numReviews} guest reviews)</span>
            </div>
          </div>
        </div>

        {/* Thumbnails if multiple images */}
        {room.images.length > 1 && (
          <div className="bg-ocean-950/90 px-6 py-3 flex gap-3 overflow-x-auto border-b border-white/10">
            {room.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative w-20 h-14 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImageIdx === idx ? 'border-gold-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}

        {/* Content body */}
        <div className="p-6 sm:p-8 space-y-6">

          {/* Key specs strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-sand-50 p-3.5 rounded-2xl border border-sand-200 text-center">
              <Users className="w-5 h-5 mx-auto mb-1 text-gold-600" />
              <span className="text-xs text-slate-500 block">Capacity</span>
              <span className="font-bold text-slate-800 text-sm">{room.capacity.maxGuests} Guests</span>
            </div>
            <div className="bg-sand-50 p-3.5 rounded-2xl border border-sand-200 text-center">
              <Maximize className="w-5 h-5 mx-auto mb-1 text-gold-600" />
              <span className="text-xs text-slate-500 block">Room Size</span>
              <span className="font-bold text-slate-800 text-sm">{room.sizeSqFt} sq ft</span>
            </div>
            <div className="bg-sand-50 p-3.5 rounded-2xl border border-sand-200 text-center">
              <Bed className="w-5 h-5 mx-auto mb-1 text-gold-600" />
              <span className="text-xs text-slate-500 block">Bed Setup</span>
              <span className="font-bold text-slate-800 text-sm">{room.bedType}</span>
            </div>
            <div className="bg-sand-50 p-3.5 rounded-2xl border border-sand-200 text-center">
              <Eye className="w-5 h-5 mx-auto mb-1 text-gold-600" />
              <span className="text-xs text-slate-500 block">Horizon View</span>
              <span className="font-bold text-slate-800 text-sm">{room.view}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-serif text-xl font-bold text-ocean-950 mb-2">The Experience</h4>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {room.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div>
            <h4 className="font-serif text-xl font-bold text-ocean-950 mb-3">Included Luxuries & Amenities</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {room.amenities.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700"
                >
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-bold text-ocean-950">
                  ₹{activePrice.toLocaleString('en-IN')}
                </span>
                <span className="text-sm text-slate-500">/ night + GST</span>
              </div>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through block">
                  Original Price: ₹{room.pricePerNight.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="flex-1 sm:flex-initial px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                  onBookNow(room);
                }}
                className="flex-1 sm:flex-initial px-8 py-3 rounded-xl bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 hover:from-gold-400 hover:to-gold-600 text-ocean-950 font-bold shadow-luxury-gold hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm"
              >
                <span>Reserve Room</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default RoomDetailsModal;
