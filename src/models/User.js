const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose;


let roles = {
  values: ['ADMIN_ROLE', 'USER_ROLE'],
  message: '{VALUE} no es un role válido'
};


const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es necesario']
  },
  email: {
    type: String,
    unique: [true, 'El email ya existe en el sistema'],
    required: [true, 'El email es necesario']
  },
  password: {
    type: String,
    required: true
  },
  img: {
    type: String,
    required: false
  },
  role: {
    default: 'USER_ROLE',
    enum: roles,
    type: String
  },
  google: {
    type: Boolean,
    default: false
  },
  status: {
    type: Boolean,
    default: true
  }
});

userSchema.methods.toJSON = function() {
  let user = this;
  let userObj = user.toObject();
  delete userObj.password;

  return userObj;
};

userSchema.plugin(uniqueValidator, { message: '{PATH} ya se encuentra registrado en el sistema'});

module.exports = mongoose.model('User', userSchema);