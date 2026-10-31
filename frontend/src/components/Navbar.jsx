import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palmtree,
  User,
  LogOut,
  CalendarCheck,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onOpenBookings, onNavigateToAdmin, currentView, setCurrentView }) => {
  const { user, isAdmin, logout, openAuthModal } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', view: 'hotel' },
    { name: 'Rooms', view: 'rooms' },
    { name: 'Restaurant', view: 'restaurant' },
    { name: 'Packages', view: 'packages' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (link) => {
    if (link.view) {
      setCurrentView(link.view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (link.href) {
      if (currentView !== 'hotel') {
        setCurrentView('hotel');
        setTimeout(() => {
          const el = document.querySelector(link.href);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const el = document.querySelector(link.href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-ocean-950/90 backdrop-blur-md shadow-lg py-3 border-b border-white/10'
          : 'bg-gradient-to-b from-ocean-950/80 via-ocean-950/40 to-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Logo & Hotel Brand */}
          <button
            onClick={() => {
              setCurrentView('hotel');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-gold-500 to-gold-300 flex items-center justify-center shadow-luxury-gold group-hover:scale-105 transition-transform duration-300">
              <Palmtree className="w-6 h-6 text-ocean-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-2xl font-bold tracking-wider text-white">
                  GOA RESORT
                </span>
                <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-gold-400/20 text-gold-300 border border-gold-400/30 font-semibold">
                  5-STAR LUXURY
                </span>
              </div>
              <p className="text-xs text-gold-200/80 tracking-widest uppercase font-light">
                Candolim Beach, Goa
              </p>
            </div>
          </button>

          {/* Center 5 Options: Home, Rooms, Gallery, About Us, Contact */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navLinks.map((link) => {
              const isActive = link.view ? currentView === link.view : false;
              return (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className={`px-3.5 py-2 text-sm lg:text-base font-medium tracking-wide transition-colors duration-200 relative group ${isActive ? 'text-gold-300 font-semibold' : 'text-slate-100 hover:text-gold-300'
                    }`}
                >
                  {link.name}
                  <span
                    className={`absolute bottom-1 left-3.5 right-3.5 h-[2px] bg-gradient-to-r from-gold-400 to-gold-200 transition-transform duration-300 origin-left ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Right Side: Sign In Button OR User Avatar / Profile */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Quick concierge call badge */}
            <a
              href="tel:+919822144550"
              className="hidden xl:flex items-center gap-2 text-xs text-slate-300 hover:text-gold-300 transition-colors py-1.5 px-3 rounded-full border border-white/10 hover:border-gold-400/40 bg-white/5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-gold-400" />
              <span>+91 98221 44550</span>
            </a>

            {user ? (
              /* User logged in: Show Avatar, Name and Luxury Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-white/10 hover:bg-white/15 border border-gold-400/30 transition-all duration-200 focus:outline-none"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-gold-400"
                  />
                  <div className="text-left text-xs leading-tight">
                    <p className="font-semibold text-white truncate max-w-[110px]">
                      {user.name}
                    </p>
                    <span className="text-[10px] text-gold-300 capitalize font-medium flex items-center gap-1">
                      {user.role === 'admin' ? (
                        <>
                          <ShieldCheck className="w-2.5 h-2.5 text-gold-400" /> Admin
                        </>
                      ) : (
                        'Guest'
                      )}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-ocean-950/95 backdrop-blur-xl border border-gold-400/30 shadow-2xl p-2 z-50 text-slate-200"
                    >
                      <div className="px-3 py-2.5 border-b border-white/10 mb-1">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-semibold text-white truncate">
                          {user.email}
                        </p>
                      </div>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            onNavigateToAdmin();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gold-300 hover:bg-white/10 rounded-xl transition-colors font-medium text-left"
                        >
                          <ShieldCheck className="w-4 h-4 text-gold-400" />
                          <span>Admin Dashboard</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          onOpenBookings();
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-white/10 rounded-xl transition-colors text-left"
                      >
                        <CalendarCheck className="w-4 h-4 text-gold-400" />
                        <span>My Bookings</span>
                      </button>

                      <div className="border-t border-white/10 my-1 pt-1">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* User not logged in: Sign In Button */
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => openAuthModal('signin')}
                className="px-6 py-2.5 rounded-full text-sm font-semibold text-ocean-950 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 shadow-luxury-gold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {user && (
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="p-1 rounded-full ring-2 ring-gold-400 focus:outline-none"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover"
                />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-ocean-950/98 backdrop-blur-xl border-b border-gold-400/20 px-6 py-6"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                const isActive = link.view ? currentView === link.view : false;
                return (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link)}
                    className={`text-left text-lg font-medium py-1.5 transition-colors ${isActive ? 'text-gold-300 font-bold' : 'text-slate-200 hover:text-gold-300'
                      }`}
                  >
                    {link.name}
                  </button>
                );
              })}

              <div className="border-t border-white/10 pt-4 mt-2">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 py-2">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-9 h-9 rounded-full ring-2 ring-gold-400 object-cover"
                      />
                      <div>
                        <p className="font-semibold text-white text-sm">{user.name}</p>
                        <p className="text-xs text-gold-300">{user.email}</p>
                      </div>
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          onNavigateToAdmin();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-gold-400/20 text-gold-300 font-medium text-sm"
                      >
                        <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenBookings();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/10 text-white font-medium text-sm"
                    >
                      <CalendarCheck className="w-4 h-4 text-gold-400" /> My Bookings
                    </button>

                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/20 text-red-300 font-medium text-sm"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openAuthModal('signin');
                    }}
                    className="w-full py-3 rounded-full text-center font-semibold text-ocean-950 bg-gradient-to-r from-gold-300 to-gold-500"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
