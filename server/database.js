const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'movies.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
const initDatabase = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Users table
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Movies table
      db.run(`
        CREATE TABLE IF NOT EXISTS movies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          director TEXT,
          year INTEGER,
          genre TEXT,
          description TEXT,
          poster_url TEXT,
          imdb_rating REAL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Reviews table
      db.run(`
        CREATE TABLE IF NOT EXISTS reviews (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          movie_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
          review_text TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
          UNIQUE(movie_id, user_id)
        )
      `);

      // Check if movies already exist before inserting
      db.get('SELECT COUNT(*) as count FROM movies', (err, row) => {
        if (err) {
          console.error('Error checking movies count:', err);
          reject(err);
          return;
        }

        if (row.count === 0) {
          // Only insert movies if the table is empty
          console.log('No movies found, inserting sample data...');
          
          const movies = [
            ['Forrest Gump - Part 1', 'Robert Zemeckis', 1994, 'Drama', 'Part 1: The early life of Forrest Gump, from his childhood in Alabama to his college football career and military service.', 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', 8.8],
            ['Forrest Gump - Part 2', 'Robert Zemeckis', 1994, 'Drama', 'Part 2: Forrest serves in Vietnam, becomes a ping-pong champion, and starts a shrimp business while pursuing his childhood sweetheart.', 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', 8.8],
            ['Forrest Gump - Part 3', 'Robert Zemeckis', 1994, 'Drama', 'Part 3: The final chapter where Forrest becomes a father, reunites with Jenny, and reflects on his extraordinary life journey.', 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 8.8],
            
            ['Pulp Fiction - Part 1', 'Quentin Tarantino', 1994, 'Crime', 'Part 1: The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.', 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', 8.9],
            ['Pulp Fiction - Part 2', 'Quentin Tarantino', 1994, 'Crime', 'Part 2: Vincent and Jules continue their hit job, while Butch the boxer faces a dangerous situation with Marsellus Wallace.', 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', 8.9],
            ['Pulp Fiction - Part 3', 'Quentin Tarantino', 1994, 'Crime', 'Part 3: The final chapter where all storylines converge in a diner, leading to an unexpected and violent conclusion.', 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', 8.9],
            
            ['The Dark Knight - Part 1', 'Christopher Nolan', 2008, 'Action', 'Part 1: Batman, Lieutenant Gordon and District Attorney Harvey Dent successfully begin to round up the criminals that plague Gotham City.', 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 9.0],
            ['The Dark Knight - Part 2', 'Christopher Nolan', 2008, 'Action', 'Part 2: The Joker wreaks havoc and chaos on the people of Gotham, forcing Batman to accept one of the greatest psychological tests.', 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', 9.0],
            ['The Dark Knight - Part 3', 'Christopher Nolan', 2008, 'Action', 'Part 3: The final confrontation between Batman and the Joker, where the fate of Gotham City hangs in the balance.', 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', 9.0],
            
            ['The Godfather - Part 1', 'Francis Ford Coppola', 1972, 'Crime', 'Part 1: The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.', 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', 9.2],
            ['The Godfather - Part 2', 'Francis Ford Coppola', 1974, 'Crime', 'Part 2: The early life and career of Vito Corleone in 1920s New York is portrayed, while his son Michael expands the family business.', 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 9.0],
            ['The Godfather - Part 3', 'Francis Ford Coppola', 1990, 'Crime', 'Part 3: In the final installment, an aging Don Michael Corleone seeks to legitimize his crime family and find a suitable successor.', 'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg', 7.6]
          ];

          let completed = 0;
          movies.forEach((movie, index) => {
            db.run(
              'INSERT INTO movies (title, director, year, genre, description, poster_url, imdb_rating) VALUES (?, ?, ?, ?, ?, ?, ?)',
              movie,
              function(err) {
                if (err) {
                  console.error(`Error inserting movie ${index + 1}:`, err);
                } else {
                  console.log(`${index + 1}. Inserted: ${movie[0]}`);
                }
                completed++;
                if (completed === movies.length) {
                  console.log(`✅ Successfully inserted ${movies.length} movies!`);
                  resolve();
                }
              }
            );
          });
        } else {
          console.log(`Database already has ${row.count} movies, skipping insertion.`);
          resolve();
        }
      });
    });
  });
};

module.exports = { db, initDatabase };
