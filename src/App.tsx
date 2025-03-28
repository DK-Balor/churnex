import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import Dashboard from './pages/dashboard/Dashboard';
import ContactPage from './pages/contact/ContactPage';
import Settings from './pages/settings/Settings';
import DashboardDemo from './pages/demo/DashboardDemo';
import { Toaster } from './components/ui/toaster';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/demo" element={<DashboardDemo />} />
      </Routes>
      <Toaster />
    </Router>
  );
} 