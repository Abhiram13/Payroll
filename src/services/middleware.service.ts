import {NextFunction, Request, Response} from "express";
import Hashing from "./hashing";
import { IEncryptedToken } from "../types/login.types";

export async function authentication(req: Request, res: Response, next: NextFunction) {
   const token: string | undefined = req?.headers['authorization'];

   console.log(token);

   if (token) {
      const decrypted = Hashing?.decrypt<IEncryptedToken>(token);
      console.log({decrypted});
   };

   next();
}