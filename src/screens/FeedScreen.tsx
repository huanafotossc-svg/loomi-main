import React, { Fragment, useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Camera, Video, Smartphone } from 'lucide-react';
import {
  FilterPills,
  JobTypeFilter,
  JobCard,
  FeaturedJobCard,
  SkeletonCard,
  EmptyJobs
} from '../components';
import { mockJobs, getHotelById } from '../data/mock';
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
    <div className="min-h-screen bg-linen pb-16">
      {/* Editorial Welcome Banner */}
      <div className="pt-2 pb-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl text-ink leading-tight">
            <span className="font-editorial italic font-normal block">{getGreeting()},</span>
            <span className="font-semibold tracking-tight">{user?.name?.split(' ')[0] || 'Criador'}</span>
          </h1>
          <div className="flex items-center gap-1.5 text-stone/60 text-xs sm:text-sm mt-1.5">
            <MapPin className="w-3.5 h-3.5 text-terracotta" />
            <span className="font-medium tracking-wide">{user?.location || 'São Paulo, SP'}</span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <motion.button
            onClick={() => navigate('/search')}
            className="flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white text-stone/70 hover:text-ink rounded-xl border border-stone/10 shadow-soft text-sm font-medium transition-colors"
            whileTap={{ scale: 0.98 }}
          >
            <Search className="w-4 h-4 text-forest" />
            <span>Explorar catálogo</span>
          </motion.button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <motion.button
          onClick={() => navigate('/search')}
          className="w-full flex items-center gap-3 px-4 py-3.5 bg-white/70 hover:bg-white border border-stone/10 rounded-2xl text-stone/50 hover:text-stone/70 transition-all shadow-soft"
          whileTap={{ scale: 0.99 }}
        >
          <Search className="w-4 h-4 ml-1 text-forest" strokeWidth={2} />
          <span className="text-sm font-medium tracking-wide">Buscar experiências criativas, hotéis e locais...</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
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
      <div className="mb-6 flex items-center justify-between opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
        <p className="font-editorial text-lg text-stone italic">
          {filteredJobs.length} oportunidades selecionadas
        </p>
      </div>

      {/* Content Feed */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div>
          <EmptyJobs onAction={() => {
            setSelectedTypes([]);
            setSelectedFilters([]);
          }} />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Featured Job */}
          {featuredJob && selectedTypes.length === 0 && selectedFilters.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className="text-[10px] uppercase tracking-[0.2em] text-forest font-bold bg-forest/10 px-2.5 py-1 rounded-full">
                  Destaque do dia
                </span>
              </div>
              <FeaturedJobCard
                job={featuredJob}
                hotel={getHotelById(featuredJob.hotelId)}
                onClick={() => navigate(`/job/${featuredJob.id}`)}
              />
            </motion.div>
          )}

          {/* Regular Jobs - Grid Responsivo (1 col mobile, 2 cols tablet, 3 cols desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularJobs.map((job, index) => {
              const showQuote = (index + 1) % 4 === 0;
              const quoteIndex = Math.floor((index + 1) / 4) % EDITORIAL_QUOTES.length;

              return (
                <Fragment key={job.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index % 6) * 0.1, duration: 0.5 }}
                    className="flex flex-col h-full"
                  >
                    <JobCard
                      job={job}
                      hotel={getHotelById(job.hotelId)}
                      onClick={() => navigate(`/job/${job.id}`)}
                      onSave={() => { }}
                      isSaved={false}
                    />
                  </motion.div>

                  {/* Editorial Quote Divider */}
                  {showQuote && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      className="col-span-full py-8 text-center px-4"
                    >
                      <div className="editorial-divider mb-4 max-w-xs mx-auto" />
                      <p className="editorial-quote text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto text-stone/80">
                        "{EDITORIAL_QUOTES[quoteIndex]}"
                      </p>
                      <div className="editorial-divider mt-4 max-w-xs mx-auto" />
                    </motion.div>
                  )}
                </Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
