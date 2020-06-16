"use strict";

//Main application file
const express = require('express');
const routes = require('./routes');
const http = require('http');
// const https = require('https');
// const fs = require('fs');

const app = express(); // app.set("port",process.env.PORT || 80);

//app.set("port", process.env.PORT || 3000); // Setting Port of the web application
const port = process.env.PORT || 3000;
// const httpsPort = process.env.PORT || 443;

app.use(express.static('client')); // Linking Front-end files

app.use(routes); // Routing

//app.listen(app.get("port"), function () {
//  console.log("Server started on port " + app.get("port"));
//});

// Certificate
// const privateKey = fs.readFileSync('/etc/letsencrypt/live/nobi-puzzle.com/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/nobi-puzzle.com/cert.pem', 'utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/nobi-puzzle/chain.pem', 'utf8');
// const privateKey = fs.readFileSync('privkey1.pem', 'utf8');
// const certificate = fs.readFileSync('cert1.pem', 'utf8');
// const ca = fs.readFileSync('chain1.pem', 'utf8');

// const credentials = {
	// key: privateKey,
	// cert: certificate,
	// ca: ca
// };

// Starting both http & https servers
const httpServer = http.createServer(app);
// const httpsServer = https.createServer(credentials, app);

httpServer.listen(port, () => {
	console.log('HTTP Server running on port 3000');
});

// httpsServer.listen(httpsPort, () => {
	// console.log('HTTPS Server running on port 443');
// });