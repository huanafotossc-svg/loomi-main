import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  Briefcase,
  Users,
  Clock,
  Star,
  DollarSign,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { cn, formatCurrency } from '../utils/helpers';

const monthlyData = [
  { month: 'Jul', jobs: 1, applications: 3, mediaValue: 8000 },
  { month: 'Ago', jobs: 2, applications: 8, mediaValue: 15000 },
  { month: 'Set', jobs: 1, applications: 5, mediaValue: 12000 },
  { month: 'Out', jobs: 2, applications: 7, mediaValue: 18000 },
  { month: 'Nov', jobs: 3, applications: 12, mediaValue: 25000 },
  { month: 'Dez', jobs: 2, applications: 10, mediaValue: 22000 },
];

const stats = [
  {
    label: 'Vagas publicadas',
    value: '11',
    change: '+37%',
    trend: 'up',
    icon: Briefcase,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    label: 'Candidaturas',
    value: '45',
    change: '+52%',
    trend: 'up',
    icon: Users,
    color: 'bg-green-100 text-green-600',
  },
  {
    label: 'Tempo médio p/ preencher',
    value: '5 dias',
    change: '-2 dias',
    trend: 'up',
    icon: Clock,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    label: 'Entregas aprovadas',
    value: '8',
    change: '+60%',
    trend: 'up',
    icon: Star,
    color: 'bg-yellow-100 text-yellow-600',
  },
];

export function HotelAnalyticsReportsScreen() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('6m');
  const maxMediaValue = Math.max(...monthlyData.map(d => d.mediaValue));

  return (
    <div className="min-h-screen bg-porcelain pb-8">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-warm-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-ink">Analytics</h1>
        </div>
        <div className="relative">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="appearance-none bg-warm-gray-100 px-4 py-2 pr-10 rounded-xl text-sm font-medium text-ink focus:outline-none"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="3m">Últimos 3 meses</option>
            <option value="6m">Últimos 6 meses</option>
            <option value="1y">Último ano</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* ROI Card */}
      <div className="px-4 mt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-coral to-coral/80 rounded-2xl p-5 text-white"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/70 text-sm mb-1">Valor de mídia gerado</p>
              <p className="text-3xl font-bold">{formatCurrency(100000)}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-7 h-7" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">+45%</span>
            <span className="text-white/70">vs período anterior</span>
          </div>
          <p className="text-white/60 text-sm mt-3">
            Estimativa baseada em valores de mercado para conteúdo similar
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-medium text-warm-gray-500 uppercase tracking-wide mb-3 px-1">
          Principais métricas
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-card"
            >
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-ink">{stat.value}</p>
              <p className="text-xs text-warm-gray-500">{stat.label}</p>
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600 font-medium">{stat.change}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Media Value Chart */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-medium text-warm-gray-500 uppercase tracking-wide mb-3 px-1">
          Valor de mídia mensal
        </h2>
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-end justify-between h-40 gap-2">
            {monthlyData.map((data) => {
              const height = (data.mediaValue / maxMediaValue) * 100;
              return (
                <div key={data.month} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-coral rounded-t-lg transition-all duration-500"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-warm-gray-500 mt-2">{data.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t border-warm-gray-100">
            <div>
              <p className="text-xs text-warm-gray-500">Total</p>
              <p className="font-semibold text-ink">
                {formatCurrency(monthlyData.reduce((acc, d) => acc + d.mediaValue, 0))}
              </p>
            </div>
            <div>
              <p className="text-xs text-warm-gray-500">Média/mês</p>
              <p className="font-semibold text-ink">
                {formatCurrency(monthlyData.reduce((acc, d) => acc + d.mediaValue, 0) / monthlyData.length)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Jobs & Applications Chart */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-medium text-warm-gray-500 uppercase tracking-wide mb-3 px-1">
          Vagas e candidaturas
        </h2>
        <div className="bg-white rounded-2xl p-5 shadow-card">
          <div className="flex items-end justify-between h-32 gap-2">
            {monthlyData.map((data) => (
              <div key={data.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-0.5">
                  <div
                    className="flex-1 bg-coral rounded-t"
                    style={{ height: `${(data.jobs / 3) * 100}%` }}
                  />
                  <div
                    className="flex-1 bg-blue-400 rounded-t"
                    style={{ height: `${(data.applications / 12) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-warm-gray-500">{data.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-warm-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-coral rounded" />
              <span className="text-sm text-warm-gray-600">Vagas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-400 rounded" />
              <span className="text-sm text-warm-gray-600">Candidaturas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="px-4 mt-6">
        <h2 className="text-sm font-medium text-warm-gray-500 uppercase tracking-wide mb-3 px-1">
          Resumo do período
        </h2>
        <div className="bg-white rounded-2xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-coral" />
              </div>
              <div>
                <p className="font-medium text-ink">Taxa de conversão</p>
                <p className="text-sm text-warm-gray-500">Candidatos → Contratados</p>
              </div>
            </div>
            <p className="text-xl font-bold text-ink">18%</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-ink">Nota média dos creators</p>
                <p className="text-sm text-warm-gray-500">Baseado em avaliações</p>
              </div>
            </div>
            <p className="text-xl font-bold text-ink">4.8</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-ink">Tempo até aprovação</p>
                <p className="text-sm text-warm-gray-500">Média de revisões</p>
              </div>
            </div>
            <p className="text-xl font-bold text-ink">2.3 dias</p>
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="px-4 mt-6 mb-8">
        <button className="w-full flex items-center justify-center gap-2 p-4 bg-white rounded-2xl shadow-card text-coral font-medium hover:bg-coral/5 transition-colors">
          <TrendingUp className="w-5 h-5" />
          Exportar relatório completo
        </button>
      </div>
    </div>
  );
}
