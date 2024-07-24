const { imageSchema } = require('./schemas.js')
const ExpressError = require('./utils/ExpressError')
const Image = require('./models/image')

module.exports.isLoggedIn = (req, res, next) => {
 if (!req.isAuthenticated()) {
  req.session.returnTo = req.originalUrl
  req.flash('error', 'You must be signed in.')
  return res.redirect('back')
 }
 next()
}

module.exports.storeReturnTo = (req, res, next) => {
 if (req.session.returnTo) {
  res.locals.returnTo = req.session.returnTo;
 }
 next();
}

module.exports.validateImage = (req, res, next) => {
 const { error } = imageSchema.validate(req.body)
 if (error) {
  const msg = error.details.map(el => el.message).join(',')
  throw new ExpressError(msg, 400)
 } else {
  next()
 }
}

module.exports.isAuthor = async (req, res, next) => {
 const { id } = req.params
 const image = await Image.findById(id)
 if (!image.author.equals(req.user._id)) {
  req.flash('error', 'You do not have premission to do that.')
  return res.redirect(`/gallery/${id}`)
 }
 next()
}

module.exports.isAdmin = (req, res, next) => {
 if (req.user.isAdmin !== true) {
  req.flash('error', 'You do not have premission to do that.')
  return res.redirect('/gallery')
 }
 next()
}