import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Movie from '../models/Movie.js';
import Admin from '../models/Admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Sample movie data structure based on your films.json
const sampleMovies = [
  {
    title: "The Matrix",
    type: "Movie",
    genre: ["Action", "Sci-Fi", "Thriller"],
    description: "A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.",
    imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500",
    trailerUrl: "https://youtube.com/watch?v=m8e-FF8MsqU",
    netflixLink: "https://www.netflix.com/title/20557937",
    rating: 8.7,
    duration: "2h 16m",
    director: "The Wachowskis",
    language: "English",
    featured: true,
    cast: [
      { name: "Keanu Reeves", role: "Neo" },
      { name: "Laurence Fishburne", role: "Morpheus" },
      { name: "Carrie-Anne Moss", role: "Trinity" }
    ]
  },
  {
    title: "Stranger Things",
    type: "Series",
    genre: ["Drama", "Fantasy", "Horror"],
    description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
    imageUrl: "https://images.unsplash.com/photo-1489599328877-d2eade8b5fdc?w=500",
    trailerUrl: "https://youtube.com/watch?v=b9EkMc79ZSU",
    netflixLink: "https://www.netflix.com/title/80057281",
    rating: 8.8,
    duration: "51m per episode",
    language: "English",
    featured: true,
    cast: [
      { name: "Millie Bobby Brown", role: "Eleven" },
      { name: "Finn Wolfhard", role: "Mike Wheeler" },
      { name: "David Harbour", role: "Jim Hopper" }
    ]
  },
  {
    title: "Inception",
    type: "Movie",
    genre: ["Action", "Drama", "Sci-Fi"],
    description: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
    imageUrl: "https://images.unsplash.com/photo-1489599328877-d2eade8b5fdc?w=500",
    trailerUrl: "https://youtube.com/watch?v=YoHD9XEInc0",
    netflixLink: "https://www.netflix.com/title/70131314",
    rating: 8.8,
    duration: "2h 28m",
    director: "Christopher Nolan",
    language: "English",
    featured: false,
    cast: [
      { name: "Leonardo DiCaprio", role: "Cobb" },
      { name: "Marion Cotillard", role: "Mal" },
      { name: "Tom Hardy", role: "Eames" }
    ]
  },
  {
    title: "The Crown",
    type: "Series",
    genre: ["Biography", "Drama", "History"],
    description: "Follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the twentieth century.",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
    trailerUrl: "https://youtube.com/watch?v=JWtnJjn6ng0",
    netflixLink: "https://www.netflix.com/title/80025678",
    rating: 8.7,
    duration: "58m per episode",
    language: "English",
    featured: true,
    cast: [
      { name: "Claire Foy", role: "Elizabeth II" },
      { name: "Olivia Colman", role: "Elizabeth II" },
      { name: "Imelda Staunton", role: "Elizabeth II" }
    ]
  },
  {
    title: "Interstellar",
    type: "Movie",
    genre: ["Adventure", "Drama", "Sci-Fi"],
    description: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
    imageUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=500",
    trailerUrl: "https://youtube.com/watch?v=zSWdZVtXT7E",
    netflixLink: "https://www.netflix.com/title/70305903",
    rating: 8.6,
    duration: "2h 49m",
    director: "Christopher Nolan",
    language: "English",
    featured: false,
    cast: [
      { name: "Matthew McConaughey", role: "Cooper" },
      { name: "Anne Hathaway", role: "Brand" },
      { name: "Jessica Chastain", role: "Murph" }
    ]
  },
  {
    title: "Dark",
    type: "Series",
    genre: ["Crime", "Drama", "Mystery"],
    description: "A family saga with a supernatural twist, set in a German town where the disappearance of two young children exposes the relationships among four families.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500",
    trailerUrl: "https://youtube.com/watch?v=rrwycJ08PSA",
    netflixLink: "https://www.netflix.com/title/80100172",
    rating: 8.8,
    duration: "60m per episode",
    language: "German",
    featured: true,
    cast: [
      { name: "Louis Hofmann", role: "Jonas Kahnwald" },
      { name: "Oliver Masucci", role: "Ulrich Nielsen" },
      { name: "Maja Schöne", role: "Hannah Kahnwald" }
    ]
  }
];

async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

async function clearDatabase() {
  try {
    await Movie.deleteMany({});
    await Admin.deleteMany({});
    console.log('🗑️  Cleared existing data');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  }
}

async function seedMovies() {
  try {
    await Movie.insertMany(sampleMovies);
    console.log(`✅ Seeded ${sampleMovies.length} movies/series`);
  } catch (error) {
    console.error('❌ Error seeding movies:', error);
  }
}

async function createDefaultAdmin() {
  try {
    const adminExists = await Admin.findOne({ username: 'admin' });
    if (adminExists) {
      console.log('👤 Default admin already exists');
      return;
    }

    const admin = new Admin({
      username: process.env.ADMIN_USERNAME || 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      role: 'super_admin'
    });

    await admin.save();
    console.log('✅ Created default admin user');
    console.log(`   Username: ${admin.username}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  }
}

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectDatabase();
    await clearDatabase();
    await seedMovies();
    await createDefaultAdmin();
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Movies/Series: ${sampleMovies.length}`);
    console.log('   Admin user: Created');
    console.log('\n🔗 API Endpoints:');
    console.log('   GET /api/catalog - Get all content');
    console.log('   GET /api/catalog/featured - Get featured content');
    console.log('   POST /api/admin/login - Admin login');
    console.log('   POST /api/catalog/add - Add content (admin only)');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

// Function to import data from your existing films.json
async function importFromJSON() {
  try {
    const filmsPath = path.join(__dirname, '../../films.json');
    
    if (fs.existsSync(filmsPath)) {
      console.log('📄 Found films.json, importing data...');
      
      const rawData = fs.readFileSync(filmsPath, 'utf8');
      const lines = rawData.trim().split('\n');
      const movies = [];
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            const movieData = JSON.parse(line);
            
            // Transform your existing data structure to match our schema
            const transformedMovie = {
              title: movieData.title,
              type: movieData.type || 'Movie',
              genre: Array.isArray(movieData.genre) ? movieData.genre : [movieData.genre || 'Drama'],
              description: movieData.description,
              imageUrl: movieData.imageUrl,
              trailerUrl: movieData.trailerUrl,
              netflixLink: movieData.netflixLink,
              rating: Math.random() * 3 + 7, // Random rating between 7-10
              featured: Math.random() > 0.7 // 30% chance of being featured
            };
            
            movies.push(transformedMovie);
          } catch (parseError) {
            console.warn('⚠️  Skipped invalid JSON line:', line.substring(0, 50) + '...');
          }
        }
      }
      
      if (movies.length > 0) {
        await Movie.insertMany(movies);
        console.log(`✅ Imported ${movies.length} movies from films.json`);
      }
    } else {
      console.log('📄 No films.json found, using sample data');
      await seedMovies();
    }
  } catch (error) {
    console.error('❌ Error importing from JSON:', error);
    await seedMovies(); // Fallback to sample data
  }
}

// Main seeding function
async function main() {
  try {
    console.log('🌱 Starting 4U FLIX database seeding...');
    
    await connectDatabase();
    await clearDatabase();
    await importFromJSON();
    await createDefaultAdmin();
    
    const movieCount = await Movie.countDocuments();
    const adminCount = await Admin.countDocuments();
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`   Movies/Series: ${movieCount}`);
    console.log(`   Admin users: ${adminCount}`);
    console.log('\n🔐 Default Admin Credentials:');
    console.log(`   Username: ${process.env.ADMIN_USERNAME || 'admin'}`);
    console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
    console.log('\n🔗 API Endpoints:');
    console.log(`   Health Check: http://localhost:${process.env.PORT || 5000}/api/health`);
    console.log(`   Get Catalog: http://localhost:${process.env.PORT || 5000}/api/catalog`);
    console.log(`   Featured Content: http://localhost:${process.env.PORT || 5000}/api/catalog/featured`);
    console.log(`   Admin Login: http://localhost:${process.env.PORT || 5000}/api/admin/login`);
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

// Run the seeding
main();
