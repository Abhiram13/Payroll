import express from "express";
import employeeRouter from "./employee.router";
import orgRouter from "./organisation.router";
import rolesRouter from "./roles.router";
import leavesRouter from "./leaves.router";
import checkInRouter from "./checkins.router";
import { login } from "../services/login.service";
import { authentication } from "../services/middleware.service";

const router = express.Router();

router.get("/", (req, res) => res.send('Hello World'));
router.post("/login", login);
router.use("/employee", employeeRouter);
router.use("/organisation", authentication, orgRouter);
router.use("/roles", rolesRouter);
router.use("/checkin", checkInRouter);
router.use("/leaves", leavesRouter);

export default router;