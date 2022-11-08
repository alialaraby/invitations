import { IUser } from "../../../model/user";

export interface ISendInvitationVip{
    users: IUser[];
    invitationLink: string;
}