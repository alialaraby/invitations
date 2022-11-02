import { Document, Error, model, Model, Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { SchemaValidators } from "../helper/schema-validators";

export interface IAdmin extends Document {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    accessToken: string;
    isDeleted: boolean;
}

export const AdminSchema: Schema = new Schema<IAdmin>(
    {
        fullName: { type: String, required: [true, 'required'], trim: true },
        email: { 
            type: String, 
            required: [true, 'required'], 
            unique: true, 
            lowercase: true, 
            trim: true,
            validate: [SchemaValidators.validateEmail, 'Please fill a valid email address']
        },
        phone: { 
            type: String, 
            required: [true, 'required'], 
            unique: true, 
            lowercase: true, 
            trim: true,
            validate: [SchemaValidators.validatePhone, 'Please fill a valid phone number']
        },
        password: { type: String, trim: true },
        accessToken: { type: String, trim: true },
        isDeleted: { type: Boolean, default: false },
    }, {
        collection: 'admin',
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
);
AdminSchema.plugin(uniqueValidator);

AdminSchema.pre('validate', async function (this: IAdmin, next) {
    const validationError: Error.ValidationError = await this.validateSync();
    if(validationError) next(validationError);
    else next();    
});

const Admin: Model<IAdmin> = model<IAdmin>('Admin', AdminSchema);
export default Admin;
