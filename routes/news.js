const express = require("express");
const router = express.Router();

const db = require("../models");
const News = db.news;
const Comments = db.comments;
const Op = db.Sequelize.Op;

const auth = require("../auth");
const jwt = require("jsonwebtoken");
//const fs = require('fs');
const config = require("../config");
const passport = require("passport");

//get all
router.get("/all", function (req, res, next) {
  News.findAll()
    .then((datanews) => {
      res.send(datanews);
    })
    .catch((err) => {
      res.json({
        info: "Error",
        message: err.message,
      });
    });
});

//create news
router.post("/addnews", passport.authenticate("jwt",{session:false}), function (req, res, next) {
  let news = {
    title: req.body.title,
    image: req.file,
    berita: req.body.berita,
  };
  if (!news.image) {
    return res
      .status(422)
      .send(
        "file yang dikirim harus disertai gambar, harus format png/jpeg/jpg"
      );
  }
  var image = news.image.path;
  var image2 = image.replace(/\\/g, "/");

  news = {
    title: req.body.title,
    image: image2,
    berita: req.body.berita,
  };
  News.create(news)
    .then((adddata) => {
      res.send(adddata);
    })
    .catch((err) => {
      res.json({
        info: "Error",
        message: err.message,
      });
    });
});

//get detail news by id
router.get("/detail/:id", async function (req, res, next) {
  const id = parseInt(req.params.id);
  const isiComments = await Comments.findAll({
    where: {
      idnews: id,
    },
  });

  await News.findByPk(id)
    .then((datadetail) => {
      if (datadetail) {
        res.send({
          news: datadetail,
          comments: isiComments,
        });
      } else {
        // http 404 not found
        res.status(404).send({
          message: "tidak adda ada id=" + id,
        });
      }
    })
    .catch((err) => {
      res.json({
        info: "Error",
        message: err.message,
      });
    });
});

//create comments
router.post("/detail/:id/addcomments", function (req, res, next) {
  const id = parseInt(req.params.id);
  let comments = {
    idnews: id,
    name: req.body.name,
    comment: req.body.comment,
  };
  Comments.create(comments)
    .then((addcomemnt) => {
      res.send(addcomemnt);
    })
    .catch((err) => {
      res.json({
        info: "Error",
        message: err.message,
      });
    });
});

//update news
router.put("/detail/:id", passport.authenticate("jwt",{session:false}), function (req, res, next) {
  const id = parseInt(req.params.id);
  let news = {
    title: req.body.title,
    image: req.file,
    berita: req.body.berita,
  };
  if (!news.image) {
    return res
      .status(422)
      .send(
        "file yang dikirim harus disertai gambar, harus format png/jpeg/jpg"
      );
  }
  var image = news.image.path;
  var image2 = image.replace(/\\/g, "/");
  news = {
    title: req.body.title,
    image: image2,
    berita: req.body.berita,
  };

  News.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num > 0) {
        res.send({ message: "data diperbarui" });
      } else {
        // http 404 not found
        res.status(404).send({
          message: "tidak terdapat data dengan id=" + id,
        });
      }
    })
    .catch((err) => {
      res.json({
        info: "Error",
        message: err.message,
      });
    });
});

//delete news
router.delete('/detail/:id', passport.authenticate("jwt",{session:false}),  function(req, res, next) {
    const id = parseInt(req.params.id);
  
    News.destroy({
      where: { id: id}
    })
    .then(num => {
      if(num>0) {
        res.send({message: "data sudah dihapus"});
      } else {
        // http 404 not found
        res.status(404).send({
          message: "tidak ada ada id=" + id
        })
      }
    })
    .catch(err => {
      res.json({
        info: "Error",
        message: err.message
      });
    });
  });

module.exports = router;
