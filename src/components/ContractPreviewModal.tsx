import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Shield } from 'lucide-react';
import { Button } from './Button';
import { formatCurrency, formatDate } from '../utils/helpers';
import type { Application, Job } from '../types';

interface ContractPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    application: Application;
    job: Job;
    onSign: () => void;
}

export function ContractPreviewModal({
    isOpen,
    onClose,
    application,
    job,
    onSign
}: ContractPreviewModalProps) {
    const [agreed, setAgreed] = useState(false);
    const [isSigning, setIsSigning] = useState(false);

    const handleSign = async () => {
        setIsSigning(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        onSign();
        setIsSigning(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-warm-gray-200 flex items-center justify-between bg-warm-gray-50">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                <FileText className="w-5 h-5 text-coral" />
                            </div>
                            <div>
                                <h2 className="font-bold text-ink">Contrato de Serviço</h2>
                                <p className="text-xs text-warm-gray-500">JO-{job.id.split('-')[1]} • {formatDate(new Date())}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-warm-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-warm-gray-400" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">
                        {/* Status Banner */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                            <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            <div className="text-sm text-blue-800">
                                <p className="font-semibold mb-1">Proteção Loomi</p>
                                <p>Este contrato garante o pagamento seguro e a entrega dos serviços conforme acordado. O valor ficará retido até a aprovação final.</p>
                            </div>
                        </div>

                        {/* Contract Body */}
                        <div className="space-y-6 text-sm text-ink/80 leading-relaxed font-serif bg-white p-8 border border-warm-gray-100 shadow-sm rounded-xl">
                            <div className="text-center mb-6">
                                <h3 className="font-bold text-lg text-ink">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h3>
                            </div>

                            <p>
                                Pelo presente instrumento, de um lado <strong>{job.hotel?.name || 'O CONTRATANTE'}</strong>, e de outro <strong>{application.creator?.name || 'O CONTRATADO'}</strong>, acordam com os seguintes termos:
                            </p>

                            <div className="space-y-2">
                                <h4 className="font-bold text-ink">1. O OBJETO</h4>
                                <p>
                                    Prestação de serviços para o projeto <strong>"{job.title}"</strong>, incluindo:
                                </p>
                                <ul className="list-disc pl-5 space-y-1">
                                    {job.requirements.deliverables.map((item, idx) => (
                                        <li key={idx}>
                                            {item.quantity}x {item.type} {item.description && `- ${item.description}`}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-bold text-ink">2. VALOR E PAGAMENTO</h4>
                                <p>
                                    O valor total acordado é de <strong className="text-ink">{formatCurrency(application.proposedAmount || 0)}</strong>.
                                    O pagamento será liberado após a entrega e aprovação dos materiais.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="font-bold text-ink">3. PRAZOS</h4>
                                <p>
                                    O serviço deverá ser entregue até <strong>{job.deadline ? formatDate(job.deadline) : 'Data a definir'}</strong>.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-warm-gray-200 bg-warm-gray-50 space-y-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mt-1 w-4 h-4 text-coral rounded focus:ring-coral/20"
                            />
                            <span className="text-sm text-warm-gray-600 select-none">
                                Li e concordo com os termos do contrato, e autorizo a geração automática deste documento legal.
                            </span>
                        </label>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="flex-1"
                            >
                                Cancelar
                            </Button>
                            <Button
                                onClick={handleSign}
                                disabled={!agreed || isSigning}
                                className="flex-[2] bg-ink text-white hover:bg-ink/90"
                            >
                                {isSigning ? 'Processando...' : 'Assinar e Gerar Contrato'}
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
