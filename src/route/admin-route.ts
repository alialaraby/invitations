import { Request, Response, Router } from "express";
import { AdminController } from "../controller/admin-controller";
import { PasswordHelper } from "../helper/password";
import { UserTokenHelper } from "../helper/user-token.helper";
import User from "../model/user";
import { BaseRoute } from "./base-route";
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

export class AdminRoute extends BaseRoute{
    
    constructor(
        private router: Router,
        private adminController: AdminController
    ) {
        super();

        this.router.post('/admin-login', this.adminLogin);
        
        this.router.post('/get-users', UserTokenHelper.validateJWTToken, this.getUsers);
        this.router.post('/get-statistics', UserTokenHelper.validateJWTToken, this.getStatistics);
        
        this.router.post('/send-invitation', UserTokenHelper.validateJWTToken, this.sendInvitation);
        this.router.post('/send-qr-code', UserTokenHelper.validateJWTToken, this.sendQRCode);

        this.router.get('/open-form', this.openForm);
        this.router.get('/open-qr-code', this.openQRCode);
        
        this.router.post('/submit-form', urlencodedParser, validationRules, this.submitForm);
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

    public submitForm = async (request: Request, response: Response) => {
        try {
            const errors = validationResult(request)
            let body = request.body;
            console.log('request.bodyXX', request.body);

            if(!errors.isEmpty()) {
                const alert = errors.array();
                return response.render('form', { alert: alert, reqBody: body, vertX: body.vertX });
            }else{
                let result = await this.adminController.submitForm(body);
                if(result && result.statusCode == 200){
                    return response.render('success');
                }else{
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
            if(!phone || !hashedPhone){
                return response.render('invalid-qr');
            }
            
            let user = await User.findOne({ phone: phone.trim().toLowerCase() });
            if(!user) return response.render('invalid-qr');

            let validUser = await PasswordHelper.comparePassword(user.phone, hashedPhone);
            if(!validUser) return response.render('invalid-qr');

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
            if(!hashedPhone){
                return response.render('invalid-form');
            }

            return response.render('form', {vertX: hashedPhone});
        } catch (error) {
            this.handleError(error, request, response);
        }
    }

}