const express = require("express");
const axios = require("axios");
const morgan = require("morgan");

let app = express();

var router = require("./routes.js");

app.use(express.json()); //need to put before the router middleware to make it work
app.use("/catwalk", router);
app.get("/loaderio-d696ff881d540cdfc3b3a04350397744", (req, res) => {
  res.send("loaderio-d696ff881d540cdfc3b3a04350397744");
});

app.use(express.static(__dirname + "/../dist"));

app.use(morgan("dev"));

module.exports = app;
