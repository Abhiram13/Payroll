import {describe, test} from '@jest/globals';
import request from 'supertest';
import { app, server } from '../..';

describe("POST /login", () => {
   describe("given username and password", () => {
      test("should response with 200 status", async () => {
         const res = await request(app).post("/login").send({
            user_name: "",
            password: ""
         });

         expect(res.statusCode).toBe(400);
      });
   });
});

afterAll(() => {
   server?.close();
})