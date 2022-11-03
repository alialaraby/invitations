import { Document, Error, model, Model, Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { SchemaValidators } from "../helper/schema-validators";

export interface IUser extends Document {
    // phoneKey: string;
    phone: string;
    invitationLink: string;
    email: string;
    registeredPhone: string;
    hashedPhone: string;
    fullName: string;
    company: string;
    title: string;
    sector: string;
    submittedRegistration: boolean;
    attendedEvent: boolean;
}

export const AdminSchema: Schema = new Schema<IUser>(
    {
        // phoneKey: { type: String, required: [true, 'required'], trim: true },
        phone: { 
            type: String, 
            required: [true, 'required'], 
            unique: true, 
            lowercase: true, 
            trim: true
        },
        invitationLink: { type: String, required: [true, 'required'], trim: true },
        email: { 
            type: String, 
            // unique: true, 
            lowercase: true, 
            trim: true
        },
        registeredPhone: { 
            type: String, 
            // unique: true, 
            lowercase: true, 
            trim: true
        },
        hashedPhone: { type: String, required: [true, 'required'], trim: true },
        fullName: { type: String, trim: true },
        company: { type: String, trim: true },
        title: { type: String, trim: true },
        sector: { type: String, trim: true },
        submittedRegistration: { type: Boolean, default: false },
        attendedEvent: { type: Boolean, default: false },
    }, {
        collection: 'user',
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
    }
);
AdminSchema.plugin(uniqueValidator);

AdminSchema.pre('validate', async function (this: IUser, next) {
    const validationError: Error.ValidationError = await this.validateSync();
    if(validationError) next(validationError);
    else next();    
});

const User: Model<IUser> = model<IUser>('User', AdminSchema);
export default User;
