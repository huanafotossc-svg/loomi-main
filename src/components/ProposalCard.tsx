import React from 'react';
import { Check, X, DollarSign, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { formatCurrency } from '../utils/helpers';
import type { Application, UserRole } from '../types';

interface ProposalCardProps {
    application: Application;
    userRole: UserRole;
    onAccept?: () => void;
    onReject?: () => void;
    onNegotiate?: () => void;
}

export function ProposalCard({
    application,
    userRole,
    onAccept,
    onReject,
    onNegotiate
}: ProposalCardProps) {
    const isHotel = userRole === 'hotel';
    const amount = application.proposedAmount || 0;

    if (!amount) return null;

    return (
        <div className="mx-4 mt-4 bg-white rounded-2xl border border-warm-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-coral/10 to-orange-50 px-4 py-3 flex items-center justify-between border-b border-coral/10">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-white rounded-lg shadow-sm">
                        <DollarSign className="w-4 h-4 text-coral" />
                    </div>
                    <span className="font-bold text-ink text-sm">
                        Proposta Oficial
                    </span>
                </div>
                <span className="text-coral font-bold text-lg">
                    {formatCurrency(amount)}
                </span>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                {/* Justification */}
                {application.proposedJustification && (
                    <div className="bg-warm-gray-50 rounded-xl p-3 relative">
                        <span className="absolute -top-2 left-3 bg-white px-1 text-xs text-warm-gray-400">
                            Nota do Creator
                        </span>
                        <p className="text-sm text-ink italic leading-relaxed">
                            "{application.proposedJustification}"
                        </p>
                    </div>
                )}

                {/* Actions for Hotel */}
                {isHotel && application.status === 'sent' && (
                    <div className="space-y-3">
                        <div className="flex gap-3">
                            <Button
                                onClick={onAccept}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white border-none shadow-green-200"
                            >
                                <Check className="w-4 h-4 mr-2" />
                                Aceitar e Gerar Contrato
                            </Button>
                            <Button
                                variant="outline"
                                onClick={onReject}
                                className="px-3 border-red-200 text-red-500 hover:bg-red-50"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>
                        <button
                            onClick={onNegotiate}
                            className="w-full text-center text-sm text-warm-gray-500 hover:text-coral font-medium transition-colors"
                        >
                            Negociar valor (Enviar mensagem)
                        </button>
                    </div>
                )}

                {/* Status for Creator */}
                {!isHotel && application.status === 'sent' && (
                    <div className="flex items-center gap-2 text-sm text-warm-gray-500 bg-warm-gray-50 p-3 rounded-xl">
                        <AlertCircle className="w-4 h-4" />
                        <span>Aguardando resposta do hotel...</span>
                    </div>
                )}

                {/* Accepted State */}
                {application.status === 'accepted' && (
                    <div className="flex flex-col items-center justify-center py-2 text-green-600">
                        <div className="flex items-center gap-2 font-bold mb-1">
                            <div className="p-1 bg-green-100 rounded-full">
                                <Check className="w-3 h-3" />
                            </div>
                            Proposta Aceita!
                        </div>
                        <p className="text-xs text-green-700/80">O contrato foi gerado automaticamente.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
