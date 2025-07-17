import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Play, Star, Info, HeartOff } from 'lucide-react';
import './MovieCard.css';

export default function MovieCard({ 
  movie, 
  type, 
  onPlayTrailer, 
  onUnlike, 
  showUnlikeOption = false 
}) {
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkIfLiked();
  }, [movie._id]);

  useEffect(() => {
    const handleLikedMoviesUpdate = () => {
      checkIfLiked();
    };

    window.addEventListener('likedMoviesUpdated', handleLikedMoviesUpdate);
    return () => window.removeEventListener('likedMoviesUpdated', handleLikedMoviesUpdate);
  }, [movie._id]);

  const checkIfLiked = () => {
    const likedMovies = JSON.parse(localStorage.getItem('likedMovies') || '[]');
    setIsLiked(likedMovies.some(liked => liked._id === movie._id));
  };

  const handleLike = (e) => {
    e.stopPropagation();
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
    
    window.dispatchEvent(new CustomEvent('likedMoviesUpdated'));
  };

  const handleClick = () => {
    navigate('/detail', { state: { movie } });
  };

  const handlePlayTrailer = (e) => {
    e.stopPropagation();
    if (onPlayTrailer) {
      onPlayTrailer(movie);
    }
  };

  const handleUnlike = (e) => {
    e.stopPropagation();
    if (onUnlike) {
      onUnlike(movie._id);
    }
  };

  const imageUrl = movie.imageUrl || movie.image;

  return (
    <div className="movie-card-new" onClick={handleClick}>
      <div className="movie-image">
        <img src={imageUrl} alt={movie.title} />
        
        {/* Rating */}
        {movie.rating && (
          <div className="rating">
            <Star size={12} fill="currentColor" />
            <span>{movie.rating}</span>
          </div>
        )}

        {/* Like Button */}
        <div className="like-btn">
          {showUnlikeOption ? (
            <button onClick={handleUnlike} className="btn-heart unlike">
              <HeartOff size={16} />
            </button>
          ) : (
            <button onClick={handleLike} className={`btn-heart ${isLiked ? 'liked' : ''}`}>
              <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="hover-overlay">
          <div className="movie-details">
            <h3>{movie.title}</h3>
            {movie.genre && movie.genre.length > 0 && (
              <div className="genres">
                {movie.genre.slice(0, 2).map((genre, index) => (
                  <span key={index} className="genre">{genre}</span>
                ))}
              </div>
            )}
            <div className="actions">
              <button className="btn-primary" onClick={handleClick}>
                <Info size={14} />
                Details
              </button>
              {movie.trailerUrl && (
                <button className="btn-secondary" onClick={handlePlayTrailer}>
                  <Play size={14} />
                  Trailer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
