import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { BottomNav } from '../components';
import { useAuth } from '../context/AuthContext';

export function CreatorLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/auth', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="text-warm-gray-500">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linen">
      <div className="app-container mx-auto relative min-h-screen flex flex-col">
        <main className="flex-1 overflow-auto pb-24">
          <Outlet />
        </main>
        <BottomNav role="creator" />
      </div>
    </div>
  );
}
