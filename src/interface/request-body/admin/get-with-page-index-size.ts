import { UserType } from "../../../enums/schema-enums";

export interface IGetByPageIndexAndSize{
    pageIndex: number;
    pageSize: number;
    types?: UserType[]; // for passenger types
}