import * as logSearchRegister from '../../../app/controllers/api/v1/logSearch';


const request = require("supertest");
const app = require("../../../app");
//const registor = require("../../../app/controllers/api/v1/logSearch");

describe("Test the root path", () => {
  test("It should response the GET method", async () => {
    const req = await request(app)
    const response = await req.get("/api/v1/search?filename=system.log&limit=5&keywords=test");
    expect(response.statusCode).toBe(200);
  });
});

