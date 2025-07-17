import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from '../models/Movie.js';
import Admin from '../models/Admin.js';

// Load environment variables
dotenv.config();

const sampleMovies = [
  // Popular Movies
  {
    title: "The Shawshank Redemption",
    description: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    type: "Movie",
    genre: ["Drama"],
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=NmzuHjWmXOc",
    netflixLink: "https://www.netflix.com/title/70057988",
    rating: 9.3,
    releaseDate: new Date('1994-09-23'),
    duration: "2h 22m",
    cast: [
      { name: "Tim Robbins", role: "Andy Dufresne" },
      { name: "Morgan Freeman", role: "Ellis Boyd 'Red' Redding" },
      { name: "Bob Gunton", role: "Warden Norton" }
    ],
    director: "Frank Darabont",
    featured: true
  },
  {
    title: "The Godfather",
    description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    type: "Movie",
    genre: ["Crime", "Drama"],
    imageUrl: "https://occ-0-8407-1009.1.nflxso.net/dnm/api/v6/Qs00mKCpRvrkl3HZAN5KwEL1kpE/AAAABQtKfoMcZ_Y6_I8he5fS3_iWJ3qIGiennI96afL-MJCBvlruI6PUuH7hgymxgsvD8hchPjI4adjnMIXuLdpdiWhvjPUP_kVyFqU6.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=UaVTIH8mujA",
    netflixLink: "https://www.netflix.com/title/60011152",
    rating: 9.2,
    releaseDate: new Date('1972-03-24'),
    duration: "2h 55m",
    cast: [
      { name: "Marlon Brando", role: "Don Vito Corleone" },
      { name: "Al Pacino", role: "Michael Corleone" },
      { name: "James Caan", role: "Sonny Corleone" }
    ],
    director: "Francis Ford Coppola",
    featured: true
  },
  {
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.",
    type: "Movie",
    genre: ["Action", "Crime", "Drama"],
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=EXeTwQWrcwY",
    netflixLink: "https://www.netflix.com/title/70079583",
    rating: 9.0,
    releaseDate: new Date('2008-07-18'),
    duration: "2h 32m",
    cast: [
      { name: "Christian Bale", role: "Batman/Bruce Wayne" },
      { name: "Heath Ledger", role: "The Joker" },
      { name: "Aaron Eckhart", role: "Harvey Dent" }
    ],
    director: "Christopher Nolan",
    featured: true
  },
  {
    title: "Pulp Fiction",
    description: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
    type: "Movie",
    genre: ["Crime", "Drama"],
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=s7EdQ4FqbhY",
    netflixLink: "https://www.netflix.com/title/880640",
    rating: 8.9,
    releaseDate: new Date('1994-10-14'),
    duration: "2h 34m",
    cast: [
      { name: "John Travolta", role: "Vincent Vega" },
      { name: "Uma Thurman", role: "Mia Wallace" },
      { name: "Samuel L. Jackson", role: "Jules Winnfield" }
    ],
    director: "Quentin Tarantino",
    featured: false
  },
  {
    title: "Inception",
    description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    type: "Movie",
    genre: ["Action", "Sci-Fi", "Thriller"],
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    netflixLink: "https://www.netflix.com/title/70131314",
    rating: 8.8,
    releaseDate: new Date('2010-07-16'),
    duration: "2h 28m",
    cast: [
      { name: "Leonardo DiCaprio", role: "Dom Cobb" },
      { name: "Marion Cotillard", role: "Mal" },
      { name: "Tom Hardy", role: "Eames" }
    ],
    director: "Christopher Nolan",
    featured: false
  },
  {
    title: "The Matrix",
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    type: "Movie",
    genre: ["Action", "Sci-Fi"],
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=vKQi3bBA1y8",
    netflixLink: "https://www.netflix.com/title/20557937",
    rating: 8.7,
    releaseDate: new Date('1999-03-31'),
    duration: "2h 16m",
    cast: [
      { name: "Keanu Reeves", role: "Neo" },
      { name: "Laurence Fishburne", role: "Morpheus" },
      { name: "Carrie-Anne Moss", role: "Trinity" }
    ],
    director: "The Wachowskis",
    featured: false
  },
  {
    title: "Avengers: Endgame",
    description: "After the devastating events of Infinity War, the universe is in ruins. The Avengers must assemble once more to undo Thanos' actions.",
    type: "Movie",
    genre: ["Action", "Adventure", "Drama"],
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=TcMBFSGVi1c",
    netflixLink: "https://www.netflix.com/title/81045777",
    rating: 8.4,
    releaseDate: new Date('2019-04-26'),
    duration: "3h 1m",
    cast: [
      { name: "Robert Downey Jr.", role: "Tony Stark/Iron Man" },
      { name: "Chris Evans", role: "Steve Rogers/Captain America" },
      { name: "Scarlett Johansson", role: "Natasha Romanoff/Black Widow" }
    ],
    director: "Anthony Russo, Joe Russo",
    featured: false
  },
  {
    title: "Parasite",
    description: "A poor family schemes to become employed by a wealthy family and infiltrate their household by posing as unrelated, highly qualified individuals.",
    type: "Movie",
    genre: ["Comedy", "Drama", "Thriller"],
    imageUrl: "https://occ-0-8407-92.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABU8cfFH1oPrMYQ0utvshjZDTtw-6IJCE1N7_jZb6lasYQ8_aQEGCwoqsX1ryXnWZcqFlyqo2bPfZIBL_hTiuNPEOnxiJLTmdR2hc.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=5xH0HfJHsaY",
    netflixLink: "https://www.netflix.com/title/81160566",
    rating: 8.6,
    releaseDate: new Date('2019-05-30'),
    duration: "2h 12m",
    cast: [
      { name: "Song Kang-ho", role: "Ki-taek" },
      { name: "Lee Sun-kyun", role: "Park Dong-ik" },
      { name: "Cho Yeo-jeong", role: "Choi Yeon-gyo" }
    ],
    director: "Bong Joon-ho",
    featured: false
  },

  // Popular TV Series
  {
    title: "Breaking Bad",
    description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine.",
    type: "Series",
    genre: ["Crime", "Drama", "Thriller"],
    imageUrl: "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=HhesaQXLuRY",
    netflixLink: "https://www.netflix.com/title/70143836",
    rating: 9.5,
    releaseDate: new Date('2008-01-20'),
    duration: "47m",
    cast: [
      { name: "Bryan Cranston", role: "Walter White" },
      { name: "Aaron Paul", role: "Jesse Pinkman" },
      { name: "Anna Gunn", role: "Skyler White" }
    ],
    director: "Vince Gilligan",
    featured: true
  },
  {
    title: "Stranger Things",
    description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.",
    type: "Series",
    genre: ["Drama", "Fantasy", "Horror"],
    imageUrl: "https://m.media-amazon.com/images/M/MV5BN2ZmYjg1YmItNWQ4OC00YWM0LWE0ZDktYThjOTZiZjhhN2Q2XkEyXkFqcGdeQXVyNjgxNTQ3Mjk@._V1_.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=b9EkMc79ZSU",
    netflixLink: "https://www.netflix.com/title/80057281",
    rating: 8.7,
    releaseDate: new Date('2016-07-15'),
    duration: "51m",
    cast: [
      { name: "Millie Bobby Brown", role: "Eleven" },
      { name: "Finn Wolfhard", role: "Mike Wheeler" },
      { name: "David Harbour", role: "Jim Hopper" }
    ],
    director: "The Duffer Brothers",
    featured: true
  },
  {
    title: "Game of Thrones",
    description: "Nine noble families wage war against each other in order to gain control over the mythical land of Westeros.",
    type: "Series",
    genre: ["Action", "Adventure", "Drama"],
    imageUrl: "https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=rlR4PJn8b8I",
    netflixLink: "https://www.netflix.com/title/70121955",
    rating: 9.3,
    releaseDate: new Date('2011-04-17'),
    duration: "57m",
    cast: [
      { name: "Emilia Clarke", role: "Daenerys Targaryen" },
      { name: "Peter Dinklage", role: "Tyrion Lannister" },
      { name: "Kit Harington", role: "Jon Snow" }
    ],
    director: "David Benioff, D.B. Weiss",
    featured: true
  },
  {
    title: "The Office",
    description: "A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.",
    type: "Series",
    genre: ["Comedy"],
    imageUrl: "https://m.media-amazon.com/images/M/MV5BMDNkOTE4NDQtMTNmYi00MWE0LWE4ZTktYTc0NzhhNWIzNzJiXkEyXkFqcGdeQXVyMzQ2MDI5NjU@._V1_.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=LHOtME2DL4g",
    netflixLink: "https://www.netflix.com/title/70136120",
    rating: 9.0,
    releaseDate: new Date('2005-03-24'),
    duration: "22m",
    cast: [
      { name: "Steve Carell", role: "Michael Scott" },
      { name: "John Krasinski", role: "Jim Halpert" },
      { name: "Jenna Fischer", role: "Pam Beesly" }
    ],
    director: "Greg Daniels",
    featured: false
  },
  {
    title: "Friends",
    description: "Follows the personal and professional lives of six twenty to thirty-something-year-old friends living in Manhattan.",
    type: "Series",
    genre: ["Comedy", "Romance"],
    imageUrl: "https://m.media-amazon.com/images/M/MV5BNDVkYjU0MzctMWRmZi00NTkxLTgwZWEtOWVhYjZlYjllYmU4XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=hDNNmeeJs1Q",
    netflixLink: "https://www.netflix.com/title/70153404",
    rating: 8.9,
    releaseDate: new Date('1994-09-22'),
    duration: "22m",
    cast: [
      { name: "Jennifer Aniston", role: "Rachel Green" },
      { name: "Courteney Cox", role: "Monica Geller" },
      { name: "Lisa Kudrow", role: "Phoebe Buffay" }
    ],
    director: "David Crane, Marta Kauffman",
    featured: false
  },
  {
    title: "The Crown",
    description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
    type: "Series",
    genre: ["Biography", "Drama", "History"],
    imageUrl: "https://occ-0-8407-90.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQu8KMEC7Rrr8/AAAABcSnFM_V_mWxOvdPn8vTB2rispevVWyYGj7IocNaEZBzvbvFIn6KzJZiFFV3JHVth9X_4wJ5ukU3_Wm0RCh_Aj2dqoy6LeacObX8.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=JWtnJjn6ng0",
    netflixLink: "https://www.netflix.com/title/80025678",
    rating: 8.7,
    releaseDate: new Date('2016-11-04'),
    duration: "58m",
    cast: [
      { name: "Claire Foy", role: "Queen Elizabeth II" },
      { name: "Olivia Colman", role: "Queen Elizabeth II" },
      { name: "Matt Smith", role: "Prince Philip" }
    ],
    director: "Peter Morgan",
    featured: false
  },
  {
    title: "Squid Game",
    description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games for a tempting prize.",
    type: "Series",
    genre: ["Action", "Drama", "Mystery"],
    imageUrl: "https://occ-0-8407-90.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABdWejBzwyTY8b6TDhV8fS7YUtOfROMX5cuyF44z2RRD7rS4rV7NpmiFhSI76Xxh2RqNis3sfepSG2WCw4DLDMVSPM9TY3-ufOb6B.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=oqxAJKy0ii4",
    netflixLink: "https://www.netflix.com/title/81040344",
    rating: 8.0,
    releaseDate: new Date('2021-09-17'),
    duration: "56m",
    cast: [
      { name: "Lee Jung-jae", role: "Seong Gi-hun" },
      { name: "Park Hae-soo", role: "Cho Sang-woo" },
      { name: "Wi Ha-jun", role: "Hwang Jun-ho" }
    ],
    director: "Hwang Dong-hyuk",
    featured: false
  },
  {
    title: "Money Heist",
    description: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
    type: "Series",
    genre: ["Action", "Crime", "Mystery"],
    imageUrl: "https://m.media-amazon.com/images/M/MV5BODI0ZTljYTMtODQ1NC00NmI0LTk1YWUtN2FlNDM1MDExMDlhXkEyXkFqcGdeQXVyMTM0NTUzNDIy._V1_.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=_InqQJRqGW4",
    netflixLink: "https://www.netflix.com/title/80192098",
    rating: 8.2,
    releaseDate: new Date('2017-05-02'),
    duration: "70m",
    cast: [
      { name: "Álvaro Morte", role: "The Professor" },
      { name: "Itziar Ituño", role: "Raquel Murillo" },
      { name: "Pedro Alonso", role: "Berlin" }
    ],
    director: "Álex Pina",
    featured: false
  },
  {
    title: "Wednesday",
    description: "Follows Wednesday Addams' years as a student at Nevermore Academy, where she tries to master her emerging psychic ability.",
    type: "Series",
    genre: ["Comedy", "Crime", "Family"],
    imageUrl: "https://m.media-amazon.com/images/M/MV5BM2ZmMjEyZmYtOGM4YS00YTNhLWE3ZDMtNzQxM2RhNjBlODIyXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=Di310WS8zLk",
    netflixLink: "https://www.netflix.com/title/81231974",
    rating: 8.1,
    releaseDate: new Date('2022-11-23'),
    duration: "50m",
    cast: [
      { name: "Jenna Ortega", role: "Wednesday Addams" },
      { name: "Hunter Doohan", role: "Tyler Galpin" },
      { name: "Emma Myers", role: "Enid Sinclair" }
    ],
    director: "Alfred Gough, Miles Millar",
    featured: false
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Clear existing data
    await Movie.deleteMany({});
    await Admin.deleteMany({});
    console.log('🗑️  Cleared existing data');
    
    // Insert sample movies
    const insertedMovies = await Movie.insertMany(sampleMovies);
    console.log(`🎬 Inserted ${insertedMovies.length} movies`);
    
    // Create admin user
    const admin = new Admin({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123', // Let the model hash it
      role: 'admin'
    });
    
    await admin.save();
    console.log('👤 Created admin user');
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Movies: ${insertedMovies.length}`);
    console.log(`   - Admin user: ${admin.username}`);
    console.log(`   - Featured movies: ${insertedMovies.filter(m => m.featured).length}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
