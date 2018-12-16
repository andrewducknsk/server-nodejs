const express = require(`express`);
const bodyParser = require(`body-parser`);
const fs = require(`fs`);

const app = express();
const jsonParser = bodyParser.json();

app.use((req, res, next) => {
	res.setHeader(`Access-Control-Allow-Origin`, `*`);
	res.setHeader(
		`Access-Control-Allow-Methods`,
		`GET, POST, PUT, DELETE, OPTIONS`
	);
	res.setHeader(
		'Access-Control-Allow-Headers',
		'X-Requested-With,content-type'
	);
	res.setHeader('Access-Control-Allow-Credentials', false);
	next();
});

app.post(`/api/poll-form/info`, jsonParser, (req, res) => {
	res.send(req.body);
});

app.listen(3000);
