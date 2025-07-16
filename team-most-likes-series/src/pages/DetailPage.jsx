import { useLocation, useNavigate } from 'react-router-dom';

export default function DetailPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Movie/series data passed via router state
  const { movie } = location.state || {};

  if (!movie) {
    return (
      <div style={{ padding: '20px', color: 'white' }}>
        <h2>Movie/Series not found.</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, backgroundColor: 'black', color: 'white', minHeight: '100vh' }}>
      <h1>{movie.title}</h1>
      <img
        src={movie.image}
        alt={movie.title}
        style={{ maxWidth: '400px', width: '100%', borderRadius: '8px' }}
      />
      <p style={{ marginTop: 20 }}>{movie.description}</p>

      <div style={{ marginTop: 20 }}>
        <iframe
          src={movie.trailer}
          title={`${movie.title} Trailer`}
          width="560"
          height="315"
          frameBorder="0"
          allowFullScreen
        ></iframe>
      </div>

      <a
        href={movie.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'inline-block',
          marginTop: 20,
          padding: '10px 20px',
          backgroundColor: '#e50914',
          color: 'white',
          borderRadius: '6px',
          textDecoration: 'none',
          fontWeight: 'bold',
        }}
      >
        Watch Now on Netflix
      </a>
    </div>
  );
}
