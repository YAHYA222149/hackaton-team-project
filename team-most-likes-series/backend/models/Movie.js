import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['Movie', 'Series', 'Documentary'],
    default: 'Movie'
  },
  genre: {
    type: [String],
    required: [true, 'At least one genre is required'],
    validate: {
      validator: function(genres) {
        return genres && genres.length > 0;
      },
      message: 'At least one genre must be specified'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
    validate: {
      validator: function(url) {
        // More flexible validation that allows query parameters
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif)(\?.*)?$/i.test(url);
      },
      message: 'Please provide a valid image URL ending with .jpg, .jpeg, .png, .webp, or .avif'
    }
  },
  trailerUrl: {
    type: String,
    validate: {
      validator: function(url) {
        if (!url) return true; // Optional field
        return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)/i.test(url);
      },
      message: 'Please provide a valid YouTube or Vimeo URL'
    }
  },
  netflixLink: {
    type: String,
    validate: {
      validator: function(url) {
        if (!url) return true; // Optional field
        return /^https?:\/\/.+/i.test(url);
      },
      message: 'Please provide a valid streaming URL'
    }
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be less than 0'],
    max: [10, 'Rating cannot exceed 10'],
    default: 0
  },
  duration: {
    type: String, // e.g., "2h 30m" or "45m"
    trim: true
  },
  cast: [{
    name: {
      type: String,
      trim: true
    },
    role: {
      type: String,
      trim: true
    }
  }],
  director: {
    type: String,
    trim: true
  },
  language: {
    type: String,
    default: 'English',
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ genre: 1 });
movieSchema.index({ type: 1 });
movieSchema.index({ featured: -1, createdAt: -1 });

// Virtual for formatted rating
movieSchema.virtual('formattedRating').get(function() {
  return this.rating ? this.rating.toFixed(1) : '0.0';
});

// Static method to get featured content
movieSchema.statics.getFeatured = function() {
  return this.find({ featured: true, isActive: true })
    .sort({ createdAt: -1 })
    .limit(10);
};

// Static method to get by type
movieSchema.statics.getByType = function(type) {
  return this.find({ type, isActive: true })
    .sort({ createdAt: -1 });
};

const Movie = mongoose.model('Movie', movieSchema);

export default Movie;
