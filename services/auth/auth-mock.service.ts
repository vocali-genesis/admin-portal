import moment from "moment";
import { GenesisUser } from "@/core/module/core.types";
import { GlobalCore } from "@/core/module/module.types";
import { AuthService } from "@/core/module/services.types";
import { faker } from "@faker-js/faker";

class AuthMockService implements AuthService {
  private loggedUser: GenesisUser | null = null;

  constructor() {}
  private generateUser() {
    const user = {
      id: faker.string.uuid(),
      created_at: moment().format(),
      email: faker.internet.email(),
    };
    const token = faker.string.hexadecimal({ length: 12 });

    this.loggedUser = user;
    return Promise.resolve({ user, token });
  }

  registerUser(): Promise<{
    user: GenesisUser;
    token: string | undefined;
  } | null> {
    return this.generateUser();
  }

  async loginUser(): Promise<{
    user: GenesisUser | null;
    token: string | undefined;
  } | null> {
    return this.generateUser();
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
