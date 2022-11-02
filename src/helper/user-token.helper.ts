import config from 'config';
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { AdminDao } from "../DAO/admin.dao";
import { StatusCode } from "../enums/request-response-enums";
import { IUserPayload } from "../interface/user-payload";
import { Constants } from "../model/constant";

//ToDo: continue later
export class UserTokenHelper {

    private static adminDao: AdminDao = new AdminDao();

    constructor(private debug: any) { }

    public static createJWTToken(userPayload: IUserPayload) {
        const token = jwt.sign(userPayload, config.get('auth_key'), {
            algorithm: 'HS256',
            expiresIn: Constants.JWT_Expires_In
        });

        return token;
    }

    public static async validateJWTToken(request: Request, response: Response, next) {
        try {
            let token = UserTokenHelper.extractJWTTokenFromHeader(request);
            if (token) {
                const decoddedUser = UserTokenHelper.verifyJWTToken(token);
                if(decoddedUser){
                    let user = await UserTokenHelper.adminDao.getAdminById(decoddedUser['_id']);
                    if(user && user.email == decoddedUser['email'] && user.accessToken == token){
                        next();
                    }else{
                        return response.status(StatusCode.UnAuthorized).json({
                            message: 'Unauthorized',
                            statusCode: StatusCode.UnAuthorized
                        });
                    }
                }else{
                    return response.status(StatusCode.UnAuthorized).json({
                        message: 'Unauthorized',
                        statusCode: StatusCode.UnAuthorized
                    });
                }
            }else{
                return response.status(StatusCode.UnAuthorized).json({
                    message: 'Unauthorized',
                    statusCode: StatusCode.UnAuthorized
                });
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    private static extractJWTTokenFromHeader(request: Request) {
        if (request.headers.authorization)
            return request.headers.authorization.split(' ')[1] || request.query.token || request.headers["x-access-token"];
        else
            return null;
    }

    private static verifyJWTToken(token: any) {
        try {
            return jwt.verify(token, config.get('auth_key'), { algorithms: ['HS256'] });
        } catch (error) {
            return null;
        }
    }

    public static getPayloadFromBearerToken(request: Request) {
        try {
            let decoddedUser = null;
            let token = UserTokenHelper.extractJWTTokenFromHeader(request);
            if (token) {
                decoddedUser = UserTokenHelper.verifyJWTToken(token);
            }
            return decoddedUser;
        } catch (error) {
            throw new Error(error);
        }
    }

}