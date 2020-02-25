const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String, select: false },
  avatar: { type: String, default: 'http://dwz.date/kgb' },
  state: { type: Number },
  sex: { type: Number, default: 1 },
  introduction: { type: String },  // 简介
  birthday: { type: Date, default: '2000-1-1' },
  created: { type: Date, select: false },
  updated: { type: Date, select: false }
}, {
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
  versionKey: false
})
module.exports = mongoose.model('User', UserSchema, 'user');