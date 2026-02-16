import { useState } from 'react';
import { X, Wallet, AlertCircle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { formatCurrency } from '../utils/helpers';

interface ApplyJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobTitle: string;
    clientBudgetMin: number;
    clientBudgetMax: number;
    onSubmit: (amount: number, justification: string) => void;
}

export function ApplyJobModal({
    isOpen,
    onClose,
    jobTitle,
    clientBudgetMin,
    clientBudgetMax,
    onSubmit
}: ApplyJobModalProps) {
    const [amount, setAmount] = useState<number | ''>('');
    const [justification, setJustification] = useState('');

    const numericAmount = typeof amount === 'number' ? amount : 0;
    const platformFee = numericAmount * 0.10;
    const netAmount = numericAmount - platformFee;

    const handleSubmit = () => {
        if (numericAmount > 0) {
            onSubmit(numericAmount, justification);
            onClose();
        }
    };

    const isAboveBudget = numericAmount > clientBudgetMax;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-ink">Enviar Proposta</h2>
                        <p className="text-warm-gray-500 mt-1">{jobTitle}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-warm-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-warm-gray-500" />
                    </button>
                </div>

                {/* Client Budget Display */}
                <div className="bg-warm-gray-50 rounded-2xl p-4 mb-6 border border-warm-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                        <Wallet className="w-5 h-5 text-warm-gray-400" />
                        <span className="text-sm font-medium text-warm-gray-600">Orçamento do Cliente</span>
                    </div>
                    <p className="text-xl font-bold text-ink">
                        {formatCurrency(clientBudgetMin)} - {formatCurrency(clientBudgetMax)}
                    </p>
                </div>

                <div className="space-y-6">
                    {/* Proposal Amount Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-ink">Sua Proposta</label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray-400 font-bold text-lg">R$</span>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(parseFloat(e.target.value) || '')}
                                placeholder="0,00"
                                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-warm-gray-200 rounded-2xl focus:border-coral focus:ring-4 focus:ring-coral/10 transition-all text-xl font-bold text-ink outline-none"
                            />
                        </div>

                        {/* Fee Calculation */}
                        {numericAmount > 0 && (
                            <div className="flex items-center justify-between text-xs px-2">
                                <span className="text-red-400">Taxa da plataforma (10%): -{formatCurrency(platformFee)}</span>
                                <span className="text-green-600 font-bold">Você recebe: {formatCurrency(netAmount)}</span>
                            </div>
                        )}
                    </div>

                    {/* Justification Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-ink flex items-center justify-between">
                            Justificativa
                            {isAboveBudget && (
                                <span className="text-xs text-coral font-medium flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" />
                                    Valor acima do orçamento
                                </span>
                            )}
                        </label>
                        <textarea
                            value={justification}
                            onChange={(e) => setJustification(e.target.value)}
                            placeholder="Se seu valor for maior que o orçamento, explique seus diferenciais (Ex: levarei Drone, entregarei mais fotos...)"
                            className="w-full p-4 bg-white border-2 border-warm-gray-200 rounded-2xl focus:border-coral focus:ring-4 focus:ring-coral/10 transition-all text-base text-ink outline-none min-h-[120px] resize-none"
                        />
                    </div>

                    {/* Action Button */}
                    <Button
                        onClick={handleSubmit}
                        disabled={numericAmount <= 0}
                        className="w-full py-4 text-base font-bold rounded-xl shadow-lg shadow-coral/20"
                    >
                        Enviar Proposta de {numericAmount > 0 ? formatCurrency(numericAmount) : 'R$ 0,00'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
