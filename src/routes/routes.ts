import express from "express";
import employeeRouter from "./employee.router";
import orgRouter from "./organisation.router";

const router = express.Router();

router.get("/", (req, res) => res.send('Hello World'));
router.use("/employee", employeeRouter);
router.use("/organisation", orgRouter);

export default router;