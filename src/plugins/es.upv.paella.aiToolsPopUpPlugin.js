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
