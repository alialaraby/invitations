import { AdminRoles, Genders } from "../../../enums/schema-enums";

export interface IAddAdmin{
    fullName: string;
    avatarUrl: string;
    email: string;
    role: AdminRoles;
    phone: string;
    password: string;
    gender: Genders;
    dateOfBirth: string;
}