import { ObjectId } from "mongodb";
import { RoleIdentifier } from "./schemas";

export interface ILoginRequest {
   user_name: string;
   password: string;
}

export interface ILoginResponse {
   token: string;
   name: string
}

export enum StatusCodes {
   OK = 200,
   NO_DATA = 204,
   NOT_MODIFIED = 304,
   UN_AUTHORISE = 401,
   FORBIDDEN = 403,
   BAD_REQUEST = 400,
   SERVER_ERROR = 500
}

export interface IApiResponse<T> {
   status: StatusCodes;
   result?: T;
   message?: string;
   error: boolean;
}

export interface IMongo {
   _id: ObjectId;
}

export interface IEncryptedToken {
   id: ObjectId;
   managerId: string;
   organisationId: string;
   roleId: string;
   roleIdentifier: RoleIdentifier;
   userName: string;
   time: number;
}

export interface ILoginRoleIdentifier {
   identifier: RoleIdentifier;
}