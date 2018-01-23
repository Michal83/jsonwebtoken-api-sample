const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
  email: String,
  name: String,
  password: String,
  role: Number
}));