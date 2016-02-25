

var http = require('http');
var utils = require('./SecureHealthAppUtils.js');
var crypto = require('crypto');

var decrypted;
var toVerify;
var checksum;
//var val = "";
var toCheck = [];

exports.transmitData = function(data, chksum){
     checksum = chksum;
     var options = {
	host: '127.0.0.1',
     	port: '8000',
        path: '/test',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
     };

     var post_req = http.request(options, function(res){
	var val = "";
	res.setEncoding('utf8');
      	res.on('data', function (chunk) {
	     if(chunk !== null){
       	     	val += chunk;
	     }
     	});
	res.on('end', function(){
	     var temp = utils.StringToIntArray(val);
	     var output = "";
	     var i;
	     for(i = 0; i < temp.length; i++){
		output += String.fromCharCode(temp[i]);
 	     }
	     toCheck.push(output);
	     console.log(output);
	     var concat = "";
    	     for(i = 0; i < toCheck.length; i++){
       		 concat += toCheck[i];
     	     }
     	     var VerifyChecksum = crypto.createHash('SHA256').update(concat).digest('hex');
     	     if(checksum === VerifyChecksum){
        	console.log(checksum)
        	console.log(VerifyChecksum);
        	console.log("Data integirty verified");
     	     }
	});
     });

     post_req.write(data);
     post_req.end();
     return true;
}
