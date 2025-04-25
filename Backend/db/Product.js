
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
 company: { type: String, required: true },
  description: { type: String },
  // Add other fields as needed
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product; // For CommonJS
// export default Product; // For ES Modules
