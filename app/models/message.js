const mongoose = require('mongoose')
const Schema = mongoose.Schema
const MessageSchema = new Schema({
  sendId: { type: Schema.Types.ObjectId },
  text: { type: String },
  receiveId: { type: Schema.Types.ObjectId },
  typeId: { type: Number, default: 1 },
  see: { type: Number, default: 1 }
}, {
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
  versionKey: false
})
module.exports = mongoose.model('Message', MessageSchema, 'message');