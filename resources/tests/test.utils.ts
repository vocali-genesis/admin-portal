import { AuthService } from "@/core/module/services.types";
import { faker } from "@faker-js/faker";
import { Seed } from "./seed";
import { GenesisUser } from "@/core/module/core.types";
import {
  CoreComponent,
  GlobalCore,
  ModuleComponentsTypes,
} from "@/core/module/module.types";
import { RouterMock } from "@/jest-setup";
import { Provider, ReactNode } from "react";

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

export const logout = async (authService: AuthService) => {
  await authService.logout();
};

export const getComponent = (
  module: ModuleComponentsTypes,
  component: string
) => {
  const Component = GlobalCore.manager.getComponent(module, component);
  expect(Component).not.toBeUndefined();

  return Component as CoreComponent;
};

export const setRouteQuery = <T>(query: T) => {
  jest.replaceProperty(RouterMock, "query", { slug: "", ...query });
};

export const mockDownload = () => {
  const appendSpy = jest.spyOn(document.body, "appendChild");
  const removeSpy = jest.spyOn(document.body, "removeChild");

  return {
    check: (fn?: (anchor: HTMLAnchorElement) => void) => {
      // Set up
      const anchor = appendSpy.mock.calls[0]?.[0] as HTMLAnchorElement;
      expect(anchor).toBeTruthy();

      // Verify
      fn?.(anchor);

      // clear
      expect(removeSpy).toHaveBeenCalledTimes(1);
      appendSpy.mockRestore();
      removeSpy.mockRestore();
    },
  };
};
