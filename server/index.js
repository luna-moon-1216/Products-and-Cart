const express = require("express");
const axios = require("axios");
const morgan = require("morgan");
const { TOKEN } = require("../config.js");

let app = express();

var router = require('./routes.js');

app.use(express.json()); //need to put before the router middleware to make it work
app.use('/catwalk', router);

app.use(express.static(__dirname + "/../dist"));

app.use(morgan("dev"));

module.exports = app;



