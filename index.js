const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();
const db = require('./_lib/ccrud/_config');
const app = express();
let dbClient;

// Middlewares
app.use(cors());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With, x-access-token');
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('X-powered-by', 'Hyperøbjekt');
  'OPTIONS' === req.method ? res.status(204).send() : next();
});
app.use(bodyParser.json({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }));
app.use(favicon(path.join(__dirname, '/assets', 'images', 'favicon.ico')));

// Mount Schemas
app.use((req, res, next) => {
  req.schemas = require(`./_lib/schemas`);
  next();
});


// // Routes
// app.use(`/${process.env.API_VERSION}/test`, require(`./${process.env.API_VERSION}/routes/test`));

const useRoutes = (service, routes) => {
  routes.forEach(file => {
    let route = file.split('.')[0]
    if (file.split('.')[1] === 'md') return;
    return app.use(`/${process.env.API_VERSION}/${route}`, require(`./services/${service}/${route}`))
  })
}

fs.readdirSync(`./services`)
  .forEach(service => {
    useRoutes(service, fs.readdirSync(`./services/${service}`))
  })

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status = 404;
  res.send({ url: req.url, error: 'Page Not Found' });
  next();
});

(async () => {
  try {
    dbClient = await db();
    // const app = require('./app')();
    app.set('db', dbClient);
    app.listen(process.env.PORT, () => console.log(`> REPEAT API running:  http://localhost:${process.env.PORT}/${process.env.API_VERSION}`))
  } catch (err) {
    console.error(err.stack || err);
  };
})();

module.exports = app;

