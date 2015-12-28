/*
 * lib/secure-health-app-backend.js
 */

/* global secure-health-app-server, obj */

'use strict';

var Connection = require('tedious').Connection;
var crypto = require('crypto');
//var fs = require('fs');

//exports.verifyUser = function(Email, Pass) {
    
    
    //TODO fix this so we dont hardcode credentials in
    var config = {
      user: 'rainbowfish',
      password: 'Password1',
      server: 'l20ydv8lez.database.windows.net',
      options: {
          encrypt: true,
	  database: 'Rainbow Fish hospital database'
      }
    };

    var Email = "0925f997eb0d742678f66d2da134d15d842d57722af5f7605c4785cb5358831b";
    var Pass = "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8";

    //console.log("Email IS "+Email);
    //console.log("Pass IS "+Pass);

    var uEmail = crypto.createHash('SHA256').update(Email).digest('hex');
    var uPass = crypto.createHash('SHA256').update(Pass).digest('hex');

    console.log("Email IS "+uEmail);
    console.log("Pass IS "+uPass);
    
    var connection = new Connection(config);
    connection.on('connect', function(err){
	if(err) {
            console.log(err);
	    return false;
	}
	return executeStatement();
    });

    var Request = require('tedious').Request;
    var TYPES = require('tedious').TYPES;

    function executeStatement() {
	var request = new Request("SELECT uEmail, uPass FROM TestCredentials WHERE uEmail = @Email AND uPass = @Pass;",
		function(err){
			if(err){
				console.log(err);
				return false;
			}
		}
	);
	request.addParameter('Email',TYPES.VarChar(TYPES.Max), uEmail);
	request.addParameter('Pass', TYPES.VarChar(TYPES.Max), uPass);
	var result = "";
	request.on('row', function(columns) {
		if(columns[0].value === null) return false;
		else if(columns[1].value === null) return false;
		else if(columns[0].values === uEmail && columns[1].value === uPass){
			result += columns[0].values + " " + columns[1].values;
			console.log(result);
			return true;
		}else{
			return false;
		}
	});
	connection.execSql(request);
    }
//};




