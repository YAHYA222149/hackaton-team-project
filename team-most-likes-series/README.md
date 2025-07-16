# 4U FLIX - Modern Movie Streaming Platform

A modern, professional movie streaming website built with React, Node.js, Express, and MongoDB. Features include animated UI, secure admin controls, and a complete backend API.

## 🚀 Features

### Frontend
- ✨ **Modern Animated UI** with Framer Motion
- 🎨 **Gold-themed Design** with professional styling
- 📱 **Fully Responsive** design
- 🎬 **Interactive Movie Cards** with hover effects
- 🔄 **Dynamic Hero Section** with rotating featured content
- 📋 **Tabbed Detail Pages** with cast info and related content
- 🔍 **Search and Filtering** capabilities
- 💾 **Local Storage** for bookmarks and likes

### Backend
- 🛡️ **Secure API** with JWT authentication
- 🗄️ **MongoDB Database** with Mongoose schemas
- 🔒 **Admin-only Routes** for content management
- 📊 **Rate Limiting** and security middleware
- 🎯 **RESTful API** design
- 📱 **CORS Configuration** for frontend integration

### Admin Features
- 🔐 **Secure Login System** with JWT tokens
- ➕ **Add/Edit/Delete Content** with validation
- 👑 **Role-based Access Control**
- 📝 **Form Validation** and error handling

## 🛠️ Tech Stack

### Frontend
- **React 19** with Hooks and Context
- **Vite** for fast development and building
- **Tailwind CSS** for modern styling
- **Framer Motion** for smooth animations
- **React Router DOM** for navigation
- **Axios** for API calls
- **Lucide React** for beautiful icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** and **CORS** for security
- **Rate Limiting** for API protection

## 📦 Installation & Setup

### Prerequisites
- Node.js (v20 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies (from project root)
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Environment Configuration

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/4uflix
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
FRONTEND_URL=http://localhost:5173
```

### 3. Database Setup

#### Option 1: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use the provided URI: `mongodb://localhost:27017/4uflix`

#### Option 2: MongoDB Atlas (Cloud)
1. Create a MongoDB Atlas account
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in backend/.env

### 4. Seed the Database

```bash
# Navigate to backend folder
cd backend

# Run the seeding script
npm run seed
```

This will:
- Clear existing data
- Import movies from your films.json (if exists)
- Create sample movies and series
- Create default admin user (admin/admin123)

### 5. Start the Application

#### Terminal 1 - Backend API
```powershell
cd backend
npm run dev
```
Server will run on http://localhost:5000

#### Terminal 2 - Frontend (new terminal)
```powershell
# From project root
npm run dev
```
Frontend will run on http://localhost:5173

## 🔧 API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `GET /api/catalog` - Get all movies/series
- `GET /api/catalog/featured` - Get featured content
- `GET /api/catalog/:id` - Get single movie/series

### Admin Endpoints (Require Authentication)
- `POST /api/admin/login` - Admin login
- `GET /api/admin/profile` - Get admin profile
- `POST /api/catalog/add` - Add new content
- `PUT /api/catalog/:id` - Update content
- `DELETE /api/catalog/:id` - Delete content

### Authentication
Include JWT token in Authorization header:
```
Authorization: Bearer <jwt-token>
```

## 🎨 Customization

### Logo
- Replace the text-based logo in `src/components/Logo.jsx`
- For image logo, add to `src/assets/` and update component
- Supports SVG, PNG, WebP formats

### Styling
- Colors defined in `tailwind.config.js`
- Main color scheme: Gold (#FFD700) and Dark (#0f0f0f)
- Custom animations in `src/index.css`

### Content
- Add movies via admin panel or API
- Supports movies, series, and documentaries
- Required fields: title, description, image URL, genre
- Optional: trailer URL, streaming link, cast, rating

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Environment variable protection

## 📱 Mobile Responsiveness

The application is fully responsive with:
- Mobile-first design approach
- Touch-friendly interface
- Responsive grid layouts
- Optimized images and assets
- Smooth animations on all devices

## 🎯 Admin Usage

### Default Credentials
- Username: `admin`
- Password: `admin123`

### Adding Content
1. Login with admin credentials
2. Click admin menu → "Add Content"
3. Fill the form with movie/series details
4. Submit to add to catalog

### Managing Content
- View all content in the main catalog
- Edit existing content through detail pages (admin only)
- Delete content with confirmation prompts

## 🔧 Development Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
npm start           # Start production server
npm run dev         # Start development server with nodemon
npm run seed        # Seed database with sample data
```

## 🚀 Quick Start Commands

```powershell
# 1. Install all dependencies
npm install
cd backend && npm install && cd ..

# 2. Start MongoDB (if using local)
# Make sure MongoDB is running

# 3. Seed database
cd backend && npm run seed && cd ..

# 4. Start backend (Terminal 1)
cd backend && npm run dev

# 5. Start frontend (Terminal 2)
npm run dev
```

Then visit:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/health

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.
