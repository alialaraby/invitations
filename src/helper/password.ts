const bcrypt = require('bcrypt');
import config from 'config';

export class PasswordHelper {

    public static hashPassword(password: string): Promise<string>{
        return new Promise<string>(async (resolve, reject) => {
            try {
                let hash: string = await bcrypt.hash(password, +config.get('salt_rounds'));
                resolve(hash);
            } catch (error) {
                reject(error);   
            }
        });
    }

    public static comparePassword(password: string, hashedPassword: string): Promise<boolean>{
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                let result: boolean = await bcrypt.compare(password, hashedPassword);
                resolve(result);
            } catch (error) {
                reject(error);   
            }
        });
    }

}