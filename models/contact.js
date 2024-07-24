const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ContactSchema = new Schema({
 user: {
  type: Schema.Types.ObjectId,
  ref: 'User'
 },
 message: String,
 createdAt: {
  type: Date,
  default: Date.now
 }
})

module.exports = mongoose.model('Contact', ContactSchema)