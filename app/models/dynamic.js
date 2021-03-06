const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Dynamic = new Schema({
  userId: { type: Schema.Types.ObjectId, ref:'User' },
  imgs: [{ type: String }],
  content: { type: String }
}, {
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
  versionKey: false
})
module.exports = mongoose.model('Dynamic', Dynamic, 'dynamic');