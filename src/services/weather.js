const https = require('https');

module.exports = (location, callback) => {
  const loc = location || process.env.DEFAULT_LOCATION;
  const options = {
    hostname: 'api.openweathermap.org',
    path: `/data/2.5/weather?q=${loc}&appid=${process.env.OPEN_WEATHER_MAP_API_KEY}`,
    method: 'GET',
  };

  const req = https.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);
    const data = [];

    res.on('data', (chunk) => {
      data.push(chunk);
    });

    res.on('end', () => {
      callback(null, JSON.parse(data));
    });
  });

  req.on('error', (error) => {
    console.error(error);
    callback(error);
  });

  req.end();
};
