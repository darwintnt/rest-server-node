// Port
process.env.PORT = process.env.PORT || 3000;

// Enviroments
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Database
let urlDB;

if (process.env.NODE_ENV === 'dev') {
  urlDB = process.env.DB_HOST;
} else {
  urlDB = process.env.DB_HOST;
}

process.env.DB_HOST = urlDB;

// Auth
process.env.SEED = process.env.SEED || 'secret';
process.env.EXPIRE_TOKEN = 60 * 60 * 24 * 30;

