const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
 url: {
  url: String,
  filename: String,
  public_id: String
 },
 description: String,
 date: String,
 author: {
  type: Schema.Types.ObjectId,
  ref: 'User'
 },
 comments: [{
  type: Schema.Types.ObjectId,
  ref: 'Comment'
 }]
})

module.exports = mongoose.model('Image', ImageSchema)