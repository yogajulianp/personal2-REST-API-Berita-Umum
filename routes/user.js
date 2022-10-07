var express = require('express');
var router = express.Router();

var bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.users;
const Op = db.Sequelize.Op;

const jwt = require('jsonwebtoken');
//const fs = require('fs');
const config = require('../config');
const passport = require('passport');

router.get('/', 
    passport.authenticate("jwt",{session:false}),   
    function(req, res, next) {
      
	User.findAll({
    attributes: ['name', 'email','username']
  })
	.then(data => {
		res.send(data);
	})
	.catch(err => {
		res.json({
			info: "Error",
			message: err.message
		});
	});
});

router.post('/register', function(req, res, next) {
  if(!(req.body.name && 
      req.body.username && req.body.email &&
      req.body.password)) {

       return res.status(400).json({
          message: "data tidak lengkap"
        })
  }
  var hashpass = bcrypt.hashSync(req.body.password, 8);
	var user = {
		name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: hashpass
	}
	User.create(user)
	.then(data => {
		res.send( {
      id: data.id,
      name: req.body.name,
      username: req.body.username,
      email: req.body.email
    });
	})
	.catch(err => {
		res.json({
			info: "Error",
			message: err.message
		});
	});
});

router.post('/update', function(req, res, next) {
  if(!(req.body.name && 
      req.body.email &&
      req.body.username)) {

       return res.status(400).json({
          message: "data tidak lengkap"
        })
  }
	var user = {
		name: req.body.name,    
    email: req.body.email
	}
	User.update(user, {
		where: {username: req.body.username}
	})
	.then(num => {
		res.json(
      {
        username: req.body.username,
        name: req.body.name,    
        email: req.body.email
      }
    )
		
	})
	.catch(err => {
		res.json({
			info: "Error",
			message: err.message
		});
	});
});

router.post('/login', function(req, res, next) {
  if(!(req.body.username && req.body.password)) {

       return res.status(400).json({
          message: "data tidak lengkap"
        })
  }
  User.findOne({ where: { username: req.body.username } })
	.then(data => {
		if(data) {
			var loginValid = bcrypt.compareSync(req.body.password, data.password);
			if(loginValid) {

        var payload = {
          userid: data.id,
          username: req.body.username
        };
        //const key = fs.readFileSync('D:/Belajar Software Engineer/Node JS Rapid Tech/projectpersonal2-REST-API-webBerita-yogaprasutiyo/certs/key.pem');
        let token = jwt.sign(
          payload,
          config.secret, {
            expiresIn: '24h'
          }
        );
        let dt = new Date(); // now
        dt.setHours(dt.getHours() + 24); // now + 3h
				res.json({
          success: true,
          token: token,
          expired: dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString()
        });
			}else{
				res.json({login:"username/password salah"});
			}
		}else {
			res.json({login:"username/password salah"});
		}
	})
	.catch(err => {
    console.log(err);
    res.json({message:"terjadi kegagalan sistem"});
	});	
	
});

module.exports = router;
