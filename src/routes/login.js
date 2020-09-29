const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Google 
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

app.post('/google', async (req, res) => {

  let idToken = req.body.idtoken;

  let googleUser;

  try {
    googleUser = await verify(idToken);
  } catch (e) {
    return res.status(403).json({
      status: false,
      message: 'El token es invalido'
    });
  }

  User.findOne({ email: googleUser.email }, (err, user) => {

    if (err) {
      return res.status(500).json({
        status: false,
        message: err
      });
    }

    if (user) {
      if (user.google === false) {
        return res.status(400).json({
          status: false,
          message: {
            error: 'Por favor usar su autenticación normal'
          }
        });
      } else {

        let token = jwt.sign({
          user: user
        }, process.env.SEED, { expiresIn: process.env.EXPIRE_TOKEN });

        res.json({
          status: true,
          user: user,
          token: token
        });
      }
    } else {
      // Si el usuario no existe en la BD.
      let newUser = new User({
        name: googleUser.name,
        email: googleUser.email,
        img: googleUser.img,
        google: googleUser.google,
        password: ':)'
      });

      newUser.save((error, instance) => {

        if (err) {
          return res.status(400).json({
            status: false,
            message: error
          });
        }

        let token = jwt.sign({
          user: instance
        }, process.env.SEED, { expiresIn: process.env.EXPIRE_TOKEN });

        res.json({
          status: false,
          user: instance,
          token: token
        });

      });
    }

  });

});

// Google functions
const verify = async (token) => {

  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID
  });

  const payload = ticket.getPayload();

  return {
    name: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  };
};


module.exports = app;