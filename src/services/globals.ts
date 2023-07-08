import { Response } from "./server";
import { IApiResponse, IApiResponsePayload } from "../types/login.types"
import { StatusCodes } from "../types/login.types";
import { IEmployeeSchema } from "../types/schemas"

require('dotenv').config();

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

    const stringifiedResponse: string = JSON.stringify(response);

    res.statusCode = status;
    res.write(stringifiedResponse);
    res.end();
}

/**
 * Trigger `setTimeout` with `3` second time limit, if API takes longer than 3 seconds, return `504` timeout error
 */
export async function TimerMethod<T>(res: Response, callback: () => Promise<any>): Promise<void> {
    var isTimedOut: boolean = false;
    const RESPONSE_TIMER = 3000; // 3000 milliseconds = 3 seconds

    const timer = setTimeout(() => {
        ApiReponse<null>({ res, status: StatusCodes?.TIMEOUT, message: "Session timed out" });
        isTimedOut = true;
    }, RESPONSE_TIMER);

    const x = await callback();

    isTimedOut === false && ApiReponse<T | undefined>({ res, status: StatusCodes?.OK, result: x?.result, message: x?.message });

    clearTimeout(timer);
}