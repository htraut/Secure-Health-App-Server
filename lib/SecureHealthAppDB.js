/*
 * lib/secure-health-app-backend.js
 */

/* global secure-health-app-server, obj */

'use strict';

var mssql = require('mssql');
var crypto = require('crypto');


function SecureHealthAppDB(){
};

SecureHealthAppDB.verifyUser = function(uEmail, uPass) {
    
    
    //TODO fix this so we dont hardcode credentials in
    var config = {
      user:  'rainbowfish' ,
      password: 'Password1',
      server: 'rn140djyhc.database.windows.net',
      database: 'Rainbow Fish hospital database',
      
      options:{
          encrypt: true
      }
    };
    
    crypto.createHash("sha256");
    crypto.update(uEmail);
    crypto.disgest(uEmail);
    crypto.update(uPass);
    crypto.digest(uPass);
    
    console.log("Email IS"+uEmail);
    console.log("Pass IS"+uPass);
    
    var connect = new mssql.Connection(config,function(err){
        if(err) return false;
    });
    
    var request = new mssql.Request(connect, function(err){
        if(err) return false;
    });
    
    request.query(
        "SELECT uEmail FROM TestCredentials WHERE uEmail = "+uEmail,
        function(err, email){
            if(err) {
                return false;
            }else{
                if(uEmail === email){
                   request.query(
                        "SELECT uPass FROM TestCredentials WHERE uPass = "+uPass,
                        function(err, pass){
                            if(err){
                                return false;
                            }else{
                                if(uPass === pass){
                                    return true;
                                }
                            }
                        }
                    );
                }
            }
        }
    );
};




