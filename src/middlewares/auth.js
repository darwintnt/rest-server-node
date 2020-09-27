const jwt = require('jsonwebtoken');


// Token verify
let tokenVerify = (req, res, next) => {

  let token = req.get('Authorization');

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: false,
        message: err
      });
    }

    req.user = decoded.user;
    next();
  });

};


let verifyAdminRole = (req, res, next) => {

  let user = req.user;

  if (user.role === 'ADMIN_ROLE') {
    next();

  } else {
    return res.status(401).json({
      status: false,
      message: 'El usuario no esta autorizado para realizar esta acción'
    });

  }

};


module.exports = {
  tokenVerify,
  verifyAdminRole
};