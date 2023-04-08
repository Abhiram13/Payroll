import express from "express";
import employeeRouter from "./employee.router";

const router = express.Router();

router.get("/", (req, res) => res.send('Hello World'));
router.use("/employee", employeeRouter);

export default router;