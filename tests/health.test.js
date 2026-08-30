const request = require("supertest");
const app = require("../src/app");

describe("Health endpoint", () => {
  test("GET /api/health returns healthy", async () => {
    const response = await request(app).get("/api/health");
    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.status).toBe("healthy");
  });
});
