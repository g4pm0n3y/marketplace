// modules
const express         = require('express'),
      mongoose        = require('mongoose'),
      ejs             = require('ejs'),
      bodyParser      = require('body-parser'),
      methodOverride  = require('method-override');

// database setup
mongoose.connect('mongodb://localhost:27017/marketplace', {useNewUrlParser: true});

// app setup
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(methodOverride('_method'));

// import routes
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/users');

// use routes
app.use(shopRoutes);
app.use('/admin', adminRoutes);
app.use(userRoutes);

// server setup 
app.listen(3000, () => {
  console.log('server started');
})