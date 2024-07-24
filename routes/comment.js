const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsync = require('../utils/catchAsync')
const Comment = require('../models/comments')
const Image = require('../models/image')
const { isLoggedIn } = require('../middleware.js')
const { commentSchema } = require('../schemas.js')
const ExpressError = require('../utils/ExpressError.js')

const validateComment = (req, res, next) => {
 const { error } = commentSchema.validate(req.body)
 if (error) {
  const msg = error.details.map(el => el.message).join(',')
  throw new ExpressError(msg, 400)
 } else {
  next()
 }
}


router.post('/', isLoggedIn, catchAsync(async (req, res) => {
 const image = await Image.findById(req.params.id)
 const comment = new Comment(req.body.comment)
 image.comments.push(comment)
 comment.user = req.user._id
 await comment.save()
 await image.save()
 res.redirect(`/gallery/${image._id}`)
}))

router.delete('/:commentId', catchAsync(async(req, res) => {
 const {id, commentId} = req.params
 await Image.findByIdAndUpdate(id, {$pull: {comments: commentId}})
 await Comment.findByIdAndDelete(commentId)
 req.flash('success', 'Comment deleted successfully.')
 res.redirect(`/gallery/${id}`)
}))



module.exports = router