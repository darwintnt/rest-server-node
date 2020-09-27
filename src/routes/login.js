const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Model
const User = require('../models/users');

app.post('/login', (req, res) => {

  let body = req.body;

  User.findOne({ email: body.email }, (err, instance) => {
    if (err) {
      return res.status(500).json({
        status: false,
        message: err
      });
    }

    if (!instance) {
      return res.status(400).json({
        status: false,
        message: {
          error: 'El (usuario) o contraseña no es válido'
        }
      });
    }

    if (!bcrypt.compareSync(body.password, instance.password)) {
      return res.status(400).json({
        status: false,
        message: {
          error: 'El usuario o (contraseña) no es válido'
        }
      });
    }

    let token = jwt.sign({
      user: instance
    }, process.env.SEED, { expiresIn: process.env.EXPIRE_TOKEN });

    res.json({
      status: true,
      message: instance,
      token: token
    });

  });

});

module.exports = app;