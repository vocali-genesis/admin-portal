import type {
  CoreComponent,
  CoreGlobal,
  MenuItem,
  ModuleSubscriber,
} from "./module.types";

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
  private settings: Record<string, CoreComponent> = {};
  private menu: Record<string, MenuItem> = {};
  private menuSettings: Record<string, MenuItem> = {};

  public get subscribe(): ModuleSubscriber {
    return {
      auth: (key: string, component: CoreComponent) => {
        this.auth[key] = component;
      },
      app: (key: string, component: CoreComponent) => {
        this.app[key] = component;
      },
      settings: (key: string, component: CoreComponent) => {
        this.settings[key] = component;
      },
      menu: (key: string, item: MenuItem) => {
        this.menu[key] = item;
      },
      menuSettings: (key: string, item: MenuItem) => {
        this.menuSettings[key] = item;
      },
    };
  }

  public get components() {
    return {
      auth: <T extends CoreComponent>(key: string) => this.auth[key] as T,
      app: <T extends CoreComponent>(key: string) => this.app[key] as T,
      settings: <T extends CoreComponent>(key: string) =>
        this.settings[key] as T,
      menu: (key: string) => this.menu[key],
      menuSettings: (key: string) => this.menuSettings[key],
    };
  }
}

(globalThis as unknown as CoreGlobal).manager = ModuleManager.get().subscribe;
