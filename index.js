const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('api/cars', require('./src/middlewares/errorHandlingMiddleware'));
app.use('/api/cars', require('./src/routes/carRoutes'));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

module.exports = app;
