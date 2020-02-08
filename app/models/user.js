const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({
  username: { type: String },
  password: { type: String },
  avatar: { type: String, default: 'http://dwz.date/kgb' },
  state: { type: Number },
  age: { type: Number, default: 18 },
  sex: { type: Number, default: 1 },
  tel: { type: Number }
}, {
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
  versionKey: false
})
module.exports = mongoose.model('User', UserSchema, 'user');