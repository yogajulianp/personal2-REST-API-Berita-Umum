const fs = require('fs');
var key = fs.readFileSync('D:/Belajar Software Engineer/Node JS Rapid Tech/projectpersonal2-REST-API-webBerita-yogaprasutiyo/certs/key.pem');

module.exports = {
	secret: key
}