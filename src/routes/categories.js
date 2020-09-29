const express = require('express');
const app = express();

// Model
const Category = require('../models/Category');
const { tokenVerify, verifyAdminRole } = require('../middlewares/auth');


app.get('/categories', tokenVerify, function (req, res) {

  let from = req.query.from || 0;
  let to = req.query.to || 10;

  Category.find({ status: true })
    .sort('description')
    .populate('user_id', 'name email')
    .skip(Number(from))
    .limit(Number(to))
    .exec((err, categories) => {

      if (err) {
        return res.status(500).json({
          status: false,
          message: err
        });
      }

      Category.countDocuments({ status: true }, (err, count) => {
        res.json({
          status: true,
          total: count,
          message: categories
        });
      });

    });

});

app.post('/categories', [tokenVerify, verifyAdminRole], function (req, res) {

  let body = req.body;

  let category = new Category({
    description: body.description
  });

  category.user_id = req.user._id;

  category.save((err, categoryDB) => {

    if (err) {
      return res.status(500).json({
        status: false,
        message: err
      });
    }

    if (!categoryDB) {
      return res.status(400).json({
        status: false,
        message: err
      });
    }

    res.status(201).json({
      status: true,
      message: categoryDB
    });

  });

});

app.put('/categories/:id', [tokenVerify, verifyAdminRole], function (req, res) {

  let id = req.params.id;
  let body = req.body;

  let category = {
    description: body.description
  };

  Category.findByIdAndUpdate(id, category, { new: true, runValidators: true }, (err, instance) => {

    if (err) {
      return res.status(500).json({
        status: false,
        message: err
      });
    }

    if (!instance) {
      return res.status(400).json({
        status: false,
        message: 'Categoria no encontrada'
      });
    }

    res.json({
      status: true,
      message: instance
    });

  });

});

app.delete('/categories/:id', [tokenVerify, verifyAdminRole], function (req, res) {

  let id = req.params.id;

  let changeStatus = {
    status: false
  };

  // Borrado Lógico
  Category.findByIdAndUpdate(id, changeStatus, { new: false }, (err, instance) => {

    if (err) {
      return res.status(500).json({
        status: false,
        message: {
          error: err
        }
      });
    }

    if (instance.status === false) {
      return res.status(400).json({
        status: false,
        message: 'Category not found'
      });
    }

    res.json({
      status: true,
      message: 'Category delete',
    });

  });

});


module.exports = app;