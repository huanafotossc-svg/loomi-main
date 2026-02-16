import React from 'react';
import { Wallet, Info } from 'lucide-react';
import { cn, formatCurrency } from '../utils/helpers';

interface HotelBudgetInputProps {
    minBudget: number;
    maxBudget: number;
    onChange: (min: number, max: number) => void;
    className?: string;
}

export function HotelBudgetInput({ minBudget, maxBudget, onChange, className }: HotelBudgetInputProps) {
    // Local state for inputs to allow typing before validation/currency formatting if needed
    // For simplicity, we'll assume the parent handles the state and we just trigger onChange
    // But to make it "functional" as requested without complex masking here, we'll use simple number inputs styled well.

    const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value) || 0;
        onChange(val, maxBudget);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = parseFloat(e.target.value) || 0;
        onChange(minBudget, val);
    };

    const averageMarketPrice = (minBudget + maxBudget) / 2 || 350; // Fictitious logic as requested

    return (
        <div className={cn("w-full space-y-4", className)}>
            <div>
                <h3 className="text-lg font-bold text-ink flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-coral" />
                    Orçamento
                </h3>
            </div>

            <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium text-warm-gray-600">Mínimo</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray-400 font-medium">R$</span>
                        <input
                            type="number"
                            value={minBudget || ''}
                            onChange={handleMinChange}
                            placeholder="0,00"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-warm-gray-200 rounded-xl focus:border-coral focus:ring-2 focus:ring-coral/10 transition-all font-medium text-ink outline-none"
                        />
                    </div>
                </div>

                <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium text-warm-gray-600">Máximo</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray-400 font-medium">R$</span>
                        <input
                            type="number"
                            value={maxBudget || ''}
                            onChange={handleMaxChange}
                            placeholder="0,00"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-warm-gray-200 rounded-xl focus:border-coral focus:ring-2 focus:ring-coral/10 transition-all font-medium text-ink outline-none"
                        />
                    </div>
                </div>
            </div>

            {/* Média de referência (Original Box Restored) */}
            <div className="bg-coral/5 rounded-xl p-3 flex items-start gap-3">
                <Info className="w-5 h-5 text-coral shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm text-ink font-medium">
                        Média de mercado para este pedido: <span className="text-coral font-bold">{formatCurrency(averageMarketPrice)}</span>
                    </p>
                    <p className="text-xs text-warm-gray-500 mt-1">
                        💡 Profissionais podem enviar propostas com valores diferentes baseados na experiência e equipamento.
                    </p>
                </div>
            </div>
        </div>
    );
}
