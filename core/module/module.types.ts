export type MenuItem<T = object> = {
  label: string;
  url: string;
  icon: string;
  extra: T;
  order: number;
};

export type CoreComponent = () => React.ReactNode;

export interface ModuleSubscriber {
  app: (key: string, component: CoreComponent) => void;
  settings: (key: string, component: CoreComponent) => void;
  menu: (key: string, item: MenuItem) => void;
  menuSettings: (key: string, item: MenuItem) => void;
}

export type CoreGlobal = {
  manager: ModuleSubscriber;
};

export const GlobalCore = globalThis as unknown as CoreGlobal;
