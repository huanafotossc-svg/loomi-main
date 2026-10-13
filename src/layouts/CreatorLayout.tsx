import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { TopNav } from '../components/TopNav';
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
    <div className="min-h-screen bg-linen flex flex-col">
      {/* Menu Superior (Navbar no Desktop + Hambúrguer & Gaveta no Mobile) */}
      <TopNav role="creator" />

      {/* Área Principal de Conteúdo Responsivo */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 md:pb-12">
        <Outlet />
      </main>

      {/* Menu Inferior Rápido no Mobile */}
      <div className="md:hidden">
        <BottomNav role="creator" />
      </div>
    </div>
  );
}
