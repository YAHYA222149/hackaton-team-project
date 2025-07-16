import { useState } from 'react';
import './MovieCard.css';

export default function MovieCard({ movie, type }) {
  const [showDetails, setShowDetails] = useState(false);

  // Define a class depending on the type
  const cardClass = type === 'series' ? 'movie-card series' : 'movie-card movie';

  return (
    <div className={cardClass}>
      <img
        src={movie.image}
        alt={movie.title}
        className="movie-poster"
        onClick={() => setShowDetails(!showDetails)}
      />
      <h3 className="movie-title">{movie.title}</h3>

      {showDetails && (
        <div className="movie-details">
          <p>{movie.description}</p>
          <div className="trailer">
            <iframe
              src={movie.trailer}
              title="Trailer"
              allowFullScreen
            ></iframe>
          </div>
          <a href={movie.link} target="_blank" rel="noreferrer" className="watch-now">
            Watch Now
          </a>
        </div>
      )}
    </div>
  );
}
