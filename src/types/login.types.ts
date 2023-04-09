export interface ILoginRequest {
   user_name: string;
   password: string;
}

export interface ILoginResponse {
   token: string;
   employee_name: string
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
}