const mongoose = require('mongoose');
const { Schema } = mongoose;


const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'El nombre es necesario']
  },
  description: {
    type: String,
    required: false
  },
  cost_unit: {
    type: Number,
    required: [true, 'El costo unitario es obligatorio']
  },
  available: {
    type: Boolean,
    default: true,
    required: [true, 'La disponibilidad es obligatorio']
  },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'El ID de categoria es obligatorio']
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'El ID de usuario es obligatorio']
  },
  img: {
    type: String,
    required: false
  },
  status: {
    type: Boolean,
    default: true
  }
});


module.exports = mongoose.model('Product', productSchema);