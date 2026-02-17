import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import Doctors from './pages/Doctors';
import Facilities from './pages/Facilities';
import Contact from './pages/Contact';
import Appointment from './pages/Appointment';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';
import MyAppointments from './pages/MyAppointments';
import AppointmentConfirmation from './pages/AppointmentConfirmation';
import AppointmentVerification from './pages/AppointmentVerification';
import ReviewModal from './components/ReviewModal';
import { useLoading } from './context/LoadingContext';
import MobileSidebar from './components/MobileSidebar';

function App() {
  const { pathname } = useLocation();
  const { isLoading } = useLoading();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isAdminPage = pathname === '/admin-dashboard' || pathname.startsWith('/admin');
  const isVerifyPage = pathname.startsWith('/verify-appointment');

  const openReviewModal = () => setIsReviewModalOpen(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      <div
        className={`flex flex-col min-h-screen font-sans text-surface-800 bg-white selection:bg-primary-100 transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
      >
        {!isAdminPage && !isVerifyPage && (
          <Navbar
            openReviewModal={openReviewModal}
            onOpenSidebar={() => setIsSidebarOpen(true)}
          />
        )}

        <MobileSidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          openReviewModal={openReviewModal}
        />

        {/* 
            The main content area uses a dynamic padding-top.
            The --navbar-height variable is set by the Navbar component using a resize observer.
        */}
        <main
          className="flex-grow overflow-x-hidden transition-[padding] duration-300"
          style={{
            paddingTop: (isAdminPage || isVerifyPage) ? '0px' : 'var(--navbar-height, 80px)'
          }}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/appointment" element={<Appointment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/my-appointments" element={<MyAppointments />} />
            <Route path="/appointment/confirmation/:appointmentId" element={<AppointmentConfirmation />} />
            <Route path="/verify-appointment/:id" element={<AppointmentVerification />} />
          </Routes>
        </main>
        {!isAdminPage && !isVerifyPage && <Footer />}
        <ReviewModal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} />
      </div>
    </>
  );
}

export default App;
