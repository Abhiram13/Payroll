import { ObjectId } from "mongodb";
import { RoleIdentifier } from "./schemas";
import { Response } from "../services/server";

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
   CREATED = 201,
   NO_DATA = 204,
   NOT_MODIFIED = 304,
   BAD_REQUEST = 400,
   UN_AUTHORISE = 401,
   FORBIDDEN = 403,
   NOT_FOUND = 404,
   SERVER_ERROR = 500,
   TIMEOUT = 504,
}

export interface IApiResponse<T> {
   status: StatusCodes;
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