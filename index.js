import express from 'express';
import routes from './src/routes/countriesExchangeRoutes';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
app.use([bodyParser.json(), cors()]);

const PORT = 8080;

routes(app);

app.get('/', (req, res) => res.send(`Express running on port ${PORT}`));

app.listen(PORT, () => {
	console.log(`Express is running on port ${PORT}`);
});
