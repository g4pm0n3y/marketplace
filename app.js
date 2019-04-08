// modules
const express         = require('express'),
      mongoose        = require('mongoose'),
      ejs             = require('ejs'),
      session         = require('express-session'),
      bodyParser      = require('body-parser'),
      multer          = require('multer')
      MongoDBStore    = require('connect-mongodb-session')(session);
      methodOverride  = require('method-override'),
      flash           = require('connect-flash'),
      csrf            = require('csurf');

// database setup
const mongoURI = 'mongodb://localhost:27017/marketplace';
mongoose.connect(mongoURI, {useNewUrlParser: true});

// file storage
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname)
  }
});

// filter invalid image types
const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
    cb(null, true);
  } else {
    cb(null, false)
  }
}

// app setup
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/images', express.static('images'));
app.use(bodyParser.urlencoded({ extended: false}));
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use(methodOverride('_method'));


// session setup
const store = new MongoDBStore({
  uri: mongoURI,
  collection: 'sessions'
});

const csrfSecurity = csrf();
app.use(session({
  secret: 'the leafs will win the cup', 
  resave: false, 
  saveUninitialized: false,
  store: store
}));
app.use(csrfSecurity);
app.use(flash())

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});


// import routes
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');
const errorRoutes = require('./routes/errors');

// use routes
app.use(shopRoutes);
app.use('/admin', adminRoutes);
app.use(userRoutes);
app.use(errorRoutes)

// error middleware
app.use((error, req, res, next) => {
  res.redirect('/500');
})

// server setup 
app.listen(3000, () => {
  console.log('server started');
})