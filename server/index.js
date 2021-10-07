const express = require("express");
const axios = require("axios");
const morgan = require("morgan");

let app = express();

var router = require("./routes.js");

app.use(express.json()); //need to put before the router middleware to make it work
app.use("/catwalk", router);
app.get("/loaderio-eca04a34e999530e6afee5dcb1d94666.html", (req, res) => {
  res.send("loaderio-eca04a34e999530e6afee5dcb1d94666");
});
app.get("/loaderio-eca04a34e999530e6afee5dcb1d94666.txt", (req, res) => {
  res.send("loaderio-eca04a34e999530e6afee5dcb1d94666");
});
app.get("/loaderio-eca04a34e999530e6afee5dcb1d94666/", (req, res) => {
  res.send("loaderio-eca04a34e999530e6afee5dcb1d94666");
});



app.use(express.static(__dirname + "/../dist"));

app.use(morgan("dev"));

module.exports = app;
