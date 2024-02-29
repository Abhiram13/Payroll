import { ObjectId } from "mongodb";
import { Response, RoleIdentifier, StatusCode } from "./export.types";

export interface ILoginRequest {
   user_name: string;
   password: string;
}

export interface ILoginResponse {
   token?: string;
   name: string
}

export interface IApiResponse<T> {
   status: StatusCode;
   result?: T;
   message?: string;
   error?: boolean;
}

export interface IApiResponsePayload<T> extends IApiResponse<T> {
   res: Response;
}

export interface IMongo {
   _id: ObjectId;
}

export interface IEncryptedToken {
   id: ObjectId;
   managerId?: string;
   organisationId?: string;
   roleId: string;
   roleIdentifier: RoleIdentifier;
   userName: string;
   time: number;
}

export interface IRoleIdentifier {
   identifier: RoleIdentifier;
}