import React from 'react';
import { motion } from 'framer-motion';
import { 
  Palmtree, 
  Award, 
  Utensils, 
  Waves, 
  HeartHandshake, 
  CheckCircle2, 
  Compass,
  Sparkles
} from 'lucide-react';

const AboutUs = () => {
  const highlights = [
    {
      icon: Waves,
      title: 'Pristine Beachfront',
      desc: 'Over 500 meters of uninterrupted shoreline along Candolim, reserved exclusively for Goa Resort guests.',
    },
    {
      icon: Utensils,
      title: 'Epicurean Gastronomy',
      desc: '4 distinct ocean restaurants presenting fresh Goan seafood barbecue, Portuguese tapas, and world cuisine.',
    },
    {
      icon: Award,
      title: 'Ayurvedic Wellness Spa',
      desc: 'Ancient Indian wellness rituals, herbal hydrotherapy baths, and open-air beachfront yoga pavilions.',
    },
    {
      icon: HeartHandshake,
      title: 'Legendary Sussegado Hospitality',
      desc: 'Dedicated round-the-clock butler service and genuine Goan warmth to curate your perfect coastal memory.',
    },
  ];

  const stats = [
    { label: 'Beachfront Keys & Villas', value: '150+' },
    { label: 'Signature Dining Venues', value: '4' },
    { label: 'Infinity Horizon Pools', value: '2' },
    { label: 'Guest Satisfaction', value: '99.4%' },
  ];

  return (
    <section id="about" className="py-24 bg-[#FAF8F5] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Story Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Images Montage */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white h-[420px] sm:h-[480px]">
              <img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
                alt="Goa Resort Architecture"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/70 via-transparent to-transparent" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-gold-300 text-xs uppercase font-bold tracking-widest">
                  Heritage Meets Coastal Elegance
                </span>
                <p className="font-serif text-xl sm:text-2xl font-bold mt-1">
                  Candolim, North Goa
                </p>
              </div>
            </div>

            {/* Overlapping Small Card */}
            <div className="absolute -bottom-8 -right-4 sm:-right-8 w-60 sm:w-72 bg-white rounded-2xl p-5 shadow-2xl border border-gold-400/30 hidden sm:block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gold-400/20 flex items-center justify-center text-gold-600">
                  <Palmtree className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-ocean-950 text-sm">Since 2012</h4>
                  <p className="text-xs text-slate-500">A Decades-Long Legacy in Goa</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 mt-3 italic border-t border-slate-100 pt-2">
                "Where every sunset tells a story of serenity and timeless indulgence."
              </p>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs uppercase tracking-widest text-gold-600 font-bold px-3.5 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20 inline-block mb-3">
              About Goa Resort
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-ocean-950 tracking-tight leading-tight">
              An Architectural Sanctuary on the Arabian Coast
            </h2>
            
            <p className="mt-5 text-slate-600 leading-relaxed text-sm sm:text-base">
              Nestled between whispering coconut groves and the golden sands of Candolim Beach, 
              <strong className="text-ocean-950 font-semibold"> Goa Resort</strong> is designed as a sanctuary of barefoot luxury. 
              Our design celebrates Goan-Portuguese colonial aesthetics—terracotta roofs, hand-carved teakwood, 
              and airy sunlit verandas—seamlessly paired with cutting-edge modern hospitality.
            </p>

            <p className="mt-4 text-slate-600 leading-relaxed text-sm sm:text-base">
              Whether you are basking by our infinity pool watching the Arabian sunset, enjoying 
              curated spice trails in the Goan hinterlands, or indulging in an open-air Ayurvedic treatment, 
              we invite you to embrace the true spirit of <em>‘Sussegado’</em>—the blissful contentment of time standing still.
            </p>

            {/* Checklist */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm font-medium text-slate-800">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Private Beach Cabanas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Chauffeured Airport Transfers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Sunset Catamaran Cruises</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Eco-Certified Green Resort</span>
              </div>
            </div>

            {/* General Manager Signature */}
            <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-serif text-lg font-bold text-ocean-950">Vikramaditya Saldanha</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">General Manager & Resident Host</p>
              </div>
              <div className="font-serif italic text-gold-600 text-lg">
                "Welcome to Goa Resort"
              </div>
            </div>

          </motion.div>

        </div>

        {/* 4 Pillars of Excellence */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-sand-100 group-hover:bg-gold-400 group-hover:text-ocean-950 transition-colors flex items-center justify-center text-gold-600 mb-5">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-serif text-xl font-bold text-ocean-950 group-hover:text-gold-600 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Stats Strip */}
        <div className="mt-16 bg-ocean-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl border border-gold-400/20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {stats.map((stat, i) => (
              <div key={stat.label} className={i !== 0 ? 'pt-6 lg:pt-0' : ''}>
                <div className="font-serif text-3xl sm:text-5xl font-bold text-gold-400">
                  {stat.value}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;
