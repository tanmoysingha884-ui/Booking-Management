import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image, X, ZoomIn, Eye, Sparkles } from 'lucide-react';
import api from '../services/api';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxImage, setLightboxImage] = useState(null);

  const categories = ['All', 'Beach', 'Suites', 'Dining', 'Spa & Pool', 'Sunset & Vibe'];

  const fetchGallery = async () => {
    try {
      const res = await api.get('/gallery');
      if (res.data.success) {
        setItems(res.data.items);
      }
    } catch (err) {
      console.error('Failed to load gallery items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const filteredItems = items.filter(
    (item) => activeCategory === 'All' || item.category === activeCategory
  );

  return (
    <section id="gallery" className="py-24 bg-ocean-950 text-white relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-40 w-96 h-96 bg-ocean-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-gold-400 font-bold px-3.5 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20 inline-block mb-3">
            Moments at Goa Resort
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            The Coastal Gallery
          </h2>
          <p className="mt-4 text-slate-300 text-base sm:text-lg">
            Immerse yourself in snapshots of turquoise Arabian waters, candlelit seaside dining,
            sun-drenched infinity edges, and colonial Portuguese charm.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-gold-300 to-gold-500 text-ocean-950 shadow-luxury-gold scale-105'
                  : 'bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="h-64 rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/10 p-8">
            <p className="text-slate-300 font-serif text-lg">No photos found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item, idx) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                onClick={() => setLightboxImage(item)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer shadow-lg border border-white/10 ${
                  idx % 5 === 0 ? 'sm:col-span-2 sm:row-span-2 h-96 sm:h-[480px]' : 'h-64'
                }`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay with info */}
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-ocean-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
                  <span className="text-[10px] uppercase font-bold text-gold-300 tracking-wider mb-1">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-white leading-snug">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-gold-400 font-semibold">
                    <ZoomIn className="w-4 h-4" />
                    <span>Click to view in high resolution</span>
                  </div>
                </div>

                {/* Subtle permanent category chip */}
                <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-slate-200 border border-white/10 group-hover:opacity-0 transition-opacity">
                  {item.category}
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-ocean-900 rounded-3xl overflow-hidden border border-gold-400/30 shadow-2xl cursor-default"
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition-colors border border-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[75vh] overflow-hidden flex items-center justify-center bg-black">
                <img
                  src={lightboxImage.imageUrl}
                  alt={lightboxImage.title}
                  className="w-full h-full max-h-[75vh] object-contain"
                />
              </div>

              <div className="p-6 bg-ocean-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-white/10">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-gold-400">
                    {lightboxImage.category}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-white mt-0.5">
                    {lightboxImage.title}
                  </h3>
                  {lightboxImage.description && (
                    <p className="text-sm text-slate-300 mt-1 max-w-xl">
                      {lightboxImage.description}
                    </p>
                  )}
                </div>

                <div className="text-xs text-slate-400 border-l border-white/10 pl-4 hidden sm:block">
                  <p>Goa Resort Collection</p>
                  <p className="text-gold-300 font-semibold mt-0.5">Candolim, Goa</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
