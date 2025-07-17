import { motion } from 'framer-motion';
import MovieCard from './MovieCard';
import './MovieCard.css';

export default function ScrollableMovieGrid({ title, movies, onPlayTrailer }) {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="movies-section">
      <h2 className="section-title">{title}</h2>
      <div className="movie-grid">
        {movies.map((movie, index) => (
          <motion.div
            key={movie._id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              ease: "easeOut" 
            }}
          >
            <MovieCard
              movie={movie}
              type="grid"
              onPlayTrailer={onPlayTrailer}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
