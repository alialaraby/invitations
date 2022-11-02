import express from 'express';
import { Config } from './startup/config';
import { CORS } from './startup/cors';
import { DbConnection } from './startup/db';
import { PortSetup } from './startup/port';
import { RouteSetup } from './startup/route';
const debug = require('debug')('app:all'); // condotional log, choose to show these log or not from env
const app = express();
const router = express.Router();

process.on('unhandledRejection', (ex) => { throw ex });

new Config(app, debug).setupConfigs();
new CORS(app).setupCORS();
new DbConnection(debug).connectToDb();
new PortSetup(app, debug).setupPort();
new RouteSetup(app, router).setupRoutes();

app.get('/', (req, res) => {
  res.send('Hi There!');
});