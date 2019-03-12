// modules
const express     = require('express'),
      mongoose    = require('mongoose'),
      ejs         = require('ejs'),
      bodyParser  = require('body-parser');

// database setup
mongoose.connect('mongodb://localhost:27017/marketplace', {useNewUrlParser: true});

// app setup
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false}));

// import routes
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');

// use routes
app.use(shopRoutes);
app.use('/admin', adminRoutes);

// server setup 
app.listen(3000, () => {
  console.log('server started');
})