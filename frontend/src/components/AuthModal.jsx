import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail, User, Phone, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthModal = () => {
  const { authModalOpen, authModalMode, setAuthModalMode, closeAuthModal, login, register } = useAuth();

  useEffect(() => {
    if (authModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [authModalOpen]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedRole, setSelectedRole] = useState(null); // 'admin' | 'guest' | null

  useEffect(() => {
    if (!authModalOpen) {
      setEmail('');
      setPassword('');
      setName('');
      setPhone('');
      setError('');
      setSelectedRole(null);
    }
  }, [authModalOpen]);

  if (!authModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let res;
    if (authModalMode === 'signin') {
      res = await login(email, password);
    } else {
      if (phone && phone.length !== 10) {
        setError('Phone number must be exactly 10 digits');
        setLoading(false);
        return;
      }
      res = await register({ name, email, password, phone, role: 'user' });
    }

    setLoading(false);
    if (!res.success) {
      setError(res.message);
    }
  };

  const handleSelectRole = (role) => {
    setError('');
    if (authModalMode !== 'signin') {
      setAuthModalMode('signin');
    }
    setSelectedRole(role);
    if (role === 'admin') {
      setEmail('admin@goaresort.com');
      setPassword('admin123');
    } else if (role === 'guest') {
      setEmail('guest@example.com');
      setPassword('guest123');
    }
  };

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (val === 'admin@goaresort.com') {
      setSelectedRole('admin');
    } else if (val === 'guest@example.com') {
      setSelectedRole('guest');
    } else {
      setSelectedRole(null);
    }
  };

  const handlePhoneChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
  };

  const handlePasswordChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    if (selectedRole === 'admin' && val !== 'admin123') {
      setSelectedRole(null);
    } else if (selectedRole === 'guest' && val !== 'guest123') {
      setSelectedRole(null);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-md w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200"
        >
          {/* Header Graphic */}
          <div className="bg-ocean-950 p-6 text-center text-white relative">
            <button
              onClick={closeAuthModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="text-[10px] uppercase font-bold tracking-widest text-gold-300 px-2.5 py-1 rounded-full bg-gold-400/20 border border-gold-400/30 inline-block mb-2">
              Goa Resort Guest Portal
            </span>
            <h3 className="font-serif text-2xl font-bold text-white">
              {authModalMode === 'signin' ? 'Welcome Back' : 'Create Your Account'}
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              {authModalMode === 'signin'
                ? 'Sign in to access reservations, member privileges & fast checkout'
                : 'Join our preferred guest collective for luxury Goan experiences'}
            </p>
          </div>

          {/* Quick Demo Login Bar */}
          {authModalMode === 'signin' && (
            <div className="bg-slate-50 p-3 px-6 border-b border-slate-200 flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-600 font-medium">Quick Demo Access:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  id="admin-demo-btn"
                  onClick={() => handleSelectRole('admin')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    selectedRole === 'admin'
                      ? 'bg-black text-white border-black ring-1 ring-black'
                      : 'bg-white text-black border-slate-300 hover:bg-slate-100 hover:border-black'
                  }`}
                >
                  <ShieldCheck className={`w-3.5 h-3.5 ${selectedRole === 'admin' ? 'text-white' : 'text-black'}`} />
                  <span>Admin</span>
                </button>
                <button
                  type="button"
                  id="guest-demo-btn"
                  onClick={() => handleSelectRole('guest')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm ${
                    selectedRole === 'guest'
                      ? 'bg-black text-white border-black ring-1 ring-black'
                      : 'bg-white text-black border-slate-300 hover:bg-slate-100 hover:border-black'
                  }`}
                >
                  <User className={`w-3.5 h-3.5 ${selectedRole === 'guest' ? 'text-white' : 'text-black'}`} />
                  <span>Guest</span>
                </button>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {authModalMode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Arjun Verma"
                        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={phone}
                        onChange={handlePhoneChange}
                        placeholder="10-digit mobile number"
                        className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="guest@example.com"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-gold-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-xl font-bold text-ocean-950 bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 hover:from-gold-400 hover:to-gold-600 shadow-md hover:shadow-lg transition-all duration-200 text-sm disabled:opacity-70"
              >
                {loading
                  ? 'Processing...'
                  : authModalMode === 'signin'
                  ? 'Sign In to Account'
                  : 'Create Luxury Account'}
              </button>
            </form>

            {/* Toggle sign in / sign up */}
            <div className="mt-5 text-center text-xs text-slate-600 border-t border-slate-100 pt-4">
              {authModalMode === 'signin' ? (
                <p>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setAuthModalMode('signup');
                    }}
                    className="font-bold text-gold-600 hover:text-gold-700 underline"
                  >
                    Register here
                  </button>
                </p>
              ) : (
                <p>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setError('');
                      setAuthModalMode('signin');
                    }}
                    className="font-bold text-gold-600 hover:text-gold-700 underline"
                  >
                    Sign In
                  </button>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
