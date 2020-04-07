const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Comment = new Schema({
  id: { type: Schema.Types.ObjectId },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String }
}, {
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
  versionKey: false
})
module.exports = mongoose.model('Comment', Comment, 'comment');