const express = require(`express`);
const bodyParser = require(`body-parser`);
const fs = require(`fs`);

const app = express();
const jsonParser = bodyParser.json();

app.post(`/api/poll-form/info`, jsonParser, (req, res) => {
	res.send(req.body);
});

app.listen(3000);
