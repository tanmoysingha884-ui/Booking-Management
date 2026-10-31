import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  MessageSquare, 
  CheckCircle, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import api from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, [name]: digitsOnly });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const res = await api.post('/contact', formData);
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'General Inquiry',
          message: '',
        });
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 'Failed to submit inquiry. Please try again or call our desk.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-b from-sand-100/60 to-[#FAF8F5] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-gold-600 font-bold px-3.5 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20 inline-block mb-3">
            Get In Touch
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-ocean-950 tracking-tight">
            Connect with Goa Resort
          </h2>
          <p className="mt-4 text-slate-600 text-base sm:text-lg">
            Our 24-hour concierge team is at your service for bespoke itinerary planning,
            private villa bookings, airport chauffeured transfers, and celebratory banquets.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct Details & Map Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Info Card */}
            <div className="bg-ocean-950 rounded-3xl p-8 text-white shadow-xl border border-gold-400/20">
              <h3 className="font-serif text-2xl font-bold mb-6 text-gold-300">
                Resort Concierge Desk
              </h3>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-gold-400">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-200">Resort Address</p>
                    <p className="text-slate-400 mt-0.5 leading-relaxed">
                      Candolim Beach Road, Fort Aguada Area, North Goa, 403515, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-gold-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-200">Phone & WhatsApp</p>
                    <p className="text-slate-400 mt-0.5">+91 98221 44550</p>
                    <p className="text-slate-400">+91 832 248 9900</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-gold-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-200">Direct Email</p>
                    <p className="text-slate-400 mt-0.5">reservations@goaresort.com</p>
                    <p className="text-slate-400">concierge@goaresort.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-gold-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-200">Reception Hours</p>
                    <p className="text-slate-400 mt-0.5">24 Hours / 7 Days a week</p>
                  </div>
                </div>
              </div>

              {/* Transit Distances */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <p className="text-xs uppercase font-bold tracking-wider text-gold-400 mb-3">
                  Airport Proximity
                </p>
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-300">
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                    <span className="font-semibold text-white block">Mopa Airport (GOX)</span>
                    <span className="text-slate-400">38 km · ~50 mins</span>
                  </div>
                  <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
                    <span className="font-semibold text-white block">Dabolim Airport (GOI)</span>
                    <span className="text-slate-400">42 km · ~60 mins</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Interactive Map Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-md border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-ocean-950 text-sm flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gold-600" />
                  Candolim Coastline, North Goa
                </h4>
                <a
                  href="https://maps.google.com/?q=Candolim+Beach+Goa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gold-600 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80"
                  alt="Goa Beach Map Area"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-ocean-950/20" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-ocean-950 text-gold-300 px-3 py-1.5 rounded-full text-xs font-bold shadow-xl border border-gold-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Goa Resort</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 shadow-luxury border border-slate-200"
          >
            <h3 className="font-serif text-2xl font-bold text-ocean-950 mb-2">
              Send an Inquiry or Reservation Request
            </h3>
            <p className="text-slate-500 text-sm mb-6">
              Fill out the details below and our reservations concierge will get back to you within 2 hours.
            </p>

            {successMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Inquiry Sent Successfully</p>
                  <p className="text-xs text-emerald-700 mt-0.5">{successMsg}</p>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Submission Error</p>
                  <p className="text-xs text-red-700 mt-0.5">{errorMsg}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Arjun Patel"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="arjun@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit phone number"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all cursor-pointer bg-white"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Room & Villa Reservations">Room & Villa Reservations</option>
                    <option value="Destination Wedding & Events">Destination Wedding & Events</option>
                    <option value="Airport Concierge & Pickup">Airport Concierge & Pickup</option>
                    <option value="Dining & Private Cabana">Dining & Private Cabana</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Message / Special Requests *
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us about your dates, group size, or any specific requests..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-ocean-950 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 hover:from-gold-400 hover:to-gold-600 shadow-luxury-gold hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <span>Sending inquiry...</span>
                ) : (
                  <>
                    <span>Submit Inquiry</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default Contact;
