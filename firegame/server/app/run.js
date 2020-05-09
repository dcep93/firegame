var exec = require("child_process").exec;
var express = require("express");

var path = require("path");
var fs = require("fs");

function run(name, res) {
	const scriptPath = path.join(__dirname, "scripts", name);
	console.log(name, scriptPath);
	exec(`bash ${scriptPath}`, function (err, stdout, stderr) {
		if (err) {
			console.log(stderr);
			if (res) res.status(500).send(stderr);
			return;
		}
		(res ? res.send.bind(res) : console.info)(stdout);
	});
}

var app = express.Router();

var scripts = fs.readdirSync(path.join(__dirname, "scripts"));
for (var script of scripts) {
	app.use(`/${script}`, (_, res) => run(script, res));
}

module.exports = app;
