enum LeaveApprovalStatus {
    approved = 1,
    rejected = 2,
    pending = 3
};

enum CheckInStatus {
    completed = 1,
    pending = 2
}

export enum RoleIdentifier {
    SuperAdmin = 1,
    OrganisationAdmin = 2,
    ReportingManager = 3,
    Employee = 4
}

export interface IEmployeeSchema {
    first_name: string;
    last_name: string;
    phone: number;
    email: string;
    organisation_id: string;
    role_id: string;
    date_of_birth: Date;
    manager_id: string;
    username: string;
    password: string;
}

export interface IOrganisationSchema {
    name: string;
    admin_id: string;
}

export interface ILeaveSchema {
    employee_id: string;
    from_date: Date;
    to_date: Date;
    reason: String;
    status: LeaveApprovalStatus;
    updated_by: string;
}

export interface ICheckInSchema {
    employee_id: string;
    check_in: Date;
    check_out: Date;
    status: CheckInStatus;
}

export interface IRoleSchema {
    name: string;
    identifier: RoleIdentifier;
}

export type IProjectFields<T> = {
    [key in keyof T]: number;
}