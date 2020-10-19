/*
NodeJS CMX / Scanning API Receiver

https://developer.cisco.com/meraki/scanning-api/#!overview/overview

A basic web service to accept CMX data from a Cisco Meraki network
- Accept a GET request from Meraki and respond with a validator
- Meraki will POST to server, if validated.
- POST will contain a secret, which can be verified by the server.
- JSON data will be in the req.body.data. This will be available in the cmxData function's data object.

-- This skeleton app will only place the data received on the console. It's up to the developer to use this how ever required

*/

// CHANGE THESE CONFIGURATIONS to match your CMX configuration
var port = process.env.OVERRIDE_PORT || process.env.PORT || 1890;
var secret = process.env.SECRET || 'test123';
var validator = process.env.VALIDATOR || '0e85e7d9b92f0c9099efbbb47028b25c405e01a3';
var route = process.env.ROUTE || '/cmx';

// All CMX JSON data will end up here. Send it to a database or whatever you fancy.

function cmxData(data) {
	console.log('JSON Feed: ' + JSON.stringify(data, null, 2));
}

//**********************************************************

// Express Server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json({ limit: '25mb' }));


// Meraki asks for us to know the validator
app.get(route, function(req, res) {
	console.log('Validator = ' + validator);
	res.status(200).send(validator);
});

// Getting the flow of data every minute
app.post(route, function(req, res) {
	if (req.body.secret == secret) {
		console.log('Secret verified');
		cmxData(req.body);
		res.status(201).send();
	} else {
		console.log('Secret was invalid');
		res.status(501).send();
	}
	
});

// Start server
app.listen(port, function() {
	console.log('CMX Receiver listening on port: ' + port);
});
