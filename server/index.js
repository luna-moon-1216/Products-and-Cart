const express = require("express");
const axios = require("axios");
const morgan = require("morgan");

let app = express();

var router = require("./routes.js");

app.use(express.json()); //need to put before the router middleware to make it work
app.use("/catwalk", router);
app.get("/loaderio-a182a72bf27e0e7fa96c3c2734a4b213.html", (req, res) => {
  res.send("loaderio-a182a72bf27e0e7fa96c3c2734a4b213");
});
app.get("/loaderio-a182a72bf27e0e7fa96c3c2734a4b213.txt", (req, res) => {
  res.send("loaderio-a182a72bf27e0e7fa96c3c2734a4b213");
});
app.get("/loaderio-a182a72bf27e0e7fa96c3c2734a4b213", (req, res) => {
  res.send("loaderio-a182a72bf27e0e7fa96c3c2734a4b213");
});



app.use(express.static(__dirname + "/../dist"));

app.use(morgan("dev"));

module.exports = app;
