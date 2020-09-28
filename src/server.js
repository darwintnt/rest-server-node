require('./config/config');


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Parse application/json
app.use(bodyParser.json());

// Globals routes
app.use(require('./routes/routes'));


mongoose.connect(process.env.DB_HOST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}, (err, res) => {

  if (err) {
    throw err;
  }

  console.log('Database Online...');
});

app.listen(process.env.PORT, () => {
  console.log(`Escuchando en el puerto ${process.env.PORT}`);
});