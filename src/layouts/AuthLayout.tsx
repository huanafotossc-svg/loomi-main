import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export function AuthLayout() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if user is authenticated AND not on onboarding page
    // This allows users to complete onboarding after login
    if (isAuthenticated && user && location.pathname === '/auth') {
      // Check if user has completed onboarding (has a role set properly)
      // For demo users, we should show onboarding
      const needsOnboarding = !user.creatorType && user.role === 'creator';

      if (needsOnboarding) {
        navigate('/onboarding', { replace: true });
      } else if (user.role === 'hotel') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/feed', { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate, location.pathname]);

  // Don't render auth screen if user is already authenticated (but allow onboarding)
  if (isAuthenticated && location.pathname === '/auth') {
    return null;
  }

  return (
    <div className="min-h-screen bg-porcelain">
      <div className="app-container mx-auto min-h-screen flex flex-col">
        {/* Logo Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 flex items-center justify-center"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-coral rounded-2xl flex items-center justify-center shadow-soft">
              <span className="text-white font-bold text-2xl">L</span>
            </div>
            <span className="font-bold text-2xl text-ink">Loomi</span>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
