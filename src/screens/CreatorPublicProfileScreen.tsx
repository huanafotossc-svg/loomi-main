import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MapPin,
    Star,
    ChevronLeft,
    Share2,
    Heart,
    Briefcase,
    Camera,
    Video,
    Sparkles,
    Package,
    Check,
    Calendar,
    User
} from 'lucide-react';
import { Button, Avatar, Toast, Modal } from '../components';
import { mockCreators, getCreatorById } from '../data/mock';
import { cn, formatCurrency } from '../utils/helpers';

// Service Package Interface
interface ServicePackage {
    id: string;
    title: string;
    price: number;
    deliverables: string[];
    icon: 'camera' | 'video' | 'full';
}

export function CreatorPublicProfileScreen() {
    const { creatorId } = useParams<{ creatorId: string }>();
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    // Booking Modal States
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<ServicePackage | null>(null);
    const [bookingDate, setBookingDate] = useState('');

    const creator = getCreatorById(creatorId || '') || mockCreators[0];

    // Mock Service Packages (in production, this would come from the creator's data)
    const servicePackages: ServicePackage[] = [
        {
            id: 'pkg-a',
            title: 'Sessão Express',
            price: 400,
            deliverables: ['10 Fotos Editadas', 'Entrega em 24h'],
            icon: 'camera'
        },
        {
            id: 'pkg-b',
            title: 'Reels Maker',
            price: 600,
            deliverables: ['1 Vídeo Editado', '5 Stories Adaptados'],
            icon: 'video'
        },
        {
            id: 'pkg-c',
            title: 'Diária Completa',
            price: 1500,
            deliverables: ['Fotos Ilimitadas', 'Drone Aéreo', 'Vídeo Institucional'],
            icon: 'full'
        }
    ];

    if (!creator) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6">
                <div className="w-20 h-20 bg-warm-gray-100 rounded-full flex items-center justify-center mb-4">
                    <User className="w-10 h-10 text-warm-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-ink mb-2">Creator não encontrado</h2>
                <p className="text-warm-gray-500 text-center mb-6">
                    Este perfil não existe ou foi removido.
                </p>
                <Button onClick={() => navigate('/dashboard')}>Voltar ao dashboard</Button>
            </div>
        );
    }

    const handleSave = () => {
        setIsSaved(!isSaved);
        setToastMessage(isSaved ? 'Creator removido dos favoritos' : 'Creator salvo!');
        setShowToast(true);
    };

    const handleShare = () => {
        setToastMessage('Link copiado para a área de transferência!');
        setShowToast(true);
    };

    const handleRequestBooking = (pkg: ServicePackage) => {
        setSelectedPackage(pkg);
        setShowBookingModal(true);
    };

    const handleSubmitBooking = () => {
        console.log('Booking submitted:', { package: selectedPackage, date: bookingDate, creator: creator.name });
        setShowBookingModal(false);
        setSelectedPackage(null);
        setBookingDate('');
        setToastMessage('Solicitação enviada com sucesso!');
        setShowToast(true);
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

    const getTagLabel = (tag: string) => {
        switch (tag) {
            case 'photographer':
                return 'Fotógrafo';
            case 'videomaker':
                return 'Videomaker';
            case 'creator':
                return 'Content Creator';
            default:
                return tag;
        }
    };

    return (
        <div className="bg-porcelain pb-24">
            {/* Toast */}
            <Toast
                message={toastMessage}
                type="success"
                isVisible={showToast}
                onClose={() => setShowToast(false)}
            />

            {/* Cover / Header */}
            <div className="relative h-48 bg-gradient-to-br from-coral to-rose-500">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Top Actions */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <motion.button
                        onClick={() => navigate(-1)}
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-ink"
                        whileTap={{ scale: 0.9 }}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </motion.button>

                    <div className="flex items-center gap-2">
                        <motion.button
                            onClick={handleShare}
                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-ink"
                            whileTap={{ scale: 0.9 }}
                        >
                            <Share2 className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                            onClick={handleSave}
                            className={cn(
                                'p-2 rounded-full backdrop-blur-sm',
                                isSaved ? 'bg-coral text-white' : 'bg-white/90 text-ink'
                            )}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Heart className={cn('w-5 h-5', isSaved && 'fill-current')} />
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Profile Card */}
            <div className="px-4 -mt-16 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 shadow-card"
                >
                    <div className="flex items-start gap-4">
                        <Avatar
                            src={creator.avatar}
                            name={creator.name}
                            size="xl"
                            showStatus
                            status="online"
                        />
                        <div className="flex-1">
                            <h1 className="text-xl font-bold text-ink mb-1">{creator.name}</h1>
                            <div className="flex flex-wrap gap-1 mb-2">
                                {creator.tags?.map(tag => (
                                    <span key={tag} className="px-2 py-0.5 bg-coral/10 text-coral text-xs rounded-md font-medium">
                                        {getTagLabel(tag)}
                                    </span>
                                ))}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-warm-gray-500">
                                <MapPin className="w-4 h-4" />
                                <span>{creator.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <p className="text-warm-gray-600 mt-4 leading-relaxed">{creator.bio}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-warm-gray-100">
                        <div className="text-center">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <p className="text-lg font-bold text-ink">{creator.completedJobs || 0}</p>
                            <p className="text-xs text-warm-gray-500">Jobs</p>
                        </div>
                        <div className="text-center">
                            <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <Star className="w-5 h-5" />
                            </div>
                            <p className="text-lg font-bold text-ink">{creator.rating?.toFixed(1) || '5.0'}</p>
                            <p className="text-xs text-warm-gray-500">Avaliação</p>
                        </div>
                        <div className="text-center">
                            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2">
                                <Camera className="w-5 h-5" />
                            </div>
                            <p className="text-lg font-bold text-ink">{creator.portfolio?.length || 0}</p>
                            <p className="text-xs text-warm-gray-500">Projetos</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Service Packages Section */}
            <div className="px-4 mt-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-3xl p-5 shadow-card shadow-coral/5"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Package className="w-5 h-5 text-coral" />
                        <h2 className="font-bold text-ink">Pacotes de Serviço</h2>
                    </div>

                    <div className="space-y-3">
                        {servicePackages.map((pkg) => (
                            <motion.div
                                key={pkg.id}
                                whileHover={{ scale: 1.01 }}
                                className="p-4 bg-gradient-to-br from-warm-gray-50 to-white border-2 border-warm-gray-100 rounded-2xl hover:border-coral/30 transition-colors"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-coral/10 rounded-xl flex items-center justify-center text-coral flex-shrink-0">
                                        {getPackageIcon(pkg.icon)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-ink">{pkg.title}</h3>
                                            <span className="text-lg font-bold text-coral">
                                                {formatCurrency(pkg.price)}
                                            </span>
                                        </div>
                                        <ul className="space-y-1 mb-3">
                                            {pkg.deliverables.map((item, idx) => (
                                                <li key={idx} className="flex items-center gap-2 text-sm text-warm-gray-600">
                                                    <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                        <Button
                                            onClick={() => handleRequestBooking(pkg)}
                                            variant="outline"
                                            size="sm"
                                            className="w-full border-coral text-coral hover:bg-coral hover:text-white"
                                        >
                                            Solicitar Reserva
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Portfolio Preview */}
            {creator.portfolio && creator.portfolio.length > 0 && (
                <div className="px-4 mt-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-3xl p-5 shadow-card"
                    >
                        <h2 className="font-bold text-ink mb-4">Portfólio</h2>
                        <div className="grid grid-cols-3 gap-2">
                            {creator.portfolio.slice(0, 6).map((item, index) => (
                                <div
                                    key={item.id || index}
                                    className="aspect-square rounded-xl overflow-hidden"
                                >
                                    <img
                                        src={item.images?.[0] || `https://source.unsplash.com/random/200x200?sig=${index}`}
                                        alt={item.title}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Booking Confirmation Modal */}
            <Modal
                isOpen={showBookingModal}
                onClose={() => {
                    setShowBookingModal(false);
                    setSelectedPackage(null);
                    setBookingDate('');
                }}
                title="Solicitar Reserva"
            >
                {selectedPackage && (
                    <div className="space-y-6">
                        {/* Summary */}
                        <div className="bg-warm-gray-50 rounded-2xl p-4">
                            <p className="text-sm text-warm-gray-600 mb-2">Você está solicitando:</p>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-coral/10 rounded-xl flex items-center justify-center text-coral">
                                    {getPackageIcon(selectedPackage.icon)}
                                </div>
                                <div>
                                    <h4 className="font-bold text-ink">{selectedPackage.title}</h4>
                                    <p className="text-coral font-semibold">{formatCurrency(selectedPackage.price)}</p>
                                </div>
                            </div>
                            <p className="text-sm text-warm-gray-500 mt-3">
                                com <span className="font-medium text-ink">{creator.name}</span>
                            </p>
                        </div>

                        {/* Deliverables Summary */}
                        <div>
                            <p className="text-sm font-medium text-ink mb-2">O que está incluso:</p>
                            <ul className="space-y-1.5">
                                {selectedPackage.deliverables.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-sm text-warm-gray-600">
                                        <Check className="w-4 h-4 text-green-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Date Selector */}
                        <div>
                            <label className="block text-sm font-medium text-ink mb-2">
                                <Calendar className="w-4 h-4 inline mr-2" />
                                Para quando você precisa?
                            </label>
                            <input
                                type="date"
                                value={bookingDate}
                                onChange={(e) => setBookingDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-3 bg-warm-gray-50 border-2 border-warm-gray-200 rounded-xl focus:border-coral focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Submit Button */}
                        <Button
                            onClick={handleSubmitBooking}
                            disabled={!bookingDate}
                            className="w-full"
                        >
                            Enviar Solicitação de Reserva
                        </Button>

                        <p className="text-xs text-warm-gray-400 text-center">
                            O creator receberá sua solicitação e poderá confirmar ou sugerir uma nova data.
                        </p>
                    </div>
                )}
            </Modal>
        </div>
    );
}
