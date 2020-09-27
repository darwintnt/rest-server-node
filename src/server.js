require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Routes
app.get('/users', function (req, res) {
  res.json('get users');
});

app.post('/users', function (req, res) {
  let body = req.body;
  res.json({
    user: body
  });
});

app.put('/users/:id', function (req, res) {
  let id = req.params.id;
  res.json(`put users ${id}`);
});

app.delete('/users/:id', function (req, res) {
  let id = req.params.id;
  res.json(`delete users ${id}`);
});

app.listen(process.env.PORT, () => {
  console.log(`Escuchando en el puerto ${process.env.PORT}`);
});