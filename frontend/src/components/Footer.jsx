import { Palmtree, Mail, Phone, MapPin, Send, Globe, Share2, Compass, Heart } from 'lucide-react';
import { useState } from 'react';

const Footer = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-ocean-950 text-white pt-20 pb-12 border-t border-gold-400/20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/10">

          {/* Brand & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gold-500 to-gold-300 flex items-center justify-center text-ocean-950 shadow-luxury-gold">
                <Palmtree className="w-6 h-6" />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-wider block">
                  GOA RESORT
                </span>
                <span className="text-[10px] uppercase tracking-widest text-gold-300">
                  Candolim Beach · North Goa
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
              A 5-star ocean sanctuary where Goan Portuguese heritage meets Arabian horizons.
              Experience beachfront luxury, private plunge pools, and authentic coastal tranquility.
            </p>

            <div className="pt-2 flex items-center gap-3 text-slate-400">
              <a
                href="#home"
                title="Resort Portal"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold-400 hover:text-ocean-950 flex items-center justify-center transition-all"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#home"
                title="Share Resort"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold-400 hover:text-ocean-950 flex items-center justify-center transition-all"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="#home"
                className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold-400 hover:text-ocean-950 flex items-center justify-center transition-all"
              >
                <Compass className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-bold text-gold-300 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              {['Home', 'Rooms', 'Restaurant', 'Packages', 'Gallery', 'About Us', 'Contact'].map((item) => (
                <li key={item}>
                  <button
                    onClick={() => {
                      if (onNavigate) {
                        onNavigate(item);
                      } else {
                        const id = item.toLowerCase().replace(' ', '');
                        const el = document.getElementById(id === 'home' ? 'home' : id);
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="hover:text-gold-300 transition-colors cursor-pointer"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Suites & Stays */}
          <div>
            <h4 className="font-serif text-lg font-bold text-gold-300 mb-4">
              Accommodations
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-300">
              <li>Arabian Sea Suites</li>
              <li>Royal Portuguese Villas</li>
              <li>Beachfront Cottages</li>
              <li>Tropical Lagoon Deluxes</li>
              <li>Grand Penthouse Lounge</li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div>
            <h4 className="font-serif text-lg font-bold text-gold-300 mb-2">
              Privilege Club
            </h4>
            <p className="text-xs text-slate-300 mb-4">
              Subscribe to receive private seasonal offers and invitation-only villa upgrades.
            </p>

            {subscribed ? (
              <div className="p-3 bg-emerald-900/40 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs">
                Welcome to our Privilege Club! We look forward to hosting you.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-gold-400 text-ocean-950 hover:bg-gold-300 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[11px] text-slate-400 block">
                  We respect your privacy. Unsubscribe anytime.
                </span>
              </form>
            )}
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Goa Resort, Candolim, Goa. All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Luxury Hospitality in Goa</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
