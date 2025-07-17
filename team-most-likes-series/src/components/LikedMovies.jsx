import { useState, useEffect } from 'react';
import { Heart, Search, Filter, SortDesc, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MovieCard from './MovieCard';
import VideoPlayer from './VideoPlayer';
import './LikedMovies.css';

export default function LikedMovies({ onPlayTrailer }) {
  const [likedMovies, setLikedMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [filterType, setFilterType] = useState('all');
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    loadLikedMovies();
    
    const handleLikedMoviesUpdate = () => {
      loadLikedMovies();
    };

    window.addEventListener('likedMoviesUpdated', handleLikedMoviesUpdate);
    return () => window.removeEventListener('likedMoviesUpdated', handleLikedMoviesUpdate);
  }, []);

  useEffect(() => {
    filterAndSortMovies();
  }, [likedMovies, searchTerm, sortBy, filterType]);

  const loadLikedMovies = () => {
    const stored = JSON.parse(localStorage.getItem('likedMovies') || '[]');
    setLikedMovies(stored);
  };

  const filterAndSortMovies = () => {
    let filtered = [...likedMovies];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre?.some(g => g.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(movie => 
        movie.type?.toLowerCase() === filterType.toLowerCase()
      );
    }

    // Sort movies
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.likedAt) - new Date(a.likedAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'year':
          const yearA = a.releaseDate ? new Date(a.releaseDate).getFullYear() : 0;
          const yearB = b.releaseDate ? new Date(b.releaseDate).getFullYear() : 0;
          return yearB - yearA;
        default:
          return 0;
      }
    });

    setFilteredMovies(filtered);
  };

  const handleUnlike = (movieId) => {
    const updatedLiked = likedMovies.filter(movie => movie._id !== movieId);
    localStorage.setItem('likedMovies', JSON.stringify(updatedLiked));
    setLikedMovies(updatedLiked);
    window.dispatchEvent(new CustomEvent('likedMoviesUpdated'));
  };

  const handlePlayTrailer = (movie) => {
    if (movie.trailerUrl) {
      setSelectedVideo({
        url: movie.trailerUrl,
        title: `${movie.title} - Trailer`
      });
      setShowVideoPlayer(true);
    }
  };

  const clearAllLiked = () => {
    if (window.confirm('Are you sure you want to remove all liked movies?')) {
      localStorage.setItem('likedMovies', JSON.stringify([]));
      setLikedMovies([]);
      window.dispatchEvent(new CustomEvent('likedMoviesUpdated'));
    }
  };

  if (likedMovies.length === 0) {
    return (
      <div className="liked-movies-empty">
        <Heart className="empty-icon" />
        <h2>No Liked Movies Yet</h2>
        <p>Start exploring and add some movies to your favorites!</p>
      </div>
    );
  }

  return (
    <div className="liked-movies">
      <div className="liked-header">
        <div className="header-content">
          <h1>My List</h1>
          <p>{likedMovies.length} {likedMovies.length === 1 ? 'movie' : 'movies'}</p>
        </div>
        
        <button onClick={clearAllLiked} className="clear-all-btn">
          <Trash2 className="w-4 h-4" />
          Clear All
        </button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search your favorites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-controls">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="movie">Movies</option>
            <option value="series">Series</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="recent">Recently Added</option>
            <option value="title">Title A-Z</option>
            <option value="rating">Highest Rated</option>
            <option value="year">Release Year</option>
          </select>
        </div>
      </div>

      {filteredMovies.length === 0 ? (
        <div className="no-results">
          <p>No movies found matching your filters.</p>
        </div>
      ) : (
        <div className="movies-grid">
          {filteredMovies.map((movie) => (
            <MovieCard
              key={movie._id}
              movie={movie}
              onPlayTrailer={handlePlayTrailer}
              onUnlike={handleUnlike}
              showUnlikeOption={true}
            />
          ))}
        </div>
      )}

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
