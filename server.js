const express = require(`express`);
const bodyParser = require(`body-parser`);
const fs = require(`fs`);
const serverless = require(`serverless-http`);

const app = express();
const jsonParser = bodyParser.json();
const router = express.Router();

router.use((req, res, next) => {
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
router.get(`/`, (req, res) => {
	res.writeHead(200, {
		'Content-Type': 'text/html',
	});
	res.write(`<main>
	<h1>Hi, my friends!</h1>
	<p>GET-request (All): https://server-nodejs.netlify.com/api/poll-form/info/all</p>
	<p>GET-request (Id): https://server-nodejs.netlify.com/api/poll-form/info/:id</p>
	<p>POST-request: https://server-nodejs.netlify.com/api/poll-form/info</p>
	</main>`);
	res.end();
});

router.post(`/poll-form/info`, jsonParser, (req, res) => {
	if (!req.body) return res.sendStatus(400);
	// personal Information
	let nameUser = req.body.personalInformation.name;
	let surnameUser = req.body.personalInformation.surname;
	// important Information
	let favoriteNumber = req.body.importantInformation.favoriteNumber;
	let favoriteMusician = req.body.importantInformation.favoriteMusician;
	// additional Information
	let favoriteColor = req.body.additionalInformation.favoriteColor;

	const data = JSON.parse(fs.readFileSync(`data.json`, `utf8`));

	let personalInfo = {
		name: nameUser,
		surname: surnameUser,
		favoriteNumber,
		favoriteMusician,
		favoriteColor,
	};

	let id = Math.max.apply(null, data.map(item => item.id));

	if (personalInfo.id === undefined) {
		personalInfo.id = 1;
	} else {
		personalInfo.id = id + 1;
	}

	data.push(personalInfo);

	fs.writeFileSync(`data.json`, JSON.stringify(data));

	res.send(personalInfo);
});

router.get(`/poll-form/info/all`, (req, res) => {
	let data = JSON.parse(fs.readFileSync(`data.json`, `utf8`));

	res.send(data);
});

router.get(`/poll-form/info/:id`, (req, res) => {
	let id = +req.params.id;

	let data = JSON.parse(fs.readFileSync(`data.json`, `utf8`));

	const user = data.filter(item => item.id === id);

	const name = user
		.map(
			item =>
				`<p>Name: ${item.name}</p>
		<p>Surname: ${item.surname}</p>
		<p>Favorite Number: ${item.favoriteNumber}</p>
		<p>Favorite Musician: ${item.favoriteMusician}</p>
		<p>Favorite Colors: ${item.favoriteColor.join(`, `)}</p>`
		)
		.join();

	res.send(name);
});

app.use(bodyParser.json());
app.use(`/api`, router);

module.exports = app;
module.exports.handler = serverless(app);

app.listen(8080);
