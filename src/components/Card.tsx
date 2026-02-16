import { motion } from 'framer-motion';
import { cn } from '../utils/helpers';
import { Heart, MapPin, Star } from 'lucide-react';
import { Avatar } from './Avatar';
import type { Job, Creator, Hotel } from '../types';
import { formatCurrency, formatRelativeTime, truncateText } from '../utils/helpers';

// Editorial Job Type Label
function getEditorialTypeLabel(type: string) {
  const map: Record<string, string> = {
    permuta: 'Permuta',
    cache: 'Cachê',
    hibrido: 'Híbrido',
  };
  return map[type] || type;
}

// Job Card Component — Editorial Premium
interface JobCardProps {
  job: Job;
  hotel?: Hotel;
  onClick?: () => void;
  onSave?: () => void;
  isSaved?: boolean;
  className?: string;
  variant?: 'default' | 'compact';
}

export function JobCard({ job, hotel, onClick, onSave, isSaved = false, className, variant = 'default' }: JobCardProps) {
  const displayHotel = hotel || { name: 'Hotel', city: '', rating: 0, reviewCount: 0, avatar: '' };
  const isCompact = variant === 'compact';

  return (
    <motion.article
      onClick={onClick}
      className={cn(
        'relative rounded-2xl overflow-hidden cursor-pointer card-hover',
        'bg-white/60 backdrop-blur-sm',
        className
      )}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileTap={{ scale: 0.985 }}
    >
      {/* Image — dominant */}
      <div className={cn('relative overflow-hidden', isCompact ? 'h-48' : 'h-64')}>
        <motion.img
          src={job.coverImage}
          alt={job.title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* Gradient overlay — subtle, editorial */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

        {/* Top row: badge left, rating right */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-start justify-between">
          {/* Type Badge — minimal glass */}
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide bg-white/80 backdrop-blur-sm text-stone shadow-soft">
            {getEditorialTypeLabel(job.type)}
          </span>

          {/* Rating capsule */}
          {displayHotel.rating > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-white/85 backdrop-blur-sm text-ink shadow-soft">
              <Star className="w-3 h-3 fill-current text-amber-500" />
              {displayHotel.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Save Button */}
        {onSave && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onSave();
            }}
            className={cn(
              'absolute top-3.5 right-3.5 p-2 rounded-full transition-colors duration-300',
              displayHotel.rating > 0 ? 'top-12' : 'top-3.5',
              isSaved ? 'bg-terracotta text-white' : 'bg-white/80 backdrop-blur-sm text-stone'
            )}
            whileTap={{ scale: 0.9 }}
          >
            <Heart className={cn('w-4 h-4', isSaved && 'fill-current')} />
          </motion.button>
        )}

        {/* Bottom overlay content: title + location */}
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-5">
          <h3 className="font-serif text-xl text-white leading-snug mb-1.5">
            {truncateText(job.title, 55)}
          </h3>
          <div className="flex items-center gap-1.5 text-white/70">
            <MapPin className="w-3 h-3" strokeWidth={1.5} />
            <span className="text-xs tracking-wider uppercase">{job.location}</span>
          </div>
        </div>
      </div>

      {/* Content below image — generous spacing */}
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <Avatar src={displayHotel.avatar || ''} name={displayHotel.name} size="xs" />
          <span className="text-sm text-stone/70 font-light">{displayHotel.name}</span>
        </div>

        {/* Benefits */}
        <div className="flex items-center gap-3 text-sm">
          {job.benefits.cashValue ? (
            <span className="font-medium text-forest">
              {formatCurrency(job.benefits.cashValue)}
            </span>
          ) : (
            <span className="font-medium text-forest">
              {job.benefits.stayNights} {job.benefits.stayNights === 1 ? 'diária' : 'diárias'}
            </span>
          )}
          <span className="w-1 h-1 rounded-full bg-stone/20" />
          <span className="text-stone/50 text-xs">
            {job.applicationsCount} candidat{job.applicationsCount === 1 ? 'o' : 'as'}
          </span>
        </div>

        {/* Deadline — no hard border, just spacing */}
        {job.deadline && (
          <div className="mt-4 pt-0">
            <span className="text-[11px] text-stone/40 tracking-wide">
              Até {formatRelativeTime(job.deadline)}
            </span>
          </div>
        )}
      </div>
    </motion.article>
  );
}

// Featured Job Card — Editorial Hero
interface FeaturedJobCardProps {
  job: Job;
  hotel?: Hotel;
  onClick?: () => void;
  className?: string;
}

export function FeaturedJobCard({ job, hotel, onClick, className }: FeaturedJobCardProps) {
  const displayHotel = hotel || { name: 'Hotel', city: '', rating: 0, reviewCount: 0, avatar: '' };

  return (
    <motion.article
      onClick={onClick}
      className={cn(
        'relative rounded-2xl overflow-hidden cursor-pointer card-hover',
        'h-[420px]',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileTap={{ scale: 0.985 }}
    >
      <motion.img
        src={job.coverImage}
        alt={job.title}
        className="absolute inset-0 w-full h-full object-cover"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
      />

      {/* Long, soft gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between">
        {/* Top */}
        <div className="flex items-start justify-between">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide bg-white/80 backdrop-blur-sm text-stone shadow-soft">
            {getEditorialTypeLabel(job.type)}
          </span>
          {displayHotel.rating > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium bg-white/85 backdrop-blur-sm text-ink shadow-soft">
              <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
              {displayHotel.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Bottom */}
        <div>
          <h3 className="font-serif text-2xl text-white leading-snug mb-2">
            {truncateText(job.title, 65)}
          </h3>

          <div className="flex items-center gap-1.5 text-white/60 mb-4">
            <MapPin className="w-3 h-3" strokeWidth={1.5} />
            <span className="text-xs tracking-widest uppercase">{job.location}</span>
          </div>

          <div className="flex items-center gap-3">
            <Avatar src={displayHotel.avatar || ''} name={displayHotel.name} size="sm" />
            <div className="text-white">
              <p className="text-sm font-light opacity-80">{displayHotel.name}</p>
              {job.benefits.cashValue ? (
                <p className="text-base font-medium">
                  {formatCurrency(job.benefits.cashValue)}
                </p>
              ) : (
                <p className="text-sm font-light opacity-70">
                  {job.benefits.stayNights} diárias
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// Creator Card
interface CreatorCardProps {
  creator: Creator;
  onClick?: () => void;
  className?: string;
}

export function CreatorCard({ creator, onClick, className }: CreatorCardProps) {
  return (
    <motion.article
      onClick={onClick}
      className={cn(
        'bg-white/60 backdrop-blur-sm rounded-2xl p-5 shadow-card cursor-pointer card-hover',
        className
      )}
      whileTap={{ scale: 0.985 }}
    >
      <div className="flex items-start gap-4">
        <Avatar
          src={creator.avatar}
          name={creator.name}
          size="lg"
          showStatus
          status="online"
        />

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-ink truncate">{creator.name}</h3>
          <p className="text-sm text-stone/60 truncate">{creator.location}</p>

          <div className="flex items-center gap-1.5 mt-1.5">
            <Star className="w-3.5 h-3.5 fill-current text-amber-500" />
            <span className="text-sm font-medium text-ink">{creator.rating}</span>
            <span className="text-xs text-stone/40">
              ({creator.reviewCount})
            </span>
          </div>
        </div>
      </div>

      {/* Equipment Tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {creator.equipment.slice(0, 3).map((eq) => (
          <span
            key={eq}
            className="px-2.5 py-1 bg-linen text-stone/60 text-xs rounded-lg font-light tracking-wide"
          >
            {eq.toUpperCase()}
          </span>
        ))}
        {creator.equipment.length > 3 && (
          <span className="px-2.5 py-1 bg-linen text-stone/40 text-xs rounded-lg">
            +{creator.equipment.length - 3}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-stone/8 flex items-center justify-between text-sm">
        <span className="text-stone/50 font-light">
          {creator.completedJobs} jobs
        </span>
        <span className="font-medium text-forest text-xs tracking-wide">
          {creator.creatorType === 'pro' ? 'Pro' : 'Creator'}
        </span>
      </div>
    </motion.article>
  );
}

// Hotel Card
interface HotelCardProps {
  hotel: Hotel;
  onClick?: () => void;
  className?: string;
}

export function HotelCard({ hotel, onClick, className }: HotelCardProps) {
  return (
    <motion.article
      onClick={onClick}
      className={cn(
        'bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-card cursor-pointer card-hover',
        className
      )}
      whileTap={{ scale: 0.985 }}
    >
      <div className="relative h-40 overflow-hidden">
        <motion.img
          src={hotel.avatar}
          alt={hotel.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.8 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />

        <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-end justify-between">
          <div>
            <h3 className="font-serif text-lg text-white">{hotel.name}</h3>
            <p className="text-white/60 text-xs tracking-wider uppercase">{hotel.city}, {hotel.state}</p>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-white/85 backdrop-blur-sm text-ink">
            <Star className="w-3 h-3 fill-current text-amber-500" />
            {hotel.rating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-4">
          {hotel.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity}
              className="px-2.5 py-1 bg-linen text-stone/60 text-xs rounded-lg font-light"
            >
              {amenity}
            </span>
          ))}
          {hotel.amenities.length > 3 && (
            <span className="px-2.5 py-1 bg-linen text-stone/40 text-xs rounded-lg">
              +{hotel.amenities.length - 3}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-stone/50 font-light">{hotel.rooms} quartos</span>
          <span className="font-medium text-forest text-xs tracking-wide">{hotel.propertyType}</span>
        </div>
      </div>
    </motion.article>
  );
}

// Skeleton Card for loading states
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white/40 rounded-2xl overflow-hidden', className)}>
      <div className="h-64 skeleton" />
      <div className="p-5 space-y-3">
        <div className="h-5 skeleton w-3/4 rounded-lg" />
        <div className="h-4 skeleton w-1/2 rounded-lg" />
        <div className="flex gap-2">
          <div className="h-5 skeleton w-16 rounded-full" />
          <div className="h-5 skeleton w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
