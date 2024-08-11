import { useState } from "react";
import { ModuleManager } from "./module.manager";
import { ServiceInterface, ServiceName } from "./services.types";
import MessageHandler from "@/core/message-handler";
/**
 * Service factory uses Module Manager under the hook
 */

const messageHandler = MessageHandler.get();

export default class Service {
  /**
   * Will return the service or undefined of not registered
   */
  public static get<S extends ServiceName>(
    name: S
  ): ServiceInterface<S> | undefined {
    const service = ModuleManager.get().components.services(name);

    return service as ServiceInterface<S> | undefined;
  }

  /**
   * Will return the service or throw an exception if not registered
   */
  public static require<S extends ServiceName>(name: S): ServiceInterface<S> {
    const service = ModuleManager.get().components.services(name);
    if (!service) {
      throw new Error(
        `Service ${name} not init, have you imported in the config.json? Have you 'pnpm load' the config.json?`
      );
    }
    return service as ServiceInterface<S>;
  }
}

/**
 * Hook that calls `Service.required` under the hook
 */
export const useService = <S extends ServiceName>(
  serviceName: S
): ServiceInterface<S> => {
  const [service] = useState(Service.require(serviceName));

  return service;
};
