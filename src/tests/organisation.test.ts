import {describe, test} from '@jest/globals';
import request from 'supertest';
import { MONGO, server } from '../..';

describe("Employee router", () => {   

   // async function fetchToken (): Promise<string | null> {
   //    const res = await request(app).post("/login").send({
   //       user_name: "abhi",
   //       password: "123"
   //    });

   //    return res?.body?.result?.token || null;
   // }

   // let token: Promise<string | null> = fetchToken();

   test("fetch employees", async () => {
      // const res = await request(app).get("/api/organisation/list").set("authorization", `${await token}`); 

      // if (res?.body?.status === 200) {
      //    expect(res?.body).toHaveProperty('result');
      //    const {result} = res?.body;

      //    if (Array.isArray(result)) {
      //       expect(result).toEqual(expect.arrayContaining([
      //          expect.objectContaining({
      //             _id: expect.stringContaining(""),
      //             name: expect.stringContaining(""),
      //             admin_id: expect.stringContaining("")
      //          })
      //       ]));
      //    } else {
      //       expect(result).toEqual(
      //          expect.objectContaining({
      //             _id: expect.stringContaining(""),
      //             name: expect.stringContaining(""),
      //             admin_id: expect.stringContaining("")
      //          })
      //       );
      //    }
      // }
   });
});

afterAll(() => {
   server?.close();
   MONGO.close();
});