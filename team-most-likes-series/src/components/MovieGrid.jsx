import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Play, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MovieGrid = ({ title, movies = [], type = "grid" }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Width of card + gap
      const scrollLeft = direction === 'left' 
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleCardClick = (movie) => {
    navigate('/detail', { state: { movie } });
  };

  const handleWatchNow = (e, movie) => {
    e.stopPropagation();
    if (movie.netflixLink) {
      window.open(movie.netflixLink, '_blank');
    }
  };

  const handleWatchTrailer = (e, movie) => {
    e.stopPropagation();
    if (movie.trailerUrl) {
      window.open(movie.trailerUrl, '_blank');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (!movies || movies.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">{title}</h2>
        <div className="text-gray-400 text-center py-12">
          No content available
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-b from-transparent to-dark-900/50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
            {title}
          </h2>
          
          {type === "carousel" && movies.length > 4 && (
            <div className="flex gap-2">
              <button
                onClick={() => scroll('left')}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-300 backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-300 backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className={
            type === "carousel" 
              ? "flex gap-6 overflow-x-auto scrollbar-hide pb-4" 
              : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6"
          }
          ref={type === "carousel" ? scrollRef : null}
        >
          {movies.map((movie, index) => (
            <motion.div
              key={movie._id || movie.id || index}
              variants={cardVariants}
              className={`group relative cursor-pointer ${
                type === "carousel" ? "min-w-[300px]" : ""
              }`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => handleCardClick(movie)}
            >
              {/* Card Container */}
              <div className="relative bg-dark-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl">
                {/* Movie Poster */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={movie.imageUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Rating Badge */}
                  {movie.rating && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-md">
                      <Star className="w-3 h-3 text-gold-400 fill-current" />
                      <span className="text-white text-xs font-medium">
                        {movie.formattedRating || movie.rating.toFixed(1)}
                      </span>
                    </div>
                  )}

                  {/* Type Badge */}
                  <div className="absolute top-3 left-3 px-2 py-1 bg-gold-500/90 backdrop-blur-sm rounded text-xs font-bold text-black">
                    {movie.type}
                  </div>

                  {/* Hover Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: hoveredIndex === index ? 1 : 0,
                      y: hoveredIndex === index ? 0 : 20 
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex flex-col justify-end p-4"
                  >
                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                      {movie.title}
                    </h3>
                    
                    {movie.genre && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {movie.genre.slice(0, 2).map((g, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-white/20 text-white text-xs rounded-full"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                      {movie.description}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {movie.netflixLink && (
                        <motion.button
                          onClick={(e) => handleWatchNow(e, movie)}
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white text-black font-bold text-sm rounded-md hover:bg-gray-200 transition-colors duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Play className="w-4 h-4" />
                          Play
                        </motion.button>
                      )}
                      
                      {movie.trailerUrl && (
                        <motion.button
                          onClick={(e) => handleWatchTrailer(e, movie)}
                          className="flex items-center justify-center p-2 bg-white/20 hover:bg-white/30 rounded-md transition-colors duration-300 backdrop-blur-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Info className="w-4 h-4 text-white" />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Card Footer (Always Visible) */}
                <div className="p-4">
                  <h3 className="text-white font-semibold text-sm md:text-base mb-1 line-clamp-1 group-hover:text-gold-400 transition-colors duration-300">
                    {movie.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{movie.duration || 'N/A'}</span>
                    {movie.releaseDate && (
                      <span>{new Date(movie.releaseDate).getFullYear()}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl -z-10" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default MovieGrid;
