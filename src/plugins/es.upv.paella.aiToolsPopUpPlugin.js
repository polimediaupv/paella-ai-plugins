import { bindEvent, ButtonPlugin, Events } from 'paella-core';
import AIToolsModule from './AIToolsModule';
import AITools from '../js/AITools.jsx';
import ChatIcon from "../icons/chat.svg";

import { ChatWebLLM } from "@langchain/community/chat_models/webllm";
import { ChatOpenAI } from "@langchain/openai";
// import { ChatOllama } from "@langchain/ollama";

export default class AIToolsPopUpPlugin extends ButtonPlugin {
    getPluginModuleInstance() {
        return AIToolsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.aiToolsPopUpPlugin";
    }

    async isEnabled() {
        if (!(await super.isEnabled())) {
            return false;
        }

        // Try to load the data from the data plugin and enabled the plugin if the data is available
        this.summary = await this.player.data.read("aitools", "summary");
        this.faq = await this.player.data.read("aitools", "faq");
        this.study_plan = await this.player.data.read("aitools", "study_plan");
        this.timeline = await this.player.data.read("aitools", "timeline");
        this.podcast = await this.player.data.read("aitools", "podcast");
        

        this.webllmSettings = this.loadSettings();

        this.model = null;
        this.showWelcomeMessage = false;

        let data_available = this.summary?.content || this.faq?.content || this.study_plan?.content || this.timeline?.content || this.podcast?.content || this.config?.chat?.enabled;

        return data_available;
    }

    async load() {
        this.icon = this.player.getCustomPluginIcon(this.name, "chat") || ChatIcon;
                
        const buildCaptionsRAG = (captions) => {
            const formatTime = (seconds) => {
                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                const secs = seconds % 60;
                
                const formattedHours = String(hours).padStart(2, '0');
                const formattedMinutes = String(minutes).padStart(2, '0');
                const formattedSeconds = String(secs).padStart(2, '0');
                
                return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
            }

            this.captionsRAG = captions.cues.map(c => `${formatTime(c.start)}: ${c.captions.join(" ")}`).join("\n");
            this.captionsRAGNeedReload = true;
        }

        if (this.player.captionsCanvas?.captions?.length > 0) {
            buildCaptionsRAG(this.player.captionsCanvas?.captions[0])            
        }

        bindEvent(this.player, Events.CAPTIONS_CHANGED, ({captions}) => {            
            buildCaptionsRAG(captions[0])            
        });
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

    async loadModel(settings, progressCallback) {
        this.player.log.info(`Reloading ${settings.modelType}/${settings.model} model (temperature=${settings.temperature}).`);
        let model = null;

        if (settings.modelType === "webllm") {
            model = new ChatWebLLM({
                model: settings.model,
                temperature: parseFloat(settings.temperature),
                max_tokens: parseInt(settings.maxTokens),
                chatOptions: {                    
                    temperature: parseFloat(settings.temperature),
                    // context_window_size: parseInt(settings.contextWindowLength),
                    // frequency_penalty: settings.frequecyPenalty,                    
                    // presence_penalty: settings.presencePenalty,
                },
            });
            await model.initialize(progressCallback);
        }
        else if (settings.modelType === "openai") {        
            model = new ChatOpenAI({
                model: settings.model,
                configuration: {
                    baseURL: settings.openAIURL
                },
                apiKey: settings.openAIPasswd,
                temperature: parseFloat(settings.temperature),
                // max_tokens: settings.maxTokens,
                // frequencyPenalty: settings.frequecyPenalty,
                // presencePenalty: settings.presencePenalty            
            });
        }
                   
        this.model = model;
    }

    saveChats(chats) {
        localStorage.setItem(`${this.name}_chats`, JSON.stringify(chats));        
    }
    loadChats() {
        let savedChats = [];
        try {
            savedChats = localStorage.getItem(`${this.name}_chats`);
            savedChats = JSON.parse(savedChats);
        } catch (e) { savedChats = [] }
        return savedChats ?? [];
    }

    saveSettings(settings) {
        localStorage.setItem(`${this.name}_settings`, JSON.stringify(settings));
        this.model = null;
    }
    loadSettings() {
        // TODO: Load default settings from config
        const defaultSettings = {
            modelType: "webllm",
            model: "Qwen2.5-3B-Instruct-q4f16_1-MLC", //"Phi-3-mini-4k-instruct-q4f16_1-MLC", //Llama-3.1-8B-Instruct-q4f32_1-MLC", "Qwen2.5-3B-Instruct-q4f16_1-MLC"
            openAIBaseURL: "https://api.openai.com/v1",
            openAIPasswd: "",
            contextWindowLength: "1K",
            temperature: 1.0,
            maxTokens: 4000,
            frequecyPenalty: 0.0,
            presencePenalty: 0.0,

            systemPrompt: "You are a helpful assistant that can answer questions about the course content. You can also provide guidance on how to solve problems and help me understand the concepts better."
        }
        let savedSettings = {};
        try {
            savedSettings = localStorage.getItem(`${this.name}_settings`);
            savedSettings = JSON.parse(savedSettings);
        } catch (e) { 
            savedSettings = defaultSettings;
        }

        return savedSettings ?? defaultSettings;
    }

}
