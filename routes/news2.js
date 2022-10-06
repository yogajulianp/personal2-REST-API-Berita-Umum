var express = require("express");
var router = express.Router();

const db = require("../models");
const News = db.news;
const Comments = db.comments;
const Op = db.Sequelize.Op;

const auth = require("../auth");
const news = require("../models/news");


//get all news
router.get("/", function (req, res, next) {
  News.findAll()
    .then((data) => {
      res.render("news", {
        pageTitle: "Daftar Berita Saat ini",
        news: data,
      });
    })

    .catch((err) => {
      res.render("news", {
        pagetitle: "Daftar Berita Saat ini",
        news: [],
      });
    });
});

//detail by params
router.get("/detail/:id", async function (req, res, next) {
  const id = parseInt(req.params.id);

  const isiComments = await Comments.findAll({
    where : {
      idnews: id
    }
  });
  await News.findByPk(id)
    .then((datadetail) => {
      if (datadetail) {
        res.render("newsDetail", {
          pagetitle: "Berita Saat ini",
          news: datadetail,
          comments : isiComments
        });
      } else {
        // http 404 not found
        res.render("newsDetail", {
          pagetitle: "Berita Saat ini",
          news: {},
        });
      }
    })
    .catch((err) => {
      res.render("newsDetail", {
        pagetitle: "Berita Saat ini",
        news: [],
      });
    });
});

//add Komentar
router.post("/addcomments", function (req, res, next) {
  
  let comments = {
    idnews : req.body.idnews,
    name: req.body.name,
    comment: req.body.comment
  };
  Comments.create(comments)
    .then((addData) => {
      res.redirect(`/detail/${req.body.idnews}`);
    })
    .catch((err) => {
      res.json({
        info: "Error",
        message: err.message,
      });
    });
});



//add Berita
router.get("/addnews", auth, function (req, res, next) {
  res.render("addNews", {
    pageTitle: 'Tambah Berita',
    path: 'addnews',
    editing: false,
    hasError: false,
    errorMessage: null,
  });
});

//add Berita
router.post("/addnews", auth, function (req, res, next) {
  let news = {
    title: req.body.title,
    image: req.file,
    berita: req.body.berita,
  };
 
  if (!news.image) {
    return res.status(422).render("addNews", {
      pageTitle: 'Tambah Berita',
      path: 'addnews',
      editing: false,
      hasError: true,
      news : {
        title: req.body.title,
        berita: req.body.berita,
      },
      errorMessage: 'file yang dikirim harus disertai gambar, harus format png/jpeg/jpg',
    });
  }
  var image = news.image.path
  var image2 = image.replace(/\\/g, "/")

  news = {
    title: req.body.title,
    image: image2,
    berita: req.body.berita,
  };
  News.create(news)
    .then((addData) => {

      res.redirect("/");
    })
    .catch((err) => {
      res.json({
        info: "Error",
        message: err.message,
      });
    });
});

//edit berita, data di ambil
router.get("/editnews/:id", auth, function (req, res, next) {
  const id = parseInt(req.params.id);
 
  News.findByPk(id)
    .then((dataEdit) => {
      if (dataEdit) {
        res.render("editNews", {
          pageTitle: "Edit Berita",
          hasError: false,
          errorMessage: null,
          news: dataEdit,
        });
      } else {
        // http 404 not found
        res.redirect("/");
        
      }
    })
    .catch((err) => {
      res.json({
        info: "Error",
        message: err.message,
      });
    });
});

//Edit News akan di Post
router.post("/editnews/:id",auth, function (req, res, next) {
  const id = parseInt(req.params.id);
  let news = {
    title: req.body.title,
    image: req.file,
    berita: req.body.berita,
  };
  if (!news.image) {
    return res.status(422).render("editNews", {
      pageTitle: 'Edit Berita',
      path: 'editnews',
      editing: true,
      hasError: true,
      news : {
        title: req.body.title,
        berita: req.body.berita,
      },
      errorMessage: 'file yang dikirim harus disertai gambar, harus format png/jpeg/jpg',
    });
  }

  var image = news.image.path
  var image2 = image.replace(/\\/g, "/")
  news = {
    title: req.body.title,
    image: image2,
    berita: req.body.berita,
  };

  News.update(news, {
    where: { id: id },
  })
    .then((num) => {
      res.redirect("/");
    })
    .catch((err) => {
      res.json({
        info: "Error",
        message: err.message,
      });
    });
});


//Delete News
router.get("/delete/:id", auth, function (req, res, next) {
  const id = parseInt(req.params.id);

  News.destroy({
    where: { id: id}
  })
    .then((datadetail) => {
      if (datadetail) {
        res.redirect('/')
      } else {
        // http 404 not found
        res.status(404).send({
        message: "tidak ada ada id=" + id
      })
      }
    })
    .catch((err) => {
      res.render("newsDetail", {
        pagetitle: "Daftar Produk",
        news: {},
      });
    });
});



module.exports = router;
