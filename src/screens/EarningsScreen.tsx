import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, Plane } from 'lucide-react';

import { mockCreators } from '../data/mock';
import { cn, formatCurrency, formatDate } from '../utils/helpers';

export function EarningsScreen() {
  const navigate = useNavigate();
  const creator = mockCreators[0];
  const earnings = creator.earnings;

  const monthlyData = [
    { month: 'Jul', cash: 3500, travel: 2500 },
    { month: 'Ago', cash: 4200, travel: 3000 },
    { month: 'Set', cash: 3800, travel: 2200 },
    { month: 'Out', cash: 5500, travel: 4000 },
    { month: 'Nov', cash: 6800, travel: 5000 },
    { month: 'Dez', cash: 7200, travel: 4500 },
  ];

  const transactions = [
    { id: 1, type: 'cash', amount: 6000, description: 'Morada dos Ventos - Coleção de Imagens', date: new Date('2024-12-05'), status: 'completed' },
    { id: 2, type: 'permuta', amount: 4500, description: 'Pousada dos Pinhos - Estadia + Benefícios', date: new Date('2024-11-20'), status: 'completed' },
    { id: 3, type: 'cash', amount: 2500, description: 'Vila Marítima - Conteúdo Social', date: new Date('2024-11-15'), status: 'completed' },
    { id: 4, type: 'cash', amount: 4000, description: 'Fazenda Lagoa - Ensaio Lifestyle', date: new Date('2024-10-28'), status: 'completed' },
  ];

  const maxValue = Math.max(...monthlyData.map(d => d.cash + d.travel));

  return (
    <div className="min-h-screen bg-porcelain pb-8">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-warm-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold text-ink">Meus Ganhos</h1>
      </div>

      {/* Total Card */}
      <div className="px-4 -mt-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-coral to-coral/80 rounded-3xl p-6 text-white"
        >
          <p className="text-white/70 mb-2">Total acumulado</p>
          <p className="text-4xl font-bold mb-6">
            {formatCurrency(earnings.cash + earnings.travelSavings)}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-5 h-5" />
                <span className="text-sm text-white/70">Em cachês</span>
              </div>
              <p className="text-xl font-bold">{formatCurrency(earnings.cash)}</p>
            </div>
            <div className="bg-white/10 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Plane className="w-5 h-5" />
                <span className="text-sm text-white/70">Em viagens</span>
              </div>
              <p className="text-xl font-bold">{formatCurrency(earnings.travelSavings)}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-3xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-ink">Evolução mensal</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-coral rounded-full" />
                <span className="text-warm-gray-500">Cachê</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-warm-gray-500">Viagens</span>
              </div>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="flex items-end justify-between h-40 gap-2">
            {monthlyData.map((data) => {
              const total = data.cash + data.travel;
              const height = (total / maxValue) * 100;
              const cashHeight = (data.cash / total) * 100;

              return (
                <div key={data.month} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full rounded-t-lg overflow-hidden flex flex-col-reverse"
                    style={{ height: `${height}%` }}
                  >
                    <div
                      className="bg-green-500 w-full"
                      style={{ height: `${100 - cashHeight}%` }}
                    />
                    <div
                      className="bg-coral w-full"
                      style={{ height: `${cashHeight}%` }}
                    />
                  </div>
                  <span className="text-xs text-warm-gray-500 mt-2">{data.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-ink">Transações recentes</h3>
          <button className="text-sm text-coral font-medium">Ver todas</button>
        </div>

        <div className="space-y-3">
          {transactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-card"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  tx.type === 'cash' ? 'bg-coral/15 text-coral' : 'bg-green-100 text-green-600'
                )}>
                  {tx.type === 'cash' ? <Wallet className="w-5 h-5" /> : <Plane className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-ink">{tx.description}</p>
                  <p className="text-sm text-warm-gray-500">
                    {formatDate(tx.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className={cn(
                    'font-semibold',
                    tx.type === 'cash' ? 'text-coral' : 'text-green-600'
                  )}>
                    {tx.type === 'cash' ? formatCurrency(tx.amount) : `${tx.amount} diárias`}
                  </p>
                  <span className="text-xs text-green-600">Concluído</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
