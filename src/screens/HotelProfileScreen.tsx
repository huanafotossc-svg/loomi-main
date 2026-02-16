import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  MapPin, 
  Star, 
  Globe, 
  Instagram, 
  Phone,
  Bed,
  Wifi,
  Coffee,
  Car,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { Button, Avatar } from '../components';
import { mockHotels, mockJobs, mockReviews } from '../data/mock';
import { cn } from '../utils/helpers';

export function HotelProfileScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'about' | 'jobs' | 'reviews'>('about');
  
  // Usando o primeiro hotel como exemplo
  const hotel = mockHotels[0];
  const hotelJobs = mockJobs.filter(job => job.hotelId === hotel.id);
  const hotelReviews = mockReviews.filter(r => r.toId === hotel.id);

  const stats = [
    { label: 'Vagas', value: hotelJobs.length },
    { label: 'Avaliações', value: hotel.reviewCount },
    { label: 'Nota', value: hotel.rating.toFixed(1) },
    { label: 'Quartos', value: hotel.rooms },
  ];

  const amenityIcons: Record<string, React.ElementType> = {
    'Wi-Fi': Wifi,
    'Café da manhã': Coffee,
    'Estacionamento': Car,
    'Spa': Sparkles,
    'Piscina': Sparkles,
    'Restaurante': Coffee,
  };

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
          <h1 className="text-xl font-bold text-ink">Perfil do Hotel</h1>
        </div>
        <button 
          onClick={() => navigate('/edit-profile')}
          className="p-2 hover:bg-warm-gray-100 rounded-full transition-colors"
        >
          <Edit3 className="w-5 h-5 text-warm-gray-600" />
        </button>
      </div>

      {/* Profile Header */}
      <div className="bg-white px-6 pb-6">
        <div className="flex items-start gap-4">
          <Avatar src={hotel.avatar} name={hotel.name} size="xl" />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-ink">{hotel.name}</h2>
            <p className="text-warm-gray-500">{hotel.propertyType}</p>
            <div className="flex items-center gap-1 mt-1 text-warm-gray-500">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{hotel.city}, {hotel.state}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-4 mt-4">
          <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-ink">{hotel.rating}</span>
            <span className="text-sm text-warm-gray-500">({hotel.reviewCount})</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-warm-gray-500">
            <Bed className="w-4 h-4" />
            <span>{hotel.rooms} quartos</span>
          </div>
        </div>

        {/* Contact Actions */}
        <div className="flex gap-3 mt-4">
          {hotel.website && (
            <a 
              href={hotel.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-warm-gray-100 rounded-xl text-ink font-medium hover:bg-warm-gray-200 transition-colors"
            >
              <Globe className="w-5 h-5" />
              Website
            </a>
          )}
          {hotel.socialMedia?.instagram && (
            <a 
              href={`https://instagram.com/${hotel.socialMedia.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
            >
              <Instagram className="w-5 h-5" />
              Instagram
            </a>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 -mt-2">
        <div className="bg-white rounded-2xl p-4 shadow-card grid grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-xl font-bold text-ink">{stat.value}</p>
              <p className="text-xs text-warm-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4">
        <div className="flex gap-2 bg-white rounded-xl p-1">
          {[
            { id: 'about', label: 'Sobre' },
            { id: 'jobs', label: 'Vagas' },
            { id: 'reviews', label: 'Avaliações' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-coral text-white'
                  : 'text-warm-gray-600 hover:text-ink'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 mt-4">
        {activeTab === 'about' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* Description */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <h3 className="font-semibold text-ink mb-3">Sobre</h3>
              <p className="text-warm-gray-600 leading-relaxed">
                {hotel.bio}
              </p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <h3 className="font-semibold text-ink mb-3">Comodidades</h3>
              <div className="flex flex-wrap gap-2">
                {hotel.amenities.map((amenity, index) => {
                  const Icon = amenityIcons[amenity] || Sparkles;
                  return (
                    <span 
                      key={index}
                      className="flex items-center gap-1.5 px-3 py-2 bg-warm-gray-100 rounded-lg text-sm text-warm-gray-700"
                    >
                      <Icon className="w-4 h-4" />
                      {amenity}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl p-5 shadow-card">
              <h3 className="font-semibold text-ink mb-3">Endereço</h3>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-coral flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-ink">{hotel.address}</p>
                  <p className="text-warm-gray-500">{hotel.city}, {hotel.state}</p>
                </div>
              </div>
              {hotel.phone && (
                <div className="flex items-center gap-3 mt-3">
                  <Phone className="w-5 h-5 text-coral flex-shrink-0" />
                  <p className="text-ink">{hotel.phone}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'jobs' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {hotelJobs.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-card">
                <p className="text-warm-gray-500">Nenhuma vaga publicada ainda</p>
                <Button 
                  onClick={() => navigate('/create-job')}
                  className="mt-4"
                  size="sm"
                >
                  Criar primeira vaga
                </Button>
              </div>
            ) : (
              hotelJobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => navigate(`/job/${job.id}`)}
                  className="w-full bg-white rounded-2xl p-4 shadow-card text-left hover:shadow-floating transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-ink line-clamp-1">{job.title}</h4>
                      <p className="text-sm text-warm-gray-500 mt-1">{job.location}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-xs font-medium',
                          job.status === 'active' && 'bg-green-100 text-green-700',
                          job.status === 'paused' && 'bg-yellow-100 text-yellow-700',
                          job.status === 'closed' && 'bg-warm-gray-100 text-warm-gray-600',
                        )}>
                          {job.status === 'active' ? 'Ativa' : job.status === 'paused' ? 'Pausada' : 'Encerrada'}
                        </span>
                        <span className="text-xs text-warm-gray-500">
                          {job.applicationsCount} candidaturas
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-warm-gray-400 flex-shrink-0" />
                  </div>
                </button>
              ))
            )}
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            {hotelReviews.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center shadow-card">
                <p className="text-warm-gray-500">Ainda não há avaliações</p>
              </div>
            ) : (
              hotelReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white rounded-2xl p-4 shadow-card"
                >
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={cn(
                          'w-4 h-4',
                          i < review.rating 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-warm-gray-300'
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-warm-gray-700 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
