import { Request, Response, Router } from "express";
import { AdminController } from "../controller/admin-controller";
import { StatusCode } from "../enums/request-response-enums";
import { PasswordHelper } from "../helper/password";
import { UserTokenHelper } from "../helper/user-token.helper";
import User, { IUser } from "../model/user";
import { BaseRoute } from "./base-route";
const { check, validationResult } = require('express-validator');
const bodyParser = require('body-parser');
import path from 'path';
var shortUrl = require("node-url-shortener");

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

export class AdminRoute extends BaseRoute {

    constructor(
        private router: Router,
        private adminController: AdminController
    ) {
        super();

        this.router.post('/admin-login', this.adminLogin);

        this.router.post('/get-users', this.getUsers);
        this.router.post('/get-admins', this.getAdmins);
        this.router.post('/reset-admin-password', this.resetAdminPassword);
        this.router.post('/get-statistics', this.getStatistics);

        this.router.post('/send-invitation', this.sendInvitation);
        this.router.post('/send-invitation-vip', this.sendInvitationVip);
        this.router.post('/send-qr-code', this.sendQRCode);

        this.router.get('/open-form', this.openForm);
        this.router.get('/open-form-m', this.openFormManual);
        this.router.post('/submit-form', urlencodedParser, validationRules, this.submitForm);
        
        this.router.get('/open-qr-code', this.openQRCode);
        this.router.post('/confirm-qr-code', this.confirmQRCode);

        this.router.post('/export', this.exportExcell);
        this.router.post('/get-short-url', this.getShortUrl);

    }

    public getShortUrl = async (request: Request, response: Response) => {
        try {

            shortUrl.short(request.body.url, function (err, url) {
                if(err){
                    return response.status(200).json({message: 'no url provided'});
                }
                return response.status(200).json({message: 'done', url: url});
            });

        } catch (error) {
            this.handleError(error, request, response);
        }
    }

    public adminLogin = async (request: Request, response: Response) => {
        try {
            let body = request.body;
            let returnedResponse = await this.adminController.adminLogin(body);
            response.status(returnedResponse.statusCode).json(returnedResponse);
        } catch (error) {
            this.handleError(error, request, response);
        }
    }

    public sendInvitation = async (request: Request, response: Response) => {
        try {
            let body = request.body;
            let returnedResponse = await this.adminController.sendInvitationLink(body);
            response.status(returnedResponse.statusCode).json(returnedResponse);
        } catch (error) {
            this.handleError(error, request, response);
        }
    }

    public sendInvitationVip = async (request: Request, response: Response) => {
        try {
            let body = request.body;
            let returnedResponse = await this.adminController.sendInvitationVip(body);
            response.status(returnedResponse.statusCode).json(returnedResponse);
        } catch (error) {
            this.handleError(error, request, response);
        }
    }

    public submitForm = async (request: Request, response: Response) => {
        try {
            const errors = validationResult(request)
            let body = request.body;
            

            if (!errors.isEmpty()) {
                const alert = errors.array();
                return response.render('form', { alert: alert, reqBody: body, vertX: body.vertX });
            } else {
                let result = await this.adminController.submitForm(body);
                if (result && result.statusCode == 200) {
                    return response.render('success');
                } else {
                    return response.render('some-error');
                }
            }
        } catch (error) {
            this.handleError(error, request, response);
        }
    }

    public getUsers = async (request: Request, response: Response) => {
        try {
            let body = request.body;
            let returnedResponse = await this.adminController.getUsers(body);
            response.status(returnedResponse.statusCode).json(returnedResponse);
        } catch (error) {
            this.handleError(error, request, response);
        }
    }

    public getAdmins = async (request: Request, response: Response) => {
        try {
            let body = request.body;
            let returnedResponse = await this.adminController.getAdmins(body);
            response.status(returnedResponse.statusCode).json(returnedResponse);
        } catch (error) {
            this.handleError(error, request, response);
        }
    }

    public resetAdminPassword = async (request: Request, response: Response) => {
        try {
            let body = request.body;
            let returnedResponse = await this.adminController.resetAdminPassword(body);
            response.status(returnedResponse.statusCode).json(returnedResponse);
        } catch (error) {
            this.handleError(error, request, response);
        }
    }

    public getStatistics = async (request: Request, response: Response) => {
        try {
            let body = request.body;
            let returnedResponse = await this.adminController.getStatistics(body);
            response.status(returnedResponse.statusCode).json(returnedResponse);
        } catch (error) {
            this.handleError(error, request, response);
        }
    }

    public sendQRCode = async (request: Request, response: Response) => {
        try {
            let body = request.body;
            let returnedResponse = await this.adminController.sendQRCode(body);
            response.status(returnedResponse.statusCode).json(returnedResponse);
        } catch (error) {
            this.handleError(error, request, response);
        }
    }

    public openQRCode = async (request: Request, response: Response) => {
        try {
            let phone: string = request.query['phone'] as string;
            let hashedPhone: string = request.query['vertX'] as string;
            if (!phone || !hashedPhone) {
                return response.render('invalid-qr');
            }

            let user = await User.findOne({ phone: phone.trim().toLowerCase() });
            if (!user) return response.render('invalid-qr');
            
            if (user && !user.adminSentQR) return response.render('invalid-qr');

            let validUser = await PasswordHelper.comparePassword(user.phone, hashedPhone);
            if (!validUser) return response.render('invalid-qr');

            var QRCode = require('qrcode');
            let qrData = `${user.phone}*--*${hashedPhone}`;
            var opts = {
                errorCorrectionLevel: 'H',
                type: 'image/jpeg'
            }
            QRCode.toDataURL(qrData, opts, function (err, url) {
                return response.render('qr', { qr: url });
            });
        } catch (error) {
            this.handleError(error, request, response);
        }
    }

    public openForm = async (request: Request, response: Response) => {
        try {
            let hashedPhone: string = request.query['vertX'] as string;
            if (!hashedPhone) {
                return response.render('invalid-form');
            }

            return response.render('form', { vertX: hashedPhone });
        } catch (error) {
            this.handleError(error, request, response);
        }
    }

    public openFormManual = async (request: Request, response: Response) => {
        try {
            return response.render('form-manual');
        } catch (error) {
            this.handleError(error, request, response);
        }
    }

    public confirmQRCode = async (request: Request, response: Response) => {
        try {
            let body = request.body;
            let phone: string = body['phone'] as string;
            let hashedPhone: string = body['hashedPhone'] as string;

            if (!phone || !hashedPhone) {
                return response.status(StatusCode.Ok).json({
                    message: "There's something wrong with your invitaion",
                    statusCode: StatusCode.NotFound
                });
            }

            let user = await User.findOne({ phone: phone.trim().toLowerCase() });
            if (!user) {
                return response.status(StatusCode.Ok).json({
                    message: "There's something wrong with your invitaion",
                    statusCode: StatusCode.NotFound
                });
            }

            let validUser = await PasswordHelper.comparePassword(user.phone, hashedPhone);
            if (!validUser) {
                return response.status(StatusCode.Ok).json({
                    message: "There's something wrong with your invitaion",
                    statusCode: StatusCode.NotFound
                });
            }

            if (user.attendedEvent) {
                return response.status(StatusCode.Ok).json({
                    message: "User already confirmed attendance.",
                    statusCode: StatusCode.AlreadyExists
                });
            }

            user.attendedEvent = true;
            await user.save();

            return response.status(StatusCode.Ok).json({
                message: "Valid invitation, user confirmed attendance.",
                statusCode: StatusCode.Ok
            });
        } catch (error) {
            this.handleError(error, request, response);
        }
    }

    public exportExcell = async (request: Request, response: Response) => {
        try {
            const excelJS = require("exceljs");

            let body = request.body;
            let type = body.type;

            let users: IUser[] = [];
            if(type == 'sentRegistration'){
                users = await User.find({ $and: [{ submittedRegistration: false, adminSentQR: false, attendedEvent: false }] })
            }else if(type == 'registered'){
                users = await User.find({ $and: [{ submittedRegistration: true }] })
            }else if(type == 'sentQr'){
                users = await User.find({ $and: [{ adminSentQR: true }] })
            }else if(type == 'attendedEvent'){
                users = await User.find({ $and: [{ attendedEvent: true }] })
            }else if(type == 'vip'){
                users = await User.find({ $and: [{ isVip: true }] })
            }else{
                users = await User.find({})
            }

            console.log(users.length);
            const filePath = path.join(__dirname, 'files');

            const workbook = new excelJS.Workbook();
            const worksheet = workbook.addWorksheet("Users");
            worksheet.addRow(['Phone', 'Full name', 'Email', 'Company', 'Title', 'Business Category', 'TitleRegistered', 'QR Sent', 'Attended Event', 'Vip']);

            for (let i = 0; i < users.length; i++) {                
                worksheet.addRow([
                    users[i].phone,
                    users[i].fullName,
                    users[i].email,
                    users[i].company,
                    users[i].title,
                    users[i].sector,
                    users[i].submittedRegistration,
                    users[i].adminSentQR,
                    users[i].attendedEvent,
                    users[i].isVip,
                ]);
            }
            
            let url = `/root/invitations/dist/files/Users_${type}.xlsx`;
            const data = await workbook.xlsx.writeFile(url);

            return response.status(200).send({
                message: "exported",
                item: `https://api.events.shiragroup.com/Users_${type}.xlsx`,
            });
        } catch (error) {
            console.log(error);
            
            this.handleError(error, request, response);
        }
    }

}