import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Star, Calendar, Clock, Film, Tv, FileText } from 'lucide-react';

const AddMovieForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Movie',
    genre: [],
    description: '',
    imageUrl: '',
    trailerUrl: '',
    netflixLink: '',
    rating: '',
    duration: '',
    director: '',
    language: 'English',
    releaseDate: '',
    cast: [{ name: '', role: '' }],
    featured: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const genres = [
    'Action', 'Adventure', 'Animation', 'Biography', 'Comedy', 'Crime',
    'Documentary', 'Drama', 'Family', 'Fantasy', 'History', 'Horror',
    'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Sport', 'Thriller', 'War', 'Western'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleGenreChange = (genre) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter(g => g !== genre)
        : [...prev.genre, genre]
    }));
  };

  const handleCastChange = (index, field, value) => {
    const newCast = [...formData.cast];
    newCast[index][field] = value;
    setFormData(prev => ({ ...prev, cast: newCast }));
  };

  const addCastMember = () => {
    setFormData(prev => ({
      ...prev,
      cast: [...prev.cast, { name: '', role: '' }]
    }));
  };

  const removeCastMember = (index) => {
    if (formData.cast.length > 1) {
      setFormData(prev => ({
        ...prev,
        cast: prev.cast.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.imageUrl.trim()) newErrors.imageUrl = 'Image URL is required';
    if (formData.genre.length === 0) newErrors.genre = 'At least one genre is required';
    
    if (formData.imageUrl && !formData.imageUrl.match(/\.(jpg|jpeg|png|webp|avif)(\?.*)?$/i)) {
      newErrors.imageUrl = 'Image URL must end with .jpg, .jpeg, .png, .webp, or .avif';
    }
    
    if (formData.trailerUrl && !formData.trailerUrl.match(/^https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)/i)) {
      newErrors.trailerUrl = 'Please provide a valid YouTube or Vimeo URL';
    }
    
    if (formData.rating && (isNaN(formData.rating) || formData.rating < 0 || formData.rating > 10)) {
      newErrors.rating = 'Rating must be between 0 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      // Clean up the data
      const submitData = {
        ...formData,
        rating: formData.rating ? parseFloat(formData.rating) : undefined,
        cast: formData.cast.filter(member => member.name.trim()),
        genre: formData.genre
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-dark-800 rounded-xl shadow-2xl max-w-2xl w-full mx-auto border border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gold-500/20 rounded-lg">
            <Upload className="w-5 h-5 text-gold-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Add New Content</h2>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors duration-300"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-900 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none transition-colors duration-300"
              placeholder="Enter title..."
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type *
            </label>
            <div className="flex gap-2">
              {['Movie', 'Series', 'Documentary'].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    value={type}
                    checked={formData.type === type}
                    onChange={handleChange}
                    className="text-gold-400 focus:ring-gold-400"
                  />
                  <span className="text-white text-sm flex items-center gap-1">
                    {type === 'Movie' && <Film className="w-4 h-4" />}
                    {type === 'Series' && <Tv className="w-4 h-4" />}
                    {type === 'Documentary' && <FileText className="w-4 h-4" />}
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-3 bg-dark-900 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none transition-colors duration-300 resize-none"
            placeholder="Enter description..."
          />
          {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* URLs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Image URL *
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-900 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none transition-colors duration-300"
              placeholder="https://example.com/image.jpg"
            />
            {errors.imageUrl && <p className="text-red-400 text-sm mt-1">{errors.imageUrl}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Trailer URL
              </label>
              <input
                type="url"
                name="trailerUrl"
                value={formData.trailerUrl}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-900 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none transition-colors duration-300"
                placeholder="YouTube or Vimeo URL"
              />
              {errors.trailerUrl && <p className="text-red-400 text-sm mt-1">{errors.trailerUrl}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Streaming URL
              </label>
              <input
                type="url"
                name="netflixLink"
                value={formData.netflixLink}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark-900 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none transition-colors duration-300"
                placeholder="Netflix, Hulu, etc."
              />
            </div>
          </div>
        </div>

        {/* Genres */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Genres * (Select multiple)
          </label>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto">
            {genres.map((genre) => (
              <label key={genre} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.genre.includes(genre)}
                  onChange={() => handleGenreChange(genre)}
                  className="text-gold-400 focus:ring-gold-400"
                />
                <span className="text-white text-sm">{genre}</span>
              </label>
            ))}
          </div>
          {errors.genre && <p className="text-red-400 text-sm mt-1">{errors.genre}</p>}
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Star className="inline w-4 h-4 mr-1" />
              Rating (0-10)
            </label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="0"
              max="10"
              step="0.1"
              className="w-full px-4 py-3 bg-dark-900 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none transition-colors duration-300"
              placeholder="8.5"
            />
            {errors.rating && <p className="text-red-400 text-sm mt-1">{errors.rating}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Clock className="inline w-4 h-4 mr-1" />
              Duration
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-900 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none transition-colors duration-300"
              placeholder="2h 30m"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar className="inline w-4 h-4 mr-1" />
              Release Date
            </label>
            <input
              type="date"
              name="releaseDate"
              value={formData.releaseDate}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-900 border border-white/20 rounded-lg text-white focus:border-gold-400 focus:outline-none transition-colors duration-300"
            />
          </div>
        </div>

        {/* Director and Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Director
            </label>
            <input
              type="text"
              name="director"
              value={formData.director}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-900 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none transition-colors duration-300"
              placeholder="Director name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Language
            </label>
            <input
              type="text"
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-dark-900 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-gold-400 focus:outline-none transition-colors duration-300"
              placeholder="English"
            />
          </div>
        </div>

        {/* Featured Toggle */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-5 h-5 text-gold-400 focus:ring-gold-400"
          />
          <label className="text-white font-medium">
            Mark as Featured Content
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t border-white/10">
          {onCancel && (
            <motion.button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
          )}
          
          <motion.button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-3 bg-gold-500 hover:bg-gold-600 disabled:bg-gold-500/50 text-black font-bold rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <>
                <motion.div
                  className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Adding...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Add Content
              </>
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddMovieForm;
