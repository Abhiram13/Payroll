import {describe, test} from '@jest/globals';
import request from 'supertest';
import { MONGO, server } from '../../index';
import {StatusCode} from "../types/export.types";

// to run a specific file, use command `npm test -- src/tests/<filename>.<ext>
// to run a specific test case, use command `npm test -- -t '<test case name mentioned in describe callback || test case name mentioned in test callback>, 
// for example `npm test -- -t 'POST /login test'` || `npm test -- -t 'should get response with 200 status'`

describe("Ping", () => {
   test("Checking server running status", async () => {
      const res = await request(server).get("");
      expect(res?.status).toBe(StatusCode.OK);
      expect(res?.body?.statusCode)?.toBe(StatusCode.OK);
      expect(res?.body?.message)?.toBe("This is a ping");
   })
})

describe("Login API", () => {
   test("should get response with 200 status", async () => {
      const res = await request(server).post("/login").send({
         user_name: "abhi",
         password: "123"
      });

      expect(res?.body)?.toHaveProperty("result");
      expect(res?.body?.result)?.toHaveProperty("name");
      expect(res?.body?.result)?.toHaveProperty("token");
      expect(res?.body?.result?.token)?.not?.toBe("");
      expect(res?.body?.result?.name)?.not?.toBe("");
   }); 

   test("should get 400 if empty", async () => {
      const res = await request(server).post("/login").send();
      expect(res?.status)?.toBe(StatusCode.BAD_REQUEST);
      expect(res?.body)?.not?.toHaveProperty("result");
      expect(res?.body)?.toHaveProperty("message");
   });
});

afterAll(done => {
   server?.close();
   MONGO.close();
   done();
});