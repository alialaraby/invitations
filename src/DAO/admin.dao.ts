import mongoose from "mongoose";
import Admin, { IAdmin } from "../model/admin";
import User, { IUser } from "../model/user";

export class AdminDao {

    public add(admin: IAdmin): Promise<IAdmin> {
        return new Promise(async (resolve, reject) => {
            try {
                const model = new Admin(admin);
                let addedItem = await Admin.create(model);

                resolve(addedItem);
            } catch (error) {
                reject(error);
            }
        });
    }

    public getAdminByEmail(email: string): Promise<IAdmin> {
        return new Promise(async (resolve, reject) => {
            try {
                let item = await Admin.findOne({ email: email.trim().toLowerCase() });

                resolve(item);
            } catch (error) {
                reject(error);
            }
        });
    }

    public getAdminByPhone(phone: string): Promise<IAdmin> {
        return new Promise(async (resolve, reject) => {
            try {
                let item = await Admin.findOne({ phone: phone.trim().toLowerCase() });

                resolve(item);
            } catch (error) {
                reject(error);
            }
        });
    }

    public getAdminById(id: string): Promise<IAdmin> {
        return new Promise(async (resolve, reject) => {
            try {
                let item = await Admin.findOne({ _id: new mongoose.Types.ObjectId(id.trim().toLowerCase()) });

                resolve(item);
            } catch (error) {
                reject(error);
            }
        });
    }

    public getUserById(id: string): Promise<IUser> {
        return new Promise(async (resolve, reject) => {
            try {
                let item = await User.findOne({ _id: new mongoose.Types.ObjectId(id.trim().toLowerCase()) });

                resolve(item);
            } catch (error) {
                reject(error);
            }
        });
    }

    public getAdmins(pageIndex: number = 0, pageSize: number = 10): Promise<{items: IAdmin[], count: number}> {
        return new Promise(async (resolve, reject) => {
            try {
                let items = await Admin.find({ isDeleted: false })
                .sort({createdAt: -1})
                .skip(pageIndex * pageSize)
                .limit(pageSize);

                let count = await Admin.countDocuments({ isDeleted: false });

                resolve({items, count});
            } catch (error) {
                reject(error);
            }
        });
    }

    public getUserByPhone(phone: string): Promise<IUser> {
        return new Promise(async (resolve, reject) => {
            try {
                let item = await User.findOne({ phone: phone.trim().toLowerCase() });

                resolve(item);
            } catch (error) {
                reject(error);
            }
        });
    }

    public getSubmittedUser(submittedPhone: string): Promise<IUser> {
        return new Promise(async (resolve, reject) => {
            try {
                let item = await User.findOne({ registeredPhone: submittedPhone.trim().toLowerCase() });

                resolve(item);
            } catch (error) {
                reject(error);
            }
        });
    }

    public getUsers(pageIndex: number = 0, pageSize: number = 10): Promise<{items: IUser[], count: number}> {
        return new Promise(async (resolve, reject) => {
            try {
                let items = await User.find()
                .sort({createdAt: -1})
                .skip(pageIndex * pageSize)
                .limit(pageSize);

                let count = await User.countDocuments();

                resolve({items, count});
            } catch (error) {
                reject(error);
            }
        });
    }

    public getStatistics(): Promise<{totalRegistrations: number, qrsSent: number, totalAttendents: number}> {
        return new Promise(async (resolve, reject) => {
            try {
                let totalRegistrations = await User.countDocuments({ submittedRegistration: true });
                let qrsSent = await User.countDocuments({ adminSentQR: true });
                let totalAttendents = await User.countDocuments({ attendedEvent: true });

                resolve({totalRegistrations, qrsSent, totalAttendents});
            } catch (error) {
                reject(error);
            }
        });
    }

}