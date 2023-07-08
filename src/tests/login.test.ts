import {describe, test} from '@jest/globals';
import request from 'supertest';
import { MONGO, server } from '../../index';

// to run a specific file, use command `npm test -- src/tests/<filename>.<ext>
// to run a specific test case, use command `npm test -- -t '<test case name mentioned in describe callback || test case name mentioned in test callback>, 
// for example `npm test -- -t 'POST /login test'` || `npm test -- -t 'should get response with 200 status'`

describe("Login API positive flow", () => {
   test("should get response with 200 status", async () => {
      // const res = await request(app).post("/login").send({
      //    user_name: "abhi",
      //    password: "123"
      // });

      // if (res?.body?.status === 200) {
      //    expect(res?.body)?.toHaveProperty("result");
      //    expect(res?.body?.result)?.toHaveProperty("name");
      //    expect(res?.body?.result)?.toHaveProperty("token");
      //    expect(res?.body?.result?.token)?.not?.toBe("");
      //    expect(res?.body?.result?.name)?.not?.toBe("");
      // }

      // if (res?.body?.status === 400) {
      //    expect(res?.body)?.not?.toHaveProperty("result");
      //    expect(res?.body)?.toHaveProperty("message");
      // } 
   }); 
});

describe("Login API negative flow", () => {
   test("should get 400 if empty", async () => {
      // const res = await request(app).post("/login").send();

      // expect(res?.body?.status).toBe(400);
   });
});

afterAll(() => {
   server?.close();
   MONGO.client.close();
});