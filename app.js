var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require("./routes/index2");
var usersRouter = require("./routes/user2");
var newsRouter = require("./routes/news2");

var app = express();

// passport
app.use(passport.initialize());
require('./auth');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const db = require("./models");
db.sequelize
  .sync()
  .then(() => {
    console.log("sync db");
  })
  .catch((err) => {
    console.log("error: " + err.message);
  });


app.use("/", newsRouter);
app.use("/users", usersRouter);
app.use("/index", indexRouter);

module.exports = app;
