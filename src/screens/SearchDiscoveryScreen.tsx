import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, TrendingUp, MapPin, Building2, Camera } from 'lucide-react';
import { SearchHeader, JobCard, CreatorCard, HotelCard, EmptySearch } from '../components';
import { mockJobs, mockCreators, mockHotels, getHotelById } from '../data/mock';
import { cn } from '../utils/helpers';

type SearchTab = 'all' | 'jobs' | 'creators' | 'hotels';

export function SearchDiscoveryScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('all');
  const [recentSearches, setRecentSearches] = useState([
    'Campos do Jordão',
    'Fotografia drone',
    'Pousada',
    'Reels',
  ]);

  // Search results
  const results = useMemo(() => {
    if (!searchQuery.trim()) return { jobs: [], creators: [], hotels: [] };

    const query = searchQuery.toLowerCase();

    const jobs = mockJobs.filter(job =>
      job.title.toLowerCase().includes(query) ||
      job.location.toLowerCase().includes(query) ||
      job.description.toLowerCase().includes(query)
    );

    const creators = mockCreators.filter(creator =>
      creator.name.toLowerCase().includes(query) ||
      creator.location?.toLowerCase().includes(query) ||
      creator.styles.some(s => s.toLowerCase().includes(query))
    );

    const hotels = mockHotels.filter(hotel =>
      hotel.name.toLowerCase().includes(query) ||
      hotel.city.toLowerCase().includes(query) ||
      hotel.propertyType.toLowerCase().includes(query)
    );

    return { jobs, creators, hotels };
  }, [searchQuery]);

  const hasResults = results.jobs.length > 0 || results.creators.length > 0 || results.hotels.length > 0;

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev].slice(0, 5));
    }
  };

  const removeRecentSearch = (search: string) => {
    setRecentSearches(prev => prev.filter(s => s !== search));
  };

  const tabs: { id: SearchTab; label: string; count: number }[] = [
    { id: 'all', label: 'Todos', count: results.jobs.length + results.creators.length + results.hotels.length },
    { id: 'jobs', label: 'Vagas', count: results.jobs.length },
    { id: 'creators', label: 'Creators', count: results.creators.length },
    { id: 'hotels', label: 'Hotéis', count: results.hotels.length },
  ];

  return (
    <div className="min-h-screen bg-linen pb-24">
      {/* Search Header */}
      <SearchHeader
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Buscar vagas, creators ou hotéis..."
        onBack={() => navigate(-1)}
      />

      {!searchQuery ? (
        /* Empty State - Recent Searches */
        <div className="px-5 pt-4">
          {/* Recent Searches */}
          <div className="mb-8">
            <h3 className="font-serif text-lg text-ink mb-4">Buscas recentes</h3>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search) => (
                <motion.button
                  key={search}
                  onClick={() => setSearchQuery(search)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full text-sm text-stone/60 border border-stone/10 hover:border-forest/20 hover:text-stone/80 transition-all duration-300"
                  whileTap={{ scale: 0.95 }}
                >
                  <TrendingUp className="w-3.5 h-3.5 opacity-60" strokeWidth={1.5} />
                  {search}
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      removeRecentSearch(search);
                    }}
                    className="ml-1 p-0.5 hover:bg-stone/10 rounded-full cursor-pointer"
                  >
                    <X className="w-3 h-3" strokeWidth={1.5} />
                  </span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="font-serif text-lg text-ink mb-4">Categorias populares</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: MapPin, label: 'Próximos', color: 'bg-blue-50 text-blue-700' },
                { icon: Building2, label: 'Hotéis', color: 'bg-emerald-50 text-emerald-700' },
                { icon: Camera, label: 'Fotografia', color: 'bg-purple-50 text-purple-700' },
                { icon: TrendingUp, label: 'Trending', color: 'bg-amber-50 text-amber-700' },
              ].map((cat) => (
                <motion.button
                  key={cat.label}
                  onClick={() => setSearchQuery(cat.label)}
                  className="flex items-center gap-3 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-stone/5 hover:border-stone/20 transition-all duration-300 shadow-sm hover:shadow-md"
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', cat.color)}>
                    <cat.icon className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                  <span className="font-medium text-ink">{cat.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      ) : !hasResults ? (
        /* No Results */
        <div className="px-4 pt-8">
          <EmptySearch onAction={() => setSearchQuery('')} />
        </div>
      ) : (
        /* Search Results */
        <div className="pt-4">
          {/* Tabs */}
          <div className="px-5 mb-4 overflow-x-auto hide-scrollbar">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'bg-forest text-white shadow-soft'
                      : 'bg-white/60 text-stone/60 border border-stone/10 hover:bg-white/80'
                  )}
                  whileTap={{ scale: 0.95 }}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={cn(
                      'ml-2 px-1.5 py-0.5 rounded-full text-[10px]',
                      activeTab === tab.id ? 'bg-white/20' : 'bg-stone/5'
                    )}>
                      {tab.count}
                    </span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="px-5 space-y-4">
            {/* Jobs */}
            {(activeTab === 'all' || activeTab === 'jobs') && results.jobs.length > 0 && (
              <div>
                {activeTab === 'all' && <h3 className="font-serif text-lg text-ink mb-3">Vagas</h3>}
                <div className="space-y-4">
                  {results.jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      hotel={getHotelById(job.hotelId)}
                      onClick={() => navigate(`/job/${job.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Creators */}
            {(activeTab === 'all' || activeTab === 'creators') && results.creators.length > 0 && (
              <div>
                {activeTab === 'all' && <h3 className="font-serif text-lg text-ink mb-3 mt-8">Creators</h3>}
                <div className="space-y-4">
                  {results.creators.map((creator) => (
                    <CreatorCard
                      key={creator.id}
                      creator={creator}
                      onClick={() => navigate(`/creator/${creator.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Hotels */}
            {(activeTab === 'all' || activeTab === 'hotels') && results.hotels.length > 0 && (
              <div>
                {activeTab === 'all' && <h3 className="font-serif text-lg text-ink mb-3 mt-8">Hotéis</h3>}
                <div className="space-y-4">
                  {results.hotels.map((hotel) => (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      onClick={() => navigate(`/hotel/${hotel.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
