/**
 * @jest-environment node
 */

import { loginUser } from "./login-service";
import { registerUser } from "./register-service";

describe("registerService (Integration Test)", () => {
  const email = `newuser${Date.now()}@example.com`;
  const password = "another_strong_password";

  beforeAll(async () => {
    await registerUser(email, password);
  });
  
  it("logs in a registered user with valid email and password", async () => {
    const result = await loginUser(email, password);

    expect(result).toHaveProperty('user');
    expect(result.user).toHaveProperty('id');
    expect(result.user).toHaveProperty('email', email);
    expect(result).toHaveProperty('token');
    expect(typeof result.token).toBe('string');
  });

  it("fails to log in with incorrect password", async () => {
    await expect(loginUser(email, 'wrong_password')).rejects.toThrow();
  });
});
