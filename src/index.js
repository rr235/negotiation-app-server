const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();
const server = http.createServer(app);

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Listening at ${port}`);
});

app.use(bodyParser.json());

app.get('/', (req, res) => {});
