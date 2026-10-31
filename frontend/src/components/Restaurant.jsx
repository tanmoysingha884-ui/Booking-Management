import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Utensils, 
  Flame, 
  Sparkles, 
  Wine, 
  Clock, 
  Calendar, 
  Users, 
  CheckCircle, 
  X, 
  Search, 
  ArrowLeft,
  PhoneCall,
  Star,
  MapPin,
  Coffee
} from 'lucide-react';
import api from '../services/api';

const Restaurant = ({ onBackToHome }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isVegOnly, setIsVegOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Table Reservation Modal State
  const [reservationOpen, setReservationOpen] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationData, setReservationData] = useState({
    name: '',
    phone: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    guests: '2',
    seatingPreference: 'Beachfront Deck',
    specialRequests: '',
  });

  const categories = [
    'All',
    'Goan Seafood',
    'Starters',
    'Grill & BBQ',
    'Main Course',
    'Cocktails & Beverages',
    'Desserts',
  ];

  const fetchMenu = async () => {
    setLoading(true);
    try {
      const res = await api.get('/restaurant');
      if (res.data.success) {
        setItems(res.data.items);
      }
    } catch (err) {
      console.error('Error fetching restaurant menu:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesVeg = !isVegOnly || item.isVeg;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesVeg && matchesSearch;
  });

  const handleReservationSubmit = (e) => {
    e.preventDefault();
    setReservationSuccess(true);
    setTimeout(() => {
      setReservationSuccess(false);
      setReservationOpen(false);
      setReservationData({
        name: '',
        phone: '',
        email: '',
        date: new Date().toISOString().split('T')[0],
        time: '19:30',
        guests: '2',
        seatingPreference: 'Beachfront Deck',
        specialRequests: '',
      });
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 sm:pt-28 pb-20">
      {/* Hero Banner */}
      <div className="relative bg-ocean-950 text-white py-16 sm:py-24 overflow-hidden mb-12 border-b border-gold-400/20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80"
            alt="Goa Resort Dining"
            className="w-full h-full object-cover object-center filter brightness-[0.38]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-ocean-950/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gold-300 border border-gold-400/30 text-xs font-semibold mb-6 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Resort Home</span>
            </button>
          )}

          <div className="max-w-3xl">
            <span className="text-[11px] uppercase tracking-widest text-gold-300 font-bold px-3 py-1 rounded-full bg-gold-400/20 border border-gold-400/30 inline-block mb-3">
              5-Star Beachfront Gastronomy
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-white mb-4">
              The Ocean Whisper & <br />
              <span className="italic font-light bg-gradient-to-r from-gold-200 via-gold-300 to-gold-400 bg-clip-text text-transparent">
                Spice Coast Lounge
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mb-8">
              Savor fresh Arabian Sea catch, handcrafted Goan Portuguese heirlooms, and artisanal sundowner cocktails curated by master mixologists overlooking Candolim’s golden surf.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setReservationOpen(true)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 hover:from-gold-400 hover:to-gold-600 text-ocean-950 font-bold text-sm shadow-luxury-gold hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Utensils className="w-4 h-4" />
                <span>Reserve a Table</span>
              </button>

              <div className="flex items-center gap-2 text-xs text-gold-200/90 bg-white/10 px-4 py-2.5 rounded-xl border border-white/15">
                <Clock className="w-4 h-4 text-gold-400" />
                <span>Open Daily: 07:00 AM – 11:30 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls Bar: Category Pills + Veg Toggle + Search */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 mb-10 flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-ocean-950 text-gold-300 shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Veg Filter */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isVegOnly}
                onChange={(e) => setIsVegOnly(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              <span>Veg Only</span>
            </label>

            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dishes, cocktails..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Preparing gourmet menu offerings...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8">
            <Utensils className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-ocean-950 mb-1">No Menu Items Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              We couldn't find any dishes matching your current filter. Try resetting your search or category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setIsVegOnly(false);
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-ocean-950 text-gold-300 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredItems.map((item) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 flex flex-col group"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                  {/* Veg / Non-Veg Indicator */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold shadow">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.isVeg ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                    />
                    <span className={item.isVeg ? 'text-emerald-800' : 'text-red-800'}>
                      {item.isVeg ? 'Pure Veg' : 'Non-Veg'}
                    </span>
                  </div>

                  {/* Chef Special Badge */}
                  {item.isChefSpecial && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-gold-400 to-gold-500 text-ocean-950 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-luxury-gold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-ocean-950" />
                      <span>Chef's Choice</span>
                    </div>
                  )}

                  {/* Price Tag */}
                  <div className="absolute bottom-3 right-3 bg-ocean-950/90 backdrop-blur-md text-gold-300 font-bold px-3 py-1.5 rounded-xl border border-gold-400/30 text-sm shadow">
                    ₹{item.price.toLocaleString('en-IN')}
                  </div>

                  {/* Category Pill */}
                  <div className="absolute bottom-3 left-3 text-[11px] font-semibold text-slate-200 bg-black/40 backdrop-blur-sm px-2.5 py-0.5 rounded-md">
                    {item.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-ocean-950 mb-1.5 group-hover:text-gold-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-500" />
                      Spice: <strong>{item.spicyLevel}</strong>
                    </span>

                    <button
                      onClick={() => setReservationOpen(true)}
                      className="text-xs font-bold text-ocean-950 hover:text-gold-600 transition-colors underline cursor-pointer"
                    >
                      Book Table to Taste
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Dining Experiences Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-400/20 text-gold-600 flex items-center justify-center flex-shrink-0">
              <Wine className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-ocean-950 mb-1">
                Sunset Beachfront Cabana Dining
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Private romantic 4-course dinners setup right on the Candolim shore with candle lanterns and custom menus.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-400/20 text-gold-600 flex items-center justify-center flex-shrink-0">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-ocean-950 mb-1">
                Live Catch of the Day Grills
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Select your own tiger prawns, red snappers, and crab straight from the fishermen's morning catch.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-400/20 text-gold-600 flex items-center justify-center flex-shrink-0">
              <Coffee className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-ocean-950 mb-1">
                Artisanal Goan Bakery & Fado
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Freshly baked poi bread, warm bebinca, and live Portuguese acoustic guitar evenings every weekend.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Table Reservation Modal */}
      <AnimatePresence>
        {reservationOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200"
            >
              {/* Header */}
              <div className="bg-ocean-950 p-6 text-white relative">
                <button
                  onClick={() => setReservationOpen(false)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold-300 px-2.5 py-0.5 rounded-full bg-gold-400/20 border border-gold-400/30 inline-block mb-1.5">
                  Dining Reservation
                </span>
                <h3 className="font-serif text-2xl font-bold">Reserve Your Table</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Experience waterfront luxury dining at The Ocean Whisper.
                </p>
              </div>

              {reservationSuccess ? (
                <div className="p-10 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-ocean-950 mb-1">
                    Table Reserved Successfully!
                  </h4>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto">
                    We have confirmed your table for {reservationData.guests} guests on {reservationData.date} at {reservationData.time}. A confirmation SMS has been dispatched.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReservationSubmit} className="p-6 space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={reservationData.name}
                        onChange={(e) => setReservationData({ ...reservationData, name: e.target.value })}
                        placeholder="e.g. Arjun Rao"
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-gold-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={reservationData.phone}
                        onChange={(e) =>
                          setReservationData({
                            ...reservationData,
                            phone: e.target.value.replace(/\D/g, '').slice(0, 10),
                          })
                        }
                        placeholder="10-digit mobile"
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-gold-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={reservationData.date}
                        onChange={(e) => setReservationData({ ...reservationData, date: e.target.value })}
                        className="w-full px-2.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:ring-2 focus:ring-gold-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Time Slot *
                      </label>
                      <select
                        value={reservationData.time}
                        onChange={(e) => setReservationData({ ...reservationData, time: e.target.value })}
                        className="w-full px-2.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:ring-2 focus:ring-gold-400 focus:outline-none bg-white"
                      >
                        <option value="12:30">12:30 PM (Lunch)</option>
                        <option value="13:30">01:30 PM (Lunch)</option>
                        <option value="18:30">06:30 PM (Sunset)</option>
                        <option value="19:30">07:30 PM (Dinner)</option>
                        <option value="20:30">08:30 PM (Dinner)</option>
                        <option value="21:30">09:30 PM (Late Dinner)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Guests *
                      </label>
                      <select
                        value={reservationData.guests}
                        onChange={(e) => setReservationData({ ...reservationData, guests: e.target.value })}
                        className="w-full px-2.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:ring-2 focus:ring-gold-400 focus:outline-none bg-white"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 Guests (Couple)</option>
                        <option value="4">4 Guests</option>
                        <option value="6">6 Guests</option>
                        <option value="8">8+ Guests (Party)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Seating Ambience
                    </label>
                    <select
                      value={reservationData.seatingPreference}
                      onChange={(e) => setReservationData({ ...reservationData, seatingPreference: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-gold-400 focus:outline-none bg-white"
                    >
                      <option value="Beachfront Deck">Beachfront Open-Air Deck (Direct Ocean View)</option>
                      <option value="Private Cabana">Private Beachside Bamboo Cabana</option>
                      <option value="Indoor AC Lounge">Portuguese Antique Air-Conditioned Dining Hall</option>
                      <option value="Poolside Terrace">Infinity Poolside Sunken Lounge</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Special Dietary / Celebration Notes
                    </label>
                    <input
                      type="text"
                      value={reservationData.specialRequests}
                      onChange={(e) => setReservationData({ ...reservationData, specialRequests: e.target.value })}
                      placeholder="e.g. Anniversary candlelight setup, gluten-free, birthday cake"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-gold-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-ocean-950 font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    Confirm Table Reservation
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Restaurant;
