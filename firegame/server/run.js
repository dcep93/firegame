const exec = require("child_process").exec;
const express = require("express");

const path = require("path");
const fs = require("fs");

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

const app = express.Router();

app.use(function (req, res, next) {
	console.log(req.path);
	next();
});

const scripts = fs.readdirSync(path.join(__dirname, "scripts"));
for (let script of scripts) {
	app.use(`/${script}`, (_, res) => run(script, res));
}

app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).send(err.stack);
});

app.use(function (req, res, next) {
	res.sendStatus(404);
});

module.exports = app;
