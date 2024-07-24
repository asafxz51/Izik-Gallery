const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Contact = require('../models/contact')
const { isLoggedIn } = require('../middleware.js')


router.get('/', async (req, res) => {
 const messages = await Contact.find({}).populate('user').sort({ createdAt: -1})
 res.render('contact', { messages })
})

router.post('/', isLoggedIn, catchAsync(async (req, res) => {
 const contact = new Contact({
  message: req.body.contact.message
 })
 contact.user = req.user._id
 await contact.save()
 req.flash('success', 'Successfully sent a message.')
 res.redirect('/contact')
}))


module.exports = router