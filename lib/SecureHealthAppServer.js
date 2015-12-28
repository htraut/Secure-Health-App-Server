/*
 * lib/secure-health-app-server.js
 */

/* global process, __dirname */

'use strict';

var PORT = 80;
var ADDRESS = '0.0.0.0';

var https = require('https');
var http = require('http');
var path = require('path');
var port = process.argv[2] || 443;
var insecurePort = process.argv[3] || PORT;
var fs = require('fs');
var checkip = require('check-ip-address');
var server;
var insecureServer;
var options;
var constants = require('constants');
var helmet = require('helmet');
var express = require('express');
var bodyParser = require('body-parser');
var certsPath = path.join(__dirname, 'certs', 'server');
var interCertsPath = path.join(__dirname, 'certs', 'inter');
var caCertsPath = path.join(__dirname, 'certs', 'ca');
var ONE_YEAR = 31536000000;
var db = require('./SecureHealthAppDB.js');
var app = express();
//var jsonParser = bodyParser.json();


options = {
     key: fs.readFileSync(path.join(certsPath, 'my-server.key')),
  // This certificate should be a bundle containing your server certificate and any intermediates
  // cat certs/cert.pem certs/chain.pem > certs/server-bundle.pem
     cert: fs.readFileSync(path.join(certsPath, 'rbfsecurehealth.com.crt')),
  // ca only needs to be specified for peer-certificates
     ca: [ fs.readFileSync(path.join(interCertsPath, 'sub.class1.server.sha2.ca.pem'))],
     secureProtocol: 'SSLv23_method',
     secureOptions: constants.SSL_OP_NO_SSLv3,
     ciphers: 
      [ 
	"DHE-ECDSA-AES256-GCM-SHA384",
	"ECDHE-RSA-AES256-GCM-SHA384",
	"ECDHE-ECDSA-AES256-SHA384",
	"ECDHE-RSA-AES256-SHA384",
	"ECDHE-ECDSA-AES256-GCM-SHA256",
	"ECDHE-RSA-AES256-GCM-SHA256",
	"ECDHE-ECDSA-AES256-SHA256",
	"ECDHE-RSA-AES256-SHA256",
	"DHE-RSA-AES256-GCM-SHA384",
	"DHE-RSA-AES256-GCM-SHA256",
	"DHE-RSA-AES256-SHA256",
	"ECDHE-ECDSA-AES128-GCM-SHA256",
	"ECDHE-RSA-AES128-GCM-SHA256",
	"ECDHE-ECDSA-AES128-SHA256",
	"ECDHE-RSA-AES128-SHA256",
	"ECDHE-ECDSA-AES128-SHA",
	"ECDHE-RSA-AES128-SHA",
	"DHE-RSA-AES128-GCM-SHA256",
	"DHE-RSA-AES128-SHA256",
	"DHE-RSA-AES128-SHA",
	"AES256-GCM-SHA384",
	"AES256-SHA256",
	"AES128-GCM-SHA256",
	"AES128-SHA256",
	"AES128-SHA",
	"DES-CBC3-SHA",
	"HIGH",
	"!aNULL",
	"!eNULL",
	"!EXPORT",
	"!DES",
	"!RC4",
	"!MD5",
	"!PSK",
	"!SRP",
	"!CAMELLIA"
	].join(':'),
    honorCipherOrder: true,
    requestCert: false,
    rejectUnauthorized: false
};


app.use(helmet.hsts({
    maxAge: ONE_YEAR,
    includeSubdomains: true,
    force: true
}));

app.use(bodyParser.json());

app.post('/', function(req, res) {
    console.log("Executing POST");
    if(!req.body) return res.sendStatus(400);
    //res.sendStatus(200);
    res.set('Content-Type', 'application/json');
    var task = req.body.task;
    console.log("Task IS "+task);
    if(task === "Login"){
    	var user = req.body.user;
    	var passwd = req.body.password;
    	//console.log("Email IS "+user);
    	//console.log("Pass IS "+passwd);
    	var auth = db.verifyUser(user, passwd);
	if(auth){
		console.log("Sending accepted json");
		res.json({auth: true});
		res.end()
	}else{
		console.log("Send denied json");
		res.json({auth: false});
		res.end();
	}
    }else{
	//TODO other tasks/error handling
	res.json({auth: false});
	res.end();
    }
});


server = https.createServer(options, app);
server.listen(port);

//Testing purposes
/*
checkip.getExternalIp().then(function (ip) {
  var ip = '';
  var host = ip || 'www.rbfsecurehealth.com';

  function listen(app) {
    server.on('request', app);
    server.listen(port, function () {
      port = server.address().port;
      console.log('Listening on https://127.0.0.1:' + port);
      console.log('Listening on https://www.rbfsecurehealth.com' + port);
      if (ip) {
        console.log('Listening on https://' + ip + ':' + port);
      }
    });
  }

  var publicDir = path.join(__dirname, 'public');
  var app = require('./app').create(server, host, port, publicDir);
  listen(app);
});*/






var insecureServer = http.createServer(function(req, res) {
});

insecureServer.on('request', function (req, res) {
      res.setHeader(
         'Location'
           , 'https://' + req.headers.host.replace(/:\d+/, ':' + port) + req.url);
               res.statusCode = 302;
               res.end();
});

insecureServer.listen(PORT, ADDRESS, function() {
});
