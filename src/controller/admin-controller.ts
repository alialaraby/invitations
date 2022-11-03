import { AdminDao } from "../DAO/admin.dao";
import { StatusCode } from "../enums/request-response-enums";
import { PasswordHelper } from "../helper/password";
import { UserTokenHelper } from "../helper/user-token.helper";
import { IAdminLogin } from "../interface/request-body/admin/admin-login";
import { ISendInvitation } from "../interface/request-body/admin/send-invitation";
import { ISubmitForm } from "../interface/request-body/admin/submit-registration";
import { IResponseBody } from "../interface/response-body";
import { IUserPayload } from "../interface/user-payload";
import User from "../model/user";
import { Twillio } from "../utils/twillio";

export class AdminController {

    constructor(
        private adminDao: AdminDao,
    ) { }

    public adminLogin(request: IAdminLogin): Promise<IResponseBody> {
        return new Promise(async (resolve, reject) => {
            try {

                let admin = await this.adminDao.getAdminByEmail(request.email);
                if (!admin) {
                    return resolve({
                        message: 'Admin not found',
                        statusCode: StatusCode.NotFound
                    });
                }
                let adminAuthed = await PasswordHelper.comparePassword(request.password, admin.password);
                if (adminAuthed) {
                    let payload: IUserPayload = {
                        _id: admin._id,
                        email: admin.email
                    };
                    let accessToken = UserTokenHelper.createJWTToken(payload);
                    admin.accessToken = accessToken;
                    await admin.save();
                }

                return resolve({
                    message: 'Done',
                    statusCode: StatusCode.Ok,
                    item: admin
                });
            } catch (error) {
                reject(error)
            }
        });
    }

    public sendInvitationLink(request: ISendInvitation): Promise<IResponseBody> {
        return new Promise(async (resolve, reject) => {
            try {

                let phones = request.phones;
                for (let i = 0; i < phones.length; i++) {
                    let exists = await this.adminDao.getUserByPhone(phones[i]);
                    if(!exists){
                        let hashedPhone = await PasswordHelper.hashPassword(phones[i]);

                        let addedUser = new User();
                        addedUser.phone = phones[i];
                        addedUser.invitationLink = request.invitationLink;
                        addedUser.hashedPhone = hashedPhone;
                        await addedUser.save();
        
                        // await Twillio.sendInvitationLink(phones[i], `${request.invitationLink}?${hashedPhone}`);
                        await Twillio.sendInvitationLink(phones[i], hashedPhone);
                    }
                }

                return resolve({
                    message: 'Done',
                    statusCode: StatusCode.Ok
                });
            } catch (error) {
                reject(error)
            }
        });
    }

    public submitForm(request: ISubmitForm): Promise<IResponseBody> {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await this.adminDao.getUserByPhone(request.phone);
                if(user && user.submittedRegistration){
                    return resolve({
                        message: 'Thank you, you already submitted the form',
                        statusCode: StatusCode.AlreadyExists
                    });
                }

                if(!user){
                    return resolve({
                        message: 'Sorry, You are not eligible for this invitation.',
                        statusCode: StatusCode.NotFound
                    });
                }

                let match = await PasswordHelper.comparePassword(user.phone, request.hashedPhone);
                if(!match){
                    return resolve({
                        message: 'Sorry, You are not eligible for this invitation.',
                        statusCode: StatusCode.NotFound
                    });
                }

                user.fullName = request.fullName;
                user.email = request.email;
                user.company = request.company;
                user.sector = request.sector;
                user.title = request.title;
                user.submittedRegistration = true;
                await user.save();

                return resolve({
                    message: 'Done',
                    statusCode: StatusCode.Ok
                });
            } catch (error) {
                console.log(error);
                
                reject(error)
            }
        });
    }

}