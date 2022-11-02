import { Application } from "express";
import cors from "cors";

export class CORS {
    constructor(private expressApp: Application) { }

    public setupCORS() {
        this.expressApp.use(cors());
        this.expressApp.options('*', cors());
        this.expressApp.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'true');
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            next();
        });
    }
}