// Port
process.env.PORT = process.env.PORT || 3000;

// Enviroments
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// Database
let urlDB;

if (process.env.NODE_ENV === 'dev') {
  urlDB = 'mongodb+srv://node_user:koCdjlm8dEeTi5FX@testing.uuqkz.mongodb.net/db_rest_node?retryWrites=true&w=majority';
} else {
  urlDB = process.env.MONGO_URI;
}

process.env.urlDB = urlDB;

// Auth
process.env.SEED = process.env.SEED || 'secret';
process.env.EXPIRE_TOKEN = 60 * 60 * 24 * 30;

