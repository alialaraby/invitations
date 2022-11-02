import { Constants } from "../model/constant";
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport(Constants.Email_Configs);

export class EmailHelper {

    
    public static async sendOTP(email: string, OTP: string){
        try {
            let info = await transporter.sendMail({
                from: Constants.Email_Configs.auth.user,
                to: email, 
                subject: 'Verification Code',
                html: `
                <div
                  class="container"
                  style="max-width: 90%; margin: auto; padding-top: 20px"
                >
                  <h2>Nile-Taxi welcomes you.</h2>
                  <p style="margin-bottom: 30px;">Pleas enter the sign up OTP to get started</p>
                  <h1 style="font-size: 40px; letter-spacing: 2px; text-align:center;">${OTP}</h1>
             </div>
              `,
              });
              return info;
        } catch (error) {
            console.log('error', error);
            return null;
        }
    }
}