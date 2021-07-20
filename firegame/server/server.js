const express = require("express");
const subdomain = require("express-subdomain");
const path = require("path");

const api = require("./api");

const port = 8080;

const app = express();

app.use(express.static("public"));

app.use(subdomain("api", api));

const build = "build";
app.use(express.static(build));
app.get("/*", function (req, res) {
  res.sendFile(path.join(build, "index.html"));
});

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});
