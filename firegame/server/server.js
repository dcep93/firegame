const express = require("express");
const subdomain = require("express-subdomain");
const path = require("path");

const api = require("./api");

const port = 8080;

const app = express();

const build = path.join(__dirname, "../", "build");

app.use(subdomain("api", api));

app.use(express.static(build));
app.get("/*", function (req, res) {
  res.sendFile(path.join(build, "index.html"));
});

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});
