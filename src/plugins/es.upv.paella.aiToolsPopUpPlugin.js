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

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name, "chat") || ChatIcon;
        
        this.player.data.read("aitools", "summary").then((data) => { this.summary = data?.content; });
        this.player.data.read("aitools", "faq").then((data) => { this.faq = data?.content; });
        this.player.data.read("aitools", "study_plan").then((data) => { this.study_plan = data?.content; });
        this.player.data.read("aitools", "timeline").then((data) => { this.timeline = data?.content; });
        this.player.data.read("aitools", "podcast").then((data) => { this.podcast = data; });
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
