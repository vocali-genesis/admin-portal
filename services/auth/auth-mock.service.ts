import { GenesisUser } from "@/core/module/core.types";
import { GlobalCore } from "@/core/module/module.types";
import { AuthService } from "@/core/module/services.types";
import { faker } from "@faker-js/faker";
import { Seed } from "@/resources/tests/seed";

class AuthMockService implements AuthService {
  private loggedUser: GenesisUser | null = null;

  constructor() {}

  private generateToken() {
    return faker.string.hexadecimal({ length: 12 });
  }

  registerUser(): Promise<{
    user: GenesisUser;
    token: string | undefined;
  } | null> {
    const { user } = Seed.new().user();
    this.loggedUser = user;
    return Promise.resolve({
      token: this.generateToken(),
      user: this.loggedUser,
    });
  }
  async loginUser(email: string): Promise<{
    user: GenesisUser | null;
    token: string | undefined;
  } | null> {
    this.loggedUser = { email: email } as GenesisUser;
    return Promise.resolve({
      token: this.generateToken(),
      user: this.loggedUser,
    });
  }

  public async oauth(): Promise<string | null> {
    return Promise.resolve(faker.internet.url());
  }

  async getLoggedUser(): Promise<GenesisUser | null> {
    return Promise.resolve(this.loggedUser);
  }

  logout(): Promise<null | undefined> {
    this.loggedUser = null;
    return Promise.resolve(null);
  }

  async resetPassword(): Promise<boolean> {
    return Promise.resolve(true);
  }

  async updateUser(
    email?: string
    // password?: string
  ): Promise<GenesisUser | null> {
    if (!this.loggedUser) {
      return null;
    }
    this.loggedUser.email = email;
    return Promise.resolve(this.loggedUser);
  }
}

GlobalCore.manager.service("oauth", new AuthMockService());
