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
  private menu: MenuItem[] = [];
  private menuSettings: MenuItem[] = [];

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
      menu: (item: MenuItem) => {
        this.menu.push(item)
      },
      menuSettings: (item: MenuItem) => {
        this.menuSettings.push(item)
      },
    };
  }

  public get components() {
    return {
      auth: <T extends CoreComponent>(key: string) => this.auth[key] as T,
      app: <T extends CoreComponent>(key: string) => this.app[key] as T,
      defaultApp: () => Object.keys(this.app)[0] as string,
      settings: <T extends CoreComponent>(key: string) =>
        this.settings[key] as T,
      defaultSettings: () => Object.keys(this.settings)[0] as string,

      menus:[... this.menu].sort(( a, b)  => a.order - b.order),
      menuSettings: [...this.menuSettings].sort(( a, b)  => a.order - b.order),
    };
  }
}

(globalThis as unknown as CoreGlobal).manager = ModuleManager.get().subscribe;
