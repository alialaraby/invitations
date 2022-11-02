import { RequestedTripStatus, TripTypes } from "../../../enums/schema-enums";

export interface IGetTripRequests{
    pageIndex: number;
    pageSize: number;
    statuses: RequestedTripStatus[];
    types: TripTypes[];
}