const mongoose = require('mongoose')
const Schema = mongoose.Schema
const MessageSchema = new Schema({
  sendId: { type: Schema.Types.ObjectId },
  text: { type: String },
  messageId: { type: Schema.Types.ObjectId },
  see: { type: Number, default: 1 }
}, {
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
  versionKey: false
})
module.exports = mongoose.model('Message', MessageSchema, 'message');