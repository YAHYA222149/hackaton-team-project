import { useState } from 'react';
import MovieRow from '../components/MovieRow';
import AddMovieForm from '../components/AddMovieForm';
import './Home.css';
import logo from '../assets/logo.png';

export default function Home() {
  const [showAdd, setShowAdd] = useState(false);

  // Example dummy data — replace with your real data or fetch it
  const moviesArray = [
    {
      id: 1,
      title: 'Inception',
      image: 'https://image.url/inception.jpg',
      description: 'A thief who steals corporate secrets...',
      trailer: 'https://www.youtube.com/embed/YoHD9XEInc0',
      link: 'https://netflix.com/inception',
      genre: 'Action',
    },
    // Add more movie objects here
  ];

  const seriesArray = [
    {
      id: 101,
      title: 'Stranger Things',
      image: 'https://image.url/stranger-things.jpg',
      description: 'Mystery and supernatural...',
      trailer: 'https://www.youtube.com/embed/b9EkMc79ZSU',
      link: 'https://netflix.com/stranger-things',
      genre: 'Drama',
    },
    // Add more series objects here
  ];

  return (
    <div className="home">
      <header className="home-header">
        <img src={logo} alt="" />
        <button className="add-button" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? 'Close' : 'Add Movie/Series'}
        </button>
      </header>

      <div className="home-content">
        {showAdd && <AddMovieForm />}
        <MovieRow title="Movies" items={moviesArray} type="movie" />
        <MovieRow title="Series" items={seriesArray} type="series" />
      </div>
    </div>
  );
}
