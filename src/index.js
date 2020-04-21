const express = require('express');
const http = require('http');
const getWeather = require('./services/weather');
const applyMiddleswares = require('./middlewares');

const data = {};
const port = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

applyMiddleswares(app);

server.listen(port, () => {
  console.log(`Listening at ${port}`);
});

app.get('/', (req, res) => {
  res.send(req.sessionID);
});

app.get('/weather', (req, res) => {
  const callback = (error, data) => {
    if (error) {
      res.setHeader('Content-Type', 'application/json');
      res.status(500).send(error);
      return;
    }

    const temperatureData = {
      location: data.name,
      temp: (data.main.temp - 273.15).toFixed(2), // converts to deg celsius
    };

    res.status(200).send(temperatureData);
  };
  const { location } = req.query;

  getWeather(location, callback);
});

const checkExpectations = (sessionID) => {
  const expectedSalary = data[sessionID].expectedSalary;
  const offeredSalary = data[sessionID].offeredSalary;

  if (expectedSalary === null || offeredSalary === null) {
    return 'PENDING';
  }

  if (Number(offeredSalary) < Number(expectedSalary)) {
    delete data[sessionID];
    return 'FAILURE';
  }

  delete data[sessionID];
  return 'SUCCESS';
};

app.post('/employee', ({ sessionID, body }, res) => {
  if (!data[sessionID]) {
    data[sessionID] = {
      expectedSalary: null,
      offeredSalary: null,
    };
  }
  data[sessionID].expectedSalary = body.value;
  res.send(checkExpectations(sessionID));
});

app.post('/employer', ({ sessionID, body }, res) => {
  if (!data[sessionID]) {
    data[sessionID] = {
      expectedSalary: null,
      offeredSalary: null,
    };
  }
  data[sessionID].offeredSalary = body.value;
  res.send(checkExpectations(sessionID));
});
