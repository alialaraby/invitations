import { AdminDao } from "../DAO/admin.dao";
import { StatusCode } from "../enums/request-response-enums";
import { PasswordHelper } from "../helper/password";
import { UserTokenHelper } from "../helper/user-token.helper";
import { IAdminLogin } from "../interface/request-body/admin/admin-login";
import { IResponseBody } from "../interface/response-body";
import { IUserPayload } from "../interface/user-payload";

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

}