const mongoose = require('mongoose');
const { Schema } = mongoose;



const categorySchema = new Schema({
  description: {
    type: String,
    unique: true,
    required: [true, 'La categoria es obligatoria']
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: Boolean,
    default: true
  }
});


module.exports = mongoose.model('Category', categorySchema);