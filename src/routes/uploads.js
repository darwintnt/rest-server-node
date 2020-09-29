const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

// Model
const User = require('../models/User');
const Product = require('../models/Product');

// default options
app.use(fileUpload());

app.put('/upload/:type/:id', function (req, res) {

  let type = req.params.type.toLowerCase();
  let id = req.params.id;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      status: false,
      message: 'No files were uploaded.'
    });
  }

  // Validate Type
  let validTypes = ['products', 'users'];

  if (validTypes.indexOf(type) < 0) {
    return res.status(400).json({
      status: false,
      type: type,
      message: `El tipo suministrado no es válido, los tipos permitidos son ${validTypes.join(', ')}`
    });
  }

  let file = req.files.file;
  let fileName = file.name.split('.');
  let extension = fileName[fileName.length - 1];
  let extensions = ['png', 'jpg', 'gif', 'jpeg'];

  if (extensions.indexOf(extension) < 0) {
    return res.status(400).json({
      status: false,
      extension: extension,
      message: `La extensión suministrada no es válida, solo puede adjuntar archivos en formato ${extensions.join(', ')}`
    });
  }

  // Rename file
  let newFileName = `${id}-${new Date().getMilliseconds()}.${extension}`;

  file.mv(`uploads/${type}/${newFileName}`, function (err) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: err
      });
    }

    switch (type) {
      case 'users':
        imageUser(id, res, newFileName);
        break;
      case 'products':
        imageProduct(id, res, newFileName);
        break;
      default: break;
    }

  });

});


function imageUser(id, res, newFileName) {

  User.findById(id, (err, instance) => {

    if (err) {
      deleteFile(newFileName, 'users');
      return res.status(500).json({
        status: false,
        message: err
      });
    }

    if (!instance) {
      deleteFile(newFileName, 'users');
      return res.status(400).json({
        status: false,
        message: 'User not found'
      });
    }

    deleteFile(instance.img, 'users');

    instance.img = newFileName;

    instance.save((_err, instanceDB) => {
      return res.json({
        status: true,
        data: instanceDB,
        message: 'User save'
      });
    });

  });

}


function imageProduct(id, res, newFileName) {

  Product.findById(id, (err, instance) => {

    if (err) {
      deleteFile(newFileName, 'products');
      return res.status(500).json({
        status: false,
        message: err
      });
    }

    if (!instance) {
      deleteFile(newFileName, 'products');
      return res.status(400).json({
        status: false,
        message: 'Product not found'
      });
    }

    deleteFile(instance.img, 'products');

    instance.img = newFileName;

    instance.save((_err, instanceDB) => {
      return res.json({
        status: true,
        data: instanceDB,
        message: 'Product save'
      });
    });

  });

}

function deleteFile(imageName, type) {
  let imageUrl = path.resolve(__dirname, `../../uploads/${type}/${imageName}`);

  if (fs.existsSync(imageUrl)) {
    fs.unlinkSync(imageUrl);
  }
}

module.exports = app;