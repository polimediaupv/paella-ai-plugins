import { PluginModule } from "paella-core";
import packageData from "../../package.json";

let g_pluginModule = null;

export default class AIToolsModule extends PluginModule {
    static Get() {
        if (!g_pluginModule) {
            g_pluginModule = new AIToolsModule();
        }
        return g_pluginModule;
    }

    get moduleName() {
        return "paella-llm-chat";
    }

    get moduleVersion() {
        return packageData.version;
    }
}