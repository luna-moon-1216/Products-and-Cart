const express = require("express");
const axios = require("axios");
const morgan = require("morgan");

let app = express();

var router = require("./routes.js");

app.use(express.json()); //need to put before the router middleware to make it work
app.use("/catwalk", router);
app.get("/loaderio-26aa0ab7a4edf88be7e39925e8929583.html", (req, res) => {
  res.send("loaderio-26aa0ab7a4edf88be7e39925e8929583");
});
app.get("/loaderio-26aa0ab7a4edf88be7e39925e8929583.txt", (req, res) => {
  res.send("loaderio-26aa0ab7a4edf88be7e39925e8929583");
});
app.get("/loaderio-26aa0ab7a4edf88be7e39925e8929583/", (req, res) => {
  res.send("loaderio-26aa0ab7a4edf88be7e39925e8929583");
});



app.use(express.static(__dirname + "/../dist"));

app.use(morgan("dev"));

module.exports = app;
