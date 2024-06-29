/**
 * @jest-environment node
 */
import AuthService from './auth-supabase.service';

describe("AuthService (Integration Test)", () => {
  const email = `newuser${Date.now()}@example.com`;
  const password = "strong_password_123";

  afterEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  });

  describe("registerUser", () => {
    it("registers a user with valid email and password", async () => {
      const result = await AuthService.registerUser(email, password);
      expect(result).toHaveProperty('user');
      expect(result.user).toHaveProperty('id');
      expect(result.user).toHaveProperty('email', email);
      expect(result).toHaveProperty('token');
      if (result.token) {
        expect(typeof result.token).toBe('string');
      }
    });

    it("throws an error when registration fails", async () => {
      await expect(AuthService.registerUser('invalid-email', password)).rejects.toThrow();
    });
  });

  describe("loginUser", () => {
    beforeAll(async () => {
      await AuthService.registerUser(email, password);
    });

    it("logs in a registered user with valid email and password", async () => {
      const result = await AuthService.loginUser(email, password);
      expect(result).toHaveProperty('user');
      expect(result.user).toHaveProperty('id');
      expect(result.user).toHaveProperty('email', email);
      expect(result).toHaveProperty('token');
      expect(typeof result.token).toBe('string');
    });

    it("fails to log in with incorrect password", async () => {
      await expect(AuthService.loginUser(email, 'wrong_password')).rejects.toThrow();
    });
  });
});