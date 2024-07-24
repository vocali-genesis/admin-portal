import { ServiceInterface, ServiceName } from "./services.types";

export type MenuItem<T = object> = {
  label: string;
  url: string;
  icon: string;
  extra: T;
  order: number;
};

export type CoreComponent = () => React.ReactNode;

 
export interface ModuleSubscriber {
  auth: (key: string, component: CoreComponent) => void;
  app: (key: string, component: CoreComponent) => void;
  settings: (key: string, component: CoreComponent) => void;
  menu: (key: string, item: MenuItem) => void;
  menuSettings: (key: string, item: MenuItem) => void;
  service:  <T extends ServiceName> (serviceName: T, service: ServiceInterface<T>)  => void
}

export type CoreGlobal = {
  manager: ModuleSubscriber;
};

export const GlobalCore = globalThis as unknown as CoreGlobal;
