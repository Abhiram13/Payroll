import {describe, test} from '@jest/globals';
// import request from 'supertest';
// import { app, MONGO } from '../..';

describe("Employee router", () => {   

   test('Example test', () => {
      const x = true;
      expect(x).toBe(true);
   })

   // async function fetchToken (): Promise<string | null> {
   //    const res = await request(app).post("/login").send({
   //       user_name: "abhi",
   //       password: "123"
   //    });

   //    return res?.body?.result?.token || null;
   // }

   // let token: Promise<string | null> = fetchToken();

   // test("fetch employee", async () => {
   //    const res = await request(app).get("/api/organisation/fetch").set("authorization", `${await token}`); 

   //    expect(res?.status)?.toBe(200);
   //    expect(res?.body?.status)?.toBe(200);
   //    expect(res?.body?.result?._id)?.not?.toBe("");
   // });
});

// afterAll(() => {
//    // server?.close();
//    MONGO.client.close();
// });