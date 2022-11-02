import mongoose from "mongoose";
import config from 'config';

export class DbConnection {
    constructor(private debug: any) {}

    public connectToDb() {
        let options = {
            useNewUrlParser: true,
            autoIndex: true,
            useUnifiedTopology: true,
            auth: {
                username: config.get('db_username'),
                password: config.get('db_password')
            },
            authSource: 'admin'
        }

        mongoose.connect(`${config.get('db_connectionString')}`)
        .then(() => { 
            this.debug('db-connected');
        })
        .catch((error) => {
            this.debug('db-error', error);
        });
    }
}