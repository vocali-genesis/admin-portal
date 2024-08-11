import { AuthService } from "@/core/module/services.types";
import { faker } from "@faker-js/faker";

/**
 * Some useful test utils to make the testing view simple
 */
export const login = (
  authService: AuthService,
  { email }: { email?: string } = {}
) => {
  authService.loginUser(
    email || faker.internet.email(),
    faker.internet.password()
  );
};
