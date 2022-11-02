import express, { Application } from "express";
import helmet from "helmet";
import morgan from "morgan";
import compression from 'compression';
import config from 'config';

export class Config { 
    constructor(private expressApp: Application, private debug: any) {}

    public setupConfigs() { 
        this.debug('initializing app configs ...');
        
        if(!config.get('auth_key')){
            this.debug('jwt auth secret is not set');
            process.exit(1);
        }
        if(this.expressApp.get('env') === 'development'){
            this.expressApp.use(morgan('short')); // to log the incomming requests
        }
        this.expressApp.use(express.json());
        this.expressApp.use(helmet()); // to provide more security of requests headers
        this.expressApp.use(compression());
    }
}