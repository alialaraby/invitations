var gcm = require('node-gcm');
import config from 'config';
var FCM = require('fcm-node');
var fcm = new FCM(config.get('fcm_key'));


export class NotificationSender {

    public static sendN(){
        var sender = new gcm.Sender('BBjMRQIMkGJ_DZdE2Yx4awRDQz9LycZ9UQZ5nBRGFJY-nzQHO_v7woiVpyCpmktSWWDLhQTiPi9gp3SRNqjSnVE');

        var message = new gcm.Message({
            data: { key1: 'msg1' }
        });
        var regTokens = ['BBjMRQIMkGJ_DZdE2Yx4awRDQz9LycZ9UQZ5nBRGFJY-nzQHO_v7woiVpyCpmktSWWDLhQTiPi9gp3SRNqjSnVE'];

        sender.send(message, { registrationTokens: regTokens }, function (err, response) {
            if (err) console.error('NNerr', err);
            else console.log('NNresponse', response);
        });
    }

    public static sendTest(){
        
        var fcm = new FCM('AAAA8XB3pzk:APA91bHesa1FHbDKI9NDxv1rpbU4MgRYCvrAr-EIZH0kq5EF_hTogq8Ndl7gCKObW8JFwmlTGCrmkNSMOmRMyiQKKF7N9XTZjTAHu754eOn69AjjkxN6AuD_RMO-HO8rge3LL5lFN0nf');
        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: 'f19tBYSJTiOMfk-SlI5-vE:APA91bGH-4Kd0tWkHxRXB4mZUFJpEgLiDDRCDMxmYUaLakaDq2nLZpWkXDhV9wEpuwOK45CSYrevF4IfcurdqNLlttxQgZDkYFi3SutulIK6CZogt9Er8dk-hSCjm83PuyAatDHCT6JT', 
            
            notification: {
                title: 'Hello Haweilllllllllllllllllllllllllll', 
                body: 'Body of your push notification' 
            }
        };
        
        fcm.send(message, function(err, response){
            if (err) {
                console.log("Something has gone wrong!", err);
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });
    }

    // public static sendPassengerWelcome(token: string, userId: string): Promise<any>{
    //     return new Promise(async (resolve, reject) => {
    //         var message = {
    //             to: token, 
                
    //             notification: {
    //                 title: 'Welcome to Nile Taxi', 
    //                 body: 'Enjoy your trips with a Nile view' 
    //             }
    //         };
            
    //         let userNotification = new UserNotification();
    //         userNotification.title = message.notification.title;
    //         userNotification.body = message.notification.body;
    //         userNotification.userId = userId;


    //         fcm.send(message, async function(err, response){
    //             if (err) {
    //                 console.log("Something has gone wrong!", err);
    //                 return reject(err);
    //             } else {
    //                 console.log("Successfully sent with response: ", response);
    //                 await userNotification.save();

    //                 return resolve(response);
    //             }
    //         });
    //     })
    // }

    // public static sendTripCancelledByPilot(tokens: string[], userIds: string[], tripCode: string): Promise<any>{
    //     return new Promise(async (resolve, reject) => {
    //         var message = {
    //             registrationTokens: tokens, 
                
    //             notification: {
    //                 title: 'Your trip was cancelled', 
    //                 body: `Your trip (${tripCode}) was cancelled by the pilot for unexpected reasons` 
    //             }
    //         };
            
    //         let userNotification = new UserNotification();
    //         userNotification.title = message.notification.title;
    //         userNotification.body = message.notification.body;
    //         userNotification.userIds = userIds;
    //         await userNotification.save();

    //         fcm.send(message, async function(err, response){
    //             if (err) {
    //                 console.log("Something has gone wrong!", err);
    //                 return reject(err);
    //             } else {
    //                 console.log("Successfully sent with response: ", response);
    //                 return resolve(response);
    //             }
    //         });
    //     })
    // }

    // public static sendTripStatusChangedByPilot(
    //     tokens: string[], 
    //     userIds: string[],
    //     title: string,
    //     body: string,
    // ): Promise<any>{
    //     return new Promise(async (resolve, reject) => {
    //         var message = {
    //             registrationTokens: tokens, 
    //             notification: { title: title, body: body }
    //         };
            
    //         let userNotification = new UserNotification();
    //         userNotification.title = message.notification.title;
    //         userNotification.body = message.notification.body;
    //         userNotification.userIds = userIds;
    //         await userNotification.save();

    //         fcm.send(message, async function(err, response){
    //             if (err) {
    //                 console.log("Something has gone wrong!", err);
    //                 return reject(err);
    //             } else {
    //                 console.log("Successfully sent with response: ", response);
    //                 return resolve(response);
    //             }
    //         });
    //     })
    // }

    // public static sendTripRequestStatusChanged(
    //     token: string, 
    //     userId: string,
    //     title: string,
    //     body: string,
    //     status: string
    // ): Promise<any>{
    //     return new Promise(async (resolve, reject) => {
    //         var message = {
    //             registrationTokens: [token], 
    //             notification: { title: title, body: body }
    //         };
            
    //         let userNotification = new UserNotification();
    //         userNotification.title = message.notification.title;
    //         userNotification.body = message.notification.body;
    //         userNotification.userId = userId;
    //         await userNotification.save();

    //         fcm.send(message, async function(err, response){
    //             if (err) {
    //                 console.log("Something has gone wrong!", err);
    //                 return reject(err);
    //             } else {
    //                 console.log("Successfully sent with response: ", response);
    //                 return resolve(response);
    //             }
    //         });
    //     })
    // }

    // public static sendBoatNeedsMaintenance(token: string, userId: string, boatName: string): Promise<any>{
    //     return new Promise(async (resolve, reject) => {
    //         var message = {
    //             to: token, 
    //             notification: { title: "System Notification", body: `Your boat - ${boatName} - requires maintenance` }
    //         };
            
    //         let userNotification = new UserNotification();
    //         userNotification.title = message.notification.title;
    //         userNotification.body = message.notification.body;
    //         userNotification.userId = userId;
    //         await userNotification.save();

    //         fcm.send(message, async function(err, response){
    //             if (err) {
    //                 console.log("Something has gone wrong!", err);
    //                 return reject(err);
    //             } else {
    //                 console.log("Successfully sent with response: ", response);
    //                 return resolve(response);
    //             }
    //         });
    //     })
    // }

    // public static sendPassengerBulkNotification(tokens: string[], userIds: string[], title: string, body: string): Promise<any>{
    //     return new Promise(async (resolve, reject) => {
    //         var message = {
    //             registration_ids: tokens,
                
    //             notification: {
    //                 title: title, 
    //                 body: body 
    //             }
    //         };
            
    //         let userNotification = new UserNotification();
    //         userNotification.title = message.notification.title;
    //         userNotification.body = message.notification.body;
    //         userNotification.userIds = userIds;

    //         fcm.send(message, async function(err, response){
    //             if (err) {
    //                 console.log("Something has gone wrong!", err);
    //                 return reject(err);
    //             } else {
    //                 console.log("Successfully sent with response: ", response);
    //                 await userNotification.save();

    //                 return resolve(response);
    //             }
    //         });
    //     })
    // }

}