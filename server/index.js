const express = require("express");
const axios = require("axios");
const morgan = require("morgan");

let app = express();

var router = require("./routes.js");

app.use(express.json()); //need to put before the router middleware to make it work
app.use("/catwalk", router);
app.get("/loaderio-b255e3e53beb56789cf2dcb4d2cce136", (req, res) => {
  res.send("loaderio-b255e3e53beb56789cf2dcb4d2cce136");
});




app.use(express.static(__dirname + "/../dist"));

app.use(morgan("dev"));

module.exports = app;
