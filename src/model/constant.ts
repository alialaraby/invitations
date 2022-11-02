import config from 'config';

export class Constants {

    public static JWT_Expires_In = '1d';
    public static OTP_Time_Minutes = 2;
    public static OTP_Length = 6;
    public static Private_Trip_Min_Number_Of_Seats = 5;
    public static Pooling_Trip_Min_Number_Of_Seats = 2;
    public static OTP_Configs = {
        upperCaseAlphabets: true,
        specialChars: false,
    };
    public static Email_Configs = {
        service: 'gmail',
        auth: {
            user: config.get('mailer_email'),
            pass: config.get('mailer_password'),
        },
    }
    public static MERCHANT_API_KEY = 'ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SndjbTltYVd4bFgzQnJJam94T0N3aVkyeGhjM01pT2lKTlpYSmphR0Z1ZENJc0ltNWhiV1VpT2lKcGJtbDBhV0ZzSW4wLnFOLVZWUTFPSFhFNDVHMG83ZDBydGQtSzk5Y3ROdHd4UXI0czZQazJoU3g2d2x4ZUJ4aXZFNVdhT2lrSlotU0RTLTI2V3NOMjFQaW53VW52UEhEeHZB';
    public static CARD_PAYMENT_INTEGRATION_ID = 2856906;
    public static IFRAME_ID = '168358';
    
}