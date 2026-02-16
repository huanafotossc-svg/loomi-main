import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Button, Input } from '../components';
import { useAuth } from '../context/AuthContext';
import { isValidEmail } from '../utils/helpers';

export function AuthScreen() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!isValidEmail(formData.email)) {
      setError('Por favor, insira um email válido');
      return;
    }

    if (formData.password.length < 4) {
      setError('A senha deve ter pelo menos 4 caracteres');
      return;
    }

    if (!isLogin && formData.name.length < 2) {
      setError('Por favor, insira seu nome');
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate('/onboarding');
      } else {
        setError('Email ou senha incorretos');
      }
    } catch {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Simulate social login
    setIsLoading(true);
    setTimeout(() => {
      login(`user@${provider}.com`, 'password').then(() => {
        navigate('/onboarding');
      });
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col px-6 pb-8">
      {/* Hero Image */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative h-64 rounded-3xl overflow-hidden mb-8"
      >
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
          alt="Luxury Hotel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-2xl font-bold text-white mb-2">
            {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta'}
          </h1>
          <p className="text-white/80 text-sm">
            {isLogin
              ? 'Entre para continuar encontrando oportunidades incríveis'
              : 'Junte-se à comunidade de creators e hotéis'
            }
          </p>
        </div>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        {!isLogin && (
          <Input
            label="Nome completo"
            placeholder="Seu nome"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            leftIcon={<span className="text-warm-gray-400">👤</span>}
          />
        )}

        <Input
          label="Email"
          type="email"
          placeholder="seu@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          leftIcon={<Mail className="w-5 h-5" />}
        />

        <Input
          label="Senha"
          type={showPassword ? 'text' : 'password'}
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          leftIcon={<Lock className="w-5 h-5" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-warm-gray-400 hover:text-ink"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          }
        />

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-red-500 text-center"
          >
            {error}
          </motion.p>
        )}

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          rightIcon={<ArrowRight className="w-5 h-5" />}
          className="mt-6"
        >
          {isLogin ? 'Entrar' : 'Criar conta'}
        </Button>
      </motion.form>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-warm-gray-200" />
        <span className="text-sm text-warm-gray-500">ou continue com</span>
        <div className="flex-1 h-px bg-warm-gray-200" />
      </div>

      {/* Social Login */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex gap-3"
      >
        <button
          type="button"
          onClick={() => handleSocialLogin('google')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-warm-gray-200 rounded-2xl hover:border-coral hover:bg-coral/5 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span className="font-medium">Google</span>
        </button>

        <button
          type="button"
          onClick={() => handleSocialLogin('apple')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-warm-gray-200 rounded-2xl hover:border-coral hover:bg-coral/5 transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-1.21 3.84-1.06.66.03 2.51.26 3.7 1.98-.09.06-2.21 1.28-2.2 3.83.01 3.05 2.67 4.06 2.71 4.08-.02.1-.42 1.44-1.38 2.83M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
          <span className="font-medium">Apple</span>
        </button>
      </motion.div>

      {/* Toggle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center mt-6 text-sm text-warm-gray-500"
      >
        {isLogin ? 'Ainda não tem conta?' : 'Já tem uma conta?'}{' '}
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
          className="text-coral font-medium hover:underline"
        >
          {isLogin ? 'Criar conta' : 'Fazer login'}
        </button>
      </motion.p>

      {/* Demo hint */}
      <p className="text-center mt-4 text-xs text-warm-gray-400">
        Use qualquer email e senha (mín. 4 caracteres) para demo
      </p>
    </div>
  );
}
