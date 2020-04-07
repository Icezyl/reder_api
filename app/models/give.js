const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Give = new Schema({
  id: { type: Schema.Types.ObjectId },
  userId: { type: Schema.Types.ObjectId },
  giveType: { type: Number, enum: [0, 1], default: 0 },
  give: { type: Number, enum: [0, 1], default: 1 }
}, {
  timestamps: { createdAt: 'created', updatedAt: 'updated' },
  versionKey: false
})
module.exports = mongoose.model('Give', Give, 'give');