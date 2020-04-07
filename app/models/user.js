const mongoose = require('mongoose')
const Schema = mongoose.Schema
const User = new Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String, select: false },
  avatar: { type: String, default: 'http://dwz.date/kgb' },
  state: { type: Number, default: 0 },
  sex: { type: Number, default: 1 },
  introduction: { type: String },  // 简介
  birthday: { type: Date, default: '2000-1-1' },
  following: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }], select: false },
  created: { type: Date, select: false },
  updated: { type: Date, select: false }
}, {
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
  versionKey: false
})
module.exports = mongoose.model('User', User, 'user');