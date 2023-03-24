const path = require('path');
const express = require('express');
const adminRoute = require('./routes/adminRoutes');
const userRoute = require('./routes/userRoutes');
const session = require('express-session');
const nocache = require('nocache');
const config = require('./config/config');
require("dotenv").config()

const app = express();

config.mongooseconnection()
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs');
app.set('views', './views/users');



app.use(session({
  secret: config.sessionSecret,
  saveUninitialized: true,
  resave: false,
  cookie: {
    maxAge: 500000000
  }
}));
app.use(nocache());
app.use('/admin', adminRoute);
app.use('/', userRoute);


app.listen(3000, () => {
  console.log('listening on port 3000');
})