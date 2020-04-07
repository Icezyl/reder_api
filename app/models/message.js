const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Message = new Schema({
  messageId: { type: String },
  from: { type: Schema.Types.ObjectId },
  content: { type: String },
  to: { type: Schema.Types.ObjectId },
  typeId: { type: Number, default: 1 },
  img: { type: String },
  see: { type: Number, default: 1 }
}, {
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
  versionKey: false
})
module.exports = mongoose.model('Message', Message, 'message');