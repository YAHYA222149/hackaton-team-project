import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Star, Clock, Calendar } from 'lucide-react';

const HeroSection = ({ featuredContent = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const currentMovie = featuredContent[currentIndex];

  useEffect(() => {
    if (featuredContent.length > 0) {
      setIsLoading(false);
    }
  }, [featuredContent]);

  useEffect(() => {
    if (featuredContent.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredContent.length);
      }, 8000); // Change every 8 seconds

      return () => clearInterval(interval);
    }
  }, [featuredContent.length]);

  if (isLoading || !currentMovie) {
    return (
      <div className="relative h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-transparent">
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-16 h-16 border-4 border-gold-400 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    );
  }

  const handleWatchNow = () => {
    if (currentMovie.netflixLink) {
      window.open(currentMovie.netflixLink, '_blank');
    }
  };

  const handleWatchTrailer = () => {
    if (currentMovie.trailerUrl) {
      window.open(currentMovie.trailerUrl, '_blank');
    }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={currentMovie.imageUrl}
              alt={currentMovie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
              <div className="max-w-2xl">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="mb-4"
                >
                  <span className="inline-flex items-center px-3 py-1 bg-gold-500/20 text-gold-400 text-sm font-medium rounded-full border border-gold-500/30">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    Featured
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                >
                  {currentMovie.title}
                </motion.h1>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-300"
                >
                  {currentMovie.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-gold-400 fill-current" />
                      <span className="font-medium">{currentMovie.formattedRating || currentMovie.rating.toFixed(1)}</span>
                    </div>
                  )}
                  
                  {currentMovie.duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{currentMovie.duration}</span>
                    </div>
                  )}
                  
                  {currentMovie.releaseDate && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(currentMovie.releaseDate).getFullYear()}</span>
                    </div>
                  )}
                  
                  <div className="px-2 py-1 bg-white/10 rounded text-xs font-medium">
                    {currentMovie.type}
                  </div>
                </motion.div>

                {currentMovie.genre && (
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="flex flex-wrap gap-2 mb-6"
                  >
                    {currentMovie.genre.map((g, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/10 text-white text-sm rounded-full border border-white/20"
                      >
                        {g}
                      </span>
                    ))}
                  </motion.div>
                )}

                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed max-w-xl"
                >
                  {currentMovie.description}
                </motion.p>

                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <motion.button
                    onClick={handleWatchNow}
                    className="group px-8 py-4 bg-white text-black font-bold text-lg rounded-lg hover:bg-gray-200 transition-all duration-300 flex items-center justify-center gap-3 min-w-[180px]"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                    Watch Now
                  </motion.button>

                  {currentMovie.trailerUrl && (
                    <motion.button
                      onClick={handleWatchTrailer}
                      className="group px-8 py-4 bg-white/10 text-white font-bold text-lg rounded-lg hover:bg-white/20 border border-white/20 hover:border-white/40 transition-all duration-300 flex items-center justify-center gap-3 min-w-[180px] backdrop-blur-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Info className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                      Watch Trailer
                    </motion.button>
                  )}
                </motion.div>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          {featuredContent.length > 1 && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20"
            >
              {featuredContent.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-gold-400 scale-125'
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 right-8 text-white/60 text-sm hidden md:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span>Scroll for more</span>
          <div className="w-[1px] h-8 bg-gradient-to-b from-white/60 to-transparent" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
