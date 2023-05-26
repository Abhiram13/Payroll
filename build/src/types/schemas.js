"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleIdentifier = void 0;
var LeaveApprovalStatus;
(function (LeaveApprovalStatus) {
    LeaveApprovalStatus[LeaveApprovalStatus["approved"] = 1] = "approved";
    LeaveApprovalStatus[LeaveApprovalStatus["rejected"] = 2] = "rejected";
    LeaveApprovalStatus[LeaveApprovalStatus["pending"] = 3] = "pending";
})(LeaveApprovalStatus || (LeaveApprovalStatus = {}));
;
var CheckInStatus;
(function (CheckInStatus) {
    CheckInStatus[CheckInStatus["completed"] = 1] = "completed";
    CheckInStatus[CheckInStatus["pending"] = 2] = "pending";
})(CheckInStatus || (CheckInStatus = {}));
var RoleIdentifier;
(function (RoleIdentifier) {
    RoleIdentifier[RoleIdentifier["SuperAdmin"] = 1] = "SuperAdmin";
    RoleIdentifier[RoleIdentifier["OrganisationAdmin"] = 2] = "OrganisationAdmin";
    RoleIdentifier[RoleIdentifier["ReportingManager"] = 3] = "ReportingManager";
    RoleIdentifier[RoleIdentifier["Employee"] = 4] = "Employee";
})(RoleIdentifier = exports.RoleIdentifier || (exports.RoleIdentifier = {}));
