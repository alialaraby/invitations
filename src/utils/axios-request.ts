import { IAuthRequestTokenResponse } from "../interface/paymob-response/auth-request-token-response";
import { IOrderRegistrationResponse } from "../interface/paymob-response/order-registration-response";
import { IPaymentKeyResponse } from "../interface/paymob-response/payment-key-response";
import { Constants } from "../model/constant";

const axios = require('axios').default;
const Version = 'v15.0';
// const PhoneNumberId = '100878516177623';// test
const PhoneNumberId = '101900492740832';// live
const Token = 'EAAWsnSTLGKQBAAafhdJcUPrVMeMaDkoZC9ThKLjdOY6VkI9GQZCsUgt5usbOkcPLPen4vyBnZBPW7dRLVK0pECuTCltabGqvHNJslDOkNTswcALaX8WgyE6qVnPVor0x4NYVVPiIVDiGO1oB0ZBI5WEqxao1ki78HVlGZAPrcnhmi9UurfsJdp8ceHiCshFOCZAfyF7oJHZCAZDZD';

export class AxiosRequest {

    public static sendInvitationLink(phone: string, message: string): Promise<boolean> {
        return new Promise((resolve, reject) => {

            const config = {
                headers: { Authorization: `Bearer ${Token}` }
            };

            axios.post(`https://graph.facebook.com/${Version}/${PhoneNumberId}/messages`,
                { 
                    "messaging_product": "whatsapp", 
                    "recipient_type": "individual",
                    "to": `2${phone}`, 
                    "type": "template", 
                    "template": {
                        "name": "invitation_template3",
                        "language": {
                            "code": "en"
                        }, 
                        "components": [{
                            "type": "button",
                            "sub_type": "url",
                            "index": 0,
                            "parameters": [
                                {
                                    "type": "payload",
                                    "payload": `open-form?vertX=${message}`
                                }
                            ]
                        }]
                    }
                },
                config
            )
                .then(function (response: any) {
                    resolve(true);
                })
                .catch(function (error) {
                    resolve(false);
                });
        })
    }

    public static sendQRLink(phone: string, message: string): Promise<boolean> {
        return new Promise((resolve, reject) => {

            const config = {
                headers: { Authorization: `Bearer ${Token}` }
            };

            axios.post(`https://graph.facebook.com/${Version}/${PhoneNumberId}/messages`,
                { 
                    "messaging_product": "whatsapp", 
                    "recipient_type": "individual",
                    "to": `2${phone}`, 
                    "type": "template", 
                    "template": {
                        "name": "invitation_qr2",
                        "language": {
                            "code": "en"
                        }, 
                        "components": [{
                            "type": "button",
                            "sub_type": "url",
                            "index": 0,
                            "parameters": [
                                {
                                    "type": "payload",
                                    "payload": `open-qr-code?phone=${phone}&vertX=${message}`
                                }
                            ]
                        }]
                    }
                },
                config
            )
                .then(function (response: any) {
                    resolve(true);
                })
                .catch(function (error) {
                    resolve(false);
                });
        })
    }

    public static getAuthRequestToken(): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.post(
                'https://accept.paymobsolutions.com/api/auth/tokens',
                { api_key: Constants.MERCHANT_API_KEY }
            )
                .then(function (response: any) {
                    resolve(response);
                })
                .catch(function (error) {
                    reject(error);
                });
        })
    }

    public static registerOrder(authToken: string, amountCents: number, tripId: string, noOfSeats: number): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.post(
                'https://accept.paymobsolutions.com/api/ecommerce/orders',
                {
                    "auth_token": authToken,
                    "delivery_needed": "false",
                    "amount_cents": amountCents.toString(),
                    "currency": "EGP",
                    "items": [
                        {
                            "name": tripId,
                            "amount_cents": amountCents.toString(),
                            "description": tripId,
                            "quantity": noOfSeats.toString()
                        }
                    ]
                }
            )
                .then(function (response: any) {
                    resolve(response);
                })
                .catch(function (error) {
                    reject(error);
                });
        })
    }

    // public static getPaymentKey(authToken: string, amountCents: number, orderId: string, passenger: IPassenger): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         axios.post(
    //             'https://accept.paymobsolutions.com/api/acceptance/payment_keys',
    //             {
    //                 "auth_token": authToken,
    //                 "amount_cents": amountCents.toString(),
    //                 "expiration": 3600,
    //                 "order_id": orderId,
    //                 "billing_data": {
    //                     "apartment": "online_payment", 
    //                     "floor": "online_payment", 
    //                     "street": "online_payment", 
    //                     "building": "online_payment", 
    //                     "email": passenger.email, 
    //                     "first_name": passenger.fullName, 
    //                     "phone_number": passenger.phone, 
    //                     "last_name": passenger.fullName, 
    //                     "shipping_method": "online_payment", 
    //                     "postal_code": "online_payment", 
    //                     "city": "online_payment", 
    //                     "country": "online_payment", 
    //                     "state": "online_payment"
    //                 },
    //                 "currency": "EGP", 
    //                 "integration_id": Constants.CARD_PAYMENT_INTEGRATION_ID,
    //                 "lock_order_when_paid": "false"
    //             }
    //         )
    //         .then(function (response: any) {
    //             resolve(response);
    //         })
    //         .catch(function (error) {
    //             reject(error);
    //         });
    //     })
    // }
}