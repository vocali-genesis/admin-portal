import { ComponentName, ServiceInterface, ServiceName } from "./services.types";
import { IconType } from "react-icons";

export type MenuItem<T = object> = {
  label: string;
  url: string;
  icon: string | IconType;
  extra?: T;
  // TODO: Maybe refactor to be set on the config json on the order we put the modules
  order: number;
};

export type CoreComponent = () => React.ReactNode;

export type ModuleComponentsTypes = "app" | "auth" | "settings" | "service";
export interface ModuleSubscriber {
  auth: (key: string, component: CoreComponent) => void;
  app: (
    key: string,
    component: CoreComponent,
    options?: { default?: boolean }
  ) => void;
  langs: (module: ComponentName, langs: Record<string, object>) => void;
  settings: (key: string, component: CoreComponent) => void;
  menu: (item: MenuItem) => void;
  menuSettings: (item: MenuItem) => void;
  service: <T extends ServiceName>(
    serviceName: T,
    service: ServiceInterface<T>
  ) => void;
  // For Testing
  getComponent<T extends ModuleComponentsTypes>(
    type: T,
    name: T extends "service" ? ServiceName : string
  ): T extends "service"
    ? ServiceInterface<ServiceName> | undefined
    : CoreComponent | undefined;
}

export type CoreGlobal = {
  manager: ModuleSubscriber;
};

export const GlobalCore = globalThis as unknown as CoreGlobal;
