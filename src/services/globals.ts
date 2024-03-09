import { IApiResponse, IApiResponsePayload, ErrorType } from "../types/export.types";

export const tables = {
    employee: process?.env?.EMPLOYEE as string,
    leaves: process?.env?.LEAVES as string,
    organisation: process?.env?.ORGANISATION as string,
    roles: process?.env?.ROLES as string,
    checkins: process?.env?.CHECKINS as string,
};

export function ApiReponse<T>(payload: IApiResponsePayload<T>): void {
    const { res, status, error = false, message, result } = payload;
    const response: IApiResponse<T> = { status, error };

    if (result) response.result = result;
    if (message) response.message = message;
    
    res.json(status, response);
}

export class MyError extends Error {
    constructor(error: Error) {
        super(error?.message || "");
        this.name = error?.name || ErrorType.MyError;
        this.message = error?.message || "Something went wrong";
        this.stack = error?.stack || "";
    }
}