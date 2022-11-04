import express from 'express';
import { Config } from './startup/config';
import { CORS } from './startup/cors';
import { DbConnection } from './startup/db';
import { PortSetup } from './startup/port';
import { RouteSetup } from './startup/route';
import path from 'path';
import { StatusCode } from './enums/request-response-enums';
import { PasswordHelper } from './helper/password';
import User from './model/user';

const { check, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const validationRules = [
  check('fullName', 'Full name is required').not().isEmpty().trim(),
  check('phone', 'Phone is required').not().isEmpty().trim(),
  check('email', 'Email is required').not().isEmpty().trim(),
  check('company', 'Company is required').not().isEmpty().trim(),
  check('sector', 'Sector is required').not().isEmpty().trim(),
  check('title', 'Title is required').not().isEmpty().trim(),
  check('vertX', '').not().isEmpty(),
];

const debug = require('debug')('app:all'); // condotional log, choose to show these log or not from env
const app = express();
const router = express.Router();

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

process.on('unhandledRejection', (ex) => { throw ex });

new Config(app, debug).setupConfigs();
new CORS(app).setupCORS();
new DbConnection(debug).connectToDb();
new PortSetup(app, debug).setupPort();
new RouteSetup(app, router).setupRoutes();

app.get('/', (req, res) => {
  res.send('Hi There!');
});

function submitForm(request: any): Promise<{ done: boolean, code: any }> {
  return new Promise(async (resolve, reject) => {
    try {
      let hashedPhone = request.vertX;

      let user = await User.findOne({ phone: request.phone.trim().toLowerCase() });
      if (user && user.submittedRegistration) {
        return resolve({
          // message: 'Thank you, you already submitted the form',
          done: false,
          code: StatusCode.AlreadyExists
        });
      }

      if (!user) {
        return resolve({
          // message: 'Sorry, You are not eligible for this invitation.',
          done: false,
          code: StatusCode.UnAuthorized
        });
      }

      let match = await PasswordHelper.comparePassword(user.phone, hashedPhone);
      if (!match) {
        return resolve({
          // message: 'Sorry, You are not eligible for this invitation.',
          done: false,
          code: StatusCode.UnAuthorized
        });
      }

      user.fullName = request.fullName;
      user.email = request.email;
      user.company = request.company;
      user.sector = request.sector;
      user.title = request.title;
      user.submittedRegistration = true;
      await user.save();

      return resolve({ done: true, code: StatusCode.Ok });
    } catch (error) {
      console.log(error);
      return resolve({ done: true, code: StatusCode.InternalServerError });
    }
  });
}

app.post('/submit', urlencodedParser, validationRules, async (request, response) => {
  const errors = validationResult(request)
  let body = request.body;
  if (!errors.isEmpty()) {
    const alert = errors.array();
    return response.render('form', { alert: alert, reqBody: body, vertX: body.vertX });
  } else {
    let result = await submitForm(body);
    console.log('resultXX', result);
    switch (result.code) {
      case StatusCode.AlreadyExists:
        return response.render('already-submitted');

      case StatusCode.UnAuthorized:
        return response.render('not-eligible');

      case StatusCode.Ok:
        return response.render('success');

      case StatusCode.InternalServerError:
        return response.render('some-error');

      default:
        return response.render('some-error');
    }
  }
});