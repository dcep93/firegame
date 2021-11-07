const express = require("express");
const subdomain = require("express-subdomain");
const path = require("path");

const api = require("./api");

const port = 8080;

const app = express();

app.use(express.json());

app.use(subdomain("api", api));
// app.use(api);

const build = path.join(__dirname, "build");
app.use(express.static(build));
app.use(express.static("public"));
app.get("/*", function (req, res) {
  res.sendFile(path.join(build, "index.html"));
});

app.listen(port, function () {
  console.log(`listening on port ${port}`);
});
