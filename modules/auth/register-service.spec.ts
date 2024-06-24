/**
 * @jest-environment node
 */

import supabase from "@/services/auth/auth-supabase.service";
import { registerUser } from "./register-service";

describe("registerService (Integration Test)", () => {
  it("registers a user with valid email and password", async () => {
    const newUserEmail =  `newuser${Date.now()}@example.com`;
    const newUserPassword = "another_strong_password";

    expect(async () => await registerUser(newUserEmail, newUserPassword)).not.toThrow();
  });

  it("registers a user with valid email and password", async () => {
    const newUserEmail = 'mrtnomar15@gmail.com'; // `newuser${Date.now()}@example.com`;
    const newUserPassword = "another_strong_password";

    const registeredUser = await registerUser(newUserEmail, newUserPassword);
    expect(registeredUser).not.toBeNull();
  });
});
