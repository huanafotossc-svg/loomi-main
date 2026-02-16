import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
    MapPin,
    Star,
    ChevronLeft,
    Phone,
    Globe,
    Instagram,
    Facebook,
    Share2,
    Heart,
    Building2,
    Wifi,
    Coffee,
    Car,
    Wind,
    UtensilsCrossed,
    Briefcase,
} from 'lucide-react';
import { Button, JobCard, Avatar, Toast } from '../components';
import { mockJobs, getHotelById } from '../data/mock';
import { cn } from '../utils/helpers';

export function HotelPublicProfileScreen() {
    const { hotelId } = useParams<{ hotelId: string }>();
    const navigate = useNavigate();
    const [isSaved, setIsSaved] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const hotel = getHotelById(hotelId || '');

    // Get active jobs from this hotel
    const hotelJobs = mockJobs.filter(
        (job) => job.hotelId === hotelId && job.status === 'active'
    );

    if (!hotel) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6">
                <div className="w-20 h-20 bg-warm-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Building2 className="w-10 h-10 text-warm-gray-400" />
                </div>
                <h2 className="text-xl font-semibold text-ink mb-2">Hotel não encontrado</h2>
                <p className="text-warm-gray-500 text-center mb-6">
                    Este hotel não existe ou foi removido.
                </p>
                <Button onClick={() => navigate('/feed')}>Voltar ao feed</Button>
            </div>
        );
    }

    const handleSave = () => {
        setIsSaved(!isSaved);
        setToastMessage(isSaved ? 'Hotel removido dos favoritos' : 'Hotel salvo!');
        setShowToast(true);
    };

    const handleShare = () => {
        setToastMessage('Link copiado para a área de transferência!');
        setShowToast(true);
    };

    const amenityIcons: Record<string, JSX.Element> = {
        'Wi-Fi': <Wifi className="w-5 h-5" />,
        'Café da manhã': <Coffee className="w-5 h-5" />,
        Estacionamento: <Car className="w-5 h-5" />,
        'Ar condicionado': <Wind className="w-5 h-5" />,
        Restaurante: <UtensilsCrossed className="w-5 h-5" />,
        Bar: <UtensilsCrossed className="w-5 h-5" />,
        Piscina: <div className="w-5 h-5 text-center">🏊</div>,
        Lareira: <div className="w-5 h-5 text-center">🔥</div>,
        Spa: <div className="w-5 h-5 text-center">💆</div>,
        'Pet friendly': <div className="w-5 h-5 text-center">🐕</div>,
        Trilhas: <div className="w-5 h-5 text-center">🥾</div>,
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

            {/* Cover Image */}
            <div className="relative h-64">
                <motion.img
                    src={hotel.avatar}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

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

                {/* Hotel Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-3 mb-2">
                        <Avatar src={hotel.avatar} name={hotel.name} size="lg" />
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-white">{hotel.name}</h1>
                            <div className="flex items-center gap-2 text-white/90">
                                <Star className="w-4 h-4 fill-sunshine text-sunshine" />
                                <span className="text-sm font-medium">{hotel.rating}</span>
                                <span className="text-sm">({hotel.reviewCount} avaliações)</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-white/80">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{hotel.location}</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-4 -mt-4 relative z-10">
                {/* Property Type Badge */}
                <div className="flex items-center justify-center mb-4">
                    <div className="px-4 py-2 bg-white rounded-full shadow-card">
                        <span className="text-sm font-medium text-ink">{hotel.propertyType}</span>
                    </div>
                </div>

                {/* About Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-5 shadow-card mb-4"
                >
                    <h2 className="font-semibold text-ink mb-3">Sobre</h2>
                    <p className="text-warm-gray-600 leading-relaxed mb-4">{hotel.bio}</p>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-warm-gray-50 rounded-xl">
                            <p className="text-xs text-warm-gray-500 mb-1">Quartos</p>
                            <p className="text-lg font-semibold text-ink">{hotel.rooms}</p>
                        </div>
                        <div className="p-3 bg-warm-gray-50 rounded-xl">
                            <p className="text-xs text-warm-gray-500 mb-1">Valor em mídia</p>
                            <p className="text-lg font-semibold text-ink">
                                R$ {(hotel.mediaValue / 1000).toFixed(0)}k
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Amenities */}
                {hotel.amenities && hotel.amenities.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-3xl p-5 shadow-card mb-4"
                    >
                        <h2 className="font-semibold text-ink mb-4">Comodidades</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {hotel.amenities.map((amenity, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-3 p-3 bg-warm-gray-50 rounded-xl"
                                >
                                    <div className="w-8 h-8 bg-coral/10 rounded-lg flex items-center justify-center text-coral">
                                        {amenityIcons[amenity] || <Building2 className="w-5 h-5" />}
                                    </div>
                                    <span className="text-sm font-medium text-ink">{amenity}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Contact Info */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl p-5 shadow-card mb-4"
                >
                    <h2 className="font-semibold text-ink mb-4">Contato</h2>
                    <div className="space-y-3">
                        {hotel.phone && (
                            <a
                                href={`tel:${hotel.phone}`}
                                className="flex items-center gap-3 p-3 bg-warm-gray-50 rounded-xl hover:bg-warm-gray-100 transition-colors"
                            >
                                <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-coral" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-warm-gray-500">Telefone</p>
                                    <p className="font-medium text-ink">{hotel.phone}</p>
                                </div>
                            </a>
                        )}

                        {hotel.website && (
                            <a
                                href={hotel.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-warm-gray-50 rounded-xl hover:bg-warm-gray-100 transition-colors"
                            >
                                <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-coral" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-warm-gray-500">Website</p>
                                    <p className="font-medium text-ink">{hotel.website.replace('https://', '')}</p>
                                </div>
                            </a>
                        )}

                        {hotel.socialMedia?.instagram && (
                            <a
                                href={`https://instagram.com/${hotel.socialMedia.instagram.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-warm-gray-50 rounded-xl hover:bg-warm-gray-100 transition-colors"
                            >
                                <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center">
                                    <Instagram className="w-5 h-5 text-coral" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-warm-gray-500">Instagram</p>
                                    <p className="font-medium text-ink">{hotel.socialMedia.instagram}</p>
                                </div>
                            </a>
                        )}

                        {hotel.socialMedia?.facebook && (
                            <a
                                href={`https://facebook.com/${hotel.socialMedia.facebook}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 bg-warm-gray-50 rounded-xl hover:bg-warm-gray-100 transition-colors"
                            >
                                <div className="w-10 h-10 bg-coral/10 rounded-xl flex items-center justify-center">
                                    <Facebook className="w-5 h-5 text-coral" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-warm-gray-500">Facebook</p>
                                    <p className="font-medium text-ink">{hotel.socialMedia.facebook}</p>
                                </div>
                            </a>
                        )}
                    </div>
                </motion.div>

                {/* Active Jobs */}
                {hotelJobs.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white rounded-3xl p-5 shadow-card mb-6"
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Briefcase className="w-5 h-5 text-coral" />
                            <h2 className="font-semibold text-ink">
                                Vagas Ativas ({hotelJobs.length})
                            </h2>
                        </div>
                        <div className="space-y-3">
                            {hotelJobs.map((job) => (
                                <JobCard
                                    key={job.id}
                                    job={job}
                                    hotel={hotel}
                                    onClick={() => navigate(`/job/${job.id}`)}
                                    onSave={() => { }}
                                    isSaved={false}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
