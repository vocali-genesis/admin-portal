/**
 * @jest-environment node
 */

import { registerUser } from "./register-service";

describe("registerService (Integration Test)", () => {
  const email = `newuser${Date.now()}@example.com`;
  const password = "another_strong_password";

  afterEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });

  it("registers a user with valid email and password", async () => {
    const result = await registerUser(email, password);

    expect(result).toHaveProperty('user');
    expect(result.user).toHaveProperty('id');
    expect(result.user).toHaveProperty('email', email);
    expect(result).toHaveProperty('token');
    if (result.token) {
      expect(typeof result.token).toBe('string');
    }
  });

  it("throws an error when registration fails", async () => {
    await expect(registerUser('invalid-email', password)).rejects.toThrow();
  });
});
