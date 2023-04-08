enum LeaveApprovalStatus {
    approved = 1,
    rejected = 2,
    pending = 3
};

enum CheckInStatus {
    completed = 1,
    pending = 2
}

interface IEmployeeSchema {
    first_name: string;
    last_name: string;
    phone: number;
    email: string;
    organisation_id: string;
    role_id: string;
    date_of_birth: Date;
    manager_id: string;
}

interface IOrganisationSchema {
    name: string;
    admin_id: string;
}

interface ILeaveSchema {
    employee_id: string;
    from_date: Date;
    to_date: Date;
    reason: String;
    status: LeaveApprovalStatus;
    updated_by: string;
}

interface ICheckInSchema {
    employee_id: string;
    check_in: Date;
    check_out: Date;
    status: CheckInStatus;
}