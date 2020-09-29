const express = require('express');
const app = express();

// Login
app.use(require('./login'));
// Users routes
app.use(require('./users'));
// Categories routes
app.use(require('./categories'));
// Products routes
app.use(require('./products'));
// Uploads routes
app.use(require('./uploads'));
// Uploads routes
app.use(require('./images'));

module.exports = app;