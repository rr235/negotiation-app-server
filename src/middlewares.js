const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuid } = require('uuid');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

module.exports = (app) => {
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
};
