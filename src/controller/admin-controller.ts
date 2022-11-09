import mongoose from "mongoose";
import { AdminDao } from "../DAO/admin.dao";
import { StatusCode } from "../enums/request-response-enums";
import { PasswordHelper } from "../helper/password";
import { UserTokenHelper } from "../helper/user-token.helper";
import { IAdminLogin } from "../interface/request-body/admin/admin-login";
import { IGetByPageIndexAndSize } from "../interface/request-body/admin/get-with-page-index-size";
import { ISendInvitation } from "../interface/request-body/admin/send-invitation";
import { ISendInvitationVip } from "../interface/request-body/admin/send-invitation-vip";
import { ISendQRCode } from "../interface/request-body/admin/send-qr-code";
import { ISubmitForm } from "../interface/request-body/admin/submit-registration";
import { IResponseBody } from "../interface/response-body";
import { IUserPayload } from "../interface/user-payload";
import Admin from "../model/admin";
import User, { IUser } from "../model/user";
import { AxiosRequest } from "../utils/axios-request";

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
                }else{
                    return resolve({
                        message: 'Admin not found',
                        statusCode: StatusCode.NotFound
                    });
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

                let erroredNumbers: string[] = [];
                let numbersAlreadySent: string[] = [];
                let phones = request.phones;
                for (let i = 0; i < phones.length; i++) {
                    if(phones[i] && phones[i].trim().length > 0){
                        try {
                            let exists = await this.adminDao.getUserByPhone(phones[i]);
                            if(!exists){
                                let hashedPhone = await PasswordHelper.hashPassword(phones[i]);
                                
                                let sent = await AxiosRequest.sendInvitationLink(phones[i], hashedPhone);
                                if(!sent){
                                    erroredNumbers.push(phones[i]);
                                }else{
                                    let addedUser = new User();
                                    addedUser.phone = phones[i];
                                    addedUser.invitationLink = request.invitationLink;
                                    addedUser.hashedPhone = hashedPhone;
                                    await addedUser.save();
                                }
                            }else{
                                numbersAlreadySent.push(phones[i]);
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }

                return resolve({
                    message: 'Done',
                    statusCode: StatusCode.Ok,
                    erroredNumbers: erroredNumbers,
                    numbersAlreadySent: numbersAlreadySent,
                });
            } catch (error) {
                reject(error)
            }
        });
    }

    public sendInvitationVip(request: ISendInvitationVip): Promise<IResponseBody> {
        return new Promise(async (resolve, reject) => {
            try {

                let erroredNumbers: string[] = [];
                let numbersAlreadySent: string[] = [];
                let users: IUser[] = request.users;
                for (let i = 0; i < users.length; i++) {
                    try {
                        let exists = await this.adminDao.getUserByPhone(users[i].phone);
                        if(!exists){
                            let hashedPhone = await PasswordHelper.hashPassword(users[i].phone);
                            let sent = await AxiosRequest.sendQRLink(users[i].phone, hashedPhone);
                            if(!sent){
                                erroredNumbers.push(users[i].phone);
                            }else{
                                let addedUser = new User();
                                addedUser.phone = users[i].phone;
                                addedUser.email = users[i].email;
                                addedUser.fullName = users[i].fullName;
                                addedUser.company = users[i].company;
                                addedUser.title = users[i].title;
                                addedUser.sector = users[i].sector;
                                addedUser.invitationLink = request.invitationLink;
                                addedUser.hashedPhone = hashedPhone;
                                addedUser.submittedRegistration = true;
                                addedUser.adminSentQR = true;
                                await addedUser.save();
                            }
                            
                        }else{
                            let hashedPhone = await PasswordHelper.hashPassword(exists.phone);
                            await AxiosRequest.sendQRLink(exists.phone, hashedPhone);
                        }
                    } catch (error) {
                        console.log(error);
                    }
                }

                return resolve({
                    message: 'Done',
                    statusCode: StatusCode.Ok,
                    erroredNumbers: erroredNumbers,
                    numbersAlreadySent: numbersAlreadySent,
                });
            } catch (error) {
                reject(error)
            }
        });
    }

    public submitForm(request: ISubmitForm): Promise<IResponseBody> {
        return new Promise(async (resolve, reject) => {
            try {
                let hashedPhone = request.vartX;

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

                let match = await PasswordHelper.comparePassword(user.phone, hashedPhone);
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
                reject(error)
            }
        });
    }

    public getUsers(request: IGetByPageIndexAndSize): Promise<IResponseBody> {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await this.adminDao.getUsers(request.pageIndex, request.pageSize);
                let admins = await Admin.find({});

                return resolve({
                    message: 'Done',
                    statusCode: StatusCode.Ok,
                    items: result.items,
                    admins: admins,
                    count: result.count
                });
            } catch (error) {
                reject(error)
            }
        });
    }

    public getAdmins(request: IGetByPageIndexAndSize): Promise<IResponseBody> {
        return new Promise(async (resolve, reject) => {
            try {
                let admins = await Admin.find({});

                return resolve({
                    message: 'Done',
                    statusCode: StatusCode.Ok,
                    admins: admins,
                });
            } catch (error) {
                reject(error)
            }
        });
    }

    public resetAdminPassword(request: any): Promise<IResponseBody> {
        return new Promise(async (resolve, reject) => {
            try {
                let newPassword = await PasswordHelper.hashPassword(request.password);
                await Admin.updateOne(
                    { _id: new mongoose.Types.ObjectId(request.adminId.trim().toLowerCase()) }, 
                    {$set: { password: newPassword }}
                )

                return resolve({
                    message: 'Done',
                    statusCode: StatusCode.Ok
                });
            } catch (error) {
                reject(error)
            }
        });
    }

    public sendQRCode(request: ISendQRCode): Promise<IResponseBody> {
        return new Promise(async (resolve, reject) => {
            try {
                let erroredNumbers: string[] = [];

                for (let i = 0; i < request.itemIds.length; i++) {
                    let user = await this.adminDao.getUserById(request.itemIds[i]);
                    if(user){
                        let sent = await AxiosRequest.sendQRLink(user.phone, user.hashedPhone);
                        if(sent){
                            user.adminSentQR = true;
                            await user.save();
                        }else{
                            erroredNumbers.push(user.phone);
                        }
                    }
                }

                return resolve({
                    message: 'Done',
                    statusCode: StatusCode.Ok,
                    erroredNumbers: erroredNumbers
                });
            } catch (error) {
                reject(error)
            }
        });
    }

    public getStatistics(request: any): Promise<IResponseBody> {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await this.adminDao.getStatistics();

                return resolve({
                    message: 'Done',
                    statusCode: StatusCode.Ok,
                    totalRegistrations: result.totalRegistrations,
                    qrsSent: result.qrsSent,
                    totalAttendents: result.totalAttendents,
                });
            } catch (error) {
                reject(error)
            }
        });
    }

    public openQRCode(request: any): Promise<IResponseBody> {
        return new Promise(async (resolve, reject) => {
            try {
                let data = {
                    name: 'a', phone: '010'
                }
                var QRCode = require('qrcode')
                QRCode.toDataURL('I am a pony!', function (err, url) {
                    console.log('urlXXX', url);
                });
                
                return resolve({
                    message: 'Done',
                    statusCode: StatusCode.Ok
                });
            } catch (error) {
                reject(error)
            }
        });
    }

}