import otpGenerator from "otp-generator";
import { Constants } from "../model/constant";

export class OTPHelper {

    public static generateOTP(){
        return otpGenerator.generate(Constants.OTP_Length, Constants.OTP_Configs);
    }
}