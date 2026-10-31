import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gift, 
  Sparkles, 
  Clock, 
  Check, 
  Star, 
  ShieldCheck, 
  ArrowLeft, 
  Search, 
  X, 
  CheckCircle,
  Calendar,
  Users,
  Compass,
  PhoneCall
} from 'lucide-react';
import api from '../services/api';

const Packages = ({ onBackToHome }) => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Booking Modal
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    email: '',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    travelers: '2',
    notes: '',
  });

  const categories = [
    'All',
    'Honeymoon',
    'Wellness & Spa',
    'Family Getaway',
    'Weekend Escape',
  ];

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/packages');
      if (res.data.success) {
        setPackages(res.data.packages);
      }
    } catch (err) {
      console.error('Error fetching packages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const filteredPackages = packages.filter((pkg) => {
    const matchesCat = selectedCategory === 'All' || pkg.category === selectedCategory;
    const matchesSearch =
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handlePackageSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedPackage(null);
      setBookingData({
        name: '',
        phone: '',
        email: '',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        travelers: '2',
        notes: '',
      });
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 sm:pt-28 pb-20">
      {/* Hero Banner */}
      <div className="relative bg-ocean-950 text-white py-16 sm:py-24 overflow-hidden mb-12 border-b border-gold-400/20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=2000&q=80"
            alt="Goa Luxury Packages"
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
              All-Inclusive Bespoke Getaways
            </span>
            <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-white mb-4">
              Curated Luxury <br />
              <span className="italic font-light bg-gradient-to-r from-gold-200 via-gold-300 to-gold-400 bg-clip-text text-transparent">
                Holiday Packages
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mb-6">
              Immerse yourself in complete coastal serenity. Every package features luxury villa accommodations, chauffeur airport transfers, gourmet dining, and private experiential excursions.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs text-gold-200/90">
              <span className="bg-white/10 px-3 py-1.5 rounded-full border border-white/15 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-gold-400" /> Best Price Guarantee
              </span>
              <span className="bg-white/10 px-3 py-1.5 rounded-full border border-white/15 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-gold-400" /> Complimentary Excursions
              </span>
              <span className="bg-white/10 px-3 py-1.5 rounded-full border border-white/15 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" /> Dedicated Resort Butler
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Controls Bar: Category Filter + Search */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
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

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search packages..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
          </div>
        </div>

        {/* Packages Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Loading curated resort packages...</p>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8">
            <Gift className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-ocean-950 mb-1">No Packages Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Try adjusting your category filter or search query.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-ocean-950 text-gold-300 font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredPackages.map((pkg) => (
              <motion.div
                key={pkg._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-200 flex flex-col sm:flex-row group"
              >
                {/* Image */}
                <div className="sm:w-2/5 relative h-64 sm:h-auto overflow-hidden flex-shrink-0">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/70 sm:from-transparent sm:to-black/50 to-transparent" />

                  {/* Duration Badge */}
                  <div className="absolute top-3 left-3 bg-ocean-950/90 backdrop-blur-md text-gold-300 text-xs font-bold px-3 py-1 rounded-full border border-gold-400/30 flex items-center gap-1.5 shadow">
                    <Clock className="w-3 h-3 text-gold-400" />
                    <span>{pkg.duration}</span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-md">
                    {pkg.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:w-3/5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1 text-gold-400 text-xs">
                        <Star className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                        <span className="font-bold text-slate-800">{pkg.ratingsAverage || 4.9}</span>
                        <span className="text-slate-400 text-[10px]">(Verified Stay)</span>
                      </div>
                      {pkg.featured && (
                        <span className="text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Top Choice
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif text-xl font-bold text-ocean-950 mb-2 group-hover:text-gold-600 transition-colors">
                      {pkg.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {pkg.description}
                    </p>

                    {/* Inclusions List */}
                    <div className="mb-5">
                      <p className="text-[11px] uppercase font-bold tracking-wider text-slate-700 mb-2">
                        Package Inclusions:
                      </p>
                      <ul className="space-y-1.5">
                        {pkg.inclusions.slice(0, 4).map((inc, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                            <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                        Package Total
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-2xl font-bold text-ocean-950">
                          ₹{(pkg.discountPrice || pkg.price).toLocaleString('en-IN')}
                        </span>
                        {pkg.discountPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{pkg.price.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedPackage(pkg)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-ocean-950 font-bold text-xs shadow-luxury-gold hover:shadow-md transition-all cursor-pointer"
                    >
                      Book Package
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Package Booking Modal */}
      <AnimatePresence>
        {selectedPackage && (
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
                  onClick={() => setSelectedPackage(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold-300 px-2.5 py-0.5 rounded-full bg-gold-400/20 border border-gold-400/30 inline-block mb-1.5">
                  Package Reservation
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold truncate">
                  {selectedPackage.title}
                </h3>
                <p className="text-xs text-gold-300 mt-1">
                  {selectedPackage.duration} · Special Rate: ₹{(selectedPackage.discountPrice || selectedPackage.price).toLocaleString('en-IN')}
                </p>
              </div>

              {bookingSuccess ? (
                <div className="p-10 text-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif text-xl font-bold text-ocean-950 mb-1">
                    Package Request Received!
                  </h4>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto">
                    Our vacation specialist will contact you on <strong>+91 {bookingData.phone}</strong> within 1 hour to finalize your dates and concierge arrangements.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePackageSubmit} className="p-6 space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Primary Guest Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingData.name}
                        onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                        placeholder="e.g. Vikram Sharma"
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-gold-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={bookingData.phone}
                        onChange={(e) =>
                          setBookingData({
                            ...bookingData,
                            phone: e.target.value.replace(/\D/g, '').slice(0, 10),
                          })
                        }
                        placeholder="10-digit mobile"
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-gold-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                        placeholder="vikram@example.com"
                        className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-gold-400 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                        Preferred Arrival Date *
                      </label>
                      <input
                        type="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={bookingData.startDate}
                        onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:ring-2 focus:ring-gold-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Travelers Count
                    </label>
                    <select
                      value={bookingData.travelers}
                      onChange={(e) => setBookingData({ ...bookingData, travelers: e.target.value })}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 focus:ring-2 focus:ring-gold-400 focus:outline-none bg-white"
                    >
                      <option value="2">2 Adults (Couple)</option>
                      <option value="3">3 Adults</option>
                      <option value="4">4 Guests (Family / Friends)</option>
                      <option value="6">6+ Guests (Villa Group)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                      Custom Requests / Preferences
                    </label>
                    <input
                      type="text"
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                      placeholder="e.g. Flight timing, vegetarian food preference, flower setup"
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-gold-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-ocean-950 font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    Confirm Package Booking
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

export default Packages;
