const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Code = new Schema({
  code: { type: String, require: true },
  date: { type: String, require: true },
  email: { type: String, require: true }
}, {
  versionKey: false
})
module.exports = mongoose.model('Code', Code, 'code');