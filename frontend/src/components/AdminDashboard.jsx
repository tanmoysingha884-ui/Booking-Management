import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  Bed, 
  CalendarCheck, 
  Image, 
  Mail, 
  Plus, 
  Trash2, 
  Edit, 
  ArrowLeft, 
  RotateCw, 
  DollarSign, 
  Users, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Search,
  Sparkles,
  UtensilsCrossed,
  PackageOpen,
  Wine,
  Flame,
  Clock,
  Tag,
  X,
  LogOut,
  Star,
  History,
  Smartphone,
  Send,
  MessageSquare,
  PhoneCall,
  RefreshCw,
  CheckCheck,
  Eye
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import ImageSelector from './ImageSelector';

const AdminDashboard = ({ onBackToSite }) => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'rooms' | 'restaurant' | 'packages' | 'bookings' | 'gallery' | 'inquiries'
  const [stats, setStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');

  // Guest Bookings: Current vs History & Receptionist Checkout States
  const [bookingSubTab, setBookingSubTab] = useState('current'); // 'current' | 'history'
  const [bookingSearch, setBookingSearch] = useState('');
  const [checkoutConfirmModal, setCheckoutConfirmModal] = useState(null); // booking to confirm checkout
  const [checkoutModalData, setCheckoutModalData] = useState(null); // checkout success & rating message dispatched modal
  const [viewRatingMsgModal, setViewRatingMsgModal] = useState(null); // view full rating dispatch logs
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [resendingId, setResendingId] = useState(null);

  // Derived Bookings: Current vs Cancellation vs History and Filtered Lists
  const currentBookings = (bookings || []).filter(
    (b) => b.bookingStatus !== 'Checked-Out' && b.bookingStatus !== 'Completed' && b.bookingStatus !== 'Cancelled'
  );
  const cancelledBookings = (bookings || []).filter(
    (b) => b.bookingStatus === 'Cancelled'
  );
  const historyBookings = (bookings || []).filter(
    (b) => b.bookingStatus === 'Checked-Out' || b.bookingStatus === 'Completed'
  );

  const filteredCurrentBookings = currentBookings.filter((b) => {
    if (!bookingSearch.trim()) return true;
    const q = bookingSearch.toLowerCase();
    return (
      b.bookingReference?.toLowerCase().includes(q) ||
      b.guestDetails?.name?.toLowerCase().includes(q) ||
      b.guestDetails?.phone?.toLowerCase().includes(q) ||
      b.guestDetails?.email?.toLowerCase().includes(q) ||
      b.room?.name?.toLowerCase().includes(q)
    );
  });

  const filteredCancelledBookings = cancelledBookings.filter((b) => {
    if (!bookingSearch.trim()) return true;
    const q = bookingSearch.toLowerCase();
    return (
      b.bookingReference?.toLowerCase().includes(q) ||
      b.guestDetails?.name?.toLowerCase().includes(q) ||
      b.guestDetails?.phone?.toLowerCase().includes(q) ||
      b.guestDetails?.email?.toLowerCase().includes(q) ||
      b.room?.name?.toLowerCase().includes(q)
    );
  });

  const filteredHistoryBookings = historyBookings.filter((b) => {
    if (!bookingSearch.trim()) return true;
    const q = bookingSearch.toLowerCase();
    return (
      b.bookingReference?.toLowerCase().includes(q) ||
      b.guestDetails?.name?.toLowerCase().includes(q) ||
      b.guestDetails?.phone?.toLowerCase().includes(q) ||
      b.guestDetails?.email?.toLowerCase().includes(q) ||
      b.room?.name?.toLowerCase().includes(q)
    );
  });

  // Modals for admin actions
  const [roomModalOpen, setRoomModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomFormData, setRoomFormData] = useState({
    name: '',
    roomType: 'Deluxe Room',
    description: '',
    shortDescription: '',
    pricePerNight: '',
    discountPrice: '',
    sizeSqFt: 450,
    bedType: 'King Bed',
    view: 'Arabian Sea View',
    capacity: { adults: 2, children: 1, maxGuests: 3 },
    amenities: 'Free High-speed Wi-Fi, Air Conditioning, Ocean View Balcony, King Size Bed',
    images: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    featured: false,
  });

  // Restaurant Menu Modal & Form
  const [restaurantModalOpen, setRestaurantModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [restaurantFormData, setRestaurantFormData] = useState({
    name: '',
    category: 'Goan Seafood',
    description: '',
    price: '',
    image: '',
    isVeg: false,
    isChefSpecial: false,
    spicyLevel: 'Medium',
    available: true,
  });

  // Holiday Packages Modal & Form
  const [packageModalOpen, setPackageModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [packageFormData, setPackageFormData] = useState({
    title: '',
    category: 'Honeymoon',
    duration: '3 Nights / 4 Days',
    price: '',
    discountPrice: '',
    description: '',
    inclusions: 'Luxury Ocean Suite Stay, Daily Candlelight Beachside Dinner, Unlimited Spa & Couple Massage, Private Yacht Cruise at Sunset',
    image: '',
    featured: false,
    available: true,
  });

  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [galleryFormData, setGalleryFormData] = useState({
    title: '',
    category: 'Beach',
    imageUrl: '',
    description: '',
  });

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, roomsRes, bookingsRes, galleryRes, inquiriesRes, restaurantRes, packageRes] = await Promise.all([
        api.get('/admin/stats').catch(() => ({ data: { stats: null } })),
        api.get('/rooms').catch(() => ({ data: { rooms: [] } })),
        api.get('/bookings').catch(() => ({ data: { bookings: [] } })),
        api.get('/gallery').catch(() => ({ data: { items: [] } })),
        api.get('/contact').catch(() => ({ data: { inquiries: [] } })),
        api.get('/restaurant').catch(() => ({ data: { items: [] } })),
        api.get('/packages').catch(() => ({ data: { packages: [] } })),
      ]);

      if (statsRes.data?.stats) setStats(statsRes.data.stats);
      if (roomsRes.data?.rooms) setRooms(roomsRes.data.rooms);
      if (bookingsRes.data?.bookings) setBookings(bookingsRes.data.bookings);
      if (galleryRes.data?.items) setGallery(galleryRes.data.items);
      if (inquiriesRes.data?.inquiries) setInquiries(inquiriesRes.data.inquiries);
      if (restaurantRes.data?.items) setMenuItems(restaurantRes.data.items);
      if (packageRes.data?.packages) setPackages(packageRes.data.packages);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const showNotification = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 4000);
  };

  // ----------------- ROOM ACTIONS -----------------
  const handleOpenAddRoom = () => {
    setEditingRoom(null);
    setRoomFormData({
      name: '',
      roomType: 'Deluxe Room',
      description: '',
      shortDescription: '',
      pricePerNight: '',
      discountPrice: '',
      sizeSqFt: 450,
      bedType: 'King Bed',
      view: 'Arabian Sea View',
      capacity: { adults: 2, children: 1, maxGuests: 3 },
      amenities: 'Free High-speed Wi-Fi, Air Conditioning, Ocean View Balcony, King Size Bed',
      images: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      featured: false,
    });
    setRoomModalOpen(true);
  };

  const handleOpenEditRoom = (room) => {
    setEditingRoom(room);
    setRoomFormData({
      name: room.name,
      roomType: room.roomType,
      description: room.description,
      shortDescription: room.shortDescription || '',
      pricePerNight: room.pricePerNight,
      discountPrice: room.discountPrice || '',
      sizeSqFt: room.sizeSqFt || 450,
      bedType: room.bedType || 'King Bed',
      view: room.view || 'Arabian Sea View',
      capacity: room.capacity || { adults: 2, children: 1, maxGuests: 3 },
      amenities: Array.isArray(room.amenities) ? room.amenities.join(', ') : '',
      images: Array.isArray(room.images) ? room.images.join(', ') : '',
      featured: !!room.featured,
    });
    setRoomModalOpen(true);
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: roomFormData.name,
        roomType: roomFormData.roomType,
        description: roomFormData.description,
        shortDescription: roomFormData.shortDescription,
        pricePerNight: Number(roomFormData.pricePerNight),
        discountPrice: roomFormData.discountPrice ? Number(roomFormData.discountPrice) : 0,
        sizeSqFt: Number(roomFormData.sizeSqFt),
        bedType: roomFormData.bedType,
        view: roomFormData.view,
        capacity: roomFormData.capacity,
        amenities: typeof roomFormData.amenities === 'string'
          ? roomFormData.amenities.split(',').map((s) => s.trim()).filter(Boolean)
          : roomFormData.amenities,
        images: typeof roomFormData.images === 'string'
          ? roomFormData.images.split(',').map((s) => s.trim()).filter(Boolean)
          : roomFormData.images,
        featured: roomFormData.featured,
      };

      if (editingRoom) {
        await api.put(`/rooms/${editingRoom._id}`, payload);
        showNotification('Room details updated successfully');
      } else {
        await api.post('/rooms', payload);
        showNotification('New room added to Goa Resort listings');
      }

      setRoomModalOpen(false);
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving room');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to permanently delete this room?')) return;
    try {
      await api.delete(`/rooms/${roomId}`);
      showNotification('Room deleted successfully');
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting room');
    }
  };

  // ----------------- RESTAURANT ACTIONS -----------------
  const handleOpenAddMenuItem = () => {
    setEditingMenuItem(null);
    setRestaurantFormData({
      name: '',
      category: 'Goan Seafood',
      description: '',
      price: '',
      image: '',
      isVeg: false,
      isChefSpecial: false,
      spicyLevel: 'Medium',
      available: true,
    });
    setRestaurantModalOpen(true);
  };

  const handleOpenEditMenuItem = (item) => {
    setEditingMenuItem(item);
    setRestaurantFormData({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      image: item.image,
      isVeg: !!item.isVeg,
      isChefSpecial: !!item.isChefSpecial,
      spicyLevel: item.spicyLevel || 'Medium',
      available: item.available !== false,
    });
    setRestaurantModalOpen(true);
  };

  const handleSaveMenuItem = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...restaurantFormData,
        price: Number(restaurantFormData.price),
      };

      if (editingMenuItem) {
        await api.put(`/restaurant/${editingMenuItem._id}`, payload);
        showNotification('Menu item updated successfully');
      } else {
        await api.post('/restaurant', payload);
        showNotification('New menu item added to Restaurant & Bar');
      }

      setRestaurantModalOpen(false);
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving menu item');
    }
  };

  const handleDeleteMenuItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    try {
      await api.delete(`/restaurant/${id}`);
      showNotification('Menu item removed successfully');
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting menu item');
    }
  };

  // ----------------- PACKAGE ACTIONS -----------------
  const handleOpenAddPackage = () => {
    setEditingPackage(null);
    setPackageFormData({
      title: '',
      category: 'Honeymoon',
      duration: '3 Nights / 4 Days',
      price: '',
      discountPrice: '',
      description: '',
      inclusions: 'Luxury Ocean Suite Stay, Daily Candlelight Beachside Dinner, Unlimited Spa & Couple Massage, Private Yacht Cruise at Sunset',
      image: '',
      featured: false,
      available: true,
    });
    setPackageModalOpen(true);
  };

  const handleOpenEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setPackageFormData({
      title: pkg.title,
      category: pkg.category,
      duration: pkg.duration,
      price: pkg.price,
      discountPrice: pkg.discountPrice || '',
      description: pkg.description,
      inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions.join(', ') : '',
      image: pkg.image,
      featured: !!pkg.featured,
      available: pkg.available !== false,
    });
    setPackageModalOpen(true);
  };

  const handleSavePackage = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...packageFormData,
        price: Number(packageFormData.price),
        discountPrice: packageFormData.discountPrice ? Number(packageFormData.discountPrice) : 0,
        inclusions: typeof packageFormData.inclusions === 'string'
          ? packageFormData.inclusions.split(',').map((s) => s.trim()).filter(Boolean)
          : packageFormData.inclusions,
      };

      if (editingPackage) {
        await api.put(`/packages/${editingPackage._id}`, payload);
        showNotification('Holiday package updated successfully');
      } else {
        await api.post('/packages', payload);
        showNotification('New holiday package published to website');
      }

      setPackageModalOpen(false);
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving holiday package');
    }
  };

  const handleDeletePackage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this holiday package?')) return;
    try {
      await api.delete(`/packages/${id}`);
      showNotification('Holiday package deleted successfully');
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting package');
    }
  };

  // ----------------- BOOKING STATUS ACTIONS -----------------
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    if (newStatus === 'Checked-Out') {
      const b = bookings.find((item) => item._id === bookingId);
      if (b) {
        setCheckoutConfirmModal(b);
        return;
      }
    }
    try {
      await api.put(`/bookings/${bookingId}/status`, { bookingStatus: newStatus });
      if (newStatus === 'Cancelled') {
        showNotification('Booking has been cancelled and moved to Cancellation section');
      } else if (newStatus === 'Confirmed') {
        showNotification('Booking has been confirmed and moved to Current Booking');
      } else {
        showNotification(`Booking status updated to ${newStatus}`);
      }
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status');
    }
  };

  const handleUpdatePaymentStatus = async (bookingId, newPaymentStatus) => {
    try {
      const finalStatus = newPaymentStatus === 'Paid' ? 'Paid' : 'Non Paid';
      await api.put(`/bookings/${bookingId}/status`, { paymentStatus: finalStatus });
      showNotification(`Payment status updated to ${finalStatus === 'Paid' ? 'Paid (UPI / Card)' : 'Non Pay (Pay Later)'}`);
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating payment status');
    }
  };

  const handleCheckOutBooking = async (booking) => {
    try {
      setIsCheckingOut(true);
      const res = await api.put(`/bookings/${booking._id}/checkout`);
      if (res.data?.success) {
        showNotification(`Guest ${booking.guestDetails?.name || 'Guest'} checked out! Rating message dispatched.`);
        setCheckoutConfirmModal(null);
        setCheckoutModalData({
          booking: res.data.booking,
          ratingDetails: res.data.ratingDetails,
        });
        fetchAllData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to check out guest reservation');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleResendRating = async (bookingId) => {
    try {
      setResendingId(bookingId);
      const res = await api.post(`/bookings/${bookingId}/resend-rating`);
      showNotification(res.data?.message || 'Rating message resent to registered mobile & email');
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error resending rating invitation');
    } finally {
      setResendingId(null);
    }
  };

  // ----------------- GALLERY ACTIONS -----------------
  const handleSaveGalleryItem = async (e) => {
    e.preventDefault();
    try {
      await api.post('/gallery', galleryFormData);
      showNotification('New photo added to Goa Resort gallery');
      setGalleryModalOpen(false);
      setGalleryFormData({ title: '', category: 'Beach', imageUrl: '', description: '' });
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding photo');
    }
  };

  const handleDeleteGalleryItem = async (id) => {
    if (!window.confirm('Remove this photo from the gallery?')) return;
    try {
      await api.delete(`/gallery/${id}`);
      showNotification('Photo removed');
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error removing photo');
    }
  };

  // ----------------- INQUIRY ACTIONS -----------------
  const handleUpdateInquiryStatus = async (inquiryId, status) => {
    try {
      await api.put(`/contact/${inquiryId}`, { status });
      showNotification(`Inquiry marked as ${status}`);
      fetchAllData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating inquiry');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Top Admin Navbar */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-500 to-gold-400 flex items-center justify-center text-ocean-950 shadow-md font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl font-bold text-white tracking-wide">
                Goa Resort Management Console
              </h1>
              <span className="text-[10px] bg-gold-400/20 text-gold-300 border border-gold-400/30 px-2 py-0.5 rounded font-mono font-semibold">
                ADMIN ACCESS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Live Backend Control Panel · Candolim, Goa
            </p>
          </div>
        </div>

        {/* Right buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAllData}
            title="Refresh All Data"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={onBackToSite}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-500 text-ocean-950 font-bold text-xs sm:text-sm shadow-md transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View Public Website</span>
          </button>

          <button
            onClick={() => {
              logout();
              onBackToSite();
            }}
            className="px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 text-xs font-semibold transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Notice Banner */}
      {notice && (
        <div className="bg-emerald-900/70 border-b border-emerald-600 px-6 py-2.5 text-xs text-emerald-200 font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      {/* Main Admin Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto scrollbar-none">
          {[
            { id: 'overview', label: 'Overview & Analytics', icon: BarChart3 },
            { id: 'rooms', label: `Rooms (${rooms.length})`, icon: Bed },
            { id: 'restaurant', label: `Restaurant Menu (${menuItems.length})`, icon: UtensilsCrossed },
            { id: 'packages', label: `Holiday Packages (${packages.length})`, icon: PackageOpen },
            { id: 'bookings', label: `Guest Bookings (${bookings.length})`, icon: CalendarCheck },
            { id: 'gallery', label: `Gallery (${gallery.length})`, icon: Image },
            { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  active
                    ? 'bg-gold-400 text-ocean-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & ANALYTICS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Total Revenue
                  </span>
                  <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-serif text-2xl font-bold text-white mt-1.5">
                  ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
                </p>
                <span className="text-[10px] text-emerald-400 font-semibold mt-1 block">
                  ● Real booking receipts
                </span>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Bookings
                  </span>
                  <div className="p-1.5 rounded-lg bg-gold-400/20 text-gold-400">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-serif text-2xl font-bold text-white mt-1.5">
                  {stats?.totalBookings || bookings.length}
                </p>
                <span className="text-[10px] text-gold-300 font-semibold mt-1 block">
                  {stats?.confirmedBookings || 0} Confirmed Stays
                </span>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Rooms
                  </span>
                  <div className="p-1.5 rounded-lg bg-ocean-500/20 text-ocean-400">
                    <Bed className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-serif text-2xl font-bold text-white mt-1.5">
                  {rooms.length}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Est. Occ: <strong className="text-gold-300">{stats?.occupancyRate || 85}%</strong>
                </span>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Restaurant
                  </span>
                  <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400">
                    <UtensilsCrossed className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-serif text-2xl font-bold text-white mt-1.5">
                  {menuItems.length}
                </p>
                <span className="text-[10px] text-orange-300 font-semibold mt-1 block">
                  Dishes & Beverages
                </span>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Packages
                  </span>
                  <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                    <PackageOpen className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-serif text-2xl font-bold text-white mt-1.5">
                  {packages.length}
                </p>
                <span className="text-[10px] text-purple-300 font-semibold mt-1 block">
                  Holiday Itineraries
                </span>
              </div>

              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Inquiries
                  </span>
                  <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
                    <Mail className="w-4 h-4" />
                  </div>
                </div>
                <p className="font-serif text-2xl font-bold text-white mt-1.5">
                  {inquiries.filter((i) => i.status === 'unread').length}
                </p>
                <span className="text-[10px] text-rose-300 mt-1 block">
                  Unread Messages
                </span>
              </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold text-white">Recent Guest Reservations</h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-xs text-gold-400 hover:underline"
                >
                  View All Bookings →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-400 border-b border-slate-700 uppercase tracking-wider">
                    <tr>
                      <th className="pb-3">Ref ID</th>
                      <th className="pb-3">Guest</th>
                      <th className="pb-3">Room</th>
                      <th className="pb-3">Dates</th>
                      <th className="pb-3">Total Paid</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {bookings.slice(0, 5).map((b) => (
                      <tr key={b._id} className="hover:bg-slate-700/30">
                        <td className="py-3 font-mono font-bold text-gold-300">
                          {b.bookingReference}
                        </td>
                        <td className="py-3">
                          <span className="font-semibold text-white block">
                            {b.guestDetails?.name}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {b.guestDetails?.email}
                          </span>
                        </td>
                        <td className="py-3 text-slate-200">{b.room?.name || 'Luxury Room'}</td>
                        <td className="py-3 text-slate-300">
                          {new Date(b.checkIn).toLocaleDateString()} -{' '}
                          {new Date(b.checkOut).toLocaleDateString()}
                        </td>
                        <td className="py-3 font-bold text-emerald-400">
                          <span>₹{b.totalAmount?.toLocaleString('en-IN')}</span>
                          <span
                            className={`block text-[9px] font-bold mt-0.5 ${
                              b.paymentStatus === 'Paid' ? 'text-emerald-400' : 'text-gold-400'
                            }`}
                          >
                            {b.paymentStatus === 'Paid' ? '✓ Paid' : '⏳ Non Pay'}
                          </span>
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              b.bookingStatus === 'Confirmed'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : b.bookingStatus === 'Cancelled'
                                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                                : 'bg-gold-400/20 text-gold-300 border border-gold-400/40'
                            }`}
                          >
                            {b.bookingStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick action cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <button
                onClick={handleOpenAddRoom}
                className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-all group flex flex-col justify-between"
              >
                <div className="p-2 w-fit rounded-xl bg-gold-400/20 text-gold-400 group-hover:scale-110 transition-transform mb-3">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-gold-300 transition-colors">
                    + Add Room
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Configure pricing & amenities
                  </p>
                </div>
              </button>

              <button
                onClick={handleOpenAddMenuItem}
                className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-all group flex flex-col justify-between"
              >
                <div className="p-2 w-fit rounded-xl bg-orange-400/20 text-orange-400 group-hover:scale-110 transition-transform mb-3">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-gold-300 transition-colors">
                    + Add Menu Item
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Seafood, grills, cocktails & dessert
                  </p>
                </div>
              </button>

              <button
                onClick={handleOpenAddPackage}
                className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-all group flex flex-col justify-between"
              >
                <div className="p-2 w-fit rounded-xl bg-purple-400/20 text-purple-400 group-hover:scale-110 transition-transform mb-3">
                  <PackageOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-gold-300 transition-colors">
                    + Add Package
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Honeymoon, spa & family bundles
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  setGalleryModalOpen(true);
                  setActiveTab('gallery');
                }}
                className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-all group flex flex-col justify-between"
              >
                <div className="p-2 w-fit rounded-xl bg-ocean-400/20 text-ocean-400 group-hover:scale-110 transition-transform mb-3">
                  <Image className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-gold-300 transition-colors">
                    + Add Photo
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Showcase beachfront & pools
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('inquiries')}
                className="p-4 rounded-2xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-left transition-all group flex flex-col justify-between"
              >
                <div className="p-2 w-fit rounded-xl bg-gold-400/20 text-gold-400 group-hover:scale-110 transition-transform mb-3">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm group-hover:text-gold-300 transition-colors">
                    Inquiries
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {inquiries.filter((i) => i.status === 'unread').length} unread customer messages
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: ROOMS CONTROL */}
        {activeTab === 'rooms' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Goa Resort Rooms & Suites</h3>
                <p className="text-xs text-slate-400">
                  Manage inventory, nightly rates, capacity, and photos displayed on the frontend.
                </p>
              </div>

              <button
                onClick={handleOpenAddRoom}
                className="px-4 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-500 text-ocean-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Room</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-44">
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 px-2.5 py-1 rounded-md text-[10px] text-gold-300 font-bold">
                      {room.roomType}
                    </div>
                    {room.featured && (
                      <div className="absolute top-3 right-3 bg-gold-400 text-ocean-950 px-2 py-0.5 rounded text-[10px] font-bold">
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-white text-base line-clamp-1">
                        {room.name}
                      </h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                        {room.shortDescription || room.description}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-xs text-slate-300 border-t border-slate-700/60 pt-2">
                        <span>Max Guests: <strong>{room.capacity.maxGuests}</strong></span>
                        <span>Size: <strong>{room.sizeSqFt} sq ft</strong></span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                      <div>
                        <span className="font-serif text-lg font-bold text-gold-300">
                          ₹{(room.discountPrice || room.pricePerNight).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400"> / night</span>
                      </div>

                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleOpenEditRoom(room)}
                          className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                          title="Edit Room"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room._id)}
                          className="p-2 rounded-lg bg-red-900/50 hover:bg-red-800 text-red-200 transition-colors"
                          title="Delete Room"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: RESTAURANT MENU CONTROL */}
        {activeTab === 'restaurant' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <span>Goa Resort Restaurant & Bar</span>
                  <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    {menuItems.length} Dishes & Drinks
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Manage signature seafood, cocktails, live grill specialties, and desserts displayed to guests.
                </p>
              </div>

              <button
                onClick={handleOpenAddMenuItem}
                className="px-4 py-2.5 rounded-xl bg-orange-400 hover:bg-orange-500 text-ocean-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Menu Item</span>
              </button>
            </div>

            {menuItems.length === 0 ? (
              <div className="p-12 text-center bg-slate-800/80 rounded-2xl border border-slate-700 text-slate-400">
                <UtensilsCrossed className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                <p className="font-semibold text-white">No menu items found</p>
                <p className="text-xs mt-1">Click "Add Menu Item" above to populate the resort dining menu.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {menuItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative h-44">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] text-gold-300 font-bold border border-white/10">
                          {item.category}
                        </span>
                        {item.isVeg ? (
                          <span className="bg-emerald-950/90 text-emerald-300 border border-emerald-500/50 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span> Veg
                          </span>
                        ) : (
                          <span className="bg-red-950/90 text-red-300 border border-red-500/50 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block"></span> Non-Veg
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-1">
                        {item.isChefSpecial && (
                          <span className="bg-gradient-to-r from-gold-400 to-gold-500 text-ocean-950 px-2 py-0.5 rounded text-[10px] font-bold shadow-md flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> Chef's Special
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif font-bold text-white text-base line-clamp-1">
                            {item.name}
                          </h4>
                          <span className="text-[11px] text-gold-400 font-semibold shrink-0">
                            🌶️ {item.spicyLevel}
                          </span>
                        </div>

                        <p className="text-xs text-slate-400 line-clamp-2 mt-1.5">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                        <div>
                          <span className="font-serif text-lg font-bold text-gold-300">
                            ₹{item.price?.toLocaleString('en-IN')}
                          </span>
                          <span className={`text-[10px] ml-2 px-1.5 py-0.5 rounded font-semibold ${
                            item.available ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'
                          }`}>
                            {item.available ? 'In Stock' : 'Unavailable'}
                          </span>
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleOpenEditMenuItem(item)}
                            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                            title="Edit Item"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteMenuItem(item._id)}
                            className="p-2 rounded-lg bg-red-900/50 hover:bg-red-800 text-red-200 transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: HOLIDAY PACKAGES CONTROL */}
        {activeTab === 'packages' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-white flex items-center gap-2">
                  <span>Goa Resort Holiday Packages</span>
                  <span className="text-xs font-sans px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {packages.length} Packages
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Manage all-inclusive luxury vacation packages, honeymoons, wellness retreats, and weekend getaways.
                </p>
              </div>

              <button
                onClick={handleOpenAddPackage}
                className="px-4 py-2.5 rounded-xl bg-purple-400 hover:bg-purple-500 text-ocean-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Package</span>
              </button>
            </div>

            {packages.length === 0 ? (
              <div className="p-12 text-center bg-slate-800/80 rounded-2xl border border-slate-700 text-slate-400">
                <PackageOpen className="w-10 h-10 mx-auto mb-2 text-slate-600" />
                <p className="font-semibold text-white">No packages found</p>
                <p className="text-xs mt-1">Click "Add Package" above to launch holiday bundle offerings.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {packages.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative h-44">
                      <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] text-purple-300 font-bold border border-white/10">
                          {pkg.category}
                        </span>
                        <span className="bg-ocean-950/80 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] text-gold-300 font-semibold border border-white/10 flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" /> {pkg.duration}
                        </span>
                      </div>

                      {pkg.featured && (
                        <div className="absolute top-3 right-3 bg-gold-400 text-ocean-950 px-2 py-0.5 rounded text-[10px] font-bold">
                          Featured
                        </div>
                      )}
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-white text-base line-clamp-1">
                          {pkg.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                          {pkg.description}
                        </p>

                        {/* Inclusions summary */}
                        <div className="mt-3 border-t border-slate-700/60 pt-2 space-y-1">
                          <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                            Included Highlights:
                          </p>
                          <ul className="text-xs text-slate-300 space-y-0.5">
                            {pkg.inclusions?.slice(0, 3).map((inc, i) => (
                              <li key={i} className="line-clamp-1 text-[11px] flex items-center gap-1.5">
                                <span className="text-gold-400">✓</span> {inc}
                              </li>
                            ))}
                            {pkg.inclusions?.length > 3 && (
                              <li className="text-[10px] text-slate-400 italic">
                                + {pkg.inclusions.length - 3} more perks
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between">
                        <div>
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-serif text-lg font-bold text-gold-300">
                              ₹{(pkg.discountPrice || pkg.price)?.toLocaleString('en-IN')}
                            </span>
                            {pkg.discountPrice && pkg.discountPrice < pkg.price && (
                              <span className="text-[10px] text-slate-400 line-through">
                                ₹{pkg.price.toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 block">Total per couple / package</span>
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            onClick={() => handleOpenEditPackage(pkg)}
                            className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
                            title="Edit Package"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePackage(pkg._id)}
                            className="p-2 rounded-lg bg-red-900/50 hover:bg-red-800 text-red-200 transition-colors"
                            title="Delete Package"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: BOOKINGS CONTROL (CURRENT BOOKING & BOOKING HISTORY) */}
        {activeTab === 'bookings' && (
          <div className="space-y-5">
            {/* Header & Section Navigation */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-800/60 p-4 sm:p-5 rounded-2xl border border-slate-700">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-gold-400/20 text-gold-300 border border-gold-400/30">
                    <CalendarCheck className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                      Guest Reservations & Front Desk
                    </h3>
                    <p className="text-xs text-slate-400">
                      Manage active in-house stays, receptionist checkout flow, automated rating messaging & stay history.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 SECTIONS SWITCHER: CURRENT BOOKING, CANCELLATION & BOOKING HISTORY */}
              <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700/80 self-start sm:self-auto flex-wrap">
                <button
                  type="button"
                  onClick={() => setBookingSubTab('current')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    bookingSubTab === 'current'
                      ? 'bg-gold-400 text-ocean-950 shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Current Booking</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      bookingSubTab === 'current'
                        ? 'bg-ocean-950 text-gold-300'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {currentBookings.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setBookingSubTab('cancellation')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    bookingSubTab === 'cancellation'
                      ? 'bg-red-500 text-white shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Cancellation</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      bookingSubTab === 'cancellation'
                        ? 'bg-red-950 text-red-200'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {cancelledBookings.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setBookingSubTab('history')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    bookingSubTab === 'history'
                      ? 'bg-gold-400 text-ocean-950 shadow-md font-extrabold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Booking History</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      bookingSubTab === 'history'
                        ? 'bg-ocean-950 text-gold-300'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {historyBookings.length}
                  </span>
                </button>
              </div>
            </div>

            {/* Filter / Search Bar & Quick Context */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search by Guest Name, Mobile, Email, Ref..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-gold-400"
                />
              </div>

              {bookingSubTab === 'current' ? (
                <div className="text-[11px] text-gold-300 bg-gold-950/40 border border-gold-600/30 px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Click <strong>Check Out</strong> on guest departure to send rating message to registered mobile & email.
                  </span>
                </div>
              ) : bookingSubTab === 'cancellation' ? (
                <div className="text-[11px] text-red-300 bg-red-950/40 border border-red-600/30 px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <XCircle className="w-3.5 h-3.5 shrink-0 text-red-400" />
                  <span>
                    Cancelled bookings archive (cancelled by guests or hotel staff). Removed from active front desk stays.
                  </span>
                </div>
              ) : (
                <div className="text-[11px] text-emerald-300 bg-emerald-950/40 border border-emerald-600/30 px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <CheckCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    Archive of checked-out guests with automated rating delivery logs & profile records.
                  </span>
                </div>
              )}
            </div>

            {/* 1. CURRENT BOOKING SECTION */}
            {bookingSubTab === 'current' && (
              <div className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider border-b border-slate-700">
                      <tr>
                        <th className="p-3.5">Booking Ref</th>
                        <th className="p-3.5">Guest Info</th>
                        <th className="p-3.5">Room Reserved</th>
                        <th className="p-3.5">Dates & Nights</th>
                        <th className="p-3.5">Total Amount</th>
                        {/* BLUE MARK POSITION: CHECK OUT BUTTON */}
                        <th className="p-3.5 text-center">Check Out</th>
                        <th className="p-3.5">Status Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {filteredCurrentBookings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400">
                            <Clock className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                            <p className="font-semibold text-slate-300">No active current bookings found</p>
                            <p className="text-[11px] text-slate-500 mt-1">
                              New guest reservations will automatically appear here.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredCurrentBookings.map((b) => {
                          const guestPhone = b.guestDetails?.phone || b.user?.phone || 'Not Provided';
                          const guestEmail = b.guestDetails?.email || b.user?.email || 'Not Provided';
                          return (
                            <tr key={b._id} className="hover:bg-slate-700/30 transition-colors">
                              <td className="p-3.5 font-mono font-bold text-gold-300">
                                {b.bookingReference}
                              </td>
                              <td className="p-3.5">
                                <p className="font-semibold text-white">{b.guestDetails?.name || b.user?.name}</p>
                                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                  <Mail className="w-3 h-3 text-slate-400" />
                                  <span>{guestEmail}</span>
                                </p>
                                <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                                  <Smartphone className="w-3 h-3 text-emerald-400" />
                                  <span>{guestPhone}</span>
                                </p>
                                {b.guestDetails?.specialRequests && (
                                  <span className="text-[10px] text-gold-300 block italic mt-1 bg-gold-950/40 px-2 py-0.5 rounded border border-gold-500/20 max-w-xs">
                                    Req: {b.guestDetails.specialRequests}
                                  </span>
                                )}
                              </td>
                              <td className="p-3.5">
                                <p className="text-slate-200 font-semibold">{b.room?.name || 'Room'}</p>
                                <span className="text-[10px] text-slate-400">{b.room?.roomType}</span>
                              </td>
                              <td className="p-3.5 text-slate-300">
                                <p>
                                  {new Date(b.checkIn).toLocaleDateString()} to{' '}
                                  {new Date(b.checkOut).toLocaleDateString()}
                                </p>
                                <span className="text-[11px] text-slate-400">{b.totalNights} Nights</span>
                              </td>
                              <td className="p-3.5">
                                <span className="font-bold text-emerald-400 text-sm block">
                                  ₹{b.totalAmount?.toLocaleString('en-IN')}
                                </span>
                                
                                {/* Payment Status Option Selector: Paid (UPI / Card) vs Non Pay (Pay Later) */}
                                <div className="mt-1 flex items-center gap-1.5">
                                  <select
                                    value={b.paymentStatus === 'Paid' ? 'Paid' : 'Non Pay'}
                                    onChange={(e) => handleUpdatePaymentStatus(b._id, e.target.value)}
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border focus:outline-none cursor-pointer transition-all ${
                                      b.paymentStatus === 'Paid'
                                        ? 'bg-emerald-950 text-emerald-300 border-emerald-600/80 hover:bg-emerald-900/80 shadow-xs'
                                        : 'bg-gold-950 text-gold-300 border-gold-600/80 hover:bg-gold-900/80 shadow-xs'
                                    }`}
                                    title="Booking Payment Option: Paid (UPI / Card) or Non Pay (Pay Later)"
                                  >
                                    <option value="Paid">✓ Paid</option>
                                    <option value="Non Pay">⏳ Non Pay</option>
                                  </select>

                                  <span className="text-[10px] text-slate-400 block truncate max-w-[100px]" title={b.paymentMethod}>
                                    {b.paymentStatus === 'Paid' 
                                      ? (b.paymentMethod?.includes('UPI') ? 'UPI' : b.paymentMethod?.includes('Card') ? 'Card' : 'UPI/Card')
                                      : 'Pay Later'}
                                  </span>
                                </div>
                              </td>

                              {/* BLUE MARK POSITION: Prominent Receptionist Check Out Button */}
                              <td className="p-3.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => setCheckoutConfirmModal(b)}
                                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-gold-300 via-gold-400 to-gold-500 hover:from-gold-400 hover:to-gold-600 text-slate-950 font-bold text-xs shadow-md hover:shadow-gold-500/20 flex items-center justify-center gap-1.5 transition-all transform hover:scale-[1.03] cursor-pointer whitespace-nowrap mx-auto"
                                  title="Check Out Guest and automatically send rating message to registered mobile and email"
                                >
                                  <LogOut className="w-3.5 h-3.5 text-slate-950" />
                                  <span>Check Out</span>
                                </button>
                              </td>

                              <td className="p-3.5">
                                <select
                                  value={b.bookingStatus}
                                  onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)}
                                  className={`py-1 px-2 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer border ${
                                    b.bookingStatus === 'Confirmed'
                                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                      : b.bookingStatus === 'Cancelled'
                                      ? 'bg-red-950 text-red-300 border-red-700'
                                      : 'bg-gold-950 text-gold-300 border-gold-700'
                                  }`}
                                >
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Pending">Pending</option>
                                  <option value="Checked-Out">Check Out Guest</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. CANCELLATION SECTION */}
            {bookingSubTab === 'cancellation' && (
              <div className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider border-b border-slate-700">
                      <tr>
                        <th className="p-3.5">Booking Ref</th>
                        <th className="p-3.5">Guest Info</th>
                        <th className="p-3.5">Room Cancelled</th>
                        <th className="p-3.5">Dates & Nights</th>
                        <th className="p-3.5">Total Amount</th>
                        <th className="p-3.5 text-center">Cancellation Status</th>
                        <th className="p-3.5">Status Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {filteredCancelledBookings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-400">
                            <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2 opacity-50" />
                            <p className="font-semibold text-slate-300">No cancelled reservations found</p>
                            <p className="text-[11px] text-slate-500 mt-1">
                              Bookings cancelled by guests or front desk staff will automatically appear here.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredCancelledBookings.map((b) => {
                          const guestPhone = b.guestDetails?.phone || b.user?.phone || 'Not Provided';
                          const guestEmail = b.guestDetails?.email || b.user?.email || 'Not Provided';
                          return (
                            <tr key={b._id} className="hover:bg-slate-700/30 transition-colors">
                              <td className="p-3.5">
                                <span className="font-mono font-bold text-red-300 block">
                                  {b.bookingReference}
                                </span>
                                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-700">
                                  <XCircle className="w-3 h-3 text-red-400" />
                                  Cancelled
                                </span>
                              </td>
                              <td className="p-3.5">
                                <p className="font-semibold text-white">{b.guestDetails?.name || b.user?.name}</p>
                                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                  <Mail className="w-3 h-3 text-slate-400" />
                                  <span>{guestEmail}</span>
                                </p>
                                <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                                  <Smartphone className="w-3 h-3 text-emerald-400" />
                                  <span>{guestPhone}</span>
                                </p>
                                {b.guestDetails?.specialRequests && (
                                  <span className="text-[10px] text-gold-300 block italic mt-1 bg-gold-950/40 px-2 py-0.5 rounded border border-gold-500/20 max-w-xs">
                                    Req: {b.guestDetails.specialRequests}
                                  </span>
                                )}
                              </td>
                              <td className="p-3.5">
                                <p className="text-white font-semibold">{b.room?.name || 'Luxury Room'}</p>
                                <span className="text-[11px] text-slate-400">{b.room?.roomType || 'Resort Stay'}</span>
                              </td>
                              <td className="p-3.5">
                                <p className="text-slate-200 font-medium">
                                  {new Date(b.checkIn).toLocaleDateString()} to {new Date(b.checkOut).toLocaleDateString()}
                                </p>
                                <span className="text-[11px] text-gold-300 font-semibold">{b.totalNights} Nights</span>
                              </td>
                              <td className="p-3.5">
                                <span className="font-bold text-slate-300 text-sm block">
                                  ₹{b.totalAmount?.toLocaleString('en-IN')}
                                </span>
                                <div className="mt-1 flex items-center gap-1.5">
                                  <span
                                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                      b.paymentStatus === 'Paid'
                                        ? 'bg-emerald-950 text-emerald-300 border-emerald-600/80'
                                        : 'bg-gold-950 text-gold-300 border-gold-600/80'
                                    }`}
                                  >
                                    {b.paymentStatus === 'Paid' ? '✓ Paid' : '⏳ Non Pay'}
                                  </span>
                                  <span className="text-[10px] text-slate-400 block truncate max-w-[100px]">
                                    {b.paymentMethod || 'Pay Later'}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3.5 text-center">
                                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-950/80 text-red-300 border border-red-700/80 inline-flex items-center gap-1.5">
                                  <XCircle className="w-3.5 h-3.5 text-red-400" />
                                  <span>Booking Voided</span>
                                </span>
                              </td>
                              <td className="p-3.5">
                                <div className="flex flex-col gap-1">
                                  <select
                                    value={b.bookingStatus}
                                    onChange={(e) => handleUpdateBookingStatus(b._id, e.target.value)}
                                    className="py-1 px-2 rounded-lg text-xs font-semibold focus:outline-none cursor-pointer border bg-slate-900 text-slate-200 border-slate-700 hover:border-gold-400 transition-colors"
                                    title="Reactivate reservation or keep cancelled"
                                  >
                                    <option value="Cancelled">Cancelled</option>
                                    <option value="Confirmed">Reactivate (Confirmed)</option>
                                    <option value="Pending">Move to Pending</option>
                                  </select>
                                  <span className="text-[10px] text-slate-400">Reactivate to restore stay</span>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. BOOKING HISTORY SECTION */}
            {bookingSubTab === 'history' && (
              <div className="bg-slate-800/90 rounded-2xl border border-slate-700 overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider border-b border-slate-700">
                      <tr>
                        <th className="p-3.5">Booking Ref</th>
                        <th className="p-3.5">Guest Info (Registered Profile)</th>
                        <th className="p-3.5">Room & Stay</th>
                        <th className="p-3.5">Total Paid</th>
                        <th className="p-3.5">Checked-Out Time</th>
                        <th className="p-3.5 text-center">Rating Notification & Logs</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {filteredHistoryBookings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400">
                            <History className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
                            <p className="font-semibold text-slate-300">No checked-out booking history yet</p>
                            <p className="text-[11px] text-slate-500 mt-1">
                              When you check out a guest from Current Booking, their complete stay record and rating logs will appear here.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredHistoryBookings.map((b) => {
                          const guestPhone = b.guestDetails?.phone || b.user?.phone || 'Not Provided';
                          const guestEmail = b.guestDetails?.email || b.user?.email || 'Not Provided';
                          const checkoutTime = b.checkedOutAt
                            ? new Date(b.checkedOutAt).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : 'Completed Stay';

                          return (
                            <tr key={b._id} className="hover:bg-slate-700/30 transition-colors">
                              <td className="p-3.5">
                                <span className="font-mono font-bold text-gold-300 block">
                                  {b.bookingReference}
                                </span>
                                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                                  <CheckCheck className="w-3 h-3 text-emerald-400" />
                                  Checked-Out
                                </span>
                              </td>
                              <td className="p-3.5">
                                <p className="font-semibold text-white">{b.guestDetails?.name || b.user?.name}</p>
                                <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                  <Mail className="w-3 h-3 text-slate-400" />
                                  <span>{guestEmail}</span>
                                </p>
                                <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
                                  <Smartphone className="w-3 h-3 text-emerald-400" />
                                  <span>{guestPhone}</span>
                                </p>
                              </td>
                              <td className="p-3.5">
                                <p className="text-slate-200 font-semibold">{b.room?.name || 'Luxury Suite'}</p>
                                <p className="text-[11px] text-slate-400">
                                  {new Date(b.checkIn).toLocaleDateString()} to{' '}
                                  {new Date(b.checkOut).toLocaleDateString()} ({b.totalNights}N)
                                </p>
                              </td>
                              <td className="p-3.5">
                                <span className="font-bold text-emerald-400 text-sm block">
                                  ₹{b.totalAmount?.toLocaleString('en-IN')}
                                </span>
                                <div className="mt-1 flex items-center gap-1.5">
                                  <span
                                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                      b.paymentStatus === 'Paid'
                                        ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                                        : 'bg-gold-950 text-gold-300 border-gold-600'
                                    }`}
                                  >
                                    {b.paymentStatus === 'Paid' ? '✓ Paid' : '⏳ Non Pay'}
                                  </span>
                                  <span className="text-[10px] text-slate-400 block truncate max-w-[100px]" title={b.paymentMethod}>
                                    {b.paymentStatus === 'Paid'
                                      ? (b.paymentMethod?.includes('UPI') ? 'UPI' : b.paymentMethod?.includes('Card') ? 'Card' : 'UPI/Card')
                                      : 'Pay Later'}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3.5 text-slate-300">
                                <div className="flex items-center gap-1 text-[11px]">
                                  <Clock className="w-3 h-3 text-gold-400" />
                                  <span>{checkoutTime}</span>
                                </div>
                              </td>

                              {/* RATING DISPATCH & LOGS */}
                              <td className="p-3.5 text-center">
                                <div className="flex flex-col items-center gap-1.5">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-700">
                                    <Send className="w-2.5 h-2.5 text-purple-400" />
                                    <span>Rating Sent (SMS & Email)</span>
                                  </span>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setViewRatingMsgModal(b)}
                                      className="px-2 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer"
                                      title="View dispatched rating message"
                                    >
                                      <Eye className="w-3 h-3" />
                                      <span>Message</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleResendRating(b._id)}
                                      disabled={resendingId === b._id}
                                      className="px-2 py-1 rounded-lg bg-gold-400/20 hover:bg-gold-400/30 text-gold-300 border border-gold-400/40 text-[11px] font-medium flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                                      title="Resend rating invitation to registered mobile & email"
                                    >
                                      <RefreshCw className={`w-3 h-3 ${resendingId === b._id ? 'animate-spin' : ''}`} />
                                      <span>Resend</span>
                                    </button>
                                  </div>

                                  {b.guestRating?.score && (
                                    <span className="text-[10px] text-gold-400 font-bold flex items-center gap-0.5">
                                      <Star className="w-3 h-3 fill-gold-400 text-gold-400" />
                                      <span>{b.guestRating.score}/5 Given</span>
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: GALLERY CONTROL */}
        {activeTab === 'gallery' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">Resort Photo Gallery</h3>
                <p className="text-xs text-slate-400">
                  Add or delete images showcased in the public gallery section.
                </p>
              </div>

              <button
                onClick={() => setGalleryModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-500 text-ocean-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((item) => (
                <div
                  key={item._id}
                  className="group relative rounded-xl overflow-hidden bg-slate-800 border border-slate-700 h-48"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent p-3 flex flex-col justify-end">
                    <span className="text-[10px] text-gold-300 uppercase font-semibold">
                      {item.category}
                    </span>
                    <p className="font-semibold text-white text-xs truncate">{item.title}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteGalleryItem(item._id)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-900/80 hover:bg-red-800 text-white transition-colors"
                    title="Delete Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: INQUIRIES CONTROL */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            <div>
              <h3 className="font-serif text-xl font-bold text-white">Guest Messages & Inquiries</h3>
              <p className="text-xs text-slate-400">
                Inquiries submitted via the Contact Us form on the public website.
              </p>
            </div>

            <div className="space-y-3">
              {inquiries.length === 0 ? (
                <div className="p-8 text-center bg-slate-800 rounded-2xl text-slate-400 text-sm">
                  No inquiries received yet.
                </div>
              ) : (
                inquiries.map((inq) => (
                  <div
                    key={inq._id}
                    className={`p-5 rounded-2xl border transition-all ${
                      inq.status === 'unread'
                        ? 'bg-slate-800 border-gold-400/40 shadow-md'
                        : 'bg-slate-800/50 border-slate-700'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
                      <div>
                        <span className="font-bold text-white text-sm">{inq.name}</span>
                        <span className="text-xs text-slate-400 ml-2">({inq.email})</span>
                        {inq.phone && (
                          <span className="text-xs text-slate-400 ml-2">· {inq.phone}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-gold-300 font-semibold px-2 py-0.5 rounded bg-gold-400/10 border border-gold-400/20">
                          {inq.subject}
                        </span>
                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateInquiryStatus(inq._id, e.target.value)}
                          className="bg-slate-900 text-xs px-2 py-1 rounded border border-slate-700 text-slate-200"
                        >
                          <option value="unread">Unread</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                        </select>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-700/60">
                      "{inq.message}"
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ADD / EDIT ROOM */}
      <AnimatePresence>
        {roomModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-2xl w-full bg-[#F1F3F5] border border-slate-300 rounded-3xl p-6 sm:p-8 my-8 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setRoomModalOpen(false)}
                className="absolute top-5 right-5 text-slate-500 hover:text-slate-800 bg-slate-200/80 hover:bg-slate-300 rounded-full w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4">
                {editingRoom ? 'Edit Room Details' : 'Add New Goa Resort Room'}
              </h3>

              <form onSubmit={handleSaveRoom} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Room Name</label>
                  <input
                    type="text"
                    required
                    value={roomFormData.name}
                    onChange={(e) => setRoomFormData({ ...roomFormData, name: e.target.value })}
                    placeholder="e.g. Sunset Ocean Panorama Suite"
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Room Type</label>
                    <select
                      value={roomFormData.roomType}
                      onChange={(e) => setRoomFormData({ ...roomFormData, roomType: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs cursor-pointer"
                    >
                      <option value="Deluxe Room">Deluxe Room</option>
                      <option value="Super Deluxe">Super Deluxe</option>
                      <option value="Ocean Suite">Ocean Suite</option>
                      <option value="Royal Villa">Royal Villa</option>
                      <option value="Beachfront Cottage">Beachfront Cottage</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Price Per Night (₹)</label>
                    <input
                      type="number"
                      required
                      value={roomFormData.pricePerNight}
                      onChange={(e) => setRoomFormData({ ...roomFormData, pricePerNight: e.target.value })}
                      placeholder="12000"
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Discount Price (₹)</label>
                    <input
                      type="number"
                      value={roomFormData.discountPrice}
                      onChange={(e) => setRoomFormData({ ...roomFormData, discountPrice: e.target.value })}
                      placeholder="Optional"
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Size (sq ft)</label>
                    <input
                      type="number"
                      value={roomFormData.sizeSqFt}
                      onChange={(e) => setRoomFormData({ ...roomFormData, sizeSqFt: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Max Guests</label>
                    <input
                      type="number"
                      value={roomFormData.capacity.maxGuests}
                      onChange={(e) =>
                        setRoomFormData({
                          ...roomFormData,
                          capacity: { ...roomFormData.capacity, maxGuests: Number(e.target.value) },
                        })
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Detailed Description</label>
                  <textarea
                    rows={3}
                    required
                    value={roomFormData.description}
                    onChange={(e) => setRoomFormData({ ...roomFormData, description: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs"
                  />
                </div>

                {/* Direct Select Image from File Manager with top-right 'x' button */}
                <ImageSelector
                  label="Primary Room Photo"
                  value={typeof roomFormData.images === 'string' ? roomFormData.images.split(',')[0]?.trim() || '' : (Array.isArray(roomFormData.images) ? roomFormData.images[0] || '' : '')}
                  onChange={(url) => setRoomFormData({ ...roomFormData, images: url })}
                  required
                />

                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">
                    Amenities (comma separated)
                  </label>
                  <input
                    type="text"
                    value={roomFormData.amenities}
                    onChange={(e) => setRoomFormData({ ...roomFormData, amenities: e.target.value })}
                    placeholder="Ocean View Balcony, King Size Bed, Free High-speed Wi-Fi"
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="featuredCheckbox"
                    checked={roomFormData.featured}
                    onChange={(e) => setRoomFormData({ ...roomFormData, featured: e.target.checked })}
                    className="w-4 h-4 text-gold-500 rounded cursor-pointer"
                  />
                  <label htmlFor="featuredCheckbox" className="text-slate-700 font-medium cursor-pointer">
                    Feature this room prominently on home page
                  </label>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setRoomModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-500 text-ocean-950 font-bold shadow-md cursor-pointer"
                  >
                    Save Room
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD GALLERY PHOTO */}
      <AnimatePresence>
        {galleryModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-md w-full bg-[#F1F3F5] border border-slate-300 rounded-3xl p-6 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setGalleryModalOpen(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 bg-slate-200/80 hover:bg-slate-300 rounded-full w-7 h-7 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-serif text-xl font-bold text-slate-900 mb-4">Add Photo to Gallery</h3>

              <form onSubmit={handleSaveGalleryItem} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={galleryFormData.title}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, title: e.target.value })}
                    placeholder="e.g. Sunset Over Candolim Deck"
                    className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Category</label>
                  <select
                    value={galleryFormData.category}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, category: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs cursor-pointer"
                  >
                    <option value="Beach">Beach</option>
                    <option value="Suites">Suites</option>
                    <option value="Dining">Dining</option>
                    <option value="Spa & Pool">Spa & Pool</option>
                    <option value="Sunset & Vibe">Sunset & Vibe</option>
                  </select>
                </div>

                {/* Direct Select Image from File Manager with top-right 'x' button */}
                <ImageSelector
                  label="Image (File Manager / URL)"
                  value={galleryFormData.imageUrl}
                  onChange={(url) => setGalleryFormData({ ...galleryFormData, imageUrl: url })}
                  required
                />

                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Description</label>
                  <input
                    type="text"
                    value={galleryFormData.description}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, description: e.target.value })}
                    placeholder="Brief caption"
                    className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setGalleryModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gold-400 hover:bg-gold-500 text-ocean-950 font-bold shadow-md cursor-pointer"
                  >
                    Upload Photo
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD / EDIT RESTAURANT MENU ITEM */}
      <AnimatePresence>
        {restaurantModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-lg w-full bg-[#F1F3F5] border border-slate-300 rounded-3xl p-6 sm:p-8 my-8 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setRestaurantModalOpen(false)}
                className="absolute top-5 right-5 text-slate-500 hover:text-slate-800 bg-slate-200/80 hover:bg-slate-300 rounded-full w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4">
                {editingMenuItem ? 'Edit Menu Item' : 'Add Dish / Beverage'}
              </h3>

              <form onSubmit={handleSaveMenuItem} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Item Name</label>
                  <input
                    type="text"
                    required
                    value={restaurantFormData.name}
                    onChange={(e) => setRestaurantFormData({ ...restaurantFormData, name: e.target.value })}
                    placeholder="e.g. Goan Butter Garlic Tiger Prawns"
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Category</label>
                    <select
                      value={restaurantFormData.category}
                      onChange={(e) => setRestaurantFormData({ ...restaurantFormData, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs cursor-pointer"
                    >
                      <option value="Goan Seafood">Goan Seafood</option>
                      <option value="Starters">Starters</option>
                      <option value="Grill & BBQ">Grill & BBQ</option>
                      <option value="Main Course">Main Course</option>
                      <option value="Cocktails & Beverages">Cocktails & Beverages</option>
                      <option value="Desserts">Desserts</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={restaurantFormData.price}
                      onChange={(e) => setRestaurantFormData({ ...restaurantFormData, price: e.target.value })}
                      placeholder="850"
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Spicy Level</label>
                    <select
                      value={restaurantFormData.spicyLevel}
                      onChange={(e) => setRestaurantFormData({ ...restaurantFormData, spicyLevel: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs cursor-pointer"
                    >
                      <option value="Mild">Mild</option>
                      <option value="Medium">Medium</option>
                      <option value="Spicy">Spicy</option>
                      <option value="Extra Spicy">Extra Spicy</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Dietary Type</label>
                    <div className="flex items-center gap-4 pt-2">
                      <label className="flex items-center gap-1.5 text-slate-700 font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="isVeg"
                          checked={restaurantFormData.isVeg}
                          onChange={() => setRestaurantFormData({ ...restaurantFormData, isVeg: true })}
                          className="text-emerald-500 cursor-pointer"
                        />
                        <span>Veg</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-slate-700 font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="isVeg"
                          checked={!restaurantFormData.isVeg}
                          onChange={() => setRestaurantFormData({ ...restaurantFormData, isVeg: false })}
                          className="text-red-500 cursor-pointer"
                        />
                        <span>Non-Veg</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Direct Select Image from File Manager with top-right 'x' button */}
                <ImageSelector
                  label="Dish / Beverage Photo"
                  value={restaurantFormData.image}
                  onChange={(url) => setRestaurantFormData({ ...restaurantFormData, image: url })}
                  required
                />

                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Description</label>
                  <textarea
                    rows={2}
                    required
                    value={restaurantFormData.description}
                    onChange={(e) => setRestaurantFormData({ ...restaurantFormData, description: e.target.value })}
                    placeholder="Succulent jumbo prawns tossed in garlic butter with local Goan spices..."
                    className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs"
                  />
                </div>

                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={restaurantFormData.isChefSpecial}
                      onChange={(e) => setRestaurantFormData({ ...restaurantFormData, isChefSpecial: e.target.checked })}
                      className="w-4 h-4 text-gold-500 rounded cursor-pointer"
                    />
                    <span>Chef's Special Badge</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={restaurantFormData.available}
                      onChange={(e) => setRestaurantFormData({ ...restaurantFormData, available: e.target.checked })}
                      className="w-4 h-4 text-emerald-500 rounded cursor-pointer"
                    />
                    <span>Available / In Stock</span>
                  </label>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setRestaurantModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-md cursor-pointer"
                  >
                    Save Menu Item
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: ADD / EDIT HOLIDAY PACKAGE */}
      <AnimatePresence>
        {packageModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-lg w-full bg-[#F1F3F5] border border-slate-300 rounded-3xl p-6 sm:p-8 my-8 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setPackageModalOpen(false)}
                className="absolute top-5 right-5 text-slate-500 hover:text-slate-800 bg-slate-200/80 hover:bg-slate-300 rounded-full w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="font-serif text-2xl font-bold text-slate-900 mb-4">
                {editingPackage ? 'Edit Holiday Package' : 'Create Holiday Package'}
              </h3>

              <form onSubmit={handleSavePackage} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Package Title</label>
                  <input
                    type="text"
                    required
                    value={packageFormData.title}
                    onChange={(e) => setPackageFormData({ ...packageFormData, title: e.target.value })}
                    placeholder="e.g. Royal Arabian Honeymoon Bliss"
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Category</label>
                    <select
                      value={packageFormData.category}
                      onChange={(e) => setPackageFormData({ ...packageFormData, category: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs cursor-pointer"
                    >
                      <option value="Honeymoon">Honeymoon</option>
                      <option value="Family Getaway">Family Getaway</option>
                      <option value="Wellness & Spa">Wellness & Spa</option>
                      <option value="Beach Adventure">Beach Adventure</option>
                      <option value="Weekend Escape">Weekend Escape</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Duration</label>
                    <input
                      type="text"
                      required
                      value={packageFormData.duration}
                      onChange={(e) => setPackageFormData({ ...packageFormData, duration: e.target.value })}
                      placeholder="e.g. 3 Nights / 4 Days"
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Original Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={packageFormData.price}
                      onChange={(e) => setPackageFormData({ ...packageFormData, price: e.target.value })}
                      placeholder="45000"
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold uppercase mb-1">Offer Price (₹)</label>
                    <input
                      type="number"
                      value={packageFormData.discountPrice}
                      onChange={(e) => setPackageFormData({ ...packageFormData, discountPrice: e.target.value })}
                      placeholder="38000"
                      className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs"
                    />
                  </div>
                </div>

                {/* Direct Select Image from File Manager with top-right 'x' button */}
                <ImageSelector
                  label="Package Cover Photo"
                  value={packageFormData.image}
                  onChange={(url) => setPackageFormData({ ...packageFormData, image: url })}
                  required
                />

                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">Description</label>
                  <textarea
                    rows={2}
                    required
                    value={packageFormData.description}
                    onChange={(e) => setPackageFormData({ ...packageFormData, description: e.target.value })}
                    placeholder="Indulge in beachfront romance with private candlelight dinners, couple massage..."
                    className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold uppercase mb-1">
                    Inclusions (comma separated)
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={packageFormData.inclusions}
                    onChange={(e) => setPackageFormData({ ...packageFormData, inclusions: e.target.value })}
                    placeholder="Ocean Suite Stay, Daily Breakfast, Couple Spa, Sunset Cruise"
                    className="w-full px-3 py-2 text-sm rounded-xl bg-white border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-xs"
                  />
                </div>

                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={packageFormData.featured}
                      onChange={(e) => setPackageFormData({ ...packageFormData, featured: e.target.checked })}
                      className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                    />
                    <span>Featured Package</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                    <input
                      type="checkbox"
                      checked={packageFormData.available}
                      onChange={(e) => setPackageFormData({ ...packageFormData, available: e.target.checked })}
                      className="w-4 h-4 text-emerald-500 rounded cursor-pointer"
                    />
                    <span>Available For Booking</span>
                  </label>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setPackageModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-200 font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md cursor-pointer"
                  >
                    Save Package
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CONFIRM CHECK OUT & SEND RATING */}
      <AnimatePresence>
        {checkoutConfirmModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-lg w-full bg-[#F1F3F5] border border-slate-300 rounded-3xl p-6 sm:p-7 shadow-2xl my-8 text-slate-800"
            >
              <button
                type="button"
                onClick={() => setCheckoutConfirmModal(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 bg-slate-200/80 hover:bg-slate-300 rounded-full w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-3">
                <span className="p-2.5 rounded-2xl bg-gold-400/20 text-gold-700 border border-gold-400/30">
                  <LogOut className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-serif text-xl font-bold text-slate-900">
                    Confirm Guest Check Out
                  </h3>
                  <p className="text-xs text-slate-500">Goa Resort Front Desk & Reception</p>
                </div>
              </div>

              {/* Guest & Reservation Card */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 mt-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Guest Name</span>
                    <h4 className="font-serif text-base font-bold text-slate-900">
                      {checkoutConfirmModal.guestDetails?.name || checkoutConfirmModal.user?.name}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Booking Ref</span>
                    <p className="font-mono text-xs font-bold text-gold-600">
                      {checkoutConfirmModal.bookingReference}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Room Reserved</span>
                    <span className="font-bold text-slate-800">{checkoutConfirmModal.room?.name || 'Luxury Room'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Total Amount & Payment</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-bold text-slate-900">₹{checkoutConfirmModal.totalAmount?.toLocaleString('en-IN')}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                          checkoutConfirmModal.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : 'bg-gold-50 text-gold-700 border-gold-300'
                        }`}
                      >
                        {checkoutConfirmModal.paymentStatus === 'Paid' ? '✓ Paid (UPI/Card)' : '⏳ Non Pay (Pay Later)'}
                      </span>
                    </div>
                    {checkoutConfirmModal.paymentStatus !== 'Paid' && (
                      <button
                        type="button"
                        onClick={async () => {
                          await handleUpdatePaymentStatus(checkoutConfirmModal._id, 'Paid');
                          setCheckoutConfirmModal({ ...checkoutConfirmModal, paymentStatus: 'Paid' });
                        }}
                        className="mt-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 underline cursor-pointer block"
                      >
                        Mark as Paid now (Settled by Guest)
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Automatic Rating Message Dispatch Target */}
              <div className="mt-4 p-4 rounded-2xl bg-gold-50 border border-gold-200/80">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gold-900 mb-2">
                  <Send className="w-3.5 h-3.5 text-gold-700" />
                  <span>Automated Rating Message Dispatch Info</span>
                </div>
                <p className="text-xs text-gold-800 leading-relaxed mb-3">
                  Upon clicking confirm, the reservation will immediately move to <strong>Booking History</strong>, and a luxury rating & feedback link will be automatically sent to the guest’s profile contacts:
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-gold-200/60 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span className="text-slate-500 font-medium">Registered Mobile:</span>
                    </div>
                    <strong className="text-slate-900 font-mono">
                      {checkoutConfirmModal.guestDetails?.phone || checkoutConfirmModal.user?.phone || 'Not provided'}
                    </strong>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-gold-200/60 shadow-2xs">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-blue-600" />
                      <span className="text-slate-500 font-medium">Registered Email:</span>
                    </div>
                    <strong className="text-slate-900">
                      {checkoutConfirmModal.guestDetails?.email || checkoutConfirmModal.user?.email || 'Not provided'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setCheckoutConfirmModal(null)}
                  disabled={isCheckingOut}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-200 font-semibold text-xs cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleCheckOutBooking(checkoutConfirmModal)}
                  disabled={isCheckingOut}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-300 hover:to-gold-400 text-slate-950 font-bold text-xs shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isCheckingOut ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Checking Out...</span>
                    </>
                  ) : (
                    <>
                      <CheckCheck className="w-4 h-4" />
                      <span>Confirm Check Out & Dispatch Rating</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: POST-CHECKOUT SUCCESS & RATING DISPATCH NOTICE */}
      <AnimatePresence>
        {checkoutModalData && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-md w-full bg-[#F1F3F5] border border-slate-300 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-800 text-center"
            >
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 border border-emerald-300 text-emerald-600 flex items-center justify-center mb-3 shadow-xs">
                <CheckCircle className="w-8 h-8" />
              </div>

              <h3 className="font-serif text-2xl font-bold text-slate-900">
                Check Out Completed!
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                Guest details moved to <strong>Booking History</strong> and the automated rating invitation has been dispatched.
              </p>

              {/* Delivery Receipt */}
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs my-4 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold">Guest:</span>
                  <span className="font-bold text-slate-900">{checkoutModalData.ratingDetails?.guestName}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Mobile SMS / WhatsApp:</span>
                  </span>
                  <span className="font-mono font-bold text-slate-800">
                    {checkoutModalData.ratingDetails?.recipientPhone}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-semibold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Email Address:</span>
                  </span>
                  <span className="font-bold text-slate-800 truncate max-w-[200px]">
                    {checkoutModalData.ratingDetails?.recipientEmail}
                  </span>
                </div>
                <div className="pt-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Delivered Message:</span>
                  <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    "{checkoutModalData.ratingDetails?.messageText}"
                  </p>
                </div>
              </div>

              <div className="flex gap-2 justify-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCheckoutModalData(null);
                    setBookingSubTab('history');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-500 text-ocean-950 font-bold text-xs shadow-md transition-colors cursor-pointer"
                >
                  View in Booking History →
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutModalData(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-200 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: VIEW DISPATCHED RATING MESSAGE & LOGS */}
      <AnimatePresence>
        {viewRatingMsgModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-lg w-full bg-[#F1F3F5] border border-slate-300 rounded-3xl p-6 sm:p-7 shadow-2xl text-slate-800"
            >
              <button
                type="button"
                onClick={() => setViewRatingMsgModal(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 bg-slate-200/80 hover:bg-slate-300 rounded-full w-8 h-8 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <span className="p-2 rounded-xl bg-purple-500/20 text-purple-700 border border-purple-500/30">
                  <Send className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-serif text-lg font-bold text-slate-900">
                    Automated Rating Delivery Record
                  </h3>
                  <p className="text-xs text-slate-500">
                    Booking Reference: <strong className="font-mono text-gold-700">{viewRatingMsgModal.bookingReference}</strong>
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 text-xs mb-4">
                <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Guest Name</span>
                    <span className="font-bold text-slate-900">
                      {viewRatingMsgModal.guestDetails?.name || viewRatingMsgModal.user?.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase block">Departure Timestamp</span>
                    <span className="font-semibold text-slate-700">
                      {viewRatingMsgModal.checkedOutAt
                        ? new Date(viewRatingMsgModal.checkedOutAt).toLocaleString()
                        : 'Checked Out'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 pb-2 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Registered Mobile:</span>
                    </span>
                    <strong className="font-mono text-slate-900">
                      {viewRatingMsgModal.guestDetails?.phone || viewRatingMsgModal.user?.phone || 'Not provided'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      <span>Registered Email:</span>
                    </span>
                    <strong className="text-slate-900">
                      {viewRatingMsgModal.guestDetails?.email || viewRatingMsgModal.user?.email || 'Not provided'}
                    </strong>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                    Sent Message Content:
                  </span>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-slate-700 text-xs leading-relaxed italic">
                    "{viewRatingMsgModal.ratingMessageDetails?.messageText || `Dear ${viewRatingMsgModal.guestDetails?.name || 'Guest'}, thank you for staying at Goa Luxury Resort & Spa! Please take a moment to rate your stay: https://goaresort.com/feedback/${viewRatingMsgModal.bookingReference} ⭐⭐⭐⭐⭐`}"
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleResendRating(viewRatingMsgModal._id);
                    setViewRatingMsgModal(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-gold-400 hover:bg-gold-500 text-ocean-950 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend Rating Invitation</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewRatingMsgModal(null)}
                  className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-200 font-semibold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AdminDashboard;
