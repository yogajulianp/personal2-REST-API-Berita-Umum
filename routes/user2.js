var express = require("express");
var router = express.Router();

const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;

var bcrypt = require("bcryptjs");
const auth = require("../auth");


//addUser
router.get("/register", function (req, res, next) {
  res.render("registerForm", { title: "Register" });
});

//add User
router.post("/register", function (req, res, next) {
  var hashpass = bcrypt.hashSync(req.body.password, 10);
  var users = {
    name: req.body.name,
    email: req.body.email,
    username: req.body.username,
    password: hashpass,
  };
  User.create(users)
    .then((addData) => {
      res.redirect("/users/login");
    })
    .catch((err) => {
      res.redirect("/users/register");
    });
});

//login
router.get("/login", function (req, res, next) {
  res.render("loginForm", { title: "Register" });
});
router.post("/login", function (req, res, next) {
  User.findOne({ where: { username: req.body.username } })
    .then((data) => {
      console.log(loginValid);
      if (data) {
        var loginValid = bcrypt.compareSync(req.body.password, data.password);
        console.log(loginValid);
        if (loginValid) {
          // simpan session
          //console.log("req.session" + req.session)
          req.session.username = req.body.username;
          req.session.islogin = true;
          //console.log("req.session setelah diisi data:" + req.session)

          res.redirect("/");
        } else {
          res.redirect("/users/login");
        }
      } else {
        res.redirect("/users/login");
      }
    })
    .catch((err) => {
      res.redirect("/users/login");
    });
});

router.get("/belumLogin", function (req, res, next) {
  res.render("alertNoLogin", { title: "Belum Login" });
});

router.get("/logout", function (req, res, next) {
  req.session.destroy();
  res.redirect("/users/login");
});

module.exports = router;
