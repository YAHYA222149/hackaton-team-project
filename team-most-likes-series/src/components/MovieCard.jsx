import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

export default function MovieCard({ movie, type }) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    // Navigate to detail page, passing movie data in state
    navigate('/detail', { state: { movie } });
  };

  // Truncate description to ~100 chars
  const truncatedDesc =
    movie.description.length > 100
      ? movie.description.slice(0, 100) + '...'
      : movie.description;

  return (
    <div
      className={`movie-card ${type}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img src={movie.image} alt={movie.title} className="movie-poster" />

      {hovered && (
        <div className="overlay">
          <h3>{movie.title}</h3>
          <p>{truncatedDesc}</p>
          <button className="link-button" onClick={handleClick}>
            Read More
          </button>
          <button className="link-button" onClick={handleClick}>
            Watch Trailer
          </button>
        </div>
      )}
    </div>
  );
}
