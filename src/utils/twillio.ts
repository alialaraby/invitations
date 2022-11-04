import config from 'config';
const accountSid = config.get('twillio_sid');
const authToken = config.get('twillio_auth_token');

export class Twillio {

    public static sendInvitationLink(phone: string, message: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const client = require('twilio')(accountSid, authToken);

            client.messages
                .create({
                    from: `whatsapp:${config.get('twillio_phone')}`,
                    body: `Details: https://api.niletaxi.app/api/registration?vertX=${message}`,
                    // body: `Details: https://www.youtube.com/watch?v=Su8ui2uhipI`,
                    // body: `Details: ${message}`,
                    to: `whatsapp:+2${phone}`
                })
                .then(message => {
                    console.log(message.sid);
                    resolve(true);
                })
                .catch(error => {
                    console.log(error);
                    resolve(true);
                })
        })
    }

    public static sendQRLink(phone: string, message: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const client = require('twilio')(accountSid, authToken);

            client.messages
                .create({
                    from: `whatsapp:${config.get('twillio_phone')}`,
                    body: `Details: https://api.niletaxi.app/api/registration?phone=${phone}&vertX=${message}`,
                    // body: `Details: https://www.youtube.com/watch?v=Su8ui2uhipI`,
                    // body: `Details: ${message}`,
                    to: `whatsapp:+2${phone}`
                })
                .then(message => {
                    console.log(message.sid);
                    resolve(true);
                })
                .catch(error => {
                    console.log(error);
                    resolve(true);
                })
        })
    }
}