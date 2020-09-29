const express = require('express');
const app = express();

// Model
const Product = require('../models/Product');
const { tokenVerify, verifyAdminRole } = require('../middlewares/auth');


app.get('/products', tokenVerify, function (req, res) {

  let from = req.query.from || 0;
  let to = req.query.to || 10;

  Product.find({ status: true })
    .sort('name')
    .populate('category_id', 'description')
    .populate('user_id', 'name email')
    .skip(Number(from))
    .limit(Number(to))
    .exec((err, products) => {

      if (err) {
        return res.status(400).json({
          status: false,
          message: err
        });
      }

      Product.countDocuments({ status: true }, (err, count) => {
        res.json({
          status: true,
          total: count,
          message: products
        });
      });

    });

});

app.get('/products/search/:search', function(req, res) {

  let search = req.params.search;

  let regex = new RegExp(search, 'i');

  Product.find({ name: regex, status: true })
  .populate('category_id')
  .exec( (err, products) => {

    if (err) {
      return res.status(500).json({
        status: false,
        message: err
      });
    }

    return res.json({
      status: true,
      message: products
    });

  });

});

app.post('/products', [tokenVerify, verifyAdminRole], function (req, res) {

  let body = req.body;

  let product = new Product({
    user_id: req.user._id,
    name: body.name,
    description: body.description,
    cost_unit: body.cost_unit,
    available: body.available,
    category_id: body.category_id,
  });

  product.save((err, productDB) => {

    if (err) {
      return res.status(500).json({
        status: false,
        message: err
      });
    }

    if (!productDB) {
      return res.status(400).json({
        status: false,
        message: err
      });
    }

    res.status(201).json({
      status: true,
      message: productDB
    });

  });

});

app.put('/products/:id', [tokenVerify, verifyAdminRole], function (req, res) {

  let id = req.params.id;
  let body = req.body;

  let product = {
    name: body.name,
    description: body.description,
    cost_unit: body.cost_unit,
    available: body.available,
    category_id: body.category_id,
  };

  Product.findByIdAndUpdate(id, product, { new: true, runValidators: true }, (err, instance) => {

    if (err) {
      return res.status(500).json({
        status: false,
        message: err
      });
    }

    if (!instance) {
      return res.status(400).json({
        status: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      status: true,
      message: instance
    });

  });

});

app.delete('/products/:id', [tokenVerify, verifyAdminRole], function (req, res) {

  let id = req.params.id;

  let changeStatus = {
    status: false
  };

  // Borrado Lógico
  Product.findByIdAndUpdate(id, changeStatus, { new: false }, (err, instance) => {

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
        message: 'Product not found'
      });
    }

    res.json({
      status: true,
      message: 'Product delete',
    });

  });

});


module.exports = app;