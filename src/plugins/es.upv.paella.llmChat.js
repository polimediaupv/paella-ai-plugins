import { ButtonPlugin } from 'paella-core';
import LLMChatModule from './LLMChatModule';
import setupChat from '../js/AITools.jsx';
import ChatIcon from "../icons/chat.svg";

export default class LLMChatPlugin extends ButtonPlugin {
    getPluginModuleInstance() {
        return LLMChatModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.llmChat";
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name, "chat") || ChatIcon;
    }

    async action() {
        if (!this._chat) {
            this._chat = setupChat(document.body, this);
            setTimeout(() => this._chat.show(), 50);
        }
        else if (this._chat.visible) {
            this._chat.hide();
        }
        else {
            this._chat.show();
        }
    }
}
