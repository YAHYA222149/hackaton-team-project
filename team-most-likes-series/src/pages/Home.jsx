import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, LogOut, User, Heart, Search } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import ScrollableMovieGrid from '../components/ScrollableMovieGrid';
import Logo from '../components/Logo';
import AddMovieForm from '../components/AddMovieForm';
import SearchFilter from '../components/SearchFilter';
import VideoPlayer from '../components/VideoPlayer';
import LikedMovies from '../components/LikedMovies';
import MovieCard from '../components/MovieCard';
import { catalogAPI, adminAPI } from '../services/api';
import './Home.css';

export default function Home() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [featuredContent, setFeaturedContent] = useState([]);
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [allContent, setAllContent] = useState([]);
  const [filteredContent, setFilteredContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // home, search, liked
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [searchFilters, setSearchFilters] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadContent();
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (currentView === 'search') {
      applyFilters();
    }
  }, [allContent, searchFilters, searchTerm]);

  const checkAdminStatus = () => {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (token && user) {
      setIsAdmin(true);
      setAdminUser(JSON.parse(user));
    }
  };

  const loadContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load featured content
      const featuredResponse = await catalogAPI.getFeatured();
      setFeaturedContent(featuredResponse.data || []);

      // Load all content for search
      const allResponse = await catalogAPI.getAll({ limit: 100 });
      const allData = allResponse.data || [];
      setAllContent(allData);

      // Separate by type
      const moviesData = allData.filter(item => item.type === 'Movie');
      const seriesData = allData.filter(item => item.type === 'Series');
      
      setMovies(moviesData);
      setSeries(seriesData);

    } catch (err) {
      console.error('Error loading content:', err);
      setError('Failed to load content. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allContent];

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.director?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.cast?.some(actor => actor.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.genre?.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply filters
    if (searchFilters.type) {
      filtered = filtered.filter(item => item.type === searchFilters.type);
    }

    if (searchFilters.genre) {
      filtered = filtered.filter(item => item.genre?.includes(searchFilters.genre));
    }

    if (searchFilters.rating) {
      const minRating = parseFloat(searchFilters.rating);
      filtered = filtered.filter(item => (item.rating || 0) >= minRating);
    }

    if (searchFilters.year) {
      if (searchFilters.year.includes('s')) {
        // Decade filter
        const decade = parseInt(searchFilters.year);
        filtered = filtered.filter(item => {
          const year = new Date(item.releaseDate).getFullYear();
          return year >= decade && year < decade + 10;
        });
      } else {
        // Specific year
        const year = parseInt(searchFilters.year);
        filtered = filtered.filter(item => {
          return new Date(item.releaseDate).getFullYear() === year;
        });
      }
    }

    // Apply sorting
    if (searchFilters.sort) {
      filtered.sort((a, b) => {
        switch (searchFilters.sort) {
          case 'title':
            return a.title.localeCompare(b.title);
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'oldest':
            return new Date(a.releaseDate) - new Date(b.releaseDate);
          case 'popular':
            return (b.views || 0) - (a.views || 0);
          case 'newest':
          default:
            return new Date(b.releaseDate) - new Date(a.releaseDate);
        }
      });
    }

    setFilteredContent(filtered);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term) {
      setCurrentView('search');
    } else if (currentView === 'search') {
      setCurrentView('home');
    }
  };

  const handleFilter = (filters) => {
    setSearchFilters(filters);
    setCurrentView('search');
  };

  const resetFilters = () => {
    setSearchFilters({});
    setSearchTerm('');
    setCurrentView('home');
  };

  const handlePlayTrailer = (item) => {
    if (item.trailerUrl) {
      setSelectedVideo({
        url: item.trailerUrl,
        title: `${item.title} - Trailer`
      });
      setShowVideoPlayer(true);
    }
  };

  const handleAddMovie = async (movieData) => {
    try {
      await catalogAPI.add(movieData);
      setShowAddForm(false);
      loadContent(); // Refresh content
    } catch (error) {
      console.error('Error adding movie:', error);
      
      // More detailed error handling
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors
          .map(err => err.msg || err.message)
          .join('\\n');
        alert(`Validation errors:\\n${validationErrors}`);
      } else if (error.response?.data?.message) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        alert('Failed to add movie. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAdmin(false);
    setAdminUser(null);
    setShowAdminMenu(false);
  };

  const handleLoginClick = () => {
    // For now, just show a simple prompt
    const username = prompt('Admin Username:');
    const password = prompt('Admin Password:');
    
    if (username && password) {
      adminAPI.login({ username, password })
        .then(response => {
          localStorage.setItem('adminToken', response.data.token);
          localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
          setIsAdmin(true);
          setAdminUser(response.data.admin);
          alert('Login successful!');
        })
        .catch(error => {
          console.error('Login failed:', error);
          alert('Login failed. Please check your credentials.');
        });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-gold-400 border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-white text-xl">Loading 4U FLIX...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Navigation Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Logo size="medium" />
            
            {/* Navigation Buttons */}
            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => setCurrentView('home')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                  currentView === 'home' 
                    ? 'bg-gold-500 text-black' 
                    : 'text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Home
              </motion.button>

              <motion.button
                onClick={() => setCurrentView('search')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                  currentView === 'search' 
                    ? 'bg-gold-500 text-black' 
                    : 'text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-4 h-4" />
                Browse
              </motion.button>

              <motion.button
                onClick={() => setCurrentView('liked')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                  currentView === 'liked' 
                    ? 'bg-red-500 text-white' 
                    : 'text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className="w-4 h-4" />
                My List
              </motion.button>

              {error && (
                <motion.button
                  onClick={loadContent}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Retry
                </motion.button>
              )}

              {isAdmin ? (
                <div className="relative">
                  <motion.button
                    onClick={() => setShowAdminMenu(!showAdminMenu)}
                    className="flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-black font-bold rounded-lg transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <User className="w-4 h-4" />
                    {adminUser?.username}
                  </motion.button>

                  <AnimatePresence>
                    {showAdminMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 w-48 bg-dark-800 border border-white/10 rounded-lg shadow-xl overflow-hidden"
                      >
                        <button
                          onClick={() => {
                            setShowAddForm(true);
                            setShowAdminMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-3 text-white hover:bg-white/10 transition-colors duration-300"
                        >
                          <Plus className="w-4 h-4" />
                          Add Content
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 transition-colors duration-300"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  onClick={handleLoginClick}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Admin Login
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="pt-20">
        {currentView === 'home' && (
          <>
            {/* Hero Section */}
            <HeroSection 
              featuredContent={featuredContent} 
              onPlayTrailer={handlePlayTrailer}
            />

            {/* Content Sections */}
            <div className="relative z-10">
              {movies.length > 0 && (
                <ScrollableMovieGrid
                  title="Popular Movies"
                  movies={movies}
                  onPlayTrailer={handlePlayTrailer}
                />
              )}

              {series.length > 0 && (
                <ScrollableMovieGrid
                  title="TV Series"
                  movies={series}
                  onPlayTrailer={handlePlayTrailer}
                />
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="container mx-auto px-4 md:px-6 lg:px-8 py-8"
                >
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                      onClick={loadContent}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-300"
                    >
                      Try Again
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </>
        )}

        {currentView === 'search' && (
          <div className="container mx-auto px-4 py-8">
            <SearchFilter
              onSearch={handleSearch}
              onFilter={handleFilter}
              filters={searchFilters}
              resetFilters={resetFilters}
            />
            
            {filteredContent.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              >
                {filteredContent.map((item, index) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <MovieCard
                      movie={item}
                      onPlayTrailer={() => handlePlayTrailer(item)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : searchTerm || Object.values(searchFilters).some(f => f) ? (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                <p className="text-gray-400">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <div className="text-center py-12">
                <Search className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Browse our catalog</h3>
                <p className="text-gray-400">Use the search and filters above to find content</p>
              </div>
            )}
          </div>
        )}

        {currentView === 'liked' && <LikedMovies />}
      </main>

      {/* Add Movie Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAddForm(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-h-[90vh] overflow-y-auto"
            >
              <AddMovieForm
                onSubmit={handleAddMovie}
                onCancel={() => setShowAddForm(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Player Modal */}
      <AnimatePresence>
        {showVideoPlayer && selectedVideo && (
          <VideoPlayer
            videoUrl={selectedVideo.url}
            title={selectedVideo.title}
            onClose={() => {
              setShowVideoPlayer(false);
              setSelectedVideo(null);
            }}
            autoPlay={true}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
