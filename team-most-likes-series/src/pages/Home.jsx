import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Settings, LogOut, User } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import MovieGrid from '../components/MovieGrid';
import Logo from '../components/Logo';
import AddMovieForm from '../components/AddMovieForm';
import { catalogAPI, adminAPI } from '../services/api';
import './Home.css';

export default function Home() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [featuredContent, setFeaturedContent] = useState([]);
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState(null);
  const [showAdminMenu, setShowAdminMenu] = useState(false);

  useEffect(() => {
    loadContent();
    checkAdminStatus();
  }, []);

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

      // Load movies
      const moviesResponse = await catalogAPI.getAll({ type: 'Movie', limit: 12 });
      setMovies(moviesResponse.data || []);

      // Load series
      const seriesResponse = await catalogAPI.getAll({ type: 'Series', limit: 12 });
      setSeries(seriesResponse.data || []);

    } catch (err) {
      console.error('Error loading content:', err);
      setError('Failed to load content. Please try again later.');
      
      // Fallback to dummy data if API fails
      const fallbackFeatured = [
        {
          _id: '1',
          title: 'The Matrix',
          type: 'Movie',
          genre: ['Action', 'Sci-Fi'],
          description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
          imageUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800',
          rating: 8.7,
          duration: '2h 16m',
          featured: true,
          netflixLink: 'https://netflix.com',
          trailerUrl: 'https://youtube.com/watch?v=m8e-FF8MsqU'
        }
      ];
      
      const fallbackMovies = [
        {
          _id: '2',
          title: 'Inception',
          type: 'Movie',
          genre: ['Action', 'Drama', 'Sci-Fi'],
          description: 'A thief who steals corporate secrets through dream-sharing technology.',
          imageUrl: 'https://images.unsplash.com/photo-1489599328877-d2eade8b5fdc?w=500',
          rating: 8.8,
          duration: '2h 28m',
        }
      ];
      
      setFeaturedContent(fallbackFeatured);
      setMovies(fallbackMovies);
      setSeries([]);
    } finally {
      setLoading(false);
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
      let errorMessage = 'Failed to add movie. Please try again.';
      if (error.response?.data) {
        const serverError = error.response.data;
        if (serverError.errors && Array.isArray(serverError.errors)) {
          errorMessage = serverError.errors.map(err => err.msg).join(', ');
        } else if (serverError.message) {
          errorMessage = serverError.message;
        }
      }
      
      alert(errorMessage);
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
            
            <div className="flex items-center gap-4">
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

      {/* Hero Section */}
      <HeroSection featuredContent={featuredContent} />

      {/* Content Sections */}
      <main className="relative z-10">
        {movies.length > 0 && (
          <MovieGrid
            title="Popular Movies"
            movies={movies}
            type="carousel"
          />
        )}

        {series.length > 0 && (
          <MovieGrid
            title="TV Series"
            movies={series}
            type="carousel"
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
      </main>

      {/* Add Movie Form Modal */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowAddForm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-auto"
          >
            <AddMovieForm
              onSubmit={handleAddMovie}
              onCancel={() => setShowAddForm(false)}
            />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
