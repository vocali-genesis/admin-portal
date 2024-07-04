export class ModuleManager {

    private app : Array<string, () => any> = []
    private settings : Array<string, () => any> = []
    private menu : Array<string, {label, url}> = []
    private settingsMenu : Array<string, {label, url}> = []


    public subscribeApp(key, component) {
        this.app[key] =component
    }

    

}

(globalThis  as ModuleManagerInterface).module = new ModuleManager();