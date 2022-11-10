import express from 'express';
import { Config } from './startup/config';
import { CORS } from './startup/cors';
import { DbConnection } from './startup/db';
import { PortSetup } from './startup/port';
import { RouteSetup } from './startup/route';
import path from 'path';
import { StatusCode } from './enums/request-response-enums';
import { PasswordHelper } from './helper/password';
import User, { IUser } from './model/user';

const { check, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const validationRules = [
  check('fullName', 'Full name is required').not().isEmpty().trim(),
  check('phone', 'Phone is required').not().isEmpty().trim(),
  check('email', 'Email is required').not().isEmpty().trim(),
  check('company', 'Company is required').not().isEmpty().trim(),
  check('sector', 'Business Category is required').not().isEmpty().trim(),
  check('title', 'Title is required').not().isEmpty().trim(),
  check('vertX', '').not().isEmpty(),
];

const validationRulesManual = [
  check('fullName', 'Full name is required').not().isEmpty().trim(),
  check('phone', 'Phone is required').not().isEmpty().trim(),
  check('email', 'Email is required').not().isEmpty().trim(),
  check('company', 'Company is required').not().isEmpty().trim(),
  check('sector', 'Business Category is required').not().isEmpty().trim(),
  check('title', 'Title is required').not().isEmpty().trim(),
];

const debug = require('debug')('app:all'); // condotional log, choose to show these log or not from env
const app = express();
const router = express.Router();

app.use('/ftp', express.static(path.join(__dirname, 'files')));
app.use(express.static(path.join(__dirname, 'files')));
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

function submitFormManual(request: any): Promise<{ done: boolean, code: any }> {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await User.findOne({ phone: request.phone.trim().toLowerCase() });
      if (user && user.submittedRegistration) {
        return resolve({
          done: false,
          code: StatusCode.AlreadyExists
        });
      }

      if (!user) {
        return resolve({
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
      return resolve({ done: true, code: StatusCode.InternalServerError });
    }
  });
}

app.post('/submit-manual', urlencodedParser, validationRulesManual, async (request, response) => {
  const errors = validationResult(request)
  let body = request.body;
  if (!errors.isEmpty()) {
    const alert = errors.array();
    return response.render('form', { alert: alert, reqBody: body, vertX: body.vertX });
  } else {
    let result = await submitFormManual(body);
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

// app.post('/api/export', urlencodedParser, async (request, response) => {
  
//   const excelJS = require("exceljs");

//   let body = request.body;
//   let type = body.type;

//   let users: IUser[] = [];
//   if(type == 'sentRegistration'){
//     users = await User.find({ $and: [{ submittedRegistration: false, adminSentQR: false, attendedEvent: false }] })
//   }else if(type == 'registered'){
//     users = await User.find({ $and: [{ submittedRegistration: true }] })
//   }else if(type == 'sentQr'){
//     users = await User.find({ $and: [{ adminSentQR: true }] })
//   }else if(type == 'attendedEvent'){
//     users = await User.find({ $and: [{ attendedEvent: true }] })
//   }else if(type == 'vip'){
//     users = await User.find({ $and: [{ isVip: true }] })
//   }else{
//     users = await User.find({})
//   }

//   console.log(users.length);
//   const path = "./files";

//   const workbook = new excelJS.Workbook();
//   const worksheet = workbook.addWorksheet("Users");
//   worksheet.addRow(['Phone', 'Full name', 'Email', 'Company', 'Title', 'Business Category', 'TitleRegistered', 'QR Sent', 'Attended Event', 'Vip']);

//   for (let i = 0; i < users.length; i++) {                
//     worksheet.addRow([
//       users[i].phone,
//       users[i].fullName,
//       users[i].email,
//       users[i].company,
//       users[i].title,
//       users[i].sector,
//       users[i].submittedRegistration,
//       users[i].adminSentQR,
//       users[i].attendedEvent,
//       users[i].isVip,
//     ]);
//   }
  
//   let url = `./public/Users_${type}.xlsx`;
//   const data = await workbook.xlsx.writeFile(url);

//   return response.status(200).send({
//       message: "exported",
//       item: `https://api.events.shiragroup.com/Users_${type}.xlsx`,
//   });

// });