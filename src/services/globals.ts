require('dotenv').config();

export const tables = {
    employee: process?.env?.EMPLOYEE as string,
    leaves: process?.env?.LEAVES as string,
    organisation: process?.env?.ORGANISATION as string,
    roles: process?.env?.ROLES as string,
    checkins: process?.env?.CHECKINS as string,
};