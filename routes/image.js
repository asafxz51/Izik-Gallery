const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')
const Image = require('../models/image')
const multer = require('multer')
const { storage, cloudinary } = require('../cloudinary')
const upload = multer({ storage })
const { imageSchema } = require('../schemas.js')



const validateImage = (req, res, next) => {
 const { error } = imageSchema.validate(req.body)
 if (error) {
  const msg = error.details.map(el => el.message).join(',')
  throw new ExpressError(msg, 400)
 } else {
  next()
 }
}


router.get('/', async (req, res) => {
 const images = await Image.find({})
 res.render('gallery/index', { images })
})

router.get('/new', (req, res) => {
 res.render('gallery/new')
})

router.post('/', upload.single('img'), validateImage, catchAsync(async (req, res) => {
 const result = await cloudinary.uploader.upload(req.file.path);
 const { secure_url, public_id } = result;
 const data = req.body.image;
 const dateString = data.date;
 const date = new Date(dateString);
 const day = date.getDate();
 const month = date.getMonth() + 1;
 const year = date.getFullYear();
 const formattedDate = `${day}/${month}/${year}`;
 const image = new Image({
  url: {
   url: secure_url,
   filename: req.file.filename,
   public_id: public_id
  },
  description: data.description,
  date: formattedDate
 });
 await image.save();
 req.flash('success', 'Successfully uploaded a new Image!')
 res.redirect(`/gallery/${image._id}`);
}));


router.get('/:id', catchAsync(async (req, res) => {
 const image = await Image.findById(req.params.id)
 if (!image) {
  req.flash('error', 'Cannot find that image')
  return res.redirect('/gallery')
 } else
  res.render('gallery/show', { image })
}))

router.get('/:id/edit', catchAsync(async (req, res) => {
 const image = await Image.findById(req.params.id)
 res.render('gallery/edit', { image })
}))

router.put('/:id', validateImage, catchAsync(async (req, res) => {
 const { id } = req.params
 const data = req.body.image;
 const dateString = data.date;
 const date = new Date(dateString);
 const day = date.getDate();
 const month = date.getMonth() + 1;
 const year = date.getFullYear();
 const formattedDate = `${day}/${month}/${year}`;
 const image = await Image.findByIdAndUpdate(id, { url: data.url, description: data.description, date: formattedDate })
 req.flash('success', 'Successfully updated the Image details!')
 res.redirect(`/gallery/${image._id}`)
}))

router.delete('/:id', catchAsync(async (req, res) => {
 const { id } = req.params;
 const image = await Image.findByIdAndDelete(id);
 if (image && image.url && image.url.public_id) {
  await cloudinary.uploader.destroy(image.url.public_id);
 }
 req.flash('success', 'Successfully deleted the Image.')
 res.redirect('/gallery');
}));

module.exports = router