const express = require("express");
const fetch = require("node-fetch");

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

app.use("/proxy", (req, res) => {
  const url = req.body.url;
  const params = req.body.params;
  if (!url) {
    res.sendStatus(400);
    return;
  }
  fetch(url, params)
    .then((resp) => resp.text())
    .then((text) => res.send(text));
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err.stack);
});

app.use(function (req, res, next) {
  res.sendStatus(404);
});

module.exports = app;
