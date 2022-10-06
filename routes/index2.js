var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");

const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;


//addUser
router.get("/", function (req, res, next) {
  res.render("news", { pageTitle: "Berita Hari ini" });
});


module.exports = router;
