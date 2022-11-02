import { BoatStatus, Genders } from "../../../enums/schema-enums";

export interface IAdminAddPilot{
    //pilot data
    _id?: string;
    fullName: string;
    avatarUrl: string;
    email: string;
    phone: string;
    // location: any;
    country: string;
    city: string;
    gender: Genders;

    //boat data
    // boatId?: string;
    // boatName: string;
    // boatModel: string;
    // boatCapacity: number;
    // boatStatus?: BoatStatus;
    
}