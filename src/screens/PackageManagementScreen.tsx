import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Plus,
    Edit3,
    Trash2,
    Camera,
    Video,
    Sparkles,
    Package,
    Check,
    X,
    DollarSign,
    FileText
} from 'lucide-react';
import { Button, Modal } from '../components';
import { cn, formatCurrency } from '../utils/helpers';

// Service Package Interface
interface ServicePackage {
    id: string;
    title: string;
    price: number;
    deliverables: string[];
    icon: 'camera' | 'video' | 'full';
    isActive: boolean;
}

// Icon options for packages
const iconOptions = [
    { id: 'camera', label: 'Fotografia', icon: Camera },
    { id: 'video', label: 'Vídeo', icon: Video },
    { id: 'full', label: 'Pacote Completo', icon: Sparkles },
];

export function PackageManagementScreen() {
    const navigate = useNavigate();

    // Initial mock packages
    const [packages, setPackages] = useState<ServicePackage[]>([
        {
            id: 'pkg-a',
            title: 'Sessão Express',
            price: 400,
            deliverables: ['10 Fotos Editadas', 'Entrega em 24h'],
            icon: 'camera',
            isActive: true
        },
        {
            id: 'pkg-b',
            title: 'Reels Maker',
            price: 600,
            deliverables: ['1 Vídeo Editado', '5 Stories Adaptados'],
            icon: 'video',
            isActive: true
        },
        {
            id: 'pkg-c',
            title: 'Diária Completa',
            price: 1500,
            deliverables: ['Fotos Ilimitadas', 'Drone Aéreo', 'Vídeo Institucional'],
            icon: 'full',
            isActive: true
        }
    ]);

    // Modal states
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);
    const [deletePackageId, setDeletePackageId] = useState<string | null>(null);

    // Form states
    const [formTitle, setFormTitle] = useState('');
    const [formPrice, setFormPrice] = useState('');
    const [formIcon, setFormIcon] = useState<'camera' | 'video' | 'full'>('camera');
    const [formDeliverables, setFormDeliverables] = useState<string[]>(['']);

    const resetForm = () => {
        setFormTitle('');
        setFormPrice('');
        setFormIcon('camera');
        setFormDeliverables(['']);
    };

    const getPackageIcon = (iconType: string) => {
        switch (iconType) {
            case 'camera':
                return <Camera className="w-5 h-5" />;
            case 'video':
                return <Video className="w-5 h-5" />;
            case 'full':
                return <Sparkles className="w-5 h-5" />;
            default:
                return <Package className="w-5 h-5" />;
        }
    };

    const handleAddDeliverable = () => {
        setFormDeliverables([...formDeliverables, '']);
    };

    const handleRemoveDeliverable = (index: number) => {
        if (formDeliverables.length > 1) {
            setFormDeliverables(formDeliverables.filter((_, i) => i !== index));
        }
    };

    const handleDeliverableChange = (index: number, value: string) => {
        const updated = [...formDeliverables];
        updated[index] = value;
        setFormDeliverables(updated);
    };

    const handleCreatePackage = () => {
        if (!formTitle || !formPrice) return;

        const newPackage: ServicePackage = {
            id: `pkg-${Date.now()}`,
            title: formTitle,
            price: parseFloat(formPrice),
            deliverables: formDeliverables.filter(d => d.trim() !== ''),
            icon: formIcon,
            isActive: true
        };

        setPackages([...packages, newPackage]);
        setShowAddModal(false);
        resetForm();
    };

    const handleEditPackage = () => {
        if (!editingPackage || !formTitle || !formPrice) return;

        setPackages(packages.map(pkg =>
            pkg.id === editingPackage.id
                ? {
                    ...pkg,
                    title: formTitle,
                    price: parseFloat(formPrice),
                    deliverables: formDeliverables.filter(d => d.trim() !== ''),
                    icon: formIcon
                }
                : pkg
        ));
        setShowEditModal(false);
        setEditingPackage(null);
        resetForm();
    };

    const handleDeletePackage = () => {
        if (!deletePackageId) return;
        setPackages(packages.filter(pkg => pkg.id !== deletePackageId));
        setShowDeleteModal(false);
        setDeletePackageId(null);
    };

    const openEditModal = (pkg: ServicePackage) => {
        setEditingPackage(pkg);
        setFormTitle(pkg.title);
        setFormPrice(pkg.price.toString());
        setFormIcon(pkg.icon);
        setFormDeliverables(pkg.deliverables.length > 0 ? pkg.deliverables : ['']);
        setShowEditModal(true);
    };

    const openDeleteModal = (pkgId: string) => {
        setDeletePackageId(pkgId);
        setShowDeleteModal(true);
    };

    const togglePackageActive = (pkgId: string) => {
        setPackages(packages.map(pkg =>
            pkg.id === pkgId ? { ...pkg, isActive: !pkg.isActive } : pkg
        ));
    };

    return (
        <div className="min-h-screen bg-porcelain pb-24">
            {/* Header */}
            <div className="bg-white px-4 py-4 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 -ml-2 hover:bg-warm-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-ink">Meus Pacotes</h1>
                        <p className="text-sm text-warm-gray-500">{packages.length} pacotes cadastrados</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowAddModal(true);
                    }}
                    className="p-2.5 bg-coral text-white rounded-xl hover:bg-opacity-90 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            {/* Info Banner */}
            <div className="px-4 mt-4">
                <div className="bg-gradient-to-r from-coral/10 to-rose-100 rounded-2xl p-4 border border-coral/20">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-coral/20 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-coral" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-ink mb-1">Venda seus serviços diretamente</h3>
                            <p className="text-sm text-warm-gray-600">
                                Crie pacotes de serviço para que hotéis possam te contratar diretamente pelo seu perfil.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Package List */}
            <div className="px-4 mt-6">
                {packages.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-warm-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-10 h-10 text-warm-gray-400" />
                        </div>
                        <h3 className="font-semibold text-ink mb-2">Nenhum pacote cadastrado</h3>
                        <p className="text-sm text-warm-gray-500 mb-4">
                            Crie seu primeiro pacote de serviço para começar a receber reservas diretas.
                        </p>
                        <Button
                            onClick={() => {
                                resetForm();
                                setShowAddModal(true);
                            }}
                            leftIcon={<Plus className="w-5 h-5" />}
                        >
                            Criar Pacote
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {packages.map((pkg, index) => (
                                <motion.div
                                    key={pkg.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -100 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={cn(
                                        "bg-white rounded-2xl p-5 shadow-card border-2 transition-colors",
                                        pkg.isActive ? "border-transparent" : "border-warm-gray-200 opacity-60"
                                    )}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className={cn(
                                            "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                                            pkg.isActive ? "bg-coral/10 text-coral" : "bg-warm-gray-100 text-warm-gray-400"
                                        )}>
                                            {getPackageIcon(pkg.icon)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-bold text-ink">{pkg.title}</h3>
                                                <span className={cn(
                                                    "text-lg font-bold",
                                                    pkg.isActive ? "text-coral" : "text-warm-gray-400"
                                                )}>
                                                    {formatCurrency(pkg.price)}
                                                </span>
                                            </div>

                                            {/* Deliverables */}
                                            <ul className="space-y-1 mt-2">
                                                {pkg.deliverables.map((item, idx) => (
                                                    <li key={idx} className="flex items-center gap-2 text-sm text-warm-gray-600">
                                                        <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* Status Badge */}
                                            <div className="flex items-center gap-2 mt-3">
                                                <button
                                                    onClick={() => togglePackageActive(pkg.id)}
                                                    className={cn(
                                                        "px-3 py-1 rounded-full text-xs font-medium transition-colors",
                                                        pkg.isActive
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-warm-gray-100 text-warm-gray-500"
                                                    )}
                                                >
                                                    {pkg.isActive ? 'Ativo' : 'Inativo'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-warm-gray-100">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            leftIcon={<Edit3 className="w-4 h-4" />}
                                            onClick={() => openEditModal(pkg)}
                                        >
                                            Editar
                                        </Button>
                                        <button
                                            onClick={() => openDeleteModal(pkg.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Add/Edit Modal Form */}
            {(showAddModal || showEditModal) && (
                <Modal
                    isOpen={showAddModal || showEditModal}
                    onClose={() => {
                        setShowAddModal(false);
                        setShowEditModal(false);
                        setEditingPackage(null);
                        resetForm();
                    }}
                    title={showAddModal ? "Criar Novo Pacote" : "Editar Pacote"}
                >
                    <div className="space-y-5 max-h-[70vh] overflow-y-auto">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-ink mb-2">
                                Nome do Pacote *
                            </label>
                            <input
                                type="text"
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                                placeholder="Ex: Sessão Express, Diária Completa..."
                                className="w-full px-4 py-3 bg-warm-gray-50 border-2 border-transparent rounded-xl focus:border-coral focus:bg-white focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-ink mb-2">
                                <DollarSign className="w-4 h-4 inline mr-1" />
                                Preço (R$) *
                            </label>
                            <input
                                type="number"
                                value={formPrice}
                                onChange={(e) => setFormPrice(e.target.value)}
                                placeholder="0"
                                min="0"
                                step="50"
                                className="w-full px-4 py-3 bg-warm-gray-50 border-2 border-transparent rounded-xl focus:border-coral focus:bg-white focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Icon Selection */}
                        <div>
                            <label className="block text-sm font-medium text-ink mb-2">
                                Tipo de Serviço
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {iconOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setFormIcon(option.id as 'camera' | 'video' | 'full')}
                                        className={cn(
                                            "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-colors",
                                            formIcon === option.id
                                                ? "border-coral bg-coral/5 text-coral"
                                                : "border-warm-gray-200 text-warm-gray-600 hover:border-coral/50"
                                        )}
                                    >
                                        <option.icon className="w-6 h-6" />
                                        <span className="text-xs font-medium">{option.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Deliverables */}
                        <div>
                            <label className="block text-sm font-medium text-ink mb-2">
                                <FileText className="w-4 h-4 inline mr-1" />
                                Entregáveis
                            </label>
                            <div className="space-y-2">
                                {formDeliverables.map((deliverable, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={deliverable}
                                            onChange={(e) => handleDeliverableChange(index, e.target.value)}
                                            placeholder="Ex: 10 Fotos Editadas"
                                            className="flex-1 px-4 py-2.5 bg-warm-gray-50 border-2 border-transparent rounded-xl focus:border-coral focus:bg-white focus:outline-none transition-colors text-sm"
                                        />
                                        {formDeliverables.length > 1 && (
                                            <button
                                                onClick={() => handleRemoveDeliverable(index)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    onClick={handleAddDeliverable}
                                    className="w-full py-2 border-2 border-dashed border-warm-gray-300 rounded-xl text-sm text-warm-gray-500 hover:border-coral hover:text-coral transition-colors"
                                >
                                    + Adicionar entregável
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => {
                                    setShowAddModal(false);
                                    setShowEditModal(false);
                                    setEditingPackage(null);
                                    resetForm();
                                }}
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={showAddModal ? handleCreatePackage : handleEditPackage}
                                disabled={!formTitle || !formPrice}
                            >
                                {showAddModal ? 'Criar Pacote' : 'Salvar'}
                            </Button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => {
                    setShowDeleteModal(false);
                    setDeletePackageId(null);
                }}
                title="Excluir Pacote?"
            >
                <div className="text-center py-4">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trash2 className="w-8 h-8 text-red-500" />
                    </div>
                    <p className="text-warm-gray-600 mb-6">
                        Tem certeza que deseja excluir este pacote? Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                                setShowDeleteModal(false);
                                setDeletePackageId(null);
                            }}
                        >
                            Cancelar
                        </Button>
                        <Button
                            className="flex-1 bg-red-500 hover:bg-red-600"
                            onClick={handleDeletePackage}
                        >
                            Excluir
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
