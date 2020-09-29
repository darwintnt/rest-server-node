const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const { verifyTokenImg } = require('../middlewares/auth');


app.get('/images/:type/:img', verifyTokenImg, (req, res) => {

  let type = req.params.type;
  let img = req.params.img;

  let imageUrl = path.resolve(__dirname, `../../uploads/${type}/${img}`);

  if (fs.existsSync(imageUrl)) {
    res.sendFile(imageUrl);
  } else {
    res.sendFile(path.resolve(__dirname, '../assets/img/no-image.jpg'));
  }

});


module.exports = app;