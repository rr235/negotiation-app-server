const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const getWeather = require('./services/weather');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 5000;
const corsOptions = {
  origin: [process.env.APPLICATION_URL],
  methods: 'GET, POST',
};

app.use(bodyParser.json());
app.use(cors(corsOptions));

server.listen(port, () => {
  console.log(`Listening at ${port}`);
});

app.get('/weather', (req, res) => {
  const callback = (error, data) => {
    if (error) {
      res.setHeader('Content-Type', 'application/json');
      res.status(500).send(error);
      return;
    }

    res.status(200).send(data);
  };
  const { location } = req.body;

  getWeather(location, callback);
});
