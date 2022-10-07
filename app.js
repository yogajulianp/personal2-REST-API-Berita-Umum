const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const multer = require("multer");
const passport = require('passport');

const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname +  "-" + uniqueSuffix + "-" + file.originalname );
  },
});

const fileFilter = (req, file, cb) => {
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted

  // To accept the file pass `true`, like so:
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    // To reject this file pass `false`, like so:
    cb(null, false);
  }
};


const usersRouter = require("./routes/user");
const newsRouter = require("./routes/news");

const app = express();

// passport
app.use(passport.initialize());
require('./auth');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, 'images')));


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


module.exports = app;
