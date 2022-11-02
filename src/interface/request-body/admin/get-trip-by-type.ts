import { TripTypes } from "../../../enums/schema-enums";

export interface IGetTripsByType{
    pageIndex: number;
    pageSize: number;
    types: TripTypes[];
    categoryId: string;
}