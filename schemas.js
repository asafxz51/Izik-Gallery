const Joi = require('joi')


module.exports.imageSchema = Joi.object({
 image: Joi.object({
  // url: Joi.any().required(),
  description: Joi.string().required(),
  date: Joi.string().required()
 }).required()
})