import { ButtonPlugin } from 'paella-core';
import AIToolsModule from './AIToolsModule';
import AITools from '../js/AITools.jsx';
import ChatIcon from "../icons/chat.svg";

export default class AIToolsPopUpPlugin extends ButtonPlugin {
    getPluginModuleInstance() {
        return AIToolsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.aiToolsPopUpPlugin";
    }

    async isEnabled() {
        console.log("isEnabled")
        if (!(await super.isEnabled())) {
            return false;
        }

        // Try to load the data from the data plugin and enabled the plugin if the data is available
        this.summary = await this.player.data.read("aitools", "summary");
        this.faq = await this.player.data.read("aitools", "faq");
        this.study_plan = await this.player.data.read("aitools", "study_plan");
        this.timeline = await this.player.data.read("aitools", "summary");
        this.podcast = await this.player.data.read("aitools", "podcast");
        

        let data_available = this.summary?.content || this.faq?.content || this.study_plan?.content || this.timeline?.content || this.podcast?.content || this.config?.chat?.enabled;

        return data_available;
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name, "chat") || ChatIcon;
    }

    async action() {
        const aiTools = AITools.Get(document.body, this);
        if (aiTools.visible) {
            aiTools.hide();
        }
        else {
            aiTools.show();
        }
    }
}
