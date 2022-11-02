import { Request, Response } from "express";
import { Error } from "mongoose";
import { StatusCode } from "../enums/request-response-enums";

export class BaseRoute {
    constructor() {}

    protected handleError(error: any, request: Request, response: Response){
        if(error instanceof Error.ValidationError){
            response.status(StatusCode.BadRequest).json({
                message: 'Validation Error',
                statusCode: StatusCode.BadRequest,
                error: error?.message || ''
            });
        }else{
            response.status(StatusCode.InternalServerError).json({
                message: 'Internal Server Error',
                statusCode: StatusCode.InternalServerError,
                error: error?.message || ''
            });
        }
    }
}