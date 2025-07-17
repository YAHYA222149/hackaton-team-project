import express from 'express';
import { body, validationResult } from 'express-validator';
import Movie from '../models/Movie.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const validateMovie = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('type')
    .isIn(['Movie', 'Series', 'Documentary'])
    .withMessage('Type must be Movie, Series, or Documentary'),
  body('genre')
    .isArray({ min: 1 })
    .withMessage('At least one genre is required'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),
  body('imageUrl')
    .isURL()
    .withMessage('Please provide a valid image URL')
    .custom((value) => {
      // More flexible image URL validation
      if (value && !value.match(/\.(jpg|jpeg|png|webp|avif)(\?.*)?$/i)) {
        throw new Error('Image URL must end with a valid image extension (.jpg, .jpeg, .png, .webp, .avif)');
      }
      return true;
    }),
  body('trailerUrl')
    .optional()
    .isURL()
    .withMessage('Please provide a valid URL for trailer'),
  body('netflixLink')
    .optional()
    .isURL()
    .withMessage('Please provide a valid streaming URL'),
  body('rating')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Rating must be between 0 and 10')
];

// GET /api/catalog - Get all movies and series
router.get('/', async (req, res) => {
  try {
    const { 
      type, 
      genre, 
      featured, 
      search, 
      page = 1, 
      limit = 20,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const query = { isActive: true };
    
    if (type) {
      query.type = type;
    }
    
    if (genre) {
      query.genre = { $in: [genre] };
    }
    
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query
    const movies = await Movie.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Movie.countDocuments(query);
    
    res.json({
      success: true,
      data: movies,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        hasNextPage: skip + movies.length < total,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Get catalog error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching catalog',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/catalog/featured - Get featured content
router.get('/featured', async (req, res) => {
  try {
    const featured = await Movie.getFeatured();
    
    res.json({
      success: true,
      data: featured
    });
  } catch (error) {
    console.error('Get featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured content'
    });
  }
});

// GET /api/catalog/:id - Get single movie/series
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    
    if (!movie || !movie.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found'
      });
    }

    // Increment view count
    movie.views += 1;
    await movie.save();

    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Get movie error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid movie ID'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error fetching movie'
    });
  }
});

// POST /api/catalog/add - Add new movie/series (Admin only)
router.post('/add', authenticateAdmin, validateMovie, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({
        success: false,
        message: 'Validation errors',
        errors: errors.array(),
        receivedData: req.body
      });
    }

    // Check if movie already exists
    const existingMovie = await Movie.findOne({
      title: { $regex: new RegExp(req.body.title, 'i') },
      type: req.body.type
    });

    if (existingMovie) {
      return res.status(409).json({
        success: false,
        message: 'A movie/series with this title already exists'
      });
    }

    const movie = new Movie(req.body);
    await movie.save();

    res.status(201).json({
      success: true,
      message: 'Movie added successfully',
      data: movie
    });
  } catch (error) {
    console.error('Add movie error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding movie',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;
