/**
 * @jest-environment node
 */

import { supabase } from "@/services/auth/auth-supabase.service";
import { registerUser } from "./register-service";

describe("registerService (Integration Test)", () => {
  const validEmail = "test@example.com";
  const validPassword = "strong_password";

  beforeEach(async () => {
    const { data, error } = await supabase
      .from("users")
      .delete()
      .match({ email: validEmail });
    if (error) throw error;
  });

  afterEach(async () => {
    const { data, error } = await supabase
      .from("users")
      .delete()
      .match({ email: validEmail });
    if (error) throw error;
  });

  it("registers a user with valid email and password", async () => {
    const newUserEmail = `newuser${Date.now()}@example.com`;
    const newUserPassword = "another_strong_password";

    const registeredUser = await registerUser(newUserEmail, newUserPassword);
    console.log(registeredUser);
    expect(registeredUser).not.toBeNull();

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .single()
      .eq("email", newUserEmail);
    expect(error).toBeNull();
    expect(data).toHaveProperty("email", newUserEmail);
  });
});
