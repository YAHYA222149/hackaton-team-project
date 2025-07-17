import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Play, Star, Calendar, Clock, Globe, 
  Film, Tv, Share2, Heart, BookmarkPlus, Info 
} from 'lucide-react';
import Logo from '../components/Logo';
import MovieGrid from '../components/ScrollableMovieGrid';
import VideoPlayer from '../components/VideoPlayer';
import { catalogAPI } from '../services/api';
import './DetailPage.css';

export default function DetailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(location.state?.movie || null);
  const [relatedContent, setRelatedContent] = useState([]);
  const [activeTab, setActiveTab] = useState('synopsis');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(!movie);
  const [error, setError] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    if (!movie) {
      // If no movie data passed, redirect back
      navigate('/');
      return;
    }

    loadRelatedContent();
    checkIfLiked();
    
    // Check if bookmarked (from localStorage for demo)
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setIsBookmarked(bookmarks.includes(movie._id || movie.id));

    // Listen for liked movies updates
    const handleLikedMoviesUpdate = () => {
      checkIfLiked();
    };

    window.addEventListener('likedMoviesUpdated', handleLikedMoviesUpdate);
    return () => window.removeEventListener('likedMoviesUpdated', handleLikedMoviesUpdate);
  }, [movie, navigate]);

  const checkIfLiked = () => {
    const likedMovies = JSON.parse(localStorage.getItem('likedMovies') || '[]');
    setIsLiked(likedMovies.some(liked => liked._id === movie._id));
  };

  const loadRelatedContent = async () => {
    if (!movie) return;
    
    try {
      // Load related content by genre
      const primaryGenre = movie.genre?.[0] || 'Action';
      const response = await catalogAPI.getAll({ 
        genre: primaryGenre, 
        limit: 8 
      });
      
      // Filter out current movie
      const related = response.data?.filter(item => 
        (item._id || item.id) !== (movie._id || movie.id)
      ) || [];
      
      setRelatedContent(related);
    } catch (err) {
      console.error('Error loading related content:', err);
      // Set some fallback related content
      setRelatedContent([]);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleWatchNow = () => {
    if (movie.netflixLink || movie.link) {
      window.open(movie.netflixLink || movie.link, '_blank');
    }
  };

  const handleWatchTrailer = () => {
    if (movie.trailerUrl || movie.trailer) {
      setSelectedVideo({
        url: movie.trailerUrl || movie.trailer,
        title: `${movie.title} - Trailer`
      });
      setShowVideoPlayer(true);
    }
  };

  const handleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const movieId = movie._id || movie.id;
    
    if (isBookmarked) {
      const newBookmarks = bookmarks.filter(id => id !== movieId);
      localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
    } else {
      bookmarks.push(movieId);
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    
    setIsBookmarked(!isBookmarked);
  };

  const handleLike = () => {
    const likedMovies = JSON.parse(localStorage.getItem('likedMovies') || '[]');
    
    if (isLiked) {
      const updatedLiked = likedMovies.filter(liked => liked._id !== movie._id);
      localStorage.setItem('likedMovies', JSON.stringify(updatedLiked));
      setIsLiked(false);
    } else {
      const movieWithDate = { ...movie, likedAt: new Date().toISOString() };
      likedMovies.push(movieWithDate);
      localStorage.setItem('likedMovies', JSON.stringify(likedMovies));
      setIsLiked(true);
    }
    
    // Dispatch event to update other components
    window.dispatchEvent(new CustomEvent('likedMoviesUpdated'));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movie.title,
        text: movie.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const tabs = [
    { id: 'synopsis', label: 'Synopsis', icon: Info },
    { id: 'cast', label: 'Cast & Crew', icon: Film },
    { id: 'similar', label: 'More Like This', icon: Tv },
  ];

  if (!movie) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Movie not found</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gold-500 text-black font-bold rounded-lg hover:bg-gold-600 transition-colors duration-300"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm"
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                onClick={handleBack}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-6 h-6 text-white" />
              </motion.button>
              <Logo size="small" />
            </div>
            
            <div className="flex items-center gap-2">
              <motion.button
                onClick={handleShare}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="w-5 h-5 text-white" />
              </motion.button>
              
              <motion.button
                onClick={handleLike}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors duration-300 ${
                  isLiked ? 'text-red-500' : 'text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </motion.button>
              
              <motion.button
                onClick={handleBookmark}
                className={`p-2 hover:bg-white/10 rounded-lg transition-colors duration-300 ${
                  isBookmarked ? 'text-gold-400' : 'text-white'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <BookmarkPlus className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src={movie.imageUrl || movie.image}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="max-w-3xl">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="mb-4"
              >
                <span className="inline-flex items-center px-3 py-1 bg-gold-500/20 text-gold-400 text-sm font-medium rounded-full border border-gold-500/30">
                  {movie.type || 'Movie'}
                </span>
              </motion.div>

              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              >
                {movie.title}
              </motion.h1>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-wrap items-center gap-6 mb-6 text-gray-300"
              >
                {movie.rating && (
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-gold-400 fill-current" />
                    <span className="font-bold text-lg">
                      {movie.formattedRating || movie.rating.toFixed(1)}
                    </span>
                  </div>
                )}
                
                {movie.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>{movie.duration}</span>
                  </div>
                )}
                
                {(movie.releaseDate || movie.year) && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    <span>
                      {movie.releaseDate 
                        ? new Date(movie.releaseDate).getFullYear()
                        : movie.year
                      }
                    </span>
                  </div>
                )}
                
                {movie.language && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    <span>{movie.language}</span>
                  </div>
                )}
              </motion.div>

              {(movie.genre || movie.genre) && (
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="flex flex-wrap gap-2 mb-8"
                >
                  {(Array.isArray(movie.genre) ? movie.genre : [movie.genre]).map((g, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-white/10 text-white rounded-full border border-white/20 backdrop-blur-sm"
                    >
                      {g}
                    </span>
                  ))}
                </motion.div>
              )}

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <motion.button
                  onClick={handleWatchNow}
                  className="group px-8 py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-3 min-w-[200px]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={!movie.netflixLink && !movie.link}
                >
                  <Play className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                  Watch Now
                </motion.button>

                {(movie.trailerUrl || movie.trailer) && (
                  <motion.button
                    onClick={handleWatchTrailer}
                    className="group px-8 py-4 bg-white/10 text-white font-bold text-lg rounded-xl hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-3 min-w-[200px] backdrop-blur-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Info className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                    Watch Trailer
                  </motion.button>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Tabs */}
      <section className="relative z-10 bg-dark-900">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
          {/* Tab Navigation */}
          <div className="flex items-center gap-1 mb-8 border-b border-white/10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all duration-300 border-b-2 ${
                    activeTab === tab.id
                      ? 'text-gold-400 border-gold-400'
                      : 'text-gray-400 border-transparent hover:text-white'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              );
            })}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'synopsis' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <h3 className="text-2xl font-bold text-white mb-4">Synopsis</h3>
                    <p className="text-gray-300 text-lg leading-relaxed mb-6">
                      {movie.description}
                    </p>
                    
                    {movie.director && (
                      <div className="mb-4">
                        <h4 className="text-lg font-semibold text-white mb-2">Director</h4>
                        <p className="text-gray-300">{movie.director}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-dark-800 rounded-xl p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-white mb-4">Details</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white">{movie.type || 'Movie'}</span>
                      </div>
                      {movie.duration && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Duration:</span>
                          <span className="text-white">{movie.duration}</span>
                        </div>
                      )}
                      {movie.language && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Language:</span>
                          <span className="text-white">{movie.language}</span>
                        </div>
                      )}
                      {movie.rating && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Rating:</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-gold-400 fill-current" />
                            <span className="text-white">
                              {movie.formattedRating || movie.rating.toFixed(1)}/10
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'cast' && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">Cast & Crew</h3>
                  {movie.cast && movie.cast.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {movie.cast.map((member, index) => (
                        <div
                          key={index}
                          className="bg-dark-800 rounded-lg p-4 border border-white/10"
                        >
                          <h4 className="font-semibold text-white">{member.name}</h4>
                          <p className="text-gray-400 text-sm">{member.role}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-400">Cast information not available</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'similar' && (
                <div>
                  <h3 className="text-2xl font-bold text-white mb-6">More Like This</h3>
                  {relatedContent.length > 0 ? (
                    <MovieGrid
                      title=""
                      movies={relatedContent}
                      type="grid"
                    />
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-400">No similar content found</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

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
