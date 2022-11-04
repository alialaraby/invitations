import { IAuthRequestTokenResponse } from "../interface/paymob-response/auth-request-token-response";
import { IOrderRegistrationResponse } from "../interface/paymob-response/order-registration-response";
import { IPaymentKeyResponse } from "../interface/paymob-response/payment-key-response";
import { Constants } from "../model/constant";

const axios = require('axios').default;

export class AxiosRequest {

    public static sendInvitationLink(phone: string, message: string): Promise<any> {
        return new Promise((resolve, reject) => {

            const Version = 'v15.0';
            const PhoneNumberId = '100878516177623';
            const Token = 'EAAWsnSTLGKQBABZCqwgAzwxQzbOnU6IYLO6KB7ZA3kmxWQPXt54ZBZAyznur9DikIbSXwe2xQZBthm3K3tzaZARZCJw3mLU8yGHz23vblG7TPfC7BZC4QpIKjil523SZBXUJXjRlIYTeCyhKgAmb0zu4VhRkL7JHthTbx6ZCmUdiM3vzHwIQHvT7Q9QuNCpGMBw72jSBe6noqZAom2ZApFc5mbJxrCieKxtqFXIZD';

            const config = {
                headers: { Authorization: `Bearer ${Token}` }
            };

            axios.post(`https://graph.facebook.com/${Version}/${PhoneNumberId}/messages`,
                {
                    "messaging_product": "whatsapp",
                    "to": `2${phone}`,
                    "text": {
                        "preview_url": true,
                        "body": `Details: h-ttp://143.198.148.87:82/api/open-form?vertX=${message}`
                    }
                },
                config
            )
                .then(function (response: any) {
                    resolve(response);
                })
                .catch(function (error) {
                    reject(error);
                });
        })
    }

    public static sendQRLink(phone: string, message: string): Promise<any> {
        return new Promise((resolve, reject) => {

            const Version = 'v15.0';
            const PhoneNumberId = '100878516177623';
            const Token = 'EAAWsnSTLGKQBABZCqwgAzwxQzbOnU6IYLO6KB7ZA3kmxWQPXt54ZBZAyznur9DikIbSXwe2xQZBthm3K3tzaZARZCJw3mLU8yGHz23vblG7TPfC7BZC4QpIKjil523SZBXUJXjRlIYTeCyhKgAmb0zu4VhRkL7JHthTbx6ZCmUdiM3vzHwIQHvT7Q9QuNCpGMBw72jSBe6noqZAom2ZApFc5mbJxrCieKxtqFXIZD';

            const config = {
                headers: { Authorization: `Bearer ${Token}` }
            };

            axios.post(`https://graph.facebook.com/${Version}/${PhoneNumberId}/messages`,
                {
                    "messaging_product": "whatsapp",
                    "to": `2${phone}`,
                    "text": {
                        "preview_url": true,
                        "body": `Details: h-ttp://143.198.148.87:82/api/open-qr-code?phone=${phone}&vertX=${message}`
                    }
                },
                config
            )
                .then(function (response: any) {
                    resolve(response);
                })
                .catch(function (error) {
                    reject(error);
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