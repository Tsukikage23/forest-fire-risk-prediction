import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "../src/app.js";

async function withServer(callback) {
  const app = createApp({
    jwtSecret: "test-secret",
    mlServiceUrl: "http://127.0.0.1:65535",
    frontendOrigin: "http://localhost:5173",
  });
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  try {
    return await callback(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())));
  }
}

test("health reports a disconnected database without crashing on both /health and /api/health", async () => {
  await withServer(async (baseUrl) => {
    const res1 = await fetch(`${baseUrl}/health`);
    assert.equal(res1.status, 200);
    assert.deepEqual(await res1.json(), { status: "ok", database: "disconnected" });

    const res2 = await fetch(`${baseUrl}/api/health`);
    assert.equal(res2.status, 200);
    assert.deepEqual(await res2.json(), { status: "ok", database: "disconnected" });
  });
});

test("CORS allows requests from configured origins", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`, {
      headers: { Origin: "http://localhost:5173" },
    });
    assert.equal(response.headers.get("access-control-allow-origin"), "http://localhost:5173");
  });
});

test("prediction routes reject unauthenticated requests", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/predictions`);
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { error: "Authentication required" });
  });
});

test("registration validates malformed input before database access", async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "not-an-email", password: "short" }),
    });
    assert.equal(response.status, 400);
  });
});