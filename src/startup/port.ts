import { Application } from "express";
import config from 'config';

export class PortSetup {

    constructor(private expressApp: Application, private debug: any) {}

    public setupPort() {
        let port = config.get('port') || 4000;
        // this.expressApp.use(timeout(2147483647));
        // app.listen(process.env.PORT, '0.0.0.0', () => { // to let other devices on same network to connect to localhost:3000 
        // this converts localhost from http://127.0.0.0 to 0.0.0.0, now others can connect with http://their_ip:3000 
        this.expressApp.listen(port, () => { 
            this.debug(`App listening on port ${port}`);
        });
    }
}