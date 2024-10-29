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
        
        this.player.data.read("aitools", "summary").then((data) => { this.summary = data; });
        this.player.data.read("aitools", "faq").then((data) => { this.faq = data; });
        this.player.data.read("aitools", "study_plan").then((data) => { this.study_plan = data; });
        this.player.data.read("aitools", "timeline").then((data) => { this.timeline = data; });
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
