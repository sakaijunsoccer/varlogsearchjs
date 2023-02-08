import * as logSearchRegister from '../../../app/controllers/api/v1/logSearch';


const request = require("supertest");
const app = require("../../../app");
//const registor = require("../../../app/controllers/api/v1/logSearch");

describe("Test event search", () => {
  test("It should response 200 with correct parameters", async () => {
    const req = await request(app)
    const response = await req.get("/api/v1/search?filename=aaaa.log&limit=5&keywords=test");
    expect(response.statusCode).toBe(200);
  });
});

