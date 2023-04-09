import express from "express";
import * as LeaveService from "../services/leaves.service";

const leavesRouter = express.Router();

leavesRouter.post("/add", LeaveService.insertLeaves);
leavesRouter.get("/list", LeaveService.listOfLeaves);

export default leavesRouter;