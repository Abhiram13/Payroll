import express from "express";
import * as EmployeeService from "../services/employee.service";

const employeeRouter = express.Router();

employeeRouter.post("/add", EmployeeService.insertEmployee);

export default employeeRouter;