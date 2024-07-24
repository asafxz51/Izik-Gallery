if (process.env.NODE_ENV !== "production") {
 require('dotenv').config()
}

const express = require('express')
const app = express()
const path = require('path')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const session = require('express-session')
const mongoose = require('mongoose')
const methodOvrride = require('method-override')
const passport = require('passport')
const flash = require('connect-flash')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const imagesRoutes = require('./routes/image')
const userRoutes = require('./routes/users')
const contactRoutes = require('./routes/contact')
const commentRoutes = require('./routes/comment')

// database
mongoose.connect('mongodb://0.0.0.0:27017/izik')
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error.'))
db.once('open', () => {
 console.log('Database Connected!')
})

// some middlewares
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(methodOvrride('_method'))
const sessionConfig = {
 secret: 'thisisasecret',
 resave: false,
 saveUninitialized: true,
 cookie: {
  httpOnly: true,
  expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
  maxAge: 1000 * 60 * 60 * 24 * 7
 }
}

app.use(session(sessionConfig))


// paspport
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// flash and currentUser
app.use(flash())
app.use((req, res, next) => {
 res.locals.currentUser = req.user
 res.locals.success = req.flash('success')
 res.locals.error = req.flash('error')
 next()
})


// routes
app.use('/gallery', imagesRoutes)
app.use('/contact', contactRoutes)
app.use('/', userRoutes)
app.use('/gallery/:id/comments', commentRoutes)

app.get('/', (req, res) => {
 res.render('home')
})

app.get('/aboutme', (req, res) => {
 res.render('aboutme')
})



// error handlers
app.all('*', (req, res, next) => {
 next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
 const { statusCode = 500 } = err
 if (!err.message) err.message = 'Something went wrong...'
 res.status(statusCode).render('error', { err })
})


app.listen(3000, () => {
 console.log('Listening at 3000')
})