import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Home, Search } from 'lucide-react';

const Hero = ({ onSearchAvailability }) => {
  const today = new Date().toISOString().split('T')[0];
  const nextThreeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(nextThreeDays);
  const [guests, setGuests] = useState('2');
  const [roomType, setRoomType] = useState('All');
  const videoRef = useRef(null);

  useEffect(() => {
    // Ensure 100% reliable continuous autoplay across all modern desktop & mobile browsers
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Fallback if browser requires interaction
        });
      }
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearchAvailability({
      checkIn,
      checkOut,
      guests: Number(guests),
      roomType,
    });
  };

  return (
    <section id="home" className="relative h-screen min-h-[560px] flex flex-col justify-end items-center px-4 sm:px-6 lg:px-8 pt-20 pb-8 sm:pb-10 md:pb-12 overflow-hidden">
      {/* 10-Second Looping Animated Video Background (No Sound, Autoplay, Continuous) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=2000&q=85"
          className="w-full h-full object-cover object-center scale-105 filter brightness-[0.84] contrast-[1.05]"
        >
          <source src="/videos/hero-resort.mp4" type="video/mp4" />
          <source src="/videos/beach.mp4" type="video/mp4" />
          <source src="https://d2ezlykacdqcnj.cloudfront.net/_assets/home-video/beach-waves-loop.mp4" type="video/mp4" />
          {/* Graceful image fallback for older devices or text-only browsers */}
          <img
            src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=2000&q=85"
            alt="Goa Resort Beachfront"
            className="w-full h-full object-cover object-center"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/70 via-ocean-950/20 to-ocean-950/40" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/10 to-black/40" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        {/* Floating Glass Booking Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <form
            onSubmit={handleSearch}
            className="glass-panel p-4 sm:p-5 rounded-3xl shadow-2xl border border-white/40 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end text-left"
          >
            {/* Check-In */}
            <div className="bg-white/80 rounded-2xl p-3 border border-slate-200/80 shadow-sm focus-within:ring-2 focus-within:ring-gold-400 transition-all">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-gold-600" /> Check-In
              </label>
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
              />
            </div>

            {/* Check-Out */}
            <div className="bg-white/80 rounded-2xl p-3 border border-slate-200/80 shadow-sm focus-within:ring-2 focus-within:ring-gold-400 transition-all">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                <Calendar className="w-3.5 h-3.5 text-gold-600" /> Check-Out
              </label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || today}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
              />
            </div>

            {/* Guests */}
            <div className="bg-white/80 rounded-2xl p-3 border border-slate-200/80 shadow-sm focus-within:ring-2 focus-within:ring-gold-400 transition-all">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                <Users className="w-3.5 h-3.5 text-gold-600" /> Guests
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="1">1 Adult (Solo)</option>
                <option value="2">2 Adults (Couple)</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests (Family)</option>
                <option value="6">6+ Guests (Villa)</option>
              </select>
            </div>

            {/* Room Category */}
            <div className="bg-white/80 rounded-2xl p-3 border border-slate-200/80 shadow-sm focus-within:ring-2 focus-within:ring-gold-400 transition-all">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1">
                <Home className="w-3.5 h-3.5 text-gold-600" /> Room Type
              </label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Ocean Suite">Ocean Suite</option>
                <option value="Royal Villa">Royal Villa</option>
                <option value="Beachfront Cottage">Beachfront Cottage</option>
                <option value="Deluxe Room">Deluxe Room</option>
                <option value="Super Deluxe">Super Deluxe</option>
              </select>
            </div>

            {/* Submit / Check Availability Button */}
            <button
              type="submit"
              className="w-full h-[58px] bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 hover:from-gold-400 hover:to-gold-600 text-ocean-950 font-bold rounded-2xl shadow-luxury-gold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
              <span>Explore Stays</span>
            </button>
          </form>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
