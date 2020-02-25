const mongoose = require('mongoose')
const Schema = mongoose.Schema
const FriendSchema = new Schema({
  myId: { type: Schema.Types.ObjectId },
  youId: { type: Schema.Types.ObjectId },
  success: { type: Number },
  see: { type: Number },
  created: { type: Date, require: false },
  updated: { type: Date, require: false }
}, {
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
  versionKey: false
})
module.exports = mongoose.model('Friend', FriendSchema, 'friend');