/* eslint-env jest */
/* eslint @typescript-eslint/no-var-requires: "off" */
import path from "path"

const request = require("supertest");
const app = require("../../../../../../src/app");
const tmp = require('tmp');

describe("Test event search", () => {
  test("It should response 200 with correct parameters", async () => {
    const req = await request(app)
    const tempObj = tmp.fileSync();
    jest.spyOn(path, 'join').mockImplementationOnce(() => {return tempObj.name});
    const filename = tempObj.name.split('/').pop()
    const response = await req.get(`/api/v1/search?filename=${filename}&limit=5&keywords=test`);
    expect(response.statusCode).toBe(200);
    tempObj.removeCallback();
  });

  test("It should response 200 without limit parameters", async () => {
    const req = await request(app)
    const tempObj = tmp.fileSync();
    jest.spyOn(path, 'join').mockImplementationOnce(() => {return tempObj.name});
    const filename = tempObj.name.split('/').pop()
    const response = await req.get(`/api/v1/search?filename=${filename}&keywords=test`);
    expect(response.statusCode).toBe(200);
    tempObj.removeCallback();
  });

  test("It should response 400 without filename", async () => {
    const req = await request(app)
    const response = await req.get("/api/v1/search?limit=5&keywords=test");
    expect(response.statusCode).toBe(400);
  });

  test("It should response 400 without keywrods", async () => {
    const req = await request(app)
    const response = await req.get("/api/v1/search?filename=example.log&limit=5");
    expect(response.statusCode).toBe(400);
  });

  test("It should response 400 does not exist file", async () => {
    const req = await request(app)
    const response = await req.get("/api/v1/search?filename=doesnotexit.log&keywords=test");
    expect(response.statusCode).toBe(400);
  });

  test("It should response 400 does not exist file", async () => {
    const req = await request(app)
    const response = await req.get("/api/v1/search?filename=../../etc/password&keywords=test");
    expect(response.statusCode).toBe(400);
  });

});

