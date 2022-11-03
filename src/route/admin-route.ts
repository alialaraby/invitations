import { Request, Response, Router } from "express";
import { AdminController } from "../controller/admin-controller";
import { UserTokenHelper } from "../helper/user-token.helper";
import { BaseRoute } from "./base-route";

export class AdminRoute extends BaseRoute{
    
    constructor(
        private router: Router,
        private adminController: AdminController
    ) {
        super();

        this.router.post('/admin-login', this.adminLogin);
        this.router.post('/send-invitation', UserTokenHelper.validateJWTToken, this.sendInvitation);
        this.router.post('/submit-form', this.submitForm);
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
            let body = request.body;
            let returnedResponse = await this.adminController.submitForm(body);
            response.status(returnedResponse.statusCode).json(returnedResponse);
        } catch (error) {
            this.handleError(error, request, response);
        }
    }

}