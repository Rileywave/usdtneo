import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/dashboard/Dashboard';
import Upgrade from './pages/dashboard/Upgrade';
import PaymentMethod from './pages/dashboard/PaymentMethod';
import NgnTransfer from './pages/dashboard/NgnTransfer';
import UsdtDeposit from './pages/dashboard/UsdtDeposit';
import Withdraw from './pages/dashboard/Withdraw';
import History from './pages/dashboard/History';
import Profile from './pages/dashboard/Profile';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUpgrades from './pages/admin/AdminUpgrades';
import AdminWithdrawals from './pages/admin/AdminWithdrawals';
import AdminSettings from './pages/admin/AdminSettings';
import AdminReferrals from './pages/admin/AdminReferrals';
import AdminLogs from './pages/admin/AdminLogs';
import AmbientBackground from './components/AmbientBackground';
import Navbar from './components/Navbar';
import TelegramFAB from './components/TelegramFAB';
import BottomNav from './components/BottomNav';

function AnimatedRoutes() {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={isDashboard ? 'pb-24' : ''}
        >
          <Routes location={location}>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Dashboard routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/upgrade" element={<Upgrade />} />
            <Route path="/dashboard/payment-method" element={<PaymentMethod />} />
            <Route path="/dashboard/ngn-transfer" element={<NgnTransfer />} />
            <Route path="/dashboard/usdt-deposit" element={<UsdtDeposit />} />
            <Route path="/dashboard/withdraw" element={<Withdraw />} />
            <Route path="/dashboard/history" element={<History />} />
            <Route path="/dashboard/profile" element={<Profile />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="upgrades" element={<AdminUpgrades />} />
              <Route path="withdrawals" element={<AdminWithdrawals />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="referrals" element={<AdminReferrals />} />
              <Route path="logs" element={<AdminLogs />} />
            </Route>
          </Routes>
        </motion.div>
      </AnimatePresence>
      {isDashboard && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <div className="relative min-h-screen">
      <AmbientBackground />
      <Navbar />
      <AnimatedRoutes />
      <TelegramFAB />
    </div>
  );
}
