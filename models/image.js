const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ImageSchema = new Schema({
 url: {
  url: String,
  filename: String,
  public_id: String
 },
 description: String,
 date: String
})

module.exports = mongoose.model('Image', ImageSchema)