const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const getWeather = require('./services/weather');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Listening at ${port}`);
});

app.use(bodyParser.json());

app.get('/weather', (req, res) => {
  const callback = (error, data) => {
    if (error) {
      res.status(500).send(error);
      return;
    }

    res.status(200).send(data);
  };
  const { location } = req.body;

  getWeather(location, callback);
});
