const express = require("express");
const axios = require("axios");
const morgan = require("morgan");

let app = express();

var router = require("./routes.js");

app.use(express.json()); //need to put before the router middleware to make it work
app.use("/catwalk", router);
app.get("/loaderio-05425e451bc782628a76696ee8e789d9", (req, res) => {
  res.send("loaderio-05425e451bc782628a76696ee8e789d9");
});

app.use(express.static(__dirname + "/../dist"));

app.use(morgan("dev"));

module.exports = app;
