const express = require("express");

const app = express.Router();

app.use(function (req, res, next) {
  console.log(req.path);
  next();
});

console.log("api");
app.use("/sanity", (req, res) => {
  console.log("sanity");
  res.send("sanity\n");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err.stack);
});

app.use(function (req, res, next) {
  res.sendStatus(404);
});

module.exports = app;
