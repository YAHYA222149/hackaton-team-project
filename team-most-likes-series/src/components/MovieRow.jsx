import { useState } from 'react';
import MovieCard from './MovieCard';

const genres = ['All', 'Horror', 'Action', 'Drama', 'Comedy', 'Fun'];

export default function MovieRow({ title, items = [], type }) {
  const [selectedGenre, setSelectedGenre] = useState('All');

  // Filter items based on selected genre
  const filteredItems =
    selectedGenre === 'All'
      ? items
      : items.filter(
          (item) =>
            item.genre &&
            item.genre.toLowerCase() === selectedGenre.toLowerCase()
        );

  return (
    <div className={`movie-row ${type}`}>
      <div className="row-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>{title}</h2>

        {/* FILTER DROPDOWN */}
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            backgroundColor: '#333',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
      </div>

      <div className="cards-container">
        {filteredItems.map((item) => (
          // Render your MovieCard or SeriesCard here
          <MovieCard key={item.id} movie={item} type={type} />
        ))}
      </div>
    </div>
  );
}
