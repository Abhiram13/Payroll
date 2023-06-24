import express from "express";
import { login } from "../services/login.service";
import { authentication } from "../services/middleware.service";
import apiRouter from "./apis.router";

const router = express.Router();

router.get("/", (req, res) => res.send('Hello World'));
router.post("/login", login);
router.use("/api", authentication, apiRouter);

router.all('*', (req, res) => {
   res?.status(404)?.send({message: "The end point you are looking for does not exist"})?.end();
});

export default router; 