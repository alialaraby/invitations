import { EmergencyType } from "../../../enums/schema-enums";

export interface IGetEmergenciesByType{
    pageIndex: number;
    pageSize: number;
    types: EmergencyType[];
}