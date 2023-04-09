import express from "express";
import * as CheckinService from "../services/checkins.service";

const checkInRouter = express.Router();

checkInRouter.post("/add", CheckinService.insertCheckIns);
checkInRouter.get("/list", CheckinService.listOfCheckIns);

export default checkInRouter;