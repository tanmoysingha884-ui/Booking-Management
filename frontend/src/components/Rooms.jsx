import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Maximize,
  Bed,
  Eye,
  Star,
  Check,
  ArrowRight,
  ArrowLeft,
  Filter,
  Search,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import api from '../services/api';

const Rooms = ({ onSelectRoomForBooking, onSelectRoomForDetails, searchFilter, onBackToHome }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchFilter?.roomType || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');

  const categories = [
    'All',
    'Ocean Suite',
    'Royal Villa',
    'Beachfront Cottage',
    'Deluxe Room',
    'Super Deluxe',
  ];

  // Update category when searchFilter changes from Hero
  useEffect(() => {
    if (searchFilter?.roomType) {
      setSelectedCategory(searchFilter.roomType);
    }
  }, [searchFilter]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const res = await api.get('/rooms');
      if (res.data.success) {
        setRooms(res.data.rooms);
      }
    } catch (err) {
      console.error('Failed to load rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Filter and sort rooms
  const filteredRooms = rooms
    .filter((room) => {
      const matchesCategory =
        selectedCategory === 'All' || room.roomType === selectedCategory;
      const matchesSearch =
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.amenities.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') {
        const priceA = a.discountPrice || a.pricePerNight;
        const priceB = b.discountPrice || b.pricePerNight;
        return priceA - priceB;
      }
      if (sortBy === 'price-high') {
        const priceA = a.discountPrice || a.pricePerNight;
        const priceB = b.discountPrice || b.pricePerNight;
        return priceB - priceA;
      }
      if (sortBy === 'rating') {
        return (b.ratingsAverage || 5) - (a.ratingsAverage || 5);
      }
      // default: featured first
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });

  return (
    <section id="rooms" className="pt-28 sm:pt-32 pb-24 min-h-screen bg-gradient-to-b from-[#FAF8F5] to-sand-100/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Back to Home Quick Action */}
        {onBackToHome && (
          <div className="mb-6">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-ocean-950 hover:border-gold-400 text-xs sm:text-sm font-semibold transition-all shadow-sm group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-gold-600" />
              <span>Back to Resort Home</span>
            </button>
          </div>
        )}

        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-gold-600 font-bold px-3.5 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20 inline-block mb-3">
            Luxury Accommodations
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-ocean-950 tracking-tight">
            Handcrafted Stays & Beachfront Villas
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Each sanctuary is thoughtfully curated with Goan Portuguese architectural nuances,
            soothing oceanic hues, and private verandahs kissed by the Arabian breeze.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200/80">

          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${selectedCategory === cat
                    ? 'bg-ocean-950 text-gold-300 shadow-md scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-ocean-950 border border-slate-200'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Dropdowns */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search suites, villas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-full bg-white border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-400 shadow-sm"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-3 text-xs sm:text-sm rounded-full bg-white border border-slate-200 text-slate-700 focus:outline-none focus:ring-2 focus:ring-gold-400 shadow-sm cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

        </div>

        {/* Room Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-3xl h-[480px] animate-pulse shadow-md" />
            ))}
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
            <p className="text-xl font-serif text-slate-700">No rooms match your search criteria</p>
            <p className="text-slate-500 text-sm mt-2">Try clearing your filters or changing room category</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-5 px-6 py-2.5 bg-ocean-950 text-gold-300 rounded-full text-sm font-semibold hover:bg-ocean-900 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room, idx) => {
              const activePrice = room.discountPrice || room.pricePerNight;
              const hasDiscount = room.discountPrice && room.discountPrice < room.pricePerNight;

              return (
                <motion.div
                  key={room._id}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-luxury hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Card Image with Badges */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                      {room.featured && (
                        <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gold-400 text-ocean-950 shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Featured
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-ocean-950/80 backdrop-blur-md text-white border border-white/20">
                        {room.roomType}
                      </span>
                    </div>

                    {hasDiscount && (
                      <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                        Save ₹{(room.pricePerNight - room.discountPrice).toLocaleString('en-IN')}
                      </div>
                    )}

                    {/* View Badge at Bottom of Image */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                      <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                        <Eye className="w-3.5 h-3.5 text-gold-300" />
                        {room.view}
                      </span>
                      <span className="flex items-center gap-1 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-lg text-gold-300 font-semibold">
                        <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                        {room.ratingsAverage} ({room.numReviews})
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-ocean-950 group-hover:text-gold-600 transition-colors line-clamp-1">
                        {room.name}
                      </h3>
                      <p className="mt-2 text-slate-500 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                        {room.shortDescription || room.description}
                      </p>

                      {/* Specs Row */}
                      <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-slate-600 text-xs text-center">
                        <div className="bg-sand-50 p-2 rounded-xl border border-sand-200">
                          <Users className="w-3.5 h-3.5 mx-auto mb-1 text-gold-600" />
                          <span className="font-semibold">{room.capacity.maxGuests} Guests</span>
                        </div>
                        <div className="bg-sand-50 p-2 rounded-xl border border-sand-200">
                          <Maximize className="w-3.5 h-3.5 mx-auto mb-1 text-gold-600" />
                          <span className="font-semibold">{room.sizeSqFt} sq ft</span>
                        </div>
                        <div className="bg-sand-50 p-2 rounded-xl border border-sand-200">
                          <Bed className="w-3.5 h-3.5 mx-auto mb-1 text-gold-600" />
                          <span className="font-semibold truncate block">{room.bedType.split(' ')[0]} Bed</span>
                        </div>
                      </div>

                      {/* Amenities Pills */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {room.amenities.slice(0, 3).map((amenity, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-medium"
                          >
                            <Check className="w-3 h-3 text-emerald-500" />
                            {amenity}
                          </span>
                        ))}
                        {room.amenities.length > 3 && (
                          <span className="text-[11px] text-slate-400 self-center px-1 font-medium">
                            +{room.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Pricing & Actions */}
                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-serif text-2xl font-bold text-ocean-950">
                            ₹{activePrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-400">/ night</span>
                        </div>
                        {hasDiscount && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{room.pricePerNight.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectRoomForDetails(room)}
                          className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:border-ocean-950 hover:bg-slate-50 transition-colors"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => onSelectRoomForBooking(room)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-ocean-950 text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1 group/btn"
                        >
                          <span>Reserve</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};

export default Rooms;
