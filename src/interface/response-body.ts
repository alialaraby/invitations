export interface IResponseBody{
    message: string;
    statusCode: number;
    items?: any[];
    item?: any;
    count?: number;
    acceccToken?: string;
    OTP?: string;
    iFrame?: string;
    invalidMembers?: any[];
    totalRegistrations?: number;
    qrsSent?: number;
    totalAttendents?: number;

}