const express = require("express");
const path = require("path");

const run = require("./run");

const port = 8080;

const app = express();

const build = path.join(__dirname, "../", "../", "build");

app.use(express.static(build));
app.get("/*", function (req, res) {
	res.sendFile(path.join(build, "index.html"));
});
app.use("/run", run);

app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).send(err.stack);
});

app.use(function (req, res, next) {
	res.sendStatus(404);
});

app.listen(port, function () {
	console.log(`listening on port ${port}`);
});
