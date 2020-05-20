//Main application file
require("@babel/register");
const express = require('express');
const routes = require('./routes');

const app = express();

// app.set("port",process.env.PORT || 80);
app.set("port",process.env.PORT || 3000);   // Setting Port of the web application


app.use(express.static('client'));  // Linking Front-end files
app.use(routes);    // Routing


app.listen(app.get("port"),function(){
    console.log("Server started on port " + app.get("port"));
});