var http = require('http'),
    fs = require('fs'),
    ccav = require('./ccavutil.js'),
    crypto = require('crypto'),
    qs = require('querystring');

exports.postReq = function(request,response){
    var body = '',
	workingKey = 'B97EAF4DC59065991363F9FBD2FF2F0B',	//Put in the 32-Bit key shared by CCAvenues.
	accessCode = 'AVPE12KA23BQ20EPQB',			//Put in the Access Code shared by CCAvenues.
	encRequest = 'wdadad',
	formbody = '';

    //Generate Md5 hash for the key and then convert in base64 string
    var md5 = crypto.createHash('md5').update(workingKey).digest();
    var keyBase64 = Buffer.from(md5).toString('base64');

    //Initializing Vector and then convert in base64 string
    var ivBase64 = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d,0x0e, 0x0f]).toString('base64');

    request.on('data', function (data) {
	body += data;
	encRequest = ccav.encrypt(body, keyBase64, ivBase64); 
    console.log(typeof(encRequest));
    console.log(encRequest);
    console.log(typeof(accessCode));
    console.log(accessCode)
	formbody = '<form id="nonseamless" method="post" name="redirect" action="https://test.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><script language="javascript">document.redirect.submit();</script></form>';
    });
				
    request.on('end', function () {
    response.writeHeader(200, {"Content-Type": "text/html"});
	response.write(formbody);
	response.end();
    });
};
