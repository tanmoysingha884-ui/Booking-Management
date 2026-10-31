import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Rooms from './components/Rooms';
import Gallery from './components/Gallery';
import AboutUs from './components/AboutUs';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import BookingModal from './components/BookingModal';
import RoomDetailsModal from './components/RoomDetailsModal';
import MyBookingsModal from './components/MyBookingsModal';
import AdminDashboard from './components/AdminDashboard';
import Restaurant from './components/Restaurant';
import Packages from './components/Packages';

function MainApp() {
  const { user, isAdmin } = useAuth();

  // Current view: 'hotel' (public resort site) or 'admin' (admin dashboard)
  const [currentView, setCurrentView] = useState('hotel');
  const prevAdminRef = useRef(false);

  // Automatically open Admin Dashboard when logging in as admin
  useEffect(() => {
    if (!prevAdminRef.current && isAdmin) {
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    prevAdminRef.current = !!isAdmin;
  }, [isAdmin]);

  // Return to hotel view if admin logs out while in admin view
  useEffect(() => {
    if (!isAdmin && currentView === 'admin') {
      setCurrentView('hotel');
    }
  }, [isAdmin, currentView]);

  // Search & availability filters passed from Hero to Rooms
  const [searchFilter, setSearchFilter] = useState(null);

  // Selected room for modals
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState(null);
  const [selectedRoomForDetails, setSelectedRoomForDetails] = useState(null);

  // Modal open states
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);

  // Search Availability handler from Hero
  const handleSearchAvailability = (filterData) => {
    setSearchFilter(filterData);
    setCurrentView('rooms');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open booking modal
  const handleOpenBooking = (room) => {
    setSelectedRoomForBooking(room);
  };

  // Open room details modal
  const handleOpenDetails = (room) => {
    setSelectedRoomForDetails(room);
  };

  // When admin switches view
  const handleNavigateToAdmin = () => {
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToSite = () => {
    setCurrentView('hotel');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFooterNavigate = (item) => {
    if (item === 'Rooms') {
      setCurrentView('rooms');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item === 'Restaurant') {
      setCurrentView('restaurant');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item === 'Packages') {
      setCurrentView('packages');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (item === 'Home') {
      setCurrentView('hotel');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (currentView !== 'hotel') {
        setCurrentView('hotel');
        setTimeout(() => {
          const id = item.toLowerCase().replace(' ', '');
          const el = document.getElementById(id === 'aboutus' ? 'about' : id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        const id = item.toLowerCase().replace(' ', '');
        const el = document.getElementById(id === 'aboutus' ? 'about' : id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-slate-800 flex flex-col font-sans selection:bg-gold-400 selection:text-ocean-950">
      
      {currentView === 'admin' ? (
        /* Admin Dashboard View */
        <AdminDashboard onBackToSite={handleBackToSite} />
      ) : (
        /* Main Luxury Resort Website */
        <>
          {/* Top Navbar with 5 options + Right Sign In / User Profile */}
          <Navbar
            onOpenBookings={() => setMyBookingsOpen(true)}
            onNavigateToAdmin={handleNavigateToAdmin}
            currentView={currentView}
            setCurrentView={setCurrentView}
          />

          {/* Main sections */}
          <main className="flex-1">
            {currentView === 'rooms' ? (
              /* Dedicated Rooms Section / Page */
              <Rooms
                searchFilter={searchFilter}
                onSelectRoomForBooking={handleOpenBooking}
                onSelectRoomForDetails={handleOpenDetails}
                onBackToHome={() => {
                  setCurrentView('hotel');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ) : currentView === 'restaurant' ? (
              /* Dedicated Luxury Restaurant & Dining Page */
              <Restaurant
                onBackToHome={() => {
                  setCurrentView('hotel');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ) : currentView === 'packages' ? (
              /* Dedicated Luxury Holiday Packages Page */
              <Packages
                onBackToHome={() => {
                  setCurrentView('hotel');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            ) : (
              /* First Page / Home Sections */
              <>
                {/* 1. Hero Section with Booking Availability Bar */}
                <Hero onSearchAvailability={handleSearchAvailability} />

                {/* 2. Gallery Section */}
                <Gallery />

                {/* 3. About Us Section */}
                <AboutUs />

                {/* 4. Contact Section */}
                <Contact />
              </>
            )}
          </main>

          {/* Luxury Footer */}
          <Footer onNavigate={handleFooterNavigate} />

          {/* Global Modals */}
          <AuthModal />

          {selectedRoomForBooking && (
            <BookingModal
              room={selectedRoomForBooking}
              initialDates={searchFilter}
              onClose={() => setSelectedRoomForBooking(null)}
              onBookingSuccess={() => {
                // Booking created successfully
              }}
            />
          )}

          {selectedRoomForDetails && (
            <RoomDetailsModal
              room={selectedRoomForDetails}
              onClose={() => setSelectedRoomForDetails(null)}
              onBookNow={(room) => {
                setSelectedRoomForDetails(null);
                setSelectedRoomForBooking(room);
              }}
            />
          )}

          <MyBookingsModal
            isOpen={myBookingsOpen}
            onClose={() => setMyBookingsOpen(false)}
          />
        </>
      )}

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
