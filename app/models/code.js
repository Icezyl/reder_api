const mongoose = require('mongoose')
const Schema = mongoose.Schema
const CodeSchema = new Schema({
  code: { type: Number, require: true },
  date: { type: String, require: true },
  email: { type: String, require: true }
}, {
  versionKey: false
})
module.exports = mongoose.model('Code', CodeSchema,'code');