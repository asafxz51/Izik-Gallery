const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utils/catchAsync')
const { storeReturnTo } = require('../middleware');
const User = require('../models/user')

router.get('/register', (req, res) => {
 res.render('users/register')
})

router.post('/register', catchAsync(async (req, res) => {
 try {
  const { email, username, password } = req.body
  const user = new User({ email, username })
  const registeredUser = await User.register(user, password)
  req.login(registeredUser, err => {
   if (err) return next(err)
   req.flash('success', 'Welcome!')
   res.redirect('/gallery')
  })
 } catch (e) {
  req.flash('error', e.message)
  res.redirect('/register')
 }
}))

router.get('/login', (req, res) => {
 res.render('users/login')
})

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
 req.flash('success', 'Successfully logged in!')
 const redirect = res.locals.returnTo || '/gallery'
 console.log(req.user)
 res.redirect(redirect)
})

router.get('/logout', (req, res, next) => {
 req.logout(function (err) {
  if (err) {
   return next(err);
  }
  req.flash('success', 'Logged Out.');
  res.redirect('/gallery');
 });
});



module.exports = router