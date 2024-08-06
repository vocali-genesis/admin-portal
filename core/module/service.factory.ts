import { useState } from "react";
import { ModuleManager } from "./module.manager";
import { ServiceInterface, ServiceName } from "./services.types";
import MessageHandler from "@/core/message-handler";
/**
 * Service factory uses Module Manager under the hook
 */

const messageHandler = MessageHandler.get();

export default class Service {
  public static get<S extends ServiceName>(
    name: S,
  ): ServiceInterface<S> | undefined {
    const service = ModuleManager.get().components.services(name);
    if (!service) {
      throw new Error(
        `Service ${name} not init, have you imported in the config.json? Have you 'pnpm load' the config.json?`,
      );
    }
    return service as ServiceInterface<S>;
  }
}

/**
 * Hook
 */
export const useService = <S extends ServiceName>(
  serviceName: S,
): ServiceInterface<S> | null => {
  const [service] = useState(Service.get(serviceName));
  if (service) {
    return service;
  } else {
    return messageHandler.handleError(
      `Service ${serviceName} not init, have you imported in the config.json? Have you 'pnpm load' the config.json?`,
    );
  }
};
