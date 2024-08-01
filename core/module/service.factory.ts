import { useState } from "react";
import { ModuleManager } from "./module.manager";
import { ServiceInterface, ServiceName } from "./services.types";

/**
 * Service factory uses Module Manager under the hook
 */

export default class Service {
    public static get <S extends ServiceName>(name: S): ServiceInterface<S> {
        const service = ModuleManager.get().components.services(name)
        if(!service) {
            throw new Error(`Service ${name} not init, have you imported in the config.json? Have you 'pnpm load' the config.json?`)
        }
        return service  as ServiceInterface<S>
    }
}

/**
 * Hook 
 */
export const useService = <S extends ServiceName>(serviceName: S): ServiceInterface<S> => {
    const [service] = useState(Service.get(serviceName))
    return service;
}