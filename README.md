# Movie-review-platform
# Movie Review Platform

A full-stack web application for browsing, rating, and reviewing movies. Built with React frontend and Node.js backend using Express and SQL.

## Features

### 🎬 Movie Management
- Browse movies with search functionality
- Filter by genre, year, and rating
- Sort by title, year, rating, or date added
- Detailed movie pages with descriptions and ratings

### ⭐ Review System
- Rate movies from 1-5 stars
- Write detailed text reviews
- View all reviews for each movie
- Edit or delete your own reviews

### 👤 User Authentication
- User registration and login
- Secure password hashing
- JWT-based authentication
- User profile pages

### 📱 Responsive Design
- Mobile-first responsive design
- Modern, clean UI with smooth animations
- Accessible and user-friendly interface

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQL** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Styled Components** - CSS-in-JS styling
- **React Icons** - Icon library

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd movie-review-platform
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install all dependencies (root, server, and client)
   npm run install-all
   ```

3. **Environment Variables**
   Create a `.env` file in the `server/` directory (optional, defaults provided):
   ```env
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Database Setup**
   The application uses SQL database that is automatically created and initialized when the server starts.

   - Database file: `server/movies.db`
   - Tables created automatically: `users`, `movies`, `reviews`
   - Sample movie data is pre-loaded on first run

   **Database Schema:**
   - **users**: id, username (unique), email (unique), password (hashed), created_at
   - **movies**: id, title, director, year, genre, description, poster_url, imdb_rating, created_at
   - **reviews**: id, movie_id (FK), user_id (FK), rating (1-5), review_text, created_at
     - Unique constraint: one review per user per movie

5. **Start the development servers**
   ```bash
   # Start both frontend and backend
   npm run dev

   # Or start them separately:
   # Backend only
   npm run server

   # Frontend only
   npm run client
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Movies
- `GET /api/movies` - Get all movies (with search/filter options)
- `GET /api/movies/:id` - Get movie by ID
- `GET /api/movies/genres/list` - Get all genres
- `GET /api/movies/years/list` - Get all years

### Reviews
- `GET /api/reviews/movie/:movieId` - Get reviews for a movie
- `GET /api/reviews/user/:userId` - Get reviews by a user
- `POST /api/reviews` - Create/update review (protected)
- `DELETE /api/reviews/:movieId` - Delete review (protected)
- `GET /api/reviews/user/:userId/movie/:movieId` - Get user's review for a movie

## Acknowledgments

- Movie data and posters are for demonstration purposes
- Icons provided by React Icons
- UI inspiration from modern movie platforms
