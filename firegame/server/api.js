const express = require("express");
const fetch = require("node-fetch");

// fetch(
//   "https://sportscentral.io/streams-table/295189/american-football?new-ui=1&origin=reddit.nflbite.com",
//   {
//     headers: {
//       accept: "*/*",
//       "accept-language": "en-US,en;q=0.9",
//       "cache-control": "no-cache",
//       pragma: "no-cache",
//       "sec-ch-ua":
//         '"Google Chrome";v="95", "Chromium";v="95", ";Not A Brand";v="99"',
//       "sec-ch-ua-mobile": "?0",
//       "sec-ch-ua-platform": '"macOS"',
//       "sec-fetch-dest": "empty",
//       "sec-fetch-mode": "cors",
//       "sec-fetch-site": "cross-site",
//       Referer: "https://reddit.nflbite.com/",
//       "Referrer-Policy": "strict-origin-when-cross-origin",
//     },
//     body: null,
//     method: "GET",
//   }
// )
//   .then((resp) => resp.text())
//   .then((text) => console.log(text));

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
