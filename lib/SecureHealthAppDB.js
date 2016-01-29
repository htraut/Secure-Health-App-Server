/*
 * lib/secure-health-app-backend.js
 */

/* global secure-health-app-server, obj */


/*
 * Not an actual DB just a test to fake being a DB for testing.
 */

'use strict';

var Connection = require('tedious').Connection;
var crypto = require('crypto');
//var fs = require('fs');

exports.verifyUser = function(Email, Pass) {   

    var cEmail = "3567b2b30470312ba45c1f72f3b2c9f92947ca14c5953fdef05669c6644972bf";
    var cPass = "113459eb7bb31bddee85ade5230d6ad5d8b2fb52879e00a84ff6ae1067a210d3";

    //console.log("Email IS "+Email);
    //console.log("Pass IS "+Pass);

    var uEmail = crypto.createHash('SHA256').update(Email).digest('hex');
    var uPass = crypto.createHash('SHA256').update(Pass).digest('hex');


    console.log("Email IS "+uEmail);
    console.log("Pass IS "+uPass);
    
    if(uEmail == cEmail && uPass == cPass ){
	return true;
    }else{
	return false;
    }
};




