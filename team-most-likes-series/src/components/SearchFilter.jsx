import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, Star, Calendar, Clock } from 'lucide-react';

const SearchFilter = ({ onSearch, onFilter, filters, resetFilters }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    type: '',
    genre: '',
    rating: '',
    year: '',
    sort: 'newest'
  });

  const genres = [
    'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror',
    'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
  ];

  const handleSearch = (value) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilter(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      type: '',
      genre: '',
      rating: '',
      year: '',
      sort: 'newest'
    };
    setLocalFilters(clearedFilters);
    setSearchTerm('');
    onSearch('');
    resetFilters();
  };

  const activeFiltersCount = Object.values(localFilters).filter(value => value && value !== 'newest').length + (searchTerm ? 1 : 0);

  return (
    <div className="w-full max-w-6xl mx-auto mb-8">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search movies, series, actors..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-12 pr-16 py-4 bg-dark-800 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none transition-colors duration-300"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors duration-300 ${
              showFilters ? 'bg-gold-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Filter className="w-4 h-4" />
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      <motion.div
        initial={false}
        animate={{ height: showFilters ? 'auto' : 0, opacity: showFilters ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="bg-dark-800 rounded-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-gold-400" />
              Filters
            </h3>
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select
                value={localFilters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 bg-dark-900 border border-white/20 rounded-lg text-white focus:border-gold-400 focus:outline-none"
              >
                <option value="">All Types</option>
                <option value="Movie">Movies</option>
                <option value="Series">Series</option>
                <option value="Documentary">Documentaries</option>
              </select>
            </div>

            {/* Genre Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
              <select
                value={localFilters.genre}
                onChange={(e) => handleFilterChange('genre', e.target.value)}
                className="w-full px-3 py-2 bg-dark-900 border border-white/20 rounded-lg text-white focus:border-gold-400 focus:outline-none"
              >
                <option value="">All Genres</option>
                {genres.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Star className="w-4 h-4 inline mr-1" />
                Rating
              </label>
              <select
                value={localFilters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="w-full px-3 py-2 bg-dark-900 border border-white/20 rounded-lg text-white focus:border-gold-400 focus:outline-none"
              >
                <option value="">Any Rating</option>
                <option value="9">9+ Excellent</option>
                <option value="8">8+ Very Good</option>
                <option value="7">7+ Good</option>
                <option value="6">6+ Average</option>
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Year
              </label>
              <select
                value={localFilters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-3 py-2 bg-dark-900 border border-white/20 rounded-lg text-white focus:border-gold-400 focus:outline-none"
              >
                <option value="">Any Year</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2010s">2010s</option>
                <option value="2000s">2000s</option>
                <option value="1990s">1990s</option>
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Sort By
              </label>
              <select
                value={localFilters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full px-3 py-2 bg-dark-900 border border-white/20 rounded-lg text-white focus:border-gold-400 focus:outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="rating">Highest Rated</option>
                <option value="title">Alphabetical</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchFilter;
