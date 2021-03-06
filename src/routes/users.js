const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

// Model
const User = require('../models/User');
const { tokenVerify, verifyAdminRole } = require('../middlewares/auth');


// Routes
app.get('/users', tokenVerify, function (req, res) {

  let from = req.query.from || 0;
  let to = req.query.to || 10;

  User.find({ status: true })
    .skip(Number(from))
    .limit(Number(to))
    .exec((err, users) => {

      if (err) {
        return res.status(400).json({
          status: false,
          message: err
        });
      }

      User.countDocuments({ status: true }, (err, count) => {
        res.json({
          status: true,
          total: count,
          message: users
        });
      });

    });

});

app.post('/users', [tokenVerify, verifyAdminRole], function (req, res) {

  let body = req.body;

  let user = new User(body);

  user.password = bcrypt.hashSync(body.password, 10);

  user.save((err, userDB) => {

    if (err) {
      return res.status(500).json({
        status: false,
        message: err
      });
    }

    if (!userDB) {
      return res.status(400).json({
        status: false,
        message: err
      });
    }

    res.status(201).json({
      status: true,
      message: user
    });

  });

});

app.put('/users/:id', [tokenVerify, verifyAdminRole], function (req, res) {
  let id = req.params.id;
  let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status']);

  User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, instance) => {

    if (err) {
      return res.status(500).json({
        status: false,
        message: err
      });
    }

    if (!instance) {
      return res.status(400).json({
        status: false,
        message: err
      });
    }

    res.json({
      status: true,
      message: instance
    });

  });

});

app.delete('/users/:id', [tokenVerify, verifyAdminRole], function (req, res) {

  let id = req.params.id;

  let changeStatus = {
    status: false
  };

  // Borrado Lógico
  User.findByIdAndUpdate(id, changeStatus, { new: false }, (err, instance) => {

    if (err) {
      return res.status(400).json({
        status: false,
        message: {
          error: err
        }
      });
    }

    if (instance.status === false) {
      return res.status(400).json({
        status: false,
        message: 'User not found'
      });
    }

    res.json({
      status: true,
      message: 'User delete',
    });

  });


  // Borrado Fisico
  // User.findByIdAndRemove(id, (err, instance) => {

  //   if (err) {
  //     return res.status(400).json({
  //       status: false,
  //       message: {
  //         error: err
  //       }
  //     });
  //   }

  //   if (instance === null) {
  //     return res.status(400).json({
  //       status: false,
  //       message: 'User not found'
  //     });
  //   }

  //   res.json({
  //     status: true,
  //     message: instance
  //   });

  // });

});


module.exports = app;