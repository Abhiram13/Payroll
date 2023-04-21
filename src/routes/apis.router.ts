import express from "express";
import employeeRouter from "./employee.router";
import orgRouter from "./organisation.router";
import rolesRouter from "./roles.router";
import leavesRouter from "./leaves.router";
import checkInRouter from "./checkins.router";

const apiRouter = express.Router();

apiRouter.use("/employee", employeeRouter);
apiRouter.use("/organisation", orgRouter);
apiRouter.use("/roles", rolesRouter);
apiRouter.use("/checkin", checkInRouter);
apiRouter.use("/leaves", leavesRouter);

export default apiRouter;