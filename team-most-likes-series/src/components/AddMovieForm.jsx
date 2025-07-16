import { useState } from 'react';
import './AddMovieForm.css';

const genres = ['Action', 'Horror', 'Drama', 'Comedy', 'Fun', 'Thriller', 'Romance'];

export default function AddMovieForm() {
  const [type, setType] = useState('movie');  // Movie or Series
  const [genre, setGenre] = useState(genres[0]); // Default genre

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const newItem = {
      type,
      genre,
      title: form.title.value,
      image: form.image.value,
      description: form.description.value,
      trailer: form.trailer.value,
      link: form.link.value,
    };

    console.log('Submitting new item:', newItem);
    // TODO: send newItem to backend or update state
  };

  return (
    <div className="add-form">
      <h2>Add New Movie/Series</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)} name="type">
            <option value="movie">Movie</option>
            <option value="series">Series</option>
          </select>
        </label>

        <label>
          Genre:
          <select value={genre} onChange={(e) => setGenre(e.target.value)} name="genre">
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </label>

        <input type="text" placeholder="Title" name="title" required />
        <input type="text" placeholder="Image URL" name="image" required />
        <input type="text" placeholder="Description" name="description" required />
        <input type="text" placeholder="Trailer URL" name="trailer" />
        <input type="text" placeholder="Netflix Link" name="link" />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
