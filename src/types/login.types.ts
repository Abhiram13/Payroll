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

// export enum StatusCodes {
//    OK = 200,
//    CREATED = 201,
//    NO_DATA = 204,
//    NOT_MODIFIED = 304,
//    BAD_REQUEST = 400,
//    UN_AUTHORISE = 401,
//    FORBIDDEN = 403,
//    NOT_FOUND = 404,
//    SERVER_ERROR = 500,
//    TIMEOUT = 504,
// }

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

/**
 * ```typescript
 * id: ObjectId;
   managerId?: string;
   organisationId?: string;
   roleId: string;
   roleIdentifier: RoleIdentifier;
   userName: string;
   time: number;
 * ```
 */
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