const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const cors = require('cors');
const getWeather = require('./services/weather');
const { v4: uuid } = require('uuid');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const app = express();
const server = http.createServer(app);

const data = {};

const port = process.env.PORT || 5000;
const corsOptions = {
  origin: [process.env.APPLICATION_URL],
  methods: 'GET, POST',
};
const sessionOptions = {
  genid: () => uuid(),
  store: new FileStore(),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
};

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(session(sessionOptions));

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

    res.status(200).send(data);
  };
  const { location } = req.body;

  getWeather(location, callback);
});

const checkExpectations = (sessionID) => {
  const expectedSalary = data[sessionID].expectedSalary;
  const offeredSalary = data[sessionID].offeredSalary;

  if (expectedSalary === null || offeredSalary === null) {
    return 'PENDING';
  }

  if (offeredSalary < expectedSalary) {
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
