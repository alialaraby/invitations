import { BoatStatus, FuelType, Genders } from "../../../enums/schema-enums";

export interface IAdminAddBoat{
    boatId?: string;
    assignedPilotId: string;
    boatName: string;
    serial: string; 
    model: string;
    capacity: number;
    kilosNeededForMaintenance: number;
    fuelCapacity: number;
    fuelType: FuelType;
    expectedFuelConsumption: number;
    boatStatus: BoatStatus;

    type: string;
    modelYear: string;
    launchDate: string;
    length: number;
    beam: string;
    license: string;
    licenseRenewalDate: string;
    image: string;
    engineBrand: string;
    engineModel: string;
    engineModelYear: string;
    engineSerial: string;
    engineHours: number;
    topSpeed: number;
    averageSpeed: number;
}