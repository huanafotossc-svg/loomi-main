import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Bell, Camera, Video, Smartphone } from 'lucide-react';
import {
  FilterPills,
  JobTypeFilter,
  JobCard,
  FeaturedJobCard,
  SkeletonCard,
  EmptyJobs,
  Avatar,
  PremiumBadge
} from '../components';
import { mockJobs, getHotelById } from '../data/mock';
import { cn } from '../utils/helpers';
import type { JobType, Job, Creator } from '../types';
import { useAuth } from '../context/AuthContext';

// Editorial quotes to be interspersed in the feed
const EDITORIAL_QUOTES = [
  "A criatividade é a inteligência se divertindo.",
  "O design não é apenas o que se vê e o que se sente. O design é a forma como funciona.",
  "Simplicidade é a sofisticação máxima.",
  "Faça menos, mas faça melhor.",
  "A inspiração existe, mas ela tem que te encontrar trabalhando."
];

export function FeedScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedTypes, setSelectedTypes] = useState<JobType[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isLoading] = useState(false);

  // Cast user to Creator to access tags
  const creator = user as Creator;
  const userTags = useMemo(() => creator?.tags || [], [creator?.tags]);

  // Filter pills
  const filterPills = [
    { id: 'recent', label: 'Mais recentes', icon: null },
    { id: 'nearby', label: 'Próximos', icon: <MapPin className="w-3.5 h-3.5" /> },
    { id: 'high-value', label: 'Maior valor', icon: null },
    { id: 'short-deadline', label: 'Prazo curto', icon: null },
  ];

  // Helper function to calculate job relevance score based on user tags
  const getJobScore = useCallback((job: Job) => {
    let score = 0;

    // Base relevance from requirements
    const hasPhotoReq = job.requirements.deliverables.some(d => d.type === 'photos');
    const hasVideoReq = job.requirements.deliverables.some(d => d.type === 'institutional' || d.type === 'drone');
    const hasSocialReq = job.requirements.deliverables.some(d => d.type === 'reels');

    // Matching user tags boosts score significantly
    if (userTags.includes('photographer') && hasPhotoReq) score += 10;
    if (userTags.includes('videomaker') && hasVideoReq) score += 10;
    if (userTags.includes('creator') && hasSocialReq) score += 10;

    return score;
  }, [userTags]);

  const getJobIcon = (job: Job) => {
    const hasPhotoReq = job.requirements.deliverables.some(d => d.type === 'photos');
    const hasVideoReq = job.requirements.deliverables.some(d => d.type === 'institutional' || d.type === 'drone');
    const hasSocialReq = job.requirements.deliverables.some(d => d.type === 'reels');

    if (userTags.includes('videomaker') && hasVideoReq) return <Video className="w-5 h-5" />;
    if (userTags.includes('photographer') && hasPhotoReq) return <Camera className="w-5 h-5" />;
    if (userTags.includes('creator') && hasSocialReq) return <Smartphone className="w-5 h-5" />;

    if (hasVideoReq) return <Video className="w-5 h-5" />;
    if (hasSocialReq) return <Smartphone className="w-5 h-5" />;
    return <Camera className="w-5 h-5" />;
  };

  // Filter and Sort jobs
  const filteredJobs = useMemo(() => {
    let jobs = [...mockJobs];

    // 1. Filter by Type (Tabs)
    if (selectedTypes.length > 0) {
      jobs = jobs.filter(job => selectedTypes.includes(job.type));
    }

    // 2. Filter by Pills
    if (selectedFilters.includes('recent')) {
      jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    if (selectedFilters.includes('high-value')) {
      jobs.sort((a, b) => (b.benefits.cashValue || 0) - (a.benefits.cashValue || 0));
    }

    // 3. Intelligent Sorting (if no specific sort selected)
    if (selectedFilters.length === 0) {
      jobs.sort((a, b) => getJobScore(b) - getJobScore(a));
    }

    return jobs;
  }, [selectedTypes, selectedFilters, getJobScore]);

  const featuredJob = filteredJobs[0];
  const regularJobs = filteredJobs.slice(1);

  const handleFilterSelect = (filterId: string) => {
    setSelectedFilters(prev =>
      prev.includes(filterId)
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    );
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="min-h-screen bg-linen pb-20">
      {/* Editorial Header */}
      <header className="px-5 py-6 flex items-start justify-between bg-transparent sticky top-0 z-20 backdrop-blur-md bg-linen/90">
        <div>
          <h1 className="text-2xl text-ink leading-tight">
            <span className="font-editorial italic font-normal block">{getGreeting()},</span>
            <span className="font-medium tracking-tight">{user?.name?.split(' ')[0]}</span>
          </h1>
          <div className="flex items-center gap-1.5 text-stone/60 text-xs mt-1.5">
            <span className="font-medium tracking-wide">{user?.location || 'São Paulo, SP'}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5 text-stone" strokeWidth={1.5} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-terracotta rounded-full ring-2 ring-linen" />
          </button>
          <button onClick={() => navigate('/profile')} className="hover:opacity-80 transition-opacity">
            <Avatar src={user?.avatar} name={user?.name || 'User'} size="md" />
          </button>
        </div>
      </header>

      {/* Minimal Search Bar */}
      <div className="px-5 mb-6">
        <motion.button
          onClick={() => navigate('/search')}
          className="w-full flex items-center gap-3 px-4 py-3.5 bg-[#F0EDE7] rounded-2xl text-stone/50 hover:bg-[#E4E0D9] transition-colors shadow-inner-subtle"
          whileTap={{ scale: 0.99 }}
        >
          <Search className="w-4 h-4 ml-1" strokeWidth={2} />
          <span className="text-sm font-medium tracking-wide">Buscar experiências criativas...</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="px-5 mb-5 space-y-4">
        <JobTypeFilter
          selected={selectedTypes}
          onChange={setSelectedTypes}
        />
        <FilterPills
          filters={filterPills}
          selected={selectedFilters}
          onSelect={handleFilterSelect}
        />
      </div>

      {/* Job Count - Editorial Style */}
      <div className="px-5 mb-6 flex items-center justify-between opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
        <p className="font-editorial text-lg text-stone italic">
          {filteredJobs.length} oportunidades selecionadas
        </p>
      </div>

      {/* Content Feed */}
      {isLoading ? (
        <div className="px-5 space-y-8">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="px-5">
          <EmptyJobs onAction={() => {
            setSelectedTypes([]);
            setSelectedFilters([]);
          }} />
        </div>
      ) : (
        <div className="px-5 space-y-8">
          {/* Featured Job */}
          {featuredJob && selectedTypes.length === 0 && selectedFilters.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-stone/40 font-bold">Destaque do dia</span>
              </div>
              <FeaturedJobCard
                job={featuredJob}
                hotel={getHotelById(featuredJob.hotelId)}
                onClick={() => navigate(`/job/${featuredJob.id}`)}
              />
            </motion.div>
          )}

          {/* Regular Jobs with Editorial Quotes interspersed */}
          {regularJobs.map((job, index) => {
            const showQuote = (index + 1) % 3 === 0;
            const quoteIndex = ((index + 1) / 3) % EDITORIAL_QUOTES.length;

            return (
              <div key={job.id}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.6 }}
                >
                  <JobCard
                    job={job}
                    hotel={getHotelById(job.hotelId)}
                    onClick={() => navigate(`/job/${job.id}`)}
                    onSave={() => { }}
                    isSaved={false}
                  // Visual rhythm: alternate compact variant for every 4th item or something if desired.
                  // keeping default for now for consistency, but spacing is generous.
                  />
                </motion.div>

                {/* Editorial Quote Divider */}
                {showQuote && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="py-12 text-center px-8"
                  >
                    <div className="editorial-divider mb-6" />
                    <p className="editorial-quote text-xl leading-relaxed">
                      "{EDITORIAL_QUOTES[quoteIndex]}"
                    </p>
                    <div className="editorial-divider mt-6" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
