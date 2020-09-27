const express = require('express');
const app = express();

// Login
app.use(require('./login'));
// Users routes
app.use(require('./users'));

module.exports = app;