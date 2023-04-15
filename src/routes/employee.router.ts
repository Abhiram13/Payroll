import express from "express";
import * as EmployeeService from "../services/employee.service";

const employeeRouter = express.Router();

employeeRouter.post("/add", EmployeeService.insertEmployee);
employeeRouter.get("/fetch/:id", EmployeeService.fetchEmployee);

export default employeeRouter;