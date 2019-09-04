import jsonwebtoken from 'jsonwebtoken';

const user = {
	id: 1,
	username: 'asad',
	email: 'asad@gmail.com',
	password: '111'
};

const routes = app => {
	app
		.route('/login')
		.get((req, res) => res.send('GET request successfull!!!'))

		.post((req, res) => {
			if (req.body.username === 'asad' && req.body.password === '111') {
				jsonwebtoken.sign({ user }, 'secretkey', (err, token) => {
					res.json({ token });
				});
			} else {
				res.send('Invalid username or password');
			}
		});

	app
		.route('/cntryexch')
		.get(
			(req, res, next) => {
				const bearerHeader = req.headers['authorization'];
				// Check if bearer is undefined
				if (typeof bearerHeader !== 'undefined') {
					// Split at the space
					const bearer = bearerHeader.split(' ');
					// Get token from array
					const bearerToken = bearer[1];
					// Set the token
					req.token = bearerToken;
					// Next middleware
					next();
				} else {
					// Forbidden
					res.sendStatus(403);
				}
			},
			(req, res, next) => {
				jsonwebtoken.verify(req.token, 'secretkey', (err, authData) => {
					if (err) {
						res.sendStatus(403);
					} else {
						res.json({
							message: 'Post created...',
							authData
						});
					}
				});
			}
		)
		.post((req, res) =>
			res.send('POST request successfull Countries endpoint')
		);
};

export default routes;
