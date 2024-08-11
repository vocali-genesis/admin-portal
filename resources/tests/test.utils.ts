import { AuthService } from "@/core/module/services.types";
import { faker } from "@faker-js/faker";
import { Seed } from "./seed";
import { GenesisUser } from "@/core/module/core.types";
import {
  CoreComponent,
  GlobalCore,
  ModuleComponentsTypes,
} from "@/core/module/module.types";

/**
 * Some useful test utils to make the testing view simple
 */
export const login = async (
  authService: AuthService,
  props: Parameters<Seed["user"]>[0] = {}
) => {
  const { user, token } = (await authService.loginUser(
    props.email || faker.internet.email(),
    faker.internet.password()
  )) as { user: GenesisUser; token: string };

  return { user: { ...user, ...Seed.new().user(props).create() }, token };
};

export const getComponent = (
  module: ModuleComponentsTypes,
  component: string
) => {
  const Component = GlobalCore.manager.getComponent(module, component);
  expect(Component).not.toBeUndefined();

  return Component as CoreComponent;
};
