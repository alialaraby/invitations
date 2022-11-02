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
        // this.router.post('/add-admin', UserTokenHelper.validateJWTToken, this.addAdmin);
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

}