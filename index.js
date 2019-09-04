import express from 'express';
import routes from './src/routes/countriesExchangeRoutes';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const PORT = 3001;

routes(app);

app.get('/', (req, res) => res.send(`Express running on port ${PORT}`));

app.listen(PORT, () => {
	console.log(`Express is running on port ${PORT}`);
});
