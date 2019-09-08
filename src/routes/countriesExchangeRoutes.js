import jsonwebtoken from 'jsonwebtoken';
import request from 'request';
import requestPromise from 'request-promise';

const user = {
	id: 1,
	username: 'asad',
	email: 'asad@gmail.com',
	password: '111'
};
let exchangeRates;
getAllCurrencyConversions();
/*
	Ideally countries should be fetched at this stage because they're static and exchange rate fetched at each call if we want a real time system
	Else we can fetch and cache information for a predefined period and fetch after pre defined time.
*/

const routes = app => {
	app
		.route('/login')
		.get((req, res) => res.send('GET request successfull!!!'))

		.post((req, res) => {
			if (req.body.username === user.username && req.body.password === '111') {
				jsonwebtoken.sign({ user }, 'secretkey', (err, token) => {
					res.json({ token });
				});
			} else {
				return res.status(401).send({
					message: 'Invalid username or password'
				});
			}
		});

	app
		.route('/cntryexch')
		.get(
			(req, res, next) => {
				const bearerHeader = req.headers.authorization;
				if (typeof bearerHeader !== 'undefined') {
					const bearer = bearerHeader.split(' ');
					const bearerToken = bearer[1];
					req.token = bearerToken;
					next();
				} else {
					return res.status(403);
				}
			},
			(req, res, next) => {
				callRestCounries(result => {
					jsonwebtoken.verify(req.token, 'secretkey', (err, authData) => {
						if (err) {
							res.sendStatus(403);
						} else {
							let countryArray = JSON.parse(result);
							res.send(
								countryArray.map(country => {
									return {
										name: country.name,
										population: country.population,
										currencies: country.currencies.map(currency => {
											return Object.assign(
												//mutate the existing currency array to add rate object //spread operator is failing
												{ rate: exchangeRates[currency.code] },
												currency
											);
										})
									};
								})
							);
						}
					});
				});
			}
		)
		.post((req, res) =>
			res.send('POST request successfull Countries endpoint')
		);
};

function callRestCounries(cb) {
	request.get(
		{
			url: 'https://restcountries.eu/rest/v2/all',
			headers: {
				'Content-Type': 'application/json'
			}
		},
		function(error, response, body) {
			// if (response.statusCode >= 400 || error) { this can crash
			if (!error && response.statusCode == 200) {
				console.log('body is ' + response.statusCode);
				cb(body);
			} else {
				console.log('Error connecting countries endpoint');
			}
		}
	);
}

function getAllCurrencyConversions() {
	requestPromise({
		url:
			'http://data.fixer.io/api/latest?access_key=65a46a3c3c9c4a87ab07b6a72500b80d&base=EUR',
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(body => {
			exchangeRates = JSON.parse(body).rates;
			console.log('response is $$' + JSON.stringify(exchangeRates));
		})
		.catch(error => {
			console.log('Error from exchange ' + error);
		});
}

export default routes;
