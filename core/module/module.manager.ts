import type {
  CoreComponent,
  CoreGlobal,
  MenuItem,
  ModuleSubscriber,
} from "./module.types";
import { ComponentName, ServiceInterface, ServiceName } from "./services.types";

export class ModuleManager {
  private static instance: ModuleManager;
  private constructor() {}

  public static get() {
    if (!this.instance) {
      this.instance = new ModuleManager();
    }
    return this.instance;
  }

  private auth: Record<string, CoreComponent> = {};
  private app: Record<string, CoreComponent> = {};
  private defaultApp: string = "";
  private settings: Record<string, CoreComponent> = {};
  private menu: MenuItem[] = [];
  private menuSettings: MenuItem[] = [];
  private langs: Record<ComponentName, Record<string, object>> = {} as Record<
    ComponentName,
    Record<string, object>
  >; // Name of the modules to lang object
  private services: Record<
    ServiceName,
    ServiceInterface<ServiceName> | undefined
  > = {} as Record<ServiceName, undefined>;

  public get subscribe(): ModuleSubscriber {
    return {
      auth: (key: string, component: CoreComponent) => {
        this.auth[key] = component;
      },
      app: (
        key: string,
        component: CoreComponent,
        options: { default?: boolean } = {}
      ) => {
        this.app[key] = component;
        if (options.default) {
          this.defaultApp = key;
        }
      },
      settings: (key: string, component: CoreComponent) => {
        this.settings[key] = component;
      },
      menu: (item: MenuItem) => {
        this.menu.push(item);
      },
      menuSettings: (item: MenuItem) => {
        this.menuSettings.push(item);
      },
      service: <T extends ServiceName>(
        serviceName: T,
        service: ServiceInterface<T>
      ) => {
        this.services[serviceName] = service;
      },
      langs: (module: ComponentName, langs: Record<string, object>) => {
        if (!!this.langs[module]) {
          throw new Error(`Transation for module ${module} is already loaded`);
        }
        this.langs[module] = langs;
      },
      getComponent: <
        T extends "app" | "auth" | "settings" | "service",
        N extends T extends "service" ? ServiceName : never
      >(
        type: T,
        name: T extends "service" ? N : string
      ): T extends "service"
        ? ServiceInterface<N> | undefined
        : CoreComponent | undefined => {
        if (type === "service") {
          return this.services[name as N] as T extends "service"
            ? ServiceInterface<N> | undefined
            : never;
        }
        if (type === "app") {
          return this.app[name] as T extends "service" ? never : CoreComponent;
        }
        if (type === "auth") {
          return this.auth[name] as T extends "service" ? never : CoreComponent;
        }
        if (type === "settings") {
          return this.settings[name] as T extends "service"
            ? never
            : CoreComponent;
        }

        return undefined;
      },
    };
  }

  public get components() {
    return {
      auth: <T extends CoreComponent>(key: string) => this.auth[key] as T,
      app: <T extends CoreComponent>(key: string) => this.app[key] as T,
      defaultApp: () => this.defaultApp,
      settings: <T extends CoreComponent>(key: string) =>
        this.settings[key] as T,
      defaultSettings: () => Object.keys(this.settings)[0] as string,
      services: (name: ServiceName) => this.services[name],
      menus: [...this.menu].sort((a, b) => a.order - b.order),
      menuSettings: [...this.menuSettings].sort((a, b) => a.order - b.order),
      langs: Object.values(this.langs),
    };
  }
}

(globalThis as unknown as CoreGlobal).manager = ModuleManager.get().subscribe;
